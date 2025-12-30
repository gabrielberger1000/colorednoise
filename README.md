# Colored Noise

A free, browser-based noise generator for sleep, focus, and relaxation — with advanced multi-voice polyrhythm capabilities.

**Live site:** [colorednoise.app](https://colorednoise.app)

## Features

### Sound Generation
- **5 noise colors:** White, pink, brown, blue, and violet noise
- **Color layering:** Blend two noise colors together
- **Grey noise:** Perceptual EQ for a more balanced sound
- **Binaural beats** with adjustable frequency (1-40 Hz)
- **Customizable pulse/modulation** with sine, triangle, or square waveforms

### Multi-Voice System
- **4 independent voices** with separate controls
- **Per-voice settings:** Color, volume, pan, and full ADSR envelope
- **Polyrhythmic presets:** Voices with different loop timings create evolving textures
- **Stereo panning LFO** for spatial movement

### Effects
- **Reverb** with small/medium/large room sizes
- **Saturation/distortion** (soft, hard, tube modes)
- **Bitcrushing** with adjustable bit depth and sample rate reduction
- **Resonant and comb filters** for textured sounds

### Composition System
- **JSON-based composition editor** for programmatic sound design
- **Unlimited voices** in compositions
- **Repeat/loop blocks** for complex patterns
- **Live playback** or **WAV export**

### Presets & Export
- **50+ built-in presets** organized by category (Sleep, Focus, Nature, Ambient, Mechanical, Experimental, Textured)
- **Multi-voice polyrhythm presets** (Ocean Drift, Breathing Room, Machine Rhythm, etc.)
- **Save custom presets** to localStorage
- **Export to WAV** — render any duration instantly using OfflineAudioContext

### Interface
- **Sleep timer** with automatic fade-out
- **Per-preset fade in/out** durations (ADSR envelope)
- **Real-time visualizer** (spectrum bars or waveform)
- **Shareable URLs** — settings are encoded in the URL
- **Keyboard shortcuts** — Space for play/pause, arrows for volume, 1-9 for presets

## How It Works

The audio is generated in real-time using the Web Audio API and an AudioWorklet processor. No audio files are downloaded — the noise is synthesized mathematically:

- **White noise:** Random samples (Gaussian or uniform distribution)
- **Pink noise:** Paul Kellett's filter algorithm (-3dB/octave)
- **Brown noise:** Integrated white noise with clamping (-6dB/octave)
- **Blue noise:** Differentiated white noise (+3dB/octave)
- **Violet noise:** Differentiated blue noise (+6dB/octave)

## JSON Composition Format

Create complex compositions with multiple voices and timed events:

```json
{
  "voices": {
    "bass": [
      { "color": 4, "volume": 0.7, "pan": 0, "attack": 1, "decay": 0.5, "sustain": 0.6, "release": 2, "duration": 3 },
      { "wait": 1 },
      { "repeat": 2, "events": [
        { "color": 3.5, "volume": 0.6, "pan": -0.3, "attack": 0.5, "duration": 2, "release": 1 }
      ]}
    ],
    "melody": [
      { "wait": 2 },
      { "color": 2, "volume": 0.5, "pan": 0.5, "attack": 0.2, "duration": 1, "release": 0.5 }
    ]
  },
  "global": [
    { "grey": true, "reverbMix": 0.3, "reverbSize": "medium" },
    { "wait": 5 },
    { "reverbMix": 0.6, "reverbSize": "large" }
  ]
}
```

### Voice Event Properties
- `color` (0-4): Noise color (0=violet, 1=blue, 2=white, 3=pink, 4=brown)
- `volume` (0-1): Voice volume
- `pan` (-1 to 1): Stereo position
- `attack`, `decay`, `sustain`, `release`, `duration`: ADSR envelope in seconds
- `wait`: Pause before this event (seconds)

### Global Event Properties
- `grey`, `pulse`, `pulseShape`, `texture`
- `panRate`, `panDepth`, `color2`, `colorBlend`
- `saturation`, `saturationMode`, `bitDepth`, `sampleRateReduction`
- `reverbMix`, `reverbSize`

## Files

```
index.html                  # HTML structure
favicon.svg                 # Browser tab icon
social-card.png             # Open Graph / Twitter preview image
css/
  style.css                 # All styling
js/
  main.js                   # Entry point
  audio-engine.js           # WebAudio context, multi-voice system, effects
  presets.js                # Preset definitions
  ui.js                     # DOM manipulation, events, visualizer, composition system
worklet/
  noise-processor.js        # AudioWorklet for noise generation & bitcrushing
```

## Deployment

The site is a static app. To deploy:

1. Upload the entire directory to any static host (Netlify, Vercel, GitHub Pages, etc.)
2. Ensure the `worklet/` directory is included with `noise-processor.js`
3. Done

## Local Development

Serve the directory with a local web server (required for ES modules and AudioWorklet):

```bash
# Python
python -m http.server 8000

# Node
npx serve
```

Then open `http://localhost:8000`

## Browser Support

Works in all modern browsers that support:
- Web Audio API
- AudioWorklet
- OfflineAudioContext
- ES Modules
- CSS Grid

Tested in Chrome, Firefox, Safari, and Edge.

## License

MIT

## Credits

Built with Claude and Gemini.