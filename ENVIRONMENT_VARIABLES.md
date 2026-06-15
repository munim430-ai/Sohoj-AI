# Environment Variables — sohojAI Android-first Platform

This document is the single source of truth for every configuration value used by the
platform after the Android-first rebuild. It covers three surfaces:

- **Backend / Admin** (Next.js API + admin, server-side only) — `.env` / `.env.local`
- **Supabase** (project + edge functions) — Supabase dashboard / CLI secrets
- **Android app** (`apps/android`) — Gradle `secrets.properties` / `local.properties`

> Security levels: **PUBLIC** (safe to ship to clients/embed in APK), **SECRET** (server/CI
> only, never in the APK or client bundle), **LOCAL** (developer/CI machine only, never committed).
>
> "Mock allowed" = the system runs with a built-in mock provider when the value is absent,
> so development is never blocked waiting on a real credential.

## Backend / Admin (`.env`, `.env.local`)

| Variable | Required | Security | Purpose | Mock allowed |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Required | PUBLIC | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | PUBLIC | Supabase anon (publishable) key; RLS-guarded | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | **SECRET** | Server-side admin writes, bypasses RLS. Never sent to client/APK | No |
| `SUPABASE_PROJECT_REF` | Required | SECRET | Project ref for CLI/migrations | No |
| `SUPABASE_DB_URL` | Optional | SECRET | Direct Postgres URL for migrations/RLS tests | No |
| `SUPABASE_JWT_SECRET` | Optional | SECRET | Verify Supabase JWTs server-side | No |
| `PAYMENT_PROVIDER` | Required | PUBLIC | `mock` \| `sslcommerz` (default `mock`) | — |
| `SSLCOMMERZ_STORE_ID` | Optional | SECRET | SSLCommerz store id (scaffold only) | Yes |
| `SSLCOMMERZ_STORE_PASSWD` | Optional | SECRET | SSLCommerz store password | Yes |
| `SSLCOMMERZ_SANDBOX` | Optional | PUBLIC | `true` for sandbox | Yes |
| `AI_PROVIDER` | Required | PUBLIC | `mock` \| `openai` \| `groq` (default `mock`) | — |
| `OPENAI_API_KEY` | Optional | SECRET | OpenAI key, backend AI proxy only | Yes |
| `GROQ_API_KEY` | Optional | SECRET | Alternative LLM provider | Yes |
| `AI_MODEL` | Optional | PUBLIC | Model id (e.g. `gpt-4o-mini`) | Yes |
| `AI_MONTHLY_BUDGET_USD` | Optional | SECRET | Hard spend cap enforced by backend | Yes |
| `RATE_LIMIT_WINDOW_SEC` | Optional | PUBLIC | Rate-limit window for sync/AI endpoints | Yes |
| `RATE_LIMIT_MAX` | Optional | PUBLIC | Max requests per window per device | Yes |
| `NEXT_PUBLIC_APP_URL` | Required | PUBLIC | Backend base URL (callbacks, deep links) | No |
| `APK_UPDATE_MANIFEST_URL` | Optional | PUBLIC | URL serving the APK update manifest JSON | Yes |

### Legacy / out-of-scope (POC only — slated for removal in this rebuild)

| Variable | Status |
|---|---|
| `QDRANT_URL`, `QDRANT_API_KEY` | Legacy FAQ-RAG; not used by bKash analytics. Remove unless RAG is re-scoped. |
| `AAMARPAY_STORE_ID`, `AAMARPAY_SIGNATURE_KEY`, `AAMARPAY_SANDBOX` | Legacy credit billing; replaced by SSLCommerz scaffold. |
| `NEXT_PUBLIC_WIDGET_URL` | Web embed widget; out of scope. |

## Android app (`apps/android/secrets.properties`)

The APK must contain **only** publishable values. All privileged operations (AI calls, service-role
writes, payment creation) go through the authenticated backend.

| Variable | Required | Security | Purpose | Mock allowed |
|---|---|---|---|---|
| `SUPABASE_URL` | Required | PUBLIC | Supabase project URL | No |
| `SUPABASE_ANON_KEY` | Required | PUBLIC | Anon key; all access RLS-guarded by device/org | No |
| `API_BASE_URL` | Required | PUBLIC | Backend base URL for AI proxy + sync + payments | No |
| `SENTRY_DSN` | Optional | PUBLIC | Crash/ANR reporting | Yes |
| `APK_UPDATE_MANIFEST_URL` | Optional | PUBLIC | Self-update manifest endpoint | Yes |

### Signing / release (`apps/android/keystore.properties` — LOCAL/CI only, never committed)

| Variable | Required | Security | Purpose | Mock allowed |
|---|---|---|---|---|
| `RELEASE_STORE_FILE` | Required (release) | LOCAL | Path to the signing keystore | Debug keystore for dev |
| `RELEASE_STORE_PASSWORD` | Required (release) | LOCAL | Keystore password | — |
| `RELEASE_KEY_ALIAS` | Required (release) | LOCAL | Signing key alias | — |
| `RELEASE_KEY_PASSWORD` | Required (release) | LOCAL | Key password | — |

> ❌ The Android app must **never** receive `SUPABASE_SERVICE_ROLE_KEY`, any AI provider key, or
> any payment secret. If any of these appear in `apps/android/`, the security gate fails.
