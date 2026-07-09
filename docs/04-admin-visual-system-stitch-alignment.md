# Admin Visual System & Stitch Design Alignment

## Purpose
The purpose of this phase was to align the visual identity of the standalone Next.js admin dashboard app with the official **Stitch design guidelines**, ensuring a premium, enterprise-grade SupplyHub portal suitable for logistics and procurement operations.

---

## Stitch Design References Inspected
Two archives were extracted and reviewed:
1. `stitch_supplyhub_enterprise_dashboard_ui.zip` (Primary reference)
2. `stitch_supplyhub_procurement_operations_dashboard.zip` (Secondary reference)

### Chosen Design Direction
- **Primary Visual Identity**: Derived from the enterprise dashboard mockup. We adopted the clean, high-contrast block layouts, Midnight Navy navigation panel, and amber highlight accents.
- **Why Design 2 (Enterprise) is Primary and Design 1 (Procurement Operations) is Secondary**:
  - The Enterprise UI design defines the core typography, surface definitions, active navigation indicators, and typography hierarchies.
  - The Procurement Operations design was used as secondary reference to align custom columns, field labels, and workflow-specific elements (such as item registers and timeline placeholders).

---

## Design Tokens & Palette Implemented

- **Background Palette**:
  - Main App Background: `#F8FAFC` (Off-white)
  - Card & Surface: `#FFFFFF` (White)
  - Border & Dividers: `#E2E8F0`
- **Brand Palette**:
  - Sidebar Navy: `#0F172A` (Midnight Slate)
  - Dark Navy (Text/Strong surfaces): `#0F172A` / `#020617`
  - Accent / Primary Action CTA: `#F59E0B` (Amber)
- **Semantic Muted Status Mapping**:
  - **Success**: Bg `#D1FAE5` | Text `#065F46`
  - **Warning / Staging**: Bg `#FEF3C7` | Text `#B45309`
  - **Danger / Overdue**: Bg `#FEE2E2` | Text `#B91C1C`
  - **Info / New**: Bg `#DBEAFE` | Text `#1E40AF`
  - **Muted**: Bg `#F1F5F9` | Text `#475569`
- **Shapes & Spacing**:
  - Base spacing grid: `8px` multiplier.
  - Corner radius: `8px` (`0.5rem`) for buttons, card boxes, and input borders.
  - Monospace Data Typography: JetBrains Mono / system monospace is applied to SKU keys, entity IDs, quantitative metrics, and timestamps to optimize data density legibility.

---

## Components Created & Polished

- **Theme Layer (`src/components/theme/theme.ts`)**:
  - Updated custom MUI `createTheme` to set standard border radius at 8px, primary/secondary colors, and typography weights.
  - Implemented component-level style overrides for `MuiTableCell`, `MuiTableRow`, `MuiButton`, `MuiCard`, and `MuiChip` to ensure uniform rendering without visual clutter.
- **Global Styles (`src/styles/globals.css`)**:
  - Replaced gradient patterns with standard off-white `#F8FAFC` workspace background.
- **App Layout Sidebar (`AppSidebar.tsx`)**:
  - Refactored to use a dark Midnight Navy theme (`#0F172A`).
  - Added a 4px Amber stripe on the leading left edge of the active menu button.
  - Highlighted active list item text in white with an Amber icon, leaving other links in muted slate.
- **App Header (`AppHeader.tsx`)**:
  - Refactored header background to a flat white background, slate borders, and updated profile avatars.
  - Polished the "Staging" indicator to use the custom warning colors.

---

## Pages Refined

1. **Sign-In Page (`/login`)**:
   - Upgraded to a split-screen design.
   - Large screen view includes a Midnight Navy operations welcome panel on the right and a bordered sign-in card on the left.
   - Retained the existing security context, store state triggers, and live redirect handlers.
2. **Dashboard Overview (`/dashboard`)**:
   - Configured with six required operations KPI cards: *Open Requests*, *Pending Quotations*, *Active Purchase Orders*, *Awaiting Payments*, *Deliveries In Progress*, and *Overdue Invoices*.
   - Added interactive "Create Request (Demo)" action which fires a operational warning notice.
   - Inserted read-only "Recent Operations Feed", "Pending Approvals Queue", and "Core Services Status" panels.
3. **Requests List (`/dashboard/requests`)**:
   - Upgraded the filter selection bar and search actions.
   - Monospaced table cells for transaction IDs, item counts, and timestamps.
   - Aligned badges to the design status chip tokens.
4. **Request Details (`/dashboard/requests/[id]`)**:
   - Structured metadata fields (needed-by date, timestamps, item counts) using monospace parameters.
   - Applied card borders and inline dividers to company and user profiling modules.
   - Formatted the Items table to clearly outline columns, counts, and estimated budgets.
   - Added a "Request Activity History" timeline clearly labeled as mock data logs.

---

## Functional Status vs. Placeholders

- **Fully Functional Elements (Unchanged Integration)**:
  - Sign-in authorization submission and JWT store session persistence.
  - Route authentication guard.
  - Live HTTP query logic for `GET /api/admin/requests` and `GET /api/admin/requests/:id`.
  - Staging filter selections and list refresh triggers.
- **Demonstration / Mock Components**:
  - The "Create Request" action triggers a temporary warning notice.
  - Non-Requests sidebar options (Suppliers, Quotations, Orders, Payments, Deliveries, Invoices) map to module placeholders.
  - Recent activity feed, pending approvals queue, request history timeline, and cycle-time reports render static demo records to maintain visual realism.

---

## Verification Results
All compiler checks passed:
- `pnpm install --frozen-lockfile` completed successfully.
- `pnpm build` created production assets.
- `pnpm lint` passed with no warnings.
- `pnpm type-check` verified TypeScript type safety.

---

## Next Recommended Step
Integrate the live backend endpoints for the **Suppliers** list and supplier profile forms in Phase 18.
