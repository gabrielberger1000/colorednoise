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
    { name: "Deep Sleep", category: "sleep", alpha: 3.95, pulse: 0.12, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2.5,
      attack: 30, loop: false },
    { name: "Womb Sound", category: "sleep", alpha: 4, pulse: 0.08, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 20, loop: false },
    { name: "Lucid Dream", category: "sleep", alpha: 3.8, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 5,
      attack: 25, loop: false },
    { name: "Night Cocoon", category: "sleep", alpha: 3.9, pulse: 0.05, pulseShape: "triangle", grey: true, dist: 0, binaural: true, binauralFreq: 3,
      attack: 30, loop: false },
    { name: "Drift Away", category: "sleep", alpha: 3.7, pulse: 0.1, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 4,
      attack: 20, loop: false },
    { name: "Heavy Blanket", category: "sleep", alpha: 4, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 15, loop: false },
    { name: "Midnight Hum", category: "sleep", alpha: 3.85, pulse: 0.06, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 20, loop: false },
    { name: "Delta Waves", category: "sleep", alpha: 3.6, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2,
      attack: 30, loop: false },
    { name: "Slow Descent", category: "sleep", alpha: 3.75, pulse: 0.04, pulseShape: "triangle", grey: false, dist: 0, binaural: true, binauralFreq: 3.5,
      attack: 45, loop: false },
    
    // === FOCUS (8 presets) - All non-repeating ===
    { name: "Focus Zone", category: "focus", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 14,
      attack: 3, loop: false },
    { name: "Study Hall", category: "focus", alpha: 1.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 18,
      attack: 2, loop: false },
    { name: "Alpha Waves", category: "focus", alpha: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Deep Work", category: "focus", alpha: 3.4, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 16,
      attack: 3, loop: false },
    { name: "Concentration", category: "focus", alpha: 2.8, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: true, binauralFreq: 12,
      attack: 2, loop: false },
    { name: "Beta Boost", category: "focus", alpha: 2.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 20,
      attack: 1, loop: false },
    { name: "Flow State", category: "focus", alpha: 3.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 11,
      attack: 5, loop: false },
    { name: "Theta Meditation", category: "focus", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: true, binauralFreq: 6,
      attack: 10, loop: false },
    
    // === NATURE (9 presets) - Mixed ===
    { name: "Ocean Waves", category: "nature", alpha: 3.2, pulse: 0.18, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 0.5, sustain: 0.7, release: 4, duration: 3, loop: true },
    { name: "Heavy Rain", category: "nature", alpha: 3.3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },
    { name: "Distant Thunder", category: "nature", alpha: 4, pulse: 0.08, pulseShape: "triangle", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.2, decay: 2, sustain: 0.3, release: 5, duration: 2, loop: true },
    { name: "Waterfall", category: "nature", alpha: 2.8, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },
    { name: "Windy Day", category: "nature", alpha: 3.1, pulse: 0.35, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, decay: 0.5, sustain: 0.6, release: 3, duration: 4, loop: true },
    { name: "Mountain Wind", category: "nature", alpha: 1.8, pulse: 0.5, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1.5, decay: 0.3, sustain: 0.7, release: 2, duration: 3, loop: true },
    { name: "Rain on Tent", category: "nature", alpha: 3.4, pulse: 0.15, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 2, decay: 0.5, sustain: 0.8, release: 2, duration: 5, loop: true },
    { name: "Night Forest", category: "nature", alpha: 3.65, pulse: 0.07, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 8, loop: false },
    { name: "Seaside Cave", category: "nature", alpha: 3.8, pulse: 0.12, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 1, sustain: 0.5, release: 4, duration: 4, loop: true },
    
    // === AMBIENT (9 presets) - All non-repeating ===
    { name: "Pure White", category: "ambient", alpha: 2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Standard Pink", category: "ambient", alpha: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Deep Brown", category: "ambient", alpha: 4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Blue Sky", category: "ambient", alpha: 1, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Violet Haze", category: "ambient", alpha: 0.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Grey Noise", category: "ambient", alpha: 2, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Soft Air", category: "ambient", alpha: 3.4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Coffee Shop", category: "ambient", alpha: 2.6, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Tinnitus Mask", category: "ambient", alpha: 1.5, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },
    
    // === MECHANICAL (10 presets) - Mixed ===
    { name: "Airplane Cabin", category: "mechanical", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },
    { name: "Box Fan", category: "mechanical", alpha: 3.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Space Station", category: "mechanical", alpha: 3.9, pulse: 0.04, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Server Room", category: "mechanical", alpha: 1.6, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false },
    { name: "Diesel Engine", category: "mechanical", alpha: 4, pulse: 1.4, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.3, duration: 0.8, loop: true },
    { name: "CPU Fan", category: "mechanical", alpha: 1.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 1, loop: false },
    { name: "Furnace", category: "mechanical", alpha: 3.7, pulse: 0.7, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, decay: 0.5, sustain: 0.7, release: 2, duration: 4, loop: true },
    { name: "Submarine", category: "mechanical", alpha: 3.95, pulse: 0.06, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, decay: 1, sustain: 0.6, release: 3, duration: 5, loop: true },
    { name: "Electric Hum", category: "mechanical", alpha: 3.2, pulse: 0.5, pulseShape: "square", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.1, duration: 0.3, loop: true },
    { name: "Jet Stream", category: "mechanical", alpha: 0.8, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false },
    
    // === EXPERIMENTAL (5 presets) - Mixed ===
    { name: "Static TV", category: "experimental", alpha: 2, pulse: 2.5, pulseShape: "square", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 0.02, decay: 0.05, sustain: 0.8, release: 0.1, duration: 0.2, loop: true },
    { name: "Vinyl Crackle", category: "experimental", alpha: 0.4, pulse: 0.3, pulseShape: "triangle", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.5, duration: 1, loop: true },
    { name: "Cicadas", category: "experimental", alpha: 1.5, pulse: 8, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, loop: false,
      resonant: { enabled: true, frequencies: [4000, 5000, 6000], q: 8, mix: 0.5 } },
    { name: "ASMR Static", category: "experimental", alpha: 0.3, pulse: 0, pulseShape: "sine", grey: true, dist: 1, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Breath Work", category: "experimental", alpha: 3.2, pulse: 0.1, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 10,
      attack: 2, decay: 0, sustain: 1, release: 2.5, duration: 1.5, loop: true },
    
    // === TEXTURED (12 presets) - All repeating with filters ===
    { name: "Resonant Drone", category: "textured", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, decay: 0.5, sustain: 0.7, release: 3, duration: 4, loop: true,
      resonant: { enabled: true, frequencies: [110, 220, 330], q: 25, mix: 0.6 } },
    { name: "Singing Pipes", category: "textured", alpha: 2.5, pulse: 0.08, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 1, decay: 0.3, sustain: 0.8, release: 2, duration: 3, loop: true,
      resonant: { enabled: true, frequencies: [180, 360, 540], q: 30, mix: 0.5 } },
    { name: "Tibetan Bowl", category: "textured", alpha: 3.2, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 2, sustain: 0.3, release: 4, duration: 3, loop: true,
      resonant: { enabled: true, frequencies: [256, 384, 512], q: 40, mix: 0.4 } },
    { name: "Metal Wind", category: "textured", alpha: 2, pulse: 0.15, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.8, decay: 0.2, sustain: 0.9, release: 1.5, duration: 2, loop: true,
      comb: { enabled: true, delay: 0.003, feedback: 0.75, mix: 0.4 } },
    { name: "Hollow Tube", category: "textured", alpha: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.5, decay: 0, sustain: 1, release: 1, duration: 2, loop: true,
      comb: { enabled: true, delay: 0.008, feedback: 0.8, mix: 0.5 } },
    { name: "Spaceship Hull", category: "textured", alpha: 3.8, pulse: 0.03, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 1, sustain: 0.6, release: 4, duration: 5, loop: true,
      comb: { enabled: true, delay: 0.015, feedback: 0.7, mix: 0.35 },
      resonant: { enabled: true, frequencies: [80, 160, 240], q: 15, mix: 0.3 } },
    { name: "Wind Chimes", category: "textured", alpha: 1.5, pulse: 0.2, pulseShape: "triangle", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.05, decay: 0.8, sustain: 0.2, release: 2, duration: 1.5, loop: true,
      resonant: { enabled: true, frequencies: [523, 659, 784], q: 35, mix: 0.5 } },
    { name: "Cave Ambience", category: "textured", alpha: 4, pulse: 0.05, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 4, decay: 1, sustain: 0.5, release: 5, duration: 6, loop: true,
      comb: { enabled: true, delay: 0.025, feedback: 0.6, mix: 0.4 },
      resonant: { enabled: true, frequencies: [100, 150, 200], q: 12, mix: 0.25 } },
    { name: "Breathing", category: "textured", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 4,
      attack: 2, decay: 0, sustain: 1, release: 2.5, duration: 1.5, loop: true },
    { name: "Waves Loop", category: "textured", alpha: 3.8, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 3, decay: 0.5, sustain: 0.7, release: 4, duration: 3, loop: true },
    { name: "Pulse Rhythm", category: "textured", alpha: 2.5, pulse: 0, pulseShape: "sine", grey: true, dist: 0, binaural: false, binauralFreq: 10,
      attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.8, duration: 0.5, loop: true },
    { name: "Slow Swell", category: "textured", alpha: 4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: true, binauralFreq: 2,
      attack: 8, decay: 2, sustain: 0.6, release: 6, duration: 5, loop: true },
    { name: "Drifting", category: "textured", alpha: 3.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 5, loop: false, panRate: 0.08, panDepth: 0.7 },
    { name: "Layered Depths", category: "textured", alpha: 4, alpha2: 1.5, colorBlend: 0.4, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 5, loop: false },
    { name: "Warm Hiss", category: "textured", alpha: 2.5, pulse: 0, pulseShape: "sine", grey: false, dist: 0, binaural: false, binauralFreq: 10,
      attack: 2, loop: false, saturation: 0.6, saturationMode: 'warm' },
    { name: "Lo-Fi Crunch", category: "textured", alpha: 3, pulse: 0, pulseShape: "sine", grey: false, dist: 1, binaural: false, binauralFreq: 10,
      attack: 2, loop: false, bitDepth: 6, sampleRateReduction: 8 }
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
    alpha2: 3,
    colorBlend: 0,
    // Saturation
    saturation: 0,
    saturationMode: 'soft',
    // Bitcrushing
    bitDepth: 16,
    sampleRateReduction: 1,
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
