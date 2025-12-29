/**
 * AudioEngine - Core audio processing for Colored Noise
 * 
 * Handles:
 * - AudioContext and worklet initialization
 * - Noise generation via AudioWorklet
 * - Filter chains (grey EQ, resonant, comb)
 * - Pulse/LFO modulation
 * - ADSR envelope control
 * - Volume and mixing
 */

export class AudioEngine {
    constructor() {
        // Audio context and nodes
        this.ctx = null;
        this.noiseNode = null;
        this.gainNode = null;
        this.analyser = null;
        
        // Pulse/LFO
        this.pulseOsc = null;
        this.pulseGain = null;
        this.depthNode = null;
        
        // Grey noise EQ
        this.greyLow = null;
        this.greyHigh = null;
        
        // Texture filters
        this.resonantFilters = [];
        this.resonantGains = [];
        this.combDelay = null;
        this.combFeedback = null;
        this.combMix = null;
        this.dryGain = null;
        this.wetMix = null;
        
        // State
        this.initialized = false;
        this.isPlaying = false;
        this.currentSettings = null;
        
        // ADSR state
        this.envelopeGain = null;
        this.adsrTimeout = null;
    }
    
    /**
     * Initialize the audio context and all nodes
     */
    async init() {
        if (this.initialized) return;
        
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load the noise processor worklet
        await this.ctx.audioWorklet.addModule('worklet/noise-processor.js');
        
        // Create noise source
        this.noiseNode = new AudioWorkletNode(this.ctx, 'noise-processor', {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2]
        });
        
        // Grey noise EQ filters
        this.greyLow = this.ctx.createBiquadFilter();
        this.greyLow.type = "lowshelf";
        this.greyLow.frequency.value = 100;
        this.greyLow.gain.value = 0;
        
        this.greyHigh = this.ctx.createBiquadFilter();
        this.greyHigh.type = "highshelf";
        this.greyHigh.frequency.value = 6000;
        this.greyHigh.gain.value = 0;
        
        // Resonant bandpass filters (3 parallel)
        this.resonantFilters = [];
        this.resonantGains = [];
        for (let i = 0; i < 3; i++) {
            const filter = this.ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.value = 200 * (i + 1);
            filter.Q.value = 1;
            this.resonantFilters.push(filter);
            
            const gain = this.ctx.createGain();
            gain.gain.value = 0;
            this.resonantGains.push(gain);
        }
        
        // Comb filter (delay + feedback)
        this.combDelay = this.ctx.createDelay(0.1);
        this.combDelay.delayTime.value = 0.005;
        this.combFeedback = this.ctx.createGain();
        this.combFeedback.gain.value = 0;
        this.combMix = this.ctx.createGain();
        this.combMix.gain.value = 0;
        
        // Comb feedback loop
        this.combDelay.connect(this.combFeedback);
        this.combFeedback.connect(this.combDelay);
        
        // Pulse/LFO
        this.pulseGain = this.ctx.createGain();
        this.pulseGain.gain.value = 1;
        
        this.pulseOsc = this.ctx.createOscillator();
        this.pulseOsc.type = 'sine';
        this.pulseOsc.frequency.value = 0.2;
        this.pulseOsc.start();
        
        this.depthNode = this.ctx.createGain();
        this.depthNode.gain.value = 0;
        
        this.pulseOsc.connect(this.depthNode);
        this.depthNode.connect(this.pulseGain.gain);
        
        // Analyser for visualization
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;
        
        // Dry/wet mixing
        this.dryGain = this.ctx.createGain();
        this.dryGain.gain.value = 1;
        
        this.wetMix = this.ctx.createGain();
        this.wetMix.gain.value = 0;
        
        // ADSR envelope gain
        this.envelopeGain = this.ctx.createGain();
        this.envelopeGain.gain.value = 0;
        
        // Master gain
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0.5;
        
        // === ROUTING ===
        // Noise -> Pulse modulation
        this.noiseNode.connect(this.pulseGain);
        
        // Dry path
        this.pulseGain.connect(this.dryGain);
        
        // Resonant filter paths (parallel)
        for (let i = 0; i < 3; i++) {
            this.pulseGain.connect(this.resonantFilters[i]);
            this.resonantFilters[i].connect(this.resonantGains[i]);
            this.resonantGains[i].connect(this.wetMix);
        }
        
        // Comb filter path
        this.pulseGain.connect(this.combDelay);
        this.combDelay.connect(this.combMix);
        this.combMix.connect(this.wetMix);
        
