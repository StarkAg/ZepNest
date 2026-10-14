import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zepnest.customer',
  appName: 'Zepnest',
  // Bundled, NOT remote-URL: the exported app ships inside the binary, so the
  // app cold-starts instantly and still renders with no network. Deliberately
  // no `server.url` here.
  webDir: 'out',
  android: { backgroundColor: '#F5F5F5' },
  ios: { backgroundColor: '#F5F5F5', contentInset: 'never' },
};

export default config;
