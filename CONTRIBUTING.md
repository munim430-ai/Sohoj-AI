# Contributing to ShahojAI

Thanks for your interest in improving ShahojAI. This document explains how to set up the project, the standards we hold code to, and how to get a change merged.

## Prerequisites

- Node.js 20+
- A Supabase project (free tier)
- A Qdrant instance (free tier or local Docker)
- A Groq API key (free) — used for chat completions

## Local setup

```bash
git clone <repo-url>
cd shahojai
npm install
cp .env.example .env.local   # fill in your values
```

Apply database migrations in the Supabase SQL editor, in order:

1. `supabase/migrations/001_init.sql`
2. `supabase/migrations/002_atomic_credits_and_integrity.sql`

Then:

```bash
npm run dev          # http://localhost:3000
npm test             # unit tests (Vitest)
npm run type-check   # tsc --noEmit
npm run build        # production build
```

## Branching & commits

- Branch from `main` using `type/short-description`, e.g. `fix/credit-race`, `feat/widget-theming`.
- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Keep commits focused and the working tree green (`npm test && npm run build`).

## Pull requests

1. Ensure `npm test`, `npm run type-check`, and `npm run build` all pass.
2. Add or update tests for any behavior change.
3. Update docs/migrations when you change schema, env vars, or public APIs.
4. Fill out the PR template. Small, reviewable PRs merge faster.

## Code standards

- **TypeScript everywhere**, `strict` mode. No `any` unless justified with a comment.
- **Security first.** Never trust a client-supplied `organizationId` — derive it from the session (`lib/auth-helpers.ts`). Never import the service-role client into client components.
- **Validate input** at the boundary with the Zod schemas in `lib/validation.ts`.
- Match the existing style. The UI uses the design tokens in `styles/uber-design.css`.

## Reporting security issues

Do **not** open a public issue for vulnerabilities. See [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree your contributions are licensed under the project's MIT License.
