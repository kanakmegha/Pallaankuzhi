import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bc6fd43d2aca4690a48e4b29c3a052e7',
  appName: 'shell-sow-sparkle',
  webDir: 'dist',
  server: {
    url: 'https://bc6fd43d-2aca-4690-a48e-4b29c3a052e7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;