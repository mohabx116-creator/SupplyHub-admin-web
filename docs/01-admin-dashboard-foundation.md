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

- Phase 17.1 connects the login form, bootstrap check, and route guards to the real API auth contract
- Access tokens are stored in `localStorage` temporarily for browser session continuity
- Dashboard routes are protected by a client-side guard
- Real RBAC and refresh-token support are still deferred

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

- No refresh-token flow yet
- No backend logout endpoint is used
- RBAC UI is not implemented beyond the backend role field display

## Next Phase Recommendation

- Phase 17.2: wire the first real admin module against authenticated API requests
