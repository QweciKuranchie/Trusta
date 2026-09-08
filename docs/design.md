# Design: Trusta Financial Dashboard

> Architecture basis: Use-Case / Feature Slices (see architecture_selection.md)

---

## 1. Technology Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Framework | React 18 + TypeScript | Specified by requirements |
| Build tool | Vite | Fast HMR, minimal config |
| Styling | Tailwind CSS v3 | Specified; utility-first fits rapid UI work |
| Routing | React Router v6 | Specified |
| State | React Context + useReducer | Sufficient for 3 slices; no external store needed |
| Mock data | In-memory TypeScript module | No backend required (NFR-1) |
| Testing | None (not required) | Out of scope per spec |

---

## 2. Architecture

The app is divided into **Feature Slices**, a **Mock Service**, a **UI Shell**, and **Screen Components**.

```
┌─────────────────────────────────────────────────────────┐
│                        UI Shell                         │
│  AppRouter  ·  AppLayout  ·  GlobalOverlay              │
├──────────────┬──────────────┬──────────────────────────┤
│  AuthSlice   │ AccountSlice │     TransferSlice         │
│  Context     │  Context     │      Context              │
├──────────────┴──────────────┴──────────────────────────┤
│                    MockService                          │
│        simulateAuth()  ·  simulateTransfer()            │
├─────────────────────────────────────────────────────────┤
│              Screen Components (pure render)            │
│  Login · Dashboard · History · Detail · Send ·          │
│  Confirm · Success · Failure                            │
└─────────────────────────────────────────────────────────┘
```

### Slice contracts

Each slice exposes:
- A `Context` with typed state
- A `Provider` component that wraps children
- A `useXxx()` hook for consumers

Slices never import each other's hooks directly. Cross-slice side effects go through well-typed action calls exposed on the slice's context object.

---

## 3. Data Models

```typescript
// Auth
interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  loginError: string | null;
  isLoading: boolean;
}

// Account
interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  counterparty: string;
  amount: number;          // always positive; type determines sign
  date: string;            // ISO 8601
  status: 'completed' | 'pending' | 'failed';
  note?: string;
}

interface AccountState {
  balance: number;
  transactions: Transaction[];
  selectedTransactionId: string | null;
  isLoading: boolean;
}

// Transfer
type TransferStatus = 'idle' | 'validating' | 'processing' | 'success' | 'failure' | 'network_error';

interface SendFormValues {
  recipient: string;
  amount: string;          // string during input; parsed to number on submit
  note: string;
}

interface SendFormErrors {
  recipient?: string;
  amount?: string;
}

interface TransferState {
  form: SendFormValues;
  errors: SendFormErrors;
  status: TransferStatus;
  confirmedTransfer: { recipient: string; amount: number; note: string } | null;
  resultTransaction: Transaction | null;
}
```

---

## 4. Mock Service

```typescript
// services/MockService.ts

const NETWORK_FAILURE_RATE = 0.15; // 15% chance of simulated failure

async function simulateAuth(
  email: string,
  password: string
): Promise<{ user: User } | { error: string }>

async function simulateTransfer(
  amount: number,
  recipient: string,
  note: string
): Promise<{ transaction: Transaction } | { error: 'network' | 'insufficient_funds' | 'unknown' }>
```

Delays are randomised between 800ms–2000ms to make loading states visible and realistic.

**Seeded accounts:**
| Email | Password | Starting Balance |
|-------|----------|-----------------|
| `demo@trusta.io` | `password123` | ₵ 12,450.00 |

**Seeded transactions:** 8 pre-loaded transactions (mix of debits and credits) so the history screen is not empty on first load.

---

## 5. Routing

```
/                      → redirect to /login (or /dashboard if authenticated)
/login                 → LoginScreen
/dashboard             → DashboardScreen             [auth-guarded]
/transactions          → TransactionHistoryScreen    [auth-guarded]
/transactions/:id      → TransactionDetailScreen     [auth-guarded]
/send                  → SendMoneyScreen             [auth-guarded]
/send/confirm          → ConfirmationScreen          [auth-guarded]
/send/processing       → (inline state, not a route)
/send/success          → SuccessScreen              [auth-guarded]
/send/failure          → FailureScreen              [auth-guarded]
```

The **auth guard** lives in `AppRouter`. It reads `isAuthenticated` from `AuthSlice`. If false, it redirects to `/login` and sets `sessionExpired = true` if a prior session token existed.

---

## 6. Screen Designs

### 6.1 LoginScreen
- Email + password inputs with inline validation
- Submit button disabled until fields are non-empty
- Loads → shows spinner on button
- Error state → red inline message below password
- Expired session banner → amber banner above the form
- Credentials: hint text showing demo credentials

