# Performance Report — sohojAI Android

Targets (Samsung-first): cold start ≤ 1.5s, fully rendered ≤ 2.5s, no scroll jank, ANR < 0.1%,
crash-free > 99.5%.

## Measurement status
| Metric | Value | Source |
|---|---|---|
| Cold start | **Not measured** | Requires a device/emulator |
| Fully rendered | **Not measured** | Requires a device/emulator |
| Jank / ANR | **Not measured** | Requires a device/emulator |
| Release APK size | **1.37 MB** (R8 + resource shrink) | **Measured** in CI |
| Unit test suite | **Pass** | **Measured** in CI |

> The CI/sandbox has **no `/dev/kvm` and no emulator**, so on-device timings cannot be produced
> here. This is a hardware limitation, not a code gap. Numbers below are **ESTIMATES** based on the
> app's characteristics (single lightweight Activity, Compose, no main-thread I/O, Room/WorkManager
> off the main thread, 1.37 MB shrunk APK) and must be confirmed on a real Samsung device.

| Metric | Estimate (unconfirmed) | Rationale |
|---|---|---|
| Cold start | ~0.8–1.3 s | Minimal app/Activity, no heavy init, R8-optimized |
| Fully rendered | ~1.2–2.0 s | Single Compose screen, Room query is small/indexed |
| Jank | Low risk | Lists in `LazyColumn`; parsing/DB off main thread (Coroutines/WorkManager) |

## How to measure (owner / CI with a device)
1. Add a `:macrobenchmark` module (`com.android.test`) with a `StartupBenchmark`
   (`measureRepeated(CompilationMode.Partial(), StartupMode.COLD)`).
2. Generate a **Baseline Profile** (`:app:generateBaselineProfile`) and ship it in `app/src/main/baseline-prof.txt`.
3. Run `./gradlew :macrobenchmark:connectedCheck` on a connected Samsung device or an
   accelerated emulator; collect `timeToInitialDisplay` / `timeToFullDisplay`.
4. Enforce thresholds in CI (Gradle Managed Devices on a KVM-enabled runner).

Main-thread safety is structural: parsing, Room writes, and sync run on `Dispatchers.IO` /
WorkManager; the UI only collects `StateFlow`.
