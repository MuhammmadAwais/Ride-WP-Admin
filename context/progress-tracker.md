# Progress Tracker: Ride With Pals Admin Control Center

> **Living Tracker:** Updated after every completed sprint or feature. Any AI agent reading this will immediately know what is completed, what is in progress, and what is next.

---

- **Completed in Sprint:** 
  - `Ride-WP` companion app styling alignment: dark mode palette (`#121212` canvas, `#181818` card surface, `rgba(255, 255, 255, 0.08)` borders, `#A1A1AA` secondary text).
  - Signature `Ride-WP` ember icon containers across all telemetry strips and cards.
  - Universal `DataTable.tsx` overhaul matching `Ride-WP` 1:1 (squircle empty states, linear shimmer skeleton rows, illuminated sort states, search highlight marks, compact row typography).
  - SaaS Plan Cards in Payments (`SubscriptionPlansTable.tsx`): purged generic grey box and "0" quotas, implemented clean checkmark entitlements, sleek header pills, and Stripe ID copy helper.
  - Executive Command Dashboard restructure (4-tier layout with 75% Map / 25% Helpdesk).
- **Next Up:** Refactor Club Directory table & cards (`ClubsPage.tsx`) (`GET /admin/clubs`)



---

## Roadmap & Phase Progress

### Phase 0: Design System & Core Transport Foundation
- [x] Tailwind CSS v4 `@theme` design tokens established in `src/index.css`
- [x] Standardized Axios transport layer with JWT interceptor & universal envelope unwrapping (`src/api/baseQuery.ts`)
- [x] Global and Route Error Boundaries (`GlobalErrorBoundary.tsx`, `RouteErrorBoundary.tsx`)
- [x] Core reusable components seeded in `src/Components/ui/` (`DataTable`, `StatusBadge`, `ActionMenu`, `ConfirmModal`, `SafeImage`)

### Phase 1: Authentication & Session Gatekeeper
- [x] Login UI with animated bubbles (`LoginPage.tsx`, `LoginForm.tsx`, `BackgroundBubbles.tsx`)
- [x] Admin authentication service (`POST /admin/login`)
- [x] Protected route redirection & session persistence via `redux-persist` (`ProtectedRoute.tsx`)
- [x] Auto-logout on `401 Unauthorized`

### Phase 2: User Governance & 360° Athlete Dossier
- [x] Refactor Users Directory table (`UsersPage.tsx`) with debounced search & resilient avatars (`GET /admin/users`)
- [x] Refactor 360° Athlete Dossier (`UserDetailPage.tsx`) with banner-free executive profile card & sub-resource inspection modals (`GET /admin/users/:id`)
- [x] Created `RideDetailModal.tsx` for deep inspection of route, distance, pace, and GPX download
- [x] Created `ListingDetailModal.tsx` for deep inspection of marketplace gear specs and status
- [x] Created `UserClubCard.tsx` with dynamic club cover banner, logo avatar, sport badges, and location
- [x] Created `ClubDetailModal.tsx` for deep inspection of joined clubs without losing athlete context
- [x] Implemented resilient `UserAvatar.tsx` with uppercase initials fallback on brand gradient and `/uploads/` URL resolution
- [x] Athlete suspension toggle with optimistic UI (`PUT /admin/users/:id/suspend`)
- [x] Athlete permanent deletion with `ConfirmModal` (`DELETE /admin/users/:id`)
- [x] Tailwind v4 `@theme` tokens audit & imprint: registered in `ui-registry.md` with zero raw/untokenized colors

### Phase 3: Club Governance & Multi-Tab Inspector
- [ ] Refactor Club Directory table & cards (`ClubsPage.tsx`) (`GET /admin/clubs`)
- [x] Refactor Deep Club Inspector (`ClubDetailsPage.tsx`) with 7 sub-resource tabs: members, rides, news, shop, marketplace, discounts, leaderboard (`GET /admin/clubs/:id?tab=...`)
- [x] Club members athlete normalization with initials fallback and dossier linking
- [x] Athletic leaderboard with dual modes (App Rides vs. Strava Sync), month/period filters, and adaptive podium
- [x] Sub-resource inspection modals wired (`RideDetailModal`, `ListingDetailModal`)
- [x] Standardized currency to EUR (`€`) across revenue, merch shop, and member marketplace
- [x] Club suspension toggle (`PUT /admin/clubs/:id/suspend`)
- [x] Club disbanding with cascade warnings (`DELETE /admin/clubs/:id`)

### Phase 4: Monetization & Subscription Tier Management
- [x] Streamlined 100% dynamic SaaS Monetization control center (`PaymentsPage.tsx`)
- [x] SaaS Subscription Plans table with quota badges (`SubscriptionPlansTable.tsx`) (`GET /admin/subscription/plans`)
- [x] Create/Edit Plan modal with Zod entitlements validation (`CreateEditPlanModal.tsx`) (`POST`, `PUT /admin/subscription/plan`)
- [x] Safe plan archival (`DELETE /admin/subscription/plan`)

### Phase 5: Push Broadcasts & Dual-Language CMS
- [x] FCM Push Notification Composer with targeted user picker (`NotificationPage.tsx`) (`POST /admin/notifications/send`)
- [x] Broadcast history & audit logs (`GET /admin/notifications/history`)
- [x] Dual-language Markdown CMS editor (`PrivacyPolicyPage.tsx`, `TermsConditionsPage.tsx`, `AboutPage.tsx`) (`GET`, `PUT /admin/content/:key`)

### Phase 6: Real-time Customer Support Helpdesk (Socket.io)
- [ ] Support Ticket Queue sidebar with live unread count badges (`support:threads:list`)
- [ ] Ticket room join and claim assignment (`support:thread:join`)
- [ ] Live chat message history and sender (`support:messages:list`, `support:message:send`, `support:message:new`)
- [ ] Ticket resolution & refund triggers

### Phase 7: Activities, Group Rides & GPX Routes
- [ ] Group rides directory with distance, pace, and discipline filters (`GET /admin/rides`)
- [ ] GPX route viewer with elevation profile & participant roster (`GET /admin/rides/:id`)
- [ ] Emergency ride cancellation with athlete notification (`DELETE /admin/rides/:id`)

### Phase 8: Financial Operations & Stripe Connect Ledger
- [ ] Global transaction ledger across memberships, gear, and SaaS subscriptions (`GET /admin/financials/ledger`)
- [ ] Stripe Connect merchant accounts table & KYC verification status (`GET /admin/financials/stripe-accounts`)
- [ ] Manual club payout approval workflow (`PUT /admin/financials/payouts/:id/approve`)

### Phase 9: Commerce & Marketplace Operations
- [ ] P2P marketplace classifieds moderation & takedowns (`GET /admin/marketplace/listings`, `PUT .../moderate`)
- [ ] Club merchandise shop delivery bottleneck monitor (`GET /admin/shop/orders/bottlenecks`)

---

## Architectural Decisions Log

1. **Tailwind CSS v4 Tokens:** Configured `@theme` in `src/index.css` with dark mode default (`#202020` canvas, `#282828` cards) and signature biker orange (`#EB712B`).
2. **Dual-Font Typography Hierarchy:** `Poppins` for display, headers, and hero metrics; `Roboto` for data tables, form inputs, and body copy.
3. **Transport Layer:** Standardized Axios baseQuery unwraps universal `{ statusCode, message, response }` envelope and reports errors via `sonner`.
4. **Agile Design Pipeline:** `context/designs/` is dedicated to receiving visual references and screenshots for targeted page refactoring.
