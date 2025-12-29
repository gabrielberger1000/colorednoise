/**
 * UI Module - DOM manipulation and event handling for Colored Noise
 * Supports multi-voice polyrhythmic presets
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
