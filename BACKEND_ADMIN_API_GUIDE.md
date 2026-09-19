# 🛠️ Ride With Pals — Backend Developer API Guide (Admin Panel)

> **Document Purpose:** A clean, developer-friendly guide for the backend team detailing the required REST APIs, frontend feature requirements, and reference request/response payloads for the new **Ride With Pals Admin Control Center**.  
> **Target Service:** Express.js REST API  
> **Auth Scheme:** JWT Bearer Token (`Authorization: Bearer <ADMIN_JWT_TOKEN>`)  
> **Response Envelope:** Universal standard envelope (`{ statusCode, message, response }`)

---

## 📌 Note for the Backend Developer

> 👋 **Hi Backend Team!**  
> This guide outlines the endpoints the frontend Admin Panel needs to monitor, moderate, and manage the **Ride With Pals** platform.
> 
> * **Field Names & Structures:** The payloads below are **reference implementations**. If your database schema uses slightly different naming (e.g. `user_id` vs `userId`), that is completely fine! What matters most is providing the core data fields so the admin UI can render them properly.
> * **Standard Envelope:** All endpoints should follow the app's existing envelope structure:
>   ```json
>   {
>     "statusCode": 200,
>     "message": "Success message",
>     "response": { /* your payload here */ }
>   }
>   ```
> * **Pagination:** Standard pagination uses query parameters `offset` (default `0`) and `limit` (default `10` or `20`), returning `{ count: number, rows: array }`.

---

## 📑 API Endpoints Summary Cheat Sheet

| # | Domain / Feature | Method | Endpoint URL | Frontend Screen / Purpose |
|---|---|:---:|---|---|
| **1** | **Analytics** | `GET` | `/admin/analytics/overview` | Executive Dashboard Top KPI Cards |
| **2** | **Analytics** | `GET` | `/admin/analytics/revenue-chart` | Monthly Revenue Breakdown Chart |
| **3** | **Analytics** | `GET` | `/admin/analytics/activity-map` | Live Map of Global Ride Clusters |
| **4** | **Users** | `GET` | `/admin/users` | Athlete Directory with Search & Filters |
| **5** | **Users** | `GET` | `/admin/users/:id/dossier` | 360° Athlete Dossier (Rides, Clubs, Orders) |
| **6** | **Users** | `PUT` | `/admin/users/:id/suspend` | Suspend or Reactivate an Athlete |
| **7** | **Clubs** | `GET` | `/admin/clubs` | Club Directory with Stripe & Tier Filters |
| **8** | **Clubs** | `GET` | `/admin/clubs/:id/inspect` | Deep Club Inspector (Members, Fees, Stripe) |
| **9** | **Clubs** | `PUT` | `/admin/clubs/:id/verify` | Grant/Revoke Verified Club Badge |
| **10** | **Clubs** | `PUT` | `/admin/clubs/:id/transfer-ownership` | Reassign Club to a New Owner |
| **11** | **Group Rides** | `GET` | `/admin/rides` | Activities & Rides Directory |
| **12** | **Group Rides** | `GET` | `/admin/rides/:id` | Ride GPX Route, Leaders & Roster |
| **13** | **Group Rides** | `DELETE` | `/admin/rides/:id` | Emergency Cancel Ride + Notify Riders |
| **14** | **Financials** | `GET` | `/admin/financials/ledger` | Global Financial Ledger (SaaS, Fees, Shop) |
| **15** | **Financials** | `GET` | `/admin/financials/stripe-accounts` | Stripe Connect Club Account Statuses |
| **16** | **Financials** | `PUT` | `/admin/financials/payouts/:id/approve` | Approve Manual Club Withdrawal Request |
| **17** | **Marketplace** | `GET` | `/admin/marketplace/listings` | Peer-to-Peer Gear Listings Moderation |
| **18** | **Marketplace** | `PUT` | `/admin/marketplace/listings/:id/moderate` | Take Down Suspicious/Prohibited Item |
| **19** | **Club Shop** | `GET` | `/admin/shop/orders/bottlenecks` | Track Orders Stuck in Pending Delivery |
| **20** | **Support** | `GET` | `/admin/support/tickets` | Support Helpdesk Ticket Queue |
| **21** | **Support** | `GET` | `/admin/support/tickets/:id/messages` | Ticket Message Thread & Internal Notes |
| **22** | **Support** | `POST` | `/admin/support/tickets/:id/reply` | Reply to User Ticket / Trigger Refund |
| **23** | **Settings** | `GET` | `/admin/settings` | Get Global Platform Config |
| **24** | **Settings** | `PUT` | `/admin/settings` | Update Platform Fee & App Version |
| **25** | **Settings** | `GET` | `/admin/audit-logs` | Immutable Admin Activity Audit Trail |

