import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.melamarg.app',
  appName: 'MelaMarg',
  webDir: 'out',
  server: {
    androidScheme: 'http',
    allowNavigation: [
      '192.168.42.129',   // USB tethering: PC IP seen from Android
      '192.168.42.*',     // full USB tethering subnet
      '10.0.2.2',         // Android emulator localhost alias
      '192.168.1.*',      // common LAN subnet
      '192.168.0.*',      // common LAN subnet
      '10.42.0.*',        // Linux USB tethering subnet
    ],
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
