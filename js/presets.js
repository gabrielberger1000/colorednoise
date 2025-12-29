/**
 * Preset definitions for Colored Noise
 * 
 * Each preset defines:
 * - name: Display name
 * - category: sleep, focus, nature, ambient, mechanical, experimental, textured
 * - alpha: Noise color (0=violet, 1=blue, 2=white, 3=pink, 4=brown)
 * - pulse: LFO speed in Hz (0 = off)
 * - pulseShape: 'sine', 'triangle', or 'square'
 * - grey: Boolean for perceptual EQ
 * - dist: 0=Gaussian, 1=Uniform texture
 * - binaural: Boolean for binaural beats
 * - binauralFreq: Binaural frequency in Hz
 * - fadeIn/fadeOut: Legacy fade times (will be replaced by ADSR)
 * - resonant: Optional resonant filter settings
 * - comb: Optional comb filter settings
 */

export const builtInPresets = [
    // === SLEEP (9 presets) ===
    { name: "Deep Sleep", category: "sleep", alpha: 3.95, pulse: 0.12, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2.5, fadeIn: 30, fadeOut: 45 },
    { name: "Womb Sound", category: "sleep", alpha: 4, pulse: 0.08, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 20, fadeOut: 30 },
    { name: "Lucid Dream", category: "sleep", alpha: 3.8, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 5, fadeIn: 25, fadeOut: 40 },
    { name: "Night Cocoon", category: "sleep", alpha: 3.9, pulse: 0.05, pulseShape: "triangle", grey: true, dist: 0, binaural: true, binauralFreq: 3, fadeIn: 30, fadeOut: 60 },
    { name: "Drift Away", category: "sleep", alpha: 3.7, pulse: 0.1, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 4, fadeIn: 20, fadeOut: 30 },
    { name: "Heavy Blanket", category: "sleep", alpha: 4, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 15, fadeOut: 25 },
    { name: "Midnight Hum", category: "sleep", alpha: 3.85, pulse: 0.06, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 20, fadeOut: 30 },
    { name: "Delta Waves", category: "sleep", alpha: 3.6, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2, fadeIn: 30, fadeOut: 45 },
    { name: "Slow Descent", category: "sleep", alpha: 3.75, pulse: 0.04, pulseShape: "triangle", grey: false, dist: 0, binaural: true, binauralFreq: 3.5, fadeIn: 45, fadeOut: 60 },
    
    // === FOCUS (8 presets) ===
    { name: "Focus Zone", category: "focus", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 14, fadeIn: 3, fadeOut: 5 },
    { name: "Study Hall", category: "focus", alpha: 1.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 18, fadeIn: 2, fadeOut: 3 },
    { name: "Alpha Waves", category: "focus", alpha: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 10, fadeIn: 5, fadeOut: 8 },
    { name: "Deep Work", category: "focus", alpha: 3.4, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 16, fadeIn: 3, fadeOut: 5 },
    { name: "Concentration", category: "focus", alpha: 2.8, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: true, binauralFreq: 12, fadeIn: 2, fadeOut: 4 },
    { name: "Beta Boost", category: "focus", alpha: 2.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 20, fadeIn: 1, fadeOut: 2 },
    { name: "Flow State", category: "focus", alpha: 3.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 11, fadeIn: 5, fadeOut: 8 },
    { name: "Theta Meditation", category: "focus", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 6, fadeIn: 10, fadeOut: 15 },
    
    // === NATURE (9 presets) ===
    { name: "Ocean Waves", category: "nature", alpha: 3.2, pulse: 0.18, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 5, fadeOut: 10 },
    { name: "Heavy Rain", category: "nature", alpha: 3.3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 8 },
    { name: "Distant Thunder", category: "nature", alpha: 4, pulse: 0.08, pulseShape: "triangle", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 8, fadeOut: 15 },
    { name: "Waterfall", category: "nature", alpha: 2.8, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 5 },
    { name: "Windy Day", category: "nature", alpha: 3.1, pulse: 0.35, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 4, fadeOut: 8 },
    { name: "Mountain Wind", category: "nature", alpha: 1.8, pulse: 0.5, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 5, fadeOut: 10 },
    { name: "Rain on Tent", category: "nature", alpha: 3.4, pulse: 0.15, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 4, fadeOut: 8 },
    { name: "Night Forest", category: "nature", alpha: 3.65, pulse: 0.07, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 8, fadeOut: 15 },
    { name: "Seaside Cave", category: "nature", alpha: 3.8, pulse: 0.12, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 6, fadeOut: 12 },
    
    // === AMBIENT (9 presets) ===
    { name: "Pure White", category: "ambient", alpha: 2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 1, fadeOut: 2 },
    { name: "Standard Pink", category: "ambient", alpha: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 1, fadeOut: 2 },
    { name: "Deep Brown", category: "ambient", alpha: 4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 2, fadeOut: 4 },
    { name: "Blue Sky", category: "ambient", alpha: 1, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 1, fadeOut: 2 },
    { name: "Violet Haze", category: "ambient", alpha: 0.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 2, fadeOut: 3 },
    { name: "Grey Noise", category: "ambient", alpha: 2, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 1, fadeOut: 2 },
    { name: "Soft Air", category: "ambient", alpha: 3.4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 2, fadeOut: 4 },
    { name: "Coffee Shop", category: "ambient", alpha: 2.6, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 2, fadeOut: 3 },
    { name: "Tinnitus Mask", category: "ambient", alpha: 1.5, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 5, fadeOut: 10 },
    
    // === MECHANICAL (10 presets) ===
    { name: "Airplane Cabin", category: "mechanical", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 5 },
    { name: "Box Fan", category: "mechanical", alpha: 3.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 1, fadeOut: 2 },
    { name: "Space Station", category: "mechanical", alpha: 3.9, pulse: 0.04, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 5, fadeOut: 10 },
    { name: "Server Room", category: "mechanical", alpha: 1.6, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 2, fadeOut: 3 },
    { name: "Diesel Engine", category: "mechanical", alpha: 4, pulse: 1.4, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 5 },
    { name: "CPU Fan", category: "mechanical", alpha: 1.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 1, fadeOut: 2 },
    { name: "Furnace", category: "mechanical", alpha: 3.7, pulse: 0.7, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 4, fadeOut: 8 },
    { name: "Submarine", category: "mechanical", alpha: 3.95, pulse: 0.06, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 8, fadeOut: 15 },
    { name: "Electric Hum", category: "mechanical", alpha: 3.2, pulse: 0.5, pulseShape: "square", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 1, fadeOut: 2 },
    { name: "Jet Stream", category: "mechanical", alpha: 0.8, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 5 },
    
    // === EXPERIMENTAL (5 presets) ===
    { name: "Static TV", category: "experimental", alpha: 2, pulse: 2.5, pulseShape: "square", grey: false, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 0, fadeOut: 1 },
    { name: "Vinyl Crackle", category: "experimental", alpha: 0.4, pulse: 0.3, pulseShape: "triangle", grey: false, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 2, fadeOut: 3 },
    { name: "Cicadas", category: "experimental", alpha: 1.1, pulse: 3.2, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 5 },
    { name: "ASMR Static", category: "experimental", alpha: 0.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10, fadeIn: 5, fadeOut: 8 },
    { name: "Breath Work", category: "experimental", alpha: 3.2, pulse: 0.1, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 10, fadeIn: 10, fadeOut: 15 },
    
    // === TEXTURED (8 presets) - Using resonant filters and comb filters ===
    { name: "Resonant Drone", category: "textured", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 8, fadeOut: 12,
      resonant: { enabled: true, frequencies: [110, 220, 330], q: 25, mix: 0.6 } },
    { name: "Singing Pipes", category: "textured", alpha: 2.5, pulse: 0.08, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 5, fadeOut: 10,
      resonant: { enabled: true, frequencies: [180, 360, 540], q: 30, mix: 0.5 } },
    { name: "Tibetan Bowl", category: "textured", alpha: 3.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 10, fadeOut: 20,
      resonant: { enabled: true, frequencies: [256, 384, 512], q: 40, mix: 0.4 } },
    { name: "Metal Wind", category: "textured", alpha: 2, pulse: 0.15, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 4, fadeOut: 8,
      comb: { enabled: true, delay: 0.003, feedback: 0.75, mix: 0.4 } },
    { name: "Hollow Tube", category: "textured", alpha: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 6,
      comb: { enabled: true, delay: 0.008, feedback: 0.8, mix: 0.5 } },
    { name: "Spaceship Hull", category: "textured", alpha: 3.8, pulse: 0.03, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 10, fadeOut: 15,
      comb: { enabled: true, delay: 0.015, feedback: 0.7, mix: 0.35 },
      resonant: { enabled: true, frequencies: [80, 160, 240], q: 15, mix: 0.3 } },
    { name: "Wind Chimes", category: "textured", alpha: 1.5, pulse: 0.2, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 3, fadeOut: 5,
      resonant: { enabled: true, frequencies: [523, 659, 784], q: 35, mix: 0.5 } },
    { name: "Cave Ambience", category: "textured", alpha: 4, pulse: 0.05, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10, fadeIn: 15, fadeOut: 25,
      comb: { enabled: true, delay: 0.025, feedback: 0.6, mix: 0.4 },
      resonant: { enabled: true, frequencies: [100, 150, 200], q: 12, mix: 0.25 } }
];

/**
 * Default settings for a new/reset state
 */
export const defaultSettings = {
    alpha: 3,
    pulse: 0,
    pulseShape: "sine",
    grey: false,
    dist: 0,
    binaural: false,
    binauralFreq: 10,
    fadeIn: 1,
    fadeOut: 2,
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
