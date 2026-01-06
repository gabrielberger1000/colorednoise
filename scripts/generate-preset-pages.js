/**
 * Generate individual HTML pages for each preset
 * Run with: node scripts/generate-preset-pages.js
 */

import { builtInPresets, categories } from '../js/presets.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'presets');

// Helper to convert preset name to URL slug
function toSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
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

// Helper to get a detailed color description
function getColorDescription(color) {
    if (color === undefined || color === null) return 'multi-voice layered noise';
    const colorVal = parseFloat(color);
    if (isNaN(colorVal)) return 'multi-voice layered noise';
    if (colorVal <= 0.5) return 'violet noise (high-frequency emphasis)';
    if (colorVal <= 1.5) return 'blue noise (bright, airy texture)';
    if (colorVal <= 2.5) return 'white noise (balanced frequencies)';
    if (colorVal <= 3.5) return 'pink noise (natural, balanced sound)';
    return 'brown noise (deep, rumbling bass)';
}

// Generate a detailed description based on preset properties
function generateDescription(preset, index) {
    const parts = [];
    const colorName = getColorName(preset.color);

    // Base description
    if (preset.voices) {
        parts.push(`A multi-voice layered soundscape combining ${preset.voices.filter(v => v.enabled !== false).length} independent noise generators`);
    } else {
        parts.push(`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} noise`);

        if (preset.color % 1 !== 0) {
            const lower = getColorName(Math.floor(preset.color));
            const upper = getColorName(Math.ceil(preset.color));
            if (lower !== upper) {
                parts[0] = `A blend of ${lower} and ${upper} noise`;
            }
        }
    }

    // Modulation
    if (preset.pulse && preset.pulse > 0) {
        if (preset.pulse < 0.2) {
            parts.push('with slow, gentle modulation');
        } else if (preset.pulse < 1) {
            parts.push('with rhythmic pulsing');
        } else {
            parts.push('with fast modulation');
        }
    }

    // Grey noise
    if (preset.grey) {
        parts.push('using perceptual equalization for balanced loudness across all frequencies');
    }

    // Loop behavior
    if (preset.loop) {
        parts.push(`Features a ${preset.attack}s fade-in and ${preset.release}s fade-out in a repeating cycle`);
    } else if (preset.attack > 10) {
        parts.push(`Gradually fades in over ${preset.attack} seconds for a smooth transition`);
    }

    // Effects
    if (preset.reverbMix && preset.reverbMix > 0.3) {
        parts.push(`Enhanced with ${preset.reverbSize || 'medium'} room reverb`);
    }
    if (preset.saturation && preset.saturation > 0) {
        parts.push('with warm analog-style saturation');
    }
    if (preset.bitDepth && preset.bitDepth < 16) {
        parts.push('processed through a lo-fi bitcrusher effect');
    }
    if (preset.resonant && preset.resonant.enabled) {
        parts.push('featuring resonant harmonic filtering');
    }
    if (preset.comb && preset.comb.enabled) {
        parts.push('with metallic comb filter texture');
    }

    return parts.join('. ') + '.';
}

