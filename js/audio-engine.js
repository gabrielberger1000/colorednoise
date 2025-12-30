/**
 * AudioEngine - Core audio processing for Colored Noise
 *
 * Supports up to 4 independent voices, each with:
 * - Independent noise color
 * - Independent ADSR envelope with looping
 * - Independent pan position
 * - Independent volume
 *
 * Global effects (applied to mixed output):
 * - Grey noise EQ
 * - Pulse/LFO modulation
 * - Resonant and comb filters
 * - Saturation/distortion
 * - Bitcrushing (in worklet)
 * - Reverb
 */

const MAX_VOICES = 4;
const WORKLET_PATH = 'worklet/noise-processor.js';

/**
 * Check browser compatibility for required Web Audio features
 * @returns {Object} { supported: boolean, missing: string[] }
 */
function checkBrowserCompatibility() {
    const missing = [];

    if (!window.AudioContext && !window.webkitAudioContext) {
        missing.push('Web Audio API');
    }

    if (window.AudioContext || window.webkitAudioContext) {
        const TestContext = window.AudioContext || window.webkitAudioContext;
        const testCtx = new TestContext();

        if (!testCtx.audioWorklet) {
            missing.push('AudioWorklet');
        }

        if (!testCtx.createStereoPanner) {
            missing.push('StereoPannerNode');
        }

        testCtx.close();
    }

    if (typeof OfflineAudioContext === 'undefined') {
        missing.push('OfflineAudioContext');
    }

    return {
        supported: missing.length === 0,
        missing
    };
}

/**
 * Represents a single voice with its own noise source and envelope
 */
class Voice {
    constructor(ctx, index) {
        this.ctx = ctx;
        this.index = index;
        this.enabled = index === 0; // Voice 1 always enabled
        this.initialized = false;

        // Nodes
        this.noiseNode = null;
        this.envelopeGain = null;
        this.voiceGain = null;
        this.panner = null;

        // ADSR state
        this.adsrTimeout = null;
        this.loopTimeout = null;
        this.currentADSR = null;
        this.isLooping = false;
        this.isPlaying = false;

        // Settings
        this.settings = {
            color: 3,
            volume: 0.8,
            pan: 0,
            attack: 0.5,
            decay: 0,
            sustain: 1,
            release: 0.5,
            duration: null,
            loop: false
        };
    }
    
    async init(workletReady) {
        if (this.initialized) return;
        
        // Create noise source - worklet should already be loaded
        this.noiseNode = new AudioWorkletNode(this.ctx, 'noise-processor', {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2]
        });
        
        // Envelope gain (for ADSR)
        this.envelopeGain = this.ctx.createGain();
        this.envelopeGain.gain.value = 0;
        
        // Voice volume
        this.voiceGain = this.ctx.createGain();
        this.voiceGain.gain.value = this.settings.volume;
        
        // Pan position
        this.panner = this.ctx.createStereoPanner();
        this.panner.pan.value = this.settings.pan;
        
        // Connect: noise -> envelope -> volume -> panner -> (output returned)
        this.noiseNode.connect(this.envelopeGain);
        this.envelopeGain.connect(this.voiceGain);
        this.voiceGain.connect(this.panner);
        
