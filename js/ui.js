/**
 * UI Module - DOM manipulation and event handling for Colored Noise
 * Supports multi-voice polyrhythmic presets
 */

import { audioEngine, Voice } from './audio-engine.js';
import { builtInPresets, categories, defaultSettings, loadCustomPresets, saveCustomPresets } from './presets.js';

// State
let currentSettings = { ...defaultSettings };
let currentPresetName = "Standard Pink";
let customPresets = loadCustomPresets();
let activePresetBtn = null;
let currentFilter = 'all';
let vizMode = 'bars';
let animationId = null;

// Voice state
let currentVoiceIndex = 0;
let voiceSettings = [
    { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false },
    { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false },
    { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false },
    { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false }
];

// Timer state
let timerInterval = null;
let timerEndTime = null;
let timerFadeStarted = false;

// DOM Elements
let elements = {};

/**
 * Initialize UI
 */
export function initUI() {
    elements = {
        presetContainer: document.getElementById('presetContainer'),
        powerBtn: document.getElementById('powerBtn'),
        statusDisplay: document.getElementById('statusDisplay'),
        
        sliderVol: document.getElementById('sliderVol'),
        valVol: document.getElementById('valVol'),
        
        // Voice tabs
        voiceTabs: document.querySelectorAll('.voice-tab'),
        voiceEnableRow: document.getElementById('voiceEnableRow'),
        checkVoiceEnabled: document.getElementById('checkVoiceEnabled'),
        
        // Voice controls
        sliderVoiceColor: document.getElementById('sliderVoiceColor'),
        sliderVoiceVolume: document.getElementById('sliderVoiceVolume'),
        sliderVoicePan: document.getElementById('sliderVoicePan'),
        sliderVoiceAttack: document.getElementById('sliderVoiceAttack'),
        sliderVoiceDecay: document.getElementById('sliderVoiceDecay'),
        sliderVoiceSustain: document.getElementById('sliderVoiceSustain'),
        sliderVoiceRelease: document.getElementById('sliderVoiceRelease'),
        sliderVoiceDuration: document.getElementById('sliderVoiceDuration'),
        checkVoiceLoop: document.getElementById('checkVoiceLoop'),
        voiceDurationGroup: document.getElementById('voiceDurationGroup'),
        
        valVoiceColor: document.getElementById('valVoiceColor'),
        valVoiceVolume: document.getElementById('valVoiceVolume'),
        valVoicePan: document.getElementById('valVoicePan'),
        valVoiceAttack: document.getElementById('valVoiceAttack'),
        valVoiceDecay: document.getElementById('valVoiceDecay'),
        valVoiceSustain: document.getElementById('valVoiceSustain'),
        valVoiceRelease: document.getElementById('valVoiceRelease'),
        valVoiceDuration: document.getElementById('valVoiceDuration'),
        
        // Global controls
        sliderPulse: document.getElementById('sliderPulse'),
        selPulseShape: document.getElementById('selPulseShape'),
        selDist: document.getElementById('selDist'),
        checkGrey: document.getElementById('checkGrey'),
        checkBinaural: document.getElementById('checkBinaural'),
        sliderBinaural: document.getElementById('sliderBinaural'),
        binauralFreqGroup: document.getElementById('binauralFreqGroup'),
        
        valPulse: document.getElementById('valPulse'),
        valBinaural: document.getElementById('valBinaural'),
        
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
        sliderReverbMix: document.getElementById('sliderReverbMix'),
        selReverbSize: document.getElementById('selReverbSize'),
        valReverbMix: document.getElementById('valReverbMix'),
        
        timerDisplay: document.getElementById('timerDisplay'),
        timerCancel: document.getElementById('timerCancel'),
        
        presetNameInput: document.getElementById('presetNameInput'),
        savePresetBtn: document.getElementById('savePresetBtn'),
        resetBtn: document.getElementById('resetBtn'),
        
        // Export
        sliderExportDuration: document.getElementById('sliderExportDuration'),
        valExportDuration: document.getElementById('valExportDuration'),
        exportBtn: document.getElementById('exportBtn'),
        exportProgress: document.getElementById('exportProgress'),
        exportProgressBar: document.getElementById('exportProgressBar'),
        exportProgressText: document.getElementById('exportProgressText'),
        
        // Composition
        compositionFile: document.getElementById('compositionFile'),
        compositionEditor: document.getElementById('compositionEditor'),
        compositionStatus: document.getElementById('compositionStatus'),
        validateComposition: document.getElementById('validateComposition'),
        loadExample: document.getElementById('loadExample'),
        playComposition: document.getElementById('playComposition'),
        stopComposition: document.getElementById('stopComposition'),
        exportComposition: document.getElementById('exportComposition'),
        
        vizBarsBtn: document.getElementById('vizBars'),
        vizWaveBtn: document.getElementById('vizWave'),
        canvas: document.getElementById('visualizer')
    };
    
    elements.ctx = elements.canvas.getContext('2d');
    
    renderPresets();
    setupEventListeners();
    loadFromURL();
    updateLabels();
    updateVoiceTabStates();
    
    elements.statusDisplay.textContent = "System Standby";
}

// === PRESETS ===

function renderPresets() {
    elements.presetContainer.innerHTML = '';
    
    const allPresets = [...builtInPresets, ...customPresets];
    let visibleIndex = 0;
    
    allPresets.forEach((preset, idx) => {
        if (currentFilter !== 'all' && preset.category !== currentFilter) return;
        
        const btn = createPresetButton(preset, visibleIndex);
        elements.presetContainer.appendChild(btn);
        visibleIndex++;
    });
}