// Get use cases based on category
function getUseCases(category) {
    const cases = {
        sleep: ['falling asleep', 'staying asleep', 'blocking nighttime disturbances', 'creating a calming bedtime routine'],
        focus: ['deep work sessions', 'studying', 'blocking office noise', 'maintaining concentration'],
        nature: ['relaxation', 'meditation', 'creating a peaceful atmosphere', 'stress relief'],
        ambient: ['background noise', 'masking distractions', 'tinnitus relief', 'general relaxation'],
        mechanical: ['creating familiar comfort sounds', 'travel simulation', 'industrial ambience', 'white noise alternatives'],
        experimental: ['creative projects', 'unique soundscapes', 'ASMR', 'artistic expression'],
        textured: ['meditation', 'sound design', 'immersive experiences', 'ambient music production']
    };
    return cases[category] || cases.ambient;
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

// Generate HTML for a single preset page
function generatePresetPage(preset, index) {
    const slug = toSlug(preset.name);
    const colorName = getColorName(preset.color);
    const categoryInfo = categories[preset.category];
    const description = generateDescription(preset, index);
    const useCases = getUseCases(preset.category);
    const related = getRelatedPresets(index, preset.category);

    // SEO-optimized title
    const title = `${preset.name} - Free ${colorName.charAt(0).toUpperCase() + colorName.slice(1)} Noise for ${categoryInfo.label} | Colored Noise`;

    // Meta description (max ~155 chars)
    const metaDesc = `${preset.name}: ${description.slice(0, 120)}${description.length > 120 ? '...' : ''} Free online noise generator.`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${title}</title>
    <meta name="description" content="${metaDesc.replace(/"/g, '&quot;')}">
    <meta name="theme-color" content="#0a0a0f">
    <link rel="canonical" href="https://colorednoise.app/presets/${slug}.html">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://colorednoise.app/presets/${slug}.html">
    <meta property="og:title" content="${preset.name} - Free ${colorName} Noise Generator">
    <meta property="og:description" content="${metaDesc.replace(/"/g, '&quot;')}">
    <meta property="og:site_name" content="Colored Noise">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${preset.name}",
        "description": "${description.replace(/"/g, '\\"')}",
        "url": "https://colorednoise.app/presets/${slug}.html",
        "isPartOf": {
            "@type": "WebApplication",
            "@id": "https://colorednoise.app/#website",
            "name": "Colored Noise"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://colorednoise.app/"},
                {"@type": "ListItem", "position": 2, "name": "Presets", "item": "https://colorednoise.app/#presets"},
                {"@type": "ListItem", "position": 3, "name": "${preset.name}"}
            ]
        },
        "mainEntity": {
            "@type": "AudioObject",
            "name": "${preset.name}",
            "description": "${description.replace(/"/g, '\\"')}",
            "encodingFormat": "audio/wav",
            "isAccessibleForFree": true,
            "genre": "${categoryInfo.label} noise"
        }
    }
    </script>

    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="content-page preset-page">
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Colored Noise</a>
            <span class="separator">/</span>
            <a href="/#presets">Presets</a>
            <span class="separator">/</span>
            <span>${preset.name}</span>
        </nav>

        <header class="preset-header">
            <span class="preset-category-badge" style="background: ${categoryInfo.color}">${categoryInfo.label}</span>
            <h1>${preset.name}</h1>
            <p class="preset-tagline">${getColorDescription(preset.color)}</p>
        </header>

        <div class="preset-cta">
            <a href="/?preset=${index}" class="play-preset-btn">Play This Preset</a>
            <p class="cta-hint">Opens the generator with ${preset.name} loaded</p>
        </div>

        <section class="preset-details">
            <h2>About This Sound</h2>
            <p>${description}</p>

            <h3>Best Used For</h3>
            <ul>
                ${useCases.map(use => `<li>${use.charAt(0).toUpperCase() + use.slice(1)}</li>`).join('\n                ')}
            </ul>

            <h3>Technical Details</h3>
            <dl class="preset-specs">
                <dt>Noise Color</dt>
                <dd>${colorName.charAt(0).toUpperCase() + colorName.slice(1)}${preset.color !== undefined && preset.color % 1 !== 0 ? ` (${preset.color.toFixed(1)})` : ''}</dd>

                ${preset.pulse && preset.pulse > 0 ? `<dt>Modulation</dt>
                <dd>${preset.pulse.toFixed(2)} Hz ${preset.pulseShape || 'sine'}</dd>` : ''}

                ${preset.grey ? `<dt>Grey Noise EQ</dt>
                <dd>Enabled (perceptual balance)</dd>` : ''}

                ${preset.loop ? `<dt>Envelope</dt>
                <dd>Attack: ${preset.attack}s, Sustain: ${preset.sustain}, Release: ${preset.release}s</dd>` :
                preset.attack !== undefined ? `<dt>Fade In</dt>
                <dd>${preset.attack} seconds</dd>` : ''}

                ${preset.reverbMix && preset.reverbMix > 0 ? `<dt>Reverb</dt>
                <dd>${Math.round(preset.reverbMix * 100)}% mix, ${preset.reverbSize || 'medium'} room</dd>` : ''}

                ${preset.voices ? `<dt>Voices</dt>
                <dd>${preset.voices.filter(v => v.enabled !== false).length} independent layers</dd>` : ''}
            </dl>
        </section>

        ${related.length > 0 ? `
        <section class="related-presets">
            <h2>Similar ${categoryInfo.label} Presets</h2>
            <ul>
                ${related.map(r => `<li><a href="/presets/${toSlug(r.preset.name)}.html">${r.preset.name}</a></li>`).join('\n                ')}
            </ul>
        </section>
        ` : ''}

        <nav class="preset-nav">
            ${index > 0 ? `<a href="/presets/${toSlug(builtInPresets[index - 1].name)}.html" class="prev-preset">&larr; ${builtInPresets[index - 1].name}</a>` : '<span></span>'}
            <a href="/" class="back-to-app">All Presets</a>
            ${index < builtInPresets.length - 1 ? `<a href="/presets/${toSlug(builtInPresets[index + 1].name)}.html" class="next-preset">${builtInPresets[index + 1].name} &rarr;</a>` : '<span></span>'}
        </nav>
    </div>
</body>
</html>`;

    return { slug, html };
}

// Main execution
console.log('Generating preset pages...\n');

// Create output directory
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate all pages
const generated = [];
for (let i = 0; i < builtInPresets.length; i++) {
    const preset = builtInPresets[i];
    const { slug, html } = generatePresetPage(preset, i);
    const filePath = join(OUTPUT_DIR, `${slug}.html`);

    writeFileSync(filePath, html);
    generated.push({ name: preset.name, slug, index: i });
    console.log(`  [${i + 1}/${builtInPresets.length}] ${preset.name} -> ${slug}.html`);
}

console.log(`\n✓ Generated ${generated.length} preset pages in /presets/`);

// Output a summary for updating links
console.log('\nPreset URL mapping:');
console.log('-------------------');
generated.forEach(({ name, slug, index }) => {
    console.log(`${index}: ${name} -> /presets/${slug}.html`);
});
