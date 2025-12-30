/**
 * Preset definitions for Colored Noise
 *
 * Each preset defines:
 * - name: Display name
 * - category: sleep, focus, nature, ambient, mechanical, experimental, textured
 * - color: Noise color (0=violet, 1=blue, 2=white, 3=pink, 4=brown)
 * - pulse: LFO speed in Hz (0 = off)
 * - pulseShape: 'sine', 'triangle', or 'square'
 * - grey: Boolean for perceptual EQ
 * - dist: 0=Gaussian, 1=Uniform texture
 * - binaural: Boolean for binaural beats
 * - binauralFreq: Binaural frequency in Hz
 *
 * NON-REPEATING SOUNDS (loop: false):
 * - attack: seconds to fade in
 * - Sustains indefinitely until power off
 *
 * REPEATING SOUNDS (loop: true):
 * - attack: seconds to ramp up
 * - decay: seconds to drop from peak to sustain
 * - sustain: level to hold (0-1)
 * - release: seconds to fade out
 * - duration: seconds to hold sustain before release
 *
 * Optional texture filters:
 * - resonant: { enabled, frequencies[], q, mix }
 * - comb: { enabled, delay, feedback, mix }
 */

export const builtInPresets = [
    // === SLEEP (9 presets) - All non-repeating ===
    { name: "Deep Sleep", category: "sleep", color: 3.95, pulse: 0.12, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2.5,
      attack: 30, loop: false },
    { name: "Womb Sound", category: "sleep", color: 4, pulse: 0.08, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 20, loop: false },
    { name: "Lucid Dream", category: "sleep", color: 3.8, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 5,
      attack: 25, loop: false },
    { name: "Night Cocoon", category: "sleep", color: 3.9, pulse: 0.05, pulseShape: "triangle", grey: true, dist: 0, binaural: true, binauralFreq: 3,
      attack: 30, loop: false },
    { name: "Drift Away", category: "sleep", color: 3.7, pulse: 0.1, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 4,
      attack: 20, loop: false },
    { name: "Heavy Blanket", category: "sleep", color: 4, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 15, loop: false },
    { name: "Midnight Hum", category: "sleep", color: 3.85, pulse: 0.06, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 20, loop: false },
    { name: "Delta Waves", category: "sleep", color: 3.6, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2,
      attack: 30, loop: false },
    { name: "Slow Descent", category: "sleep", color: 3.75, pulse: 0.04, pulseShape: "triangle", grey: false, dist: 0, binaural: true, binauralFreq: 3.5,
      attack: 45, loop: false },

    // === FOCUS (8 presets) - All non-repeating ===
    { name: "Focus Zone", category: "focus", color: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 14,
      attack: 3, loop: false },
    { name: "Study Hall", category: "focus", color: 1.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 18,
      attack: 2, loop: false },
    { name: "Alpha Waves", category: "focus", color: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Deep Work", category: "focus", color: 3.4, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 16,
      attack: 3, loop: false },
    { name: "Concentration", category: "focus", color: 2.8, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: true, binauralFreq: 12,
      attack: 2, loop: false },
    { name: "Beta Boost", category: "focus", color: 2.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 20,
      attack: 1, loop: false },
    { name: "Flow State", category: "focus", color: 3.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 11,
      attack: 5, loop: false },
    { name: "Theta Meditation", category: "focus", color: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 6,
      attack: 10, loop: false },

    // === NATURE (9 presets) - Mixed ===
    { name: "Ocean Waves", category: "nature", color: 3.2, pulse: 0.18, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 0.5, sustain: 0.7, release: 4, duration: 3, loop: true },
    { name: "Heavy Rain", category: "nature", color: 3.3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },
    { name: "Distant Thunder", category: "nature", color: 4, pulse: 0.08, pulseShape: "triangle", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.2, decay: 2, sustain: 0.3, release: 5, duration: 2, loop: true },
    { name: "Waterfall", category: "nature", color: 2.8, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },
    { name: "Windy Day", category: "nature", color: 3.1, pulse: 0.35, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, decay: 0.5, sustain: 0.6, release: 3, duration: 4, loop: true },
    { name: "Mountain Wind", category: "nature", color: 1.8, pulse: 0.5, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1.5, decay: 0.3, sustain: 0.7, release: 2, duration: 3, loop: true },
    { name: "Rain on Tent", category: "nature", color: 3.4, pulse: 0.15, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 2, decay: 0.5, sustain: 0.8, release: 2, duration: 5, loop: true },
    { name: "Night Forest", category: "nature", color: 3.65, pulse: 0.07, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 8, loop: false },
    { name: "Seaside Cave", category: "nature", color: 3.8, pulse: 0.12, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 1, sustain: 0.5, release: 4, duration: 4, loop: true },

    // === AMBIENT (9 presets) - All non-repeating ===
    { name: "Pure White", category: "ambient", color: 2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Standard Pink", category: "ambient", color: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Deep Brown", category: "ambient", color: 4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Blue Sky", category: "ambient", color: 1, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Violet Haze", category: "ambient", color: 0.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Grey Noise", category: "ambient", color: 2, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Soft Air", category: "ambient", color: 3.4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Coffee Shop", category: "ambient", color: 2.6, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Tinnitus Mask", category: "ambient", color: 1.5, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },

    // === MECHANICAL (10 presets) - Mixed ===
    { name: "Airplane Cabin", category: "mechanical", color: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },
    { name: "Box Fan", category: "mechanical", color: 3.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Space Station", category: "mechanical", color: 3.9, pulse: 0.04, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Server Room", category: "mechanical", color: 1.6, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Diesel Engine", category: "mechanical", color: 4, pulse: 1.4, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.3, duration: 0.8, loop: true },
    { name: "CPU Fan", category: "mechanical", color: 1.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Furnace", category: "mechanical", color: 3.7, pulse: 0.7, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, decay: 0.5, sustain: 0.7, release: 2, duration: 4, loop: true },
    { name: "Submarine", category: "mechanical", color: 3.95, pulse: 0.06, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, decay: 1, sustain: 0.6, release: 3, duration: 5, loop: true },
    { name: "Electric Hum", category: "mechanical", color: 3.2, pulse: 0.5, pulseShape: "square", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.1, duration: 0.3, loop: true },
    { name: "Jet Stream", category: "mechanical", color: 0.8, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },

    // === EXPERIMENTAL (5 presets) - Mixed ===
    { name: "Static TV", category: "experimental", color: 2, pulse: 2.5, pulseShape: "square", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 0.02, decay: 0.05, sustain: 0.8, release: 0.1, duration: 0.2, loop: true },
    { name: "Vinyl Crackle", category: "experimental", color: 0.4, pulse: 0.3, pulseShape: "triangle", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.5, duration: 1, loop: true },
    { name: "Cicadas", category: "experimental", color: 1.5, pulse: 8, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false,
      resonant: { enabled: true, frequencies: [4000, 5000, 6000], q: 8, mix: 0.5 } },
    { name: "ASMR Static", category: "experimental", color: 0.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Breath Work", category: "experimental", color: 3.2, pulse: 0.1, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 10,
      attack: 2, decay: 0, sustain: 1, release: 2.5, duration: 1.5, loop: true },

    // === TEXTURED (12 presets) - All repeating with filters ===
    { name: "Resonant Drone", category: "textured", color: 3.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, decay: 0.5, sustain: 0.7, release: 3, duration: 4, loop: true,
      resonant: { enabled: true, frequencies: [110, 220, 330], q: 25, mix: 0.6 } },
    { name: "Singing Pipes", category: "textured", color: 2.5, pulse: 0.08, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, decay: 0.3, sustain: 0.8, release: 2, duration: 3, loop: true,
      resonant: { enabled: true, frequencies: [180, 360, 540], q: 30, mix: 0.5 } },
    { name: "Tibetan Bowl", category: "textured", color: 3.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 2, sustain: 0.3, release: 4, duration: 3, loop: true,
      resonant: { enabled: true, frequencies: [256, 384, 512], q: 40, mix: 0.4 } },
    { name: "Metal Wind", category: "textured", color: 2, pulse: 0.15, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.8, decay: 0.2, sustain: 0.9, release: 1.5, duration: 2, loop: true,
      comb: { enabled: true, delay: 0.003, feedback: 0.75, mix: 0.4 } },
    { name: "Hollow Tube", category: "textured", color: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.5, decay: 0, sustain: 1, release: 1, duration: 2, loop: true,
      comb: { enabled: true, delay: 0.008, feedback: 0.8, mix: 0.5 } },
    { name: "Spaceship Hull", category: "textured", color: 3.8, pulse: 0.03, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 1, sustain: 0.6, release: 4, duration: 5, loop: true,
      comb: { enabled: true, delay: 0.015, feedback: 0.7, mix: 0.35 },
      resonant: { enabled: true, frequencies: [80, 160, 240], q: 15, mix: 0.3 } },
    { name: "Wind Chimes", category: "textured", color: 1.5, pulse: 0.2, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.05, decay: 0.8, sustain: 0.2, release: 2, duration: 1.5, loop: true,
      resonant: { enabled: true, frequencies: [523, 659, 784], q: 35, mix: 0.5 } },
    { name: "Cave Ambience", category: "textured", color: 4, pulse: 0.05, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 4, decay: 1, sustain: 0.5, release: 5, duration: 6, loop: true,
      comb: { enabled: true, delay: 0.025, feedback: 0.6, mix: 0.4 },
      resonant: { enabled: true, frequencies: [100, 150, 200], q: 12, mix: 0.25 } },
    { name: "Breathing", category: "textured", color: 3.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 4,
      attack: 2, decay: 0, sustain: 1, release: 2.5, duration: 1.5, loop: true },
    { name: "Waves Loop", category: "textured", color: 3.8, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 0.5, sustain: 0.7, release: 4, duration: 3, loop: true },
    { name: "Pulse Rhythm", category: "textured", color: 2.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.8, duration: 0.5, loop: true },
    { name: "Slow Swell", category: "textured", color: 4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2,
      attack: 8, decay: 2, sustain: 0.6, release: 6, duration: 5, loop: true },
    { name: "Drifting", category: "textured", color: 3.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 5, loop: false, panRate: 0.08, panDepth: 0.7 },
    { name: "Layered Depths", category: "textured", color: 4, color2: 1.5, colorBlend: 0.4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Warm Hiss", category: "textured", color: 2.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false, saturation: 0.6, saturationMode: 'warm' },
    { name: "Lo-Fi Crunch", category: "textured", color: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 2, loop: false, bitDepth: 6, sampleRateReduction: 8 },
    { name: "Cathedral Air", category: "textured", color: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 8, loop: false, reverbMix: 0.7, reverbSize: 'large' },
    
    // === MULTI-VOICE POLYRHYTHM PRESETS ===
    { name: "Ocean Drift", category: "textured", pulse: 0, grey: false, dist: 0, reverbMix: 0.3, reverbSize: 'large',
      voices: [
        { color: 3.8, volume: 0.7, pan: -0.3, attack: 3, decay: 0.5, sustain: 0.7, release: 4, duration: 5, loop: true, enabled: true },
        { color: 4, volume: 0.5, pan: 0.4, attack: 4, decay: 1, sustain: 0.5, release: 5, duration: 7, loop: true, enabled: true },
        { color: 3.5, volume: 0.4, pan: 0, attack: 2, decay: 0.3, sustain: 0.8, release: 3, duration: 3, loop: true, enabled: true },
        { color: 3, volume: 0, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false }
      ]
    },
    { name: "Breathing Room", category: "textured", pulse: 0, grey: true, dist: 0, reverbMix: 0.2, reverbSize: 'medium',
      voices: [
        { color: 3, volume: 0.8, pan: 0, attack: 2, decay: 0, sustain: 1, release: 2.5, duration: 1.5, loop: true, enabled: true },
        { color: 3.5, volume: 0.5, pan: -0.5, attack: 3, decay: 0.5, sustain: 0.7, release: 3, duration: 2.5, loop: true, enabled: true },
        { color: 2.5, volume: 0.5, pan: 0.5, attack: 2.5, decay: 0.3, sustain: 0.8, release: 2, duration: 2, loop: true, enabled: true },
        { color: 3, volume: 0, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false }
      ]
    },
    { name: "Machine Rhythm", category: "experimental", pulse: 0, grey: false, dist: 1, bitDepth: 10, sampleRateReduction: 2,
      voices: [
        { color: 2, volume: 0.7, pan: -0.6, attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.2, duration: 0.3, loop: true, enabled: true },
        { color: 2.5, volume: 0.6, pan: 0.6, attack: 0.08, decay: 0.15, sustain: 0.5, release: 0.25, duration: 0.5, loop: true, enabled: true },
        { color: 4, volume: 0.4, pan: 0, attack: 0.3, decay: 0.2, sustain: 0.4, release: 0.5, duration: 1.2, loop: true, enabled: true },
        { color: 1, volume: 0.3, pan: 0, attack: 0.02, decay: 0.05, sustain: 0.3, release: 0.1, duration: 0.2, loop: true, enabled: true }
      ]
    },
    { name: "Stereo Clouds", category: "textured", pulse: 0, grey: false, dist: 0, reverbMix: 0.5, reverbSize: 'large', panRate: 0.05, panDepth: 0.3,
      voices: [
        { color: 3, volume: 0.6, pan: -0.8, attack: 5, decay: 1, sustain: 0.6, release: 6, duration: 4, loop: true, enabled: true },
        { color: 3.2, volume: 0.6, pan: 0.8, attack: 6, decay: 1.5, sustain: 0.5, release: 7, duration: 5, loop: true, enabled: true },
        { color: 3, volume: 0, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false },
        { color: 3, volume: 0, pan: 0, attack: 0.5, decay: 0, sustain: 1, release: 0.5, duration: 2, loop: false, enabled: false }
      ]
    }
];

/**
 * Default settings for a new/reset state
 */
export const defaultSettings = {
    color: 3,
    pulse: 0,
    pulseShape: "sine",
    grey: false,
    dist: 0,
    binaural: false,
    binauralFreq: 10,
    // ADSR envelope
    attack: 0.5,
    decay: 0,
    sustain: 1,
    release: 0.5,
    duration: 2,
    loop: false,
    // Stereo panning
    panRate: 0,
    panDepth: 0,
    // Color layering
    color2: 3,
    colorBlend: 0,
    // Saturation
    saturation: 0,
    saturationMode: 'soft',
    // Bitcrushing
    bitDepth: 16,
    sampleRateReduction: 1,
    // Reverb
    reverbMix: 0,
    reverbSize: 'medium',
    // Texture filters
    resonant: null,
    comb: null
};

/**
 * Category metadata
 */
export const categories = {
    sleep: { color: '#8b5cf6', label: 'Sleep' },
    focus: { color: '#3b82f6', label: 'Focus' },
    nature: { color: '#22c55e', label: 'Nature' },
    ambient: { color: '#10b981', label: 'Ambient' },
    mechanical: { color: '#f59e0b', label: 'Mechanical' },
    experimental: { color: '#ef4444', label: 'Experimental' },
    textured: { color: '#ec4899', label: 'Textured' }
};

/**
 * Load custom presets from localStorage
 */
export function loadCustomPresets() {
    try {
        const saved = localStorage.getItem('colorednoise-custom-presets');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Save custom presets to localStorage
 */
export function saveCustomPresets(presets) {
    try {
        localStorage.setItem('colorednoise-custom-presets', JSON.stringify(presets));
    } catch (e) {
        console.warn('Could not save presets to localStorage');
    }
}