function createPresetButton(preset, idx) {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.setAttribute('data-category', preset.category);
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    
    let metaInfo;
    if (preset.voices) {
        // Multi-voice preset
        const voiceCount = preset.voices.filter(v => v && v.enabled !== false).length;
        metaInfo = `${voiceCount} voices`;
    } else if (preset.loop) {
        const a = preset.attack ?? 0.5;
        const d = preset.decay ?? 0;
        const s = Math.round((preset.sustain ?? 1) * 100);
        const r = preset.release ?? 0.5;
        metaInfo = `↻ ${a}/${d}/${s}%/${r}s`;
    } else {
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

async function activatePreset(preset, btnElem) {
    if (!audioEngine.initialized) {
        await audioEngine.init();
    }
    
    currentSettings = { ...preset };
    currentPresetName = preset.name;
    
    document.querySelectorAll('.preset-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    btnElem.classList.add('active');
    btnElem.setAttribute('aria-selected', 'true');
    activePresetBtn = btnElem;
    
    // Handle multi-voice presets
    if (preset.voices && Array.isArray(preset.voices)) {
        for (let i = 0; i < 4; i++) {
            if (preset.voices[i]) {
                voiceSettings[i] = { ...voiceSettings[i], ...preset.voices[i] };
                if (i === 0) {
                    voiceSettings[i].enabled = true; // Voice 1 always enabled
                }
            } else if (i > 0) {
                voiceSettings[i].enabled = false;
            }
        }
    } else {
        // Single voice preset - apply to voice 1, disable others
        voiceSettings[0] = {
            color: preset.alpha ?? 3,
            volume: 0.8,
            pan: 0,
            attack: preset.attack ?? 0.5,
            decay: preset.decay ?? 0,
            sustain: preset.sustain ?? 1,
            release: preset.release ?? 0.5,
            duration: preset.duration ?? 2,
            loop: preset.loop ?? false,
            enabled: true
        };
        for (let i = 1; i < 4; i++) {
            voiceSettings[i].enabled = false;
        }
    }
    
    syncControlsToCurrentVoice();
    syncGlobalControlsToSettings();
    updateVoiceTabStates();
    
    audioEngine.applySettings(buildFullSettings(), true);
    
    updateURL();
    
    if (!audioEngine.isPlaying) {
        audioEngine.start();
        updatePlayingUI(true);
        startVisualizer();
    }
    
    elements.statusDisplay.textContent = "Playing: " + preset.name;
}

function buildFullSettings() {
    return {
        ...currentSettings,
        voices: voiceSettings.map((v, i) => ({
            ...v,
            enabled: i === 0 ? true : v.enabled
        }))
    };
}

// === VOICE TABS ===

function selectVoiceTab(index) {
    currentVoiceIndex = index;
    
    elements.voiceTabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    // Show/hide enable toggle (hidden for voice 1)
    elements.voiceEnableRow.style.display = index === 0 ? 'none' : 'flex';
    
    syncControlsToCurrentVoice();
    updateLabels();
}

function updateVoiceTabStates() {
    elements.voiceTabs.forEach((tab, i) => {
        const isEnabled = i === 0 || voiceSettings[i].enabled;
        tab.classList.toggle('enabled', isEnabled);
        tab.classList.toggle('disabled', !isEnabled && i > 0);
    });
}

function syncControlsToCurrentVoice() {
    const v = voiceSettings[currentVoiceIndex];
    
    elements.checkVoiceEnabled.checked = currentVoiceIndex === 0 ? true : v.enabled;
    elements.sliderVoiceColor.value = v.color;
    elements.sliderVoiceVolume.value = v.volume;
    elements.sliderVoicePan.value = v.pan;
    elements.sliderVoiceAttack.value = v.attack;
    elements.sliderVoiceDecay.value = v.decay;
    elements.sliderVoiceSustain.value = v.sustain;
    elements.sliderVoiceRelease.value = v.release;
    elements.sliderVoiceDuration.value = v.duration ?? 2;
    elements.checkVoiceLoop.checked = v.loop;
    
    elements.voiceDurationGroup.style.display = v.loop ? 'block' : 'none';
    
    updateVoiceLabels();
}

function syncCurrentVoiceFromControls() {
    const v = voiceSettings[currentVoiceIndex];
    
    if (currentVoiceIndex > 0) {
        v.enabled = elements.checkVoiceEnabled.checked;
    }
    v.color = parseFloat(elements.sliderVoiceColor.value);
    v.volume = parseFloat(elements.sliderVoiceVolume.value);
    v.pan = parseFloat(elements.sliderVoicePan.value);
    v.attack = parseFloat(elements.sliderVoiceAttack.value);
    v.decay = parseFloat(elements.sliderVoiceDecay.value);
    v.sustain = parseFloat(elements.sliderVoiceSustain.value);
    v.release = parseFloat(elements.sliderVoiceRelease.value);
    v.duration = elements.checkVoiceLoop.checked ? parseFloat(elements.sliderVoiceDuration.value) : null;
    v.loop = elements.checkVoiceLoop.checked;
    
    elements.voiceDurationGroup.style.display = v.loop ? 'block' : 'none';
    
    updateVoiceTabStates();
    updateVoiceLabels();
    
    if (audioEngine.initialized) {
        // Enable/disable voice
        if (currentVoiceIndex > 0) {
            if (v.enabled) {
                audioEngine.enableVoice(currentVoiceIndex);
            } else {
                audioEngine.disableVoice(currentVoiceIndex);
            }
        }
        
        audioEngine.applyVoiceSettings(currentVoiceIndex, v, false);
        
        // If playing and voice was just enabled, start it
        if (audioEngine.isPlaying && v.enabled) {
            audioEngine.voices[currentVoiceIndex].start();
        }
    }
    
    markAsCustom();
}

function syncGlobalControlsToSettings() {
    elements.sliderPulse.value = currentSettings.pulse ?? 0;
    elements.selPulseShape.value = currentSettings.pulseShape ?? 'sine';
    elements.selDist.value = currentSettings.dist ?? 0;
    elements.checkGrey.checked = currentSettings.grey ?? false;
    elements.checkBinaural.checked = currentSettings.binaural ?? false;
    elements.sliderBinaural.value = currentSettings.binauralFreq ?? 10;
    elements.binauralFreqGroup.style.display = currentSettings.binaural ? 'block' : 'none';
    
    // Advanced
    elements.sliderPanRate.value = currentSettings.panRate ?? 0;
    elements.sliderPanDepth.value = currentSettings.panDepth ?? 0;
    elements.sliderColor2.value = currentSettings.alpha2 ?? 3;
    elements.sliderColorBlend.value = currentSettings.colorBlend ?? 0;
    elements.sliderSaturation.value = currentSettings.saturation ?? 0;
    elements.selSaturationMode.value = currentSettings.saturationMode ?? 'soft';
    elements.sliderBitDepth.value = currentSettings.bitDepth ?? 16;
    elements.sliderDownsample.value = currentSettings.sampleRateReduction ?? 1;
    elements.sliderReverbMix.value = currentSettings.reverbMix ?? 0;
    elements.selReverbSize.value = currentSettings.reverbSize ?? 'medium';
    
    updateGlobalLabels();
}

function syncGlobalSettingsFromControls() {
    currentSettings.pulse = parseFloat(elements.sliderPulse.value);
    currentSettings.pulseShape = elements.selPulseShape.value;
    currentSettings.dist = parseInt(elements.selDist.value);
    currentSettings.grey = elements.checkGrey.checked;
    currentSettings.binaural = elements.checkBinaural.checked;
    currentSettings.binauralFreq = parseFloat(elements.sliderBinaural.value);
    
    currentSettings.panRate = parseFloat(elements.sliderPanRate.value);
    currentSettings.panDepth = parseFloat(elements.sliderPanDepth.value);
    currentSettings.alpha2 = parseFloat(elements.sliderColor2.value);
    currentSettings.colorBlend = parseFloat(elements.sliderColorBlend.value);
    currentSettings.saturation = parseFloat(elements.sliderSaturation.value);
    currentSettings.saturationMode = elements.selSaturationMode.value;
    currentSettings.bitDepth = parseInt(elements.sliderBitDepth.value);
    currentSettings.sampleRateReduction = parseInt(elements.sliderDownsample.value);
    currentSettings.reverbMix = parseFloat(elements.sliderReverbMix.value);
    currentSettings.reverbSize = elements.selReverbSize.value;
    
    elements.binauralFreqGroup.style.display = currentSettings.binaural ? 'block' : 'none';
    
    updateGlobalLabels();
    
    if (audioEngine.initialized) {
        audioEngine.applyGlobalSettings(currentSettings, false);
    }
    
    markAsCustom();
}

function markAsCustom() {
    if (activePresetBtn) {
        activePresetBtn.classList.remove('active');
        activePresetBtn.setAttribute('aria-selected', 'false');
        activePresetBtn = null;
    }
    currentPresetName = "Custom";
    
    if (audioEngine.isPlaying) {
        elements.statusDisplay.textContent = "Playing: Custom";
    }
    
    updateURL();
}

// === LABELS ===

function updateLabels() {
    updateVoiceLabels();
    updateGlobalLabels();
}

function updateVoiceLabels() {
    const c = parseFloat(elements.sliderVoiceColor.value);
    if (c < 0.5) elements.valVoiceColor.textContent = "Violet";
    else if (c < 1.5) elements.valVoiceColor.textContent = "Blue";
    else if (c < 2.5) elements.valVoiceColor.textContent = "White";
    else if (c < 3.5) elements.valVoiceColor.textContent = "Pink";
    else elements.valVoiceColor.textContent = "Brown";
    
    elements.valVoiceVolume.textContent = Math.round(elements.sliderVoiceVolume.value * 100) + "%";
    
    const pan = parseFloat(elements.sliderVoicePan.value);
    if (pan < -0.05) elements.valVoicePan.textContent = Math.round(Math.abs(pan) * 100) + "% L";
    else if (pan > 0.05) elements.valVoicePan.textContent = Math.round(pan * 100) + "% R";
    else elements.valVoicePan.textContent = "Center";
    
    const attack = parseFloat(elements.sliderVoiceAttack.value);
    elements.valVoiceAttack.textContent = attack === 0 ? "Instant" : attack.toFixed(1) + "s";
    
    const decay = parseFloat(elements.sliderVoiceDecay.value);
    elements.valVoiceDecay.textContent = decay === 0 ? "None" : decay.toFixed(1) + "s";
    
    const sustain = parseFloat(elements.sliderVoiceSustain.value);
    elements.valVoiceSustain.textContent = Math.round(sustain * 100) + "%";
    
    const release = parseFloat(elements.sliderVoiceRelease.value);
    elements.valVoiceRelease.textContent = release === 0 ? "Instant" : release.toFixed(1) + "s";
    
    const duration = parseFloat(elements.sliderVoiceDuration.value);
    elements.valVoiceDuration.textContent = duration.toFixed(1) + "s";
}

function updateGlobalLabels() {
    elements.valVol.textContent = Math.round(elements.sliderVol.value * 100) + "%";
    
    const p = parseFloat(elements.sliderPulse.value);
    elements.valPulse.textContent = p === 0 ? "Off" : p.toFixed(2) + " Hz";
    
    elements.valBinaural.textContent = elements.sliderBinaural.value + " Hz";
    
    const panRate = parseFloat(elements.sliderPanRate.value);
    elements.valPanRate.textContent = panRate === 0 ? "Off" : panRate.toFixed(2) + " Hz";
    
    const panDepth = parseFloat(elements.sliderPanDepth.value);
    elements.valPanDepth.textContent = Math.round(panDepth * 100) + "%";
    
    const c2 = parseFloat(elements.sliderColor2.value);
    if (c2 < 0.5) elements.valColor2.textContent = "Violet";
    else if (c2 < 1.5) elements.valColor2.textContent = "Blue";
    else if (c2 < 2.5) elements.valColor2.textContent = "White";
    else if (c2 < 3.5) elements.valColor2.textContent = "Pink";
    else elements.valColor2.textContent = "Brown";
    
    elements.valColorBlend.textContent = Math.round(elements.sliderColorBlend.value * 100) + "%";
    elements.valSaturation.textContent = Math.round(elements.sliderSaturation.value * 100) + "%";
    elements.valBitDepth.textContent = elements.sliderBitDepth.value + "-bit";
    elements.valDownsample.textContent = elements.sliderDownsample.value + "x";
    elements.valReverbMix.textContent = Math.round(elements.sliderReverbMix.value * 100) + "%";
}

// === EVENT LISTENERS ===

function setupEventListeners() {
    elements.powerBtn.onclick = togglePower;
    
    // Voice tabs
    elements.voiceTabs.forEach((tab, i) => {
        tab.onclick = () => selectVoiceTab(i);
    });
    
    // Voice controls
    elements.checkVoiceEnabled.addEventListener('change', syncCurrentVoiceFromControls);
    elements.checkVoiceLoop.addEventListener('change', syncCurrentVoiceFromControls);
    
    [elements.sliderVoiceColor, elements.sliderVoiceVolume, elements.sliderVoicePan,
     elements.sliderVoiceAttack, elements.sliderVoiceDecay, elements.sliderVoiceSustain,
     elements.sliderVoiceRelease, elements.sliderVoiceDuration].forEach(el => {
        el.addEventListener('input', syncCurrentVoiceFromControls);
    });
    
    // Global controls
    [elements.sliderPulse, elements.selPulseShape, elements.selDist, elements.checkGrey,
     elements.sliderPanRate, elements.sliderPanDepth, elements.sliderColor2, elements.sliderColorBlend,
     elements.sliderSaturation, elements.selSaturationMode, elements.sliderBitDepth, elements.sliderDownsample,
     elements.sliderReverbMix, elements.selReverbSize].forEach(el => {
        el.addEventListener('input', syncGlobalSettingsFromControls);
    });
    
    elements.checkBinaural.addEventListener('change', () => {
        elements.binauralFreqGroup.style.display = elements.checkBinaural.checked ? 'block' : 'none';
        syncGlobalSettingsFromControls();
    });
    
    elements.sliderBinaural.addEventListener('input', () => {
        updateGlobalLabels();
        syncGlobalSettingsFromControls();
    });
    
    // Volume
    elements.sliderVol.addEventListener('input', () => {
        elements.valVol.textContent = Math.round(elements.sliderVol.value * 100) + "%";
        if (audioEngine.initialized) {
            audioEngine.setVolume(parseFloat(elements.sliderVol.value));
        }
    });
    
    // Timer
    document.querySelectorAll('.timer-preset-btn').forEach(btn => {
        btn.onclick = () => startTimer(parseInt(btn.dataset.mins));
    });
    elements.timerCancel.onclick = cancelTimer;
    
    // Presets
    elements.savePresetBtn.onclick = saveCurrentAsPreset;
    elements.resetBtn.onclick = resetToDefaults;
    
    // Export
    elements.sliderExportDuration.addEventListener('input', () => {
        elements.valExportDuration.textContent = elements.sliderExportDuration.value + "s";
    });
    elements.exportBtn.onclick = startExport;
    
    // Composition
    elements.compositionFile.addEventListener('change', handleCompositionUpload);
    elements.validateComposition.onclick = validateCompositionInput;
    elements.loadExample.onclick = loadExampleComposition;
    elements.playComposition.onclick = playComposition;
    elements.stopComposition.onclick = stopComposition;
    elements.exportComposition.onclick = exportCompositionToWav;
    
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderPresets();
        };
    });
    
    // Visualizer
    elements.vizBarsBtn.onclick = () => setVizMode('bars');
    elements.vizWaveBtn.onclick = () => setVizMode('wave');
    
    // Keyboard
    document.addEventListener('keydown', handleKeyboard);
}

