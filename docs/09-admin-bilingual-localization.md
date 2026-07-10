# Admin Bilingual Localization QA

## Scope

This document records the bilingual localization pass for the admin app UI.

## Audit Method

- Searched `src/app`, `src/components`, `src/features`, and `src/lib` for visible UI strings in JSX and string literals.
- Moved user-facing copy into `src/lib/i18n/messages.ts` and `src/lib/i18n/ar.ts`.
- Added a client-side locale store with `localStorage` persistence and document-level `lang` and `dir` synchronization.
- Verified status chips and action dialogs still use backend enum values internally and only map display labels at render time.

## Major Areas Localized

- Login screen and auth guards
- App shell header, sidebar, and language switcher
- Dashboard KPI cards, activity feed, approvals, and module links
- Requests list, detail view, status chips, action panel, and dialogs
- Suppliers list, detail view, status chips, action panel, forms, and status dialog
- Empty states, error states, and loading scaffolds

## Allowed Technical Terms

- `SupplyHub`
- `API`
- `ID`
- `UUID`
- `URL`
- `JWT`
- `WhatsApp`
- backend enum values used internally only
- route paths
- environment variable names
- code identifiers

## Key QA Checks

- Arabic and English dictionaries expose matching keys through the shared localization bundle structure.
- No translated UI labels are sent to the backend.
- Backend request payloads still use original enum values and route paths.
- Locale switching updates visible copy, `lang`, and `dir`.
- `localStorage` is used only for the selected locale and does not store secrets.

## Notes

- The module placeholder routes remain localized through bilingual route metadata.
- Any remaining technical strings are limited to brand or code-level terms listed above.
