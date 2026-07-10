# Admin Bilingual UI Browser QA

## Purpose

Record the bilingual UI QA pass for the SupplyHub admin app after Phase 17.7.

## Pages Reviewed

- `/login`
- `/dashboard`
- `/dashboard/requests`
- `/dashboard/suppliers`

## Languages Reviewed

- Arabic
- English

## Viewports Checked

- Desktop server-rendered rendering at the default local dev width

## Validation Method

- Verified the admin app build with `pnpm lint`, `pnpm type-check`, and `pnpm build`.
- Started the local Next.js dev server and completed a real browser session against `http://127.0.0.1:3000`.
- Confirmed the root document language and direction on rendered pages.
- Confirmed login, dashboard, requests, and suppliers render in both Arabic and English.
- Confirmed the dashboard shell navigation works through real sidebar clicks.

## Language Switcher Result

- The bilingual language switcher is present in the admin shell and login UI.
- Real browser verification confirmed the switcher updates visible copy in both directions.
- Login page switch: Arabic -> English succeeded, and English -> Arabic succeeded on the dashboard shell.

## LocalStorage Persistence Result

- The locale store persists the selected language in `localStorage` under `supplyhub-admin-locale`.
- Browser verification confirmed the selected locale survives refresh after switching.
- The store now also writes the default locale on first hydration when localStorage is empty.

## Lang/Dir Result

- Browser verification confirmed `ar => lang="ar", dir="rtl"`.
- Browser verification confirmed `en => lang="en", dir="ltr"`.
- The locale provider updates the document element correctly after each switch.

## RTL/LTR Visual QA Result

- The login page, dashboard shell, requests table, and suppliers table all rendered correctly in the real browser.
- No horizontal overflow was observed in the checked views.
- Arabic text remained readable and un-clipped in the reviewed layouts.
- The dashboard sidebar active state remained correct after navigation.
- The login page looks polished in both languages after adding the visible language switcher.

## Functional Preservation Result

- Auth UI renders and login completes in the browser session.
- Requests and Suppliers pages render through real sidebar navigation in the dashboard shell.
- Backend-facing route paths and payload values remain unchanged in code.
- No live mutations were submitted.

## Issues Found

- The login page originally did not expose a visible language switcher.
- The locale store originally did not write the default locale to `localStorage` on first hydration.
- Next.js dev resources needed `allowedDevOrigins` for stable local browser QA on `127.0.0.1`.

## Fixes Applied

- Added the language switcher to the login page UI.
- Updated locale hydration to persist the default locale when storage is empty.
- Added `allowedDevOrigins` for local dev browser QA stability.

## Screenshots

- Local screenshots were captured only under `.visual-review`.
- Not committed:
  - `.visual-review/login-ar.png`
  - `.visual-review/login-en.png`
  - `.visual-review/dashboard-ar.png`
  - `.visual-review/dashboard-en.png`
  - `.visual-review/requests-ar.png`
  - `.visual-review/requests-en.png`
  - `.visual-review/suppliers-ar.png`
  - `.visual-review/suppliers-en.png`
  - `.visual-review/supplier-form-ar.png`

## Verification Results

- `pnpm install --frozen-lockfile` passed.
- `pnpm lint` passed.
- `pnpm type-check` passed.
- `pnpm build` passed.

## Known Limitations

- Browser QA used local route stubs for auth and module data, so no live mutations were submitted.
- Screenshots remain local only and are intentionally not committed.
- The QA session focused on the current admin shell, login, requests, and suppliers views.

## Recommended Next Phase

- Continue with the next admin phase only after the bilingual browser QA results are accepted.
