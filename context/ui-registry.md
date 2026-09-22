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

---

### ClubDetailTabs

File: `src/features/clubs/components/ClubDetailTabs.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (tab container track), `bg-accent` (GSAP animated indicator) |
| Border           | `border border-border` |
| Border radius    | `rounded-[18px]` (track), `rounded-2xl` (active highlight indicator & buttons) |
| Text — primary   | `text-white font-poppins font-semibold` (active button) |
| Text — secondary | `text-text-muted hover:text-text-main font-poppins font-semibold` |
| Spacing          | `p-1 gap-1` (track), `px-5 py-2.5` (tab button) |
| Hover state      | `hover:text-text-main hover:bg-accent/5` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent` for animated GSAP indicator pill; `hover:bg-accent/5` for unselected tab hover |

**Pattern notes:**  
Multi-tab switcher with GSAP physics animating the width and X coordinate of the brand accent indicator.

---

### ClubMembersTab

File: `src/features/clubs/components/tabs/ClubMembersTab.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (empty state, search input, actions), `bg-main-bg` (table canvas) |
| Border           | `border border-border` |
| Border radius    | `rounded-3xl` (empty state), `rounded-xl` (inputs & dossier link), `rounded-full` (role badges) |
| Text — primary   | `font-poppins font-bold text-text-main text-sm` |
| Text — secondary | `font-roboto text-text-muted text-xs` |
| Spacing          | `gap-6 pb-12 mt-6` (container), `gap-3.5` (athlete cell) |
| Hover state      | `hover:border-accent/40 text-text-main hover:text-accent` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent/15 text-accent border-accent/30` for Owner badge; `bg-accent/10 text-accent` count chip; `text-accent` external link hover |

**Pattern notes:**  
Comprehensive athlete membership table with dynamic multi-key normalization (`user.fullName`, `fullName`, `userName`, `user.email`), `UserAvatar` monogram fallback, hierarchical role badges (Owner, Admin, Organizer, Athlete, Member), client-side search, and direct links to `/users/:userId` dossiers.

---

### ClubLeaderboardTab

File: `src/features/clubs/components/tabs/ClubLeaderboardTab.tsx`  
Last updated: 2026-09-21  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (table, card body), `bg-gradient-to-b from-amber-400/10 via-surface to-surface` (1st place podium), `bg-gradient-to-b from-slate-300/10 via-surface to-surface` (2nd place podium), `bg-gradient-to-b from-amber-600/10 via-surface to-surface` (3rd place podium) |
| Border           | `border border-border`, `border-amber-400/40` (1st), `border-slate-300/40` (2nd), `border-amber-600/40` (3rd) |
| Border radius    | `rounded-3xl` (podium cards, empty state), `rounded-2xl` (metric tiles), `rounded-full` (rank pills, badges) |
| Text — primary   | `font-poppins font-black text-accent text-base` (distance), `font-poppins font-bold text-text-main` (athlete name) |
| Text — secondary | `font-roboto text-text-muted text-xs` |
| Spacing          | `gap-8 pb-12 mt-6` (container), `p-6` (podium card) |
| Hover state      | `hover:scale-[1.02] transition-all` (podium cards), `hover:text-accent` (profile link) |
| Shadow           | `shadow-lg` (podium cards), `shadow-sm` (table) |
| Accent usage     | `text-accent` for distance `km` metric and bike icon; `bg-accent/10 text-accent` for season standings pill; `bg-success/10 text-success` for attendance percentage |

**Pattern notes:**  
Authentic athletic cycling/running leaderboard replacing legacy taxi/car copy. Features top-3 podium highlight cards (Gold, Silver, Bronze), distance in kilometers (`km`), rides attended, and athlete dossier linking.

---

### SubscriptionPlansTable

File: `src/features/subscriptions/components/SubscriptionPlansTable.tsx`  
Last updated: 2026-09-22  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (outer cards, filter container), `bg-main-bg` (search inputs, segmented tracks, Stripe telemetry strip), `bg-accent/10` (interval badge, header icon) |
| Border           | `border border-border` (standard), `border-amber-500/30 hover:border-amber-500/60` (Gold Tier card), `border-accent/30 hover:border-accent/60` (Pro Tier card) |
| Border radius    | `rounded-3xl` (plan cards, metric KPI cards, filter bar), `rounded-2xl` (search inputs, segmented controllers, Stripe widget), `rounded-full` (scope & interval pills) |
| Text — primary   | `font-poppins font-black text-3xl sm:text-4xl text-text-main` (pricing & metrics), `font-poppins font-bold text-xl text-text-main` (plan name) |
| Text — secondary | `font-roboto text-xs sm:text-sm text-text-muted`, `font-poppins font-bold text-[11px] uppercase tracking-wider` |
| Spacing          | `space-y-8` (main stack), `p-6 sm:p-7` (plan cards), `gap-4` (metric grid), `p-4` (search bar) |
| Hover state      | `hover:-translate-y-1 hover:shadow-xl group-hover:text-accent duration-300 transition-all` |
| Shadow           | `shadow-sm` (default), `shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)]` (primary Create CTA), `shadow-inner` (search & filter tracks) |
| Accent usage     | Signature `#EB712B` for primary CTA, interval badge (`bg-accent/10 text-accent`), quota icons, price accents, and active scope pills |

