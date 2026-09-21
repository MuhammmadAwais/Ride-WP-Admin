# Architecture: Ride With Pals Admin Control Center

## 1. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React + Vite | React 19, Vite 8 | Ultra-fast client-side SPA runtime |
| **Language** | TypeScript | ~6.0.2 (strict) | Complete end-to-end type safety |
| **Routing** | React Router | v7.15.0 | Client-side routing with `createBrowserRouter` |
| **Styling** | Tailwind CSS | v4.3.0 (`@tailwindcss/vite`) | Zero-runtime CSS variable utility system |
| **Animation** | GSAP 3 + Framer Motion | GSAP 3.15, Framer Motion 12 | Smooth UI transitions and data visualization |
| **Global State** | Redux Toolkit + redux-persist | RTK 2.11, persist 6.0 | Session state, auth persistence, caching |
| **Data Fetching** | Axios + RTK Query | Axios 1.16, RTK Query | Intercepted REST transport with cache tags |
| **Realtime** | Socket.io Client | v4.8.3 | Support helpdesk & user chat WebSockets |
| **UI Primitives** | Radix UI | Latest | Accessible unstyled primitives (Dialog, Tabs, Dropdown) |
| **Icons** | Lucide React | v1.14.0 | Crisp, cohesive SVG icons |
| **Notifications** | Sonner | v2.0.7 | Stacked, non-blocking toast alerts |
| **Charts** | Recharts | v3.8.1 | Responsive SVG analytics and revenue charts |

---

## 2. Directory Structure

```
src/
├── app/                             # Application Root Shell
│   ├── store.ts                     # Redux store configuration & persisted reducers
│   ├── router.tsx                   # createBrowserRouter route definitions
│   └── App.tsx                      # Root App wrapper (Provider, PersistGate, RouterProvider)
│
├── api/                             # Network & API Transport Layer
│   ├── baseQuery.ts                 # Axios instance, JWT interceptor, response envelope unwrap
│   └── backendApi.ts                # Base RTK Query service definition
│
├── features/                        # Feature-Driven Modules (Isolated & Modular)
│   ├── analytics/                   # Mission Control KPI charts, GMV, MRR telemetry
│   ├── auth/                        # Login page, auth slices, session validation
│   ├── clubs/                       # Club directory, Deep Tabbed Inspector, suspension
│   ├── cms/                         # Dual-language legal CMS (Terms, Privacy, About)
│   ├── dashboard/                   # Executive Mission Control page
│   ├── notifications/               # Segmented FCM push notification broadcast engine
│   ├── payments/                    # Financial ledger, Stripe accounts, payout approvals
│   ├── subscriptions/               # SaaS Subscription tiers (User Pro & Club Gold)
│   ├── support/                     # Realtime Socket.io Support Helpdesk & live triage
│   └── users/                       # Athlete directory & 360° Athlete Dossier
│
├── Components/                      # Shared Reusable UI Components
│   ├── layout/                      # AppLayout, Sidebar (80px header), Navbar, ProtectedRoute
│   ├── ui/                          # DataTable, StatCard, StatusBadge, ActionMenu, Modal
│   └── common/                      # GlobalErrorBoundary, RouteErrorBoundary, SafeImage
│
├── hooks/                           # Shared Global Hooks
│   ├── useAppDispatch.ts            # Typed Redux dispatch
│   ├── useAppSelector.ts            # Typed Redux selector
│   ├── useTheme.ts                  # Dark/Light theme switcher hook
│   ├── useDebounce.ts               # Search query debouncing
│   └── useSecureSession.ts          # Session gatekeeping & production safeguards
│
├── lib/                             # Core Utilities & Singletons
│   ├── utils.ts                     # cn() tailwind-merge helper
│   └── socket.ts                    # Socket.io client connection manager
│
├── types/                           # Universal Shared TypeScript Contracts
├── index.css                        # Tailwind v4 @theme design system & CSS variables
└── Constants.ts                     # Application copy, routes, storage keys, and mock data
```

---

## 3. Network & Transport Layer Architecture

### 3.1 Standard Response Envelope
All backend REST APIs adhere to a universal response envelope:
```typescript
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}
```

### 3.2 Axios Interceptors (`src/api/baseQuery.ts`)
1. **Request Interceptor:**
   - Reads `rwp_admin_token` from `localStorage` under `STORAGE_KEYS.AUTH_TOKEN`.
   - Injects `Authorization: Bearer <token>` on all outgoing HTTP requests.
2. **Response Interceptor:**
   - Unwraps `.response` payload automatically.
   - On `401 Unauthorized`: Purges authentication storage, resets Redux auth state, and triggers an immediate redirect to `/login`.
   - On `5xx Server Error`: Surfaces a non-blocking error toast via `sonner`.

---

## 4. Realtime WebSocket Architecture (Socket.io)

Real-time capabilities are powered by `socket.io-client` authenticated via JWT in the connection handshake (`Authorization: Bearer <token>`).

### 4.1 Support Helpdesk Socket Protocol (`support:*`)
Used by the Support Desk (`/support`) to manage athlete tickets:

| Event Name | Direction | Payload | Purpose |
|---|---|---|---|
| `support:threads:list` | Emit (Admin) | `{ limit: 20, offset: 0 }` | Fetch active ticket queue with unread badges |
| `support:thread:join` | Emit (Admin) | `{ threadId: number }` | Join room `support:thread:{id}` and claim ticket |
| `support:thread:leave` | Emit (Admin) | `{ threadId: number }` | Leave ticket room |
| `support:messages:list` | Emit (Admin) | `{ threadId, limit, offset }`| Fetch paginated message history |
| `support:message:send` | Emit (Admin) | `{ threadId, message }` | Send support reply to athlete |
| `support:thread:read` | Emit (Admin) | `{ threadId }` | Mark all unread incoming messages as read |
| `support:message:new` | Listen | `{ threadId, message }` | Incoming message pushed to active room |
| `support:thread:read` | Listen | `{ threadId, readerId, role }`| Read receipt broadcast |

### 4.2 User-to-User Chat Socket Protocol (`chat:*`)
Used for community messaging oversight:

| Event Name | Direction | Payload | Purpose |
|---|---|---|---|
| `chat:threads:list` | Emit | `{ search?, limit, offset }` | Retrieve active conversation list |
| `chat:thread:join` | Emit | `{ threadId }` | Subscribe to user chat room |
| `chat:messages:list` | Emit | `{ threadId, limit, offset }` | Fetch message history between riders |
| `chat:message:send` | Emit | `{ threadId, message }` | Dispatch message |
| `chat:message:new` | Listen | `{ threadId, message }` | Incoming message broadcast |
| `chat:thread:read` | Listen | `{ threadId, readerId }` | Message read receipt broadcast |

---

## 5. Security & Session Gatekeeping

1. **Route Protection (`ProtectedRoute.tsx`):** Unauthenticated users attempting to access any protected route under `/dashboard/*` are redirected to `/login` with location memory.
2. **State Hydration:** User session and token are synchronized with Redux `authSlice` and stored in `localStorage` via `redux-persist`.
3. **Audit Trail Logging:** Destructive administrative actions (suspensions, fee updates, cancellations) are dispatched with audit payload metadata for tracking.
