/**
 * UI Module - DOM manipulation and event handling for Colored Noise
 */

import { audioEngine } from './audio-engine.js';
import { builtInPresets, categories, defaultSettings, loadCustomPresets, saveCustomPresets } from './presets.js';

// State
let currentSettings = { ...defaultSettings };
let currentPresetName = "Standard Pink";
let customPresets = loadCustomPresets();
let activePresetBtn = null;
let currentFilter = 'all';
let vizMode = 'bars';
let animationId = null;

// Timer state
let timerInterval = null;
let timerEndTime = null;
let timerFadeStarted = false;

// DOM Elements (populated on init)
let elements = {};

/**
 * Initialize UI - call after DOM is ready
 */
export function initUI() {
    // Cache DOM elements
    elements = {
        presetContainer: document.getElementById('presetContainer'),
        powerBtn: document.getElementById('powerBtn'),
        statusDisplay: document.getElementById('statusDisplay'),
        
        sliderColor: document.getElementById('sliderColor'),
        sliderPulse: document.getElementById('sliderPulse'),
        sliderVol: document.getElementById('sliderVol'),
        sliderBinaural: document.getElementById('sliderBinaural'),
        
        // ADSR controls
        sliderAttack: document.getElementById('sliderAttack'),
        sliderDecay: document.getElementById('sliderDecay'),
        sliderSustain: document.getElementById('sliderSustain'),
        sliderRelease: document.getElementById('sliderRelease'),
        sliderDuration: document.getElementById('sliderDuration'),
        checkLoop: document.getElementById('checkLoop'),
        durationGroup: document.getElementById('durationGroup'),
        
        selDist: document.getElementById('selDist'),
        selPulseShape: document.getElementById('selPulseShape'),
        
        checkGrey: document.getElementById('checkGrey'),
        checkBinaural: document.getElementById('checkBinaural'),
        binauralFreqGroup: document.getElementById('binauralFreqGroup'),
        
        valColor: document.getElementById('valColor'),
        valPulse: document.getElementById('valPulse'),
        valVol: document.getElementById('valVol'),
        valBinaural: document.getElementById('valBinaural'),
        valAttack: document.getElementById('valAttack'),
        valDecay: document.getElementById('valDecay'),
        valSustain: document.getElementById('valSustain'),
        valRelease: document.getElementById('valRelease'),
        valDuration: document.getElementById('valDuration'),
        
        // Advanced controls
        sliderPanRate: document.getElementById('sliderPanRate'),
        sliderPanDepth: document.getElementById('sliderPanDepth'),
        valPanRate: document.getElementById('valPanRate'),
        valPanDepth: document.getElementById('valPanDepth'),
        sliderColor2: document.getElementById('sliderColor2'),
        sliderColorBlend: document.getElementById('sliderColorBlend'),
        valColor2: document.getElementById('valColor2'),
        valColorBlend: document.getElementById('valColorBlend'),
        sliderSaturation: document.getElementById('sliderSaturation'),
        selSaturationMode: document.getElementById('selSaturationMode'),
        valSaturation: document.getElementById('valSaturation'),
        sliderBitDepth: document.getElementById('sliderBitDepth'),
        sliderDownsample: document.getElementById('sliderDownsample'),
        valBitDepth: document.getElementById('valBitDepth'),
        valDownsample: document.getElementById('valDownsample'),
        
        timerDisplay: document.getElementById('timerDisplay'),
        timerCancel: document.getElementById('timerCancel'),
        
        presetNameInput: document.getElementById('presetNameInput'),
        savePresetBtn: document.getElementById('savePresetBtn'),
        resetBtn: document.getElementById('resetBtn'),
        
        vizBarsBtn: document.getElementById('vizBars'),
        vizWaveBtn: document.getElementById('vizWave'),
        canvas: document.getElementById('visualizer')
    };
    
    elements.ctx = elements.canvas.getContext('2d');
    
    // Render presets
    renderPresets();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load from URL if present
    loadFromURL();
    
    // Update labels
    updateLabels();
    
    // Initialize canvas
    resizeCanvas();
    drawEmptyVisualizer();
}

/**
 * Render preset buttons
 */