// === POWER ===

async function togglePower() {
    if (!audioEngine.initialized) {
        await audioEngine.init();
    }
    
    if (audioEngine.isPlaying) {
        audioEngine.stop(0.1, () => {
            audioEngine.suspend();
        });
        updatePlayingUI(false);
        stopVisualizer();
        elements.statusDisplay.textContent = "System Standby";
    } else {
        audioEngine.applySettings(buildFullSettings(), true);
        audioEngine.start();
        updatePlayingUI(true);
        startVisualizer();
        elements.statusDisplay.textContent = "Playing: " + currentPresetName;
    }
}

function updatePlayingUI(playing) {
    elements.powerBtn.classList.toggle('active', playing);
    elements.powerBtn.setAttribute('aria-pressed', playing);
    elements.powerBtn.querySelector('.power-label').textContent = playing ? "ON" : "OFF";
}

// === TIMER ===

function startTimer(mins) {
    cancelTimer();
    timerEndTime = Date.now() + mins * 60000;
    timerFadeStarted = false;
    
    elements.timerDisplay.classList.add('active');
    elements.timerCancel.style.display = 'inline-flex';
    
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    const remaining = timerEndTime - Date.now();
    const release = voiceSettings[0].release ?? 0.5;
    const fadeOutDuration = release * 1000;
    
    if (remaining <= fadeOutDuration && !timerFadeStarted && audioEngine.isPlaying) {
        timerFadeStarted = true;
        elements.timerDisplay.classList.add('fading');
        elements.timerDisplay.classList.remove('active');
        
        audioEngine.stop(release, () => {
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
    elements.timerDisplay.textContent = "--:--";
    elements.timerDisplay.classList.remove('active', 'fading');
    elements.timerCancel.style.display = 'none';
}

// === VISUALIZER ===

function setVizMode(mode) {
    vizMode = mode;
    elements.vizBarsBtn.classList.toggle('active', mode === 'bars');
    elements.vizWaveBtn.classList.toggle('active', mode === 'wave');
}

function startVisualizer() {
    if (animationId) return;
    drawVisualizer();
}

function stopVisualizer() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function drawVisualizer() {
    if (!audioEngine.isPlaying) {
        stopVisualizer();
        return;
    }
    
    animationId = requestAnimationFrame(drawVisualizer);
    
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const ctx = elements.ctx;
    
    ctx.clearRect(0, 0, width, height);
    
    if (vizMode === 'bars') {
        const dataArray = new Uint8Array(audioEngine.analyser.frequencyBinCount);
        audioEngine.getAnalyserData(dataArray);
        
        const barCount = 32;
        const barWidth = width / barCount;
        const step = Math.floor(dataArray.length / barCount);
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        
        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i * step] / 255;
            const barHeight = value * height * 0.9;
            ctx.fillRect(i * barWidth + 1, height - barHeight, barWidth - 2, barHeight);
        }
    } else {
        const dataArray = new Uint8Array(audioEngine.analyser.fftSize);
        audioEngine.getAnalyserWaveform(dataArray);
        
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const sliceWidth = width / dataArray.length;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            x += sliceWidth;
        }
        
        ctx.stroke();
    }
}

