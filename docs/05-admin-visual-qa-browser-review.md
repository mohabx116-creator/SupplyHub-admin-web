# Admin Visual QA & Browser Screenshot Review

## Purpose
This document records the visual QA review pass for the SupplyHub Admin Web dashboard following the visual system alignment with the Stitch design reference framework.

## Pages Reviewed
1. `/` (Redirects to `/login` when unauthenticated, and `/dashboard` when authenticated)
2. `/login` (Responsive split-screen sign-in page)
3. `/dashboard` (Operations overview with 6 core KPI widgets, recent activity feed tables, pending approvals queue, and services status monitor)
4. `/dashboard/requests` (Dense requests registry list, active search filters, monospace formatted IDs, dates, and light status badges)
5. `/dashboard/requests/[id]` (Request details view showing title, company/requester metadata cards, structured items table, and activity audit timeline)

## Viewport Sizes Checked
- **Desktop (1280px+)**: Primary verification resolution, verified sidebar width, header alignments, card grids spacing, and table cell borders.
- **Mobile/Tablet**: Verified sidebar collapsing menu, header title wrap, login split-screen converting to single-column card layout, and grid responsiveness.

## Screenshot Paths (Local Reference Only)
Screenshots were captured locally under the `.visual-review/` folder and are excluded from git.
- `.visual-review/login_page_1783634946756.png` - Brand and form panels.
- `.visual-review/login_attempt_result_1783635018231.png` - Successful authentication.
- `.visual-review/dashboard_page_full_1783635249425.png` - Full dashboard layout (6 KPIs, recent activity, and service grids).
- `.visual-review/requests_page_full_1783635278312.png` - Dense requests table grid.
- `.visual-review/request_details_1783636112709.png` - Successful request detail view for ID `eb6668c6-1d9b-463c-b644-67412311b94e` after fixing the async params bug.

## Issues Found
- **Next.js 15+ Async Params warning/crash**:
  - The request detail client component page directly accessed `params.id` synchronously. In Next.js 15+, `params` is a Promise. Synchronous access evaluated `id` as `undefined` or a Promise object, failing the backend UUID validator and rendering an error card.
  - The placeholder module server component page accessed `params.module` synchronously, triggering compile-time warnings and potential hydration drift.

## Fixes Applied
- **Request Detail Client Component (`src/app/dashboard/requests/[id]/page.tsx`)**:
  - Imported React's `use` hook: `import { use } from 'react';`.
  - Updated props typing: `params: Promise<{ id: string }>`.
  - Unwrapped `params` using `const resolvedParams = use(params)` to retrieve `id` safely inside `useEffect` and dependencies.
- **Placeholder Module Server Component (`src/app/dashboard/[module]/page.tsx`)**:
  - Updated props typing: `params: Promise<{ module: string }>`.
  - Awaited parameter object: `const { module } = await params;`.
- **Git Ignored Review Folder**:
  - Appended `.visual-review` to the frontend `.gitignore` file to ensure screenshot files remain local and are never committed to version control.

## Verification Results
All linting, type checks, and production builds compile successfully with zero errors:
- `pnpm lint` -> Pass
- `pnpm type-check` (`tsc --noEmit`) -> Pass
- `pnpm build` -> Pass

## Exclusions & Security Confirmation
- No `.env` or configuration secrets were modified or staged.
- The `.visual-review` screenshot files are untracked and excluded by `.gitignore`.
- No modifications were made to the Prisma schema, database migrations, or the read-only `SupplyHub-api` codebase.