function renderPresets() {
    elements.presetContainer.innerHTML = '';
    
    const presetsToShow = currentFilter === 'all' 
        ? builtInPresets 
        : builtInPresets.filter(p => p.category === currentFilter);
    
    presetsToShow.forEach((preset, idx) => {
        const btn = createPresetButton(preset, idx);
        elements.presetContainer.appendChild(btn);
    });
    
    // Custom presets
    customPresets.forEach((preset, idx) => {
        const btn = createCustomPresetButton(preset, idx);
        elements.presetContainer.appendChild(btn);
    });
}

/**
 * Create a preset button element
 */
function createPresetButton(preset, idx) {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.setAttribute('data-category', preset.category);
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    
    let metaInfo;
    if (preset.loop) {
        // Looping: show A/D/S/R
        const a = preset.attack ?? 0.5;
        const d = preset.decay ?? 0;
        const s = Math.round((preset.sustain ?? 1) * 100);
        const r = preset.release ?? 0.5;
        metaInfo = `↻ ${a}/${d}/${s}%/${r}s`;
    } else {
        // Non-looping: show just attack
        const a = preset.attack ?? 0.5;
        metaInfo = `${a}s fade in`;
    }
    
    btn.innerHTML = `<span class="preset-name">${preset.name}</span><span class="preset-meta">${metaInfo}</span>`;
    
    btn.onclick = () => activatePreset(preset, btn);
    
    if (currentFilter === 'all' && idx < 9) {
        btn.title = `Press ${idx + 1} to activate`;
    }
    
    return btn;
}

/**
 * Create a custom preset button with delete option
 */
function createCustomPresetButton(preset, idx) {
    const btn = document.createElement('button');
    btn.className = 'preset-btn custom';
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    
    const fadeInfo = `${preset.fadeIn || 1}s/${preset.fadeOut || 2}s`;
    btn.innerHTML = `
        <span class="preset-name">${preset.name}</span>
        <span class="preset-meta">${fadeInfo}</span>
        <button class="delete-preset" aria-label="Delete preset">×</button>
    `;
    
    btn.onclick = (e) => {
        if (e.target.classList.contains('delete-preset')) {
            deleteCustomPreset(idx);
        } else {
            activatePreset(preset, btn);
        }
    };
    
    return btn;
}

/**
 * Activate a preset
 */