---

## 1. 📊 Executive Dashboard & Analytics APIs

### 1.1 Overview KPI Metrics
* **Frontend Screen:** Top row metric cards on `Mission Control Dashboard` (`/dashboard`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/analytics/overview`
* **Headers:** `Authorization: Bearer <token>`
* **Query Parameters:** None

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Overview analytics retrieved successfully",
  "response": {
    "totalAthletes": 12840,
    "athletesGrowthMoM": 14.2,
    "totalClubs": 428,
    "clubsGrowthMoM": 8.1,
    "activeRidesThisWeek": 1215,
    "ridesGrowthMoM": 22.0,
    "platformGmvEur": 148250.00,
    "mrrEur": 9840.00,
    "stravaSyncRate": 76.4,
    "pendingDisputesCount": 3,
    "flaggedListingsCount": 2
  }
}
```

---

### 1.2 Monthly Revenue Trend Chart
* **Frontend Screen:** Main financial area chart on the dashboard.
* **HTTP Method:** `GET`
* **Route:** `/api/admin/analytics/revenue-chart`
* **Query Parameters:**
  * `range` *(string, optional)*: `'30days'`, `'6months'`, `'1year'` (Default: `'6months'`)

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Revenue trend data retrieved",
  "response": [
    {
      "month": "Oct 2025",
      "saasSubscriptions": 6400.00,
      "clubMembershipCut": 1850.00,
      "shopCommission": 420.00,
      "totalRevenue": 8670.00
    },
    {
      "month": "Nov 2025",
      "saasSubscriptions": 7200.00,
      "clubMembershipCut": 2100.00,
      "shopCommission": 540.00,
      "totalRevenue": 9840.00
    },
    {
      "month": "Dec 2025",
      "saasSubscriptions": 8100.00,
      "clubMembershipCut": 2450.00,
      "shopCommission": 680.00,
      "totalRevenue": 11230.00
    }
  ]
}
```

---

### 1.3 Live Activity & Ride Map Clusters
* **Frontend Screen:** Interactive Leaflet map on dashboard showing where rides are happening.
* **HTTP Method:** `GET`
* **Route:** `/api/admin/analytics/activity-map`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Activity map data retrieved",
  "response": [
    {
      "rideId": 108,
      "rideName": "Costa Brava Gravel Epic",
      "clubName": "Girona Gravel Club",
      "lat": 41.9794,
      "lng": 2.8214,
      "participantCount": 34,
      "date": "2026-03-28",
      "status": "upcoming"
    },
    {
      "rideId": 109,
      "rideName": "London Morning Laps",
      "clubName": "Thames Striders",
      "lat": 51.5074,
      "lng": -0.1278,
      "participantCount": 18,
      "date": "2026-03-28",
      "status": "upcoming"
    }
  ]
}
```

---

## 2. 👥 User Governance & 360° Athlete Dossier

