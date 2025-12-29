# Colored Noise

A free, browser-based noise generator for sleep, focus, and relaxation.

**Live site:** [colorednoise.app](https://colorednoise.app)

## Features

- **5 noise colors:** White, pink, brown, blue, and violet noise
- **50+ presets** organized by category (Sleep, Focus, Nature, Ambient, Mechanical, Experimental, Textured)
- **Binaural beats** with adjustable frequency (1-40 Hz)
- **Customizable pulse/modulation** with sine, triangle, or square waveforms
- **Sleep timer** with automatic fade-out
- **Per-preset fade in/out** durations
- **Real-time visualizer** (spectrum bars or waveform)
- **Save custom presets** to localStorage
- **Shareable URLs** — settings are encoded in the URL
- **Keyboard shortcuts** — Space for play/pause, arrows for volume, 1-9 for presets
- **Resonant and comb filters** for textured sounds

## How It Works

The audio is generated in real-time using the Web Audio API and an AudioWorklet processor. No audio files are downloaded — the noise is synthesized mathematically:

- **White noise:** Random samples (Gaussian or uniform distribution)
- **Pink noise:** Paul Kellett's filter algorithm (-3dB/octave)
- **Brown noise:** Integrated white noise with clamping (-6dB/octave)
- **Blue noise:** Differentiated white noise (+3dB/octave)
- **Violet noise:** Differentiated blue noise (+6dB/octave)

## Files

```
index.html                  # HTML structure
favicon.svg                 # Browser tab icon
social-card.png             # Open Graph / Twitter preview image
css/
  style.css                 # All styling
js/
  main.js                   # Entry point
  audio-engine.js           # WebAudio context, filters, ADSR
  presets.js                # Preset definitions
  ui.js                     # DOM manipulation, events, visualizer
worklet/
  noise-processor.js        # AudioWorklet for noise generation
```

## Deployment

The site is a static app. To deploy:

1. Upload the entire directory to any static host (Netlify, Vercel, GitHub Pages, etc.)
2. Done

## Local Development

Serve the directory with a local web server (required for ES modules):

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
- ES Modules
- CSS Grid

Tested in Chrome, Firefox, Safari, and Edge.

## License

MIT

## Credits

Built with Claude and Gemini.