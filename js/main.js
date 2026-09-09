/**
 * Main entry point for Colored Noise
 */

import { initUI } from './ui.js';
import { initPWA } from './pwa.js';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}

initPWA();