### 2.1 Get Users List (with Advanced Filters)
* **Frontend Screen:** Main Athlete Directory table (`/users`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/users`
* **Query Parameters:**
  * `offset` *(number, required)*: e.g. `0`
  * `limit` *(number, required)*: e.g. `10`
  * `search` *(string, optional)*: Filter by full name or email
  * `isPro` *(boolean, optional)*: Filter by Pro SaaS tier
  * `stravaConnected` *(boolean, optional)*: `true` / `false`
  * `status` *(string, optional)*: `'active'`, `'suspended'`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Users list retrieved",
  "response": {
    "count": 12840,
    "rows": [
      {
        "id": 55,
        "fullName": "Alex Morgan",
        "email": "alex@example.com",
        "profileImage": "https://cdn.ridewithpals.com/avatars/55.jpg",
        "country": "Spain",
        "unit": "km",
        "isPro": true,
        "stravaConnected": true,
        "clubsCount": 3,
        "ridesCount": 42,
        "isSuspended": false,
        "createdAt": "2025-08-14T09:20:00.000Z"
      }
    ]
  }
}
```

---

### 2.2 Get Athlete 360° Dossier
* **Frontend Screen:** Slide-over detail drawer when clicking a user (`/users/:id`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/users/:id/dossier`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "User dossier retrieved",
  "response": {
    "profile": {
      "id": 55,
      "fullName": "Alex Morgan",
      "email": "alex@example.com",
      "phone": "+34 611 223 344",
      "country": "Spain",
      "unit": "km",
      "stravaAthleteId": 984120,
      "isSuspended": false,
      "createdAt": "2025-08-14T09:20:00.000Z"
    },
    "subscription": {
      "planName": "Athlete Pro Yearly",
      "price": "29.99",
      "currency": "EUR",
      "status": "active",
      "expiresAt": "2026-08-14T00:00:00.000Z"
    },
    "clubs": [
      {
        "clubId": 12,
        "clubName": "Girona Gravel Club",
        "role": "Admin",
        "feeStatus": "Paid",
        "joinedAt": "2025-09-01T10:00:00.000Z"
      }
    ],
    "recentRides": [
      {
        "id": 108,
        "rideName": "Costa Brava Epic",
        "date": "2026-03-15",
        "distance": "85.0",
        "role": "Participant"
      }
    ],
    "marketplaceListings": [
      {
        "id": 84,
        "productName": "Shimano Dura-Ace C50 Wheels",
        "price": "850.00",
        "isSoldOut": false
      }
    ],
    "shopOrders": [
      {
        "id": 302,
        "clubName": "Girona Gravel Club",
        "productName": "Official Summer Jersey",
        "totalPrice": "65.00",
        "status": "Delivered"
      }
    ]
  }
}
```

---

### 2.3 Suspend / Reactivate an Athlete
* **Frontend Screen:** Moderation action modal in user profile.
* **HTTP Method:** `PUT`
* **Route:** `/api/admin/users/:id/suspend`
* **Request Body:**
```json
{
  "isSuspended": true,
  "reason": "Suspicious marketplace activity and safety policy violation"
}
```

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "User suspension status updated successfully",
  "response": {
    "userId": 55,
    "isSuspended": true
  }
}
```

---

## 3. 🛡️ Club Governance & Deep Inspector

### 3.1 Get Clubs List
* **Frontend Screen:** Main Club Directory (`/clubs`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/clubs`
* **Query Parameters:**
  * `offset`, `limit`, `search`
  * `isVerified` *(boolean, optional)*
  * `stripeStatus` *(string, optional)*: `'connected'`, `'pending'`, `'none'`
  * `status` *(string, optional)*: `'active'`, `'suspended'`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Clubs list retrieved",
  "response": {
    "count": 428,
    "rows": [
      {
        "id": 12,
        "clubName": "Girona Gravel Club",
        "logo": "https://cdn.ridewithpals.com/clubs/12.jpg",
        "ownerId": 41,
        "ownerName": "Marc Soler",
        "ownerEmail": "marc@girona.cc",
        "location": "Girona, Spain",
        "memberCount": 128,
        "privacy": "Public",
        "tier": "Gold Club",
        "stripeConnected": true,
        "stripeStatus": "active",
        "isVerified": true,
        "isSuspended": false,
        "createdAt": "2025-06-10T12:00:00.000Z"
      }
    ]
  }
}
```

---

### 3.2 Deep Club Inspector
* **Frontend Screen:** Detailed Multi-Tab Club View (`/clubs/:id`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/clubs/:id/inspect`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Club inspection details retrieved",
  "response": {
    "club": {
      "id": 12,
      "clubName": "Girona Gravel Club",
      "owner": { "id": 41, "name": "Marc Soler", "email": "marc@girona.cc" },
      "location": "Girona, Spain",
      "memberCount": 128,
      "isVerified": true,
      "tier": "Gold Club"
    },
    "stripe": {
      "connected": true,
      "accountId": "acct_1Nxxxxxxxxxxxxxx",
      "payoutsEnabled": true,
      "chargesEnabled": true,
      "detailsSubmitted": true
    },
    "activeFeePlans": [
      {
        "id": 22,
        "name": "Annual Membership 2026",
        "price": "25.00",
        "currency": "EUR",
        "billingInterval": "annual",
        "paidCount": 94,
        "pendingCount": 34
      }
    ],
    "delegatedMembers": [
      {
        "userId": 55,
        "fullName": "Alex Morgan",
        "role": "Admin",
        "isFullAccess": false,
        "permissions": {
          "publishRides": true,
          "publishNews": true,
          "publishDiscount": false,
          "acceptOrBanUsers": true,
          "manageMembershipFee": false
        }
      }
    ],
    "monthlyStats": {
      "totalRidesHosted": 8,
      "feesCollectedEur": 2350.00,
      "shopOrdersPlaced": 14
    }
  }
}
```

---

### 3.3 Verify Club / Grant Pro Badge
* **Frontend Screen:** Pro Verification Toggle in Club Profile.
* **HTTP Method:** `PUT`
* **Route:** `/api/admin/clubs/:id/verify`
* **Request Body:** `{ "isVerified": true }`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Club verification status updated",
  "response": { "clubId": 12, "isVerified": true }
}
```