### 6.2 DashboardScreen
- Header: user name, avatar initials, logout button
- Balance card: large balance display, account number (masked)
- Quick actions: "Send Money" CTA
- Recent transactions: last 5, each showing counterparty, amount (colored), date
- "View all" link to /transactions
- Loading: skeleton cards

### 6.3 TransactionHistoryScreen
- Full list in reverse-chronological order
- Each row: counterparty, amount with +/− sign and color, date, status badge
- Status badge: completed (green), pending (amber), failed (red)
- Empty state: illustration + "No transactions yet" message
- Tap/click row → navigate to /transactions/:id

### 6.4 TransactionDetailScreen
- Back button → /transactions
- Transaction ID (monospace)
- Counterparty name
- Amount (large, colored)
- Date & time
- Status badge
- Note (if present)
- Reference number

### 6.5 SendMoneyScreen
- Recipient input (text)
- Amount input (numeric, with currency prefix)
- Note input (optional, textarea)
- Available balance shown below amount
- Inline errors on blur/submit: required, non-numeric, ≤ 0, > balance
- "Continue" → /send/confirm (only when valid)

### 6.6 ConfirmationScreen
- Summary card: recipient, amount, note, fee (₵0.00 — mock)
- "Confirm & Send" → triggers transfer
- "Edit" → back to /send (form preserved)

### 6.7 Processing (overlay)
- Full-screen semi-opaque overlay
- Animated spinner + "Processing your transfer…" text
- Cannot be dismissed

### 6.8 SuccessScreen
- Green checkmark icon
- "Transfer successful" heading
- Amount + recipient
- "Go to Dashboard" button
- "Send another" button

### 6.9 FailureScreen
- Red X icon
- "Transfer failed" heading
- Error reason (network error or generic)
- "Try again" button → back to /send/confirm
- "Go to Dashboard" button

---

## 7. State Coverage Map

| State | Where Triggered | Visual Treatment |
|-------|----------------|-----------------|
| Loading | Any async operation starts | Skeleton loaders on data screens; spinner on button for login; full overlay for transfer |
| Empty | `transactions.length === 0` | Centered illustration + copy on history screen |
| Network failure | MockService returns `error: 'network'` | Red banner on failure screen + retry; or inline on login |
| Insufficient funds | `amount > balance` on form submit | Inline red error on amount field |
| Invalid input | Field fails validation | Inline red error per field on blur and submit |
| Expired session | Auth guard fires with prior session | Amber banner on login screen |
| Processing | Transfer in flight | Full-screen overlay, non-dismissible |
| Success | MockService returns transaction | SuccessScreen with balance/history updated |
| Failure | MockService returns error (non-network) | FailureScreen with retry |

---

## 8. Responsive Strategy

- **Mobile-first** Tailwind: base styles = mobile, `md:` and `lg:` overrides for desktop.
- **Breakpoints used:** `sm` (640px), `md` (768px), `lg` (1024px).
- Navigation: bottom tab bar on mobile; top nav bar + sidebar on desktop.
- Cards: full-width on mobile, max-width container centered on desktop.
- Transaction rows: condensed on mobile (2 lines), expanded on desktop (single row with all columns).

---

## 9. Component Primitives

| Component | Props |
|-----------|-------|
| `Button` | variant (primary/secondary/ghost/danger), size, loading, disabled |
| `Input` | label, error, type, helpText |
| `Card` | padding variant |
| `Badge` | variant (success/warning/error/neutral) |
| `Spinner` | size |
| `SkeletonLine` | width, height |
| `EmptyState` | icon, title, description, action |
| `ErrorBanner` | message, variant (error/warning/info), onDismiss |
| `Avatar` | initials, size |
| `TransactionRow` | transaction, onClick |

---

## 10. Key UX Decisions & Answers to Brief

### "How does your interface keep the user informed about what is happening to their money?"

1. **Persistent balance visibility** — the balance is shown on the Dashboard header and again on the Send form, so the user always knows their headroom before and after sending.
2. **Progressive disclosure through the send flow** — the form, confirmation, processing, and result screens are separate states, not a single modal. Each step makes the user's action explicit before committing it.
3. **Typed status badges** — every transaction carries a status (completed / pending / failed) with distinct color coding so the user can scan for anomalies at a glance.
4. **Optimistic prevention, not optimistic updates** — insufficient funds is caught at the form level, not after confirmation. The user never reaches a confirmation screen for a transfer they cannot afford.
5. **Explicit failure recovery** — failure screens name the cause (network vs. generic) and provide targeted actions: retry for recoverable failures, home for non-recoverable.
6. **Processing is non-dismissible** — while a transfer is in flight, the overlay blocks all interaction. This prevents double-submits and communicates clearly that the system is working.
7. **Session expiry is surfaced, not silent** — if the user's session expires, the next navigation attempt lands them on login with an amber "Your session has expired. Please log in again." banner.
