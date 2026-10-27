import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.riverstorm.game',
  appName: 'River Storm',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: { allowMixedContent: false },
  server: { androidScheme: 'https' },
};
export default config;