---

### 3.4 Transfer Club Ownership
* **Frontend Screen:** Club Admin Settings (ownership transfer modal).
* **HTTP Method:** `PUT`
* **Route:** `/api/admin/clubs/:id/transfer-ownership`
* **Request Body:**
```json
{
  "newOwnerId": 55,
  "reason": "Previous owner Marc Soler resigned from club management."
}
```

---

## 4. 🚴 Group Rides & GPX Routes Control Center

### 4.1 Group Rides Directory
* **Frontend Screen:** Activities & Rides Management Table (`/rides`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/rides`
* **Query Parameters:**
  * `offset`, `limit`, `search`
  * `clubId` *(number, optional)*
  * `sportTypeId` *(number, optional)*: Road, Gravel, MTB, Trail
  * `status` *(string, optional)*: `'upcoming'`, `'completed'`, `'cancelled'`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Rides list retrieved",
  "response": {
    "count": 1215,
    "rows": [
      {
        "id": 108,
        "rideName": "Costa Brava Gravel Epic",
        "clubId": 12,
        "clubName": "Girona Gravel Club",
        "date": "2026-03-28",
        "time": "08:30:00",
        "distance": "85.0",
        "meetingPoint": "Plaça de la Independència, Girona",
        "sportType": "Gravel",
        "pace": "25-28 km/h",
        "isPublic": true,
        "isPaymentRequired": false,
        "confirmedParticipants": 34,
        "slotsLimit": 50,
        "status": "upcoming",
        "leaders": [
          { "userId": 41, "name": "Marc Soler" }
        ],
        "supportCarDriver": { "userId": 89, "name": "Carlos V." }
      }
    ]
  }
}
```

---

### 4.2 Ride Route & GPX Dossier
* **Frontend Screen:** Ride Detail Modal (shows Leaflet GPX track viewer & attendance roster).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/rides/:id`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Ride details retrieved",
  "response": {
    "id": 108,
    "rideName": "Costa Brava Gravel Epic",
    "clubName": "Girona Gravel Club",
    "gpxFileUrl": "https://cdn.ridewithpals.com/routes/girona_85k.gpx",
    "elevationGainMeters": 1120,
    "stops": [
      { "name": "Espolla Cafe Stop", "km": 42.5 }
    ],
    "isWomenAndNonBinaryOnly": false,
    "participants": [
      {
        "userId": 55,
        "name": "Alex Morgan",
        "email": "alex@example.com",
        "checkedIn": true
      }
    ]
  }
}
```

---

### 4.3 Emergency Ride Cancellation (with Automated Push)
* **Frontend Screen:** "Cancel Ride" button in Ride Inspector.
* **HTTP Method:** `DELETE`
* **Route:** `/api/admin/rides/:id`
* **Request Body:**
```json
{
  "cancellationReason": "Severe storm safety warning issued by local authorities.",
  "sendPushNotification": true
}
```

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Ride cancelled and 34 participants notified via push notification",
  "response": {
    "rideId": 108,
    "status": "cancelled",
    "notifiedCount": 34
  }
}
```

---

## 5. 💳 Financial Operations & Stripe Connect

### 5.1 Global Financial Ledger
* **Frontend Screen:** Main Financial Ledger table (`/payments`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/financials/ledger`
* **Query Parameters:**
  * `offset`, `limit`
  * `type` *(string, optional)*: `'all'`, `'saas_subscription'`, `'club_membership'`, `'shop_order'`
  * `startDate`, `endDate` *(optional ISO dates)*

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Financial ledger retrieved",
  "response": {
    "summary": {
      "totalGrossEur": 148250.00,
      "totalPlatformFeeEur": 9840.00,
      "currency": "EUR"
    },
    "rows": [
      {
        "transactionId": "txn_94821",
        "date": "2026-03-18T11:42:00.000Z",
        "type": "club_membership",
        "source": "Girona Gravel Club",
        "payer": "Alex Morgan",
        "grossAmount": 25.00,
        "platformFee": 1.25,
        "netAmount": 23.75,
        "currency": "EUR",
        "stripePaymentIntentId": "pi_3Nqxxxxxxxxxxxxxx",
        "status": "succeeded"
      },
      {
        "transactionId": "txn_94820",
        "date": "2026-03-18T10:15:00.000Z",
        "type": "saas_subscription",
        "source": "Gold Club Plan (London Striders)",
        "payer": "Thames Striders",
        "grossAmount": 89.00,
        "platformFee": 89.00,
        "netAmount": 0.00,
        "currency": "EUR",
        "stripePaymentIntentId": "pi_3Npyyyyyyyyyyyyyy",
        "status": "succeeded"
      }
    ]
  }
}
```

---

### 5.2 Stripe Connect Accounts Status
* **Frontend Screen:** Stripe Connect Merchant Monitoring tab.
* **HTTP Method:** `GET`
* **Route:** `/api/admin/financials/stripe-accounts`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Stripe accounts retrieved",
  "response": {
    "count": 428,
    "rows": [
      {
        "clubId": 12,
        "clubName": "Girona Gravel Club",
        "stripeAccountId": "acct_1Nxxxxxxxxxxxxxx",
        "chargesEnabled": true,
        "payoutsEnabled": true,
        "detailsSubmitted": true,
        "availableBalanceEur": 840.50,
        "pendingBalanceEur": 125.00
      }
    ]
  }
}
```