**Pattern notes:**  
SaaS Subscription Monetization control deck. Combines live executive KPIs, multi-dimensional search/scope/interval/sort filtering, and elevated tier cards with Stripe product telemetry (click-to-copy), capability micro-pills (Strava, GPX, Stripe, Paid Events), and quota limits. Fully dynamic with zero mock data.

---

### AnalyticsPage

File: `src/features/analytics/pages/AnalyticsPage.tsx`  
Last updated: 2026-09-22  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (metric cards, charts container), `bg-main-bg` (tooltips), `bg-accent/10` (header icon, metric icon badges) |
| Border           | `border border-border` |
| Border radius    | `rounded-3xl` (outer charts, metric cards), `rounded-2xl` (tooltips, icon containers), `rounded-full` (pills, legends) |
| Text — primary   | `font-poppins font-black text-3xl sm:text-4xl text-text-main` (metrics, donut total), `font-poppins font-bold text-xl` (chart titles) |
| Text — secondary | `font-roboto text-xs sm:text-sm text-text-muted`, `font-poppins font-semibold text-xs uppercase tracking-wider` |
| Spacing          | `space-y-8 pb-12` (page stack), `gap-6` (charts grid, metric grid), `p-6 sm:p-7` (chart cards) |
| Hover state      | `hover:border-accent/30 hover:scale-105 transition-all` |
| Shadow           | `shadow-sm` (cards), `shadow-xl` (Recharts tooltips) |
| Accent usage     | Signature `#EB712B` for athlete metrics, onboarding AreaChart trajectory, roster density bars, and refresh indicator |

**Pattern notes:**  
100% Dynamic athletic community analytics dashboard. Replaces legacy taxi mock data with real-time community growth velocity, sport discipline distributions (Cycling, Running, Triathlon, Gravel, MTB), club roster density rankings, and SaaS subscription tier comparisons in EUR (`€`).

---

### ClubMapDetailCard

File: `src/features/dashboard/components/ClubMapDetailCard.tsx`  
Last updated: 2026-09-22  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface/95 backdrop-blur-2xl` (popup card), `bg-main-bg` (banner & avatar wrapper), `bg-main-bg/50` (location tile), `bg-main-bg/70` (metrics grid) |
| Border           | `border border-border/80` (card), `border border-border/60` (tiles & grid), `border-4 border-surface` (avatar squircle) |
| Border radius    | `rounded-3xl` (card), `rounded-2xl` (avatar, metrics strip), `rounded-xl` (location, CTA button), `rounded-full` (badges & close) |
| Text — primary   | `font-poppins font-bold text-base sm:text-lg text-text-main` (club name), `font-poppins font-bold text-sm text-text-main` (metric values) |
| Text — secondary | `font-roboto text-xs text-text-muted` (attribution, location, badges) |
| Spacing          | `sm:w-[380px] p-5 pt-0` (card body), `p-2.5` (location & metrics), `gap-2` (grid) |
| Hover state      | `hover:bg-accent/90 hover:scale-[1.02] transition-all` (CTA), `hover:scale-105 transition-transform duration-700` (banner) |
| Shadow           | `shadow-[0_24px_60px_rgba(0,0,0,0.35)]` (card elevation), `shadow-xl` (avatar), `shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)]` (CTA) |
| Accent usage     | Signature `#EB712B` for Inspect Club 360° CTA button, location pin, organizer icon, discipline highlight, and fallback bike icon |

**Pattern notes:**  
Google Maps interactive pin popup card. Automatically fetches full club details via `useGetClubByIdQuery` to resolve high-resolution cover banners through `SafeImage` and backend URL normalization (`getImageUrl`). Progressively enhances member counts, established year, and founder attribution, with fallback radial biker gradients.

---

### DashboardBroadcastBar

