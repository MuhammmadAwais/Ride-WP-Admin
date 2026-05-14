# Ride with Pals — Admin Panel

> A high-performance, type-safe admin control center for the **Ride with Pals** ride-sharing platform. Built with React 19, TypeScript, Tailwind CSS v4, GSAP, and Redux Toolkit.

---

## ✨ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript ~6 (strict mode) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + Vanilla CSS |
| Animation | GSAP 3 |
| State | Redux Toolkit + redux-persist (localStorage) |
| Routing | React Router v7 |
| Forms | react-hook-form + Zod |
| Icons | Lucide React |
| Notifications | Sonner |
| SEO | react-helmet-async |

---

## 🎨 Design System

### Color Palette

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| Main BG | `#202020` | `#F6F6F6` | Page background |
| Container | `#282828` | `#FFFFFF` | Cards, sidebar |
| Text Primary | `#FFFFFF` | `#363636` | Body text |
| Text Secondary | `#A0A0A0` | `#818181` | Subtitles, hints |
| Accent | `#EB712B` | `#EB712B` | Buttons, active states |

### Typography
- **Headings:** Poppins (400–800)
- **Body / UI:** Roboto (300–700)

---

## 🗂️ Architecture

Feature-based directory structure — every feature owns its own types, slices, services, hooks, and components.

```
src/
├── app/                     # App shell (store, router, App root)
│   ├── store.ts             # Redux store + redux-persist
│   ├── router.tsx           # createBrowserRouter config
│   └── App.tsx              # Provider + PersistGate + RouterProvider
│
├── features/
│   └── auth/
│       ├── components/      # LoginPage.tsx
│       ├── hooks/           # (feature-specific hooks)
│       ├── services/        # authService.ts (mockLogin)
│       ├── slices/          # authSlice.ts
│       └── types/           # authTypes.ts
│
├── Components/
│   ├── layout/              # AppLayout, Sidebar, Navbar, ProtectedRoute
│   └── ui/                  # Shared reusable UI components
│
├── hooks/                   # Global shared hooks
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   ├── useTheme.ts
│   └── useSecureSession.ts
│
├── pages/
│   └── Dashboard/           # DashboardPage.tsx
│
├── lib/
│   └── utils.ts             # cn() tailwind-merge helper
│
└── index.css                # Tailwind v4 @theme design system
```

---

## 🚀 Local Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd Ride-WP-Admin

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Navigate to `http://localhost:5173`.

**Mock credentials:**
- Email: `admin@admin.com`
- Password: `admin1234`

---

## 🔒 Security

- **DevTools prevention** — F12, Ctrl+Shift+I/J/C, and right-click are blocked in **production builds only** (`useSecureSession` hook).
- **Protected routes** — `ProtectedRoute` redirects unauthenticated users to `/login`.
- **Session persistence** — Auth state is persisted via redux-persist to localStorage; page refresh keeps you logged in.

---

## 📦 Deployment

The project is deployed on **Vercel**. Every push to `main` triggers a production deployment.

```bash
# Production build (verify before deploying)
npm run build
```

---

## 📋 Pages Roadmap

| # | Page | Status |
|---|---|---|
| 1 | Login | ✅ Done |
| 2 | Forget Password | 🔜 Phase 2 |
| 3 | Dashboard | ✅ Done (stub) |
| 4 | Users | 🔜 Phase 2 |
| 5 | Clubs | 🔜 Phase 2 |
| 6 | Payments | 🔜 Phase 2 |
| 7 | Requests | 🔜 Phase 2 |
| 8 | Analytics | 🔜 Phase 2 |
| 9 | App Support | 🔜 Phase 2 |
| 10 | Push Notifications | 🔜 Phase 2 |
| 11 | Privacy Policy | 🔜 Phase 2 |
| 12 | Terms & Conditions | 🔜 Phase 2 |
| 13 | About | 🔜 Phase 2 |
