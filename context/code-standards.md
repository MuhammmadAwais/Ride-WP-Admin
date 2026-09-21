# Code Standards: Ride With Pals Admin Control Center

Engineering rules and conventions for **Ride With Pals — Admin Control Center**. All AI agents and developers must adhere to these standards to prevent code drift and ensure production robustness.

---

## 1. Engineering Principles

- **Think Before Coding:** Review `context/architecture.md` and `context/ui-rules.md` before implementing any feature.
- **Vite SPA Conventions:** This is a **React 19 + Vite 8** Single Page Application. Do not use Next.js constructs (`"use client"`, Server Components, or `next/navigation`).
- **Scope Discipline:** Only touch files and logic directly related to the active sprint. Do not rewrite working modules outside the task boundary.
- **Fail Gracefully:** Wrap asynchronous operations, network requests, and socket event emissions in robust error handlers. Never leave promises unhandled.

---

## 2. TypeScript Strictness

- **No `any`:** Under no circumstances should `any` be used. Use `unknown` and narrow types using type guards or Zod schemas.
- **Explicit Typings:** All function parameters, return types, component props, and API response envelopes must have explicit TypeScript contracts.
- **Discriminated Unions:** Model multi-state entities (e.g. membership statuses, subscription intervals, ticket statuses) using strict discriminated unions.
- **Zod Schemas for Validation:** All user inputs (login forms, plan creation modals, push notification broadcasts, CMS editors) must be validated with Zod schemas before API dispatch.

---

## 3. React 19 & Component Architecture

- **Component Isolation:** Feature-specific components must reside in their respective feature directory (`src/features/<feature>/components/`).
- **Shared Reusable UI:** Truly generic components (tables, badges, modal dialogs, buttons) reside in `src/Components/ui/`.
- **Custom Hook Encapsulation:** Extract complex component state, debounce timers, or socket subscriptions into dedicated hooks (`useDebounce`, `useTheme`, `useSupportSocket`).
- **Form Architecture:** Standardize on `react-hook-form` coupled with `@hookform/resolvers/zod`.

---

## 4. Redux Toolkit & RTK Query Patterns

- **Cache Tag Invalidation:** Define clear tag types (`'Users'`, `'Clubs'`, `'Subscriptions'`, `'Notifications'`, `'Content'`) so mutations instantly synchronize list and detail views without full-page reloads.
- **Universal Envelope Handling:** All backend endpoints return:
  ```typescript
  export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    response: T;
  }
  ```
  RTK Query endpoints and Axios calls must unwrap `.response` so components consume the clean payload directly.
- **Error Feedback:** Pipe API error messages through `sonner` toasts (`toast.error(error.message)`).

---

## 5. Realtime Socket.io Hygiene

When managing live support threads or chat mediation:
1. **Join on Mount, Leave on Unmount:**
   ```typescript
   useEffect(() => {
     if (!socket || !threadId) return;
     socket.emit('support:thread:join', { threadId });

     return () => {
       socket.emit('support:thread:leave', { threadId });
     };
   }, [socket, threadId]);
   ```
2. **Listener Hygiene:** Always deregister listeners in the `useEffect` cleanup return function:
   ```typescript
   useEffect(() => {
     if (!socket) return;
     const handleNewMessage = (payload: NewMessagePayload) => {
       // update local messages
     };
     socket.on('support:message:new', handleNewMessage);

     return () => {
       socket.off('support:message:new', handleNewMessage);
     };
   }, [socket]);
   ```
3. **No Duplicate Sockets:** Use the shared singleton socket client in `src/lib/socket.ts`.

---

## 6. Destructive Actions Invariant

- Irreversible operations (suspending an athlete, disbanding a club, archiving a subscription tier, taking down a marketplace listing) must **never** execute on a single click.
- Always trigger a `ConfirmModal` requiring explicit user confirmation.
