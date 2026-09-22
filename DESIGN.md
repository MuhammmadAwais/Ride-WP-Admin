---
name: Ride With Pals Design System
brand: Ride With Pals Admin Control Center
version: 2.0.0
---

# 🎨 Ride With Pals — Design System Specification

> **Theme Concept:** Modern, high-octane, dark-mode-first aesthetic for a premier motorcycle & cycling community platform. Sleek carbon and charcoal foundations accented with high-visibility energetic biker orange (`#EB712B`), crisp light mode support, clean typography, and tactile GSAP micro-animations.

---

## 1. Color Palette & Theme Tokens

### Core Colors

```yaml
accent:
  default: '#EB712B'       # Signature Ride-WP Orange
  hover: '#D65F1C'         # Darker shade on interactive hover
  subtle: 'rgba(235, 113, 43, 0.12)' # Background for active pills and indicators
  glow: 'rgba(235, 113, 43, 0.25)'   # Elevation focus glow

dark_theme (default):
  main-bg: '#121212'       # Pure sleek midnight canvas (matches Ride-WP)
  surface: '#181818'       # Primary deep charcoal card and surface background
  surface-elevated: '#222222' # Elevated dropdowns, popovers, and modals
  text-main: '#FFFFFF'     # High-contrast primary text
  text-muted: '#A1A1AA'    # Zinc-400 crisp secondary descriptive text & icons
  border: 'rgba(255, 255, 255, 0.08)' # Subtle boundary borders
  hover: 'rgba(255, 255, 255, 0.05)'  # Row & item hover state
  glass-bg: 'rgba(18, 18, 18, 0.85)'  # Frosted glassmorphism for sticky bars
  table-header: 'rgba(235, 113, 43, 0.08)' # Subtle accent-tinted table headers

light_theme:
  main-bg: '#F6F6F6'       # Clean soft grey canvas
  surface: '#FFFFFF'       # Pure white cards and sidebar
  surface-elevated: '#FAFAFA' # Elevated surfaces
  text-main: '#363636'     # Rich deep charcoal text
  text-muted: '#6B6B6B'    # Secondary grey text
  border: 'rgba(0, 0, 0, 0.08)' # Crisp boundary border
  hover: 'rgba(0, 0, 0, 0.04)'  # Item hover state
  glass-bg: 'rgba(255, 255, 255, 0.75)' # Light frosted glassmorphism
  table-header: 'rgba(235, 113, 43, 0.05)' # Light accent-tinted table headers

semantic_status:
  success:
    color: '#10B981'
    bg: 'rgba(16, 185, 129, 0.12)'
    border: 'rgba(16, 185, 129, 0.24)'
  warning:
    color: '#F59E0B'
    bg: 'rgba(245, 158, 11, 0.12)'
    border: 'rgba(245, 158, 11, 0.24)'
  error:
    color: '#EF4444'
    bg: 'rgba(239, 68, 68, 0.12)'
    border: 'rgba(239, 68, 68, 0.24)'
  info:
    color: '#3B82F6'
    bg: 'rgba(59, 130, 246, 0.12)'
    border: 'rgba(59, 130, 246, 0.24)'
```

---

## 2. Typography

We enforce a strict **Dual-Font System**:
1. **Poppins (`font-poppins`):** Bold, structured geometry reserved for Page Titles, Display Numbers, KPI Stat values, and Brand Badges.
2. **Roboto (`font-roboto`):** Humanist, highly readable sans-serif strictly for Data Tables, Form Controls, Body Copy, Table Headers, and Microcopy.

```yaml
typography:
  display:
    fontFamily: Poppins, system-ui, sans-serif
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: '-0.02em'
  headline:
    fontFamily: Poppins, system-ui, sans-serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: '-0.01em'
  title:
    fontFamily: Poppins, system-ui, sans-serif
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Roboto, system-ui, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Roboto, system-ui, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  caption:
    fontFamily: Roboto, system-ui, sans-serif
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0.02em'
```

---

## 3. Geometry, Elevation & Layout

### Spacing & Geometry
- **Base Spacing:** `0.25rem` (4px).
- **Border Radii:**
  - Standard Cards & Containers: `rounded-xl` (`1rem` / 16px).
  - Large Modals & Hero Surfaces: `rounded-2xl` (`1.5rem` / 24px).
  - Status Badges & Pill Buttons: `rounded-pill` (`9999px`).
  - Small Controls & Inputs: `rounded-lg` (`0.5rem` / 8px).

### Layout Geometry
- **Sidebar:** Width 260px (desktop expanded), 80px (collapsed). Logo header height strictly **80px**.
- **Top Navigation Bar:** Height strictly **80px**, sticky, with frosted backdrop blur (`backdrop-blur-md`).
- **Main Canvas:** Fluid with `p-6` to `p-8` container spacing.

---

## 4. Component Patterns

### 1. Stat & Metric KPI Cards
- Background: `bg-surface`
- Border: `border border-border`
- Hover: subtle translateY(-2px) elevation transition
- Structure: Metric Title (`text-text-muted text-xs uppercase tracking-wider font-roboto`), KPI Value (`text-2xl font-bold font-poppins text-text-main`), Trend Indicator (`text-xs font-semibold rounded-pill px-2 py-0.5`).

### 2. Standardized Data Tables
- Header: Sticky top with `bg-surface` or `bg-table-header`, uppercase labels (`text-xs font-semibold text-text-muted tracking-wider`).
- Rows: Clean bottom border `border-b border-border`, hover state `hover:bg-hover transition-colors duration-150`.
- Pagination Bar: Flex footer with total records count, rows-per-page selector, and discrete page buttons.

### 3. Action Buttons & Hierarchy
- **Primary:** `bg-accent text-white font-medium hover:brightness-105 active:scale-[0.98] transition-all shadow-sm`
- **Secondary / Outline:** `bg-transparent border border-border text-text-main hover:bg-hover active:scale-[0.98]`
- **Ghost:** `text-text-muted hover:text-text-main hover:bg-hover`
- **Destructive:** `bg-error text-white hover:brightness-105 active:scale-[0.98]`

### 4. Status Badges
Rendered as compact pills with an embedded circular pulse or solid status dot:
- `Active` / `Delivered` / `Verified`: Success green pill.
- `Pending` / `Under Review`: Warning amber pill.
- `Suspended` / `Disbanded` / `Failed`: Error red pill.
- `Private` / `Draft`: Info or neutral slate pill.

---

## 5. Animation & Motion Guidelines

Powered by **GSAP 3** and Tailwind CSS v4 keyframe animations:
- **Card Entrance:** `--animate-fade-in` (`transform: translateY(6px)` to `0`, `0.25s ease-out`).
- **Modal Pop:** `--animate-scale-in` (`transform: scale(0.92)` to `1`, `0.3s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Live Dot Pulse / Notifications:** `--animate-notif-bounce` (subtle attention bounce for unread support tickets).
- **Tab Switching:** Fluid indicator transition with GSAP `Flip` or Framer Motion layout animations.