async function activatePreset(preset, btnElem) {
    // Initialize audio if needed
    if (!audioEngine.initialized) {
        await audioEngine.init();
    }
    
    currentSettings = { ...preset };
    currentPresetName = preset.name;
    
    // Update UI selection
    document.querySelectorAll('.preset-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    btnElem.classList.add('active');
    btnElem.setAttribute('aria-selected', 'true');
    activePresetBtn = btnElem;
    
    // Sync controls to preset values
    syncControlsToSettings();
    
    // Apply to audio engine
    audioEngine.applySettings(currentSettings, true);
    
    // Update URL
    updateURL();
    
    // Start playing if not already
    if (!audioEngine.isPlaying) {
        const adsr = getADSRFromSettings(currentSettings);
        audioEngine.start(adsr);
        updatePlayingUI(true);
        startVisualizer();
    }
    
    elements.statusDisplay.textContent = "Playing: " + preset.name;
}

/**
 * Convert settings to ADSR object
 * Supports both old fadeIn/fadeOut and new ADSR fields
 */
function getADSRFromSettings(settings) {
    return {
        attack: settings.attack ?? settings.fadeIn ?? 0.5,
        decay: settings.decay ?? 0,
        sustain: settings.sustain ?? 1,
        release: settings.release ?? settings.fadeOut ?? 0.5,
        duration: settings.duration ?? null,
        loop: settings.loop ?? false
    };
}

/**
 * Sync control elements to current settings
 */
function syncControlsToSettings() {
    elements.sliderColor.value = currentSettings.alpha;
    elements.sliderPulse.value = currentSettings.pulse;
    elements.selPulseShape.value = currentSettings.pulseShape || 'sine';
    elements.selDist.value = currentSettings.dist;
    elements.checkGrey.checked = currentSettings.grey;
    elements.checkBinaural.checked = currentSettings.binaural || false;
    elements.sliderBinaural.value = currentSettings.binauralFreq || 10;
    
    // ADSR - support both old fadeIn/fadeOut and new ADSR fields
    elements.sliderAttack.value = currentSettings.attack ?? currentSettings.fadeIn ?? 0.5;
    elements.sliderDecay.value = currentSettings.decay ?? 0;
    elements.sliderSustain.value = currentSettings.sustain ?? 1;
    elements.sliderRelease.value = currentSettings.release ?? currentSettings.fadeOut ?? 0.5;
    elements.sliderDuration.value = currentSettings.duration ?? 2;
    elements.checkLoop.checked = currentSettings.loop ?? false;
    
    elements.binauralFreqGroup.style.display = currentSettings.binaural ? 'block' : 'none';
    // Show duration only when looping
    elements.durationGroup.style.display = currentSettings.loop ? 'block' : 'none';
    
    // Advanced - pan
    elements.sliderPanRate.value = currentSettings.panRate ?? 0;
    elements.sliderPanDepth.value = currentSettings.panDepth ?? 0;
    
    // Advanced - color layering
    elements.sliderColor2.value = currentSettings.alpha2 ?? 3;
    elements.sliderColorBlend.value = currentSettings.colorBlend ?? 0;
    
    // Advanced - saturation
    elements.sliderSaturation.value = currentSettings.saturation ?? 0;
    elements.selSaturationMode.value = currentSettings.saturationMode ?? 'soft';
    
    // Advanced - bitcrushing
    elements.sliderBitDepth.value = currentSettings.bitDepth ?? 16;
    elements.sliderDownsample.value = currentSettings.sampleRateReduction ?? 1;
    
    updateLabels();
}

/**
 * Update label displays
 */
function updateLabels() {
    const c = parseFloat(elements.sliderColor.value);
    if (c < 0.5) elements.valColor.textContent = "Violet";
    else if (c < 1.5) elements.valColor.textContent = "Blue";
    else if (c < 2.5) elements.valColor.textContent = "White";
    else if (c < 3.5) elements.valColor.textContent = "Pink";
    else elements.valColor.textContent = "Brown";
    
    const p = parseFloat(elements.sliderPulse.value);
    elements.valPulse.textContent = p === 0 ? "Off" : p.toFixed(2) + " Hz";
    
    elements.valVol.textContent = Math.round(elements.sliderVol.value * 100) + "%";
    elements.valBinaural.textContent = elements.sliderBinaural.value + " Hz";
    
    // ADSR labels
    const attack = parseFloat(elements.sliderAttack.value);
    elements.valAttack.textContent = attack === 0 ? "Instant" : attack.toFixed(1) + "s";
    
    const decay = parseFloat(elements.sliderDecay.value);
    elements.valDecay.textContent = decay === 0 ? "None" : decay.toFixed(1) + "s";
    
    const sustain = parseFloat(elements.sliderSustain.value);
    elements.valSustain.textContent = Math.round(sustain * 100) + "%";
    
    const release = parseFloat(elements.sliderRelease.value);
    elements.valRelease.textContent = release === 0 ? "Instant" : release.toFixed(1) + "s";
    
    const duration = parseFloat(elements.sliderDuration.value);
    elements.valDuration.textContent = duration.toFixed(1) + "s";
    
    // Pan labels
    const panRate = parseFloat(elements.sliderPanRate.value);
    elements.valPanRate.textContent = panRate === 0 ? "Off" : panRate.toFixed(2) + " Hz";
    
    const panDepth = parseFloat(elements.sliderPanDepth.value);
    elements.valPanDepth.textContent = Math.round(panDepth * 100) + "%";
    
    // Color 2 label
    const c2 = parseFloat(elements.sliderColor2.value);
    if (c2 < 0.5) elements.valColor2.textContent = "Violet";
    else if (c2 < 1.5) elements.valColor2.textContent = "Blue";
    else if (c2 < 2.5) elements.valColor2.textContent = "White";
    else if (c2 < 3.5) elements.valColor2.textContent = "Pink";
    else elements.valColor2.textContent = "Brown";
    
    const colorBlend = parseFloat(elements.sliderColorBlend.value);
    elements.valColorBlend.textContent = Math.round(colorBlend * 100) + "%";
    
    // Saturation label
    const saturation = parseFloat(elements.sliderSaturation.value);
    elements.valSaturation.textContent = Math.round(saturation * 100) + "%";
    
    // Bitcrushing labels
    const bitDepth = parseInt(elements.sliderBitDepth.value);
    elements.valBitDepth.textContent = bitDepth + "-bit";
    
    const downsample = parseInt(elements.sliderDownsample.value);
    elements.valDownsample.textContent = downsample + "x";
}

/**
 * Sync settings from control values
 */
function syncSettingsFromControls() {
    const isLooping = elements.checkLoop.checked;
    
    currentSettings = {
        alpha: parseFloat(elements.sliderColor.value),
        pulse: parseFloat(elements.sliderPulse.value),
        pulseShape: elements.selPulseShape.value,
        grey: elements.checkGrey.checked,
        dist: parseInt(elements.selDist.value),
        binaural: elements.checkBinaural.checked,
        binauralFreq: parseFloat(elements.sliderBinaural.value),
        // ADSR
        attack: parseFloat(elements.sliderAttack.value),
        decay: parseFloat(elements.sliderDecay.value),
        sustain: parseFloat(elements.sliderSustain.value),
        release: parseFloat(elements.sliderRelease.value),
        duration: isLooping ? parseFloat(elements.sliderDuration.value) : null,
        loop: isLooping,
        // Advanced - pan
        panRate: parseFloat(elements.sliderPanRate.value),
        panDepth: parseFloat(elements.sliderPanDepth.value),
        // Advanced - color layering
        alpha2: parseFloat(elements.sliderColor2.value),
        colorBlend: parseFloat(elements.sliderColorBlend.value),
        // Advanced - saturation
        saturation: parseFloat(elements.sliderSaturation.value),
        saturationMode: elements.selSaturationMode.value,
        // Advanced - bitcrushing
        bitDepth: parseInt(elements.sliderBitDepth.value),
        sampleRateReduction: parseInt(elements.sliderDownsample.value),
        // Preserve texture filters from preset
        resonant: currentSettings.resonant,
        comb: currentSettings.comb
    };
    
    // Show/hide duration based on loop
    elements.durationGroup.style.display = isLooping ? 'block' : 'none';
    
    // Deselect preset when manually adjusting
    if (activePresetBtn) {
        activePresetBtn.classList.remove('active');
        activePresetBtn.setAttribute('aria-selected', 'false');
        activePresetBtn = null;
    }
    currentPresetName = "Custom";
    
    updateLabels();
    
    if (audioEngine.initialized) {
        audioEngine.applySettings(currentSettings, false);
        
        // If playing and looping was just enabled/changed, restart with new envelope
        if (audioEngine.isPlaying && isLooping) {
            const adsr = getADSRFromSettings(currentSettings);
            audioEngine.start(adsr);
        }
    }
    
    updateURL();
    
    if (audioEngine.isPlaying) {
        elements.statusDisplay.textContent = "Playing: Custom";
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Power button
    elements.powerBtn.onclick = togglePower;
    
    // Control sliders
    [elements.sliderColor, elements.sliderPulse, elements.selPulseShape, 
     elements.selDist, elements.checkGrey,
     elements.sliderAttack, elements.sliderDecay, elements.sliderSustain,
     elements.sliderRelease, elements.sliderDuration,
     elements.sliderPanRate, elements.sliderPanDepth,
     elements.sliderColor2, elements.sliderColorBlend,
     elements.sliderSaturation, elements.selSaturationMode,
     elements.sliderBitDepth, elements.sliderDownsample].forEach(el => {
        el.addEventListener('input', syncSettingsFromControls);
    });
    
    // Loop toggle
    elements.checkLoop.addEventListener('change', syncSettingsFromControls);
    
    // Binaural toggle
    elements.checkBinaural.addEventListener('change', () => {
        elements.binauralFreqGroup.style.display = elements.checkBinaural.checked ? 'block' : 'none';
        syncSettingsFromControls();
    });
    
    elements.sliderBinaural.addEventListener('input', () => {
        updateLabels();
        syncSettingsFromControls();
    });
    
    // Volume (doesn't change preset)
    elements.sliderVol.addEventListener('input', () => {
        updateLabels();
        audioEngine.setVolume(parseFloat(elements.sliderVol.value));
    });
    
    // Reset button
    elements.resetBtn.addEventListener('click', resetToDefaults);
    
    // Save preset
    elements.savePresetBtn.addEventListener('click', saveCurrentAsPreset);
    elements.presetNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveCurrentAsPreset();
    });
    
    // Filter buttons
    document.querySelectorAll('.preset-filter button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-filter button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderPresets();
        });
    });
    
    // Visualizer toggle
    elements.vizBarsBtn.addEventListener('click', () => {
        vizMode = 'bars';
        elements.vizBarsBtn.classList.add('active');
        elements.vizWaveBtn.classList.remove('active');
    });
    
    elements.vizWaveBtn.addEventListener('click', () => {
        vizMode = 'wave';
        elements.vizWaveBtn.classList.add('active');
        elements.vizBarsBtn.classList.remove('active');
    });
    
    // Timer presets
    document.querySelectorAll('.timer-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mins = parseInt(btn.dataset.mins);
            startTimer(mins);
            document.querySelectorAll('.timer-preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    elements.timerCancel.addEventListener('click', cancelTimer);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Window resize
    window.addEventListener('resize', resizeCanvas);
}

/**
 * Toggle power on/off
 */
async function togglePower() {
    if (!audioEngine.initialized) {
        await audioEngine.init();
    }
    
    if (audioEngine.isPlaying) {
        // Stop immediately (short release, ignore preset's release time)
        audioEngine.stop(0.1, () => {
            audioEngine.suspend();
        });
        updatePlayingUI(false);
        stopVisualizer();
        elements.statusDisplay.textContent = "System Standby";
    } else {
        // Start with preset's ADSR
        audioEngine.applySettings(currentSettings, true);
        const adsr = getADSRFromSettings(currentSettings);
        audioEngine.start(adsr);
        updatePlayingUI(true);
        startVisualizer();
        elements.statusDisplay.textContent = "Playing: " + currentPresetName;
    }
}

/**
 * Update UI for playing/stopped state
 */
function updatePlayingUI(playing) {
    if (playing) {
        elements.powerBtn.innerHTML = "⏻ Power Off";
        elements.powerBtn.classList.add('playing');
    } else {
        elements.powerBtn.innerHTML = "⏻ Power On";
        elements.powerBtn.classList.remove('playing');
    }
}

/**
 * Reset controls to defaults
 */
function resetToDefaults() {
    currentSettings = { ...defaultSettings };
    syncControlsToSettings();
    
    if (audioEngine.initialized) {
        audioEngine.applySettings(currentSettings, true);
    }
}

/**
 * Save current settings as a custom preset
 */
function saveCurrentAsPreset() {
    const name = elements.presetNameInput.value.trim();
    if (!name) {
        elements.presetNameInput.focus();
        return;
    }
    
    const newPreset = {
        name,
        category: "custom",
        ...currentSettings
    };
    
    customPresets.push(newPreset);
    saveCustomPresets(customPresets);
    renderPresets();
    elements.presetNameInput.value = '';
}

/**
 * Delete a custom preset
 */
function deleteCustomPreset(idx) {
    customPresets.splice(idx, 1);
    saveCustomPresets(customPresets);
    renderPresets();
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePower();
            break;
        case 'ArrowUp':
            e.preventDefault();
            elements.sliderVol.value = Math.min(1, parseFloat(elements.sliderVol.value) + 0.05);
            elements.sliderVol.dispatchEvent(new Event('input'));
            break;
        case 'ArrowDown':
            e.preventDefault();
            elements.sliderVol.value = Math.max(0, parseFloat(elements.sliderVol.value) - 0.05);
            elements.sliderVol.dispatchEvent(new Event('input'));
            break;
        case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4': case 'Digit5':
        case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
            const idx = parseInt(e.code.replace('Digit', '')) - 1;
            const btns = elements.presetContainer.querySelectorAll('.preset-btn:not(.custom)');
            if (btns[idx]) btns[idx].click();
            break;
    }
}