---

### 5.3 Approve Manual / Offline Club Payout
* **Frontend Screen:** Approve payout modal for clubs using manual bank transfers.
* **HTTP Method:** `PUT`
* **Route:** `/api/admin/financials/payouts/:id/approve`
* **Request Body:**
```json
{
  "transferReference": "SEPA-WIRE-984128",
  "receiptUrl": "https://cdn.ridewithpals.com/receipts/984128.pdf",
  "notes": "Bank wire processed from corporate account"
}
```

---

## 6. 🛒 E-Commerce & Marketplace Governance

### 6.1 Marketplace Listings Moderation
* **Frontend Screen:** Peer-to-peer Classifieds Moderation (`/commerce`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/marketplace/listings`
* **Query Parameters:** `offset`, `limit`, `search`, `condition`, `isFlagged`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Marketplace listings retrieved",
  "response": {
    "count": 340,
    "rows": [
      {
        "id": 84,
        "productName": "Shimano Dura-Ace C50 Wheels",
        "sellerId": 55,
        "sellerName": "Alex Morgan",
        "sellerEmail": "alex@example.com",
        "clubName": "Girona Gravel Club",
        "price": "850.00",
        "condition": "Like New",
        "image": "https://cdn.ridewithpals.com/market/84.jpg",
        "isActive": true,
        "isSoldOut": false,
        "flaggedReportsCount": 0,
        "createdAt": "2026-03-10T14:30:00.000Z"
      }
    ]
  }
}
```

---

### 6.2 Take Down Suspicious Marketplace Item
* **Frontend Screen:** "Take Down Listing" modal.
* **HTTP Method:** `PUT`
* **Route:** `/api/admin/marketplace/listings/:id/moderate`
* **Request Body:**
```json
{
  "isActive": false,
  "reason": "Suspected counterfeit item or prohibited equipment."
}
```

---

### 6.3 Club Shop Order Bottlenecks
* **Frontend Screen:** Delivery Bottlenecks Tab (surfaces club shop orders stuck in `Pending` > 7 days).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/shop/orders/bottlenecks`
* **Query Parameters:** `delayedDaysThreshold=7`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Order bottlenecks retrieved",
  "response": [
    {
      "orderId": 402,
      "clubName": "Madrid Cycling Crew",
      "ownerEmail": "organizer@madridcc.com",
      "buyerName": "Carlos Ruiz",
      "productName": "Winter Cycling Cap",
      "daysPending": 9,
      "orderDate": "2026-03-09T10:00:00.000Z"
    }
  ]
}
```

---

## 7. 🎧 Customer Support & Dispute Desk

### 7.1 Support Tickets Queue
* **Frontend Screen:** Support Desk Inbox (`/support`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/support/tickets`
* **Query Parameters:**
  * `offset`, `limit`
  * `status` *(string, optional)*: `'open'`, `'in_progress'`, `'resolved'`, `'closed'`
  * `priority` *(string, optional)*: `'urgent'`, `'high'`, `'normal'`
  * `category` *(string, optional)*: `'billing'`, `'safety'`, `'account'`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Support tickets retrieved",
  "response": {
    "count": 18,
    "rows": [
      {
        "id": 1042,
        "ticketNumber": "RWP-1042",
        "userId": 55,
        "userName": "Alex Morgan",
        "userEmail": "alex@example.com",
        "subject": "Charged twice for Gold Club subscription",
        "category": "billing",
        "priority": "high",
        "status": "open",
        "assignedAdminName": "Support Agent 1",
        "updatedAt": "2026-03-18T14:10:00.000Z"
      }
    ]
  }
}
```

---

### 7.2 Get Ticket Messages & Thread
* **Frontend Screen:** Conversation Pane inside Support Ticket.
* **HTTP Method:** `GET`
* **Route:** `/api/admin/support/tickets/:id/messages`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "response": [
    {
      "id": 1,
      "senderType": "user",
      "senderName": "Alex Morgan",
      "message": "Hi, I noticed two charges of €89 on my credit card statement.",
      "createdAt": "2026-03-18T13:45:00.000Z"
    },
    {
      "id": 2,
      "senderType": "admin",
      "senderName": "Support Agent 1",
      "message": "Looking into the Stripe invoice log now.",
      "isInternalNote": true,
      "createdAt": "2026-03-18T14:00:00.000Z"
    }
  ]
}
```

---

### 7.3 Reply to Ticket (Delivers to User Mobile / Push)
* **Frontend Screen:** Reply text area inside Support Ticket.
* **HTTP Method:** `POST`
* **Route:** `/api/admin/support/tickets/:id/reply`
* **Request Body:**
```json
{
  "message": "We have verified the duplicate charge and issued a full refund of €89.00.",
  "isInternalNote": false,
  "status": "resolved"
}
```

---

## 8. ⚙️ Platform Global Settings & Audit Logs

### 8.1 Get & Update Global Settings
* **Frontend Screen:** Platform Configuration (`/settings`).
* **HTTP Method:** `GET` & `PUT`
* **Route:** `/api/admin/settings`
* **Request / Response Body:**
```json
{
  "statusCode": 200,
  "message": "Platform settings updated",
  "response": {
    "platformFeePercentage": 5.0,
    "minIosVersion": "1.2.0",
    "minAndroidVersion": "1.2.0",
    "forceUpdateEnabled": false,
    "maintenanceMode": false,
    "maxMarketplaceImages": 5
  }
}
```

---

### 8.2 Immutable Admin Activity Audit Log
* **Frontend Screen:** Compliance & Audit Log Feed (`/settings/audit`).
* **HTTP Method:** `GET`
* **Route:** `/api/admin/audit-logs`
* **Query Parameters:** `offset`, `limit`, `adminId`, `actionType`

#### Reference Response (`200 OK`):
```json
{
  "statusCode": 200,
  "message": "Audit logs retrieved",
  "response": {
    "count": 4820,
    "rows": [
      {
        "id": 9012,
        "adminId": 1,
        "adminName": "Super Admin",
        "action": "USER_SUSPENDED",
        "targetEntity": "User",
        "targetId": 88,
        "details": "Suspended user for safety violations",
        "ipAddress": "185.32.14.88",
        "timestamp": "2026-03-18T16:05:00.000Z"
      },
      {
        "id": 9013,
        "adminId": 1,
        "adminName": "Super Admin",
        "action": "REFUND_ISSUED",
        "targetEntity": "ShopOrder",
        "targetId": 402,
        "details": "Issued €65.00 refund for delayed shipment",
        "ipAddress": "185.32.14.88",
        "timestamp": "2026-03-18T16:20:00.000Z"
      }
    ]
  }
}
```

---

## 9. 💡 Recommended Database Indexes (For High Performance)

To ensure the admin queries run fast even with tens of thousands of users and rides, recommend adding indexes on these columns:

1. **`Users` Table:** `status`, `isPro`, `stravaConnected`, `createdAt`
2. **`Clubs` Table:** `isVerified`, `status`, `clubPrivacyId`, `ownerId`
3. **`Rides` Table:** `status`, `clubId`, `date`, `isPublic`, `activityTypeId`
4. **`MemberFees` Table:** `paymentStatus`, `clubId`, `userId`, `planId`
5. **`ShopOrders` Table:** `statusId`, `clubId`, `buyerId`, `createdAt`
6. **`MarketplaceItems` Table:** `isActive`, `isSoldOut`, `sellerId`, `createdAt`
7. **`SupportTickets` Table:** `status`, `priority`, `category`, `userId`, `assignedAdminId`

---

*This guide was generated to match the production needs of Ride With Pals. If you have questions about specific fields, let the frontend team know!*