// === URL STATE ===

function updateURL() {
    // Simplified URL state for now
    const params = new URLSearchParams();
    params.set('v', elements.sliderVol.value);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, '', newUrl);
}

function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('v')) elements.sliderVol.value = parseFloat(params.get('v'));
}

// === PRESETS SAVE/RESET ===

function saveCurrentAsPreset() {
    const name = elements.presetNameInput.value.trim();
    if (!name) {
        elements.presetNameInput.focus();
        return;
    }
    
    const newPreset = {
        name,
        category: 'custom',
        ...currentSettings,
        voices: voiceSettings.map((v, i) => ({
            ...v,
            enabled: i === 0 ? true : v.enabled
        }))
    };
    
    const existingIndex = customPresets.findIndex(p => p.name === name);
    if (existingIndex >= 0) {
        customPresets[existingIndex] = newPreset;
    } else {
        customPresets.push(newPreset);
    }
    
    saveCustomPresets(customPresets);
    renderPresets();
    elements.presetNameInput.value = '';
}

function resetToDefaults() {
    currentSettings = { ...defaultSettings };
    voiceSettings = [
        { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: true },
        { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false },
        { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false },
        { color: 3, volume: 0.8, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false }
    ];
    
    syncControlsToCurrentVoice();
    syncGlobalControlsToSettings();
    updateVoiceTabStates();
    
    if (audioEngine.initialized) {
        audioEngine.applySettings(buildFullSettings(), true);
    }
    
    markAsCustom();
}

