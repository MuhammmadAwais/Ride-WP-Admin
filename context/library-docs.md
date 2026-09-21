# Library Docs: Ride With Pals Admin Control Center

Project-specific usage guidelines and integration patterns for third-party libraries installed in **Ride With Pals — Admin Control Center**.

---

## 1. Tailwind CSS v4 (`@tailwindcss/vite`)

- **Setup:** Configured in `vite.config.ts` via `@tailwindcss/vite` and imported directly in `src/index.css`.
- **Dark Mode:** Class-based dark mode configured via custom variant:
  ```css
  @custom-variant dark (&:is(.dark, .dark *));
  ```
- **Rules:**
  - Consume `@theme` tokens exclusively (`bg-accent`, `bg-surface`, `bg-main-bg`, `text-text-main`, `text-text-muted`, `border-border`).
  - Base spacing scale is derived from `--spacing: 0.25rem` (4px).

---

## 2. React Router v7 (`react-router-dom`)

- **Configuration:** Centralized in `src/app/router.tsx` using `createBrowserRouter`.
- **Layout Nesting:** The root `/` route wraps all protected screens within `<ProtectedRoute><AppLayout /></ProtectedRoute>`.
- **Navigation:**
  ```tsx
  import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
  ```

---

## 3. Redux Toolkit & RTK Query

- **Store:** Centralized in `src/app/store.ts` wrapped with `redux-persist` for localStorage auth persistence under `STORAGE_KEYS.PERSIST_ROOT`.
- **Typed Hooks:** Always use typed hooks from `src/hooks/`:
  ```tsx
  import { useAppDispatch } from '@/hooks/useAppDispatch';
  import { useAppSelector } from '@/hooks/useAppSelector';
  ```
- **RTK Query Endpoints:** Base API in `src/api/backendApi.ts` configured with `baseQuery` from `src/api/baseQuery.ts`.

---

## 4. Socket.io Client (`socket.io-client`)

- **Singleton Client:** Authenticated via JWT bearer token in the handshake header:
  ```typescript
  import { io } from 'socket.io-client';
  import { API_BASE_URL } from '@/api/baseQuery';
  import { STORAGE_KEYS } from '@/Constants';

  export const socket = io(API_BASE_URL.replace('/api', ''), {
    auth: {
      token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
    },
    autoConnect: false,
    transports: ['websocket'],
  });
  ```

### 4.1 Support Desk Event Contracts (`Cusomer Support - Chat Documentation.pdf`)

```typescript
// 1. List active support tickets
socket.emit('support:threads:list', { limit: 20, offset: 0 }, (response) => {
  // response: { ok: true, data: { count: number, rows: SupportThread[] } }
});

// 2. Join a ticket room & claim assignment
socket.emit('support:thread:join', { threadId: 12 }, (response) => {
  // response: { ok: true }
});

// 3. Leave a ticket room
socket.emit('support:thread:leave', { threadId: 12 }, (response) => {
  // response: { ok: true }
});

// 4. Send message to athlete
socket.emit('support:message:send', {
  threadId: 12,
  message: "Hello! We are looking into your club subscription inquiry.",
}, (response) => {
  // response: { ok: true, data: SupportMessage }
});

// 5. Paginate message history
socket.emit('support:messages:list', { threadId: 12, limit: 20, offset: 0 }, (response) => {
  // response: { ok: true, data: { count: number, rows: SupportMessage[] } }
});

// 6. Mark thread messages as read
socket.emit('support:thread:read', { threadId: 12 }, (response) => {
  // response: { ok: true }
});

// 7. Incoming message listener
socket.on('support:message:new', ({ threadId, message }) => {
  // Append new message to active thread
});

// 8. Read receipt listener
socket.on('support:thread:read', ({ threadId, readerId, role }) => {
  // Update message read status
});
```

---

## 5. Recharts (`recharts`)

- **Usage:** Executive revenue area charts, athlete growth trends, and activity distribution.
- **Rules:**
  - Wrap charts in `<ResponsiveContainer width="100%" height={320}>`.
  - Tooltips must be styled to match the dark/light `@theme`:
    ```tsx
    <Tooltip
      contentStyle={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderRadius: '1rem',
        color: 'var(--color-text-main)',
      }}
    />
    ```

---

## 6. Radix UI Primitives (`@radix-ui/react-*`)

- Unstyled accessible UI primitives used for dropdowns, dialogs, tabs, and popovers:
  - `@radix-ui/react-dialog` → `ConfirmModal`
  - `@radix-ui/react-dropdown-menu` → `ActionMenu`
  - `@radix-ui/react-tabs` → `DetailTabs` / `ClubDetailTabs`

---

## 7. GSAP 3 (`@gsap/react`) & Framer Motion

- **GSAP:** Use for smooth layout transitions, tab switching, and entering lists:
  ```tsx
  import { useGSAP } from '@gsap/react';
  import gsap from 'gsap';
  ```
- **Framer Motion:** Use for declarative layout animations and modals.

---

## 8. Sonner Toast Notifications

- **Usage:**
  ```tsx
  import { toast } from 'sonner';

  toast.success('Club verified successfully');
  toast.error('Failed to suspend athlete');
  ```
