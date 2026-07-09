# SupplyHub Admin Web

Standalone Next.js admin dashboard foundation for SupplyHub.

## Stack

- Next.js App Router
- TypeScript
- Material UI
- Axios
- Zustand

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm type-check`

## Setup

1. Copy `.env.example` to `.env.local` if needed.
2. Set `NEXT_PUBLIC_API_BASE_URL` for local development.
3. Run `pnpm install`.

## Scope

This phase provides the initial admin shell, login placeholder, dashboard foundation, API client wrapper, and auth placeholders.

It does not yet implement:

- real auth flow wiring
- protected route enforcement
- backend mutations
- deployment

## Next Step

Phase 17.1 will connect real authentication and guarded navigation.
