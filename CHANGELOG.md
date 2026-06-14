# Changelog

All notable changes to ShahojAI are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-06-14

### Added
- Multi-tenant RAG customer-support agent: per-organization Qdrant collections, retrieval over uploaded FAQs, Groq-powered answers.
- Bengali + English automatic language detection and matched responses.
- Supabase authentication (email + Google OAuth) with cookie-based sessions shared across middleware and route handlers.
- Credit-based billing with aamarPay (BDT): checkout, server-to-server verification, idempotent webhook, monthly tiers (Starter/Pro/Enterprise).
- White-label branding (logo, primary color, company name, "powered by" toggle) and Enterprise custom domains.
- Embeddable JavaScript chat widget with per-tenant branding and CORS allow-listing.
- Marketing site (landing, pricing, about, contact, FAQ) and full legal suite (Privacy, Terms, Cookies, Acceptable Use, Refunds, DPA).

### Security
- Authorization derived from the authenticated session on every endpoint — client-supplied `organizationId` is never trusted (closes IDOR).
- Atomic credit deduction via a Postgres function (no read-then-write race); automatic refund on generation failure.
- Idempotent, server-verified payment webhook (POST-only); amounts and status are re-checked against aamarPay, never taken from the request.
- Input validation with Zod at every API boundary; per-IP rate limiting on chat, upload, and checkout.
- Fail-loud environment validation for server secrets; deterministic vector IDs to prevent cross-document collisions.

### Engineering
- Switched to the cheapest viable stack: Groq free tier for chat, local `all-MiniLM-L6-v2` embeddings (zero per-token cost).
- Unit test suite (Vitest) and GitHub Actions CI (type-check, test, build).

[1.0.0]: https://github.com/munim430-ai/nescafe/releases/tag/v1.0.0