File: `src/features/dashboard/components/DashboardBroadcastBar.tsx`  
Last updated: 2026-09-22  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (outer bar), `bg-main-bg/50 hover:bg-main-bg` (history chips), `bg-accent/10` (radio icon, send icon chips) |
| Border           | `border border-border` (outer bar), `border border-border hover:border-accent/40` (chips & log button) |
| Border radius    | `rounded-3xl` (outer bar), `rounded-2xl` (status icon, history chips), `rounded-xl` (buttons), `rounded-full` (FCM badge) |
| Text — primary   | `font-poppins font-bold text-sm sm:text-base text-text-main` (title), `font-poppins font-bold text-xs` (chip titles & CTA) |
| Text — secondary | `font-roboto text-xs text-text-muted` (subtitles & timestamps) |
| Spacing          | `p-4 sm:p-5 gap-4` (container), `p-2.5 px-3 gap-2.5` (history chips) |
| Hover state      | `hover:scale-[1.02] transition-all` (CTA), `hover:border-accent/40 group-hover:text-accent` (chips) |
| Shadow           | `shadow-sm` (outer bar), `shadow-[0_4px_14px_-2px_rgba(235,113,43,0.4)]` (Send Alert CTA) |
| Accent usage     | Signature `#EB712B` for radio pulse badge, Send Alert CTA button, and history broadcast icon |

**Pattern notes:**  
Compact operational command strip for Push Notifications on the Dashboard. Replaces bulky consoles with a streamlined bar displaying active FCM connection state, the last 2-3 live broadcast logs from `useGetNotificationHistoryQuery`, and a direct CTA to compose instant mobile announcements.

---

### LiveInquiriesTerminal

File: `src/features/dashboard/components/LiveInquiriesTerminal.tsx`  
Last updated: 2026-09-22  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (outer card), `bg-main-bg/50 hover:bg-main-bg` (ticket row), `bg-accent/5` (unread row), `bg-accent/10` (icon container) |
| Border           | `border border-border` (outer card), `border border-border/80 hover:border-accent/40` (ticket row), `border-accent/30` (unread) |
| Border radius    | `rounded-3xl` (outer card), `rounded-2xl` (ticket row, header icon), `rounded-full` (avatar, badges, unread dot) |
| Text — primary   | `font-poppins font-bold text-base text-text-main` (title), `font-poppins font-bold text-xs text-text-main` (athlete name) |
| Text — secondary | `font-roboto text-xs text-text-muted` (subtitles, email, preview snippet) |
| Spacing          | `p-6 flex flex-col justify-between h-[440px] space-y-2.5` |
| Hover state      | `hover:border-accent hover:text-accent group-hover:text-accent transition-all` |
| Shadow           | `shadow-sm` |
| Accent usage     | Signature `#EB712B` for unread count badge, pulse status dot, message square badge, and hover accents |

**Pattern notes:**  
Real-time Socket.io support inquiry monitor. Seamlessly tracks incoming athlete help tickets, unread messages with pulsing badges, ticket assignment states (`open`, `assigned`, `closed`), and offers direct 1-click launch into the active thread in `/support`.

---

### DashboardPlansCard

File: `src/features/dashboard/components/DashboardPlansCard.tsx`  
Last updated: 2026-09-22  

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (outer card), `bg-main-bg/50 hover:bg-main-bg` (plan row), `bg-blue-500/10` (icon), `bg-accent/10` (PRO pill) |
| Border           | `border border-border` (outer card), `border border-border/80 hover:border-accent/40` (plan row), `border-accent/25` (PRO pill) |
| Border radius    | `rounded-3xl` (outer card), `rounded-2xl` (plan row, header icon, tier pill), `rounded-xl` (currency badge) |
| Text — primary   | `font-poppins font-bold text-base text-text-main` (title), `font-poppins font-black text-sm sm:text-base` (pricing) |
| Text — secondary | `font-roboto text-xs text-text-muted` (features & cadence), `font-poppins font-bold text-xs text-accent` (manage CTA) |
| Spacing          | `p-6 flex flex-col justify-between h-[440px] space-y-2.5` |
| Hover state      | `group-hover:text-accent hover:border-accent/40 transition-all` |
| Shadow           | `shadow-sm` |
| Accent usage     | Signature `#EB712B` for PRO tier badges, price hover transitions, and "Manage Plans" navigation CTA |

**Pattern notes:**  
Active SaaS subscription monetization deck. Displays live club & athlete subscription tiers from RTK Query with EUR (`€`) pricing, clean human-readable cadence ("Billed yearly", "Billed monthly", "Lifetime access"), verified feature counts, and Stripe Connect platform status.
