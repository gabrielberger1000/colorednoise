# colorednoise-engine

Programmable colored noise synthesis for the browser. White, pink, brown, blue
and violet noise generated sample by sample in an AudioWorklet — nothing is
fetched, decoded or looped, so the output never repeats and there is no seam.

This is the engine behind [colorednoise.app](https://colorednoise.app).

```bash
npm install colorednoise-engine
```

## Play

```js
import { AudioEngine, defaultSettings } from 'colorednoise-engine';

const engine = new AudioEngine();
await engine.init();                          // AudioContext + worklet

engine.applyGlobalSettings(defaultSettings);  // required before voice settings
engine.applyVoiceSettings(0, { color: 4, volume: 0.8, pan: 0 });
engine.setVolume(0.8);
engine.start();
```

`color` is a continuous axis, not an enum: `0` violet, `1` blue, `2` white,
`3` pink, `4` brown, and anything between interpolates its two neighbours.
`3.5` is a pink-brown halfway house.

## Layer

Four voices, each with its own color, volume, pan and ADSR envelope. Voice 0 is
always on; enable the others explicitly. Give them different loop durations and
they drift in and out of phase instead of pulsing together:

```js
engine.applyGlobalSettings(defaultSettings);
engine.applyVoiceSettings(0, { color: 3.8, volume: 0.7, pan: -0.3, attack: 3, release: 4, duration: 5, loop: true });

await engine.enableVoice(1);                  // voices 1-3 are off by default
engine.applyVoiceSettings(1, { color: 4, volume: 0.5, pan: 0.4, attack: 4, release: 5, duration: 7, loop: true });

engine.start();
```

A voice takes `color`, `color2`, `colorBlend`, `volume`, `pan`, `attack`,
`decay`, `sustain`, `release`, `duration` and `loop`. Global settings add
`grey` (perceptual EQ), `pulse` and `pulseShape`, `dist`, `saturation`,
`bitDepth`, `sampleRateReduction`, `reverbMix` and `reverbSize`.

## Render to WAV

Offline rendering rebuilds the same graph inside an `OfflineAudioContext`, so
an export sounds like what you were listening to.

```js
import { renderAudio, audioBufferToWav, WORKLET_PATH, defaultSettings } from 'colorednoise-engine';

const sampleRate = 44100;
const seconds = 30;
const ctx = new OfflineAudioContext(2, sampleRate * seconds, sampleRate);
await ctx.audioWorklet.addModule(WORKLET_PATH);

const buffer = await renderAudio(ctx, seconds, {
    settings: defaultSettings,
    voices: [{ color: 3, volume: 0.8, pan: 0, attack: 0.5, duration: seconds, enabled: true }],
    volume: 0.8
});

const blob = audioBufferToWav(buffer);   // 16-bit stereo WAV
```

`renderAudio` takes its inputs as arguments rather than reading them from
anywhere, so it has no dependency on the engine instance or on a page.

## Compositions

A composition is plain JSON: named voices holding sequences of timed events,
plus global effect changes over time. Repeat blocks nest.

```js
import { validateComposition, buildCompositionSchedule } from 'colorednoise-engine';

const comp = {
    voices: {
        bass: [{ color: 4, volume: 0.7, attack: 2, duration: 8, release: 2 }]
    },
    global: []
};

const { valid, error } = validateComposition(comp);
if (valid) {
    const schedule = buildCompositionSchedule(comp);   // flat, timed events
}
```

`validateComposition` returns `{ valid, error }` rather than throwing, so it is
safe to run against user input on every keystroke. The full format is
documented at [colorednoise.app/docs](https://colorednoise.app/docs).

## Presets

```js
import { builtInPresets, categories } from 'colorednoise-engine';
```

71 of them across sleep, focus, nature, ambient, mechanical, experimental and
textured, including multi-voice polyrhythmic ones. Each is a plain object you
can pass straight to `applyGlobalSettings` and `applyVoiceSettings`.

## Bundlers

The worklet is referenced as `new URL('./noise-processor.js', import.meta.url)`,
which Vite, Rollup and webpack 5 resolve to an emitted asset with no
configuration. Without a bundler, serve `src/noise-processor.js` yourself and
pass its URL to `ctx.audioWorklet.addModule()`.

## Requirements

Any browser with AudioWorklet — Chrome 66+, Firefox 76+, Safari 14.1+. There is
no Node build: this synthesizes through the Web Audio API and needs a browser
or a headless one.

## License

MIT
