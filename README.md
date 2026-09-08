# Trusta — Digital Financial Dashboard

> House of Practice — Round One | Track: Front-End Development

---

## What is Trusta?

Trusta is a fictional digital financial platform frontend built as a single-page application. It lets a user log in, view their account balance, browse transaction history, and send money — with complete coverage of every meaningful UI state a real financial product must handle.

**Live demo credentials:**
```
Email:    demo@trusta.io
Password: password123
```

<p align="center">
  <img src="./Screenshots/Dashboard%20Screen.png" alt="Trusta Dashboard Dark Theme" width="49%" />
  <img src="./Screenshots/Dashboard-White%20Theme.png" alt="Trusta Dashboard Light Theme" width="49%" />
</p>

---

## Project Structure

```
src/
├── slices/               # Feature slices — state + business logic
│   ├── auth/             # Login, logout, session expiry
│   ├── account/          # Balance, transaction list, transaction detail
│   └── transfer/         # Send-money form, validation, execution
├── services/
│   └── MockService.ts    # Simulated async network layer
├── shell/
│   ├── AppRouter.tsx     # Route definitions + auth guard
│   └── AppLayout.tsx     # Shared nav (desktop top bar + mobile bottom tab)
├── screens/              # One file per screen, pure rendering
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── TransactionHistoryScreen.tsx
│   ├── TransactionDetailScreen.tsx
│   ├── SendMoneyScreen.tsx
│   ├── ConfirmationScreen.tsx
│   ├── SuccessScreen.tsx
│   └── FailureScreen.tsx
├── components/           # Shared UI primitives
│   ├── Button, Input, Card, Badge
│   ├── Avatar, Spinner, SkeletonLoader
│   ├── EmptyState, ErrorBanner, TransactionRow
└── utils/
    └── format.ts         # Currency, date, initials formatters
```

---

## Getting Started

```bash
npm install
npm run dev
npm run test
```

