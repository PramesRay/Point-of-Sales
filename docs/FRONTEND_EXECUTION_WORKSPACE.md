# FRONTEND_EXECUTION_WORKSPACE.md
## NURCHS POS — Frontend Transformation Execution Cockpit

> **Version:** 2.0 | **Generated:** 2026-06-06
> **Authority Chain:** PROJECT_MASTER_CONTEXT → PROJECT_CONSTITUTION → PROJECT_TRANSFORMATION_BLUEPRINT → BUSINESS_EVOLUTION_ASSESSMENT → FRONTEND_EXPERIENCE_ASSESSMENT → FRONTEND_TRANSFORMATION_ROADMAP → FRONTEND_EXECUTION_ENGINE → **this document**
>
> **Purpose:** The day-to-day operational cockpit for AI agents executing frontend transformation. This document bridges roadmap intent and daily execution. It is not a rulebook — the Engine is. It is the instrument panel: status, priorities, decisions, and guardrails in one scannable reference.
>
> **Primary audience:** AI execution agents, engineers beginning a transformation session, technical leads orienting to current status.
>
> **How to use:** In any session — read Section 15 first (AI Agent Operating Instructions). Then navigate to the relevant Command Center (Sections 7–11) for your domain. Validate all output against Section 13.


---

## Table of Contents