// === TIMER ===

function startTimer(minutes) {
    if (timerInterval) clearInterval(timerInterval);
    
    timerEndTime = Date.now() + minutes * 60 * 1000;
    timerFadeStarted = false;
    elements.timerCancel.style.display = 'inline-block';
    elements.timerDisplay.classList.add('active');
    elements.timerDisplay.classList.remove('fading');
    
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    const remaining = timerEndTime - Date.now();
    const adsr = getADSRFromSettings(currentSettings);
    const fadeOutDuration = adsr.release * 1000;
    
    // Start fade early
    if (remaining <= fadeOutDuration && !timerFadeStarted && audioEngine.isPlaying) {
        timerFadeStarted = true;
        elements.timerDisplay.classList.add('fading');
        elements.timerDisplay.classList.remove('active');
        
        // Use the preset's release for a gradual wind-down
        audioEngine.stop(adsr.release, () => {
            audioEngine.suspend();
        });
        updatePlayingUI(false);
    }
    
    if (remaining <= 0) {
        cancelTimer();
        return;
    }
    
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    elements.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function cancelTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerEndTime = null;
    timerFadeStarted = false;
    elements.timerDisplay.textContent = '--:--';
    elements.timerDisplay.classList.remove('active', 'fading');
    elements.timerCancel.style.display = 'none';
    document.querySelectorAll('.timer-preset-btn').forEach(b => b.classList.remove('active'));
}

