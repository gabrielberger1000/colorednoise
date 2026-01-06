import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.colorednoise',
  appName: 'Colored Noise',
  webDir: 'www',
  server: {
    // For development, you can use this to load from a dev server:
    // url: 'http://localhost:8000',
    // cleartext: true
  },
  ios: {
    // Keep audio playing when app is in background
    backgroundColor: '#0a0a0f',
    contentInset: 'automatic',
    allowsLinkPreview: false,
  },
  android: {
    backgroundColor: '#0a0a0f',
    allowMixedContent: false,
  },
  plugins: {
    // Background audio support would require @capacitor-community/background-mode
    // or similar plugin - see README for setup instructions
  }
};

export default config;
