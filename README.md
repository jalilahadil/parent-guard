# ParentGuard

Android parental-control app (Method B) built with Expo SDK 58, a custom development client, and Kotlin native modules.

## Stack

- React Native 0.88 + TypeScript + Expo SDK 58
- Expo Prebuild + `expo-dev-client` (not Expo Go)
- React Navigation, React Native Paper, Reanimated
- Firebase Auth / Firestore / FCM / Cloud Functions
- Expo SecureStore + SQLite
- Native Kotlin: AccessibilityService, UsageStatsManager, WindowManager overlay, foreground service

## Requirements

- Node.js LTS (or Node 20+/22+/24 compatible with RN 0.88)
- npm
- JDK 17
- Android Studio + Android SDK (API 26+; target/compile 36 via Expo 58)
- Physical Android device recommended for Accessibility / overlay / UsageStats

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
```

## Install

```bash
cd parentguard
npm install
```

Pinned Expo-native installs (already applied):

```bash
npx expo install expo-dev-client expo-secure-store expo-sqlite react-native-reanimated react-native-worklets react-native-gesture-handler react-native-screens react-native-safe-area-context @expo/vector-icons
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-paper react-native-vector-icons firebase
```

## Firebase credentials

1. Copy `firebase/config.example.ts` values into `firebase/config.ts`
2. Place Android `google-services.json` at `firebase/google-services.json`
3. Add to `app.json` → `expo.android.googleServicesFile`: `./firebase/google-services.json`
4. Deploy rules: `firebase/firestore.rules`
5. Optional: `cd functions && npm install && npm run deploy`

## Native Android integration

Custom Kotlin sources live in `native-android/` and are applied reproducibly by `plugins/withParentGuardNative.js` during prebuild. Prefer re-running prebuild through that plugin instead of hand-editing `android/` only.

```bash
npx expo prebuild --platform android
```

Do not use Expo Go. Native monitoring will not load there.

## Run / build

Prefer **EAS cloud builds** (avoids Windows/OneDrive path-length CMake failures):

```bash
npx eas-cli login
npx eas-cli build -p android --profile preview
```

Local (use a short path like `C:\dev\parentguard`, not OneDrive):

```bash
npx expo run:android
# or
cd android
.\gradlew.bat assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

Preview APKs are **arm64-v8a only** to keep size down.

## Project layout

See repository tree under `app/`, `native-android/`, `functions/`, `firebase/`, and `plugins/`.

## OS limitations (Method B)

- Accessibility, Usage Access, and Display-over-other-apps must be enabled manually in system settings.
- Overlays and Accessibility are not Device-Owner kiosk mode; determined users may still revoke permissions.
- ParentGuard never requests Device Owner and never factory-resets the child device.
