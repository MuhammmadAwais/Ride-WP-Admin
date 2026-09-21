# UI Tokens: Ride With Pals Admin Control Center

Design tokens for **Ride With Pals — Admin Control Center**. All colors, typography, spacing, and geometric values match `src/index.css`. Use these exact tokens throughout the codebase — never hardcode raw hex values or generic Tailwind color utilities.

---

## 1. How to Use in Tailwind CSS v4

All tokens are defined in the `@theme` block of `src/index.css`. Tailwind v4 automatically derives utility classes:

- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`
- `--color-main-bg` → `bg-main-bg`
- `--color-text-main` → `text-text-main`
- `--color-text-muted` → `text-text-muted`
- `--color-border` → `border-border`
- `--color-error` → `bg-error`, `text-error`, `border-error`
- `--font-poppins` → `font-poppins`
- `--font-roboto` → `font-roboto`

```tsx
// ✅ CORRECT: Standard Tailwind v4 token classes
<div className="bg-surface border border-border text-text-main rounded-xl p-6">
  <h2 className="font-poppins text-lg font-bold text-accent">Active Rides</h2>
  <p className="font-roboto text-sm text-text-muted">Manage real-time rosters</p>
</div>

// ❌ NEVER: Hardcoded hex or raw Tailwind colors
<div className="bg-[#282828] text-[#FFFFFF] border-[#333333]">
<button className="bg-orange-500 text-white">
```

---

## 2. Complete Token Catalog (`src/index.css`)

### 2.1 CSS Variables (`:root` & `html.dark`)

```css
:root {
  /* Light Theme */
  --color-main-bg: #F6F6F6;
  --color-secondary-bg: #FFFFFF;
  --color-main-text: #363636;
  --color-secondary-text: #6B6B6B;
  --color-accent: #EB712B;
  --color-border: rgba(0, 0, 0, 0.08);
  --color-hover: rgba(0, 0, 0, 0.04);
  --color-glass-bg: rgba(255, 255, 255, 0.75);
  --color-table-header: rgba(235, 113, 43, 0.05);
}

html.dark {
  /* Dark Theme (Default) */
  --color-main-bg: #202020;
  --color-secondary-bg: #282828E5;
  --color-main-text: #FFFFFF;
  --color-secondary-text: #95908D;
  --color-accent: #EB712B;
  --color-border: rgba(255, 255, 255, 0.05);
  --color-hover: rgba(255, 255, 255, 0.05);
  --color-glass-bg: rgba(40, 40, 40, 0.65);
  --color-table-header: rgba(235, 113, 43, 0.08);
}
```

### 2.2 Tailwind v4 `@theme` Bindings

```css
@theme {
  --spacing: 0.25rem;

  /* Colors */
  --color-accent:          var(--color-accent);
  --color-main-bg:         var(--color-main-bg);
  --color-surface:         var(--color-secondary-bg);
  --color-text-main:       var(--color-main-text);
  --color-text-muted:      var(--color-secondary-text);
  --color-border:          var(--color-border);
  --color-error:           #EF4444;

  /* Typography */
  --font-poppins:          'Poppins', system-ui, sans-serif;
  --font-roboto:           'Roboto', system-ui, sans-serif;

  /* Geometry & Radii */
  --radius-xl:             1rem;       /* 16px */
  --radius-2xl:            1.5rem;     /* 24px */
  --radius-pill:           9999px;

  /* Motion & Keyframes */
  --ease-expo-out:         cubic-bezier(0.16, 1, 0.3, 1);
  --animate-spin-slow:     spin 8s linear infinite;
  --animate-notif-bounce:  notif-bounce 0.8s ease-in-out infinite;
  --animate-fade-in:       fade-in 0.25s ease-out both;
  --animate-scale-in:      scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

---

## 3. Semantic Status Indicators

| Semantic State | Class Combination |
|---|---|
| **Active / Verified** | `bg-emerald-500/10 text-emerald-500 border border-emerald-500/20` |
| **Pending / Review** | `bg-amber-500/10 text-amber-500 border border-amber-500/20` |
| **Suspended / Failed** | `bg-error/10 text-error border border-error/20` |
| **Draft / Inactive** | `bg-slate-500/10 text-slate-400 border border-slate-500/20` |
| **Accent Active** | `bg-accent/15 text-accent border border-accent/30` |