// === KEYBOARD ===

function handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
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
        default:
            if (e.key >= '1' && e.key <= '9') {
                const buttons = elements.presetContainer.querySelectorAll('.preset-btn');
                const idx = parseInt(e.key) - 1;
                if (buttons[idx]) buttons[idx].click();
            }
    }
}

// === EXPORT (Offline Render) ===

let isExporting = false;

async function startExport() {
    if (isExporting) return;
    
    isExporting = true;
    elements.exportBtn.disabled = true;
    elements.exportBtn.querySelector('.export-label').textContent = 'Rendering...';
    elements.exportProgress.style.display = 'block';
    elements.exportProgressText.textContent = 'Preparing...';
    elements.exportProgressBar.style.setProperty('--progress', '0%');
    
    try {
        const duration = parseInt(elements.sliderExportDuration.value);
        const sampleRate = 44100;
        const length = duration * sampleRate;
        
        // Create offline context
        const offlineCtx = new OfflineAudioContext(2, length, sampleRate);
        
        // Load worklet into offline context
        await offlineCtx.audioWorklet.addModule('worklet/noise-processor.js');
        
        elements.exportProgressText.textContent = 'Rendering audio...';
        elements.exportProgressBar.style.setProperty('--progress', '10%');
        
        // Build the same signal chain as the live audio engine
        const renderedBuffer = await renderAudio(offlineCtx, duration);
        
        elements.exportProgressBar.style.setProperty('--progress', '90%');
        elements.exportProgressText.textContent = 'Converting to WAV...';
        
        // Convert to WAV and download
        const wavBlob = audioBufferToWav(renderedBuffer);
        downloadBlob(wavBlob);
        
        elements.exportProgressBar.style.setProperty('--progress', '100%');
        elements.exportProgressText.textContent = 'Export complete!';
        
    } catch (err) {
        console.error('Export error:', err);
        elements.exportProgressText.textContent = 'Export failed: ' + err.message;
    }
    
    setTimeout(() => {
        isExporting = false;
        elements.exportBtn.disabled = false;
        elements.exportBtn.querySelector('.export-label').textContent = 'Export WAV';
        elements.exportProgress.style.display = 'none';
        elements.exportProgressBar.style.setProperty('--progress', '0%');
    }, 2000);
}

async function renderAudio(ctx, duration) {
    const settings = currentSettings;
    const volume = parseFloat(elements.sliderVol.value);
    
    // Create master gain
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    
    // Create grey EQ
    const greyLow = ctx.createBiquadFilter();
    greyLow.type = 'lowshelf';
    greyLow.frequency.value = 100;
    greyLow.gain.value = settings.grey ? 10 : 0;
    
    const greyHigh = ctx.createBiquadFilter();
    greyHigh.type = 'highshelf';
    greyHigh.frequency.value = 6000;
    greyHigh.gain.value = settings.grey ? 5 : 0;
    
    greyLow.connect(greyHigh);
    greyHigh.connect(masterGain);
    
    // Create voices
    for (let i = 0; i < 4; i++) {
        const v = voiceSettings[i];
        if (i > 0 && !v.enabled) continue;
        
        await renderVoice(ctx, v, duration, greyLow, settings);
    }
    
    // Render
    return await ctx.startRendering();
}

async function renderVoice(ctx, v, duration, destination, globalSettings) {
    // Create noise node
    const noiseNode = new AudioWorkletNode(ctx, 'noise-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2]
    });
    
    // Set color
    const colorParam = noiseNode.parameters.get('color');
    if (colorParam) colorParam.setValueAtTime(v.color, 0);
    
    // Apply global settings to worklet
    const texParam = noiseNode.parameters.get('texture');
    if (texParam) texParam.setValueAtTime(globalSettings.dist || 0, 0);
    
    const bitDepthParam = noiseNode.parameters.get('bitDepth');
    if (bitDepthParam) bitDepthParam.setValueAtTime(globalSettings.bitDepth || 16, 0);
    
    const srrParam = noiseNode.parameters.get('sampleRateReduction');
    if (srrParam) srrParam.setValueAtTime(globalSettings.sampleRateReduction || 1, 0);
    
    // Envelope
    const envelope = ctx.createGain();
    envelope.gain.value = 0;
    
    // Volume
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = v.volume;
    
    // Pan
    const panner = ctx.createStereoPanner();
    panner.pan.value = v.pan;
    
    // Connect
    noiseNode.connect(envelope);
    envelope.connect(voiceGain);
    voiceGain.connect(panner);
    panner.connect(destination);
    
    // Schedule envelope(s)
    const attack = v.attack || 0.5;
    const decay = v.decay || 0;
    const sustain = v.sustain ?? 1;
    const release = v.release || 0.5;
    const voiceDuration = v.duration || 2;
    const loop = v.loop;
    
    if (loop && voiceDuration > 0) {
        // Schedule repeating envelopes
        const cycleTime = attack + decay + voiceDuration + release;
        let time = 0;
        
        while (time < duration) {
            // Attack
            envelope.gain.setValueAtTime(0, time);
            envelope.gain.linearRampToValueAtTime(1, time + attack);
            
            // Decay
            if (decay > 0) {
                envelope.gain.linearRampToValueAtTime(sustain, time + attack + decay);
            } else {
                envelope.gain.setValueAtTime(sustain, time + attack);
            }
            
            // Release
            const releaseStart = time + attack + decay + voiceDuration;
            envelope.gain.setValueAtTime(sustain, releaseStart);
            envelope.gain.linearRampToValueAtTime(0, releaseStart + release);
            
            time += cycleTime;
        }
    } else {
        // Single envelope - fade in and sustain
        envelope.gain.setValueAtTime(0, 0);
        envelope.gain.linearRampToValueAtTime(1, attack);
        if (decay > 0) {
            envelope.gain.linearRampToValueAtTime(sustain, attack + decay);
        }
    }
}

