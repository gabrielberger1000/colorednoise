/**
 * In-page preview for preset and landing pages.
 *
 * Any element with `data-preview-preset="<index>"` becomes a play/stop toggle
 * that synthesizes that built-in preset right on the page, so a visitor can
 * hear the sound before opening the full generator. The audio engine is only
 * initialized on the first click (browsers require a user gesture anyway).
 */

import { audioEngine, checkBrowserCompatibility } from './audio-engine.js';
import { builtInPresets } from './presets.js';

const PREVIEW_VOLUME = 0.5;

let activeButton = null;

function buildSettings(preset) {
    // Mirrors activatePreset() in ui.js: multi-voice presets carry their own
    // voices array; single-voice presets are applied to voice 1.
    if (preset.voices && Array.isArray(preset.voices)) {
        return { ...preset };
    }
    return {
        ...preset,
        voices: [{
            color: preset.color ?? 3,
            volume: 0.8,
            pan: 0,
            attack: preset.attack ?? 0.5,
            decay: preset.decay ?? 0,
            sustain: preset.sustain ?? 1,
            release: preset.release ?? 0.5,
            duration: preset.loop ? (preset.duration ?? 2) : (preset.duration ?? null),
            loop: preset.loop ?? false,
            enabled: true
        }]
    };
}

function setState(btn, state, message) {
    btn.dataset.state = state;
    btn.classList.toggle('playing', state === 'playing');
    btn.disabled = state === 'loading';
    const label = btn.querySelector('.preview-label') || btn;
    if (state === 'playing') {
        label.textContent = 'Stop preview';
        btn.setAttribute('aria-pressed', 'true');
    } else if (state === 'loading') {
        label.textContent = 'Starting…';
    } else {
        label.textContent = btn.dataset.idleLabel || 'Preview';
        btn.setAttribute('aria-pressed', 'false');
    }
    const status = document.getElementById('previewStatus');
    if (status && message !== undefined) status.textContent = message;
}

async function startPreview(btn) {
    const index = parseInt(btn.dataset.previewPreset, 10);
    const preset = builtInPresets[index];
    if (!preset) return;

    setState(btn, 'loading', '');

    if (!audioEngine.initialized) {
        const result = await audioEngine.init();
        if (!result.success) {
            setState(btn, 'idle', 'Preview unavailable: ' + result.error);
            return;
        }
        audioEngine.setVolume(PREVIEW_VOLUME);
    }

    if (activeButton && activeButton !== btn) {
        setState(activeButton, 'idle');
    }

    await audioEngine.applySettings(buildSettings(preset), true);
    audioEngine.start();
    audioEngine.setNowPlaying(preset.name + ' (preview)');
    activeButton = btn;
    setState(btn, 'playing', 'Playing ' + preset.name + ' at half volume. Open the generator for full controls.');
}

function stopPreview(btn) {
    audioEngine.stop(0.3, () => audioEngine.suspend());
    activeButton = null;
    setState(btn, 'idle', '');
}

function init() {
    const buttons = document.querySelectorAll('[data-preview-preset]');
    if (buttons.length === 0) return;

    const compat = checkBrowserCompatibility();
    if (!compat.supported) {
        buttons.forEach((btn) => { btn.hidden = true; });
        return;
    }

    buttons.forEach((btn) => {
        btn.dataset.idleLabel = (btn.querySelector('.preview-label') || btn).textContent.trim();
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
            if (btn.dataset.state === 'playing') {
                stopPreview(btn);
            } else if (btn.dataset.state !== 'loading') {
                startPreview(btn);
            }
        });
    });

    // Lock-screen / headset pause stops the preview.
    audioEngine.onMediaAction = (action) => {
        if ((action === 'pause' || action === 'stop') && activeButton) stopPreview(activeButton);
    };

    // Stop when the page is hidden (tab switch, navigation) to avoid a
    // preview running in the background.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && activeButton) stopPreview(activeButton);
    });
    window.addEventListener('pagehide', () => {
        if (activeButton) stopPreview(activeButton);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
