# Building the Android APK (YAMATO Play & Win)

This web app is wrapped as a native Android app with **Capacitor**. The web UI runs
unchanged inside a native WebView, and you export a standard installable `.apk`.

## What's already set up
- `@capacitor/core`, `@capacitor/cli`, `@capacitor/android` installed
- `capacitor.config.ts` — app id `com.yamato.urbanplay`, name **YAMATO Play & Win**, `webDir: dist`
- `android/` — the generated native Android Studio project

## Prerequisites (on your machine, not this sandbox)
1. **JDK 17** (Android Gradle Plugin 8 requires it)
2. **Android Studio** (includes the Android SDK + platform tools)
3. **Node.js 18+**

## One-time: point the tools at your SDK
Set `ANDROID_HOME` (Android Studio installs the SDK here by default):
- macOS/Linux: `~/Library/Android/sdk` or `~/Android/Sdk`
- Windows: `%LOCALAPPDATA%\Android\Sdk`

## Build steps

```bash
# 1. Install deps
npm install

# 2. Build the web app and copy it into the native project
npm run build
npx cap sync android
```

### Option A — Android Studio (easiest, recommended)
```bash
npx cap open android
```
Then in Android Studio: **Build ▸ Build Bundle(s) / APK(s) ▸ Build APK(s)**.
The debug APK appears at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Option B — command line (debug APK)
```bash
cd android
./gradlew assembleDebug        # Windows: gradlew.bat assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

## Release (signed) APK for distribution
1. Create a keystore (once):
   ```bash
   keytool -genkey -v -keystore yamato.keystore -alias yamato \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add signing config to `android/app/build.gradle` (or use Android Studio's
   **Build ▸ Generate Signed Bundle / APK** wizard).
3. Build:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   Output: `android/app/build/outputs/apk/release/app-release.apk`

> For the Google Play Store, prefer an **AAB**: `./gradlew bundleRelease`.

## After changing the web code
Re-run these two commands so the native project picks up the new build:
```bash
npm run build
npx cap sync android
```

## Customizing app icon / splash (optional)
Install the asset generator and drop a 1024×1024 `icon.png` (and optional
`splash.png`) in a `resources/` folder:
```bash
npm install -D @capacitor/assets
npx capacitor-assets generate --android
```
