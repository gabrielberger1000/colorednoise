#!/usr/bin/env node
/**
 * Render a long-form YouTube video (still title card + N hours of noise)
 * from one of the built-in presets, using the same algorithms as the site's
 * AudioWorklet so the video sounds like the generator.
 *
 * Requires ffmpeg and rsvg-convert on PATH.
 *
 * Usage:
 *   node scripts/render-video.js --preset "Deep Brown" --hours 8
 *   node scripts/render-video.js --preset "Heavy Rain" --minutes 1 --out video/test.mp4
 *   node scripts/render-video.js --preset "Pure White" --hours 10 --title "White Noise"
 *
 * Options:
 *   --preset <name>    Built-in preset name (required)
 *   --hours <n>        Length in hours (default 8)
 *   --minutes <n>      Length in minutes (overrides --hours; handy for tests)
 *   --title <text>     Headline on the title card (default: preset name)
 *   --subtitle <text>  Second line on the card (default derived from color)
 *   --out <path>       Output .mp4 (default video/<slug>-<hours>h.mp4)
 *   --fps <n>          Video frame rate for the still image (default 6)
 *   --audio-only       Write a .m4a instead of a video
 *   --target-rms <dB>  Loudness target in dBFS RMS (default -18). The script
 *                      renders a short calibration pass and picks a gain that
 *                      hits this level without peaks exceeding -0.5 dBFS.
 *   --gain-db <dB>     Skip calibration and apply a fixed gain instead.
 *
 * Supported preset features: color, color2/colorBlend, dist (texture),
 * grey EQ, pulse LFO (sine/triangle/square), fade-in, looping ADSR
 * envelopes, bitcrusher, multi-voice presets with pan. Reverb, saturation,
 * resonant/comb filters and auto-pan are not rendered (a warning is printed).
 */

import { spawn, execFileSync } from 'child_process';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { builtInPresets } from '../js/presets.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SAMPLE_RATE = 44100;
const VOICE_GAIN = 0.8;       // matches single-voice preset volume
const FADE_OUT_SECONDS = 15;

// ---------------------------------------------------------------- args ----
function parseArgs(argv) {
    const args = { hours: 8, fps: 6, targetRms: -18 };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        const next = () => argv[++i];
        switch (a) {
            case '--preset': args.preset = next(); break;
            case '--hours': args.hours = parseFloat(next()); break;
            case '--minutes': args.minutes = parseFloat(next()); break;
            case '--title': args.title = next(); break;
            case '--subtitle': args.subtitle = next(); break;
            case '--out': args.out = next(); break;
            case '--fps': args.fps = parseInt(next(), 10); break;
            case '--audio-only': args.audioOnly = true; break;
            case '--target-rms': args.targetRms = parseFloat(next()); break;
            case '--gain-db': args.gainDb = parseFloat(next()); break;
            default: throw new Error(`Unknown argument: ${a}`);
        }
    }
    if (!args.preset) throw new Error('--preset is required');
    return args;
}

function toSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function colorWord(c) {
    if (c <= 0.5) return 'Violet';
    if (c <= 1.5) return 'Blue';
    if (c <= 2.5) return 'White';
    if (c <= 3.5) return 'Pink';
    return 'Brown';
}

