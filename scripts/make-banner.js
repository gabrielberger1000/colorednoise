#!/usr/bin/env node
/**
 * Render the YouTube channel banner (channel art) in the same visual language
 * as the video title cards produced by scripts/render-video.js.
 *
 * Requires rsvg-convert on PATH.
 *
 * Usage:
 *   node scripts/make-banner.js
 *   node scripts/make-banner.js --guides        # overlay the crop guides
 *   node scripts/make-banner.js --out video/banner.png
 *
 * YouTube renders one 2048x1152 image at several crops:
 *   TV        2048 x 1152   the whole image
 *   Desktop   2048 x  423   centred horizontal strip
 *   Mobile    1235 x  338   centred "safe area", the only region always shown
 * Everything legible therefore lives inside the 1235x338 safe area; the
 * gradients exist to fill the TV crop. --guides draws both boxes so the
 * placement can be checked before uploading (never upload a guides render).
 */

import { execFileSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const WIDTH = 2048;
const HEIGHT = 1152;
const SAFE = { w: 1235, h: 338 };
const DESKTOP_H = 423;

const SANS = 'Space Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif';
const MONO = 'JetBrains Mono, Menlo, monospace';

function escapeXml(s) {
    return String(s).replace(/[<>&'"]/g, (c) => (
        { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]
    ));
}

function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        switch (argv[i]) {
            case '--guides': args.guides = true; break;
            case '--out': args.out = argv[++i]; break;
            case '--help': case '-h': args.help = true; break;
        }
    }
    return args;
}

function guideOverlay() {
    const sx = (WIDTH - SAFE.w) / 2;
    const sy = (HEIGHT - SAFE.h) / 2;
    const dy = (HEIGHT - DESKTOP_H) / 2;
    return `
  <rect x="0" y="${dy}" width="${WIDTH}" height="${DESKTOP_H}" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="14 10"/>
  <rect x="${sx}" y="${sy}" width="${SAFE.w}" height="${SAFE.h}" fill="none" stroke="#ef4444" stroke-width="3"/>
  <text x="${sx + 10}" y="${sy - 14}" font-family="${MONO}" font-size="24" fill="#ef4444">safe area 1235 x 338</text>
  <text x="14" y="${dy - 14}" font-family="${MONO}" font-size="24" fill="#f59e0b">desktop 2048 x 423</text>`;
}

function makeBanner(outPng, { guides = false } = {}) {
    // The safe area spans y 407..745; this block is centred on y 576.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6"/><stop offset="25%" stop-color="#3b82f6"/>
      <stop offset="50%" stop-color="#00e5cc"/><stop offset="75%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <radialGradient id="glow1" cx="18%" cy="0%" r="65%"><stop offset="0%" stop-color="#00e5cc" stop-opacity="0.12"/><stop offset="100%" stop-color="#00e5cc" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="82%" cy="100%" r="65%"><stop offset="0%" stop-color="#7b61ff" stop-opacity="0.12"/><stop offset="100%" stop-color="#7b61ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0a0a0f"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow1)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)"/>
  <circle cx="682" cy="576" r="100" fill="url(#ring)"/>
  <circle cx="682" cy="576" r="43" fill="#0a0a0f" opacity="0.85"/>
  <text x="832" y="545" font-family="${SANS}" font-size="96" font-weight="600" fill="#e8e8ed">${escapeXml('Colored Noise')}</text>
  <text x="834" y="615" font-family="${MONO}" font-size="40" fill="#00e5cc">${escapeXml('colorednoise.app')}</text>
  <text x="834" y="668" font-family="${SANS}" font-size="30" fill="#6b6b7b">${escapeXml('free · no ads · no signup · works offline')}</text>${guides ? guideOverlay() : ''}
</svg>`;
    const svgPath = outPng.replace(/\.png$/, '.svg');
    mkdirSync(dirname(outPng), { recursive: true });
    writeFileSync(svgPath, svg);
    execFileSync('rsvg-convert', ['-w', String(WIDTH), '-h', String(HEIGHT), svgPath, '-o', outPng]);
    return outPng;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
    console.log('Usage: node scripts/make-banner.js [--guides] [--out <path.png>]');
    process.exit(0);
}
const out = args.out
    ? join(ROOT, args.out)
    : join(ROOT, 'video', args.guides ? 'channel-banner-guides.png' : 'channel-banner.png');
makeBanner(out, { guides: args.guides });
console.log(`✓ Wrote ${out}`);
