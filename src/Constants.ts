/**
 * @fileoverview App-wide text constants and configuration values.
 * Centralised here so copy/headings can be updated without hunting through components.
 */

// ─── App Identity ────────────────────────────────────────────────────────────
export const APP_NAME = "Ride With Pals" as const;
export const APP_TAGLINE = "Admin Control Center" as const;
export const APP_VERSION = "1.0.0" as const;

// ─── Mock Auth Credentials (development only) ────────────────────────────────
export const MOCK_ADMIN_EMAIL = "admin@admin.com" as const;
export const MOCK_ADMIN_PASSWORD = "admin1234" as const;
export const MOCK_ADMIN_NAME = "Super Admin" as const;

// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  CLUBS: "/clubs",
  PAYMENTS: "/payments",
  ANALYTICS: "/analytics",
  APP_SUPPORT: "/support",
  PUSH_NOTIFICATIONS: "/notifications",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS: "/terms",
} as const;

// ─── Navigation Items ────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: "Dashboard", route: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Users", route: ROUTES.USERS, icon: "Users" },
  { label: "Clubs", route: ROUTES.CLUBS, icon: "ShieldCheck" },
  { label: "Payments", route: ROUTES.PAYMENTS, icon: "CreditCard" },
  { label: "Analytics", route: ROUTES.ANALYTICS, icon: "BarChart3" },
  { label: "App Support", route: ROUTES.APP_SUPPORT, icon: "Headphones" },
  { label: "Push Notifications", route: ROUTES.PUSH_NOTIFICATIONS, icon: "Bell" },
  { label: "Privacy Policy", route: ROUTES.PRIVACY_POLICY, icon: "FileText" },
  { label: "Terms & Conditions", route: ROUTES.TERMS, icon: "ScrollText" },
] as const;

// ─── Login Page Copy ─────────────────────────────────────────────────────────
export const LOGIN_COPY = {
  HEADING: "Welcome Back",
  SUBHEADING: "Sign in to your admin account",
  EMAIL_LABEL: "Email Address",
  EMAIL_PLACEHOLDER: "admin@admin.com",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  SUBMIT_LABEL: "Sign In",
  SUBMITTING_LABEL: "Authenticating...",
  LEFT_TAGLINE: "Manage rides, users & clubs — all in one place.",
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  SUCCESS_MESSAGE: "Welcome back, Admin!",
} as const;

// ─── Dashboard Copy ──────────────────────────────────────────────────────────
export const DASHBOARD_COPY = {
  HEADING: "Dashboard",
  WELCOME: "Here's what's happening today.",
  TOTAL_USERS: "Total Users",
  TOTAL_CLUBS: "Total Clubs",
  EARNINGS: "Earnings till Now",
  BALANCE: "Balance",
} as const;
// ─── Local Storage Keys ──────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME: "rwp-theme",
  AUTH: "rwp-auth",
  AUTH_TOKEN: "rwp_admin_token",
  PERSIST_ROOT: "ride-admin-root",
} as const;