// ------------------------------------------------------------ DSP bits ----
// RBJ audio-EQ-cookbook shelving filters, shelf slope S = 1 (Web Audio's
// BiquadFilterNode lowshelf/highshelf ignore Q and behave like S = 1).
function shelf(type, freq, dbGain) {
    const A = Math.pow(10, dbGain / 40);
    const w0 = 2 * Math.PI * freq / SAMPLE_RATE;
    const cosw = Math.cos(w0), sinw = Math.sin(w0);
    const alpha = sinw / 2 * Math.sqrt((A + 1 / A) * (1 / 1 - 1) + 2);
    const sqA2a = 2 * Math.sqrt(A) * alpha;
    let b0, b1, b2, a0, a1, a2;
    if (type === 'low') {
        b0 = A * ((A + 1) - (A - 1) * cosw + sqA2a);
        b1 = 2 * A * ((A - 1) - (A + 1) * cosw);
        b2 = A * ((A + 1) - (A - 1) * cosw - sqA2a);
        a0 = (A + 1) + (A - 1) * cosw + sqA2a;
        a1 = -2 * ((A - 1) + (A + 1) * cosw);
        a2 = (A + 1) + (A - 1) * cosw - sqA2a;
    } else {
        b0 = A * ((A + 1) + (A - 1) * cosw + sqA2a);
        b1 = -2 * A * ((A - 1) + (A + 1) * cosw);
        b2 = A * ((A + 1) + (A - 1) * cosw - sqA2a);
        a0 = (A + 1) - (A - 1) * cosw + sqA2a;
        a1 = 2 * ((A - 1) - (A + 1) * cosw);
        a2 = (A + 1) - (A - 1) * cosw - sqA2a;
    }
    const c = { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
    return {
        state: [{ x1: 0, x2: 0, y1: 0, y2: 0 }, { x1: 0, x2: 0, y1: 0, y2: 0 }],
        process(ch, x) {
            const s = this.state[ch];
            const y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
            s.x2 = s.x1; s.x1 = x; s.y2 = s.y1; s.y1 = y;
            return y;
        }
    };
}

// One noise source per voice: a port of worklet/noise-processor.js.
class NoiseSource {
    constructor({ color, color2 = color, colorBlend = 0, texture = 0, bitDepth = 16, srr = 1 }) {
        this.color = color; this.color2 = color2; this.blend = colorBlend;
        this.texture = texture; this.bitDepth = bitDepth; this.srr = srr;
        this.b = [new Float64Array(7), new Float64Array(7)];
        this.brown = [0, 0]; this.lastWhite = [0, 0]; this.lastBlue = [0, 0];
        this.holdCount = [0, 0]; this.holdValue = [0, 0];
    }
    mix(alpha, white, violet, blue, pink, brown) {
        if (alpha <= 1) return (1 - alpha) * violet + alpha * blue;
        if (alpha <= 2) { const t = alpha - 1; return (1 - t) * blue + t * white; }
        if (alpha <= 3) { const t = alpha - 2; return (1 - t) * white + t * pink; }
        const t = alpha - 3; return (1 - t) * pink + t * brown;
    }
    sample(ch) {
        let white;
        if (this.texture < 0.5) {
            const u = Math.random() + Math.random() + Math.random() + Math.random();
            white = (u - 2.0) * 0.75;
        } else {
            white = Math.random() * 2 - 1;
        }
        const violet = (white - this.lastWhite[ch]) * 0.5;
        this.lastWhite[ch] = white;
        const blue = (violet + this.lastBlue[ch]) * 0.5;
        this.lastBlue[ch] = blue;

        const b = this.b[ch];
        b[0] = 0.99886 * b[0] + white * 0.0555179;
        b[1] = 0.99332 * b[1] + white * 0.0750759;
        b[2] = 0.96900 * b[2] + white * 0.1538520;
        b[3] = 0.86650 * b[3] + white * 0.3104856;
        b[4] = 0.55000 * b[4] + white * 0.5329522;
        b[5] = -0.7616 * b[5] - white * 0.0168981;
        const pink = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + white * 0.5362) * 0.11;
        b[6] = white * 0.115926;

        let brown = (this.brown[ch] + 0.02 * white) / 1.02;
        this.brown[ch] = brown;
        brown = Math.max(-1, Math.min(1, brown * 3.5));

        let s = (1 - this.blend) * this.mix(this.color, white, violet, blue, pink, brown)
              + this.blend * this.mix(this.color2, white, violet, blue, pink, brown);

        if (this.bitDepth < 16) {
            const steps = Math.pow(2, this.bitDepth - 1);
            s = Math.round(s * steps) / steps;
        }
        if (this.srr > 1) {
            this.holdCount[ch]++;
            if (this.holdCount[ch] >= this.srr) { this.holdCount[ch] = 0; this.holdValue[ch] = s; }
            s = this.holdValue[ch];
        }
        return s;
    }
}

// Envelope value at time t (seconds), mirroring renderVoice() in ui.js.
function makeEnvelope(v) {
    const attack = v.attack || 0.5;
    const decay = v.decay || 0;
    const sustain = v.sustain ?? 1;
    const release = v.release || 0.5;
    const dur = v.duration || 2;
    if (v.loop && dur > 0) {
        const cycle = attack + decay + dur + release;
        return (t) => {
            const p = t % cycle;
            if (p < attack) return p / attack;
            if (p < attack + decay) return 1 + (sustain - 1) * ((p - attack) / decay);
            if (p < attack + decay + dur) return sustain;
            return sustain * (1 - (p - attack - decay - dur) / release);
        };
    }
    return (t) => {
        if (t < attack) return t / attack;
        if (decay > 0 && t < attack + decay) return 1 + (sustain - 1) * ((t - attack) / decay);
        return decay > 0 ? sustain : 1;
    };
}

function lfo(shape, phase) { // phase in [0,1)
    switch (shape) {
        case 'square': return phase < 0.5 ? 1 : -1;
        case 'triangle': return 1 - 4 * Math.abs(phase - 0.5);
        default: return Math.sin(2 * Math.PI * phase);
    }
}

// Equal-power pan like StereoPannerNode for a mono-ish source.
function panGains(pan) {
    const x = (pan + 1) / 2;
    return [Math.cos(x * Math.PI / 2), Math.sin(x * Math.PI / 2)];
}

