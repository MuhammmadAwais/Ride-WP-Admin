# Ride With Pals — Admin Control Center (Ride-WP-Admin)

> **Repository:** `Ride-WP-Admin` (`C:\Users\Prime\OneDrive\Documents\Office\Office Projects\Ride-WP-Admin`)  
> **Companion Client App:** `Ride-WP` (`C:\Users\Prime\OneDrive\Documents\Office\Office Projects\Ride-WP`)  
> **Tech Stack:** React 19, Vite 8, React Router v7, TypeScript strict, Tailwind CSS v4, Redux Toolkit + RTK Query, Socket.io Client.

---

## Ride-WP Read Strategy (Token-Efficient & Domain-Specific)

Do not read all context files on every task. Read strictly what your current task touches:

1. **Always Check First:**
   - [`context/progress-tracker.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/progress-tracker.md) — Current milestone, active sprint feature, completed items.
   - [`context/architecture.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/architecture.md) — Application structure, routing, Redux/RTK Query slices, Axios interceptors, Socket.io contracts.

2. **When Building or Styling UI:**
   - [`DESIGN.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/DESIGN.md) & [`context/ui-tokens.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/ui-tokens.md) — Exact Tailwind v4 `@theme` design tokens (Accent `#EB712B`, Dark Canvas `#202020`/`#282828`, Light Canvas `#F6F6F6`/`#FFFFFF`, borders, radii).
   - [`context/ui-rules.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/ui-rules.md) — Layout standards, 80px sidebar header, data table patterns, metric cards, modal dialogs, status badges.
   - [`context/ui-registry.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/ui-registry.md) — Baseline and existing component patterns to match before creating new ones.
   - [`context/designs/`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/designs) — Visual references, mockups, or inspiration screenshots provided by the user for page refactoring.

3. **When Writing Logic, Forms, State, APIs, or WebSockets:**
   - [`context/library-docs.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/library-docs.md) — React 19, React Router v7, RTK Query, Socket.io event contracts (`support:*` and `chat:*`), Recharts, Radix UI, GSAP.
   - [`context/code-standards.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/code-standards.md) — TypeScript strictness, component isolation, Zod validation schemas, socket lifecycle hygiene.

4. **When Starting a New Feature or Verifying Scope:**
   - [`context/build-plan.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/build-plan.md) — Phased, visual-first roadmap for all admin screens and domains.
   - [`context/project-overview.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/project-overview.md) — Platform mission, athlete/club ecosystem, user personas, in-scope vs out-of-scope boundaries.

---

## Rules That Never Change

- **Zero Hardcoded Hex / Raw Colors:** Never use raw hex values (`#EB712B`, `#202020`) or arbitrary utility colors (`bg-amber-500`, `bg-blue-600`) in markup. Use `@theme` tokens exclusively (`bg-accent`, `bg-surface`, `bg-main-bg`, `text-text-main`, `text-text-muted`, `border-border`, `text-error`).
- **High-Energy Biker/Club Aesthetic:** Follow [`DESIGN.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/DESIGN.md) — maintain sleek, charcoal dark-mode defaults (`#202020` / `#282828`) with signature energetic biker orange (`#EB712B`), crisp light mode support, clean card elevation, and subtle glassmorphism.
- **Strict Dual Typographic Roles:** 
  - `Poppins` (`font-poppins`) is strictly for headers, display titles, KPI values, and brand elements.
  - `Roboto` (`font-roboto`) is strictly for body copy, data tables, form inputs, tooltips, and microcopy.
- **Universal API Envelope Unwrapping:** All backend endpoints return the universal envelope `{ statusCode, message, response }`. Client services and RTK Query endpoints must unwrap `.response` and report notifications through `sonner`.
- **Socket.io Lifecycle Hygiene:** When interacting with real-time support or chat threads, always emit join on mount (`support:thread:join`), leave on unmount (`support:thread:leave`), register incoming listeners (`support:message:new`, `support:thread:read`), and properly tear down socket listeners in `useEffect` cleanup.
- **Destructive Action Safeguards:** Irreversible actions (user suspensions, club disbanding, subscription tier archival, marketplace listing takedowns) must always require user verification via `ConfirmModal`.
- **Living Registry & Imprint:** Run `/imprint` or update [`context/ui-registry.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/ui-registry.md) after completing any UI component to ensure spacing, borders, and radius never drift.
- **Break Doom-Loops:** If the same issue persists after one corrective prompt — stop immediately and run `/recover`.

---

## Available Skills

### Workflow Skills
- `/architect` — before any complex feature or section. Plan and align decisions like a senior engineer before writing code.
- `/imprint` — after any new UI component. Capture visual patterns into `ui-registry.md`.
- `/review` — before demoing or when an implementation needs architectural verification.
- `/recover` — when code breaks after one failed correction. Diagnose failure mode fast.
- `/remember save` — when a session ends to compress memory for next time.
- `/remember restore` — when starting a new session to pick up right where you left off.

### Tailwind CSS Skills
- `tailwind-components` — extract and standardize reusable component classes.
- `tailwind-configuration` — manage theme configurations and `@theme` blocks.
- `tailwind-css-patterns` — modern CSS best practices, layouts, and compositions.
- `tailwind-design-system` — build scalable tokens, variants, and design systems.
- `tailwind-performance` — optimize CSS build output and eliminate bloat.
- `tailwind-responsive-design` — mobile-first breakpoints and container queries.
- `tailwind-utility-classes` — utility class composition for layout, typography, and visual effects.

---

## Agile Page Refactoring & Design Reference Ingestion

When the user provides instructions or design references to refactor any page:
1. Check [`context/designs/`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/designs) for reference mockups, wireframes, or screenshots.
2. Read the page's current implementation and its corresponding API contract in [`context/architecture.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/context/architecture.md) and [`BACKEND_ADMIN_API_GUIDE.md`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP-Admin/BACKEND_ADMIN_API_GUIDE.md).
3. Follow the Agile Methodology: **Plan & Clarify → Mock UI Layout → Wire APIs & State → Micro-animations & Polish → Verify & Imprint**.