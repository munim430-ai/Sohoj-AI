# Production Checklist — sohojAI Android-first Platform

## Verified in this build (executed, not assumed)
- [x] Android **debug + signed release APK** build (`assembleDebug`, `assembleRelease`, R8 + shrink)
- [x] Android **unit tests** pass (parser: 9 types/cases; analytics)
- [x] **Backend compiles** (`next build`) — `/api/android/{sync,devices,assistant,data}`, `/api/billing/subscribe`
- [x] **Backend unit tests** pass — 19 (entitlements, analytics, assistant grounding, billing)
- [x] **RLS tests executed** on PostgreSQL 16 — 10/10 (tenant/org/device isolation, audit/usage protection)
- [x] **Subscription enforcement** implemented + tested (device + monthly limits, plan-gated auto-detection, no silent failures)
- [x] **AI assistant**: deterministic figures, LLM only phrases (`computedBy=deterministic-engine`); bn/banglish/en intent
- [x] **Transaction sync**: device auth, idempotent batches, audit logging
- [x] **Mock billing** + SSLCommerz scaffold (no live gateway)
- [x] **Data export/delete** + **device revocation** endpoints
- [x] **No secrets committed**; secrets/keystore/APK git-ignored
- [x] Docs: ANDROID_BUILD, SECURITY_AUDIT, PERFORMANCE, ENVIRONMENT_VARIABLES, update-manifest example

## Owner-blocked (cannot be done in CI / require owner assets) — TRUE blockers only
- [ ] **Rotate** credentials pasted into the session (Supabase service_role/secret/DB password, ppq.ai, Jina, Vercel)
- [ ] Provide **production signing keystore** (Play App Signing) — release currently dev-signed
- [ ] **Apply** `002_android_rebuild.sql` to the Supabase project (owner deploys; not auto-deployed)
- [ ] Provide **real bKash samples** for Cash Out / Send Money sent / Charge / Balance-only to raise those parser rules from LOW→HIGH confidence
- [ ] **On-device performance validation** (no KVM/emulator in CI) — run macrobenchmark on a Samsung device per `docs/PERFORMANCE.md`

## Recommended before GA (engineering, not blocking)
- [ ] Rate limiting on sync/AI endpoints (`RATE_LIMIT_*` reserved)
- [ ] AI spend-cap enforcement (`AI_MONTHLY_BUDGET_USD`)
- [ ] APK self-update integrity (signature pinning + signed manifest + downgrade rejection)
- [ ] Keystore-backed encrypted token storage wrapper
- [ ] Compose UI (instrumented) tests + Room migration tests on a device
- [ ] Renewal scheduler/cron wiring for the billing state machine
