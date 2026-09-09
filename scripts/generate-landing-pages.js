/**
 * Generate the SEO landing pages (brown-noise.html, noise-for-sleep.html, ...)
 * Run with: node scripts/generate-landing-pages.js
 *
 * Content lives in scripts/landing-content.js. Preset indices for the
 * play/preview buttons are looked up from js/presets.js by name.
 */

import { builtInPresets } from '../js/presets.js';
import { landingPages } from './landing-content.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..');
const SITE = 'https://colorednoise.app';

function toSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeAttr(s) {
    return String(s).replace(/&(?!amp;)/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function stripTags(s) {
    return String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
}

function presetIndex(name) {
    const i = builtInPresets.findIndex(p => p.name === name);
    if (i < 0) throw new Error(`Unknown preset "${name}" in landing content`);
    return i;
}

const bySlug = Object.fromEntries(landingPages.map(p => [p.slug, p]));

function faqJsonLd(page) {
    return {
        '@type': 'FAQPage',
        mainEntity: page.faq.map(f => ({
            '@type': 'Question',
            name: stripTags(f.q),
            acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) }
        }))
    };
}

function generateLandingPage(page) {
    const url = `${SITE}/${page.slug}.html`;
    const primaryIdx = presetIndex(page.primaryPreset);
    const wordCount = [...page.intro, ...page.sections.flatMap(s => s.paragraphs), ...page.faq.map(f => f.a)]
        .map(stripTags).join(' ').split(/\s+/).length;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                '@id': `${url}#article`,
                headline: stripTags(page.h1),
                description: stripTags(page.metaDescription),
                url,
                image: `${SITE}/social-card.png`,
                wordCount,
                author: { '@type': 'Person', name: 'Gabriel Berger' },
                publisher: { '@type': 'Organization', name: 'Colored Noise', url: SITE },
                isPartOf: { '@type': 'WebApplication', '@id': `${SITE}/#website`, name: 'Colored Noise' },
                mainEntityOfPage: url
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
                    { '@type': 'ListItem', position: 2, name: stripTags(page.h1) }
                ]
            },
            faqJsonLd(page)
        ]
    };

    const presetsHtml = page.presets.map(p => {
        const idx = presetIndex(p.name);
        return `                <li>
                    <a class="pick-name" href="/presets/${toSlug(p.name)}.html">${p.name}</a>
                    <span class="pick-why">${p.why}</span>
                    <button type="button" class="preview-btn" data-preview-preset="${idx}"><span class="preview-icon" aria-hidden="true"></span> <span class="preview-label">Preview</span></button>
                    <a class="pick-open" href="/?preset=${idx}">Open &rarr;</a>
                </li>`;
    }).join('\n');

    const sectionsHtml = page.sections.map(s => `
        <section>
            <h2>${s.heading}</h2>
            ${s.paragraphs.map(p => p.trim().startsWith('<table') ? p : `<p>${p}</p>`).join('\n            ')}
        </section>`).join('\n');

    const faqHtml = page.faq.map(f => `
            <details>
                <summary>${f.q}</summary>
                <p>${f.a}</p>
            </details>`).join('');

    const relatedHtml = page.related.map(slug => {
        const target = bySlug[slug];
        if (!target) throw new Error(`Unknown related slug "${slug}" on page ${page.slug}`);
        return `<li><a href="/${slug}.html">${target.h1}</a></li>`;
    }).join('\n                ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${escapeAttr(page.title)}</title>
    <meta name="description" content="${escapeAttr(page.metaDescription)}">
    <meta name="theme-color" content="#0a0a0f">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${url}">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="manifest" href="/manifest.webmanifest">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escapeAttr(page.title)}">
    <meta property="og:description" content="${escapeAttr(page.metaDescription)}">
    <meta property="og:image" content="${SITE}/social-card.png">
    <meta property="og:site_name" content="Colored Noise">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(page.title)}">
    <meta name="twitter:description" content="${escapeAttr(page.metaDescription)}">
    <meta name="twitter:image" content="${SITE}/social-card.png">

    <!-- Structured Data -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 4).replace(/</g, '\\u003c')}
    </script>

    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <div class="content-page landing-page">
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Colored Noise</a>
            <span class="separator">/</span>
            <span>${page.h1}</span>
        </nav>

        <header class="landing-header">
            <h1>${page.h1}</h1>
            <div class="landing-intro">
                ${page.intro.map(p => `<p>${p}</p>`).join('\n                ')}
            </div>
        </header>

        <div class="preset-cta">
            <div class="cta-buttons">
                <button type="button" class="preview-btn" data-preview-preset="${primaryIdx}"><span class="preview-icon" aria-hidden="true"></span> <span class="preview-label">Preview ${page.primaryPreset}</span></button>
                <a href="/?preset=${primaryIdx}" class="play-preset-btn">Open in Generator</a>
            </div>
            <p class="cta-hint">Free, no ads, no signup. Runs entirely in your browser.</p>
            <p class="preview-status" id="previewStatus" aria-live="polite"></p>
        </div>
${sectionsHtml}

        <section>
            <h2>Recommended presets</h2>
            <ul class="preset-picks">
${presetsHtml}
            </ul>
        </section>

        <section class="landing-faq">
            <h2>Frequently asked questions</h2>${faqHtml}
        </section>

        <aside class="landing-related">
            <h2>Related guides</h2>
            <ul>
                ${relatedHtml}
                <li><a href="/presets/">All 71 presets</a></li>
                <li><a href="/physics.html">The physics of noise</a></li>
            </ul>
        </aside>

        <footer class="landing-footer">
            <span><a href="/">Colored Noise</a> is free and open source. No ads, no signup, no tracking.</span>
            <a href="https://github.com/gabrielberger1000/colorednoise">Source on GitHub</a>
        </footer>
    </div>

    <script type="module" src="/js/preset-preview.js"></script>
</body>
</html>
`;
}

console.log('Generating landing pages...\n');
for (const page of landingPages) {
    const html = generateLandingPage(page);
    writeFileSync(join(OUTPUT_DIR, `${page.slug}.html`), html);
    console.log(`  ${page.slug}.html`);
}
console.log(`\n✓ Generated ${landingPages.length} landing pages`);
