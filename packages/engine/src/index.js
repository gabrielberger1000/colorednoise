/**
 * @colorednoise/engine — programmable colored noise synthesis for the browser.
 *
 * Everything is generated sample by sample in an AudioWorklet; nothing is
 * loaded, decoded or looped. The same code powers https://colorednoise.app
 *
 *   import { AudioEngine } from '@colorednoise/engine';
 *   const engine = new AudioEngine();
 *   await engine.init();
 *   engine.setVoice(0, { color: 4, volume: 0.8 });   // 4 = brown
 *   engine.start();
 *
 * Offline rendering returns a Blob you can download or hand to an <audio>:
 *
 *   import { renderAudio, audioBufferToWav } from '@colorednoise/engine';
 *   const ctx = new OfflineAudioContext(2, 44100 * 30, 44100);
 *   await ctx.audioWorklet.addModule(WORKLET_PATH);
 *   const buffer = await renderAudio(ctx, 30, { settings, voices, volume: 0.8 });
 *   const wav = audioBufferToWav(buffer);
 */

export {
    AudioEngine,
    audioEngine,
    Voice,
    checkBrowserCompatibility,
    WORKLET_PATH
} from './audio-engine.js';

export {
    builtInPresets,
    defaultSettings,
    categories,
    loadCustomPresets,
    saveCustomPresets
} from './presets.js';

export {
    renderAudio,
    renderVoice,
    audioBufferToWav
} from './render.js';

export {
    validateComposition,
    validateEventList,
    validateVoiceEvent,
    validateGlobalEventList,
    buildCompositionSchedule,
    flattenEvents
} from './composition.js';
