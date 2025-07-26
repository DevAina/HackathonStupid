import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'stupid',
  webDir: 'dist',
  server: {
    allowNavigation: [
      'ws://*:8080',
      'http://*:8081'
    ]
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    }
  }
};

export default config;
