# ShahojAI — Asset & Component Gap Analysis

A living inventory of what exists, what's partial, and what's still missing. Status key: ✅ done · ⚠️ partial / needs work · ❌ missing.

_Last reviewed: 14 June 2026_

---

## 1. Core product features

| Component | Status | Notes |
|---|---|---|
| Multi-tenant auth (email + Google) | ✅ | Cookie sessions via `@supabase/ssr`. |
| OAuth callback | ✅ | `app/auth/callback/route.ts`. |
| RAG chat (Bangla/English) | ✅ | Groq + local embeddings. |
| Per-org Qdrant collections | ✅ | Created on first upload. |
| Atomic credits + auto-refund | ✅ | Postgres RPC, migration 002. |
| Payment checkout + verified webhook | ✅ | Confirm aamarPay field names against a live account. ⚠️ |
| Embeddable widget + CORS | ✅ | Per-tenant origin allow-list. |
| White-label branding | ✅ | Logo, color, company name, powered-by toggle. |
| **PDF upload** | ❌ | Removed for reliability; only CSV/text today. Re-add with a serverless-safe PDF parser. |
| **Documents list / delete in Settings** | ❌ | UI shows a hardcoded "No documents yet"; not wired to `faq_documents` or a delete endpoint. |
| **Widget snippet generator in Settings** | ❌ | Referenced in onboarding; needs a copy-paste UI block showing the org's script tag. |
| **Usage chart (conversations/day)** | ❌ | Dashboard shows totals only; no time-series chart or `/api/usage` consumption. |
| **Monthly credit reset** | ❌ | Spec calls for a monthly reset (cron or login check); not implemented. |
| **Plan upgrade flow** | ⚠️ | "Upgrade" buttons are visual only; no tier-change checkout/proration. |
| **Recurring subscription billing** | ❌ | Only one-time credit packs; no renewal cycle. |
| **Forgot / reset password** | ❌ | No reset UI; relies on Supabase defaults. |
| **Team invites / multiple users** | ❌ | Schema has roles; no invite flow or member management UI. |
| **Guided onboarding wizard** | ⚠️ | `/onboard` auto-creates a default org; no step-by-step UI. |
| **Conversation history / export** | ⚠️ | Chat loads recent history; no pagination, search, or export. |
| **GDPR data export / account deletion** | ❌ | Privacy policy promises it; no self-serve UI/endpoint. |

---

## 2. Brand & visual assets

| Asset | Status | Notes |
|---|---|---|
| Logo (SVG) + mark | ✅ | `public/logo.svg`, `logo-mark.svg`. |
| Favicon (SVG) | ✅ | `public/favicon.svg`, `app/icon.svg`. |
| **Favicon `.ico`** | ❌ | Some browsers/bookmarks expect `favicon.ico`. |
| **PWA icons (PNG 192/512, maskable)** | ❌ | `manifest.json` references SVGs; PNGs recommended for installability. |
| OG image (SVG) | ⚠️ | `og-image.svg` exists; most social scrapers need a **PNG/JPG 1200×630**. Render an export. |
| **Apple touch icon (180×180 PNG)** | ❌ | Missing for iOS home-screen. |
| Brand guidelines doc | ⚠️ | Colors/fonts live in CSS; no standalone brand spec. |

---

## 3. Marketing & content pages

| Page | Status | Notes |
|---|---|---|
| Landing, Pricing, About, Contact, FAQ | ✅ | Under `app/(marketing)`. |
| Legal: Privacy, Terms, Cookies, AUP, Refunds, DPA | ✅ | Pages + markdown sources. |
| **Blog / changelog (public)** | ❌ | No public blog or release-notes page (internal `CHANGELOG.md` only). |
| **Status page** | ❌ | No uptime/status surface. |
| **Custom 404 / error pages** | ❌ | Using Next defaults; add `not-found.tsx` and `error.tsx`. |
| **Loading skeletons** | ⚠️ | Simple "Loading…" text; no skeleton states. |

---

## 4. Email & notifications

| Item | Status | Notes |
|---|---|---|
| Auth emails (confirm, magic link, reset) | ⚠️ | Supabase defaults; no branded templates committed. |
| **Payment receipt email** | ❌ | No receipt sent after a successful credit purchase. |
| **Low-credit warning email** | ❌ | No alert as balance approaches zero. |
| **Transactional email provider** | ❌ | No Resend/Postmark integration. |

---

## 5. Engineering, testing & ops

| Item | Status | Notes |
|---|---|---|
| Unit tests (Vitest) | ✅ | validation, rate-limit, language, vector IDs. |
| CI (type-check + test + build) | ✅ | `.github/workflows/ci.yml`. |
| **API route / integration tests** | ❌ | No tests for chat/upload/webhook handlers. |
| **E2E tests (Playwright)** | ❌ | No browser-level flows. |
| **Error monitoring (Sentry)** | ❌ | `console.error` only; no aggregation/alerting. |
| **Product analytics** | ❌ | No PostHog/Plausible. |
| **Distributed rate limiting** | ⚠️ | In-memory per instance; move to Upstash/Postgres at scale. |
| **Structured logging** | ⚠️ | Ad-hoc `console.*`; no request IDs / log levels. |
| **Healthcheck endpoint** | ❌ | No `/api/health` for uptime probes. |
| Dependabot | ✅ | `.github/dependabot.yml`. |
| **Secret scanning (gitleaks)** | ❌ | Not configured in CI. |

---

## 6. Configuration & deployment

| Item | Status | Notes |
|---|---|---|
| `.env.example` | ✅ | Cheap stack documented. |
| DB migrations (001, 002) | ✅ | Run both in Supabase. |
| Qdrant init script | ✅ | `scripts/qdrant-init.ts`. |
| **Seed / demo data script** | ❌ | No script to load a sample org + FAQs for demos. |
| **`sitemap`/`robots` real domain** | ⚠️ | Update host once the production domain is final. |
| README / SETUP / ONBOARDING | ✅ | Present. |

---

## Suggested priority order

**P0 — blocks a real launch**
1. Confirm aamarPay verification field names against a live merchant account.
2. Documents list + delete in Settings (otherwise uploads feel one-way).
3. Widget snippet generator in Settings (needed for the core embed flow).
4. Monthly credit reset (billing correctness).

**P1 — expected of a polished SaaS**
5. Usage chart + `/api/usage`.
6. Plan upgrade / recurring billing.
7. Branded auth emails + payment receipt (Resend).
8. Custom 404/500, loading skeletons, healthcheck.
9. PNG favicon/OG/PWA icons.

**P2 — scale & trust**
10. API/integration + E2E tests.
11. Sentry + analytics + structured logging.
12. Team invites, password reset, GDPR export/delete.
13. Distributed rate limiting, gitleaks in CI.
