# Project Overview: Ride With Pals Admin Control Center

## About the Project

**Ride With Pals — Admin Control Center (`Ride-WP-Admin`)** is the centralized mission control and operational governance dashboard for the **Ride With Pals** platform. 

Ride With Pals is a premier ride-sharing, club-building, and route-discovery platform catering to motorcycle riders, cyclists, and endurance clubs. While the mobile and web client application ([`Ride-WP`](file:///c:/Users/Prime/OneDrive/Documents/Office/Office%20Projects/Ride-WP)) empowers athletes to organize group rides, sync GPX routes with Strava, purchase club merchandise, and trade pre-owned gear in the marketplace, this **Admin Panel** provides platform operators, support agents, and community moderators with the tools required to govern, monetize, and support the entire ecosystem.

---

## The Problem It Solves

Managing a high-velocity physical community with live group activities, financial transactions, and user-generated gear listings presents unique challenges:
1. **Safety & Moderation:** Real-time visibility into scheduled rides, emergency ride cancellations, athlete suspensions, and marketplace gear takedowns.
2. **Financial Operations:** Tracking Stripe Connect club payouts, platform commission cuts, SaaS subscription tiers (User Pro & Club Gold), and handling dispute refunds.
3. **Club Governance:** Managing club verification badges, ownership transfers, member rosters, and dues compliance.
4. **Real-time Customer Support:** Resolving incoming inquiries and billing disputes instantly via an integrated Socket.io support ticketing desk.
5. **Engagement & Legal Compliance:** Dispatching segmented push notifications (FCM) and maintaining dual-language legal policies (English & Spanish).

---

## Pages & Routing Structure

```
/login                 → Admin authentication gatekeeper
/dashboard             → Mission Control: Top KPIs, Revenue Breakdown, Global Ride Map
/users                 → Athlete Directory (Search, filters, role badges, suspension)
/users/:id             → 360° Athlete Dossier (Hero stats, Activities, Clubs, Orders, Moderation)
/clubs                 → Club Directory (Verification badges, Stripe status, Tier)
/clubs/:id             → Deep Club Inspector (Members, Rides, News, Leaderboard, Shop, Marketplace)
/payments              → Monetization Hub (Ledger, Stripe Accounts, Subscription Plans Table & Modal)
/support               → Live Support Helpdesk (Real-time Socket.io threads, ticket triage, chat)
/analytics             → Deep Platform Analytics & Financial Metrics
/notifications         → Segmented Push Broadcast Engine (FCM composer, user picker, audit history)
/privacy-policy        → Dual-Language Legal CMS (EN/ES Markdown editor)
/terms                 → Dual-Language Terms & Conditions CMS (EN/ES Markdown editor)
/about                 → About Us / Platform Identity CMS (EN/ES Markdown editor)
```

---

## Core User Roles & Personas

1. **Super Admin:** Full platform visibility, financial ledger control, SaaS subscription plan creation/archival, system fee settings, and immutable audit logs.
2. **Platform Moderator:** User suspensions, club disbanding/ownership transfers, marketplace item moderation, and emergency ride cancellations.
3. **Customer Support Agent:** Live chat triage, thread claim/assignment, reading inquiry history, responding to athletes, and processing order/subscription refunds.

---

## Feature Scope Boundaries

### In Scope
- **Executive Telemetry:** Top KPI metrics (`totalAthletes`, `totalClubs`, `activeRidesThisWeek`, `platformGmvEur`, `mrrEur`, `stravaSyncRate`), monthly revenue charts, and ride cluster map.
- **User & Athlete Governance:** Paginated athlete directory with debounced search and 360° tabbed dossier (activities, clubs, marketplace listings, orders, moderation actions).
- **Club Governance:** Tabbed inspector consuming sub-resource queries (`rides`, `members`, `news`, `leaderboard`, `shop`, `discounts`, `marketplace`) with suspension and disbanding controls.
- **Monetization & Subscriptions:** Full CRUD for SaaS subscription tiers (`POST`, `GET`, `PUT`, `DELETE /admin/subscription/plan`) with feature flags (`numberOfRides`, `marketplaceItems`, `stravaConnection`, `clubStripeIntegration`, etc.).
- **Live Customer Support Desk:** Real-time Socket.io client integrating ticket rooms (`support:threads:list`, `support:thread:join`, `support:message:send`, `support:thread:read`, `support:message:new`).
- **Push Broadcasts:** Segmented FCM broadcast engine with targeted user picker and notification logs.
- **Dual-Language CMS:** Markdown editors with dual-tab support for English (`title`, `content`) and Spanish (`titleEs`, `contentEs`).

### Out of Scope
- Direct rider GPS live tracking telemetry inside the admin browser (administered via aggregate cluster maps and route overviews).
- End-user ride creation or Strava account linking inside admin (handled exclusively in the `Ride-WP` mobile app).
- Direct credit card processing within admin (all transactions flow through Stripe / Stripe Connect).
