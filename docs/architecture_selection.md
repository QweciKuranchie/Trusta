# Architecture Selection: Trusta Financial Dashboard

## Recommended Architecture: Use-Case / Feature Slices 

### Rationale
Feature slices score best across the metrics that matter most for a maintainable, readable codebase: lowest cross-cutting requirement percentage (20%), zero synchronous cycles, no god object (max 28% state ownership per component), and strong evolvability (average 1.2 components change per new requirement). The one accepted trade-off is an explicit one-directional coupling from `TransferSlice` to `AccountSlice` on transfer completion — this is a direct reflection of the real-world invariant that a successful transfer always modifies account state, and it is better to make it visible than to hide it behind indirection.

---

### Components

| Component | Owned State | Responsibility |
|-----------|-------------|----------------|
| `AuthSlice` | `currentUser`, `authToken`, `sessionExpired`, `loginError` | All authentication logic: login, logout, session expiry, credential validation |
| `AccountSlice` | `balance`, `transactions`, `selectedTransaction` | Account data reads: current balance, transaction list, selected transaction detail |
| `TransferSlice` | `sendForm`, `sendFormErrors`, `pendingTransfer`, `transferResult` | Send-money form state, field validation, transfer execution, result handling |
| `MockService` | `networkFailureRate` (config) | Simulates async network layer; injects configurable failure scenarios; shared by AuthSlice and TransferSlice |
| `UIShell` | `isLoading`, `networkError`, `route` | Routing, auth-guard navigation, global loading overlay, network error banner |
| `Screen Components` | None (pure rendering) | Compose slice state and dispatch events; no business logic; all layout and visual states live here |

---

### Information Flow

| From \ To | AuthSlice | AccountSlice | TransferSlice | MockService | UIShell | Screens |
|-----------|-----------|--------------|---------------|-------------|---------|---------|
| **Screens** | login/logout events | selectTransaction | form changes, submit, confirm, retry | — | — | — |
| **AuthSlice** | — | — | — | → auth call | session state signal | — |
| **AccountSlice** | — | — | — | — | — | balance, tx list |
| **TransferSlice** | — | → on success: update balance + append tx | — | → transfer call | loading/error signals | — |
| **MockService** | ← auth response | — | ← transfer response | — | — | — |
| **UIShell** | ← reads auth for guard | — | — | — | — | route, loading, error props |

Legend: `→` calls/writes to, `←` returns/reads from

---

### Requirement Allocation

| Requirement | Component(s) |
|-------------|--------------|
| REQ-1.1 Login form | Screens + AuthSlice |
| REQ-1.2 Invalid credentials error | AuthSlice |
| REQ-1.3 Expired session redirect | UIShell + AuthSlice |
| REQ-1.4 Logout | AuthSlice + UIShell |
| REQ-2.1 Dashboard balance | AccountSlice + Screens |
| REQ-2.2 Recent transactions summary | AccountSlice + Screens |
| REQ-2.3 Dashboard navigation | UIShell + Screens |
| REQ-2.4 Live balance post-send | AccountSlice (updated by TransferSlice) |
| REQ-3.1–3.3 Transaction History list + empty state | AccountSlice + Screens |
| REQ-3.4 Navigate to detail | AccountSlice + UIShell |
| REQ-4.1–4.2 Transaction Details | AccountSlice + Screens |
| REQ-5.1–5.4 Send form + validation | TransferSlice + Screens |
| REQ-5.5 Confirmation screen | TransferSlice + Screens |
| REQ-5.6 Processing state | TransferSlice + UIShell |
| REQ-5.7 Success + state update | TransferSlice → AccountSlice + Screens |
| REQ-5.8 Failure + retry | TransferSlice + Screens |
| REQ-5.9 Insufficient funds inline error | TransferSlice (INV-1 enforcement) |
| REQ-6.1 Loading | UIShell + per-slice signals |
| REQ-6.2 Empty state | Screens (driven by AccountSlice) |
| REQ-6.3 Network failure + retry | UIShell + MockService |
| REQ-6.4 Invalid input | TransferSlice + AuthSlice + Screens |
| REQ-6.5 Expired session banner | UIShell + AuthSlice |
| REQ-6.6 Processing overlay | UIShell + TransferSlice |
| REQ-6.7 Success screen | TransferSlice + Screens |
| REQ-6.8 Failure screen | TransferSlice + Screens |
| REQ-7.1–7.2 Responsive layout | Screens (Tailwind breakpoints) |

