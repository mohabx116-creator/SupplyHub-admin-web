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
- Started the local Next.js dev server and validated server-rendered HTML responses.
- Confirmed the root document language and direction on rendered pages.
- Confirmed the login page and dashboard shell render Arabic copy by default on the server.

## Language Switcher Result

- The bilingual language switcher is present in the admin shell and login UI in code.
- Browser runtime was not available in this session, so interactive click-through verification of the switcher could not be completed here.

## LocalStorage Persistence Result

- The locale store persists the selected language in `localStorage` under the admin locale key.
- Browser runtime was not available in this session, so live persistence after UI toggling could not be click-verified here.

## Lang/Dir Result

- Server-rendered pages return `lang="ar"` and `dir="rtl"` by default.
- The locale provider is wired to update the document element when the selected locale changes.

## RTL/LTR Visual QA Result

- The rendered admin HTML and Arabic copy load successfully in RTL mode.
- No broken Arabic copy was observed in the server-rendered responses reviewed here.
- Browser-only layout checks such as clipped text, overflow, icon mirroring, and responsive spacing could not be visually inspected because the browser runtime was unavailable.

## Functional Preservation Result

- Auth UI still renders.
- Requests and Suppliers pages still render through the admin shell.
- Backend-facing route paths and payload values remain unchanged in code.
- No live mutations were submitted.

## Issues Found

- No code defects were identified in this pass.
- Browser runtime was unavailable, so interactive UI verification could not be completed.

## Fixes Applied

- None in this phase.

## Screenshots

- None captured.
- No screenshots were committed.
- `.visual-review` remains excluded from Git history.

## Verification Results

- `pnpm install --frozen-lockfile` passed.
- `pnpm lint` passed.
- `pnpm type-check` passed.
- `pnpm build` passed.

## Known Limitations

- Interactive browser QA could not be completed because the browser runtime was unavailable in this session.
- LocalStorage toggling and live language-switch click testing remain browser-only verification items.

## Recommended Next Phase

- Continue with the next admin phase only after a live browser session confirms the bilingual switcher, RTL/LTR behavior, and responsive layout.
