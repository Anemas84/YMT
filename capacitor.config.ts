import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yamato.urbanplay',
  appName: 'YAMATO Play & Win',
  webDir: 'dist',
  backgroundColor: '#020406',
  android: {
    backgroundColor: '#020406',
    allowMixedContent: false,
  },
};

export default config;
