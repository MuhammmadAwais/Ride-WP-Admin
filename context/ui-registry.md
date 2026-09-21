# UI Registry: Ride With Pals Admin Control Center

> **Living Registry:** Updated after every component is manufactured or refactored. Check this registry before building new UI components — reuse and match established patterns before creating new ones.

---

## Component Catalog

### UserAvatar

File: `src/Components/common/UserAvatar.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (image container), `bg-gradient-to-br from-accent/20 via-accent/10 to-surface` (initials fallback), `bg-accent/5` (icon fallback) |
| Border           | `border border-border` |
| Border radius    | `rounded-full` (circle), `rounded-2xl` / `rounded-3xl` (squircle) |
| Text — primary   | `font-poppins font-black text-accent` |
| Text — secondary | `text-accent/50` |
| Spacing          | `select-none inline-flex relative` |
| Hover state      | `hover:opacity-95` (when clickable) |
| Shadow           | `shadow-sm` |
| Accent usage     | Signature initials gradient; status dot uses `bg-success` (active) or `bg-error` (suspended) |

**Pattern notes:**  
Universal athlete avatar resolving `/uploads/` relative paths. Never leaves empty placeholders: generates 1-2 uppercase initials on a high-energy brand gradient when images fail or are null. Supports `xs` (28px) through `2xl` (112px–144px).

---

### DetailTabs

File: `src/features/users/components/DetailTabs.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface backdrop-blur-md` (outer track), `bg-accent` (floating active pill) |
| Border           | `border border-border` |
| Border radius    | `rounded-2xl` (track), `rounded-xl` (tab pills) |
| Text — primary   | `text-white font-poppins font-bold` (active tab) |
| Text — secondary | `text-text-muted font-poppins font-bold` (inactive tab) |
| Spacing          | `p-1.5 gap-2` (track), `px-5 py-2.5` (tab pill) |
| Hover state      | `hover:text-text-main hover:bg-hover` (inactive tabs) |
| Shadow           | `shadow-xs` (track), `shadow-[0_4px_16px_-2px_rgba(235,113,43,0.35)]` (active pill) |
| Accent usage     | `bg-accent` for active floating pill; `bg-accent/10 text-accent border-accent/20` for unselected count badges |

**Pattern notes:**  
Interactive sub-resource navigation with GSAP spring physics moving the orange active pill smoothly between tabs. Displays live count badges for each sub-resource.

---

### RideDetailModal

File: `src/features/users/components/RideDetailModal.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (dialog card), `bg-main-bg/50` (metric tiles), `bg-black/60 backdrop-blur-sm` (overlay) |
| Border           | `border border-border` |
| Border radius    | `rounded-3xl` (dialog card), `rounded-2xl` (metrics & info tiles), `rounded-xl` (buttons) |
| Text — primary   | `font-poppins font-black text-text-main text-xl sm:text-2xl` |
| Text — secondary | `font-roboto text-text-muted text-xs` |
| Spacing          | `p-6 sm:p-8 max-w-2xl w-[92vw] gap-3` |
| Hover state      | `hover:bg-hover hover:text-text-main` (close button, footer) |
| Shadow           | `shadow-2xl` |
| Accent usage     | `bg-accent/10 text-accent border-accent/20` (bike icon badge), `bg-accent text-white` (GPX download button) |

**Pattern notes:**  
Radix Dialog modal for inspecting athlete group rides. Displays telemetry metrics (distance, pace, riders, status), route meeting point, and one-click GPX route file download.

---

### ListingDetailModal

File: `src/features/users/components/ListingDetailModal.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (dialog card), `bg-main-bg` (product showcase), `bg-main-bg/50` (attribute tiles) |
| Border           | `border border-border` |
| Border radius    | `rounded-3xl` (dialog card), `rounded-2xl` (media viewport), `rounded-xl` (price chip) |
| Text — primary   | `font-poppins font-black text-text-main text-xl sm:text-2xl` |
| Text — secondary | `font-roboto text-text-muted text-xs` |
| Spacing          | `p-6 sm:p-8 max-w-xl w-[92vw] gap-3` |
| Hover state      | `hover:bg-hover hover:text-text-main` (close & dismiss buttons) |
| Shadow           | `shadow-2xl` |
| Accent usage     | `text-accent` for price overlay badge (`€`), `bg-accent/10 text-accent border-accent/20` (package badge) |

**Pattern notes:**  
Radix Dialog modal for marketplace gear listings. Displays high-resolution gear photos, EUR `€` pricing pill with glassmorphism backdrop, condition rating, and stock availability pills.

---

### UserActionsMenu

File: `src/features/users/components/UserActionsMenu.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface backdrop-blur-xl` (dropdown menu & confirmation modal) |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` (dropdown), `rounded-3xl` (modal card) |
| Text — primary   | `font-poppins text-text-main text-sm` |
| Text — secondary | `font-roboto text-text-muted text-xs` |
| Spacing          | `w-48 py-1` (dropdown), `p-[36px_32px] max-w-[420px]` (modal) |
| Hover state      | `hover:bg-hover hover:text-accent`, `hover:bg-error/10 text-error`, `hover:bg-success/10 text-success` |
| Shadow           | `shadow-2xl` (dropdown), `shadow-[0_24px_60px_rgba(0,0,0,0.2)]` (modal) |
| Accent usage     | `text-accent` for view detail icon, `bg-accent` for suspend confirm button |

