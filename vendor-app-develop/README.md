# ZepNest Vendor App

ZepNest Vendor App is the vendor-facing React Native app for the ZepNest home-services platform — service providers (carpenters, electricians, plumbers, etc.) manage their bookings, availability, and profile from here. It shares the same Expo/NativeWind tech stack and project conventions as the ZepNest customer app (`lk-app`). The app targets Android and iOS.

> **Status:** early scaffold. Only the base Expo Router shell exists (`app/index.tsx`); product screens have not been built yet.

---

## Tech Stack

| Category          | Technology                                   |
| ------------------ | --------------------------------------------- |
| Framework         | Expo SDK 56, React Native 0.85.3             |
| Language          | TypeScript 6.0 (strict mode)                 |
| Navigation        | Expo Router (file-based, similar to Next.js) |
| Styling           | NativeWind 4 (Tailwind CSS v3)               |
| State Management  | Zustand                                      |
| Validation        | Zod                                          |
| UI Primitives     | @rn-primitives/* + lucide-react-native icons |
| SVG               | react-native-svg + react-native-svg-transformer |
| Secure Storage    | expo-secure-store                            |

---

## Architecture

```
app/          # Routes only — no business logic. File name = route path.
components/   # Feature-scoped UI components (add as features are built)
lib/
  apiClient.ts  # fetch wrapper — injects auth token from expo-secure-store
  api/          # Endpoint path constants
  services/     # API call logic, one file per domain
  stores/       # Zustand stores, one file per domain
  types/        # Shared TypeScript types
  utils/        # Pure utility functions
assets/       # Icons, splash screens
android/      # Native Android project (generated via `expo prebuild`, committed)
```

No `src/` wrapper directory — all folders live at the project root, matching `lk-app`'s layout.

---

## Environment Variables

`lib/apiClient.ts` reads `EXPO_PUBLIC_API_URL` for the backend base URL. Create a local `.env` (gitignored) with:

```
EXPO_PUBLIC_API_URL=https://test.zepnest.com
```

Variables prefixed with `EXPO_PUBLIC_` are bundled into the JS runtime and accessible via `process.env.EXPO_PUBLIC_*`.

---

## Installation

```bash
npm install
```

`legacy-peer-deps=true` is already set in `.npmrc`, so no extra flags are needed.

> **Node version:** Expo SDK 56 requires Node `>=20.19.4`. Older Node 20.x versions (e.g. 20.12.2) are missing a `util.styleText` API used by Metro's error reporter — bundling still works, but real bundling errors get masked by an unrelated `TypeError`. Upgrade Node if you hit unexplained crashes during `expo start`.

---

## Running the App

### Option 1 — Expo Go (fastest)

```bash
npm run dev
```

Scan the QR code from the terminal with the Expo Go app on your Android/iOS device. Your phone and computer must be on the same network.

### Option 2 — Native Builds

The `android/` directory is committed (generated via `npx expo prebuild`), so native builds work directly.

#### Android

**Prerequisites:**

- Android Studio with an Android SDK installed (`minSdkVersion` is set to 24 / Android 7.0+)
- JDK 17 (`JAVA_HOME` must point to it)
- `ANDROID_HOME` environment variable set to the SDK directory
- A running emulator or a physical device with USB debugging enabled

```bash
npm run android
# or: npx expo run:android
```

#### iOS

macOS only — generate the `ios/` directory first with `npx expo prebuild --platform ios`, then:

```bash
npm run ios
# or: npx expo run:ios
```

### Option 3 — Web (preview only)

```bash
npm run web
```

---

## Type Checking & Linting

```bash
npx tsc --noEmit       # type check
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier write
npm run format:check   # Prettier check
```

Run `lint` and `tsc --noEmit` before committing.
