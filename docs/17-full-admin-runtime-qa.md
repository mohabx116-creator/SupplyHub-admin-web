# Full Admin Runtime QA - Phase 18.0

## Purpose

Document a single end-to-end runtime QA pass across the current SupplyHub admin web application, with a focus on authentication shell behavior, bilingual localization, module navigation, and read-only runtime stability.

## Environment Used

- Admin web: `E:\mohabx_116\SupplyHub\SupplyHub-admin-web`
- API repo: `E:\mohabx_116\SupplyHub\SupplyHub-api`
- Parent workspace: `E:\mohabx_116\SupplyHub`
- Admin dev server: `http://localhost:3000`
- API base URL during the QA run: `http://localhost:3001/api`
- Local PostgreSQL: Docker container `supplyhub-postgres`
- Browser tooling: headless Playwright via local Chrome

## Workspace Guards

- Parent workspace is not a Git repository.
- Admin repo was clean and on `main` tracking `origin/main` before QA.
- API repo was clean and treated as read-only.

## Pre-QA Validation

- `pnpm lint` passed.
- `pnpm type-check` passed.
- `pnpm build` passed.

## Runtime Notes

- The admin `.env` file in the workspace pointed to `http://localhost:3002/api`, while the live backend was running on `http://localhost:3001/api`.
- For the QA run, the admin dev server was launched with a local environment override so the runtime used the live API without modifying committed source.
- The admin `next-env.d.ts` file briefly changed during build output generation and was restored to keep the repository clean.

## Routes Reviewed

- `/login`
- `/dashboard`
- `/dashboard/requests`
- `/dashboard/requests/[id]`
- `/dashboard/suppliers`
- `/dashboard/suppliers/[id]`
- `/dashboard/quotations`
- `/dashboard/quotations/[id]`
- `/dashboard/orders`
- `/dashboard/orders/[id]`
- `/dashboard/payments`
- `/dashboard/payments/[id]`
- `/dashboard/deliveries`
- `/dashboard/deliveries/[id]`
- `/dashboard/invoices`
- `/dashboard/invoices/[id]`

## Logged-Out Coverage

- Protected dashboard routes redirected to `/login`.
- No protected module data was exposed while logged out.
- The login shell rendered safely instead of exposing internal data.
- Logged-out redirects did not loop.

## Authenticated Coverage

- A local super-admin identity was discovered from the live DB: `admin@supplyhub.local`.
- JWT auth was verified against `/api/auth/me` with a locally minted token.
- Dashboard runtime loaded successfully with the authenticated session.
- The dashboard showed the expected Arabic shell, user badge, and operational cards.
- The language switcher persisted locale selection across reloads.

## Arabic Coverage

- Arabic locale rendered with `html lang="ar"` and `html dir="rtl"`.
- Arabic login shell rendered correctly.
- Arabic dashboard shell rendered correctly.
- Arabic copy was visible in the authenticated shell and module lists.

## English Coverage

- English locale rendered with `html lang="en"` and `html dir="ltr"`.
- The login page switched to English correctly.
- Locale persistence survived reloads.

## RTL/LTR Result

- RTL was correct for Arabic.
- LTR was correct for English.
- The locale switcher updated the document direction as expected.

## Dashboard Result

- Dashboard route loaded successfully.
- The overview cards, operational modules, and sidebar labels rendered.
- The dashboard screenshot was captured locally.

## Requests Result

- Logged-out `/dashboard/requests` redirected safely to `/login`.
- The requests list route returned `200` from the server and was visible in Next dev logs.
- A request-actionable record exists in the live API.
- Browser deep-link navigation to the requests detail route was unstable in this session, so full click-through verification of the detail page was not completed.

## Suppliers Result

- Suppliers list route returned `200` from the server and was visible in Next dev logs.
- Supplier list and detail data exist in the live API.
- Full browser click-through on the supplier detail actions was not completed because the browser session became unstable after the initial dashboard/login pass.

## Quotations Result

- Quotations list route returned `200` from the server and was visible in Next dev logs.
- The request-scoped quotation API returned data for at least one request.
- Full browser selection of the request-scoped quotation list was not completed in the final session because of browser navigation instability.

## Orders Result

- Orders list route returned `200` from the server and was visible in Next dev logs.
- Order detail data exists in the live API.
- Browser detail click-through was not completed in the final session.

## Payments Result

- Payments list route returned `200` from the server and was visible in Next dev logs.
- Payment detail data exists in the live API.
- Browser detail click-through was not completed in the final session.

## Deliveries Result

- Deliveries list route returned `200` from the server and was visible in Next dev logs.
- Delivery detail data exists in the live API.
- Browser detail click-through was not completed in the final session.

## Invoices Result

- Invoices list route returned `200` from the server and was visible in Next dev logs.
- Invoice detail data exists in the live API.
- Browser detail click-through was not completed in the final session.

## Navigation Result

- Dashboard sidebar labels matched the module set.
- The main navigation entries visible in the dashboard shell were coherent across Arabic and English.
- The browser session became unstable before the full deep-link navigation matrix could be completed.

## Console / Network Result

- The browser console showed an expected favicon `404`.
- Next dev logs showed a hydration mismatch warning in `RequireAuth` from the MUI/Emotion SSR path during the dashboard shell.
- No API authentication failure was observed for the live token when checked directly against `/api/auth/me`.

## Responsive QA Result

- Dashboard and login screenshots were captured at desktop width.
- Mobile screenshot capture was not completed in the final browser session because repeated headless navigation attempts became unstable.

## Issues Found

1. Admin runtime env mismatch: local `.env` pointed to `http://localhost:3002/api` while the live API was on `3001`.
2. Hydration mismatch warning in the dashboard auth shell during Next dev.
3. Headless browser instability on deep-linked detail routes after the initial successful dashboard/login passes.

## Fixes Applied

- No committed code changes were required for the core QA pass.
- The admin dev server was launched with a temporary local API base URL override so runtime verification used the live backend.

## Screenshots Captured and Excluded

Captured locally under `.visual-review/phase-18`:

- `login-ar.png`
- `login-en.png`
- `dashboard-ar.png`
- `requests-ar.png`

These screenshots remain local QA artifacts and are excluded from Git.

## Commands Run

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- `pnpm dev`
- `docker info`
- `docker start supplyhub-postgres`
- `Test-NetConnection localhost -Port 3000`
- `Test-NetConnection localhost -Port 3001`
- `Test-NetConnection localhost -Port 5432`
- Browser-side API and route checks via Playwright

## Validation Results

- Build, lint, and type-check passed.
- API health and `/api/auth/me` were confirmed directly.
- Logged-out route protection and bilingual login/dashboard behavior were confirmed.
- A full detail-route browser matrix was not completed because the headless browser became unstable on deep links after the initial successful passes.

## Limitations

- No backend, Prisma, or deployment changes were made.
- No live mutations were submitted.
- Full mobile screenshot coverage was not completed.
- Deep-link browser navigation to detail pages was not stable enough to finish the entire visual matrix in one run.

## Remaining Backlog

- Re-run the detail-page browser matrix in a fresh browser session.
- Re-run the responsive/mobile screenshots once browser navigation is stable.
- Decide whether the dashboard hydration mismatch should be treated as a code fix or as a Next dev-only artifact.

## Recommended Next Phase

- Stabilize the detail-route browser pass, then decide whether to apply a small hydration fix or API base URL cleanup before the next admin QA sweep.
