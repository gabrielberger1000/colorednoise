import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));

/**
 * Every page is an entry point: the generator at the root, the guide pages,
 * and the 71 preset pages, each of which loads the preview module. Listing
 * them by hand would rot the moment a preset is added, so they are discovered.
 */
function htmlEntries() {
    const entries = {};
    for (const f of readdirSync(ROOT)) {
        if (f.endsWith('.html')) entries[f.replace(/\.html$/, '')] = resolve(ROOT, f);
    }
    for (const f of readdirSync(resolve(ROOT, 'presets'))) {
        if (f.endsWith('.html')) entries[`presets/${f.replace(/\.html$/, '')}`] = resolve(ROOT, 'presets', f);
    }
    return entries;
}

export default defineConfig({
    root: ROOT,
    publicDir: false,
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'es2022',
        rollupOptions: {
            input: htmlEntries()
        }
    }
});
