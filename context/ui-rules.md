# UI Rules: Ride With Pals Admin Control Center

Concise layout and design constraints for building and refactoring UI screens in **Ride With Pals — Admin Control Center**. Adhere strictly to these rules to maintain visual and functional consistency across all sessions.

---

## 1. Layout & Shell Geometry

- **Sidebar Header Alignment:** The logo header in `#sidebar` must have a height of **exactly 80px** with `border-b border-border` to align seamlessly with the main navigation bar.
- **Top Navbar:** Height of **exactly 80px**, sticky at the top with `backdrop-blur-md bg-surface/80 border-b border-border`. Contains page breadcrumbs/title, global search, notification bell with bounce indicator, theme toggle, and administrator profile menu.
- **Responsive Drawer:** On viewports below `1024px` (tablets and mobile), the sidebar collapses into an accessible slide-over drawer triggered by a hamburger button.
- **Main Canvas:** Fluid max-width with padding `p-6` (mobile/tablet) to `p-8` (desktop).

---

## 2. Typographic Rules

- **Display & Headings:** Always apply `font-poppins`.
  - Page Titles: `text-2xl font-bold font-poppins text-text-main`
  - Section Headings: `text-lg font-semibold font-poppins text-text-main`
  - KPI Stat Values: `text-3xl font-extrabold font-poppins text-text-main`
- **Body & Data Tables:** Always apply `font-roboto`.
  - Table Headers: `text-xs font-semibold uppercase tracking-wider text-text-muted font-roboto`
  - Table Data Cells: `text-sm font-normal text-text-main font-roboto`
  - Form Labels & Input Text: `text-sm font-medium font-roboto`
  - Subtitles & Descriptions: `text-sm text-text-muted font-roboto`

---

## 3. Data Tables & List Views

All resource directories (`/users`, `/clubs`, `/payments`, etc.) must use the standardized `DataTable<T>` pattern:
1. **Search Debouncing:** Text search inputs must be debounced by **300ms** using `useDebounce` to prevent spamming backend queries.
2. **Skeleton Loading:** When fetching data, render pulsing skeleton rows rather than blank spaces or jarring full-screen spinners.
3. **Empty States:** When no records match, display an informative empty state illustration/icon, a descriptive heading, and an optional "Clear Filters" CTA.
4. **Action Menus:** Never crowd table rows with multiple plain text buttons. Use portal-based dropdown menus (`ActionMenu`) with auto-repositioning to avoid overflow clipping inside scrollable tables.

---

## 4. Modals & Destructive Actions

1. **Confirmation Modals (`ConfirmModal`):**
   - Irreversible actions (suspending athletes, disbanding clubs, archiving subscription plans, taking down gear) require an explicit confirmation modal.
   - Destructive buttons must use `bg-error text-white hover:brightness-105`.
   - Modals must support keyboard `Escape` dismissal and trap focus via `@radix-ui/react-dialog`.
2. **Drawer Sheets:**
   - 360° Athlete Dossiers and Deep Club Inspectors should render in full-height slide-over drawers or dedicated sub-pages (`/users/:id`, `/clubs/:id`) with tabbed sub-resource views.

---

## 5. Theme & Color Hygiene

- **Dark Mode by Default:** The default presentation mode is sleek dark mode (`#202020` canvas with `#282828` card surfaces).
- **Zero Raw Hex Colors:** Never use raw hex codes (`#EB712B`, `#282828`) inside JSX or utility classes. Consume generated `@theme` tokens (`bg-accent`, `bg-surface`, `bg-main-bg`, `text-text-main`, `text-text-muted`, `border-border`).
