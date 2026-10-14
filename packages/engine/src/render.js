/**
 * Offline rendering and WAV encoding.
 *
 * `renderAudio` builds the same signal chain as the live engine inside an
 * OfflineAudioContext, so an export sounds like what you were listening to.
 * The caller supplies the settings rather than the module reading them from
 * anywhere, which is what makes this usable outside the site.
 */

export async function renderAudio(ctx, duration, { settings, voices, volume }) {

    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);

    // Create grey EQ
    const greyLow = ctx.createBiquadFilter();
    greyLow.type = 'lowshelf';
    greyLow.frequency.value = 100;
    greyLow.gain.value = settings.grey ? 10 : 0;

    const greyHigh = ctx.createBiquadFilter();
    greyHigh.type = 'highshelf';
    greyHigh.frequency.value = 6000;
    greyHigh.gain.value = settings.grey ? 5 : 0;

    greyLow.connect(greyHigh);
    greyHigh.connect(masterGain);

    // Create voices
    for (let i = 0; i < 4; i++) {
        const v = voices[i];
        if (i > 0 && !v.enabled) continue;

        await renderVoice(ctx, v, duration, greyLow, settings);
    }

    // Render
    return await ctx.startRendering();
}

export async function renderVoice(ctx, v, duration, destination, globalSettings) {
    // Create noise node
    const noiseNode = new AudioWorkletNode(ctx, 'noise-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2]
    });
    
    // Set color
    const colorParam = noiseNode.parameters.get('color');
    if (colorParam) colorParam.setValueAtTime(v.color, 0);
    
    // Apply global settings to worklet
    const texParam = noiseNode.parameters.get('texture');
    if (texParam) texParam.setValueAtTime(globalSettings.dist || 0, 0);
    
    const bitDepthParam = noiseNode.parameters.get('bitDepth');
    if (bitDepthParam) bitDepthParam.setValueAtTime(globalSettings.bitDepth || 16, 0);
    
    const srrParam = noiseNode.parameters.get('sampleRateReduction');
    if (srrParam) srrParam.setValueAtTime(globalSettings.sampleRateReduction || 1, 0);
    
    // Envelope
    const envelope = ctx.createGain();
    envelope.gain.value = 0;
    
    // Volume
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = v.volume;
    
    // Pan
    const panner = ctx.createStereoPanner();
    panner.pan.value = v.pan;
    
    // Connect
    noiseNode.connect(envelope);
    envelope.connect(voiceGain);
    voiceGain.connect(panner);
    panner.connect(destination);
    
    // Schedule envelope(s)
    const attack = v.attack || 0.5;
    const decay = v.decay || 0;
    const sustain = v.sustain ?? 1;
    const release = v.release || 0.5;
    const voiceDuration = v.duration || 2;
    const loop = v.loop;
    
    if (loop && voiceDuration > 0) {
        // Schedule repeating envelopes
        const cycleTime = attack + decay + voiceDuration + release;
        let time = 0;
        
        while (time < duration) {
            // Attack
            envelope.gain.setValueAtTime(0, time);
            envelope.gain.linearRampToValueAtTime(1, time + attack);
            
            // Decay
            if (decay > 0) {
                envelope.gain.linearRampToValueAtTime(sustain, time + attack + decay);
            } else {
                envelope.gain.setValueAtTime(sustain, time + attack);
            }
            
            // Release
            const releaseStart = time + attack + decay + voiceDuration;
            envelope.gain.setValueAtTime(sustain, releaseStart);
            envelope.gain.linearRampToValueAtTime(0, releaseStart + release);
            
            time += cycleTime;
        }
    } else {
        // Single envelope - fade in and sustain
        envelope.gain.setValueAtTime(0, 0);
        envelope.gain.linearRampToValueAtTime(1, attack);
        if (decay > 0) {
            envelope.gain.linearRampToValueAtTime(sustain, attack + decay);
        }
    }
}

export function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;
    
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Write samples
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
            const sample = Math.max(-1, Math.min(1, channels[ch][i]));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
