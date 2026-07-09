# Admin Dashboard Foundation

## Purpose

Create the initial standalone `SupplyHub-admin-web` frontend foundation for the admin dashboard.

## App Structure

- `src/app` for routes and layouts
- `src/components/layout` for shell composition
- `src/components/ui` for shared UI primitives
- `src/features` for feature placeholders
- `src/lib/api` for the reusable API client
- `src/lib/config` for environment handling
- `src/lib/routes` for route constants
- `src/styles` for global styling

## Routes Created

- `/`
- `/login`
- `/dashboard`
- `/dashboard/[module]` for lightweight module placeholders

## Components Created

- `AdminShell`
- `AppHeader`
- `AppSidebar`
- `EmptyState`
- `PageHeader`

## API Client Foundation

- Uses `NEXT_PUBLIC_API_BASE_URL`
- Defaults to a safe local development API URL when the env var is missing
- Centralizes request and error mapping through Axios

## Auth Placeholder Strategy

- Defines auth types, a login wrapper, and an in-memory auth store
- Does not persist real tokens
- Does not enforce real protected routing yet
- Real integration is reserved for Phase 17.1

## Env Keys

- `NEXT_PUBLIC_API_BASE_URL`

## Verification Results

- `pnpm install` completed successfully after approving the pending native build scripts
- `pnpm build` completed successfully
- `pnpm lint` completed successfully
- `pnpm type-check` completed successfully

## Install Notes

- `pnpm approve-builds --all` was used to approve the pending native build scripts for `sharp` and `unrs-resolver`
- `pnpm-workspace.yaml` records those approved builds for future installs

## Known Limitations

- Real authentication is not wired yet
- Backend mutations are not called yet
- Protected route enforcement is not yet active

## Next Phase Recommendation

- Phase 17.1: connect real auth and route protection