1. [Executive Transformation Overview](#1-executive-transformation-overview)
2. [Current State Snapshot](#2-current-state-snapshot)
3. [Transformation North Star](#3-transformation-north-star)
4. [Active Transformation Priorities](#4-active-transformation-priorities)
5. [Execution Decision Model](#5-execution-decision-model)
6. [Transformation Guardrails](#6-transformation-guardrails)
7. [Content Transformation Command Center](#7-content-transformation-command-center)
8. [Experience Transformation Command Center](#8-experience-transformation-command-center)
9. [Design Evolution Command Center](#9-design-evolution-command-center)
10. [Admin Experience Command Center](#10-admin-experience-command-center)
11. [Future SaaS Enablement Command Center](#11-future-saas-enablement-command-center)
12. [AI Execution Playbook](#12-ai-execution-playbook)
13. [Execution Validation Framework](#13-execution-validation-framework)
14. [Execution Anti-Patterns](#14-execution-anti-patterns)
15. [AI Agent Operating Instructions](#15-ai-agent-operating-instructions)
16. [Frontend Execution Quick Reference](#16-frontend-execution-quick-reference)

---

## 1. Executive Transformation Overview

### Project Mission
> Replace fragmented, paper-based restaurant operations with a unified digital platform that enforces business rules, maintains a complete audit trail, and delivers real-time financial intelligence — so every staff member performs their role with clarity and confidence while management has complete operational visibility across all branches.

### Frontend Mission
> Give each of five staff roles a purpose-built digital workspace — optimized for their device, their operational pressure, and their specific function — so that every interaction accelerates service rather than creating friction.

### Transformation Mission
> Evolve the frontend from a functionally correct but poll-driven, hardcoded internal tool into a real-time, proactive, CMS-ready operational platform — without disrupting the live restaurant operations it supports at every stage of the journey.

### The One Thing That Cannot Change
> **The shift is the operational unit.** Every order, payment, stock movement, and financial record is anchored to a time-bounded shift. This is not a feature — it is the platform's architectural identity. Any change that weakens, bypasses, or obscures the shift requirement is architecturally incorrect, regardless of the UX rationale offered.

### System Quick Reference

| Property | Value |
|---|---|
| **Platform** | Multi-branch Indonesian restaurant management POS |
| **Deployment** | Production — affects real cashiers, kitchen staff, and financial records |
| **UI Language** | Bahasa Indonesia (non-negotiable; product identity, not a setting) |
| **Stack** | Vue 3 + Vuetify 3 + TypeScript 5.7 + Pinia + Vite 6 |
| **Auth** | Firebase Authentication → JWT injected via `api.ts` interceptor |
| **Data Flow** | Component → Composable (`useXxx.ts`) → Service → `api.ts` → Backend |
| **Modal System** | `useOverlayManager` singleton (never `v-dialog` + local `v-model`) |
| **Alerts** | `useAlertStore().showAlert()` (always — never inline message display) |
| **Feature State** | Composable-local `ref()` only (Pinia is for auth/user/alerts/UI only) |
| **Currency** | IDR integers — no floating-point, ever |
| **Roles** | `admin`, `pemilik`, `bendahara`, `kasir`, `dapur`, `gudang` |

---

## 2. Current State Snapshot

### Maturity Dashboard (Assessed Baseline)

| Dimension | Current Level | Target (12 mo) | Gap |
|---|---|---|---|
| **Product Experience** | Defined | Optimized | Workflows correct; lacks real-time fluidity and proactive insight |
| **Content Experience** | Ad-hoc | Managed | Text hardcoded in templates; zero i18n abstraction |
| **Visual Experience** | Basic | Branded | Generic Vuetify defaults; no proprietary component layer |
| **Admin Experience** | Manual | Automated | CRUD-only; no bulk actions, no proactive alerts |
| **SaaS Readiness** | None | Foundation | No tenant context, no dynamic theming, no feature toggles |

### Experience Debt Register

| Debt Type | Severity | Description |
|---|---|---|
| **UX Debt** | 🔴 CRITICAL | Manual refresh requirement in kitchen workspace — operational latency during peak service |
| **UX Debt** | 🔴 CRITICAL | 401 hard-logout interrupts mid-service workflows — lost state, staff frustration |
| **Maintainability** | 🟠 IMPORTANT | Mega-components lacking composition: `ShiftList.vue` (66KB), `UpdateOrder.vue` (24KB), `DetailOrder.vue` (17KB) |
| **Design Debt** | 🟠 IMPORTANT | No proprietary component wrapper layer over Vuetify — design evolution is framework-constrained |
| **Content Debt** | 🔵 FUTURE | Hardcoded Bahasa Indonesia UI strings — no i18n abstraction |
| **Operational Debt** | 🔵 FUTURE | No bulk management actions — CSV imports for menus, employees, and inventory |

### Critical Findings

**CF-1 — Kitchen Has No Live Data (CRITICAL)**
Kitchen staff manually refresh to see new orders. Every manual refresh is a micro-delay in table turnover. This is the single largest operational bottleneck in the frontend. No UI improvement matters more than fixing this.

**CF-2 — 401 Hard-Logout Disrupts Service (CRITICAL)**
Token expiry = immediate logout with no recovery. The fix (`getIdTokenHardOnce` in `api.ts`) is already implemented and only needs to be uncommented. One change; outsized impact.

**CF-3 — Mega-Components Block Safe Evolution (IMPORTANT)**
`ShiftList.vue` at 66KB mixes multiple shift types, role contexts, and render paths. `UpdateOrder.vue` at 24KB tangles layout, state, form validation, and business logic. These cannot be safely extended or tested without decomposition.

**CF-4 — No Test Coverage Constrains Refactoring (IMPORTANT)**
Zero automated tests. Wave 2 refactoring (Section 4) must not begin without E2E coverage of: order creation, payment, and shift lifecycle. Refactoring without tests means regressions go undetected until a cashier cannot process an order during service.

**CF-5 — Framework Coupling Constrains Design (IMPORTANT)**
High dependency on Vuetify 3 dictates interaction patterns and visual direction. Without a proprietary `<Nurchs*>` wrapper layer, every design evolution fights the framework rather than using it.

### Confirmed Strengths (Preserve These)

- **Role isolation** — Users see only their workspace; cognitive load dramatically reduced during service
- **Workflow correctness** — Stock requests, order processing, approval chains map accurately to physical restaurant reality
- **Component consistency** — Strict Vuetify usage creates predictable, uniform UI across all workspaces
- **Shift-anchored model** — Correct operational unit enforced at every level; financial audit trail is automatic
- **Firebase auth boot sequence** — `main.ts` correctly blocks render until auth resolves; no flash of unauthenticated content

---

## 3. Transformation North Star

### From → To (The Complete Picture)

| Dimension | Current State | Target State |
|---|---|---|
| **Data delivery** | Pull (manual refresh required) | Push (SSE/WebSocket; UI reacts to backend state changes) |
| **Session management** | Hard logout on token expiry | Silent recovery; operational flow uninterrupted |
| **Kitchen experience** | Consulted (staff check queue manually) | Active (queue updates automatically; connection status always visible) |
| **Management intelligence** | Reactive (data available to query) | Proactive (anomalies and required actions surface automatically) |
| **Component architecture** | Monolithic `.vue` files (66KB, 24KB, 17KB) | Composed sub-components with clear single responsibilities |
| **Design system** | Vuetify defaults directly in views (`v-btn`, `v-card`) | Proprietary wrapper layer (`NurchsButton`, `NurchsCard`) over Vuetify |
| **Content management** | Hardcoded strings in `.vue` templates | `vue-i18n` dictionary; content changed without touching component files |
| **State communication** | Staff trust (or don't) that data is live | UI explicitly communicates: "Live", "Reconnecting", "Offline" |
| **Admin efficiency** | One item at a time; reactive scanning | Bulk operations; anomaly surfaces; guided workflows |
| **SaaS readiness** | None | Tenant context, design tokens, feature toggles |

### Five Transformation Objectives (From Roadmap)

1. **Real-Time Operational Fluidity** — Evolve kitchen and cashier from pull to push. *Why: Reduces cognitive load and manual friction during peak revenue-generating hours.*
2. **Content Agility (CMS Readiness)** — Separate all UI copy from source code. *Why: Unlocks localization, tenant-specific phrasing, non-developer content management.*
3. **Proactive Management Intelligence** — Redesign admin dashboards to surface anomalies, not just list data. *Why: Transforms the tool from a record-keeper into a decision-making accelerator.*
4. **Proprietary Experience Layer** — Abstract Vuetify into NURCHS-specific design tokens and components. *Why: Protects against framework churn; enables future SaaS theme configurability.*
5. **Uninterrupted Workflows** — Silent session recovery; connection resilience. *Why: Restaurant operations cannot pause for authentication hiccups.*

---

## 4. Active Transformation Priorities

### The Definitive Prioritization Rule (From Roadmap)

```
1. Does it PROTECT REVENUE?     → Fix immediately. No discussion.
   (order flow bugs, token expiries, payment failures)

2. Does it ACCELERATE SERVICE?  → Fix next.
   (real-time kitchen updates, optimistic UI, session continuity)

3. Does it IMPROVE MAINTAINABILITY? → Fix after 1 and 2.
   (component refactoring, i18n extraction, design system)

4. Does it ENABLE FUTURE BUSINESS MODELS? → Fix last.
   (SaaS theming, tenant configuration, multi-language)
```

**Trade-off rule:** Always trade technical elegance for operational safety. A slightly messy component that safely processes orders is better than a beautifully abstracted one that occasionally drops state.

### Priority Tiers

#### 🔴 CRITICAL — Wave 0: Experience & Business Corrections

*Objective: Eliminate active operational friction. Do before anything else.*

| Item | What | Why |
|---|---|---|
| **P0-1** | Activate `getIdTokenHardOnce` in `api.ts` (uncomment existing code) | Eliminates 401 mid-service hard logout; fix is already written |
| **P0-2** | Audit all service error handling; ensure failures surface via `useAlertStore` | Silent failures during service are invisible operational losses |
| **P0-3** | Fix active Vue console warnings and known component runtime errors | Clean baseline before test infrastructure is added |

**Wave 0 is complete when:** No staff member experiences unexpected logout mid-workflow; all errors communicate actionably in Bahasa Indonesia.

#### 🟠 HIGH — Wave 1: Real-Time Operational Foundation

*Objective: Move from poll to push. Kitchen must never refresh manually.*

| Item | What | Why |
|---|---|---|
| **P1-1** | SSE implementation for kitchen order board | Single highest-impact operational improvement available |
| **P1-2** | SSE connection status indicator ("Live" / "Reconnecting" / "Offline") | Staff must never doubt whether they are seeing current data |
| **P1-3** | Automatic fallback to polling when SSE drops | SSE failure without fallback = kitchen goes dark; non-negotiable resilience |
| **P1-4** | SSE extension to cashier payment confirmation | Cashier should see payment `Lunas` status without manual refresh |

**Wave 1 is complete when:** Kitchen sees new orders without any manual action; UI always shows live connection status; fallback polling activates automatically on disconnect.

**Wave 1 dependency:** Backend SSE endpoint must be implemented and authenticated (Firebase JWT required).

#### 🟡 MEDIUM — Wave 2: Component Refactoring & Design System Stub

*Objective: Tame monolithic files and abstract the framework. Risk: High regression risk — requires E2E tests first.*

| Item | What | Why |
|---|---|---|
| **P2-pre** | Write E2E tests for: order creation, payment processing, shift start/end | Prerequisite for safe Wave 2 refactoring — no exceptions |
| **P2-1** | Decompose `ShiftList.vue` (66KB) into role-specific shift sub-components | Most bloated; multiple shift types mixed in one file |
| **P2-2** | Decompose `UpdateOrder.vue` (24KB) into layout, cart, and payment sub-sections | Cashier's primary tool; must be stable before extending |
| **P2-3** | Decompose `DetailOrder.vue` (17KB) into status-specific render paths | Shared between cashier and kitchen; decomposition enables safe divergence |
| **P2-4** | Create `NurchsButton`, `NurchsCard`, `NurchsInput` wrapper layer | Design abstraction boundary; prerequisite for visual evolution |
| **P2-5** | Convert hardcoded colors in `LightTheme.ts` to semantic CSS variables | Design token foundation; prerequisite for SaaS theming |

**Wave 2 is complete when:** No component exceeds 300 lines without documented justification; `<Nurchs*>` wrapper layer exists; colors are tokens, not literals.

#### 🟡 MEDIUM — Wave 3: Content & CMS Foundation

*Objective: Eliminate hardcoded text. Dependency: Wave 2 preferred (easier to extract from clean components).*

| Item | What | Why |
|---|---|---|
| **P3-1** | Implement `vue-i18n` with Bahasa Indonesia as sole locale | Separates content from code |
| **P3-2** | Extract all template strings to `/src/locales/id.json` | Content changed without touching `.vue` files |
| **P3-3** | Create `statusDisplayMap` for all status string display values | Protects behavioral contracts from display-name evolution |
| **P3-4** | Add TypeScript typing for all i18n keys | Prevents missing-key silent failures in production |

**Wave 3 is complete when:** No hardcoded display string in any `.vue` template; `statusDisplayMap` maps all status strings; i18n keys are TypeScript-typed.

#### 🔵 FUTURE — Wave 4: Admin Experience Evolution

*Objective: Elevate management from reactive to proactive. Dependency: Backend analytical endpoints.*

| Item | What |
|---|---|
| **P4-1** | Period-over-period financial comparison (this week vs. last week, branch vs. branch) |
| **P4-2** | Anomaly-surfacing widgets (revenue anomaly, shift length anomaly, stock threshold proximity) |
| **P4-3** | Bulk import/export for menus, employees, and inventory (CSV) |
| **P4-4** | Branch onboarding wizard (multi-step guided flow replacing fragmented CRUD modals) |
| **P4-5** | PWA manifest + service worker for tablet-role installable experience |

#### 🔵 FUTURE — Wave 5: SaaS Enablement

*Objective: Prepare for multi-tenancy. Implement only after a paying tenant validates the business model.*

| Item | What |
|---|---|
| **P5-1** | Tenant context (`tenant_id`) in API interceptor alongside `branch_id` |
| **P5-2** | Dynamic design token loading from tenant config API |
| **P5-3** | Feature toggle system — workspace visibility driven by API config |
| **P5-4** | Self-service onboarding flow for new tenant restaurants |

---

## 5. Execution Decision Model

### Decision Hierarchy — Apply in Order

```
STEP 1: NAME THE OPERATIONAL BENEFIT
  "Which role? Which workflow? Which friction is eliminated?"
  → If you cannot answer, question whether this is the right priority.

STEP 2: APPLY THE CONSTITUTIONAL TEST (all three must be yes)
  ① Does this respect the shift-anchored data model?
  ② Does this preserve transactional integrity (no partial state)?
  ③ Does this keep business rules in the backend service layer?
  → Any NO = redesign, not rationalize.

STEP 3: ASSESS OPERATIONAL RISK
  What happens if this fails during Friday lunch service?
  → Critical path = BLOCKER. Must have fallback. Must be tested.
  → Supporting feature = acceptable risk. Document and proceed.

STEP 4: CHECK WAVE ALIGNMENT
  Does this belong to the current active wave?
  → If a future wave: defer or document why wave sequencing is broken.

STEP 5: SCOPE THE MINIMUM CHANGE
  "What is the smallest change that delivers the target outcome?"
  → Implement that. Plan the rest for a follow-up scope.
```

### Constitution Decision Priority Hierarchy

When tradeoffs arise, the following hierarchy governs (higher = wins):

| Priority | Principle |
|---|---|
| **1. Data Integrity** | Transactional consistency and audit completeness above all |
| **2. Business Rule Correctness** | Shift requirements, payment state machines, stock constraints must be enforced |
| **3. Operational Reliability** | System remains correct and available during service hours |
| **4. Security** | Authentication and role-based authorization enforced at API layer |
| **5. User Experience** | Cashier and kitchen require speed and clarity |
| **6. Financial Accuracy** | Reports always reflect current transactional reality |
| **7. Maintainability** | Clear architecture; business rules isolated in services |
| **8. Scalability** | Handle growth, but not at the cost of correctness |

### Tradeoff Cheat Sheet

| Situation | Decision |
|---|---|
| Operational friction vs. visual improvement | Fix friction first, always |
| New feature vs. stabilizing a shaky existing feature | Stabilize first |
| Refactoring vs. adding a new capability | E2E tests → refactor → then add capability |
| Vuetify convention vs. product requirement | Product wins; create `<Nurchs*>` wrapper |
| Elegant abstraction vs. targeted fix | Targeted fix; plan abstraction for Wave 2 |
| SSE reliability vs. feature parity | Reliability wins; status indicator before features |
| i18n extraction vs. new content | Extract existing first; add new in i18n format |
| SaaS infrastructure vs. current customer value | Current value; defer SaaS until business-validated |
| Correct slow query vs. fast potentially-incorrect one | Correctness — optimize with evidence later |
| Precomputed financial aggregate vs. computed from source | Always compute from source; caching is acceptable, denormalized storage is not |


---

## 6. Transformation Guardrails

### 🚫 NEVER — Hard Boundaries

| Boundary | Violation Example | Consequence |
|---|---|---|
| Never bypass the shift gate for any UX reason | "Let's let cashiers create orders if shift start is delayed" | Breaks auditability; violates the data model |
| Never place business rules in Vue components | Stock availability check in `UpdateOrder.vue` | Backend is unprotected; any API call bypasses it |
| Never override Vuetify CSS globally | `App.vue` overriding `.v-btn` colors with `!important` | Framework-fighting; breaks on Vuetify version changes |
| Never use `v-dialog` + local `v-model` for complex modals | `const dialog = ref(false)` for a payment overlay | Breaks nested overlay behavior and confirm-before-close |
| Never import `axios` directly in components | `import axios from 'axios'` | Bypasses JWT interceptor; all calls return 401 |
| Never store feature data in Pinia | `useOrderStore` with orders `ref([])` | Cross-page state pollution; stale data on navigation |
| Never change a status string value | Renaming `'Diproses'` to `'Sedang Diproses'` directly | Breaks backend state machine comparisons silently |
| Never store computed financial totals | `finance_summaries` table updated on each payment | Drifts from source records; makes financial data untrustworthy |
| Never introduce a parallel CSS framework | Adding Tailwind alongside Vuetify | Visual inconsistency; maintenance fragmentation |
| Never build Wave 5 SaaS infrastructure before tenant validation | Building a theme editor before first paying customer | Premature abstraction creates the wrong abstraction |

### ✅ ALWAYS — Non-Negotiable Practices

| Practice | Mechanism |
|---|---|
| All UI text in Bahasa Indonesia | Every new label, button, error, placeholder |
| All API calls via `api.ts` | `import { api } from '@/services/api'` — never direct axios |
| All complex modals via `useOverlayManager` | `openOverlay({ component, props })` |
| All user feedback via `useAlertStore` | `showAlert(message, type)` — deduplication-aware |
| All feature data in composable-local `ref()` | `useXxx.ts` composable, not Pinia |
| All monetary values as IDR integers | No floating-point, ever |
| All status strings through a display-name map | `statusDisplayMap[status]` for display; never mutate the string |
| All new TypeScript types in `src/types/<domain>.ts` | Type discoverability and consistency |
| Shift gate on all operational features | Check `is_active` and shift state before rendering operational UI |
| Target device validation for operational roles | Kitchen/warehouse = tablet viewport; never assume desktop |

### The Three Questions (Constitutional Test)

Apply before finalizing **every change**:

> ① Does this respect the shift-anchored data model?
> ② Does this preserve transactional integrity?
> ③ Does this keep business rules in the backend service layer?

**All three must be YES.** Any NO = redesign before proceeding.

---

## 7. Content Transformation Command Center

### Current State Assessment

| Issue | Severity | Impact |
|---|---|---|
| All UI strings hardcoded inside `.vue` templates | High | Content changes require code deploys; no content governance |
| Status strings serve dual role: display AND behavioral contract | Critical | Renaming a status breaks backend logic silently |
| No separation between interface copy and operational data | High | Cannot customize per tenant without touching source |
| No i18n layer whatsoever | High | Multi-language or tenant terminology customization = massive refactor |

### Desired Future Content Model

```
TIER A — STATIC (i18n dictionary)
  What: UI structural labels, button text, error messages, navigation text
  Examples: "Simpan", "Batal", "Mulai Shift", alert message templates
  How: /src/locales/id.json → vue-i18n
  Changed by: Developers editing JSON; never requires a .vue file change
  CMS needed: No

TIER B — DATABASE-MANAGED (already correct; no change required)
  What: Operational business data — menu names, branch names, employee names
  How: CRUD interfaces already in place
  CMS needed: No

TIER C — CONFIGURABLE (Wave 5 only; deferred until tenant business case confirmed)
  What: Tenant-specific terminology overrides (e.g., "Outlet" vs "Cabang")
  How: Architecture hook in i18n layer; load overrides from API
  CMS needed: Optional, only when non-developer management is required
```

### CMS Transformation Phases (From Roadmap)

```
PHASE A — Dictionary (Wave 3)
  Extract ALL text to /src/locales/id.json
  TypeScript-type all i18n keys to prevent missing-key failures
  Bahasa Indonesia is the sole locale; no other locale needed yet

PHASE B — Remote Config (deferred until business case confirmed)
  Architecture supports fetching dictionaries from API or remote CMS
  Do not build until a concrete operational requirement demands it

PHASE C — SaaS Configuration (Wave 5, tenant-validated)
  UI allows tenant admin to override specific dictionary keys
  Example: rename "Gudang" to "Pantry" for a tenant with different terminology
  Build only when a paying tenant requires it
```

### The Status String Immutability Rule

Status strings are behavioral contracts. They drive state machines, UI rendering, financial computations, and backend comparisons on BOTH sides of the API boundary.

```javascript
// CORRECT: Display changes; behavioral contract preserved
const statusDisplayMap = {
  'Diproses':  'Sedang Diproses',   // visual label changes
  'Tersaji':   'Siap Disajikan',    // visual label changes
  // Underlying strings 'Diproses', 'Tersaji' are NEVER changed
}

// WRONG: String value itself is changed
// status = 'Sedang Diproses'  ← This breaks backend comparisons silently
```

**Every status string must flow through `statusDisplayMap` before rendering. Create this mapping as part of Wave 2 minimum.**

### Content Hygiene Rule (Continuous Practice)

When touching any `.vue` file for any reason:
1. Identify hardcoded strings in the template
2. Extract interface content (Tier A) to the i18n dictionary in the same change
3. Leave operational database content (Tier B) unchanged
4. Ensure status strings flow through `statusDisplayMap`

This is not a dedicated initiative — it is applied incrementally whenever a component is touched.

---

## 8. Experience Transformation Command Center

### Current Experience Weaknesses by Role

| Role | Current Friction | Operational Cost |
|---|---|---|
| **Kasir** | Token expiry = hard logout; lost order state mid-creation | Lost revenue; staff restart entire order |
| **Dapur** | Must manually refresh to see new orders | Order latency → slower table turnover; continuous cognitive tax |
| **Gudang** | Must create StockMovement separately after StockRequest completion | Redundant manual step; audit inconsistency risk |
| **Bendahara** | Must hunt for anomalies across widgets; no period comparison | Management decisions based on incomplete mental models |
| **Pemilik** | No proactive alerts; must navigate to find problems | Anomalies discovered late; reactive rather than preventive management |

### Desired Experience Outcomes by Role

| Role | Target Experience |
|---|---|
| **Kasir** | Continuous session (no interruption from token events); payment `Lunas` confirmed without refresh |
| **Dapur** | Queue updates automatically; connection status always visible; new orders appear without action |
| **Gudang** | Single action fulfills stock request AND records movement; accurate stock visible at all times |
| **Bendahara** | Period-over-period comparison visible by default; anomalies flagged automatically |
| **Pemilik** | Action-required items surface at dashboard top; anomalies highlighted; no scanning required |

### Five Experience Transformation Opportunities (Assessed Priority Order)

1. **Real-Time Operational Hub** — SSE/WebSocket for kitchen and cashier queues. Moves UI from pull to push state.
2. **Seamless Session Continuity** — Reactivate `getIdTokenHardOnce`. Eliminates 401 mid-service disruptions.
3. **Proactive Intelligence Dashboards** — Owner and Finance dashboards lead with anomalies ("Branch A revenue ↓15% vs. last week"), not data tables.
4. **SaaS-Ready Architecture** — i18n abstraction + tenant configuration context.
5. **Componentization** — Break the three mega-components into logical, testable sub-components.

### Five Non-Negotiable Experience Requirements

These must be preserved in every transformation initiative, at every wave:

```
REQ-1: Shift state always visible
  Active/inactive state permanently displayed; never hidden behind navigation

REQ-2: Branch context always explicit
  Currently selected branch shown and easily changeable on all multi-branch views

REQ-3: Errors always visible, immediate, and actionable
  via useAlertStore in Bahasa Indonesia with recovery guidance

REQ-4: Destructive actions always confirmed
  Cancel order, delete employee, reject request = explicit confirmation step

REQ-5: Loading states always communicated
  No silent blank states; every data fetch shows a loading indicator
```

### SSE/Real-Time Resilience Requirements (Wave 1)

The kitchen's live view has a critical failure mode: SSE drops silently. Staff believe they have live data but are seeing stale orders.

**All four elements are mandatory — no partial implementation is acceptable:**

```
SSE-1: Heartbeat monitoring
  Server sends ping every N seconds; client detects absence within threshold

SSE-2: Visible connection status indicator
  Kitchen UI always shows: "Live ✓" / "Menghubungkan ulang..." / "Offline"
  This is the user-facing contract that data currency can be trusted

SSE-3: Automatic fallback to polling on disconnect
  30-second polling interval activates when SSE drops
  Fallback deactivates when SSE reconnects

SSE-4: Clear transition feedback
  When SSE drops, UI immediately shows reconnection state
  Staff cannot be left wondering why the queue hasn't updated
```

### Tablet-First Design Requirements (Operational Roles)

Kitchen and warehouse staff work on tablets, often at distance, under poor lighting:

- Minimum 44px tap target size on all interactive elements
- Font size no smaller than 16px for queue data
- High contrast status badges visible from 1-2m distance
- Dense data tables replaced with expanded card format for tablet viewport
- Scroll indicators visible when content extends below viewport

---

## 9. Design Evolution Command Center

### Current Design Challenges

| Challenge | Root Cause | Impact |
|---|---|---|
| Interface reads as a generic Vuetify admin template | No proprietary component or theme layer | Cannot position as premium SaaS; low differentiation |
| Design changes require Vuetify internals knowledge | Direct use of `v-btn`, `v-card` in all views | Every design change risks framework-fighting |
| No micro-interactions confirming state changes | No interaction design standards | Staff cannot confirm their action was registered |
| Information density overwhelming on tablets | No progressive disclosure pattern | High cognitive load for kitchen/warehouse roles |
| Visual inconsistency risk as features grow | No design token system | New components will visually diverge from existing ones |

### Desired Future Characteristics

- **Legible at distance** — Kitchen displays must be readable from across a prep station
- **State-transparent** — UI communicates data currency explicitly (Live / Reconnecting / Offline)
- **Interaction-confirming** — Every significant action has a visual acknowledgment beyond the global toast
- **Structurally consistent** — Same modals, tables, forms, and confirmation patterns across all workspaces
- **Framework-isolated** — Product visual direction can evolve without Vuetify upgrades causing breakage

### Design Authority Principles

> **No significant visual change without a Design Authority. Invent nothing silently.**

| Scope of Change | Authority Required |
|---|---|
| Minor spacing or readability fix within existing patterns | None — apply and document |
| New component variant (new button state, new card layout) | Reference the `Nurchs*` component specification |
| New dashboard section or feature widget | Approved wireframe or mockup |
| Dashboard section redesign | Approved mockup validated on role's primary device |
| Full workspace redesign | Approved mockup + interactive prototype + role device validation |

**If no Design Authority exists:** Flag the gap. Do not invent a design direction. Request direction before implementing.

### The `Nurchs*` Wrapper Layer Protocol (Wave 2)

```
NurchsButton    wraps v-btn         → NURCHS defaults: primary variant, rounded, correct IDR of emphasis
NurchsCard      wraps v-card        → NURCHS defaults: standard elevation, padding, border-radius
NurchsInput     wraps v-text-field  → NURCHS defaults: form field conventions, error display pattern
NurchsDataTable wraps v-data-table  → NURCHS defaults: density, pagination pattern, tablet-optimized rows
NurchsDialog    wraps useOverlayManager → component-level overlay with standard confirm/cancel pattern
```

**Wrappers MUST:** Apply NURCHS-specific defaults; accept explicit prop overrides; expose named slots.
**Wrappers MUST NOT:** Contain business logic; silently change behavior; expose every Vuetify prop (keep surface small).

**Governance:** If a product feature needs design that cannot be expressed through the `<Nurchs*>` layer, extend the wrapper — do not bypass it with inline styles.

### Design Token Governance

```
CORRECT (semantic):   --color-surface-danger   --spacing-section-md
INCORRECT (literal):  --color-red-500          --padding-16px

Tokens defined in:    /src/theme/LightTheme.ts (current) → semantic CSS variables (Wave 2 target)
Future tenant hook:   Tenant config overrides token values; never overrides component styles
```

### Design Consistency Goals

- All interactive elements: same hover, focus, and active states
- All destructive actions: same danger/error visual pattern
- All loading states: skeleton screens where structure is predictable; spinners for indeterminate operations
- All confirmation dialogs: two-button pattern (confirm / cancel) — identical appearance across all workspaces
- All status badges: same shape, size, and semantic color-to-status mapping system-wide

### Vuetify Engagement Rules

- **Evolve within Vuetify** — Customize SASS variables, extend the theme, use Vuetify's slot system
- **Do not fight Vuetify** — Global CSS overrides that contradict Vuetify's JavaScript create fragile, unmaintainable layers
- **The `<Nurchs*>` layer is the abstraction** — Once wrappers exist, views should use them exclusively; direct `v-btn` usage becomes a code-review flag
- **No Tailwind, no Bootstrap alongside Vuetify** — A parallel CSS framework creates visual inconsistency and maintenance fragmentation


---

## 10. Admin Experience Command Center

### Current Administrative Pain Points

| Pain Point | Role | Measured Cost |
|---|---|---|
| Menus added one at a time — no CSV import | Pemilik | New branch menu setup takes hours; error-prone manual entry |
| Shift anomalies require scrolling through ShiftList (66KB) | Pemilik | Anomalies discovered late or not discovered at all |
| New employee cannot work until owner navigates correct sub-modal sequence | Pemilik | Onboarding friction; new staff idle while waiting |
| No cross-branch performance comparison in one view | Pemilik | Branch comparison requires manual context-switching and mental arithmetic |
| Fund requests pending approval give no notification | Bendahara | Approval delays cascade to warehouse operations |
| Managing 20 branches would require the same manual flow as managing 2 | Pemilik | Admin workflow does not scale beyond current chain size |

*Assessment finding: "Administrators can operate the business, but they cannot operate it efficiently at scale. Managing 2 branches is fine; managing 20 would be an administrative nightmare."*

### Desired Administrative Outcomes

**Proactive monitoring replaces reactive scanning:**
```
CURRENT:  Owner opens ShiftList → scans rows → mentally identifies anomalies
TARGET:   Dashboard surface: "Action Required: 2 shifts running >12 hours"
                              "Anomaly: Cash drawer deficit at Branch B"
                              "Pending: 3 fund requests awaiting approval"
```

**Bulk operations as first-class capability:**
- Menu import via CSV with validation preview before any DB write
- Import preview highlights conflicts, missing fields, and duplicate names
- Failed rows identified by row number and specific reason — not just "some rows failed"
- Re-import of same data is idempotent — no duplicate records

**Guided onboarding replaces discovery-based CRUD:**
```
CURRENT:  Owner → Management modal → finds Create Branch → finds Assign Menus → finds Create Employees → ...
TARGET:   New Branch Wizard: Step 1/4: Branch Details → Step 2/4: Menu Assignment → Step 3/4: Staff Setup → Step 4/4: Confirm
          Each step validates before advancing; progress is clearly communicated
```

**Cross-branch context without context loss:**
Branch switching preserves the current view type:
- Viewing Shift history for Branch A → switch to Branch B → still on Shift history for Branch B

### Admin Complexity Budget Rule (From Execution Engine)

> Every new admin capability must pass this test: "Does adding this require the admin to visit more screens, learn a new navigation pattern, or perform more steps than the workflow it replaces?"
>
> If YES → redesign the feature. New capabilities must simplify total admin effort, not compound it.

### Anomaly Intelligence Design Patterns

Replace generic data tables with question-answering widgets:

```
GENERIC (current):    "Branch A Revenue: IDR 2,300,000"
INTELLIGENT (target): "Branch A Revenue: IDR 2,300,000 (↓15% vs. last week) — Investigate"

GENERIC (current):    ShiftList table row: Shift #47, Duration: 14h 23m
INTELLIGENT (target): Alert card: "⚠ Branch B Kitchen Shift running 14 hours — Expected end: 6 hours ago"

GENERIC (current):    Fund Request list: Request #23, Status: Pending, Amount: IDR 450,000
INTELLIGENT (target): Action queue item: "📋 Fund request IDR 450,000 awaiting your approval (4 hours pending)"
```

---

## 11. Future SaaS Enablement Command Center

### SaaS Readiness Baseline

```
ALREADY IN PLACE (building blocks exist):
  ✅ Branch-scoped data isolation (branch_id FK on every operational entity)
  ✅ Role-isolated workspaces (natural per-tenant workspace structure)
  ✅ Firebase Authentication (delegated identity = correct SaaS auth pattern)
  ✅ Customer App separation (internal and customer surfaces already decoupled)
  ✅ API-first backend (frontend is a consumer, not a server-rendered view)

MISSING (SaaS blockers):
  ❌ Tenant isolation (all restaurants share one database — cross-tenant risk)
  ❌ API-layer RBAC (any authenticated employee can call any endpoint)
  ❌ i18n abstraction (no tenant-specific terminology possible)
  ❌ Design tokens (no tenant branding customization)
  ❌ Self-service onboarding (each new restaurant requires developer setup)
  ❌ Feature toggles (cannot disable modules per tenant)
  ❌ Billing infrastructure (no subscription mechanism exists)
```

### SaaS Enablement Sequencing (Strict Order)

**Do not begin a later step before the earlier step is complete AND business-validated:**

```
STEP 1 (Wave 3 — implement now; valuable regardless of SaaS):
  → vue-i18n with /src/locales/id.json
  → This serves maintainability TODAY; also enables tenant terminology TOMORROW

STEP 2 (Wave 2 — implement now; valuable regardless of SaaS):
  → Semantic CSS variables in LightTheme.ts
  → This creates design system consistency TODAY; enables tenant theming TOMORROW

STEP 3 (Wave 5 — deferred until first paying tenant confirmed):
  → tenant_id context in Axios request interceptor alongside branch_id
  → Implement only when multi-tenant backend exists

STEP 4 (Wave 5 — deferred until tenant requires branding):
  → Dynamic design token loading from tenant config API
  → Build only when a customer requires it

STEP 5 (Wave 5 — deferred until tenant requires module control):
  → Feature toggle system — workspace visibility from API config
  → Build only when a customer needs module disable
```

### Anti-Premature-Abstraction Gate (Mandatory Check)

Before any Wave 5 SaaS work, answer:
> "Has a paying tenant confirmed they need this, OR does this create tangible value for the current single-tenant deployment?"

If neither is true → design the architecture hook, document it, but **do not build it**.

### Configurability Requirements (When Triggered)

| Requirement | Trigger | Mechanism |
|---|---|---|
| Tenant terminology (e.g., "Outlet" vs "Cabang") | First paying tenant needs different terms | i18n override via API; no code change |
| Tenant branding (logo, primary color) | First paying tenant requires white-label | Design token override via API |
| Module disable (e.g., no warehouse) | First tenant without warehouse | Feature toggle from API config |
| Custom role labels | Tenant with different operational structure | i18n override for role display names |

### What "SaaS-Ready" Means for the Frontend (In Priority Order)

1. All text is in an i18n dictionary → tenant terminology is configurable
2. All colors are design tokens → tenant branding is configurable
3. API interceptor carries tenant context → tenant isolation is injectable
4. Workspace visibility is API-driven → modules can be toggled per tenant
5. Onboarding is self-service → new tenants require no developer time

---

## 12. AI Execution Playbook

### Standard Execution Loop

Every transformation session, every task, every wave — follow this loop:

```
╔══════════════════════════════════════════════════════════════════════╗
║  1. ORIENT                                                           ║
║     Read Section 15 (AI Agent Operating Instructions)               ║
║     Identify the Wave and Tier for the current task                 ║
║     Confirm no higher-priority wave work is incomplete              ║
╚══════════════════════════════════════╦═══════════════════════════════╝
                                       ↓
╔══════════════════════════════════════════════════════════════════════╗
║  2. ASSESS                                                           ║
║     Apply the Constitutional Test (3 questions — all must be YES)   ║
║     Identify: affected roles, composables, services, API contracts  ║
║     Classify: operational risk if this fails during service         ║
║     Check: is this triggering any anti-pattern? (Section 14)        ║
╚══════════════════════════════════════╦═══════════════════════════════╝
                                       ↓
╔══════════════════════════════════════════════════════════════════════╗
║  3. SCOPE                                                            ║
║     Define: minimum change that delivers the target outcome         ║
║     Declare: what is explicitly OUT of scope for this change        ║
║     Identify: what must be tested before this goes to production    ║
║     Document: any alignment contracts that are touched              ║
╚══════════════════════════════════════╦═══════════════════════════════╝
                                       ↓
╔══════════════════════════════════════════════════════════════════════╗
║  4. IMPLEMENT (smallest safe increment)                              ║
║     Follow: composable → service → api.ts data flow                 ║
║     Use: useOverlayManager for all complex modals                   ║
║     Use: useAlertStore for all user feedback                        ║
║     Write: all new UI text in Bahasa Indonesia → into i18n dict     ║
║     Validate: on target device for the affected role                ║
╚══════════════════════════════════════╦═══════════════════════════════╝
                                       ↓
╔══════════════════════════════════════════════════════════════════════╗
║  5. VALIDATE                                                         ║
║     Apply: all four validation dimensions (Section 13)              ║
║     Run: anti-pattern compliance checklist                          ║
║     Confirm: the target role's experience is improved, not degraded ║
║     Verify: alignment contracts are intact                          ║
╚══════════════════════════════════════╦═══════════════════════════════╝
                                       ↓
╔══════════════════════════════════════════════════════════════════════╗
║  6. DOCUMENT                                                         ║
║     Record: what changed and why                                    ║
║     Note: any deferred scope for future sessions                    ║
║     Update: project docs if behavioral contract changed             ║
║     Flag: any discovered risks or debt for follow-up               ║
╚══════════════════════════════════════╦═══════════════════════════════╝
                                       ↓
                              RETURN TO STEP 1
```

### Scope Management Rules

Scope creep is the most common execution failure mode. Apply strictly:

- Discovery of a deeper problem during implementation → fix original scope; document deeper problem separately
- Implementation cannot complete without touching out-of-scope files → STOP; reassess scope; restart with correct boundaries defined
- The minimum change that solves the problem is always preferred over the comprehensive change that also solves adjacent problems

### Component Refactoring Safety Protocol (Wave 2)

Before refactoring any component:
```
□ Identify all child components rendered by it
□ Identify all composables called within it
□ Identify all props and emits it exposes externally
□ Identify all ?show-only keys it supports
□ Write E2E/integration tests covering its primary flows
□ Create a reference screenshot of its current behavior

During refactoring:
□ Preserve all existing prop/emit signatures externally
□ Refactor internals; do not change the public interface without explicit planning

After refactoring:
□ Verify all test cases pass
□ Verify ?show-only embedding still works
□ Validate on target device for the component's primary role
```

### Session Handoff Protocol

When a session ends without completing the current scope, document precisely:

```
COMPLETED:   [what was finished]
IN PROGRESS: [what was partially done and exactly where it was left]
NEXT ACTION: [the exact first action the next session should take]
DISCOVERED:  [any risks, debt, or opportunities found during the session]
BLOCKED BY:  [any external dependency preventing completion]
```

---

## 13. Execution Validation Framework

Apply to all completed work before considering it done.

### Dimension 1: Business Alignment

```
□ Which staff role benefits? (name the role explicitly)
□ Which operational context does it improve? (name the workflow)
□ Does it preserve the shift-anchored data model?
□ Does it maintain all inviolable business rules?
□ Is all new UI text in Bahasa Indonesia?
□ Are all monetary values handled as IDR integers?
□ Are all status strings displayed through a mapping layer?
```

### Dimension 2: Experience Alignment

```
□ Is the shift state always visible in affected workspaces?
□ Is the branch context always visible on affected multi-branch views?
□ Are all error states visible, immediate, and actionable?
□ Does the change reduce or maintain (never increase) interaction count for the core task?
□ Has the change been validated on the target device for the affected role?
□ Do all loading states communicate progress?
□ Do all destructive actions require explicit confirmation?
□ If SSE: is connection status always visible? Is fallback to polling implemented?
```

### Dimension 3: Roadmap Alignment

```
□ Does this belong to the current active transformation wave?
□ If it belongs to a future wave: is there explicit, documented justification for early implementation?
□ Does this change leave the foundation at least as stable as before?
□ Does this change create technical debt that conflicts with a future wave's goals?
□ Is the anti-premature-abstraction gate satisfied? (current value OR confirmed tenant need)
```

### Dimension 4: Maintainability Alignment

```
□ Does the implementation follow composable → service → api.ts pattern?
□ Are all complex modals using useOverlayManager (never v-dialog + local v-model)?
□ Is all feature data in composable-local ref() (never in Pinia)?
□ Is the affected component under 300 lines? If not, has a split been proposed?
□ Are all new TypeScript types in src/types/<domain>.ts?
□ Are all new API calls routed through service files?
□ Can the next developer understand what this does without reading the implementation?
□ Are all new UI strings in the i18n dictionary (or flagged for extraction)?
```

### Fast Validation (Quick Changes)

For non-critical-path changes where full validation would be disproportionate:
```
□ Constitutional Test passed (all 3 questions YES)?
□ Target role experience not degraded?
□ No anti-patterns introduced?
□ No behavioral contracts violated?
□ All new text in Bahasa Indonesia?
→ All YES = change is acceptable
```

---

## 14. Execution Anti-Patterns

### AP-1: Redesign-First
**Signal:** "The dashboard needs a visual redesign before we can improve usability."
**Reality:** Visual redesign is Wave 4–5 work. Active operational friction (kitchen refresh, 401 logout) is Wave 0–1. Spending Wave 1 effort on Wave 5 concerns means staff suffer longer.
**Redirect:** Name the operational friction being fixed. If it's "it looks bad," that is not Wave 0 priority.

### AP-2: Refactor-First
**Signal:** "The component is too messy to add SSE safely. Let's refactor the whole thing first."
**Reality:** E2E tests must exist before any Wave 2 refactoring. And SSE (Wave 1) can often be added to an imperfect component without a full refactor first.
**Redirect:** Add the Wave 1 improvement within the existing structure. Schedule the refactor for Wave 2 once E2E tests exist.

### AP-3: Framework Migration
**Signal:** "React/Next.js/SvelteKit would handle SSE much more elegantly."
**Reality:** The Vue 3 + Vuetify 3 stack is a long-term commitment. Framework migrations are catastrophic risk events for a live operational system.
**Redirect:** Find the solution within Vue 3 + Vuetify 3. The bar for "cannot be done within the existing stack" is extremely high.

### AP-4: Premature SaaS Infrastructure
**Signal:** "Let's build the multi-tenant configuration engine now to avoid refactoring later."
**Reality:** The requirements for multi-tenancy are not yet known because no paying tenants exist. Building now creates the wrong abstraction for an unvalidated need.
**Redirect:** Design the architecture hook; document where `tenant_id` would be injected; build it when the first paying tenant requires it.

### AP-5: Global Vuetify Override
**Signal:** Global CSS in `App.vue` or `main.ts` overriding `.v-btn`, `.v-card`, or `.v-dialog` styles.
**Reality:** Global CSS overrides fight Vuetify's JavaScript. They break silently on Vuetify version updates. They are invisible in component-level debugging.
**Redirect:** Use Vuetify's SASS variables, scoped `<style>` blocks, or the `<Nurchs*>` wrapper layer.

### AP-6: Overlay Bypass
**Signal:** `const showDialog = ref(false)` + `<v-dialog v-model="showDialog">` for any complex interaction.
**Reality:** Bypasses `useOverlayManager`; breaks nested overlay behavior (e.g., Payment overlay inside UpdateOrder); removes confirm-before-close protection.
**Redirect:** `useOverlayManager().openOverlay({ component: MyModal, props: { ... } })`.

### AP-7: Pinia Feature State
**Signal:** Creating `useOrderStore`, `useInventoryStore`, or any Pinia store for operational data.
**Reality:** Feature data in Pinia creates cross-page state pollution. An owner navigating from Cashier to Finance sees stale order data if it lives in a shared store.
**Redirect:** `useOrders.ts` composable with local `ref()` state. Mounts fresh data on page mount. Discards on unmount.

### AP-8: Direct Axios Import
**Signal:** `import axios from 'axios'` anywhere in a component, composable, or service.
**Reality:** The `api.ts` interceptor injects the Firebase JWT token. Bypassing it means every request returns 401 immediately.
**Redirect:** `import { api } from '@/services/api'` — the only way API calls should be made.

### AP-9: Status String Mutation
**Signal:** Renaming `'Diproses'` to `'Sedang Diproses'` as if it's a display-only change.
**Reality:** Status strings drive backend state machines, UI conditional rendering, and financial computations. Changing the value without coordinating the backend breaks live operations silently.
**Redirect:** Create/extend `statusDisplayMap['Diproses'] = 'Sedang Diproses'`. Display the mapped value. Never change the underlying string.

### AP-10: Business Logic in Components
**Signal:** Adding stock availability validation, payment state checks, or shift requirement enforcement inside a Vue component.
**Reality:** Frontend-only validation provides zero data protection. Any authenticated user can bypass it by calling the API directly. The backend must be the authoritative enforcement point.
**Redirect:** Frontend validation is UX-only (it prevents a bad form submit). The backend will reject invalid requests regardless. Both can coexist, but the component is never the authoritative layer.

### AP-11: Aesthetic-Only Initiative Without Operational Foundation
**Signal:** "Let's make the interface feel more premium to prepare for SaaS."
**Reality:** Visual polish is Wave 4–5. Kitchen staff with manual refresh requirements do not benefit from color palette refinements.
**Redirect:** Name the operational problem the aesthetic change solves. If none exists, defer to after Wave 2–3 are complete.

### AP-12: CMS Over-Engineering
**Signal:** "We need a headless CMS to manage UI content."
**Reality:** `vue-i18n` with local JSON dictionaries achieves the maintainability goal without remote CMS complexity, additional infrastructure, and new dependencies.
**Redirect:** Phase A (Dictionary) is sufficient for years. Remote CMS (Phase B) is only justified when non-developers need to manage content at a cadence that justifies the integration.


---

## 15. AI Agent Operating Instructions

**Read this section first in every session. It is the minimum viable context to begin execution safely.**

### What You Are Working On

NURCHS POS is a **live production system**. Real cashiers process real payments. Real kitchen staff fulfill real orders. Real treasurers reconcile real money. Your changes affect their ability to work during service. This is not a sandbox — it is an operational tool running a restaurant business.

### The Single Most Important Rule

> **The shift is the operational unit.** Every action that touches orders, payments, stock, or financial data must be anchored to an active shift. If your implementation relaxes, bypasses, or obscures a shift requirement — for any reason — it is architecturally incorrect.

### Three Questions Before Every Change (Constitutional Test)

```
① Does this respect the shift-anchored data model?      → Must be YES
② Does this preserve transactional integrity?           → Must be YES
③ Does this keep business rules in the backend layer?   → Must be YES

Any NO = redesign before proceeding. Do not rationalize a NO into a YES.
```

### Your Current Priorities (In Order)

```
🔴 P0-1: Activate getIdTokenHardOnce in api.ts (uncomment; fix already written)
🔴 P0-2: Ensure all service errors surface via useAlertStore (no silent failures)
🔴 P0-3: Fix active Vue console warnings

🟠 P1-1: SSE for kitchen order board
🟠 P1-2: SSE connection status indicator ("Live / Reconnecting / Offline")
🟠 P1-3: SSE fallback to polling on disconnect
🟠 P1-4: SSE extension to cashier payment confirmation

🟡 [Wave 2] E2E tests → decompose mega-components → Nurchs* layer → design tokens
🟡 [Wave 3] vue-i18n → extract strings → statusDisplayMap
🔵 [Wave 4] Proactive dashboards → bulk operations → PWA
🔵 [Wave 5] SaaS enablement (only after paying tenant validates)
```

### Your Non-Negotiable Rules

```
LANGUAGE:        All UI text in Bahasa Indonesia — every label, button, error, placeholder
API CALLS:       import { api } from '@/services/api' — never direct axios
MODALS:          useOverlayManager().openOverlay({ component, props }) — never v-dialog + v-model
ALERTS:          useAlertStore().showAlert(message, type) — never inline messages
FEATURE STATE:   composable-local ref() — never Pinia for orders/inventory/shifts
CURRENCY:        IDR integers — no floating-point operations, ever
STATUS STRINGS:  Display through statusDisplayMap — never mutate the status string value
SHIFT GATE:      Check is_active and shift state before rendering any operational UI
DEVICE:          Validate kitchen/warehouse features on tablet viewport
```

### The Data Flow You Must Follow

```typescript
// Frontend data flow — follow this exactly
Page component (mounts composable, passes branch context to composable)
  ↓
Composable useXxx.ts (owns reactive ref state, calls service on mount/branch change)
  ↓
Service src/services/<domain>/xxxService.ts (builds typed API request)
  ↓
api.ts (Axios instance + Firebase JWT interceptor — the ONLY API call mechanism)
  ↓
Backend REST API

// User feedback
useAlertStore().showAlert(message, 'success' | 'error' | 'warning' | 'info')

// Modals
useOverlayManager().openOverlay({ component: MyModal, props: { data, refresh } })

// Refresh pattern
parent owns refresh() → passes as prop to sub-components → called on completion
```

### The Files You Must Know First

| File | What It Is |
|---|---|
| `src/services/api.ts` | Axios + Firebase JWT interceptor — only path to the API |
| `src/composables/non-services/useOverlayManager.ts` | Singleton managing all overlay state |
| `src/stores/auth.ts` | Firebase auth state + login/logout |
| `src/stores/authUser.ts` | Employee profile, role, shift — drives all role access |
| `src/stores/alert.ts` | Global alert queue; `showAlert()` is the only user feedback mechanism |
| `src/router/index.ts` | Route guards pipeline — gatekeeper of all role-based access |
| `src/router/MainRoutes.ts` | All role routes with `meta.requiredRoles` |
| `src/types/employee.ts` | `UserRole` type — the canonical list of valid role strings |
| `src/theme/LightTheme.ts` | Color palette — design token source |

### When to Stop and Escalate

Stop implementation and document rather than proceeding if:

- Implementation requires touching files outside the defined scope
- The change affects order creation, payment processing, or shift lifecycle
- The change would modify a status string value (behavioral contract)
- The change would alter how the `api.ts` JWT interceptor works
- A business rule is discovered that is unclear or seems undocumented
- A discovered dependency graph is larger than expected — reassess blast radius before continuing

---

## 16. Frontend Execution Quick Reference

### Mission in Three Lines
1. Fix the operational friction (401 logout, kitchen refresh) before anything else
2. Build a stable, tested, componentized foundation before adding features
3. Evolve the experience based on the operator's need — not the framework's conventions

### Active Wave Status

| Wave | Status | Objective |
|---|---|---|
| **Wave 0** | ✅ COMPLETED | Activate 401 fix; ensure service errors surface |
| **Wave 1** | 🔴 IN PROGRESS | SSE for kitchen + cashier; connection indicator; fallback |
| **Wave 2** | ⏳ BLOCKED ON WAVE 1 + E2E TESTS | Component decomp; Nurchs* layer; design tokens |
| **Wave 3** | ⏳ BLOCKED ON WAVE 2 | vue-i18n; text extraction; statusDisplayMap |
| **Wave 4** | ⏳ BLOCKED ON WAVE 3 | Proactive dashboards; bulk ops; analytics |
| **Wave 5** | ⏳ BLOCKED ON BUSINESS VALIDATION | SaaS enablement |

*Update wave status when waves are entered and completed.*

### Risks at a Glance

| Risk | Severity | Status |
|---|---|---|
| Status string renamed without backend coordination | CRITICAL | Prevention: statusDisplayMap; PR review checklist |
| Direct axios import bypassing JWT | CRITICAL | Prevention: eslint rule or PR checklist |
| SSE drops silently — kitchen goes dark | HIGH | Mitigation: heartbeat + visible indicator + polling fallback |
| Component refactoring without E2E tests | HIGH | Prevention: E2E tests mandatory before Wave 2 starts |
| Global Vuetify CSS override | MEDIUM | Prevention: code review; Nurchs* layer governance |
| Feature data in Pinia | MEDIUM | Prevention: code review checklist |

### Opportunities at a Glance

| Opportunity | Effort | Value | Wave |
|---|---|---|---|
| Activate 401 token recovery (already written) | Hours | CRITICAL — eliminates mid-service logout | 0 |
| SSE kitchen order board | Days | HIGH — eliminates highest-friction operational gap | 1 |
| statusDisplayMap (decouples display from contract) | Hours | HIGH — protects all behavioral contracts | 2 |
| E2E tests for critical paths | Days | HIGH — enables safe Wave 2 refactoring | Pre-2 |
| vue-i18n + text extraction | Days | HIGH — enables content governance and SaaS | 3 |
| Proactive anomaly dashboards | Weeks | HIGH — transforms management from reactive to proactive | 4 |
| SaaS enablement infrastructure | Months | HIGH (conditional on business validation) | 5 |

### Experience Maturity Targets

| Dimension | Now | Target (12 mo) |
|---|---|---|
| Product Experience | Defined | Optimized |
| Content Experience | Ad-hoc | Managed |
| Visual Experience | Basic | Branded |
| Admin Experience | Manual | Automated |
| SaaS Readiness | None | Foundation |

### Execution Philosophy (Six Sentences)

The NURCHS POS frontend has already solved the hardest problem in software: it correctly encodes the operational reality of a restaurant into a working digital system. The transformation mandate is to elevate how staff interact with that correct domain model — not to redesign the domain. Every session should begin by fixing the highest-priority operational friction available in the current wave. Every component touched should be left more maintainable, more tested, and more aligned with the `<Nurchs*>` design system than it was before. The transformation waves define the sequence for a reason: a stable real-time foundation enables safe refactoring; safe refactoring enables content extraction; content extraction enables SaaS configurability. Follow the waves, respect the guardrails, and the platform that results will be one that every staff member and every future engineer can trust.

---

*FRONTEND_EXECUTION_WORKSPACE.md — NURCHS POS Platform*
*Version 2.0 | Generated: 2026-06-06*
*Synthesized directly from authoritative source documents:*
*FRONTEND_EXPERIENCE_ASSESSMENT.md + FRONTEND_TRANSFORMATION_ROADMAP.md + PROJECT_CONSTITUTION.md + PROJECT_MASTER_CONTEXT.md + BUSINESS_EVOLUTION_ASSESSMENT.md + PROJECT_TRANSFORMATION_BLUEPRINT.md + FRONTEND_EXECUTION_ENGINE.md*

*This is the day-to-day operational cockpit. It bridges roadmap intent and daily execution.*
*Update it: at the start of each new transformation wave; when priorities shift; when risks materialize or are resolved; when the active wave status changes.*
*It must always reflect current operational reality — not aspirational state.*