---

### Key Design-Induced Invariants

These invariants arise from the slice partitioning, not from requirements directly:

1. **Slice isolation rule:** Slices do not import each other's React state directly. TransferSlice updates AccountSlice by calling a well-defined `AccountSlice.commitTransfer(amount, transaction)` action — not by writing to AccountSlice's state store directly.
2. **MockService is stateless across calls:** Each call to MockService is independent; no call carries over state from a previous call. This prevents subtle test-order dependencies.
3. **UIShell is the only component that reads `authToken` for routing decisions.** Slices expose a derived `isAuthenticated` boolean; they do not expose the raw token to screens.
4. **TransferSlice clears `pendingTransfer` on both success and failure**, ensuring the Processing state cannot persist across navigation.
5. **AccountSlice is append-only for transactions** — it never mutates existing records, only prepends new ones.

---

### Alternatives Considered

| Candidate | Strength | Weakness | Why Not Selected |
|-----------|----------|----------|-----------------|
| **A — Layer-Oriented** | Clean API boundary; easy to swap MockService for real API | AppStore owns 55% of state (god object); soft notification cycle between AppStore and UIStateManager | God object score exceeds 50% threshold; cycle adds reasoning complexity |
| **C — Event-Driven** | Zero direct coupling; best evolvability for large teams; easy to add logging/analytics listeners | ViewLayer owns ~48% of UI state (borderline); EventBus fan-in of 5 creates debugging overhead; over-engineered for a frontend-only submission | Readability cost outweighs the scalability benefit at this project scope |

---

### Metrics Summary

| Metric | Selected (B) | Alt A (Layer) | Alt C (Event-Driven) |
|--------|-------------|---------------|----------------------|
| Cross-cutting reqs % | **20%** | 40% | 40% |
| Cross-cutting invariants % | **13%** | 25% | 25% |
| Flow density | 0.35 | 0.50 | **0.33** |
| God object score | **28%** | 🔴 55% | 🟡 48% |
| Sync cycles | **0** | 1 (soft) | potential |
| Max fan-in | 2 (MockService) | 3 (AppStore) | 5 (EventBus) |
| Max fan-out | 4 (UIShell) | 4 (UIStateManager) | 5 (EventBus) |
| Evolvability cost (avg) | **1.2** | 2.0 | **0.8** |

---

### File & Folder Layout (Derived from Architecture)

```
src/
├── slices/
│   ├── auth/
│   │   ├── AuthContext.tsx       # AuthSlice state + actions
│   │   └── types.ts
│   ├── account/
│   │   ├── AccountContext.tsx    # AccountSlice state + actions
│   │   └── types.ts
│   └── transfer/
│       ├── TransferContext.tsx   # TransferSlice state + actions
│       └── types.ts
├── services/
│   └── MockService.ts            # Simulated network layer
├── shell/
│   ├── AppRouter.tsx             # UIShell: routes + auth guard
│   ├── AppLayout.tsx             # Shared nav/header wrapper
│   └── GlobalOverlay.tsx         # Loading + network error overlays
├── screens/
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── TransactionHistoryScreen.tsx
│   ├── TransactionDetailScreen.tsx
│   ├── SendMoneyScreen.tsx
│   ├── ConfirmationScreen.tsx
│   ├── SuccessScreen.tsx
│   └── FailureScreen.tsx
├── components/
│   └── (shared UI primitives: Button, Input, Card, Badge, etc.)
└── main.tsx
```
