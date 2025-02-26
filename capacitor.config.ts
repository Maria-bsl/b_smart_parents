import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  //appId: 'io.ionic.starter',
  appId: 'com.biz.bsmartparent',
  appName: 'bsmartparents',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    server: {
      cleartext: true,
      androidScheme: 'http',
    },
    // SSLPinning: {
    //   certs: ['nmb_certificate.crt'],
    // },
  },
};

export default config;
