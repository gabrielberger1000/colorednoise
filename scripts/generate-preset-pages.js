/**
 * Generate individual HTML pages for each preset
 * Run with: node scripts/generate-preset-pages.js
 *
 * Editorial copy lives in scripts/preset-content.js; everything derived from
 * the preset parameters (specs, related presets, structured data) is computed
 * here from js/presets.js.
 */

import { builtInPresets, categories } from '../js/presets.js';
import { presetContent } from './preset-content.js';
import { landingPages } from './landing-content.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'presets');
const SITE = 'https://colorednoise.app';

// Helper to convert preset name to URL slug
export function toSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function stripTags(s) {
    return String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
}

function jsonString(s) {
    return JSON.stringify(stripTags(s));
}

// Helper to get noise color name from numeric value
function getColorName(color) {
    if (color === undefined || color === null) return 'mixed';
    if (color <= 0.5) return 'violet';
    if (color <= 1.5) return 'blue';
    if (color <= 2.5) return 'white';
    if (color <= 3.5) return 'pink';
    return 'brown';
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// Dominant color for multi-voice presets: the loudest enabled voice
function getDominantColor(preset) {
    if (preset.voices) {
        const loudest = preset.voices
            .filter(v => v.enabled !== false && v.volume > 0)
            .sort((a, b) => b.volume - a.volume)[0];
        return loudest ? loudest.color : undefined;
    }
    return preset.color;
}

// Landing page for a given color name, if one exists
const colorLanding = {};
for (const page of landingPages) {
    const m = page.slug.match(/^(brown|pink|white|blue|violet|grey)-noise$/);
    if (m) colorLanding[m[1]] = page;
}

// Get related presets from same category
function getRelatedPresets(currentIndex, currentCategory) {
    const related = [];
    for (let i = 0; i < builtInPresets.length && related.length < 5; i++) {
        if (i !== currentIndex && builtInPresets[i].category === currentCategory) {
            related.push({ index: i, preset: builtInPresets[i] });
        }
    }
    return related;
}

function describeLoop(preset) {
    const cycle = (preset.attack ?? 0) + (preset.decay ?? 0) + (preset.duration ?? 0) + (preset.release ?? 0);
    return `${preset.attack}s in, hold ${preset.duration}s, ${preset.release}s out (${cycle.toFixed(1)}s cycle)`;
}

function specRows(preset) {
    const rows = [];
    const color = getDominantColor(preset);

    if (preset.voices) {
        const enabled = preset.voices.filter(v => v.enabled !== false);
        rows.push(['Voices', `${enabled.length} independent layers`]);
        enabled.forEach((v, i) => {
            const cycle = v.loop ? `${((v.attack ?? 0) + (v.decay ?? 0) + (v.duration ?? 0) + (v.release ?? 0)).toFixed(1)}s cycle` : 'sustained';
            const pan = v.pan === 0 ? 'center' : (v.pan < 0 ? `${Math.round(-v.pan * 100)}% left` : `${Math.round(v.pan * 100)}% right`);
            rows.push([`Voice ${i + 1}`, `${capitalize(getColorName(v.color))} (${v.color}), ${pan}, ${cycle}`]);
        });
    } else {
        rows.push(['Noise Color', `${capitalize(getColorName(color))}${color % 1 !== 0 ? ` (${color.toFixed(2)} on the 0–4 scale)` : ` (${color})`}`]);
        if (preset.color2 !== undefined && preset.colorBlend > 0) {
            rows.push(['Second Color', `${capitalize(getColorName(preset.color2))} (${preset.color2}) at ${Math.round(preset.colorBlend * 100)}% blend`]);
        }
        if (preset.loop) {
            rows.push(['Envelope', describeLoop(preset)]);
        } else if (preset.attack !== undefined) {
            rows.push(['Fade In', `${preset.attack} seconds`]);
        }
    }

    if (preset.pulse && preset.pulse > 0) {
        const period = 1 / preset.pulse;
        const periodText = period >= 1 ? `one cycle every ${period.toFixed(period >= 10 ? 0 : 1)} s` : `${preset.pulse} cycles per second`;
        rows.push(['Modulation', `${preset.pulse} Hz ${preset.pulseShape || 'sine'} (${periodText})`]);
    }
    if (preset.grey) rows.push(['Grey Noise EQ', 'Enabled (perceptual loudness balance)']);
    if (preset.dist === 1) rows.push(['Distribution', 'Uniform (slightly grittier texture)']);
    if (preset.resonant && preset.resonant.enabled) {
        rows.push(['Resonant Filter', `${preset.resonant.frequencies.join(', ')} Hz, Q ${preset.resonant.q}, ${Math.round(preset.resonant.mix * 100)}% mix`]);
    }
    if (preset.comb && preset.comb.enabled) {
        rows.push(['Comb Filter', `${(preset.comb.delay * 1000).toFixed(0)} ms delay, ${Math.round(preset.comb.feedback * 100)}% feedback`]);
    }
    if (preset.reverbMix && preset.reverbMix > 0) {
        rows.push(['Reverb', `${Math.round(preset.reverbMix * 100)}% mix, ${preset.reverbSize || 'medium'} room`]);
    }
    if (preset.saturation && preset.saturation > 0) {
        rows.push(['Saturation', `${Math.round(preset.saturation * 100)}% (${preset.saturationMode || 'soft'})`]);
    }
    if (preset.bitDepth && preset.bitDepth < 16) {
        rows.push(['Bitcrusher', `${preset.bitDepth}-bit, ${preset.sampleRateReduction}x sample rate reduction`]);
    }
    if (preset.panRate && preset.panRate > 0) {
        rows.push(['Auto-Pan', `${preset.panRate} Hz, ${Math.round(preset.panDepth * 100)}% width`]);
    }
    return rows;
}

// Generate HTML for a single preset page
function generatePresetPage(preset, index) {
    const slug = toSlug(preset.name);
    const color = getDominantColor(preset);
    const colorName = getColorName(color);
    const categoryInfo = categories[preset.category];
    const content = presetContent[preset.name];
    if (!content) throw new Error(`No content for preset "${preset.name}" in scripts/preset-content.js`);
    const related = getRelatedPresets(index, preset.category);
    const specs = specRows(preset);
    const landing = colorLanding[colorName];
    const url = `${SITE}/presets/${slug}`;

    const title = `${preset.name} – Free ${capitalize(colorName)} Noise Preset (${categoryInfo.label}) | Colored Noise`;
    const metaDesc = `${preset.name}: ${stripTags(content.tagline)}. Free ${colorName} noise preset for ${categoryInfo.label.toLowerCase()}, synthesized in your browser. No ads, no signup.`;
    const plainAbout = content.about.map(stripTags).join(' ');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${escapeAttr(title)}</title>
    <meta name="description" content="${escapeAttr(metaDesc)}">
    <meta name="theme-color" content="#0a0a0f">
    <link rel="canonical" href="${url}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="manifest" href="/manifest.webmanifest">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escapeAttr(`${preset.name} – Free ${capitalize(colorName)} Noise Generator`)}">
    <meta property="og:description" content="${escapeAttr(metaDesc)}">
    <meta property="og:image" content="${SITE}/social-card.png">
    <meta property="og:site_name" content="Colored Noise">
    <meta name="twitter:card" content="summary_large_image">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": ${jsonString(preset.name)},
        "description": ${jsonString(content.tagline)},
        "url": "${url}",
        "isPartOf": {
            "@type": "WebApplication",
            "@id": "${SITE}/#website",
            "name": "Colored Noise"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE}/"},
                {"@type": "ListItem", "position": 2, "name": "Presets", "item": "${SITE}/presets/"},
                {"@type": "ListItem", "position": 3, "name": ${jsonString(preset.name)}}
            ]
        },
        "mainEntity": {
            "@type": "AudioObject",
            "name": ${jsonString(preset.name)},
            "description": ${jsonString(plainAbout)},
            "encodingFormat": "audio/wav",
            "isAccessibleForFree": true,
            "genre": "${categoryInfo.label} noise"
        }
    }
    </script>

    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <div class="content-page preset-page">
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Colored Noise</a>
            <span class="separator">/</span>
            <a href="/presets/">Presets</a>
            <span class="separator">/</span>
            <span>${preset.name}</span>
        </nav>

        <header class="preset-header">
            <span class="preset-category-badge" style="background: ${categoryInfo.color}">${categoryInfo.label}</span>
            <h1>${preset.name}</h1>
            <p class="preset-tagline">${content.tagline}</p>
        </header>

        <div class="preset-cta">
            <div class="cta-buttons">
                <button type="button" class="preview-btn" data-preview-preset="${index}"><span class="preview-icon" aria-hidden="true"></span> <span class="preview-label">Preview</span></button>
                <a href="/?preset=${index}" class="play-preset-btn">Open in Generator</a>
            </div>
            <p class="cta-hint">Preview plays right here. The generator adds a sleep timer, full controls, and WAV export.</p>
            <p class="preview-status" id="previewStatus" aria-live="polite"></p>
        </div>

        <section class="preset-details">
            <h2>About This Sound</h2>
            ${content.about.map(p => `<p>${p}</p>`).join('\n            ')}

            <h3>Best Used For</h3>
            <ul>
                ${content.bestFor.map(use => `<li>${use}</li>`).join('\n                ')}
            </ul>

            <div class="preset-tip"><strong>Try this:</strong> ${content.tip}</div>

            <h3>Technical Details</h3>
            <dl class="preset-specs">
                ${specs.map(([dt, dd]) => `<dt>${dt}</dt>\n                <dd>${dd}</dd>`).join('\n                ')}
            </dl>
            ${landing ? `<p class="learn-more-link"><a href="/${landing.slug}">Learn more about ${colorName} noise &rarr;</a></p>` : ''}
        </section>

        ${related.length > 0 ? `
        <section class="related-presets">
            <h2>Similar ${categoryInfo.label} Presets</h2>
            <ul>
                ${related.map(r => `<li><a href="/presets/${toSlug(r.preset.name)}">${r.preset.name}</a></li>`).join('\n                ')}
            </ul>
        </section>
        ` : ''}

        <nav class="preset-nav">
            ${index > 0 ? `<a href="/presets/${toSlug(builtInPresets[index - 1].name)}" class="prev-preset">&larr; ${builtInPresets[index - 1].name}</a>` : '<span></span>'}
            <a href="/presets/" class="back-to-app">All Presets</a>
            ${index < builtInPresets.length - 1 ? `<a href="/presets/${toSlug(builtInPresets[index + 1].name)}" class="next-preset">${builtInPresets[index + 1].name} &rarr;</a>` : '<span></span>'}
        </nav>
    </div>

    <script type="module" src="/js/preset-preview.js"></script>
</body>
</html>
`;

    return { slug, html };
}

// Main execution (only when run directly, not when imported)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    console.log('Generating preset pages...\n');

    if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const generated = [];
    for (let i = 0; i < builtInPresets.length; i++) {
        const preset = builtInPresets[i];
        const { slug, html } = generatePresetPage(preset, i);
        writeFileSync(join(OUTPUT_DIR, `${slug}.html`), html);
        generated.push({ name: preset.name, slug, index: i });
        console.log(`  [${i + 1}/${builtInPresets.length}] ${preset.name} -> ${slug}.html`);
    }

    console.log(`\n✓ Generated ${generated.length} preset pages in /presets/`);
}
