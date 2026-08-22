export default {
  expo: {
    name: 'vendor-app',
    slug: 'vendor-app',
    owner: 'zepnest',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'vendor-app',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    assetBundlePatterns: ['**/*'],
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      bundleIdentifier: 'com.zepnest.vendorapp',
      supportsTablet: false,
    },
    android: {
      package: 'com.zepnest.vendorapp',
      usesCleartextTraffic: true,
      adaptiveIcon: {
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        'expo-image-picker',
        { cameraPermission: 'Zepnest needs camera access to capture job photos.' },
      ],
      [
        'expo-location',
        { locationWhenInUsePermission: 'Zepnest needs your location to GPS-tag job photos.' },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: 'c1a6d72a-547d-47a4-b9bd-7d702699e7df',
      },
    },
  },
};