function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;
    
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    // Write samples
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
            const sample = Math.max(-1, Math.min(1, channels[ch][i]));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    a.download = `colorednoise_${currentPresetName.replace(/\s+/g, '_')}_${timestamp}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// === COMPOSITION SYSTEM ===

let parsedComposition = null;
let compositionPlaying = false;
let compositionTimeouts = [];

function handleCompositionUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        elements.compositionEditor.value = event.target.result;
        validateCompositionInput();
    };
    reader.readAsText(file);
}

function loadExampleComposition() {
    const example = {
        voices: {
            bass: [
                { color: 4, volume: 0.7, pan: 0, attack: 1, decay: 0.5, sustain: 0.6, release: 2, duration: 3 },
                { wait: 1 },
                { repeat: 2, events: [
                    { color: 3.5, volume: 0.6, pan: -0.3, attack: 0.5, decay: 0.2, sustain: 0.8, release: 1, duration: 2 },
                    { color: 4, volume: 0.7, pan: 0.3, attack: 0.5, decay: 0.2, sustain: 0.8, release: 1, duration: 2 }
                ]}
            ],
            melody: [
                { wait: 2 },
                { color: 2, volume: 0.5, pan: 0.5, attack: 0.2, decay: 0.1, sustain: 0.9, release: 0.5, duration: 1 },
                { color: 2.5, volume: 0.5, pan: -0.5, attack: 0.2, decay: 0.1, sustain: 0.9, release: 0.5, duration: 1 },
                { repeat: 3, events: [
                    { color: 1.5, volume: 0.4, pan: 0, attack: 0.1, decay: 0.1, sustain: 0.7, release: 0.3, duration: 0.5 }
                ]}
            ]
        },
        global: [
            { grey: true, reverbMix: 0.3, reverbSize: "medium" },
            { wait: 5 },
            { reverbMix: 0.6, reverbSize: "large" }
        ]
    };
    
    elements.compositionEditor.value = JSON.stringify(example, null, 2);
    validateCompositionInput();
}

function validateCompositionInput() {
    const text = elements.compositionEditor.value.trim();
    
    if (!text) {
        setCompositionStatus('', false);
        return null;
    }
    
    try {
        const comp = JSON.parse(text);
        const result = validateComposition(comp);
        
        if (result.valid) {
            parsedComposition = comp;
            setCompositionStatus(`Valid: ${result.voiceCount} voices, ${result.totalDuration.toFixed(1)}s total`, true);
            return comp;
        } else {
            parsedComposition = null;
            setCompositionStatus(`Error: ${result.error}`, false);
            return null;
        }
    } catch (e) {
        parsedComposition = null;
        setCompositionStatus(`Invalid JSON: ${e.message}`, false);
        return null;
    }
}

function validateComposition(comp) {
    // Check structure
    if (!comp.voices || typeof comp.voices !== 'object') {
        return { valid: false, error: 'Missing "voices" object' };
    }
    
    const voiceNames = Object.keys(comp.voices);
    if (voiceNames.length === 0) {
        return { valid: false, error: 'No voices defined' };
    }
    
    let maxDuration = 0;
    
    // Validate each voice
    for (const name of voiceNames) {
        const events = comp.voices[name];
        if (!Array.isArray(events)) {
            return { valid: false, error: `Voice "${name}" must be an array` };
        }
        
        const result = validateEventList(events, `voice "${name}"`);
        if (!result.valid) {
            return result;
        }
        maxDuration = Math.max(maxDuration, result.duration);
    }
    
    // Validate global track if present
    if (comp.global) {
        if (!Array.isArray(comp.global)) {
            return { valid: false, error: '"global" must be an array' };
        }
        const result = validateGlobalEventList(comp.global);
        if (!result.valid) {
            return result;
        }
    }
    
    return { valid: true, voiceCount: voiceNames.length, totalDuration: maxDuration };
}

function validateEventList(events, context, currentTime = 0) {
    let time = currentTime;
    
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        
        // Check for repeat block
        if (event.repeat !== undefined) {
            if (typeof event.repeat !== 'number' || event.repeat < 1) {
                return { valid: false, error: `${context} event ${i}: "repeat" must be a positive number` };
            }
            if (!Array.isArray(event.events)) {
                return { valid: false, error: `${context} event ${i}: repeat block must have "events" array` };
            }
            
            // Validate nested events and calculate duration
            const nestedResult = validateEventList(event.events, `${context} repeat block`, 0);
            if (!nestedResult.valid) {
                return nestedResult;
            }
            time += nestedResult.duration * event.repeat;
            continue;
        }
        
        // Check for wait
        if (event.wait !== undefined) {
            if (typeof event.wait !== 'number' || event.wait < 0) {
                return { valid: false, error: `${context} event ${i}: "wait" must be a non-negative number` };
            }
            time += event.wait;
            
            // If it's just a wait, continue
            if (Object.keys(event).length === 1) {
                continue;
            }
        }
        
        // Validate voice event
        const validation = validateVoiceEvent(event, `${context} event ${i}`);
        if (!validation.valid) {
            return validation;
        }
        
        // Calculate event duration
        const attack = event.attack || 0;
        const decay = event.decay || 0;
        const duration = event.duration || 0;
        const release = event.release || 0;
        time += attack + decay + duration + release;
    }
    
    return { valid: true, duration: time };
}

function validateVoiceEvent(event, context) {
    // Required fields
    if (event.color === undefined) {
        return { valid: false, error: `${context}: missing "color"` };
    }
    if (event.duration === undefined) {
        return { valid: false, error: `${context}: missing "duration"` };
    }
    
    // Range checks
    if (event.color < 0 || event.color > 4) {
        return { valid: false, error: `${context}: "color" must be 0-4` };
    }
    if (event.volume !== undefined && (event.volume < 0 || event.volume > 1)) {
        return { valid: false, error: `${context}: "volume" must be 0-1` };
    }
    if (event.pan !== undefined && (event.pan < -1 || event.pan > 1)) {
        return { valid: false, error: `${context}: "pan" must be -1 to 1` };
    }
    if (event.sustain !== undefined && (event.sustain < 0 || event.sustain > 1)) {
        return { valid: false, error: `${context}: "sustain" must be 0-1` };
    }
    if (event.duration < 0) {
        return { valid: false, error: `${context}: "duration" must be non-negative` };
    }
    
    return { valid: true };
}

function validateGlobalEventList(events) {
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        
        // Check for repeat block
        if (event.repeat !== undefined) {
            if (!Array.isArray(event.events)) {
                return { valid: false, error: `global event ${i}: repeat block must have "events" array` };
            }
            const nestedResult = validateGlobalEventList(event.events);
            if (!nestedResult.valid) {
                return nestedResult;
            }
            continue;
        }
        
        // Validate ranges
        if (event.pulse !== undefined && (event.pulse < 0 || event.pulse > 4)) {
            return { valid: false, error: `global event ${i}: "pulse" must be 0-4` };
        }
        if (event.panRate !== undefined && (event.panRate < 0 || event.panRate > 2)) {
            return { valid: false, error: `global event ${i}: "panRate" must be 0-2` };
        }
        if (event.saturation !== undefined && (event.saturation < 0 || event.saturation > 1)) {
            return { valid: false, error: `global event ${i}: "saturation" must be 0-1` };
        }
        if (event.bitDepth !== undefined && (event.bitDepth < 2 || event.bitDepth > 16)) {
            return { valid: false, error: `global event ${i}: "bitDepth" must be 2-16` };
        }
        if (event.reverbMix !== undefined && (event.reverbMix < 0 || event.reverbMix > 1)) {
            return { valid: false, error: `global event ${i}: "reverbMix" must be 0-1` };
        }
    }
    
    return { valid: true };
}

function setCompositionStatus(message, valid) {
    elements.compositionStatus.textContent = message;
    elements.compositionStatus.className = 'composition-status' + (message ? (valid ? ' valid' : ' invalid') : '');
    
    elements.playComposition.disabled = !valid;
    elements.exportComposition.disabled = !valid;
}

async function playComposition() {
    if (!parsedComposition || compositionPlaying) return;
    
    if (!audioEngine.initialized) {
        await audioEngine.init();
    }
    
    compositionPlaying = true;
    elements.playComposition.disabled = true;
    elements.stopComposition.disabled = false;
    elements.playComposition.textContent = 'Playing...';
    elements.statusDisplay.textContent = 'Playing composition';
    
    // Flatten events with absolute times
    const schedule = buildCompositionSchedule(parsedComposition);
    
    // Schedule all events
    const startTime = audioEngine.ctx.currentTime + 0.1;
    
    for (const event of schedule.voiceEvents) {
        const timeout = setTimeout(() => {
            playVoiceEvent(event);
        }, event.time * 1000);
        compositionTimeouts.push(timeout);
    }
    
    for (const event of schedule.globalEvents) {
        const timeout = setTimeout(() => {
            applyGlobalEvent(event);
        }, event.time * 1000);
        compositionTimeouts.push(timeout);
    }
    
    // Schedule end
    const endTimeout = setTimeout(() => {
        stopComposition();
    }, schedule.totalDuration * 1000 + 500);
    compositionTimeouts.push(endTimeout);
}

function buildCompositionSchedule(comp) {
    const voiceEvents = [];
    const globalEvents = [];
    let maxDuration = 0;
    
    // Process voices
    const voiceNames = Object.keys(comp.voices);
    for (let voiceIndex = 0; voiceIndex < voiceNames.length; voiceIndex++) {
        const name = voiceNames[voiceIndex];
        const events = flattenEvents(comp.voices[name]);
        
        let time = 0;
        for (const event of events) {
            if (event.wait) {
                time += event.wait;
            }
            if (event.color !== undefined) {
                voiceEvents.push({
                    time,
                    voiceIndex,
                    voiceName: name,
                    ...event
                });
                const eventDuration = (event.attack || 0) + (event.decay || 0) + (event.duration || 0) + (event.release || 0);
                time += eventDuration;
            }
        }
        maxDuration = Math.max(maxDuration, time);
    }
    
    // Process global
    if (comp.global) {
        const events = flattenEvents(comp.global);
        let time = 0;
        for (const event of events) {
            if (event.wait) {
                time += event.wait;
            }
            // Only add if there are actual settings (not just a wait)
            const settingsKeys = Object.keys(event).filter(k => k !== 'wait');
            if (settingsKeys.length > 0) {
                globalEvents.push({ time, ...event });
            }
        }
    }
    
    return { voiceEvents, globalEvents, totalDuration: maxDuration };
}

function flattenEvents(events, result = []) {
    for (const event of events) {
        if (event.repeat !== undefined && event.events) {
            for (let i = 0; i < event.repeat; i++) {
                flattenEvents(event.events, result);
            }
        } else {
            result.push(event);
        }
    }
    return result;
}

async function playVoiceEvent(event) {
    if (!compositionPlaying) return;
    
    // Ensure we have enough voices initialized
    while (audioEngine.voices.length <= event.voiceIndex) {
        const newVoice = new Voice(audioEngine.ctx, event.voiceIndex);
        await newVoice.init();
        newVoice.getOutput().connect(audioEngine.voiceMerger);
        audioEngine.voices.push(newVoice);
    }
    
    const voice = audioEngine.voices[event.voiceIndex];
    if (!voice.initialized) {
        await voice.init();
        voice.getOutput().connect(audioEngine.voiceMerger);
    }
    voice.setEnabled(true);
    
    voice.applySettings({
        color: event.color,
        volume: event.volume ?? 0.8,
        pan: event.pan ?? 0,
        attack: event.attack ?? 0.5,
        decay: event.decay ?? 0,
        sustain: event.sustain ?? 1,
        release: event.release ?? 0.5,
        duration: event.duration,
        loop: false
    }, currentSettings, true);
    
    voice.start();
}

function applyGlobalEvent(event) {
    if (!compositionPlaying) return;
    
    // Merge event into current settings
    const settingsToApply = { ...currentSettings };
    
    if (event.grey !== undefined) settingsToApply.grey = event.grey;
    if (event.pulse !== undefined) settingsToApply.pulse = event.pulse;
    if (event.pulseShape !== undefined) settingsToApply.pulseShape = event.pulseShape;
    if (event.texture !== undefined) settingsToApply.dist = event.texture;
    if (event.panRate !== undefined) settingsToApply.panRate = event.panRate;
    if (event.panDepth !== undefined) settingsToApply.panDepth = event.panDepth;
    if (event.color2 !== undefined) settingsToApply.alpha2 = event.color2;
    if (event.colorBlend !== undefined) settingsToApply.colorBlend = event.colorBlend;
    if (event.saturation !== undefined) settingsToApply.saturation = event.saturation;
    if (event.saturationMode !== undefined) settingsToApply.saturationMode = event.saturationMode;
    if (event.bitDepth !== undefined) settingsToApply.bitDepth = event.bitDepth;
    if (event.sampleRateReduction !== undefined) settingsToApply.sampleRateReduction = event.sampleRateReduction;
    if (event.reverbMix !== undefined) settingsToApply.reverbMix = event.reverbMix;
    if (event.reverbSize !== undefined) settingsToApply.reverbSize = event.reverbSize;
    
    currentSettings = settingsToApply;
    audioEngine.applyGlobalSettings(currentSettings, true);
}

function stopComposition() {
    // Clear all scheduled events
    for (const timeout of compositionTimeouts) {
        clearTimeout(timeout);
    }
    compositionTimeouts = [];
    
    // Stop all voices
    if (audioEngine.initialized) {
        audioEngine.stop(0.1);
    }
    
    compositionPlaying = false;
    elements.playComposition.disabled = !parsedComposition;
    elements.stopComposition.disabled = true;
    elements.playComposition.textContent = 'Play';
    elements.statusDisplay.textContent = 'System Standby';
}

async function exportCompositionToWav() {
    if (!parsedComposition) return;
    
    elements.exportComposition.disabled = true;
    elements.exportComposition.textContent = 'Rendering...';
    
    try {
        const schedule = buildCompositionSchedule(parsedComposition);
        const duration = schedule.totalDuration + 1; // Add 1 second buffer
        const sampleRate = 44100;
        const length = Math.ceil(duration * sampleRate);
        
        const offlineCtx = new OfflineAudioContext(2, length, sampleRate);
        await offlineCtx.audioWorklet.addModule('worklet/noise-processor.js');
        
        // Create master output
        const masterGain = offlineCtx.createGain();
        masterGain.gain.value = parseFloat(elements.sliderVol.value);
        masterGain.connect(offlineCtx.destination);
        
        // Create grey EQ
        const greyLow = offlineCtx.createBiquadFilter();
        greyLow.type = 'lowshelf';
        greyLow.frequency.value = 100;
        
        const greyHigh = offlineCtx.createBiquadFilter();
        greyHigh.type = 'highshelf';
        greyHigh.frequency.value = 6000;
        
        greyLow.connect(greyHigh);
        greyHigh.connect(masterGain);
        
        // Schedule global events
        let globalState = { ...currentSettings };
        for (const event of schedule.globalEvents) {
            if (event.grey !== undefined) globalState.grey = event.grey;
            // Schedule grey changes
            greyLow.gain.setValueAtTime(globalState.grey ? 10 : 0, event.time);
            greyHigh.gain.setValueAtTime(globalState.grey ? 5 : 0, event.time);
        }
        
        // Initial grey state
        greyLow.gain.setValueAtTime(globalState.grey ? 10 : 0, 0);
        greyHigh.gain.setValueAtTime(globalState.grey ? 5 : 0, 0);
        
        // Render each voice event
        for (const event of schedule.voiceEvents) {
            await renderCompositionVoiceEvent(offlineCtx, event, greyLow);
        }
        
        const renderedBuffer = await offlineCtx.startRendering();
        const wavBlob = audioBufferToWav(renderedBuffer);
        
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        a.download = `composition_${timestamp}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
    } catch (err) {
        console.error('Composition export error:', err);
        alert('Export failed: ' + err.message);
    }
    
    elements.exportComposition.disabled = !parsedComposition;
    elements.exportComposition.textContent = 'Export WAV';
}