// === VISUALIZER ===

function resizeCanvas() {
    if (!elements.canvas) return;
    const rect = elements.canvas.parentElement.getBoundingClientRect();
    elements.canvas.width = rect.width - 32;
    elements.canvas.height = 80;
}

function drawEmptyVisualizer() {
    if (!elements.ctx) return;
    elements.ctx.fillStyle = '#0a0a0f';
    elements.ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function drawBars() {
    const data = audioEngine.getFrequencyData();
    if (!data) return;
    
    const ctx = elements.ctx;
    const canvas = elements.canvas;
    
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / data.length) * 2;
    let x = 0;
    
    for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * canvas.height * 0.9;
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#00e5cc');
        gradient.addColorStop(1, '#7b61ff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        
        x += barWidth;
    }
}

function drawWave() {
    const data = audioEngine.getWaveformData();
    if (!data) return;
    
    const ctx = elements.ctx;
    const canvas = elements.canvas;
    
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00e5cc';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00e5cc';
    
    ctx.beginPath();
    const sliceWidth = canvas.width / data.length;
    let x = 0;
    
    for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = (v * canvas.height) / 2;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function visualizerLoop() {
    if (vizMode === 'bars') drawBars();
    else drawWave();
    animationId = requestAnimationFrame(visualizerLoop);
}

function startVisualizer() {
    if (!animationId) visualizerLoop();
}

function stopVisualizer() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    drawEmptyVisualizer();
}