**Pattern notes:**  
Portal-rendered actions menu for user moderation. Features GSAP-animated modal safeguards before committing destructive operations (suspension, deletion). Strictly uses `@theme` semantic tokens (`bg-error`, `bg-success`, `bg-warning`).

---

### DataTable

File: `src/Components/ui/DataTable.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (wrapper), `bg-table-header` (thead), `hover:bg-hover` (tbody row) |
| Border           | `border border-border` |
| Border radius    | `rounded-xl overflow-hidden` |
| Text — primary   | `font-roboto text-sm text-text-main` |
| Text — secondary | `font-roboto text-xs uppercase font-semibold text-text-muted` |
| Spacing          | `p-4` (pagination), `px-4 py-3.5` (cells) |
| Hover state      | `hover:bg-hover transition-colors` |
| Shadow           | `shadow-sm` |
| Accent usage     | `text-accent` for active sort indicators, pagination active page pill |

**Pattern notes:**  
Universal data grid component across all admin tables. Handles server-side pagination, client/server column sorting, and empty state fallbacks.

---

### SafeImage

File: `src/Components/common/SafeImage.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | Inherited from parent (`rounded-xl` or `rounded-2xl`) |
| Text — primary   | `text-text-main` |
| Text — secondary | `text-text-muted` |
| Spacing          | Context-dependent |
| Hover state      | None |
| Shadow           | None |
| Accent usage     | `text-accent` fallback monogram/icon |

**Pattern notes:**  
Fail-safe image wrapper catching broken URLs and missing media assets with an embedded fallback element.

---

### UserClubCard

File: `src/features/users/components/UserClubCard.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-main-bg/50` (card container), `bg-surface` (mini cover banner), `bg-black/60 backdrop-blur-md` (sport/privacy pills) |
| Border           | `border border-border hover:border-accent/40` |
| Border radius    | `rounded-3xl` (card), `rounded-2xl` (avatar & pills), `rounded-lg` (sport badges) |
| Text — primary   | `font-poppins font-black text-text-main group-hover:text-accent` |
| Text — secondary | `font-roboto text-text-muted text-xs` |
| Spacing          | `p-5 pt-0` (card body), `px-5 py-3.5` (card footer) |
| Hover state      | `hover:border-accent/40 hover:shadow-md transition-all` |
| Shadow           | `shadow-xs hover:shadow-md` |
| Accent usage     | `text-accent` for map pin, users icon, and inspect link; `bg-accent/10 text-accent border-accent/25` for regular member role badge |

**Pattern notes:**  
Rich club affiliation card progressively enhanced with live club details (cover banner, logo avatar with uppercase initials fallback, sport type, and privacy badge).

---

### ClubDetailModal

File: `src/features/users/components/ClubDetailModal.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (dialog container), `bg-main-bg` (hero banner container), `bg-main-bg/50` (metrics bar), `bg-black/60 backdrop-blur-sm` (overlay) |
| Border           | `border border-border` |
| Border radius    | `rounded-3xl` (dialog card), `rounded-2xl` (telemetry tiles, owner card), `rounded-xl` (action buttons) |
| Text — primary   | `font-poppins font-black text-2xl text-text-main` |
| Text — secondary | `font-roboto text-text-muted text-xs` |
| Spacing          | `p-6 sm:p-8 pt-10 gap-3` |
| Hover state      | `hover:bg-hover hover:text-text-main` (close, cancel) |
| Shadow           | `shadow-2xl` |
| Accent usage     | `bg-accent text-white` for "Open Full Club Governance View" primary CTA; `text-accent` for location pin and active members indicator |

**Pattern notes:**  
Radix Dialog modal providing immediate deep inspection of joined clubs without losing context on the athlete profile. Displays live statistics, founder/owner contact, club mission, and quick gateway to `/clubs/:id`.