        // Mix -> Grey EQ -> Envelope -> Analyser -> Master -> Output
        this.dryGain.connect(this.greyLow);
        this.wetMix.connect(this.greyLow);
        this.greyLow.connect(this.greyHigh);
        this.greyHigh.connect(this.envelopeGain);
        this.envelopeGain.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        
        this.initialized = true;
    }
    
    /**
     * Apply settings to all audio parameters
     */
    applySettings(settings, instant = false) {
        if (!this.initialized) return;
        
        this.currentSettings = settings;
        const now = this.ctx.currentTime;
        const tc = instant ? 0 : 0.15; // time constant for smoothing
        
        // Noise color
        const colorParam = this.noiseNode.parameters.get('color');
        if (instant) {
            colorParam.setValueAtTime(settings.alpha, now);
        } else {
            colorParam.setTargetAtTime(settings.alpha, now, tc);
        }
        
        // Texture
        const texParam = this.noiseNode.parameters.get('texture');
        texParam.setValueAtTime(settings.dist, now);
        
        // Pulse/LFO
        if (settings.pulse > 0) {
            this.pulseOsc.type = settings.pulseShape || 'sine';
            this.pulseOsc.frequency.setValueAtTime(settings.pulse, now);
            this.depthNode.gain.setTargetAtTime(0.3, now, tc);
            this.pulseGain.gain.setTargetAtTime(0.7, now, tc);
        } else {
            this.depthNode.gain.setTargetAtTime(0, now, tc);
            this.pulseGain.gain.setTargetAtTime(1, now, tc);
        }
        
        // Grey noise EQ
        const gGain = settings.grey ? 10 : 0;
        if (instant) {
            this.greyLow.gain.setValueAtTime(gGain, now);
            this.greyHigh.gain.setValueAtTime(gGain / 2, now);
        } else {
            this.greyLow.gain.setTargetAtTime(gGain, now, tc);
            this.greyHigh.gain.setTargetAtTime(gGain / 2, now, tc);
        }
        
        // Resonant filters
        if (settings.resonant && settings.resonant.enabled) {
            const r = settings.resonant;
            for (let i = 0; i < 3; i++) {
                const freq = r.frequencies[i] || (200 * (i + 1));
                const q = r.q || 10;
                const mix = r.mix || 0.5;
                
                if (instant) {
                    this.resonantFilters[i].frequency.setValueAtTime(freq, now);
                    this.resonantFilters[i].Q.setValueAtTime(q, now);
                    this.resonantGains[i].gain.setValueAtTime(mix / 3, now);
                } else {
                    this.resonantFilters[i].frequency.setTargetAtTime(freq, now, tc);
                    this.resonantFilters[i].Q.setTargetAtTime(q, now, tc);
                    this.resonantGains[i].gain.setTargetAtTime(mix / 3, now, tc);
                }
            }
            this.dryGain.gain.setTargetAtTime(1 - (r.mix * 0.5), now, tc);
        } else {
            for (let i = 0; i < 3; i++) {
                this.resonantGains[i].gain.setTargetAtTime(0, now, tc);
            }
            this.dryGain.gain.setTargetAtTime(1, now, tc);
        }
        
        // Comb filter
        if (settings.comb && settings.comb.enabled) {
            const c = settings.comb;
            if (instant) {
                this.combDelay.delayTime.setValueAtTime(c.delay || 0.005, now);
                this.combFeedback.gain.setValueAtTime(c.feedback || 0.7, now);
                this.combMix.gain.setValueAtTime(c.mix || 0.3, now);
            } else {
                this.combDelay.delayTime.setTargetAtTime(c.delay || 0.005, now, tc);
                this.combFeedback.gain.setTargetAtTime(c.feedback || 0.7, now, tc);
                this.combMix.gain.setTargetAtTime(c.mix || 0.3, now, tc);
            }
        } else {
            this.combFeedback.gain.setTargetAtTime(0, now, tc);
            this.combMix.gain.setTargetAtTime(0, now, tc);
        }
    }
    
    /**
     * Set master volume (0-1)
     */
    setVolume(value) {
        if (!this.initialized) return;
        this.gainNode.gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);
    }
    
    /**
     * Start playing with ADSR envelope
     * @param {Object} adsr - { attack, decay, sustain, release } in seconds, sustain is 0-1
     */
    start(adsr = { attack: 0.1, decay: 0, sustain: 1, release: 0.1 }) {
        if (!this.initialized) return;
        
        // Resume context if suspended (browser autoplay policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        // Clear any pending release
        if (this.adsrTimeout) {
            clearTimeout(this.adsrTimeout);
            this.adsrTimeout = null;
        }
        
        const now = this.ctx.currentTime;
        const env = this.envelopeGain.gain;
        
        // Cancel any scheduled changes
        env.cancelScheduledValues(now);
        env.setValueAtTime(env.value, now);
        
        // Attack: ramp to 1
        env.linearRampToValueAtTime(1, now + adsr.attack);
        
        // Decay: ramp to sustain level
        if (adsr.decay > 0) {
            env.linearRampToValueAtTime(adsr.sustain, now + adsr.attack + adsr.decay);
        }
        
        this.isPlaying = true;
    }
    
    /**
     * Stop playing with release envelope
     * @param {number} release - Release time in seconds
     * @param {Function} onComplete - Callback when release completes
     */
    stop(release = 0.1, onComplete = null) {
        if (!this.initialized) return;
        
        const now = this.ctx.currentTime;
        const env = this.envelopeGain.gain;
        
        // Cancel any scheduled changes and start release from current value
        env.cancelScheduledValues(now);
        env.setValueAtTime(env.value, now);
        env.linearRampToValueAtTime(0, now + release);
        
        this.isPlaying = false;
        
        // Optional callback after release completes
        if (onComplete) {
            this.adsrTimeout = setTimeout(() => {
                onComplete();
                this.adsrTimeout = null;
            }, release * 1000 + 50);
        }
    }
    
    /**
     * Immediate stop (for power off)
     */
    stopImmediate() {
        this.stop(0.05);
    }
    
    /**
     * Get analyser node for visualization
     */
    getAnalyser() {
        return this.analyser;
    }
    
    /**
     * Get frequency data for visualization
     */
    getFrequencyData() {
        if (!this.analyser) return null;
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        return data;
    }
    
    /**
     * Get waveform data for visualization
     */
    getWaveformData() {
        if (!this.analyser) return null;
        const data = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(data);
        return data;
    }
    
    /**
     * Suspend audio context (save resources when not playing)
     */
    suspend() {
        if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
        }
    }
    
    /**
     * Resume audio context
     */
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
}

// Export singleton instance
export const audioEngine = new AudioEngine();