// === URL STATE ===

function updateURL() {
    const params = new URLSearchParams();
    params.set('c', currentSettings.alpha);
    params.set('p', currentSettings.pulse);
    params.set('ps', currentSettings.pulseShape);
    params.set('g', currentSettings.grey ? '1' : '0');
    params.set('d', currentSettings.dist);
    params.set('b', currentSettings.binaural ? '1' : '0');
    params.set('bf', currentSettings.binauralFreq);
    // ADSR
    params.set('a', currentSettings.attack ?? 0.5);
    params.set('dc', currentSettings.decay ?? 0);
    params.set('s', currentSettings.sustain ?? 1);
    params.set('r', currentSettings.release ?? 0.5);
    if (currentSettings.loop) {
        params.set('dur', currentSettings.duration ?? 2);
        params.set('loop', '1');
    }
    params.set('v', elements.sliderVol.value);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, '', newUrl);
}

function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('c')) currentSettings.alpha = parseFloat(params.get('c'));
    if (params.has('p')) currentSettings.pulse = parseFloat(params.get('p'));
    if (params.has('ps')) currentSettings.pulseShape = params.get('ps');
    if (params.has('g')) currentSettings.grey = params.get('g') === '1';
    if (params.has('d')) currentSettings.dist = parseInt(params.get('d'));
    if (params.has('b')) currentSettings.binaural = params.get('b') === '1';
    if (params.has('bf')) currentSettings.binauralFreq = parseFloat(params.get('bf'));
    // ADSR - support old format too
    if (params.has('a')) currentSettings.attack = parseFloat(params.get('a'));
    else if (params.has('fi')) currentSettings.attack = parseInt(params.get('fi'));
    if (params.has('dc')) currentSettings.decay = parseFloat(params.get('dc'));
    if (params.has('s')) currentSettings.sustain = parseFloat(params.get('s'));
    if (params.has('r')) currentSettings.release = parseFloat(params.get('r'));
    else if (params.has('fo')) currentSettings.release = parseInt(params.get('fo'));
    if (params.has('dur')) currentSettings.duration = parseFloat(params.get('dur'));
    if (params.has('loop')) currentSettings.loop = params.get('loop') === '1';
    if (params.has('v')) elements.sliderVol.value = parseFloat(params.get('v'));
    
    syncControlsToSettings();
}
