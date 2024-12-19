import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  //appId: 'io.ionic.starter',
  appId: 'com.biz.bsmartparent',
  appName: 'bsmartparents',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: false,
    },
  },
};

export default config;