// ------------------------------------------------------------- render ----
function buildVoices(preset) {
    const global = {
        texture: preset.dist || 0,
        bitDepth: preset.bitDepth || 16,
        srr: preset.sampleRateReduction || 1
    };
    const list = preset.voices
        ? preset.voices.filter(v => v.enabled !== false && v.volume > 0)
        : [{
            color: preset.color ?? 3, volume: VOICE_GAIN, pan: 0,
            attack: preset.attack, decay: preset.decay, sustain: preset.sustain,
            release: preset.release, duration: preset.duration, loop: preset.loop,
            color2: preset.color2, colorBlend: preset.colorBlend
        }];
    return list.map(v => ({
        src: new NoiseSource({ color: v.color, color2: v.color2 ?? v.color, colorBlend: v.colorBlend || 0, ...global }),
        env: makeEnvelope(v),
        volume: v.volume,
        pan: panGains(v.pan || 0)
    }));
}

// Render a few seconds with fresh generator state, envelopes held at full
// level and no fade, to measure the preset's natural RMS and peak. Returns
// the linear gain that reaches targetRms without peaks above -0.5 dBFS.
function calibrateGain(preset, targetRmsDb) {
    const voices = buildVoices(preset).map(v => ({ ...v, env: () => 1 }));
    const grey = preset.grey ? [shelf('low', 100, 10), shelf('high', 6000, 5)] : null;
    const warmup = SAMPLE_RATE * 2;          // let brown-noise state settle
    const measure = SAMPLE_RATE * 10;
    let sumSq = 0, peak = 0;
    for (let i = 0; i < warmup + measure; i++) {
        let l = 0, r = 0;
        for (const v of voices) {
            l += v.src.sample(0) * v.volume * v.pan[0];
            r += v.src.sample(1) * v.volume * v.pan[1];
        }
        if (grey) {
            l = grey[1].process(0, grey[0].process(0, l));
            r = grey[1].process(1, grey[0].process(1, r));
        }
        if (i < warmup) continue;
        sumSq += l * l + r * r;
        peak = Math.max(peak, Math.abs(l), Math.abs(r));
    }
    const rms = Math.sqrt(sumSq / (2 * measure));
    const target = Math.pow(10, targetRmsDb / 20);
    const ceiling = Math.pow(10, -0.5 / 20);
    const gain = Math.min(target / rms, ceiling / peak);
    console.log(`Calibration: natural RMS ${(20 * Math.log10(rms)).toFixed(1)} dBFS, peak ${(20 * Math.log10(peak)).toFixed(1)} dBFS, applying ${(20 * Math.log10(gain)).toFixed(1)} dB`);
    return gain;
}

function warnUnsupported(preset) {
    const skipped = [];
    if (preset.reverbMix) skipped.push('reverb');
    if (preset.saturation) skipped.push('saturation');
    if (preset.resonant && preset.resonant.enabled) skipped.push('resonant filter');
    if (preset.comb && preset.comb.enabled) skipped.push('comb filter');
    if (preset.panRate) skipped.push('auto-pan');
    if (skipped.length) console.warn(`Note: not rendered for this preset: ${skipped.join(', ')}`);
}

function makeTitleCard(outPng, { title, subtitle, hours }, width, height) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6"/><stop offset="25%" stop-color="#3b82f6"/>
      <stop offset="50%" stop-color="#00e5cc"/><stop offset="75%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <radialGradient id="glow1" cx="20%" cy="0%" r="60%"><stop offset="0%" stop-color="#00e5cc" stop-opacity="0.10"/><stop offset="100%" stop-color="#00e5cc" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="80%" cy="100%" r="60%"><stop offset="0%" stop-color="#7b61ff" stop-opacity="0.10"/><stop offset="100%" stop-color="#7b61ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="#0a0a0f"/>
  <rect width="1920" height="1080" fill="url(#glow1)"/>
  <rect width="1920" height="1080" fill="url(#glow2)"/>
  <circle cx="960" cy="330" r="130" fill="url(#ring)"/>
  <circle cx="960" cy="330" r="56" fill="#0a0a0f" opacity="0.85"/>
  <text x="960" y="560" text-anchor="middle" font-family="Space Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="110" font-weight="600" fill="#e8e8ed">${escapeXml(title)}</text>
  <text x="960" y="640" text-anchor="middle" font-family="Space Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="46" fill="#9a9aaa">${escapeXml(subtitle)}</text>
  <rect x="760" y="720" width="400" height="76" rx="38" fill="none" stroke="#00e5cc" stroke-width="3"/>
  <text x="960" y="771" text-anchor="middle" font-family="Space Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="40" font-weight="600" fill="#00e5cc">${escapeXml(hours)} HOURS</text>
  <text x="960" y="900" text-anchor="middle" font-family="JetBrains Mono, Menlo, monospace" font-size="42" fill="#e8e8ed">colorednoise.app</text>
  <text x="960" y="960" text-anchor="middle" font-family="Space Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" fill="#6b6b7b">free · no ads · no signup · works offline</text>
