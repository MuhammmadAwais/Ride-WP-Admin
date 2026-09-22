# Memory — Dashboard, Analytics & Monetization Refactor

Last updated: 2026-09-22 19:45

## What was built

- **Dashboard Streamlining & Operations Hub (`src/features/dashboard/`):**
  - `src/features/dashboard/pages/DashboardPage.tsx`: Structured layout containing Top Metric Cards, Google Maps Club Surveillance, Push Broadcast Bar, and a balanced 2-column Operations Grid.
  - `src/features/dashboard/components/DashboardBroadcastBar.tsx`: Compact horizontal command strip displaying active FCM connection state, last 2-3 live broadcast logs from `useGetNotificationHistoryQuery({ limit: 3 })`, and a direct CTA to compose instant mobile announcements.
  - `src/features/dashboard/components/LiveInquiriesTerminal.tsx`: Real-time Socket.io athlete helpdesk monitor with unread indicator badges, assignment status (`open`, `assigned`, `closed`), relative timestamps, and 1-click launch into active threads on `/support`.
  - `src/features/dashboard/components/DashboardPlansCard.tsx`: Live subscription tier card displaying plans from `useGetPlansQuery` in EUR (`€`), natural cadence phrasing ("Billed yearly", "Billed monthly", "Lifetime access"), and Stripe Connect indicators.
  - `src/features/dashboard/components/ClubMapDetailCard.tsx`: Fixed missing cover banner bug by connecting `useGetClubByIdQuery`, cascading field resolution (`profile.coverImage`, `cover_image`, `cover`, `bannerImage`, etc.), and `<SafeImage />` URL normalization (`getImageUrl`).
  - Purged fake mock `RecentRidesTable.tsx` and redundant `ClubsSpotlight.tsx`.
- **100% Dynamic Platform Analytics (`src/features/analytics/`):**
  - Purged all legacy taxi mock data (`PKR`, `carpools`, `drivers`, `fuel savings`, `Rawalpindi heatmap`).
  - `MetricCards.tsx`: 4 dynamic KPI cards derived from live queries with GSAP count-up.
  - `TimeSeriesChart.tsx`: AreaChart computing monthly onboarding trajectory from real `createdAt` timestamps.
  - `DistributionChart.tsx`: Donut Chart categorizing clubs by athletic discipline with center total.
  - `PeakDemandHeatmap.tsx`: BarChart ranking clubs by live `participantCount` roster capacity.
  - `FinancialLedgerChart.tsx`: BarChart displaying live subscription tier prices in EUR (`€`) and quota limits.
  - `AnalyticsPage.tsx`: Executive header with multi-slice data refresh button.
- **SaaS Monetization Control Center (`src/features/subscriptions/`, `src/features/payments/`):**
  - `SubscriptionPlansTable.tsx`: Full SaaS tier control deck with 4 dynamic KPI cards, search/filter/sort controls, and Stripe product telemetry.
  - `PaymentsPage.tsx`: Focused container for subscription tier management with zero fake wallet/transaction mock data.
- **Support Chat Message Deduplication (`src/features/support/context/ChatContext.tsx`):**
  - Mutual deduplication in socket ACK callback and `support:message:new` room broadcast handler (stringified ID comparison + 4000ms content/sender/timestamp fingerprint window).
- **Club Leaderboard Dual Modes (`src/features/clubs/components/tabs/ClubLeaderboardTab.tsx`):**
  - Mode 1 (App Rides): attendance rate, rides attended, month filter.
  - Mode 2 (Strava Sync): distance in km, Strava sync pill, timeframe filter.
- **Living UI Registry & Progress Tracker (`context/ui-registry.md`, `context/progress-tracker.md`):**
  - Imprinted `SubscriptionPlansTable`, `AnalyticsPage`, `ClubMapDetailCard`, `DashboardBroadcastBar`, `LiveInquiriesTerminal`, and `DashboardPlansCard`.

## Decisions made

- **Zero Hardcoded / Mock Data Rule Enforced Platform-Wide:** Any card or table lacking a live backend endpoint (such as global rides `MOCK_LIVE_RIDES` or wallet transactions) was permanently purged rather than retained with fabricated numbers.
- **Dynamic Derivation Strategy:** Where dedicated backend overview endpoints do not exist (e.g. Analytics), real platform telemetry is aggregated from active entity queries (`useGetUsersListQuery`, `useGetClubsListQuery`, `useGetPlansQuery`).
- **Strict Natural Copy:** Banished awkward phrases like "PER YEARLY", "PER FREE", and "Inbox Zero Achieved" in favor of natural human phrasing ("Billed yearly", "Lifetime access", "Helpdesk All Clear").
- **Universal Image URL Resolution:** All backend upload paths (logos, avatars, club banners) must be passed through `<SafeImage />` or `getImageUrl(...)` to resolve relative filenames to `https://api.ridewithpals.com/uploads/...` with styled brand fallbacks.

## Problems solved

- **Dashboard Club Map Banner 404 / Black Box:** Caused by raw `<img>` requesting relative filenames from Vite dev server (`http://localhost:5173/`), coupled with an `onError` handler that hid the element. Solved by fetching club detail via `useGetClubByIdQuery`, normalizing via `<SafeImage />`, and adding branded fallback biker gradients.
- **Support Chat Duplicate Message Bubble:** Caused by race condition between `support:message:send` ACK callback and `support:message:new` room broadcast. Resolved via loose stringified ID comparison + 4000ms timestamp/sender fingerprint window in both handlers.

## Current state

- **Dashboard (`/dashboard`):** 100% clean, verified, and dynamic. Contains Top Metric Cards, Google Maps Club Surveillance, Push Broadcast Bar, Live Helpdesk Feed, and SaaS Monetization Tiers. Zero mock tables.
- **Analytics (`/analytics`):** 100% dynamic Recharts charts and KPI metric cards derived from live database entities in EUR (`€`).
- **Payments / Subscriptions (`/payments`):** Active SaaS tier management with dynamic KPIs, search, filters, and Stripe telemetry.
- **Club Governance (`/clubs/:id`):** 7 sub-resource tabs fully functional including dual-mode athletic leaderboard.
- **Build Status:** `npx tsc -b` passes with 0 errors; `npm run build` compiles 2,918 modules cleanly in `dist/`.

## Next session starts with

- **Phase 3 Club Directory Table & Cards (`src/features/clubs/pages/ClubsPage.tsx`):**
  - Refactor the primary club directory table and cards (`GET /admin/clubs`) to match the newly established UI patterns from `ClubDetailsPage.tsx` and `SubscriptionPlansTable.tsx`.
  - Add search, discipline filtering, privacy pills, suspended status toggles, and direct links to `/clubs/:id`.

## Open questions

- Confirm if backend will eventually introduce a global rides endpoint (`GET /admin/rides`) for Phase 7 (Activities & Group Rides), or if ride management remains club-scoped (`GET /admin/clubs/:id?tab=rides`).
