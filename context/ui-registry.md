# UI Registry: Ride With Pals Admin Control Center

> **Living Registry:** Updated after every component is manufactured or refactored. Check this registry before building new UI components — reuse and match established patterns before creating new ones.

---

## Component Catalog

### 1. `DataTable<T>`
- **File:** `src/Components/ui/DataTable.tsx`
- **Purpose:** Universal generic table handling sorting, server-side pagination, search debouncing, and skeleton loaders.
- **Classes & Tokens:**
  - Wrapper: `bg-surface border border-border rounded-xl overflow-hidden shadow-sm`
  - Table Header: `bg-table-header text-text-muted text-xs uppercase font-semibold font-roboto tracking-wider border-b border-border`
  - Table Row: `border-b border-border hover:bg-hover transition-colors text-sm font-roboto text-text-main`
  - Pagination Container: `p-4 border-t border-border flex items-center justify-between text-xs text-text-muted font-roboto`

### 2. `StatCard` / `MetricCards`
- **File:** `src/features/analytics/components/MetricCards.tsx`
- **Purpose:** Top-level executive telemetry cards displaying GMV, MRR, Athletes, Clubs, and active rides.
- **Classes & Tokens:**
  - Card: `bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-all duration-200`
  - Title: `text-xs font-semibold uppercase tracking-wider text-text-muted font-roboto flex items-center justify-between`
  - Value: `text-2xl lg:text-3xl font-extrabold font-poppins text-text-main mt-2`
  - Trend Pill: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-pill`
  - Positive Trend: `bg-emerald-500/10 text-emerald-500`
  - Negative Trend: `bg-error/10 text-error`

### 3. `StatusBadge`
- **File:** `src/Components/ui/StatusBadge.tsx`
- **Purpose:** Standardized status pill for athletes, clubs, rides, subscriptions, and transactions.
- **Variants:**
  - `Active` / `Delivered` / `Verified`: `bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`
  - `Pending` / `Trial`: `bg-amber-500/10 text-amber-500 border border-amber-500/20`
  - `Suspended` / `Failed`: `bg-error/10 text-error border border-error/20`
  - `Private` / `Draft`: `bg-slate-500/10 text-slate-400 border border-slate-500/20`
  - Common classes: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-xs font-medium font-roboto`

### 4. `ActionMenu`
- **File:** `src/Components/ui/ActionMenu.tsx`
- **Purpose:** Portal-rendered dropdown menu triggered from table row action dots.
- **Classes & Tokens:**
  - Trigger: `p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-hover transition-colors`
  - Menu Content: `bg-surface-elevated border border-border rounded-xl shadow-xl p-1.5 min-w-[160px] z-50 animate-scale-in`
  - Menu Item: `flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-main hover:bg-hover hover:text-accent cursor-pointer transition-colors`
  - Destructive Item: `text-error hover:bg-error/10 hover:text-error`

### 5. `ConfirmModal`
- **File:** `src/Components/ui/ConfirmModal.tsx`
- **Purpose:** Accessible modal dialog requiring explicit user confirmation before destructive operations.
- **Classes & Tokens:**
  - Overlay: `fixed inset-0 bg-black/60 backdrop-blur-sm z-50`
  - Content: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-2xl p-6 shadow-2xl max-w-md w-full z-50 animate-scale-in`
  - Title: `text-lg font-bold font-poppins text-text-main flex items-center gap-2`
  - Confirm Button: `bg-error text-white hover:brightness-105 font-medium px-4 py-2 rounded-xl text-sm transition-all`
  - Cancel Button: `bg-surface border border-border text-text-main hover:bg-hover px-4 py-2 rounded-xl text-sm transition-all`

### 6. `DetailTabs` / `ClubDetailTabs`
- **File:** `src/features/users/components/DetailTabs.tsx` & `src/features/clubs/components/ClubDetailTabs.tsx`
- **Purpose:** Horizontal tabbed navigation for inspecting sub-collections within user or club profiles.
- **Classes & Tokens:**
  - Tab List: `flex items-center gap-2 border-b border-border mb-6 overflow-x-auto`
  - Active Tab: `text-accent border-b-2 border-accent font-semibold font-poppins py-3 px-4 text-sm whitespace-nowrap`
  - Inactive Tab: `text-text-muted hover:text-text-main font-medium font-poppins py-3 px-4 text-sm transition-colors whitespace-nowrap`

### 7. `SafeImage`
- **File:** `src/Components/common/SafeImage.tsx`
- **Purpose:** Resilient image component handling broken CDN links, missing avatars, and network errors.
- **Fallbacks:** Renders fallback icon or monogram badge with `bg-surface border border-border`.
