/**
 * Progressive Web App support: service worker registration and an
 * "Install app" button that appears when the browser offers installation.
 *
 * Everything here is optional; if the browser does not support service
 * workers or install prompts, the page behaves exactly as before.
 */

let deferredInstallPrompt = null;

function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    // Only register on http(s) origins; skip file:// and native wrappers.
    if (!/^https?:$/.test(window.location.protocol)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.warn('Service worker registration failed:', err);
        });
    });
}

function setupInstallButton() {
    const btn = document.getElementById('installBtn');
    if (!btn) return;

    if (isStandalone()) {
        btn.hidden = true;
        return;
    }

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        btn.hidden = false;
    });

    btn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        btn.disabled = true;
        deferredInstallPrompt.prompt();
        try {
            await deferredInstallPrompt.userChoice;
        } finally {
            deferredInstallPrompt = null;
            btn.hidden = true;
            btn.disabled = false;
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        btn.hidden = true;
    });
}

export function initPWA() {
    registerServiceWorker();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupInstallButton);
    } else {
        setupInstallButton();
    }
}