</svg>`;
    const svgPath = outPng.replace(/\.png$/, '.svg');
    writeFileSync(svgPath, svg);
    execFileSync('rsvg-convert', ['-w', String(width), '-h', String(height), svgPath, '-o', outPng]);
    return outPng;
}

function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    const preset = builtInPresets.find(p => p.name === args.preset);
    if (!preset) throw new Error(`Unknown preset "${args.preset}". Names: ${builtInPresets.map(p => p.name).join(', ')}`);

    const seconds = args.minutes ? args.minutes * 60 : args.hours * 3600;
    const hoursLabel = args.minutes ? (args.minutes / 60).toFixed(2).replace(/\.?0+$/, '') : String(args.hours);
    const slug = toSlug(preset.name);
    const outDir = join(ROOT, 'video');
    mkdirSync(outDir, { recursive: true });
    const out = args.out || join(outDir, `${slug}-${hoursLabel}h.${args.audioOnly ? 'm4a' : 'mp4'}`);
    const dominant = preset.voices ? preset.voices.find(v => v.enabled !== false).color : preset.color;
    const title = args.title || preset.name;
    const subtitle = args.subtitle || `${colorWord(dominant)} noise for sleep, focus and relaxation`;

    warnUnsupported(preset);

    // Title card and thumbnail
    let card = null;
    if (!args.audioOnly) {
        card = makeTitleCard(join(outDir, `${slug}-card.png`), { title, subtitle, hours: hoursLabel }, 1920, 1080);
        makeTitleCard(join(outDir, `${slug}-thumbnail.png`), { title, subtitle, hours: hoursLabel }, 1280, 720);
    }

    // ffmpeg
    const ffArgs = ['-hide_banner', '-loglevel', 'error', '-stats', '-y'];
    if (card) ffArgs.push('-loop', '1', '-framerate', String(args.fps), '-i', card);
    ffArgs.push('-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '2', '-i', 'pipe:0');
    if (card) {
        ffArgs.push('-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', String(args.fps));
    }
    ffArgs.push('-c:a', 'aac', '-b:a', '160k', '-t', String(seconds), '-movflags', '+faststart', out);
    const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
    ff.on('exit', (code) => {
        if (code === 0) console.log(`\n✓ Wrote ${out}`);
        else { console.error(`ffmpeg exited with code ${code}`); process.exit(code || 1); }
    });

    // Audio generation
    const masterGain = args.gainDb !== undefined
        ? Math.pow(10, args.gainDb / 20)
        : calibrateGain(preset, args.targetRms);
    const voices = buildVoices(preset);
    const grey = preset.grey ? [shelf('low', 100, 10), shelf('high', 6000, 5)] : null;
    const pulse = preset.pulse > 0 ? { f: preset.pulse, shape: preset.pulseShape || 'sine' } : null;

    const totalFrames = Math.floor(seconds * SAMPLE_RATE);
    const CHUNK = SAMPLE_RATE; // one second per chunk
    const buf = Buffer.alloc(CHUNK * 4);
    let frame = 0;
    let lastPct = -1;

    function writeChunk() {
        while (frame < totalFrames) {
            const n = Math.min(CHUNK, totalFrames - frame);
            for (let i = 0; i < n; i++) {
                const t = (frame + i) / SAMPLE_RATE;
                let l = 0, r = 0;
                for (const v of voices) {
                    const e = v.env(t) * v.volume;
                    l += v.src.sample(0) * e * v.pan[0];
                    r += v.src.sample(1) * e * v.pan[1];
                }
                if (pulse) {
                    const g = 0.7 + 0.3 * lfo(pulse.shape, (t * pulse.f) % 1);
                    l *= g; r *= g;
                }
                if (grey) {
                    l = grey[1].process(0, grey[0].process(0, l));
                    r = grey[1].process(1, grey[0].process(1, r));
                }
                let g = masterGain;
                const remaining = seconds - t;
                if (remaining < FADE_OUT_SECONDS) g *= remaining / FADE_OUT_SECONDS;
                l = Math.max(-1, Math.min(1, l * g));
                r = Math.max(-1, Math.min(1, r * g));
                buf.writeInt16LE(Math.round(l * 32767), i * 4);
                buf.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
            }
            frame += n;
            const pct = Math.floor(100 * frame / totalFrames);
            if (pct !== lastPct && pct % 5 === 0) { lastPct = pct; process.stderr.write(`\raudio ${pct}%   `); }
            const ok = ff.stdin.write(n === CHUNK ? buf : buf.subarray(0, n * 4));
            if (!ok) { ff.stdin.once('drain', writeChunk); return; }
        }
        ff.stdin.end();
    }
    writeChunk();
}

main();