        this.initialized = true;
    }
    
    getOutput() {
        return this.panner;
    }
    
    applySettings(settings, globalSettings, instant = false) {
        if (!this.initialized) return;

        this.settings = { ...this.settings, ...settings };
        const now = this.ctx.currentTime;
        const tc = instant ? 0 : 0.15;
        
        // Noise color
        const colorParam = this.noiseNode.parameters.get('color');
        if (colorParam) {
            if (instant) {
                colorParam.setValueAtTime(this.settings.color, now);
            } else {
                colorParam.setTargetAtTime(this.settings.color, now, tc);
            }
        }
        
        // Apply global settings to this voice's worklet (texture, bitcrushing, color2/blend)
        if (globalSettings) {
            const texParam = this.noiseNode.parameters.get('texture');
            if (texParam) texParam.setValueAtTime(globalSettings.dist || 0, now);
            
            const color2Param = this.noiseNode.parameters.get('color2');
            const blendParam = this.noiseNode.parameters.get('colorBlend');
            if (color2Param && blendParam) {
                if (globalSettings.colorBlend && globalSettings.colorBlend > 0) {
                    color2Param.setValueAtTime(globalSettings.color2 ?? globalSettings.alpha2 ?? 3, now);
                    blendParam.setValueAtTime(globalSettings.colorBlend, now);
                } else {
                    blendParam.setValueAtTime(0, now);
                }
            }
            
            const bitDepthParam = this.noiseNode.parameters.get('bitDepth');
            const srrParam = this.noiseNode.parameters.get('sampleRateReduction');
            if (bitDepthParam && srrParam) {
                bitDepthParam.setValueAtTime(globalSettings.bitDepth || 16, now);
                srrParam.setValueAtTime(globalSettings.sampleRateReduction || 1, now);
            }
        }
        
        // Volume
        this.voiceGain.gain.setTargetAtTime(this.settings.volume, now, tc);
        
        // Pan
        this.panner.pan.setTargetAtTime(this.settings.pan, now, tc);
    }
    
    start() {
        if (!this.initialized || !this.enabled) return;

        this.clearTimers();

        const adsr = {
            attack: this.settings.attack,
            decay: this.settings.decay || 0,
            sustain: this.settings.sustain ?? 1,
            release: this.settings.release,
            duration: this.settings.duration,
            loop: this.settings.loop
        };

        this.currentADSR = adsr;
        this.isLooping = adsr.loop || false;
        
        const now = this.ctx.currentTime;
        const env = this.envelopeGain.gain;
        
        env.cancelScheduledValues(now);
        env.setValueAtTime(0, now);
        
        // Attack
        const attackEnd = now + adsr.attack;
        env.linearRampToValueAtTime(1, attackEnd);
        
        // Decay
        const decayEnd = attackEnd + (adsr.decay || 0);
        if (adsr.decay > 0) {
            env.linearRampToValueAtTime(adsr.sustain, decayEnd);
        } else {
            env.setValueAtTime(adsr.sustain, attackEnd);
        }
        
        this.isPlaying = true;
        
        // Schedule release if duration is set
        if (adsr.duration !== null && adsr.duration > 0) {
            const releaseStartTime = (adsr.attack + (adsr.decay || 0) + adsr.duration) * 1000;
            this.adsrTimeout = setTimeout(() => {
                this.triggerRelease();
            }, releaseStartTime);
        }
    }
    
    triggerRelease() {
        if (!this.initialized || !this.isPlaying) return;
        
        const adsr = this.currentADSR;
        if (!adsr) return;
        
        const now = this.ctx.currentTime;
        const env = this.envelopeGain.gain;
        
        env.cancelScheduledValues(now);
        env.setValueAtTime(env.value, now);
        env.linearRampToValueAtTime(0, now + adsr.release);
        
        const releaseMs = adsr.release * 1000 + 50;
        
        if (this.isLooping) {
            this.loopTimeout = setTimeout(() => {
                if (this.isLooping && this.isPlaying && this.enabled) {
                    this.start();
                }
            }, releaseMs);
        } else {
            this.adsrTimeout = setTimeout(() => {
                this.isPlaying = false;
            }, releaseMs);
        }
    }
    
    stop(release = 0.1) {
        if (!this.initialized) return;
        
        this.isLooping = false;
        this.clearTimers();
        
        const now = this.ctx.currentTime;
        const env = this.envelopeGain.gain;
        
        env.cancelScheduledValues(now);
        env.setValueAtTime(env.value, now);
        env.linearRampToValueAtTime(0, now + release);
        
        this.isPlaying = false;
    }
    
    clearTimers() {
        if (this.adsrTimeout) {
            clearTimeout(this.adsrTimeout);
            this.adsrTimeout = null;
        }
        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
            this.loopTimeout = null;
        }
    }
    
    setEnabled(enabled) {
        if (this.index === 0) return; // Voice 1 always enabled
        
        this.enabled = enabled;
        if (!enabled && this.isPlaying) {
            this.stop(0.05);
        }
    }
    
    destroy() {
        this.clearTimers();
        if (this.noiseNode) {
            this.noiseNode.disconnect();
            this.noiseNode = null;
        }
        if (this.envelopeGain) {
            this.envelopeGain.disconnect();
            this.envelopeGain = null;
        }
        if (this.voiceGain) {
            this.voiceGain.disconnect();
            this.voiceGain = null;
        }
        if (this.panner) {
            this.panner.disconnect();
            this.panner = null;
        }
        this.initialized = false;
    }
}

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.voices = [];
        this.voiceMerger = null; // Gain node to merge all voices

        // Global nodes (after voice merge)
        this.pulseOsc = null;
        this.pulseGain = null;
        this.depthNode = null;
        this.greyLow = null;
        this.greyHigh = null;
        this.resonantFilters = [];
        this.resonantGains = [];
        this.combDelay = null;
        this.combFeedback = null;
        this.combMix = null;
        this.dryGain = null;
        this.wetMix = null;
        this.panLFO = null;
        this.panLFOGain = null;
        this.globalPanner = null;
        this.waveshaper = null;
        this.saturationMix = null;
        this.saturationDry = null;
        this.saturationCurves = null;
        this.reverbDelays = [];
        this.reverbGains = [];
        this.reverbFeedback = null;
        this.reverbMix = null;
        this.reverbDry = null;
        this.reverbFilter = null;
        this.analyser = null;
        this.gainNode = null;
        this.postSaturation = null;

        // State
        this.initialized = false;
        this.isPlaying = false;
        this.currentSettings = null;
        this.workletReady = false;
        this.initError = null;
    }

    /**
     * Initialize the audio engine
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async init() {
        if (this.initialized) return { success: true };

        // Check browser compatibility first
        const compat = checkBrowserCompatibility();
        if (!compat.supported) {
            this.initError = `Browser missing: ${compat.missing.join(', ')}`;
            return { success: false, error: this.initError };
        }

        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();

            // Load worklet with error handling
            try {
                await this.ctx.audioWorklet.addModule(WORKLET_PATH);
                this.workletReady = true;
            } catch (workletError) {
                throw new Error(`Failed to load audio worklet: ${workletError.message}`);
            }

            // Initialize voice merger and voices
            this._initVoiceMerger();
            await this._initVoices();

            // Initialize global signal chain
            this._initGreyEQ();
            this._initResonantFilters();
            this._initCombFilter();
            this._initDryWetMix();
            this._initPulseLFO();
            this._initPanLFO();
            this._initSaturation();
            this._initReverb();
            this._initAnalyserAndMaster();

            // Connect the signal chain
            this._connectSignalChain();

            this.initialized = true;
            return { success: true };

        } catch (error) {
            this.initError = error.message;
            console.error('AudioEngine init failed:', error);

            // Clean up partial initialization
            if (this.ctx) {
                try {
                    await this.ctx.close();
                } catch (e) {
                    // Ignore close errors
                }
                this.ctx = null;
            }

            return { success: false, error: this.initError };
        }
    }

    _initVoiceMerger() {
        this.voiceMerger = this.ctx.createGain();
        this.voiceMerger.gain.value = 1;
    }

    async _initVoices() {
        // Create voices (but only initialize voice 1)
        for (let i = 0; i < MAX_VOICES; i++) {
            const voice = new Voice(this.ctx, i);
            this.voices.push(voice);
        }

        // Initialize voice 1 (always enabled)
        await this.voices[0].init();
        this.voices[0].getOutput().connect(this.voiceMerger);
    }

    _initGreyEQ() {
        this.greyLow = this.ctx.createBiquadFilter();
        this.greyLow.type = "lowshelf";
        this.greyLow.frequency.value = 100;
        this.greyLow.gain.value = 0;

        this.greyHigh = this.ctx.createBiquadFilter();
        this.greyHigh.type = "highshelf";
        this.greyHigh.frequency.value = 6000;
        this.greyHigh.gain.value = 0;
    }

    _initResonantFilters() {
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
    }

    _initCombFilter() {
        this.combDelay = this.ctx.createDelay(0.1);
        this.combDelay.delayTime.value = 0.005;
        this.combFeedback = this.ctx.createGain();
        this.combFeedback.gain.value = 0;
        this.combMix = this.ctx.createGain();
        this.combMix.gain.value = 0;
        this.combDelay.connect(this.combFeedback);
        this.combFeedback.connect(this.combDelay);
    }

    _initDryWetMix() {
        this.dryGain = this.ctx.createGain();
        this.dryGain.gain.value = 1;
        this.wetMix = this.ctx.createGain();
        this.wetMix.gain.value = 0;
    }

    _initPulseLFO() {
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
    }

    _initPanLFO() {
        this.globalPanner = this.ctx.createStereoPanner();
        this.globalPanner.pan.value = 0;

        this.panLFO = this.ctx.createOscillator();
        this.panLFO.type = 'sine';
        this.panLFO.frequency.value = 0.1;
        this.panLFO.start();

        this.panLFOGain = this.ctx.createGain();
        this.panLFOGain.gain.value = 0;

        this.panLFO.connect(this.panLFOGain);
        this.panLFOGain.connect(this.globalPanner.pan);
    }

    _initSaturation() {
        this.waveshaper = this.ctx.createWaveShaper();
        this.waveshaper.oversample = '2x';
        this.saturationCurves = this.createSaturationCurves();
        this.waveshaper.curve = this.saturationCurves.soft;

        this.saturationMix = this.ctx.createGain();
        this.saturationMix.gain.value = 0;
        this.saturationDry = this.ctx.createGain();
        this.saturationDry.gain.value = 1;

        this.postSaturation = this.ctx.createGain();
        this.postSaturation.gain.value = 1;
    }

    _initReverb() {
        const delayTimes = [0.029, 0.037, 0.043, 0.053, 0.067, 0.079];

        for (let i = 0; i < delayTimes.length; i++) {
            const delay = this.ctx.createDelay(0.1);
            delay.delayTime.value = delayTimes[i];
            this.reverbDelays.push(delay);

            const gain = this.ctx.createGain();
            gain.gain.value = 0.4;
            this.reverbGains.push(gain);
        }

        this.reverbFeedback = this.ctx.createGain();
        this.reverbFeedback.gain.value = 0.5;

        this.reverbFilter = this.ctx.createBiquadFilter();
        this.reverbFilter.type = 'lowpass';
        this.reverbFilter.frequency.value = 4000;

        this.reverbMix = this.ctx.createGain();
        this.reverbMix.gain.value = 0;
        this.reverbDry = this.ctx.createGain();
        this.reverbDry.gain.value = 1;
    }

    _initAnalyserAndMaster() {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;

        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0.5;
    }

    _connectSignalChain() {
        // Voice merger -> Pulse -> Dry/wet split
        this.voiceMerger.connect(this.pulseGain);
        this.pulseGain.connect(this.dryGain);

        // Resonant filter paths
        for (let i = 0; i < 3; i++) {
            this.pulseGain.connect(this.resonantFilters[i]);
            this.resonantFilters[i].connect(this.resonantGains[i]);
            this.resonantGains[i].connect(this.wetMix);
        }

        // Comb filter path
        this.pulseGain.connect(this.combDelay);
        this.combDelay.connect(this.combMix);
        this.combMix.connect(this.wetMix);

        // Mix -> Grey EQ
        this.dryGain.connect(this.greyLow);
        this.wetMix.connect(this.greyLow);
        this.greyLow.connect(this.greyHigh);

        // Saturation
        this.greyHigh.connect(this.saturationDry);
        this.greyHigh.connect(this.waveshaper);
        this.waveshaper.connect(this.saturationMix);
        this.saturationDry.connect(this.postSaturation);
        this.saturationMix.connect(this.postSaturation);

        // Reverb
        this.postSaturation.connect(this.reverbDry);
        for (let i = 0; i < this.reverbDelays.length; i++) {
            this.postSaturation.connect(this.reverbDelays[i]);
            this.reverbDelays[i].connect(this.reverbGains[i]);
            this.reverbGains[i].connect(this.reverbFilter);
        }
        this.reverbFilter.connect(this.reverbFeedback);
        this.reverbFeedback.connect(this.reverbDelays[0]);
        this.reverbFilter.connect(this.reverbMix);

        // Final output
        this.reverbDry.connect(this.globalPanner);
        this.reverbMix.connect(this.globalPanner);
        this.globalPanner.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
    }
    
    createSaturationCurves() {
        const samples = 44100;
        const curves = {};
        
        curves.soft = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curves.soft[i] = Math.tanh(x * 2);
        }
        
        curves.hard = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curves.hard[i] = Math.max(-0.8, Math.min(0.8, x * 1.5));
        }
        
        curves.warm = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            if (x >= 0) {
                curves.warm[i] = Math.tanh(x * 1.5);
            } else {
                curves.warm[i] = Math.tanh(x * 2);
            }
        }
        
        return curves;
    }
    
    async enableVoice(index) {
        if (index < 0 || index >= MAX_VOICES) return;
        if (index === 0) return; // Voice 1 always enabled
        
        const voice = this.voices[index];
        if (!voice.initialized) {
            await voice.init();
            voice.getOutput().connect(this.voiceMerger);
        }
        voice.setEnabled(true);
        
        // Start the voice if we're currently playing
        if (this.isPlaying) {
            voice.start();
        }
    }
    
    disableVoice(index) {
        if (index < 0 || index >= MAX_VOICES) return;
        if (index === 0) return; // Voice 1 always enabled
        
        const voice = this.voices[index];
        voice.setEnabled(false);
    }
    
    isVoiceEnabled(index) {
        if (index < 0 || index >= MAX_VOICES) return false;
        return this.voices[index].enabled;
    }
    
    getVoiceSettings(index) {
        if (index < 0 || index >= MAX_VOICES) return null;
        return { ...this.voices[index].settings };
    }
    
    applyVoiceSettings(index, settings, instant = false) {
        if (index < 0 || index >= MAX_VOICES) return;
        if (!this.initialized) return;
        
        this.voices[index].applySettings(settings, this.currentSettings, instant);
    }
    
    applyGlobalSettings(settings, instant = false) {
        if (!this.initialized) return;
        
        this.currentSettings = settings;
        const now = this.ctx.currentTime;
        const tc = instant ? 0 : 0.15;
        
        // Apply global worklet settings to all enabled voices
        for (const voice of this.voices) {
            if (voice.initialized) {
                voice.applySettings({}, settings, instant);
            }
        }
        
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
        
        // Global stereo panning LFO
        if (settings.panRate && settings.panRate > 0 && settings.panDepth && settings.panDepth > 0) {
            this.panLFO.frequency.setTargetAtTime(settings.panRate, now, tc);
            this.panLFOGain.gain.setTargetAtTime(settings.panDepth, now, tc);
        } else {
            this.panLFOGain.gain.setTargetAtTime(0, now, tc);
        }
        
        // Saturation
        if (settings.saturation && settings.saturation > 0) {
            const curveType = settings.saturationMode || 'soft';
            if (this.saturationCurves[curveType]) {
                this.waveshaper.curve = this.saturationCurves[curveType];
            }
            const wet = settings.saturation;
            const dry = 1 - (wet * 0.5);
            this.saturationMix.gain.setTargetAtTime(wet, now, tc);
            this.saturationDry.gain.setTargetAtTime(dry, now, tc);
        } else {
            this.saturationMix.gain.setTargetAtTime(0, now, tc);
            this.saturationDry.gain.setTargetAtTime(1, now, tc);
        }
        
        // Reverb
        if (settings.reverbMix && settings.reverbMix > 0) {
            const mix = settings.reverbMix;
            const size = settings.reverbSize || 'medium';
            
            let feedback, filterFreq;
            switch (size) {
                case 'small':
                    feedback = 0.2;
                    filterFreq = 6000;
                    break;
                case 'large':
                    feedback = 0.5;
                    filterFreq = 2500;
                    break;
                case 'medium':
                default:
                    feedback = 0.35;
                    filterFreq = 4000;
            }
            
            this.reverbFeedback.gain.setTargetAtTime(feedback, now, tc);
            this.reverbFilter.frequency.setTargetAtTime(filterFreq, now, tc);
            this.reverbMix.gain.setTargetAtTime(mix, now, tc);
            this.reverbDry.gain.setTargetAtTime(1 - (mix * 0.3), now, tc);
        } else {
            this.reverbMix.gain.setTargetAtTime(0, now, tc);
            this.reverbDry.gain.setTargetAtTime(1, now, tc);
        }
    }
    
    // Backward compatibility: applySettings applies to voice 1 + global
    applySettings(settings, instant = false) {
        this.applyGlobalSettings(settings, instant);
        
        // If there are voice-specific settings in the preset, apply them
        if (settings.voices && Array.isArray(settings.voices)) {
            for (let i = 0; i < settings.voices.length && i < MAX_VOICES; i++) {
                const voiceSettings = settings.voices[i];
                if (voiceSettings) {
                    if (i > 0 && voiceSettings.enabled) {
                        this.enableVoice(i);
                    } else if (i > 0) {
                        this.disableVoice(i);
                    }
                    this.applyVoiceSettings(i, voiceSettings, instant);
                }
            }
        } else {
            // Single voice mode - apply to voice 1
            // Support both 'color' and legacy 'alpha' naming
            this.applyVoiceSettings(0, {
                color: settings.color ?? settings.alpha,
                attack: settings.attack,
                decay: settings.decay,
                sustain: settings.sustain,
                release: settings.release,
                duration: settings.duration,
                loop: settings.loop,
                volume: 0.8,
                pan: 0
            }, instant);
            
            // Disable other voices
            for (let i = 1; i < MAX_VOICES; i++) {
                this.disableVoice(i);
            }
        }
    }
    
    setVolume(value) {
        if (!this.initialized) return;
        this.gainNode.gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);
    }
    
    start() {
        if (!this.initialized) return;
        
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        // Start all enabled voices
        for (const voice of this.voices) {
            if (voice.enabled && voice.initialized) {
                voice.start();
            }
        }
        
        this.isPlaying = true;
    }
    
    stop(release = 0.1, onComplete = null) {
        if (!this.initialized) return;
        
        // Stop all voices
        for (const voice of this.voices) {
            if (voice.initialized) {
                voice.stop(release);
            }
        }
        
        this.isPlaying = false;
        
        if (onComplete) {
            setTimeout(onComplete, release * 1000 + 50);
        }
    }
    
    stopImmediate() {
        this.stop(0.05);
    }
    
    suspend() {
        if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
        }
    }

    /**
     * Clean up extra voices created during composition playback.
     * Destroys any voices beyond the standard MAX_VOICES limit.
     */
    cleanupExtraVoices() {
        if (!this.initialized) return;

        while (this.voices.length > MAX_VOICES) {
            const voice = this.voices.pop();
            if (voice) {
                voice.destroy();
            }
        }

        // Reset all voices to disabled state (except voice 1)
        for (let i = 1; i < this.voices.length; i++) {
            if (this.voices[i].initialized) {
                this.voices[i].setEnabled(false);
            }
        }
    }

    getAnalyserData(dataArray) {
        if (this.analyser) {
            this.analyser.getByteFrequencyData(dataArray);
        }
    }
    
    getAnalyserWaveform(dataArray) {
        if (this.analyser) {
            this.analyser.getByteTimeDomainData(dataArray);
        }
    }
}

export { Voice, checkBrowserCompatibility, WORKLET_PATH };
export const audioEngine = new AudioEngine();