async function renderCompositionVoiceEvent(ctx, event, destination) {
    const noiseNode = new AudioWorkletNode(ctx, 'noise-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2]
    });
    
    const colorParam = noiseNode.parameters.get('color');
    if (colorParam) colorParam.setValueAtTime(event.color, 0);
    
    const envelope = ctx.createGain();
    envelope.gain.value = 0;
    
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = event.volume ?? 0.8;
    
    const panner = ctx.createStereoPanner();
    panner.pan.value = event.pan ?? 0;
    
    noiseNode.connect(envelope);
    envelope.connect(voiceGain);
    voiceGain.connect(panner);
    panner.connect(destination);
    
    // Schedule envelope
    const startTime = event.time;
    const attack = event.attack || 0.5;
    const decay = event.decay || 0;
    const sustain = event.sustain ?? 1;
    const release = event.release || 0.5;
    const duration = event.duration || 1;
    
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(1, startTime + attack);
    
    if (decay > 0) {
        envelope.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
    } else {
        envelope.gain.setValueAtTime(sustain, startTime + attack);
    }
    
    const releaseStart = startTime + attack + decay + duration;
    envelope.gain.setValueAtTime(sustain, releaseStart);
    envelope.gain.linearRampToValueAtTime(0, releaseStart + release);
}
