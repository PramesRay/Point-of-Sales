# FRONTEND MASTER CONTEXT
## Point-of-Sales — Nasi Uduk Remaja Cikini Haji Sawid (NURCHS)
**Version:** 1.0 | **Generated:** 2026-06-05 | **Repository:** [PramesRay/Point-of-Sales](https://github.com/PramesRay/Point-of-Sales)

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Business Domain](#3-business-domain)
4. [User Personas](#4-user-personas)
5. [Product Goals](#5-product-goals)
6. [Application Overview](#6-application-overview)
7. [Route & Module Inventory](#7-route--module-inventory)
8. [Feature Inventory](#8-feature-inventory)
9. [User Journeys](#9-user-journeys)
10. [Information Architecture](#10-information-architecture)
11. [Frontend Architecture](#11-frontend-architecture)
12. [Design System](#12-design-system)
13. [State Management](#13-state-management)
14. [Data Flow](#14-data-flow)
15. [Authentication & Authorization](#15-authentication--authorization)
16. [External Integrations](#16-external-integrations)
17. [Operational Workflows](#17-operational-workflows)
18. [Business Critical Features](#18-business-critical-features)
19. [Engineering Assessment](#19-engineering-assessment)
20. [Architectural Decisions](#20-architectural-decisions)
21. [Technical Constraints](#21-technical-constraints)
22. [Known Risks](#22-known-risks)
23. [Future Evolution Opportunities](#23-future-evolution-opportunities)
24. [AI Agent Implementation Guide](#24-ai-agent-implementation-guide)
25. [Executive Technical Summary](#25-executive-technical-summary)

---

## 1. Executive Summary

This document is the **single authoritative knowledge source** for the Point-of-Sales frontend application built for "Nasi Uduk Remaja Cikini Haji Sawid" (NURCHS) — an Indonesian restaurant chain. The system was developed as a thesis project by Prames Ray Lapian (Informatics Engineering, Universitas Padjadjaran).

The frontend is a **Vue 3 + Vuetify 3 SPA** that serves as the **internal management portal** for restaurant staff. It is a **role-isolated, multi-branch POS and operational management system** with five distinct user roles each landing on a dedicated operational workspace.

**Key facts at a glance:**
- **Framework:** Vue 3 (Composition API) + Vite 6 + TypeScript 5.7
- **UI Library:** Vuetify 3 (PurpleTheme — blue/purple palette)
- **State:** Pinia (3 global stores + composable-local state)
- **Auth:** Firebase Authentication (Email/Password + Google OAuth)
- **HTTP:** Axios with Firebase JWT bearer token injection
- **Payment:** Midtrans (snap token flow)
- **Charts:** ApexCharts via vue3-apexcharts
- **Deployment:** Docker → Railway (production at `internalposnurchs.up.railway.app`)
- **Live URLs:** Internal App: `internalposnurchs.up.railway.app` | Customer App: `nurchs.up.railway.app`

---

## 2. Product Overview

The system is a **dual-application platform**:

| Application | Audience | Purpose |
|---|---|---|
| Internal POS (`internalposnurchs.up.railway.app`) | Restaurant staff & management | Operational management, order taking, kitchen display, inventory, finance |
| Customer App (`nurchs.up.railway.app`) | Restaurant customers | QR-code menu browsing and ordering |

**This repository (`Point-of-Sales`) is exclusively the Internal POS application.**

The Internal POS is not a traditional single-cashier POS. It is a **multi-branch, multi-role operational hub** where each role sees only their relevant operational workspace. This design reflects the real operational separation in a restaurant: the owner manages overall business, the cashier takes and processes orders, the kitchen manages food preparation and stock requests, the warehouse manages inventory, and the treasurer manages financials.

---

## 3. Business Domain

**Domain:** Food & Beverage (F&B) — Full-service restaurant  
**Business model:** Multi-branch restaurant chain with centralized management  
**Operational model:** Shift-based — all operational activities are tied to a shift lifecycle (start → work → end)

**Core business processes:**
1. **Order Management:** Customer orders created by cashier → processed by kitchen → marked complete/refunded
2. **Inventory Management:** Warehouse tracks stock → Kitchen requests stock → Warehouse approves/rejects
3. **Financial Management:** Income from orders + cash flows → Treasurer reviews summaries, approves fund requests
4. **Shift Management:** All roles clock in/out via shift system; shift data drives financial and operational reports
5. **Reservation Management:** Customers book tables → Owner/management manages calendar
6. **Menu & Branch Management:** Owner manages menus, categories, branch definitions, and employee accounts

**Language:** The entire UI is in **Indonesian (Bahasa Indonesia)**. All labels, messages, alerts, and content are in Indonesian. Role names: `pemilik` (owner), `bendahara` (treasurer/finance), `kasir` (cashier), `dapur` (kitchen), `gudang` (warehouse), `admin`.

---

## 4. User Personas

### 4.1 Pemilik / Admin (Owner / Administrator)
- **Access level:** Full — can see all dashboards and all pages
- **Primary workspace:** `/dashboard/pemilik` — Owner Dashboard
- **Core responsibilities:** Branch management, employee management, menu management, reservation management, shift oversight, overall business performance
- **Key concern:** Full operational visibility across all branches

### 4.2 Bendahara (Treasurer / Finance)
- **Access level:** Finance + shift visibility
- **Primary workspace:** `/dashboard/bendahara` — Finance Dashboard
- **Core responsibilities:** Revenue tracking, expense tracking, fund request approvals, shift financial summaries
- **Key concern:** Accurate financial reconciliation per period and per branch

### 4.3 Kasir (Cashier)
- **Access level:** Order management only
- **Primary workspace:** `/halaman/kasir` — Cashier Page
- **Core responsibilities:** Creating orders, updating orders, processing payments (Midtrans snap + direct cash), managing refunds, cash flow input
- **Key concern:** Speed of order creation and payment processing during peak hours

### 4.4 Dapur (Kitchen)
- **Access level:** Order display + stock request
- **Primary workspace:** `/halaman/dapur` — Kitchen Page
- **Core responsibilities:** Viewing incoming orders, updating order status, managing menu quantities per shift, submitting stock requests to warehouse
- **Key concern:** Real-time visibility of order queue and clear stock availability

### 4.5 Gudang (Warehouse)
- **Access level:** Inventory + fund requests
- **Primary workspace:** `/halaman/gudang` — Inventory/Warehouse Page
- **Core responsibilities:** Managing inventory items, approving/rejecting stock requests from kitchen, recording stock movements, managing fund requests
- **Key concern:** Accurate stock levels and timely request approval

---

## 5. Product Goals

1. **Operational Efficiency:** Replace paper-based or fragmented systems with a unified digital platform for all staff roles
2. **Financial Visibility:** Give the owner and treasurer real-time insight into revenue, expenses, and net income across branches
3. **Shift-Based Accountability:** Tie all activities (orders, stock movements, cash flows) to shift records for auditability
4. **Multi-Branch Scalability:** Allow the owner to monitor and manage multiple branches from a single dashboard
5. **Inventory Control:** Reduce waste and stockouts through a request-approval workflow between kitchen and warehouse
6. **Academic Demonstration:** Serve as a full-stack thesis project showcasing a production-ready restaurant management system

---

## 6. Application Overview

### Entry Point & Initialization
**File:** [`src/main.ts`](file:///d:/Dev%20Projects/nurchs/Point-of-Sales/src/main.ts)

The app initializes with a critical async boot sequence **before mounting**:
1. Initialize Pinia stores
2. Register all plugins (Vuetify, ApexCharts, PerfectScrollbar, vue-tabler-icons, vue3-print-nb)
3. `authStore.initialize()` — attach Firebase `onIdTokenChanged` listener and await first resolution
4. If authenticated, `userStore.fetchMe()` — fetch employee profile from backend
5. `router.isReady()` — wait for router to be ready
6. `app.mount('#app')` — finally mount the application

This ensures auth state is **fully resolved before the first render**, preventing flash-of-unauthenticated-content.

### Layout System
Two layouts exist:
- **`FullLayout.vue`** (`src/layouts/full/`) — The authenticated app shell with vertical sidebar, top header, and footer. Used for all authenticated routes.
- **Blank (no layout)** — Public routes (login, register, email verification, 404) render without the app shell.

### Application Shell Components
- `vertical-sidebar/` — Role-aware navigation sidebar
- `vertical-header/` — Top navigation bar with user profile
- `footer/` — App footer
- `customizer/` — Theme/layout customizer drawer (toggled via `customizer.ts` store)

---

## 7. Route & Module Inventory

### Router Configuration
**File:** [`src/router/index.ts`](file:///d:/Dev%20Projects/nurchs/Point-of-Sales/src/router/index.ts)

The router uses `createWebHistory` and is split into two route groups:

### 7.1 Public Routes (`/src/router/PublicRoutes.ts`)

| Route Name | Path | Component | Description |
|---|---|---|---|
| Authentication | `/login` | `LoginPage.vue` | Email/password + Google OAuth login |
| Register | `/register` | `RegisterPage.vue` | New account registration |
| Email Verification | `/verify-email` | `EmailSent.vue` | Post-registration email verification gate |
| Error 404 | `/error` | `Error404Page.vue` | Error page |
| (catch-all) | `/:pathMatch(.*)` | `Error404Page.vue` | 404 for unknown routes |

### 7.2 Main Routes (`/src/router/MainRoutes.ts`) — Require Auth

| Route Name | Path | Component | Allowed Roles |
|---|---|---|---|
| LandingPage | `/` | Role-redirect logic | All authenticated |
| Pemilik | `/dashboard/pemilik` | `OwnerDashboard.vue` | admin, pemilik |
| Bendahara | `/dashboard/bendahara` | `FinanceDashboard.vue` | admin, pemilik, bendahara |
| Kasir | `/halaman/kasir` | `CashierPage.vue` | admin, pemilik, kasir |
| Gudang | `/halaman/gudang` | `InventoryPage.vue` | admin, pemilik, gudang |
| Dapur | `/halaman/dapur` | `KitchenPage.vue` | admin, pemilik, dapur |
| Starter | `/starter` | `StarterPage.vue` | Any authenticated (fallback for unconfirmed roles) |

### 7.3 Route Guard Logic

The global `beforeEach` guard in `router/index.ts` enforces a strict multi-step authentication pipeline:

```
1. Wait for auth.loading to resolve (prevents race condition on reload)
2. If auth required AND not authenticated → redirect to /login
3. If authenticated AND no profile → fetchMe() AND WAIT
4. If email not verified → redirect to /verify-email (no logout)
5. If role is null → redirect to /starter (no logout, pending owner approval)
6. If already on /login or /register → redirect to /
7. If route has requiredRoles AND user role not in list → redirect to /
```

The LandingPage (`/`) route has its own `beforeEnter` guard that performs role-based routing:
- `admin/pemilik` → `/dashboard/pemilik`
- `bendahara` → `/dashboard/bendahara`
- `kasir` → `/halaman/kasir`
- `gudang` → `/halaman/gudang`
- `dapur` → `/halaman/dapur`
- Unknown role → `/starter`

---

## 8. Feature Inventory

### 8.1 Owner Dashboard (`/dashboard/pemilik`)
**File:** [`src/views/dashboards/owner/OwnerDashboard.vue`](file:///d:/Dev%20Projects/nurchs/Point-of-Sales/src/views/dashboards/owner/OwnerDashboard.vue)

**Widget/Component breakdown:**

| Component | File | Business Purpose | Importance |
|---|---|---|---|
| EmployeeActive | `components/EmployeeActive.vue` | Shows currently active employees per branch | High |
| TotalOrder | `finance/components/TotalOrder.vue` (shared) | Order count: current, weekly trend, monthly trend | High |
| CurrentReservation | `components/CurrentReservation.vue` | Active reservations calendar/list | High |
| Management | `components/Management.vue` | CRUD for employees, branches, menus, categories | Mission Critical |
| ShiftList | `components/ShiftList.vue` | View all shift records (employee, cashier, kitchen, warehouse) | High |
| Timesheets | `components/Timesheets.vue` | Employee timesheet records | Medium |

**Key behaviors:**
- Branch selector in header/sticky pill filters all data simultaneously
- `show-only` query param (`?show-only=manajemen`) can isolate a single widget (used for embedding in mobile views)
- Responsive: 8/4 column split on desktop, stacked on mobile
- ShiftList is a 66KB component — the largest single component in the codebase

### 8.2 Management Sub-Modals (Owner Dashboard)
**Directory:** `src/views/dashboards/owner/components/sub-components/`

| Component | Purpose |
|---|---|
| `DetailAccount.vue` | View/edit employee profile, role assignment, branch assignment |
| `DetailBranch.vue` | View/edit branch details |
| `DetailCategory.vue` | View/edit menu/inventory category |
| `DetailMenu.vue` | View/edit menu item (name, price, description, category, stock threshold) |
| `DetailReservation.vue` | View reservation details |
| `UpdateReservation.vue` | Edit reservation (date, party size, notes, status) |
| `shift/` subdir | Shift management modals |

### 8.3 Finance Dashboard (`/dashboard/bendahara`)
**File:** [`src/views/dashboards/finance/FinanceDashboard.vue`](file:///d:/Dev%20Projects/nurchs/Point-of-Sales/src/views/dashboards/finance/FinanceDashboard.vue)

| Component | File | Business Purpose |
|---|---|---|
| TotalEarning | `components/TotalEarning.vue` | Net earnings summary card |
| TotalOrder | `components/TotalOrder.vue` | Order counts with mini chart |
| TotalIncome | `components/TotalIncome.vue` | Gross sales + refunds + net income with period filter |
| TotalExpense | `components/TotalExpense.vue` | Expense breakdown with ApexCharts bar chart, period filter |
| ShiftList | (shared from owner) | Shift data for financial correlation |
| CurrentFundRequest | (shared from inventory) | Pending fund requests requiring approval |

**Data fetched on mount:** branch list, employee list, all shift types, finance summary (income/expense), total orders, fund requests.

### 8.4 Cashier Page (`/halaman/kasir`)
**File:** [`src/views/pages/cashier/CashierPage.vue`](file:///d:/Dev%20Projects/nurchs/Point-of-Sales/src/views/pages/cashier/CashierPage.vue)

**Gate:** Shows "belum memulai sif" (shift not started) if `userStore.me.activity.is_active` is false.

**Sub-features:**

| Component | Business Purpose | Criticality |
|---|---|---|
| `CurrentOrder.vue` (kitchen shared) | Live list of all orders for the branch | Mission Critical |
| `CurrentOrderQue.vue` (kitchen shared) | Detailed order queue with status management | Mission Critical |
| `CreateOrder.vue` | Button/trigger to open UpdateOrder overlay for new order | Mission Critical |
| `UpdateShift.vue` | Update cashier shift (cash-in, cash-out, actual cash) | High |
| `StartShift.vue` | Start cashier operational shift (select branch, enter initial cash) | Mission Critical |

**Sub-modal components (`sub-components/`):**

| Component | Size | Purpose |
|---|---|---|
| `UpdateOrder.vue` | 24KB | Create/edit order with menu selection, quantity, notes, cart preview |
| `DetailOrder.vue` | 17KB | Detailed view of a single order with status update per item |
| `Payment.vue` | 7.6KB | Midtrans snap payment flow + direct cash/digital payment |
| `InputCashFlow.vue` | 5.5KB | Add cash-in or cash-out entry to current cashier shift |
| `RefundOrder.vue` | 3.75KB | Process refund on order items |
| `EndShift.vue` | 3KB | End cashier shift (enter actual cash amount) |
| `AddToChart.vue` | 3.5KB | Add single menu item to order cart (qty + note) |

### 8.5 Kitchen Page (`/halaman/dapur`)
**File:** [`src/views/pages/kitchen/KitchenPage.vue`](file:///d:/Dev%20Projects/nurchs/Point-of-Sales/src/views/pages/kitchen/KitchenPage.vue)

**Gate:** Shows warning if `is_active` false OR if kitchen/warehouse shift has ended.

| Component | Business Purpose | Criticality |
|---|---|---|
| `CurrentOrder.vue` | Summary card of current orders | Mission Critical |
| `CurrentOrderQue.vue` | Order queue with item-level status updates | Mission Critical |
| `MenuQuantityManagement.vue` | Manage per-menu remaining quantities within kitchen shift | High |
| `CurrentStockRequestList.vue` (shared from inventory) | See incoming stock requests | High |
| `MenuSalesStock.vue` | Menu with available stock display | High |
| `StartShift.vue` | Start kitchen shift (select branch, enter initial menu quantities) | Mission Critical |
| `UpdateShift.vue` | Update kitchen shift (final menu quantities, notes) | High |

**3-column layout:** Left (orders + menu qty) | Center (order queue) | Right (stock requests)

### 8.6 Inventory/Warehouse Page (`/halaman/gudang`)
**File:** [`src/views/pages/inventory/InventoryPage.vue`](file:///d:/Dev%20Projects/nurchs/Point-of-Sales/src/views/pages/inventory/InventoryPage.vue)

**Gate:** Shows warning if `is_active` false OR warehouse shift has ended.

| Component | Business Purpose | Criticality |
|---|---|---|
| `CurrentStockRequestSummary.vue` | Summary of pending stock requests | High |
| `CurrentStockRequestList.vue` | Full list with approve/reject actions | Mission Critical |
| `InventoryItems.vue` | Full inventory item CRUD with categories | High |
| `StockMovement.vue` | Record and view stock movements (in/out/reduction) | High |
| `CurrentFundRequest.vue` | Fund requests from warehouse to treasurer | High |
| `UpdateShift.vue` | Update warehouse shift notes | Medium |

**Inventory sub-components (`sub-components/`):**
- `fund-request/` — Fund request create/update/approve sub-modals
- `inventory-item/` — Item create/update sub-modals
- `stock-movement/` — Stock movement create sub-modals
- `stock-request/` — Stock request create/update/approve sub-modals

### 8.7 Authentication Pages
- **LoginPage.vue** — Email/password login + Google Sign-In button. Validates email verification and role confirmation.
- **RegisterPage.vue** — Creates Firebase user, sends verification email, calls backend `/auth/register`.
- **EmailSent.vue** — Polling/instruction page after registration, with resend verification button.

---

## 9. User Journeys

### 9.1 Daily Restaurant Opening (Critical Path)

```
Owner/Admin
  → Logs in → routed to /dashboard/pemilik
  → Reviews active employees widget
  → (optional) Selects branch in branch selector

Kasir (Cashier)
  → Logs in → routed to /halaman/kasir
  → Sees "belum mulai sif" warning
  → Opens StartShift overlay → selects branch + enters initial cash
  → Shift created → order management UI becomes available

Dapur (Kitchen)
  → Logs in → routed to /halaman/dapur
  → Opens StartShift overlay → selects branch + enters initial per-menu quantities
  → Kitchen shift created → order queue + stock request UI becomes available

Gudang (Warehouse)
  → Logs in → routed to /halaman/gudang
  → Starts warehouse shift (no initial data required)
  → Inventory + fund request + stock movement UI becomes available
```

### 9.2 Order Lifecycle

```
Kasir
  → CashierPage → "Buat Pesanan" button
  → UpdateOrder overlay opens
  → Select menu category → browse items → AddToChart overlay (qty + note)
  → Review cart in "Tinjau Pesanan" panel
  → Enter customer name/phone, table number, dine-in/takeaway
  → "Langsung Bayar" (direct payment) → Payment overlay (cash/digital) OR
  → "Simpan" (save as Pending) → order appears in CurrentOrderQue

Dapur
  → CurrentOrderQue shows Pending orders
  → Updates order item status: Pending → Diproses → Tersaji
  → Updates order status: Pending → Diproses → Selesai

Kasir
  → Sees Tersaji order in CurrentOrder
  → Opens DetailOrder → confirms payment received → order marked Selesai
```

### 9.3 Stock Request Flow (Kitchen → Warehouse)

```
Dapur
  → MenuQuantityManagement widget shows current per-menu stock
  → Creates stock request: selects items + quantities needed
  → Stock request appears as "Pending" in CurrentStockRequestList

Gudang
  → CurrentStockRequestList shows incoming Pending requests
  → Opens request detail → approves or rejects individual items
  → Stock request status updates: Pending → Diproses/Siap/Selesai/Ditolak

Dapur
  → Sees updated status in CurrentStockRequestList
```

### 9.4 New Employee Registration (Owner Flow)

```
New Employee
  → Registers at /register → Firebase account created
  → Verification email sent → /verify-email gate
  → Verifies email → logs in → role is null → redirected to /starter
  → (message: "Email belum dikonfirmasi oleh pemilik")

Owner
  → Dashboard → Management → Employee section
  → Finds new employee → DetailAccount modal
  → Assigns role (kasir/dapur/gudang/bendahara) + branch
  → Employee can now log in normally
```

---

## 10. Information Architecture

### 10.1 Navigation Structure

The app has **no traditional sidebar navigation menu** in the conventional sense. Instead, the sidebar/header contains only **role-specific single links** (one active workspace per role). Navigation is **implicitly role-based** — you are always on your one page.

The `visibleComponent` pattern (`?show-only=<key>`) allows embedding individual dashboard widgets in other contexts (e.g., mobile views show one panel at a time).

### 10.2 Widget Keys for `?show-only` Query Param

| Page | `show-only` value | Widget shown |
|---|---|---|
| Owner Dashboard | `aktifitas-karyawan` | EmployeeActive + TotalOrder |
| Owner Dashboard | `shift` | ShiftList |
| Owner Dashboard | `reservasi` | CurrentReservation |
| Owner Dashboard | `manajemen` | Management |
| Finance Dashboard | `rekapitulasi-keuangan` | Financial KPI cards |
| Finance Dashboard | `shift` | ShiftList |
| Finance Dashboard | `permintaan-dana` | CurrentFundRequest |
| Cashier Page | `rekapitulasi-pesanan` | CurrentOrder |
| Cashier Page | `pesanan` | CurrentOrderQue |
| Kitchen Page | `pesanan` | Orders |
| Kitchen Page | `permintaan-persediaan` | StockRequest + MenuQty |
| Inventory Page | `rekapitulasi-gudang` | StockRequestSummary |
| Inventory Page | `permintaan-persediaan` | StockRequestList |
| Inventory Page | `persediaan` | InventoryItems |
| Inventory Page | `mutasi-stok` | StockMovement |
| Inventory Page | `permintaan-dana` | CurrentFundRequest |

---

## 11. Frontend Architecture

### 11.1 Architectural Style
**Single-Page Application (SPA)** with Composition API throughout. The architecture follows a **three-tier component model**:

```
Page (view) → Widget/Feature Component → Sub-modal (overlay) Component
```

Pages own data fetching and branch selection state. Feature components receive data via props and emit refresh calls. Sub-modals are opened imperatively via `useOverlayManager`.

### 11.2 Directory Structure & Responsibilities

```
src/
├── main.ts                # Boot sequence (auth init → profile fetch → mount)
├── App.vue                # Root: GlobalAlert + GlobalOverlay + RouterView
├── config.ts              # Static UI config (sidebar state, font, input background)
├── assets/                # Static media
├── components/
│   ├── shared/            # Global utility components
│   │   ├── GlobalAlert.vue     # Fixed-position toast alert renderer
│   │   ├── GlobalOverlay.vue   # Fullscreen overlay stack renderer
│   │   ├── GlobalTable.vue     # Reusable data table wrapper
│   │   ├── BaseBreadcrumb.vue  # Page header + breadcrumb + slot for actions
│   │   ├── ScrollContainer.vue # Perfect-scrollbar wrapper
│   │   ├── UiParentCard.vue    # Card wrapper with title slot
│   │   └── UiChildCard.vue     # Inner card for nested sections
│   ├── apps/              # App-specific shared components
│   └── forms/             # Form field components
├── composables/
│   ├── non-services/      # Pure UI logic composables
│   │   ├── useOverlayManager.ts  # Singleton overlay stack manager
│   │   ├── useAutoCarousel.ts    # Auto-advancing carousel logic
│   │   └── useSlideIndicator.ts  # Slide position tracking
│   ├── useBranchList.ts   # Fetch list of branches
│   ├── useCurrentOrder.ts # Fetch/create/update/delete orders
│   ├── useEmployeeActive.ts # Fetch currently active employees
│   ├── useFinanceSummary.ts # Fetch finance dashboard summary
│   ├── useFundRequest.ts  # Fetch/create/update/approve fund requests
│   ├── useInventoryItems.ts # Fetch/CRUD inventory items + categories
│   ├── useMenuItems.ts    # Fetch menu items (full + sales view) + categories
│   ├── useReservation.ts  # Fetch/create/update/delete reservations
│   ├── useShift.ts        # All shift operations (13 functions, 529 lines)
│   ├── useStockMovement.ts # Fetch/create stock movements
│   ├── useStockRequest.ts # Fetch/create/update/approve stock requests
│   ├── useTotalOrder.ts   # Fetch order count KPI
│   └── useUser.ts         # Fetch/CRUD employee accounts
├── layouts/
│   ├── full/FullLayout.vue     # Authenticated app shell
│   └── blank/                  # Empty layout for public pages
├── plugins/
│   ├── firebase.ts        # Firebase init with dev/prod env switching
│   ├── vuetify.ts         # Vuetify instance with PurpleTheme
│   └── mdi-icon.ts        # MDI icon aliases
├── router/
│   ├── index.ts           # Router creation + global beforeEach guard
│   ├── MainRoutes.ts      # Protected routes with role beforeEnter
│   └── PublicRoutes.ts    # Public routes (login, register, verify, error)
├── scss/
│   └── style.scss         # Global stylesheet entry
├── services/
│   ├── api.ts             # Axios instance + request/response interceptors
│   ├── auth/              # Auth API calls (register endpoint)
│   ├── common/            # Shared CRUD services (user, branch)
│   ├── currentReservation/ # Reservation API calls
│   ├── employeeActive/    # Active employee API calls
│   ├── finance/           # Finance summary + fund request API calls
│   ├── inventory/         # Inventory item + stock request API calls
│   ├── menu/              # Menu item API calls
│   ├── shift/             # All shift API calls (508-line service file)
│   └── totalOrder/        # Total order count API calls
├── stores/
│   ├── auth.ts            # Firebase auth state, login/register/logout/profile
│   ├── authUser.ts        # Employee profile (me) + current shift
│   ├── alert.ts           # Global alert/toast queue with deduplication
│   ├── customizer.ts      # UI customizer state (sidebar, mini, font)
│   └── counter.ts         # Demo/placeholder store
├── theme/
│   └── LightTheme.ts      # PurpleTheme color palette definition
├── types/                 # TypeScript interfaces/types (18 files)
│   ├── auth.ts, branch.ts, common.ts, customer.ts
│   ├── employee.ts        # Employee type + UserRole + AccessKey union types
│   ├── finance.ts         # Finance, FundRequest, Income, Expense types
│   ├── inventory.ts       # StockRequest, InventoryItem, StockMovement types
│   ├── menu.ts            # Menu, MenuSale, MenuCategory types
│   ├── order.ts           # Order, OrderItem, all payload types
│   ├── reservation.ts     # Reservation type
│   ├── shift.ts           # Shift, ShiftCashier, ShiftKitchen, ShiftWarehouse types
│   └── themeTypes/        # Vuetify theme type extension
├── utils/                 # Utility/helper functions (currency formatting, etc.)
└── views/
    ├── StarterPage.vue    # Fallback for unconfirmed accounts
    ├── authentication/    # Login, Register, EmailSent
    ├── dashboards/
    │   ├── owner/         # OwnerDashboard + components
    │   └── finance/       # FinanceDashboard + components
    └── pages/
        ├── cashier/       # CashierPage + components + sub-components
        ├── inventory/     # InventoryPage + components + sub-components
        ├── kitchen/       # KitchenPage + components
        ├── maintenance/   # Error pages
        ├── shift/         # Start.vue (shift start page, appears unused)
        └── user/          # User-related pages (if any)
```

### 11.3 Component Communication Patterns

**Pattern 1: Props-down, Refresh-up**
Pages pass data as props and pass `refresh` callback functions. Feature components call `refresh()` after mutations to trigger re-fetch at the page level.

**Pattern 2: Overlay Stack (Imperative)**
Sub-modals are opened with `useOverlayManager().openOverlay({ component, props })`. This is a **singleton** pattern — one global overlay stack rendered in `App.vue` via `GlobalOverlay.vue`.

**Pattern 3: Global Alerts**
Any component can call `useAlertStore().showAlert(message, type)` — displays a fixed-position toast at top-center, auto-dismisses in 3s, deduplicates identical alerts with a count badge.

**Pattern 4: Branch Selector**
Each page owns its own `selectedBranch` ref. A `v-select` in the `BaseBreadcrumb` header slot (desktop) or a sticky pill button (mobile) controls the branch. A `watch(selectedBranch)` triggers re-fetch of all data.

**Pattern 5: `show-only` Query Param**
Pages read `route.query['show-only']` with `computed()` and conditionally render widgets with `v-if`. This enables widget embedding without separate routes.

---

## 12. Design System

### 12.1 UI Framework
**Vuetify 3** — Material Design 3 component library, configured with custom PurpleTheme.

### 12.2 Color Palette (PurpleTheme)

| Token | Value | Usage |
|---|---|---|
| `primary` | `#1e88e5` | Primary actions, buttons, active states |
| `secondary` | `#5e35b1` | Secondary accents, badges |
| `info` | `#03c9d7` | Informational states |
| `success` | `#00c853` | Success alerts, completed states |
| `warning` | `#ffc107` | Warning alerts, low stock indicators |
| `error` | `#f44336` | Error alerts, destructive actions |
| `lightprimary` | `#eef2f6` | Background chips, light surfaces |
| `lightsecondary` | `#ede7f6` | Secondary light surfaces |
| `darkprimary` | `#1565c0` | Darker primary for headers/emphasis |
| `darksecondary` | `#4527a0` | Darker secondary |
| `containerBg` | `#eef2f6` | Page background |
| `surface` | `#fff` | Card/dialog surface |

### 12.3 Typography
- **Font:** Roboto (configured in `config.ts` as `fontTheme: 'Roboto'`)
- Vuetify's built-in text utilities: `text-h4`, `text-h5`, `text-subtitle-1`, `text-subtitle-2`, `text-medium-emphasis`, `text-disabled`

### 12.4 Vuetify Component Defaults

Configured in `src/plugins/vuetify.ts`:
- `VCard`: `rounded: 'md'`
- `VTextField`: `rounded: 'lg'`
- `VTooltip`: `location: 'top'`

### 12.5 Icon Sets
Three icon libraries available:
- **MDI Font** (`@mdi/font`) — primary, used with `mdi-*` class names
- **MDI JS** (`@mdi/js`) — SVG icon source for programmatic use
- **Tabler Icons** (`vue-tabler-icons`) — supplementary icon set, registered globally
- **Remix Icons** (`remixicon`) — available but less used

### 12.6 Responsive Strategy
- `useDisplay()` from Vuetify provides `mdAndUp` breakpoint reactive ref
- Two distinct layouts per page: desktop (sidebar left, content right) vs mobile (stacked, sticky branch selector pill)
- Mobile branch selector: `position: sticky; top: 90px; backdrop-filter: blur(1px)` glassmorphism pill
- Widget visibility: `v-if="mdAndUp"` toggles which layout variant renders

### 12.7 Design Patterns
- **Glassmorphism branch pill:** `bg-white bg-opacity-75 backdrop-blur-lg elevation-1`
- **PerfectScrollbar:** Used within modals and scrollable widget areas (`vue3-perfect-scrollbar`)
- **Expandable sections:** `v-expand-transition` for cart preview toggle in UpdateOrder
- **Loading states:** `:loading` prop on `v-btn`, `v-progress-circular` for full-page loads
- **Print support:** `vue3-print-nb` available for order receipts/reports

### 12.8 Design System Maturity
**Level: Intermediate-Functional.** The system uses Vuetify's component library consistently. There is no custom design token system beyond the single `LightTheme.ts` file. Component reuse is primarily through Vuetify primitives rather than a bespoke component library. `GlobalTable.vue`, `BaseBreadcrumb.vue`, `UiParentCard.vue`, and `UiChildCard.vue` form a minimal in-app shared component set.

---

## 13. State Management

### 13.1 Pinia Stores (Global)

**`auth.ts` — Auth Store**
- **State:** `user: FirebaseUser | null`, `loading: boolean`, `returnUrl: string | null`, `isAuthenticated: boolean`, `_handlingToken: boolean`, `_unsubscribeAuth: Function | null`
- **Key Actions:**
  - `initialize()` — Attaches `onIdTokenChanged` listener, awaits first resolution (used in main.ts boot)
  - `login(payload)` — Email/password sign-in, validates email verification + role existence
  - `loginWithGoogle()` — Google OAuth popup, auto-registers if employee not found
  - `register(payload)` — Firebase account creation + backend sync + email verification
  - `logout()` — Firebase sign-out, detach listener, clear all local state, redirect to `/login`
  - `changePassword()`, `changeEmail()`, `requestResetPassword()`, `resetPassword()` — Profile management

**`authUser.ts` — User Profile Store**
- **State:** `me: Employee | null`, `shift: Shift | null`, `loading: boolean`
- **Key Actions:**
  - `fetchMe()` — GET `/employee/me`, stores full employee object including `activity` (shift status, branch)
  - `fetchShift()` — GET `/shifts/me`
  - `hasRole(role | role[])` — Role check helper used extensively in templates and guards
  - `setNull()` — Clears state on logout

**`alert.ts` — Alert Store**
- **State:** `alerts: Alert[]`
- **Key Action:** `showAlert(message, type)` — Adds to queue, deduplicates same message+type combos with count increment, auto-removes after 3s, resets timer on duplicate

**`customizer.ts` — UI Customizer Store**
- **State:** sidebar drawer open/close, mini sidebar mode, theme settings
- Used by FullLayout to control sidebar behavior

### 13.2 Composable-Local State (Non-Store)

All feature data (orders, inventory, shifts, menus, etc.) is managed **inside composables** using `ref()`, NOT in Pinia stores. Each composable is factory-style (called with `useXxx()`), returning reactive refs and async functions.

**Why this matters:** Each call to `useShift()` within the same component instance shares data if the composable uses module-level state, but in this codebase, composables use local `ref()` inside the function body — meaning **each component that calls `useCurrentOrders()` gets its own isolated state**. This is intentional for avoiding cross-page state pollution.

**Exception:** `useOverlayManager` uses a module-level singleton pattern explicitly:
```typescript
let overlayManagerSingleton: ReturnType<typeof createOverlayManager> | null = null
export function useOverlayManager() {
  if (!overlayManagerSingleton) overlayManagerSingleton = createOverlayManager()
  return overlayManagerSingleton
}
```
This ensures one global overlay stack shared across all components.

---

## 14. Data Flow

### 14.1 API Layer Architecture

```
Component/Composable
  ↓ calls composable function (e.g. loadCurrentOrder())
Composable (useCurrentOrder.ts)
  ↓ calls service function (e.g. fetchCurrentOrders())
Service (currentOrderService.ts)
  ↓ builds URLSearchParams, calls api.get/post/put/delete
Axios Instance (api.ts)
  ↓ request interceptor: injects Firebase bearer token (soft)
REST API (VITE_API_URL backend)
  ↓ response
Response interceptor (api.ts)
  → 401/403: logout + redirect /login + alert
  → other error: alert with backend message
  ↓ returns response.data to service
Service returns typed response to composable
Composable stores in local ref, composable exposes ref to component
Component renders reactive data
```

### 14.2 Axios Configuration (`src/services/api.ts`)

- **Base URL:** `VITE_API_URL` environment variable
- **Auth:** `Authorization: Bearer <Firebase ID Token>` injected on every request via request interceptor
- **Token strategy:** `getIdTokenSoft()` — non-forced token fetch (no force-refresh). The commented-out `getIdTokenHardOnce()` is a prepared but disabled 401-retry-with-refresh mechanism.
- **Error handling:** Active response interceptor — 401/403 triggers immediate logout + redirect + alert. Other errors show alert with backend `message` field.
- **Anti-duplicate refresh:** `refreshPromise` singleton prevents multiple concurrent forced token refreshes (prepared, not active)

### 14.3 Query Parameter Pattern

All service functions follow a consistent signature:
```typescript
{
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>  // key-value pairs appended as query params
}
```

Filters are appended as individual `URLSearchParams` key-value pairs. Common filter keys: `branch_id`, `end` (null check for open shifts), etc.

### 14.4 API Endpoints (Inferred from Service Files)

| Domain | Endpoints |
|---|---|
| Employee | `GET /employee/me`, `GET /employees`, `POST /auth/register`, `PUT /employee-me` |
| Shift Employee | `GET /shift/employee/current`, `GET /shift/employees`, `POST /shift/employee/start`, `PUT /shift/employee/end` |
| Shift Cashier | `GET /shift/cashier/current`, `GET /shift/cashiers`, `POST /shift/cashier/:branchId/start`, `PUT /shift/cashier/:id`, `PUT /shift/cashier/:id/end` |
| Shift Kitchen | `GET /shift/kitchen/current`, `GET /shift/kitchens`, `POST /shift/kitchen/:branchId/start`, `PUT /shift/kitchen/:id`, `PUT /shift/kitchen/:id/manage-qty`, `PUT /shift/kitchen/:id/end` |
| Shift Warehouse | `GET /shift/warehouse/current`, `GET /shift/warehouses`, `POST /shift/warehouse/start`, `PUT /shift/warehouse/:id`, `PUT /shift/warehouse/:id/end` |
| Orders | `GET /orders/current`, `POST /orders`, `PUT /orders/:id`, `DELETE /orders/:id` |
| Finance | `GET /finance/summary`, `GET /finance/fund-requests`, `POST /finance/fund-requests`, `PUT /finance/fund-requests/:id` |
| Inventory | `GET /inventory/items`, `POST /inventory/items`, `PUT /inventory/items/:id`, `DELETE /inventory/items/:id` |
| Stock Requests | `GET /inventory/stock-requests`, `POST /inventory/stock-requests`, `PUT /inventory/stock-requests/:id` |
| Stock Movements | `GET /inventory/stock-movements`, `POST /inventory/stock-movements` |
| Menu | `GET /menus`, `GET /menus/sales`, `POST /menus`, `PUT /menus/:id`, `DELETE /menus/:id` |
| Branches | `GET /branches` |
| Reservations | `GET /reservations`, `POST /reservations`, `PUT /reservations/:id`, `DELETE /reservations/:id` |

### 14.5 Caching & Polling Strategy

**No automatic polling or WebSockets.** The application uses **manual refresh** — every widget that mutates data calls a `refresh()` prop (callback) after successful mutation. There is no client-side cache layer (no TanStack Query, no SWR equivalent). Data is re-fetched from the backend on every explicit refresh call.

**Implication:** Pages are freshest after user-initiated actions. Real-time updates (e.g., kitchen seeing new orders from cashier) require the kitchen user to manually refresh or navigate.

---

## 15. Authentication & Authorization

### 15.1 Authentication Architecture

The app uses **Firebase Authentication as the identity provider** with a **dual-validation model**:

1. **Firebase Auth** — Identity/session management (email verification, JWT tokens, Google OAuth)
2. **Backend Employee API** — Role and branch assignment (the backend owns who has what role)

A user can have a Firebase account but no role in the backend (pending owner approval). This two-gate system is intentional.

### 15.2 Auth State Machine

```
State: Loading (boot)
  ↓ onIdTokenChanged fires
State: Authenticated OR Unauthenticated

Authenticated path:
  ├── Email not verified → /verify-email
  ├── Role is null → /starter (pending approval)
  └── Role present → role-based redirect

Session persistence:
  - indexedDBLocalPersistence (primary)
  - browserLocalPersistence (fallback)
  → Sessions persist across page reloads
```

### 15.3 Token Injection

The Axios request interceptor calls `getIdTokenSoft()` (non-forced Firebase `getIdToken()`) before every request. If a token exists, it's injected as `Authorization: Bearer <token>`. **The 401 auto-retry with force-refresh is implemented but commented out** — currently, any 401/403 causes immediate logout.

### 15.4 Role-Based Access Control (RBAC)

**Frontend RBAC is UI-level only** — routes are protected by the `beforeEach` guard comparing `userStore.me.role` against `to.meta.requiredRoles`. The backend must also enforce its own authorization.

**Roles and permissions defined in `src/types/employee.ts`:**
```typescript
type UserRole = 'admin' | 'pemilik' | 'bendahara' | 'gudang' | 'dapur' | 'kasir'
```

The `AccessKey` union type documents fine-grained permission semantics (e.g., `'r:active-employee'`, `'c:fund-request'`) but is not enforced via a permission-checking function in the frontend — role checks are done with `userStore.hasRole(role | role[])`.

### 15.5 Route-Level Protection

- `meta.requiresAuth: true` on `MainRoutes` parent — triggers auth check
- `meta.requiredRoles: string[]` on individual routes — role validation in global guard
- LandingPage `beforeEnter` guard handles role-based routing to the correct workspace

---

## 16. External Integrations

### 16.1 Firebase Authentication
| Aspect | Details |
|---|---|
| **Purpose** | Identity management, session persistence, OAuth |
| **Features used** | Email/password auth, Google Sign-In (popup), email verification, password reset, email change (verify before update), re-authentication, onIdTokenChanged listener |
| **Config** | Dual env support: `VITE_FIREBASE_*` (prod) and `VITE_FIREBASE_*_DEV` (dev). Switched by `VITE_NODE_ENV === 'dev'` |
| **Persistence** | IndexedDB (primary) → LocalStorage (fallback) |
| **Dependency level** | **Mission Critical** — entire auth system depends on Firebase |
| **Risk** | Firebase outage = complete auth failure; Firebase pricing changes = cost risk |

### 16.2 Midtrans (Payment Gateway)
| Aspect | Details |
|---|---|
| **Purpose** | Customer-facing digital payment (credit card, e-wallet, bank transfer via snap) |
| **Integration model** | Server-generated `snap_token` stored on `Order` object. Frontend triggers `window.snap.pay(token)` |
| **Client key** | `VITE_MIDTRANS_CLIENT_KEY_DEV` (dev key configured; prod key not in README template) |
| **Flow** | Backend creates payment → returns snap_token → `Payment.vue` triggers snap popup → handles success/failure callbacks |
| **Dependency level** | **Business Critical** — required for digital payment processing |
| **Risk** | Midtrans availability; snap.js CDN dependency (loaded via script tag, not npm) |

### 16.3 ApexCharts
| Aspect | Details |
|---|---|
| **Purpose** | Financial data visualization (income/expense bar charts, trend sparklines) |
| **Integration** | `vue3-apexcharts` wrapper, registered globally as `VueApexCharts` component |
| **Usage** | `TotalExpense.vue`, `TotalIncome.vue`, `TotalOrder.vue` in Finance Dashboard |
| **Dependency level** | Important — Finance dashboard charts |

### 16.4 Railway (Deployment Platform)
| Aspect | Details |
|---|---|
| **Purpose** | Production hosting for both internal and customer apps |
| **Build** | Docker container; `npm run build` → `serve -s dist -l tcp://0.0.0.0:$VITE_PORT` |
| **URLs** | Internal: `internalposnurchs.up.railway.app` | Customer: `nurchs.up.railway.app` |

---

## 17. Operational Workflows

### 17.1 Shift Lifecycle (The Core Operational Unit)

Every operational activity in the system is scoped to a **shift**. There are four shift types:

| Shift Type | Who | Start Data | End Data | Tracks |
|---|---|---|---|---|
| ShiftEmployee | All staff | (none — auto) | (none) | Clock-in/out time, branch |
| ShiftCashier | Kasir | `branch_id`, `initial_cash` | `actual_cash` | Cash in/out, payments, orders, income, expenses |
| ShiftKitchen | Dapur | `branch_id`, `initial_menu[]` | `final_menu[]`, `notes` | Menu quantities, restock requests, order stats |
| ShiftWarehouse | Gudang | (none) | `notes` | Fund requests, stock movements |

**Operational gate:** Pages check `userStore.me.activity.is_active` (shift employee active) AND `shift_op.start` / `.end` state. If checks fail, operational UI is hidden and a warning is shown.

### 17.2 Fund Request Lifecycle

```
Gudang creates FundRequest (subject, description, items + quantities, amount)
  → Status: Pending

Bendahara reviews in FinanceDashboard → CurrentFundRequest widget
  → Approves/rejects items individually (items: { id, approved: boolean })
  → Sets approval_notes, total_approved
  → Status transitions: Pending → Disetujui / Beberapa Disetujui / Ditolak → Selesai
```

### 17.3 Stock Request Lifecycle

```
Dapur creates StockRequest (branch_id, items + quantities, note)
  → Status: Pending

Gudang reviews in InventoryPage → CurrentStockRequestList
  → Approves/rejects items (items: { id, approved: boolean }, note)
  → Item status: Pending → Siap / Diproses / Ditolak
  → Request status: Pending → Diproses → Siap → Selesai / Ditolak
```

### 17.4 Order Status Lifecycle

```
Order Status: Pending → Diproses → Tersaji → Selesai
                                          ↘ Batal
                                          ↘ Refund (partial refund of items)

Order Item Status: Pending → Diproses → Tersaji
                                      ↘ Batal
                                      ↘ Refund

Payment Status: Pending → Lunas
                        ↘ Gagal
                        ↘ Batal
```

---

## 18. Business Critical Features

| Feature | Classification | Business Impact | Failure Impact |
|---|---|---|---|
| Firebase Authentication | **Mission Critical** | No access to any part of the system | Complete system outage |
| Role-based routing | **Mission Critical** | Each user gets to their workspace | Wrong users see wrong data |
| Cashier order creation | **Mission Critical** | Core revenue-generating action | Cannot take orders; revenue halt |
| Kitchen order queue | **Mission Critical** | Fulfillment depends on it | Kitchen cannot see what to cook |
| Shift start/end | **Mission Critical** | Gates all operational features | Staff cannot work |
| Payment processing (Midtrans) | **Business Critical** | Digital payments for customers | Cash-only fallback; revenue impact |
| Stock request approval | **Business Critical** | Kitchen cannot restock without warehouse approval | Kitchen runs out of food |
| Finance dashboard | **Business Critical** | Owner/treasurer financial oversight | No financial visibility |
| Inventory management | **Business Critical** | Accurate stock levels | Stockouts, waste, inaccurate reporting |
| Fund request approval | **Business Critical** | Warehouse cannot buy supplies | Supply chain break |
| Owner management panel | **Important** | Employee/branch/menu configuration | Admin overhead increases |
| Reservation management | **Important** | Table booking management | Manual fallback |
| Employee active widget | **Supporting** | Operational awareness | Less visibility only |
| Timesheets | **Supporting** | HR records | Offline tracking needed |
| Shift list / reports | **Supporting** | Post-shift audit | Reports delayed |

---

## 19. Engineering Assessment

### 19.1 Code Quality Strengths

1. **Type Safety:** Full TypeScript throughout with well-defined domain types in `src/types/`. The `AccessKey` union type demonstrates intent to model fine-grained permissions.
2. **Service Layer Separation:** All HTTP calls isolated to `src/services/`. Components never call Axios directly.
3. **Composable Abstraction:** Business logic is extracted into composables, keeping views clean.
4. **Singleton Overlay Manager:** `useOverlayManager` is a well-thought-out pattern for app-wide modal management without prop-drilling or store pollution.
5. **Alert Deduplication:** `alert.ts` handles duplicate messages with count tracking — a production-quality UX detail.
6. **Auth Boot Sequence:** The main.ts sequential initialization pattern prevents race conditions between auth resolution and routing.
7. **Role Guard Architecture:** Multi-step router guard with proper loading wait is robust.

### 19.2 Code Quality Weaknesses / Technical Debt

1. **Import Order Bug in InventoryPage.vue:** `import` statements appear after `onMounted()` and `ref()` usages (lines 54-57). This is a Vue composition API anti-pattern — imports must be at the top. While Vite may hoist these, it's fragile.
2. **Commented-out Auto-retry:** The more sophisticated 401 auto-refresh interceptor is fully implemented but commented out. Current behavior (immediate logout on any 401) is more fragile for token expiry mid-session.
3. **No Polling/WebSocket:** Real-time collaboration between roles (cashier creates order, kitchen sees it) requires manual refresh. For a restaurant context this is a significant operational gap.
4. **Large Single Components:** `ShiftList.vue` is 66KB, `UpdateOrder.vue` is 24KB, `DetailOrder.vue` is 17KB. These could be split further.
5. **No Test Coverage:** No test files found anywhere in the repository. Zero automated tests.
6. **Service Error Handling:** Several service functions catch errors and return empty objects/arrays silently (e.g., `return {} as ShiftCashier`) instead of propagating — can mask backend errors.
7. **`checkAuthentication()` Orphan:** The `auth.ts` store has a `checkAuthentication()` action that reads from localStorage but appears unused — the `initialize()` method replaced it.
8. **`counter.ts` Placeholder Store:** Scaffold leftover, unused.
9. **Disabled UI sections in commented routes:** Several utility/dev routes (Icons, Typography, Colors) are commented out in `MainRoutes.ts` — cleanup opportunity.
10. **No form validation library integration in most forms:** `vee-validate` and `yup` are in dependencies but most forms use raw Vuetify `v-form` with inline rules arrays.

### 19.3 Scalability Assessment

- **Per-role single-page design** is naturally scalable for adding new widgets to existing pages
- **Adding a new role** requires: new route in `MainRoutes.ts`, new view in `src/views/`, new `hasRole()` check in landing page guard, new Vuetify sidebar entry
- **Multi-branch filter** is implemented on every page — scales to N branches
- **No global data cache** means N×requests on every page load; this grows linearly with data volume

---

## 20. Architectural Decisions

### AD-01: Composition API Exclusively
**Decision:** All components use `<script setup>` with Composition API.
**Rationale:** Vue 3's recommended approach; better TypeScript integration; composables replace mixins.

### AD-02: Pinia with Minimal Global State
**Decision:** Only auth, user profile, alerts, and UI customizer are in Pinia. All feature data lives in composable-local refs.
**Rationale:** Prevents tight coupling between unrelated features. Each page is self-contained. Avoids stale state from other pages.

### AD-03: Firebase as Auth Provider
**Decision:** Firebase handles identity; backend handles role/profile.
**Rationale:** Firebase provides OAuth, email verification, token refresh, and persistence out of the box. The two-gate model (Firebase email + backend role) prevents unauthorized access even after account creation.

### AD-04: Vuetify 3 as UI Framework
**Decision:** Vuetify over Tailwind or bare HTML.
**Rationale:** Material Design component completeness (data tables, overlays, snackbars, progress indicators) accelerates development. The thesis timeline demanded rapid UI construction.

### AD-05: Imperative Overlay Pattern
**Decision:** `useOverlayManager` singleton stack instead of per-component `v-dialog` v-model.
**Rationale:** Enables nested overlays (e.g., opening Payment overlay from within UpdateOrder overlay). Centralizes overlay state. Enables "confirm before close" UX across all modals.

### AD-06: Manual Refresh over Polling
**Decision:** No automatic data polling or WebSockets.
**Rationale:** Simplicity for a thesis project. Reduces backend load. For a production system, SSE or polling would be needed for real-time kitchen display.

### AD-07: `show-only` Query Param for Widget Isolation
**Decision:** Single route per role, with `?show-only=` for mobile single-widget view.
**Rationale:** Avoids creating 10+ granular routes. Mobile UX can focus on one panel. Allows deep-linking to a specific widget.

### AD-08: Dual Firebase Environment
**Decision:** Separate Firebase project for dev (`_DEV` env vars) and prod.
**Rationale:** Prevents development data from polluting production Firebase users and auth state. Clean production environment.

---

## 21. Technical Constraints

1. **Bahasa Indonesia UI:** All copy, messages, and labels are in Indonesian. Any new UI text must follow this convention.
2. **Shift Gate:** Operational pages (Cashier, Kitchen, Warehouse) are gated by shift status. Any new feature in these pages must respect the `is_active` and `shift_op.start` checks.
3. **Role-locked routes:** New routes added to `MainRoutes.ts` must include `meta.requiredRoles` to prevent cross-role access.
4. **Firebase JWT for all API calls:** The backend expects `Authorization: Bearer <firebase_id_token>`. Custom auth headers must not override this.
5. **Single-page design per role:** Each role has exactly one route/workspace. Features must fit into the existing page or be opened as overlay sub-components.
6. **Vuetify 3 only:** No other CSS framework. No Tailwind. Styling is via Vuetify classes + scoped `<style>` blocks.
7. **Indonesian locale only:** No i18n library; internationalization would be a major addition.
8. **No backend access in this repo:** This is frontend-only. Backend API URL is env-configured. Cannot modify backend behavior from this codebase.

---

## 22. Known Risks

| Risk | Severity | Description |
|---|---|---|
| No automated tests | **High** | Any refactoring risks regression with no safety net |
| No real-time updates | **High** | Kitchen and cashier can be out of sync; requires manual refresh |
| 401 hard logout | **Medium** | Token expiry mid-session logs user out abruptly without auto-retry |
| Large components | **Medium** | `ShiftList.vue` (66KB) and `UpdateOrder.vue` (24KB) are hard to maintain |
| Firebase dependency | **Medium** | Single auth provider with no fallback |
| Silent service errors | **Medium** | Several services catch and swallow errors, returning empty data |
| Import order bug | **Low** | `InventoryPage.vue` has imports after statements — works but fragile |
| No form validation library | **Low** | `vee-validate`/`yup` installed but underused; inline rules are ad-hoc |
| Midtrans snap.js CDN | **Low** | Snap.js loaded externally; CDN outage breaks payment flow |

---

## 23. Future Evolution Opportunities

1. **Real-time order updates** — Add Server-Sent Events (SSE) or WebSocket subscription for kitchen and cashier to see live order status changes without manual refresh
2. **Activate 401 auto-retry** — Uncomment and re-enable the `getIdTokenHardOnce` refresh interceptor for better session resilience
3. **Form validation with Vee-Validate + Yup** — Standardize form validation using the already-installed libraries for consistent error handling
4. **Automated testing** — Add Vitest unit tests for composables and services; Cypress/Playwright for critical E2E flows
5. **Component splitting** — Break up `ShiftList.vue` (66KB) into smaller focused sub-components
6. **Polling or SSE for Kitchen Display** — Kitchen page should auto-refresh every 30-60 seconds for real restaurant use
7. **Permission-based UI** — Use the `AccessKey` type definitions already in `employee.ts` to drive fine-grained UI visibility (e.g., show/hide specific actions based on access keys)
8. **Pinia persist plugin** — `pinia-plugin-persistedstate` could persist user profile and avoid `fetchMe()` on every reload
9. **PWA support** — Add service worker + manifest for installable mobile experience (critical for kitchen/warehouse workers on tablets)
10. **Print optimization** — `vue3-print-nb` is installed; build proper receipt/report print templates

---

## 24. AI Agent Implementation Guide

### 24.1 How to Add a New Widget to an Existing Dashboard

**Example: Adding a new KPI widget to the Owner Dashboard**

1. **Create the feature component** in `src/views/dashboards/owner/components/NewWidget.vue`
2. **Create a composable** in `src/composables/useNewData.ts` following the pattern:
   ```typescript
   export function useNewData() {
     const data = ref<YourType | null>(null)
     const loading = ref(false)
     async function load(params?: {...}) {
       loading.value = true
       try {
         data.value = await yourService(params)
       } finally {
         loading.value = false
       }
     }
     return { data, loading, load }
   }
   ```
3. **Create a service function** in `src/services/yourDomain/yourService.ts` that calls `api.get()` from `src/services/api.ts`
4. **Add the type** in `src/types/yourType.ts`
5. **Import and use in `OwnerDashboard.vue`:**
   - Add `const { load: loadNew, data: newData, loading: ln } = useNewData()`
   - Call `loadNew()` in `onMounted()` and in the branch `watch(selectedBranch)` handler
   - Add `<NewWidget :data="newData" :loading="ln" />` inside a `<v-col>` in the template
   - If hideable: wrap with `v-if="!visibleComponent || visibleComponent === 'your-key'"`
   - Add the key to the show-only table in the IA section

### 24.2 How to Add a Sub-Modal (Overlay)

**Example: Adding an "Export Report" modal to Finance Dashboard**

1. **Create the modal component** in `src/views/dashboards/finance/components/ExportReport.vue`
2. **Emit `'close'`** on completion: `const emit = defineEmits(['close'])`
3. **Use `defineProps`** for any data needed
4. **Open it from the parent** using `useOverlayManager`:
   ```typescript
   import { useOverlayManager } from '@/composables/non-services/useOverlayManager'
   import ExportReport from './components/ExportReport.vue'
   
   const { openOverlay } = useOverlayManager()
   
   function openExportReport() {
     openOverlay({
       component: ExportReport,
       props: {
         data: summaryData.value,
         confirmBeforeClose: true, // asks "discard changes?" on close
         refresh: () => loadSummary()
       }
     })
   }
   ```
5. The `GlobalOverlay.vue` in `App.vue` will render it automatically

### 24.3 How to Add a New Role

1. Add the role string to `UserRole` type in `src/types/employee.ts`
2. Add a new route in `src/router/MainRoutes.ts` with `meta.requiredRoles: ['admin', 'pemilik', 'newrole']`
3. Create the new view page in `src/views/pages/newrole/NewRolePage.vue`
4. Add role redirect in `MainRoutes.ts` `LandingPage.beforeEnter` guard
5. Add role redirect in `router/index.ts` global guard if needed
6. Create the sidebar entry in `src/layouts/full/vertical-sidebar/`
7. Create composables and services as needed

### 24.4 Patterns to Preserve

| Pattern | Description | Where |
|---|---|---|
| **Branch selector** | Every page with multi-branch data has a `selectedBranch` ref + `watch` + `v-select` in BaseBreadcrumb | All pages |
| **Shift gate** | Check `is_active` before rendering operational UI | Cashier, Kitchen, Inventory pages |
| **Refresh callback** | Pass `refresh` prop down to sub-components | All feature components |
| **show-only query param** | Use `route.query['show-only']` for widget isolation | All dashboards |
| **Alert via store** | Always use `useAlertStore().showAlert()` for user feedback | All mutations |
| **Loading states** | Always expose and use `loading` ref in composables | All composables |
| **Indonesian language** | All UI text must be in Bahasa Indonesia | All templates |

### 24.5 Anti-Patterns to Avoid

| Anti-pattern | Why | Correct Approach |
|---|---|---|
| Direct `axios` import in components | Breaks auth injection | Always import `api` from `@/services/api` |
| Pinia store for feature data | Pollutes global state | Use composable-local `ref()` |
| `v-dialog` with local v-model for complex modals | Misses "confirm before close" and nesting | Use `useOverlayManager().openOverlay()` |
| Hard-coded role strings in templates | Fragile, untyped | Use `userStore.hasRole('kasir')` |
| Inline API calls in components | Bypasses service layer | Create a service function |
| Blocking mount on data fetch | Slows initial render | Use `onMounted()` + non-blocking `load()` calls |
| Adding imports after statements | Breaks module semantics | Always import at top of `<script setup>` |

### 24.6 Key Files for Common Tasks

| Task | Primary File(s) |
|---|---|
| Add a new API endpoint | `src/services/<domain>/yourService.ts` |
| Add a new TypeScript type | `src/types/<domain>.ts` |
| Modify auth logic | `src/stores/auth.ts` |
| Modify user profile access | `src/stores/authUser.ts` |
| Add a new route | `src/router/MainRoutes.ts` or `PublicRoutes.ts` |
| Modify the color palette | `src/theme/LightTheme.ts` |
| Add a global alert | Call `useAlertStore().showAlert()` anywhere |
| Open a modal overlay | Call `useOverlayManager().openOverlay()` anywhere |
| Modify Vuetify component defaults | `src/plugins/vuetify.ts` |
| Add a Firebase feature | `src/plugins/firebase.ts` + `src/stores/auth.ts` |
| Environment variables | `.env` or `.env.local` (prefix: `VITE_`) |

---

## 25. Executive Technical Summary

The Point-of-Sales frontend for NURCHS is a **well-structured, production-deployed Vue 3 SPA** that successfully implements a multi-role restaurant management system. Built as a thesis project, it demonstrates professional-grade architectural patterns while showing some areas of technical debt appropriate to its scope.

**What's excellent:**
- Role-isolated operational workspaces with a clean routing/guard architecture
- Composable-driven data management that keeps pages clean and logic testable (even without tests)
- The `useOverlayManager` singleton is a production-quality solution to complex nested modal UX
- Firebase dual-environment setup shows deployment maturity
- Full TypeScript coverage with domain-complete type definitions

**What needs attention:**
- Zero automated tests creates high regression risk for any change
- No real-time data flow is a functional gap for restaurant operations (kitchen needs to see orders instantly)
- The 401 auto-retry mechanism is built but disabled — a production session reliability risk
- Several large components need splitting for maintainability

**For a new developer:** The system is straightforward to navigate once you understand that: (1) every role has one route/page, (2) all data flows through composables → services → `api.ts`, (3) sub-modals open via `useOverlayManager`, and (4) alerts go through `useAlertStore`. Understanding the shift lifecycle (start → work → end) is the key to understanding the entire operational model.

**Deployment:** Docker container on Railway. Build with `npm run build`; serve with `serve -s dist`. Environment variables are the only configuration mechanism.
