# Security Audit — sohojAI Android-first Platform

Scope: Android app (`apps/android`), backend API (`app/api/android`, `app/api/billing`,
`lib/server`), and database (`supabase/migrations/002_android_rebuild.sql`).
Date: 2026-06-15. Status: **foundation hardened; items below tracked.**

## Secrets & key handling
| Control | Status |
|---|---|
| Service-role key never in the APK | ✅ App ships only the publishable anon key |
| AI / payment secrets server-side only | ✅ ppq.ai key, SSLCommerz creds used only in `lib/server` |
| No secrets committed | ✅ Verified: keystore, `keystore.properties`, `local.properties`, APKs, build output git-ignored; repo grep clean |
| Release signing | ⚠️ Dev keystore used in CI; **production keystore is an owner action** |
| Leaked creds in chat history | 🔴 Owner must rotate Supabase service_role/secret/DB password, ppq.ai key, Jina key, Vercel token |

## Data protection
- **Never stored:** raw SMS/notification text, OTP, PIN. The parser returns only structured
  fields; a unit test asserts `ParsedTransaction` has no raw/message field.
- **Counterparty masking:** phone numbers stored masked (`015****022`).
- **Local-first:** Room is the source of truth on-device; only structured rows sync.
- **Dedup hash** instead of raw text for idempotency (`sha256(trxId|amount|occurredAt)`).

## Tenant isolation (RLS) — EXECUTED
Ran `supabase/test/run_rls_tests.sh` against PostgreSQL 16 — **10/10 pass**:
tenant isolation on read, org-member isolation, device-scoped inserts, cross-tenant &
cross-device insert blocks, `audit_logs`/`usage_events` client-write denial, anon sees nothing.
Privileged writes (subscriptions, usage, audit) are service-role only — the anon key cannot forge them.

## Backend authorization
- Every Android/billing route resolves org + plan from the Supabase access token (`getAuthContext`).
- **Device revocation** enforced server-side: sync rejects revoked/foreign devices (HTTP 403).
- **Entitlements** enforced server-side (device + monthly-txn limits, plan-gated auto-detection);
  rejections are explicit with codes/reasons (no silent failure).
- **Audit logging** on register/revoke/sync/export/delete/subscribe.
- **Data rights:** export (`GET /api/android/data`) and delete (`DELETE`, owner-only).

## Open items (tracked, not yet implemented)
- Rate limiting on sync/AI endpoints (`RATE_LIMIT_*` reserved; not wired).
- AI monthly spend-cap enforcement (`AI_MONTHLY_BUDGET_USD` is config only).
- APK self-update integrity: signature pinning + detached manifest signature + downgrade rejection
  (see `apps/android/UPDATE_MANIFEST.example.json`).
- Android secure token storage via Keystore-backed `EncryptedSharedPreferences`/DataStore (token
  storage is scaffolded; encryption wrapper pending).

## Required owner actions (security)
1. **Rotate** all credentials pasted into the build session.
2. Provide a **production signing keystore** (Play App Signing recommended).
3. Set `DEVICE_ID_HASH_SALT` (server secret) before enabling device binding in prod.
