# sohojAI Android — Build & Release

Native Android app (Kotlin, Jetpack Compose, Room, WorkManager, Retrofit, DataStore).
Module: `apps/android` (single `:app` module).

## Prerequisites
- JDK 17+ (built/verified on JDK 21)
- Android SDK with `platforms;android-34`, `build-tools;34.0.0`, `platform-tools`
- Gradle wrapper pinned to 8.11.1 (AGP 8.9.1)

Set the SDK location (one of):
- `apps/android/local.properties` → `sdk.dir=/path/to/android-sdk`, or
- `ANDROID_SDK_ROOT` / `ANDROID_HOME` env var.

## Build commands
```bash
cd apps/android
./gradlew :app:testDebugUnitTest      # JVM unit tests (parser + analytics)
./gradlew :app:assembleDebug          # debug APK
./gradlew :app:assembleRelease        # signed, R8-shrunk release APK (needs keystore.properties)
```

## Release signing
Create `apps/android/keystore.properties` (git-ignored — never commit):
```
RELEASE_STORE_FILE=/abs/path/to/release.keystore
RELEASE_STORE_PASSWORD=...
RELEASE_KEY_ALIAS=sohojai
RELEASE_KEY_PASSWORD=...
```
Generate a keystore:
```bash
keytool -genkeypair -alias sohojai -keyalg RSA -keysize 2048 -validity 10000 \
  -keystore release.keystore -dname "CN=sohojAI, O=Keystone Consultancy, L=Dhaka, C=BD"
```
Without `keystore.properties`, the release build is unsigned and debug builds use the standard debug keystore.

## Verified build status (this environment)
- `:app:assembleDebug` → **SUCCESS** (`app-debug.apk`, ~10.9 MB)
- `:app:assembleRelease` → **SUCCESS**, R8 + resource shrink, signed (`app-release.apk`, ~1.37 MB)
- `:app:testDebugUnitTest` → **PASS** (parser + analytics suites)
- Release signature verified via `apksigner` (Signer #1 = sohojAI Dev).

APK outputs are written under `app/build/outputs/apk/` and are **not committed** (git-ignored). Distribute via the artifact + checksum (see `UPDATE_MANIFEST.example.json`).

## Not produced in CI/sandbox (require a device/emulator)
- Compose UI (instrumented) tests, Macrobenchmark, Baseline Profiles, and on-device
  cold-start/jank/ANR metrics. The harness/config belongs in `:app` + a `:macrobenchmark`
  module and must run on a physical Samsung device or an emulator with hardware acceleration.

## Architecture (current)
`Notification listener / SMS share intent / manual paste` → **deterministic `BkashParser`**
→ **Room** (`bkash_transactions`, local-first, deduped) → **`AnalyticsEngine`** (deterministic
daily/weekly/monthly summaries) → Compose dashboard. `SyncWorker` (WorkManager) uploads
structured rows to the backend (`API_BASE_URL`); mock path marks-synced locally when no backend
is configured. Raw SMS/notification text, OTP, and PIN are never stored.