Open [http://localhost:5173](http://localhost:5173).

---

## Screens & States Covered

| Screen | Route | Visual Preview |
|--------|-------|:---:|
| Login | `/login` | [Preview](./Screenshots/Login%20screen.png) |
| Dashboard | `/dashboard` | [Dark](./Screenshots/Dashboard%20Screen.png) / [Light](./Screenshots/Dashboard-White%20Theme.png) |
| Transaction History | `/transactions` | [Preview](./Screenshots/Transcations%20Sreen.png) |
| Transaction Detail | `/transactions/:id` | [Preview](./Screenshots/Transaction-deatil%20screen.png) |
| Send Money | `/send` | [Preview](./Screenshots/Send-screen.png) |
| Confirmation | `/send/confirm` | [Preview](./Screenshots/confirm%20screen.png) |
| Success | `/send/success` | [Preview](./Screenshots/sucess%20screen.png) |
| Failure | `/send/failure` | [Preview](./Screenshots/send%20error%20screen.png) |

| State | Where |
|-------|-------|
| Loading | Skeleton loaders on all data screens; spinner on login button |
| Empty | Transaction history with zero records |
| Network failure | 15% random chance on any simulated request; dedicated failure screen with retry |
| Insufficient funds | Inline error on amount field before user reaches confirmation |
| Invalid input | Per-field inline validation on login and send forms |
| Expired session | Amber banner on login screen after session timeout redirect |
| Processing | Full-screen non-dismissible overlay during transfer execution |
| Success | Dedicated screen with receipt + updated balance |
| Failure | Dedicated screen with error reason + "Your money is safe" reassurance |

---

## Screenshots & UI Gallery

### 1. Authentication & Overview
| Login Screen | Dashboard (Dark Theme) |
| :---: | :---: |
| <img src="./Screenshots/Login%20screen.png" alt="Login Screen" width="100%" /> | <img src="./Screenshots/Dashboard%20Screen.png" alt="Dashboard Dark Theme" width="100%" /> |

| Dashboard (Light Theme) | Transaction History |
| :---: | :---: |
| <img src="./Screenshots/Dashboard-White%20Theme.png" alt="Dashboard Light Theme" width="100%" /> | <img src="./Screenshots/Transcations%20Sreen.png" alt="Transaction History" width="100%" /> |

---

### 2. Transaction Details & The Send Money Journey
The send money flow guides the user through progressive disclosure, stateful non-dismissible processing, and explicit feedback:

| 1. Send Money Form | 2. Transfer Confirmation |
| :---: | :---: |
| <img src="./Screenshots/Send-screen.png" alt="Send Money Form" width="100%" /> | <img src="./Screenshots/confirm%20screen.png" alt="Confirmation Screen" width="100%" /> |

| 3. In-Flight Processing (Non-Dismissible) | 4. Transaction Detail View |
| :---: | :---: |
| <img src="./Screenshots/processing%20screen.png" alt="Processing State" width="100%" /> | <img src="./Screenshots/Transaction-deatil%20screen.png" alt="Transaction Detail" width="100%" /> |

| 5A. Success State & Receipt | 5B. Recoverable Failure State |
| :---: | :---: |
| <img src="./Screenshots/sucess%20screen.png" alt="Transfer Success" width="100%" /> | <img src="./Screenshots/send%20error%20screen.png" alt="Transfer Error" width="100%" /> |

---

### 3. Responsive Mobile Views (375px Viewport)

| Mobile Dashboard | Mobile Transactions | Mobile Detail |
| :---: | :---: | :---: |
| <img src="./Screenshots/Mobile%20Dashboard.png" width="100%" alt="Mobile Dashboard" /> | <img src="./Screenshots/Mobile-Transaction%20screen.png" width="100%" alt="Mobile Transactions" /> | <img src="./Screenshots/Mobile-transaction%20detail%20Screen.png" width="100%" alt="Mobile Transaction Detail" /> |

| Mobile Send Form | Mobile Confirmation | Mobile Success State | Mobile Error State |
| :---: | :---: | :---: | :---: |
| <img src="./Screenshots/Mobile%20send%20screen.png" width="100%" alt="Mobile Send Form" /> | <img src="./Screenshots/mobile%20confirm%20screen.png" width="100%" alt="Mobile Confirm" /> | <img src="./Screenshots/mobile%20success%20screen.png" width="100%" alt="Mobile Success" /> | <img src="./Screenshots/mobile%20send%20error%20state.png" width="100%" alt="Mobile Send Error State" /> |

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State | React Context + useReducer (per feature slice) |
| Mock data | In-memory TypeScript module |
| Fonts | Inter (UI) + JetBrains Mono (reference numbers) |

No external UI component library was used — all components are hand-written.

---

## Architecture: Feature Slices

The app is structured around **three independent feature slices**, each owning its own state and exposing a typed context hook:

- **AuthSlice** — user identity, session expiry, login errors
- **AccountSlice** — balance, transaction list, selected transaction
- **TransferSlice** — send form, validation, transfer execution

This pattern was chosen over a single global store because:

1. **No god object.** The largest slice owns ~28% of total app state. A single store would own 100%.
2. **Zero sync cycles.** Cross-slice side effects (balance update after a transfer) go through a single well-defined action call: `AccountSlice.commitTransfer()`.
3. **Isolation.** Adding a new feature (e.g. bill payments) means adding a new slice, not modifying existing ones.

The full architecture analysis is in `docs/architecture_selection.md`.

---

## Key Design Decisions

### 1. Progressive disclosure through the send flow
The send money journey is split into discrete screens: **Form → Confirmation → Processing → Success/Failure**. Each screen makes exactly one decision: "is this the right amount?", "is this the right recipient?", "is this transfer confirmed?". This matches how trust is established in financial products — never ask the user to commit everything on one screen.

### 2. Insufficient funds is a form error, not a failure screen
Catching balance overruns at the form level (before confirmation) means the user never reaches a processing state for a transfer they can't afford. The failure screen is reserved for genuinely unexpected outcomes, which preserves its signal value.

### 3. Processing is non-dismissible
While a transfer is in flight, a full-screen overlay blocks all interaction. This prevents double-submission and clearly communicates "the system is working — please wait." It mirrors the behaviour of real banking apps.

### 4. Failure screens name the cause
Network failures and processing failures get different messages and different recovery actions. A network error is recoverable (retry); a generic failure is less certain (dashboard). Users should never be left wondering why something failed.

### 5. Simulated randomness (15% failure rate)
The mock service has a configurable 15% network failure rate and random delays (800ms–2500ms). This means loading and error states are naturally reachable during normal demo use, not just edge cases you have to force.

### 6. How the interface keeps users informed about their money

- **Balance is always visible** — shown on the dashboard, in the nav, and on the send form.
- **Typed status badges** — every transaction is tagged completed / pending / failed with distinct colours.
- **Optimistic prevention** — insufficient funds is blocked before confirmation, not after.
- **Explicit failure recovery** — every error state includes a clear explanation and a labelled next action.
- **Non-dismissible processing** — while money is in transit, the interface says so and prevents interference.
- **Session expiry is surfaced** — if the session expires, the user is redirected to login with a visible amber banner.

---

## Project Reflection & Engineering Retrospective

### What did you attempt to solve?
I set out to build **Trusta**, a production-grade digital banking SPA that models the critical trust-building UX of modern financial apps. Beyond core features (authentication, live balance monitoring, transaction history/details, and money transfer), the challenge was handling every meaningful state—including skeleton loading, inline validation, non-dismissible processing, and network failures—without sacrificing clarity or user reassurance.

### How did you approach it?
I implemented a **Feature-Sliced architecture** separating business logic into three domain slices (`AuthSlice`, `AccountSlice`, and `TransferSlice`) using React Context and `useReducer`. Screen components remain pure presentation views. The UI was built with custom Tailwind CSS primitives (without third-party UI component libraries), backed by a simulated asynchronous service featuring realistic latency (800–2000ms) and configurable failure rates, fully validated with a 26-test Vitest suite.

### Why did you make the major decisions you made?
- **Feature Slices over Global Store:** Avoids monolithic "god objects" and cascading re-renders. The only cross-slice interaction is an explicit, one-way action (`AccountSlice.commitTransfer`) upon transfer success.
- **Progressive Send Journey:** Separating the flow into **Form → Confirmation → Non-Dismissible Processing → Receipt/Error** matches banking security standards, prevents accidental double-charges, and builds confidence.
- **Form-Level Overdraft Prevention:** Catching balance overruns directly on the input form prevents users from reaching confirmation for transactions they cannot afford, reserving the failure screen for true external faults.
- **Ghanaian Cedi (`₵`) & Dual-Theme:** Tailored custom typography and design tokens to Ghanaian Cedi formatting with persistent dark/light theme switching.

### What did you discover?
- Simulating a 15% failure rate and realistic latency revealed how crucial reassurance is in fintech UX: users need to know immediately that their money is safe when a network error strikes.
- Splitting state into feature slices felt slightly heavy at first, but paid off immediately: `TransferSlice` needed to update `AccountSlice` after success, and having a clean `commitTransfer()` action made that dependency explicit rather than implicit.
- During testing, multi-step reducer workflows required clean lifecycle boundaries between form validation and execution commits.

### What was difficult?
1. **Asynchronous State Synchronization:** Coordinating the non-dismissible full-screen overlay with redirect navigation so neither double-submits nor screen flickers occurred during simulated latency.
2. **Scaffolding Recovery:** Overcoming Vite's directory overwrite during initial initialization by reconstructing the lost architectural documentation directly from deep session history.

### What would you improve?
- **Local Persistence:** Back the mock service with `localStorage` or IndexedDB so balances and newly added transfers survive page refreshes.
- **Live Inactivity Timer:** Replace the mock session flag with a sliding background timer that logs users out after inactivity.
- **History Virtualization & Filtering:** Introduce virtualized list scrolling, date range filters, and search for high-volume transaction accounts.
- **E2E Testing:** Complement the 26 unit tests with Playwright browser flows to assert visual transitions across network throttles.

---

## Submission Details

- **Full Name:** Richard Nuhu
- **Track:** Front-End Development
- **Project Title:** Trusta — Digital Financial Dashboard
- **Project Link:** 
    - Github Repository: https://github.com/QweciKuranchie/Trusta.git
    - Live Demo: https://trusta-ten.vercel.app
