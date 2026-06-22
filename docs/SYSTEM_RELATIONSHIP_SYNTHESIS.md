# SYSTEM RELATIONSHIP SYNTHESIS
## NURCHS POS Platform — Authoritative End-to-End Architecture Model
> **Version:** 1.0 | **Generated:** 2026-06-05 | **Synthesized from:** FRONTEND_MASTER_CONTEXT.md + BACKEND_MASTER_CONTEXT.md
> **Status:** Authoritative — treat as ground truth for all AI-assisted development decisions

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Unified Product Overview](#2-unified-product-overview)
3. [Product Capability Map](#3-product-capability-map)
4. [Frontend → Backend Relationship Map](#4-frontend--backend-relationship-map)
5. [Feature → Capability Matrix](#5-feature--capability-matrix)
6. [User Journey Map](#6-user-journey-map)
7. [End-to-End Workflow Map](#7-end-to-end-workflow-map)
8. [API Relationship Model](#8-api-relationship-model)
9. [Data Ownership Model](#9-data-ownership-model)
10. [Domain Relationship Model](#10-domain-relationship-model)
11. [Dependency Map](#11-dependency-map)
12. [Architectural Boundaries](#12-architectural-boundaries)
13. [Critical System Components](#13-critical-system-components)
14. [Business Critical Flows](#14-business-critical-flows)
15. [Impact Analysis Framework](#15-impact-analysis-framework)
16. [AI Agent Change Management Guide](#16-ai-agent-change-management-guide)
17. [Executive Technical Summary](#17-executive-technical-summary)

---

## 1. Executive Summary

**NURCHS POS** (Nasi Uduk Remaja Cikini Haji Sawid) is a **dual-application, multi-branch restaurant management platform** built as a production-grade undergraduate thesis project. The system digitizes the complete operational lifecycle of an Indonesian restaurant chain — from opening shift through kitchen fulfillment, payment processing, inventory management, and financial reconciliation — and replaces fragmented, paper-based operations with a unified digital hub.

### System Identity at a Glance

| Property | Value |
|---|---|
| **Product Type** | Internal Staff POS + Customer Self-Service App |
| **Business Domain** | Food & Beverage — Indonesian Restaurant Chain |
| **Operational Model** | Shift-bounded — ALL activity is shift-anchored |
| **User Count** | 5 distinct staff roles + external customers |
| **Branch Model** | Multi-branch, centralized management |
| **Language** | Bahasa Indonesia (all UI and messages) |
| **Frontend** | Vue 3 + Vuetify 3 SPA (TypeScript, Vite, Pinia) |
| **Backend** | Node.js 18 / Express 5 REST API (JavaScript, Sequelize 6, MySQL 8.0) |
| **Auth** | Firebase Authentication (JWT, Email/Password, Google OAuth) |
| **Payment** | Midtrans Snap API |
| **Deployment** | Railway (Production) + Docker Compose (Local) |

### The Core Organizing Principle

> **The shift is the operational unit.** Every transaction, order, payment, stock movement, and financial record is anchored to a time-bounded shift. Without an active shift, operational staff cannot perform their primary functions. Understanding the shift lifecycle is the key to understanding the entire system.

---

## 2. Unified Product Overview

### 2.1 Dual Application Architecture

The platform comprises two distinct frontend applications backed by the same single backend API:

```
┌─────────────────────────────────────────────────────────────────┐
│                    NURCHS POS PLATFORM                          │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │   INTERNAL POS APP          │  │   CUSTOMER APP          │  │
│  │   internalposnurchs.        │  │   nurchs.up.railway.app │  │
│  │   up.railway.app            │  │                         │  │
│  │                             │  │   - Browse menu         │  │
│  │   - Owner Dashboard         │  │   - Place orders        │  │
│  │   - Finance Dashboard       │  │   - Make reservations   │  │
│  │   - Cashier Workspace       │  │   - Pay via Midtrans    │  │
│  │   - Kitchen Workspace       │  │                         │  │
│  │   - Warehouse Workspace     │  │   [Not this repository] │  │
│  │                             │  │                         │  │
│  │   [Point-of-Sales repo]     │  │                         │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                        │                        │               │
│                        └────────────┬───────────┘               │
│                                     ▼                           │
│                   ┌─────────────────────────────┐               │
│                   │     pos-service BACKEND API  │               │
│                   │     (Single monolith)         │               │
│                   │     Railway / MySQL 8.0       │               │
│                   └─────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

> **Scope of this document**: The Internal POS (`Point-of-Sales` repository) and the `pos-service` backend. The Customer App is a separate frontend repository consuming the same backend via its public API routes.

### 2.2 Business Purpose

The system exists to answer one business problem:

> *How does a multi-branch Indonesian restaurant chain achieve operational coordination, financial visibility, and inventory control across all departments without paper-based or disconnected tools?*

**The answer the system delivers:**
- Each role gets a purpose-built digital workspace, accessible only to that role
- All activities (orders, payments, stock movements) are anchored to shifts for auditability
- The owner gets a real-time consolidated view across all branches
- Financial reconciliation is automatic from operational data

### 2.3 Primary User Types & Their Business Concerns

| Role | Indonesian Term | Primary Concern | System Gate |
|---|---|---|---|
| **Owner/Admin** | Pemilik / Admin | Full operational + financial visibility across branches | None — full access |
| **Treasurer** | Bendahara | Revenue vs expense reconciliation, fund approvals | Finance dashboard |
| **Cashier** | Kasir | Fast order creation and payment processing | Active cashier shift required |
| **Kitchen** | Dapur | Real-time order queue + stock visibility | Active kitchen shift required |
| **Warehouse** | Gudang | Inventory accuracy + stock/fund request management | Active warehouse shift required |
| **Customer** | (external) | Self-service ordering and reservations | Firebase customer auth |

---

## 3. Product Capability Map

Each capability represents a cohesive business function delivered by coordinated frontend and backend components.

### Capability Hierarchy

```
NURCHS POS PLATFORM
│
├── [MISSION CRITICAL]
│   ├── C1: Authentication & Role Access Control
│   ├── C2: Shift Lifecycle Management
│   ├── C3: Order Management & Kitchen Fulfillment
│   └── C4: Payment Processing
│
├── [BUSINESS CRITICAL]
│   ├── C5: Inventory Management
│   ├── C6: Financial Reporting & Summaries
│   ├── C7: Menu & Catalog Management
│   └── C8: Fund Request Approval Workflow
│
└── [IMPORTANT]
    ├── C9: Reservation Management
    ├── C10: Employee & Branch Management
    ├── C11: Stock Request Workflow (Kitchen ↔ Warehouse)
    └── C12: Attendance & Timesheet Tracking
```

### Capability Definitions

#### C1: Authentication & Role Access Control
| Attribute | Value |
|---|---|
| **Purpose** | Verify identity, map to role, route to correct workspace |
| **Business Value** | Each employee sees and can only act within their operational domain |
| **Frontend** | Firebase Auth → JWT token → Pinia authStore → router guards |
| **Backend** | Firebase Admin SDK verification → employee profile lookup → role enforcement |
| **Entities** | User, Employee (with `role`, `fk_branch_id`) |
| **Criticality** | Mission Critical — gates the entire system |
| **Failure Impact** | Complete system inaccessibility |

#### C2: Shift Lifecycle Management
| Attribute | Value |
|---|---|
| **Purpose** | Create time-bounded operational windows for each department |
| **Business Value** | All records are session-scoped for daily reconciliation and auditability |
| **Frontend** | StartShift, UpdateShift, EndShift overlays on each operational page |
| **Backend** | Four shift types (Employee, Cashier, Kitchen, Warehouse) with lifecycle enforcement |
| **Entities** | EmployeeShift, CashierShift, KitchenShift, KitchenShiftDetail, WarehouseShift |
| **Criticality** | Mission Critical — orders CANNOT exist without active Kitchen + Cashier shifts |
| **Failure Impact** | Staff cannot begin work; all operational capabilities blocked |

#### C3: Order Management & Kitchen Fulfillment
| Attribute | Value |
|---|---|
| **Purpose** | Record customer purchases, dispatch to kitchen, track status to completion |
| **Business Value** | Revenue generation + kitchen coordination — the core restaurant transaction |
| **Frontend** | CashierPage (create/pay), KitchenPage (status update), shared CurrentOrderQue |
| **Backend** | Order service with transactional create, status update, and stock decrement |
| **Entities** | Order, OrderItem, RefundItem, KitchenShiftDetail (stock ledger) |
| **Criticality** | Mission Critical |
| **Failure Impact** | Revenue halts; kitchen has no work queue |

#### C4: Payment Processing
| Attribute | Value |
|---|---|
| **Purpose** | Settle orders via cash or Midtrans digital payment |
| **Business Value** | Revenue collection with audit trail per cashier shift |
| **Frontend** | Payment.vue overlay (snap token flow + direct cash), Midtrans snap.js |
| **Backend** | OrderPayment record, Midtrans Snap token generation, webhook confirmation |
| **Entities** | OrderPayment, CashierShift (anchors payments) |
| **External** | Midtrans Snap API |
| **Criticality** | Mission Critical for cash; Business Critical for digital |
| **Failure Impact** | Cash fallback still works; digital payment broken |

#### C5: Inventory Management
| Attribute | Value |
|---|---|
| **Purpose** | Track warehouse raw material quantities, costs, and expiry |
| **Business Value** | Prevent stockouts; feed cost data into financial reporting |
| **Frontend** | InventoryPage — InventoryItems, StockMovement widgets |
| **Backend** | InventoryItem CRUD + StockMovement service (atomic quantity adjustment) |
| **Entities** | InventoryItem, StockMovement, WarehouseShift (anchor) |
| **Criticality** | Business Critical |
| **Failure Impact** | Warehouse operations blind; financial cost data inaccurate |

#### C6: Financial Reporting & Summaries
| Attribute | Value |
|---|---|
| **Purpose** | Aggregate revenue, expenses, and net income per period and branch |
| **Business Value** | Business performance visibility for owner and treasurer |
| **Frontend** | FinanceDashboard — TotalEarning, TotalIncome, TotalExpense (ApexCharts) |
| **Backend** | `/finance-summary` — computed from OrderPayment + CashierShiftCashOut + FundRequestItem |
| **Entities** | OrderPayment, CashierShiftCashOut, FundRequestItem (sources); no stored summary table |
| **Criticality** | Important (critical for decisions); does not block operations |
| **Note** | Financial summary is always **recomputed** — never stored; reflects real-time state |

#### C7: Menu & Catalog Management
| Attribute | Value |
|---|---|
| **Purpose** | Define sellable items, prices, and categories per branch |
| **Business Value** | Accurate menu for cashier ordering + kitchen shift stock initialization |
| **Frontend** | Owner Dashboard → Management modal → DetailMenu sub-component |
| **Backend** | Menu CRUD, Category CRUD, branch-scoped |
| **Entities** | Menu, Category (type='menu'), Branch |
| **Criticality** | Business Critical — menu drives KitchenShiftDetail initialization |
| **Failure Impact** | New items cannot be added; stale menu causes ordering errors |

#### C8: Fund Request Approval Workflow
| Attribute | Value |
|---|---|
| **Purpose** | Controlled budget approval for warehouse procurement |
| **Business Value** | Financial governance over purchasing; feeds expense reporting |
| **Frontend** | Warehouse: CurrentFundRequest (create). Finance Dashboard: CurrentFundRequest (approve) |
| **Backend** | FundRequest CRUD with per-item approval logic |
| **Entities** | FundRequest, FundRequestItem, InventoryItem (referenced), WarehouseShift (anchor) |
| **Criticality** | Important |
| **Failure Impact** | Warehouse cannot procure supplies through approved channel |

#### C9: Reservation Management
| Attribute | Value |
|---|---|
| **Purpose** | Table booking by customers or staff |
| **Business Value** | Capacity planning, customer experience |
| **Frontend** | Owner Dashboard → CurrentReservation widget + UpdateReservation modal |
| **Backend** | Reservation CRUD; employee-created = auto-approved; customer-created = Pending |
| **Entities** | Reservation, Customer, Branch |
| **Criticality** | Important |

#### C10: Employee & Branch Management
| Attribute | Value |
|---|---|
| **Purpose** | CRUD for employee accounts, role assignment, branch configuration |
| **Business Value** | System administration — who can access what and where |
| **Frontend** | Owner Dashboard → Management widget → DetailAccount, DetailBranch sub-modals |
| **Backend** | Employee CRUD + Firebase user deletion; Branch CRUD |
| **Entities** | Employee, Branch, User (via Firebase UID) |
| **Criticality** | Important — failure blocks onboarding new staff |

#### C11: Stock Request Workflow
| Attribute | Value |
|---|---|
| **Purpose** | Formal inter-department ingredient request from kitchen to warehouse |
| **Business Value** | Controlled ingredient flow with accountability |
| **Frontend** | Kitchen: CurrentStockRequestList (create). Warehouse: CurrentStockRequestList (approve) |
| **Backend** | StockRequest multi-step status workflow with per-item approval |
| **Entities** | StockRequest, StockRequestItem, KitchenShift, WarehouseShift (both required) |
| **Criticality** | Important |
| **Note** | Stock requests are coordination records only — do NOT auto-update InventoryItem.quantity |

#### C12: Attendance & Timesheet Tracking
| Attribute | Value |
|---|---|
| **Purpose** | Employee clock-in/out records, daily/weekly/monthly averages |
| **Business Value** | HR visibility, workforce utilization |
| **Frontend** | Owner Dashboard → Timesheets widget, EmployeeActive widget |
| **Backend** | EmployeeShift CRUD + `/employees-activity` aggregation endpoint |
| **Entities** | EmployeeShift, Employee, Branch |
| **Criticality** | Supporting — does not block any operations |

---

## 4. Frontend → Backend Relationship Map

### 4.1 Page-to-API Domain Mapping

| Frontend Page | Route | Primary API Domains Consumed |
|---|---|---|
| **OwnerDashboard** | `/dashboard/pemilik` | employees-activity, employees, shifts (all types), reservations, menus, branches, categories |
| **FinanceDashboard** | `/dashboard/bendahara` | finance-summary, fund-requests, shifts (all types), total-order |
| **CashierPage** | `/halaman/kasir` | orders, shift/cashier, shift/employee, shift/kitchen (read) |
| **KitchenPage** | `/halaman/dapur` | orders, shift/kitchen, shift/warehouse (read), inventory/stock-requests |
| **InventoryPage** | `/halaman/gudang` | inventory/items, inventory/stock-requests, inventory/stock-movements, finance/fund-requests, shift/warehouse |
| **LoginPage** | `/login` | auth/register (on register), employee/me (post-login) |
| **CustomerApp** | `nurchs.up.railway.app` | menu-sales, order/customer, reservation/customer, customer |

### 4.2 Composable-to-Service-to-API Chain

The frontend maintains a strict three-tier data flow. Every API interaction follows this chain:

```
Vue Component (template + script)
    ↓  calls
Composable (src/composables/useXxx.ts)  ← owns reactive state (ref/computed)
    ↓  calls
Service (src/services/<domain>/xxxService.ts)  ← builds HTTP request
    ↓  calls
api.ts (Axios + Firebase JWT interceptor)
    ↓  HTTP
Backend REST API (pos-service)
    ↓
Handler (app/handler/*.js)  ← parses HTTP request
    ↓  calls
Service (app/service/*.js)  ← ALL business logic + DB queries
    ↓  uses
Model (app/model/model.js)  ← Sequelize ORM → MySQL
```

### 4.3 Complete Composable → Backend Service Mapping

| Frontend Composable | Calls Service File(s) | Backend Service | Core Entities |
|---|---|---|---|
| `useCurrentOrder` | `currentOrderService` | `orderService` | Order, OrderItem, OrderPayment, KitchenShiftDetail |
| `useMenuItems` | `menuService` | `menuService` | Menu, Category |
| `useShift` | `shiftService` (508 lines) | `kitchenShiftService`, `cashierShiftService`, `warehouseShiftService`, `employeeShiftService` | All 4 shift types + KitchenShiftDetail |
| `useFinanceSummary` | `financeService` | `financeService` | OrderPayment, CashierShiftCashOut, FundRequestItem |
| `useFundRequest` | `financeService` | `financeService` | FundRequest, FundRequestItem |
| `useInventoryItems` | `inventoryService` | `inventoryService` | InventoryItem, Category |
| `useStockRequest` | `inventoryService` | `inventoryService` | StockRequest, StockRequestItem |
| `useStockMovement` | `inventoryService` | `inventoryService` | StockMovement, InventoryItem |
| `useBranchList` | `branchService` | `branchService` | Branch |
| `useReservation` | `reservationService` | `reservationService` | Reservation, Customer |
| `useEmployeeActive` | `employeeService` | `employeeService` | EmployeeShift, Employee |
| `useTotalOrder` | `totalOrderService` | `orderService` | Order |
| `useUser` | `userService` | `employeeService` | Employee, User |

---

## 5. Feature → Capability Matrix

This matrix answers: "Which backend capability does this frontend feature depend on?"

| Frontend Feature | Page | Backend Capability | Criticality | Business Outcome |
|---|---|---|---|---|
| **StartShift** (cashier) | CashierPage | Shift Lifecycle Management (C2) | Mission Critical | Enables order creation |
| **StartShift** (kitchen) | KitchenPage | Shift Lifecycle Management (C2) | Mission Critical | Enables order visibility + stock tracking |
| **StartShift** (warehouse) | InventoryPage | Shift Lifecycle Management (C2) | Mission Critical | Enables inventory ops |
| **CreateOrder / UpdateOrder** | CashierPage | Order Management (C3) | Mission Critical | Revenue generation |
| **Payment** overlay | CashierPage | Payment Processing (C4) | Mission Critical | Revenue collection |
| **Midtrans snap flow** | CashierPage | Payment Processing (C4) + Midtrans API | Business Critical | Digital payment capture |
| **CurrentOrderQue** | Cashier + Kitchen | Order Management (C3) | Mission Critical | Kitchen fulfillment |
| **DetailOrder** | CashierPage | Order Management (C3) | Mission Critical | Order status management |
| **RefundOrder** | CashierPage | Payment Processing (C4) | Business Critical | Revenue correction |
| **InputCashFlow** | CashierPage | Shift Lifecycle (C2) | High | Cash in/out audit |
| **MenuQuantityManagement** | KitchenPage | Shift Lifecycle (C2) | High | Per-shift stock accuracy |
| **CurrentStockRequestList** (kitchen) | KitchenPage | Stock Request Workflow (C11) | Important | Ingredient coordination |
| **CurrentStockRequestList** (warehouse) | InventoryPage | Stock Request Workflow (C11) | Important | Ingredient fulfillment |
| **InventoryItems** | InventoryPage | Inventory Management (C5) | Business Critical | Stock accuracy |
| **StockMovement** | InventoryPage | Inventory Management (C5) | Business Critical | Physical stock tracking |
| **CurrentFundRequest** (warehouse) | InventoryPage | Fund Request Workflow (C8) | Important | Procurement initiation |
| **CurrentFundRequest** (finance) | FinanceDashboard | Fund Request Workflow (C8) | Important | Procurement approval |
| **TotalEarning / TotalIncome / TotalExpense** | FinanceDashboard | Financial Reporting (C6) | Business Critical | Business performance |
| **Management** (employees) | OwnerDashboard | Employee Management (C10) | Important | Workforce admin |
| **Management** (branches) | OwnerDashboard | Employee Management (C10) | Business Critical | Multi-branch config |
| **Management** (menus) | OwnerDashboard | Menu Management (C7) | Business Critical | Product catalog |
| **Management** (categories) | OwnerDashboard | Menu Management (C7) | Important | Organization |
| **CurrentReservation** | OwnerDashboard | Reservation Management (C9) | Important | Capacity planning |
| **EmployeeActive** | OwnerDashboard | Attendance Tracking (C12) | Supporting | Operational awareness |
| **Timesheets** | OwnerDashboard | Attendance Tracking (C12) | Supporting | HR records |
| **ShiftList** | Owner + Finance | Shift Lifecycle (C2) | High | Audit + reporting |
| **LoginPage** | Public | Auth & Access Control (C1) | Mission Critical | System entry |
| **RegisterPage** | Public | Auth & Access Control (C1) | Mission Critical | Staff onboarding |

---

## 6. User Journey Map

### 6.1 Journey: Daily Restaurant Opening

```
ACTOR         ACTION                    FRONTEND                    BACKEND
─────────────────────────────────────────────────────────────────────────────
Owner/Admin   Login                     LoginPage → /dashboard/     POST (Firebase)
                                        pemilik                     GET /employee/me

Owner/Admin   Review active staff       EmployeeActive widget       GET /employees-activity

Kasir         Login                     LoginPage → /halaman/kasir  POST (Firebase)
                                                                    GET /employee/me

Kasir         Start shift               StartShift overlay          POST /shift/cashier/:branchId/start
              (select branch,                                       → Creates CashierShift
              enter initial cash)                                   → Enables order creation

Dapur         Login                     LoginPage → /halaman/dapur  POST (Firebase)

Dapur         Start shift               StartShift overlay          POST /shift/kitchen/:branchId/start
              (select branch,                                       → Creates KitchenShift
              enter per-menu quantities)                            → Creates KitchenShiftDetails
                                                                    → Enables order queue

Gudang        Login + Start shift       StartShift overlay          POST /shift/warehouse/start
                                                                    → Creates WarehouseShift

--- SERVICE BEGINS ---
All shifts active → Orders can now be created
```

### 6.2 Journey: Complete Order Lifecycle

```
ACTOR         ACTION                    FRONTEND                    BACKEND + BUSINESS RULES
─────────────────────────────────────────────────────────────────────────────────────────────
Kasir         Open new order            "Buat Pesanan" button       (no API yet)
                                        → UpdateOrder overlay

Kasir         Browse menu + add items   Menu category tabs          GET /menus (filtered by branch)
              (qty + note per item)     → AddToChart overlay

Kasir         Enter customer info       Customer name, phone,       (client-side cart)
              + select table            table number, dine-in flag

Kasir         Choose: Save or Pay

  Path A: Save (Pending)
    Kasir     "Simpan"                  UpdateOrder → cart review   POST /order
                                                                    → RULE: Validate active KitchenShift + CashierShift
                                                                    → RULE: Check table not occupied
                                                                    → RULE: Check end_stock per item
                                                                    → find-or-create Customer by phone
                                                                    → [TRANSACTION]
                                                                       Create Order (status: Pending)
                                                                       Create OrderItems (status: Pending)
                                                                       Create OrderPayment (status: Pending)
                                                                       Decrement KitchenShiftDetail.end_stock
                                                                    → [COMMIT]
                                        → Order appears in
                                          CurrentOrderQue

  Path B: Direct Payment
    Kasir     "Langsung Bayar"          Payment overlay             POST /order/process-direct-payment
    Kasir     Select method             Cash → mark Lunas           PUT /order/:id (updatePayment)
              + confirm                 Midtrans → snap popup       → Midtrans: snap.createTransaction()
                                        → window.snap.pay(token)    → Returns snap_token

Dapur         See new order             CurrentOrderQue auto-       GET /orders/current
                                        (manual refresh)

Dapur         Update item status        DetailOrder overlay         PUT /order/:id (updateItems)
                                        Pending → Diproses          → Auto-promotes order status
                                        → Tersaji                   → RULE: All items Tersaji + payment Lunas
                                                                             → Order auto → Selesai

Kasir         Confirm payment           DetailOrder → "Bayar"       PUT /order/:id (updatePayment)
              (for saved orders)        → Payment overlay           → OrderPayment.status = Lunas
                                                                    → Order.status = Selesai
```

### 6.3 Journey: Stock Request (Kitchen → Warehouse)

```
ACTOR         ACTION                    FRONTEND                    BACKEND
─────────────────────────────────────────────────────────────────
Dapur         Identify low stock        MenuQuantityManagement      GET /shift/kitchen/current
              (threshold warning)       widget

Dapur         Create stock request      CurrentStockRequestList     POST /inventory/stock-request
              (select items + qty)      → create sub-modal          → RULE: Active KitchenShift required
                                                                    → RULE: Active WarehouseShift required
                                                                    → Create StockRequest (status: Pending)
                                                                    → Create StockRequestItems

Gudang        See pending request       CurrentStockRequestList     GET /inventory/stock-requests
                                        (shows Pending first)

Gudang        Review + approve/reject   Stock request detail        PUT /inventory/stock-request (approveStock)
              per item                  sub-modal                   → Per-item: approved=true/false
                                                                    → Status: Diproses / Ditolak

Gudang        Mark ready               "Siap" action               PUT /inventory/stock-request/:id/ready
                                                                    → Status: Siap

Dapur         Confirm receipt           "Selesai" action            PUT /inventory/stock-request/:id/end
                                                                    → Status: Selesai
                                                                    NOTE: Does NOT auto-update
                                                                    InventoryItem.quantity — manual
                                                                    StockMovement required separately
```

### 6.4 Journey: Fund Request (Warehouse → Treasurer → Completion)

```
ACTOR         ACTION                    FRONTEND                    BACKEND
─────────────────────────────────────────────────────────────────
Gudang        Create fund request       CurrentFundRequest widget   POST /finance/fund-request
              (items + amounts          → create modal              → RULE: Active WarehouseShift required
              needed for purchase)                                  → Create FundRequest (status: Pending)
                                                                    → Create FundRequestItems

Bendahara     Review pending fund       CurrentFundRequest in       GET /finance/fund-requests
              request                   FinanceDashboard

Bendahara     Approve/reject            Approval modal per item     PUT /finance/fund-request (approveFundRequest)
              per item                                              → Partial approval logic:
                                                                       0 approved → Ditolak
                                                                       All approved → Disetujui
                                                                       Some approved → Beberapa Disetujui

Gudang        Complete (purchased)      "Selesai" action            PUT /finance/fund-request/:id/end
                                                                    → Status: Selesai
                                                                    → purchase_price × quantity →
                                                                      feeds finance-summary.expenses
```

### 6.5 Journey: New Employee Onboarding

```
ACTOR         ACTION                    FRONTEND                    BACKEND
─────────────────────────────────────────────────────────────────
New Employee  Register                  RegisterPage                Firebase: createUserWithEmailAndPassword
                                                                    → Send verification email
                                                                    → POST /auth/register (create employee record)

New Employee  Verify email              EmailSent page              Firebase email verification flow
              + login                   → redirect to LoginPage

New Employee  Login (no role)           LoginPage                   GET /employee/me
                                        → Router guard:             → Employee.role = null
                                          role=null → /starter      → throws UnauthorizedException
                                        → "Menunggu konfirmasi"

Owner         Find unconfirmed user     OwnerDashboard →            GET /employees
              + assign role + branch    Management widget           PUT /employee/:uid (assign role + branch)
                                        → DetailAccount modal

New Employee  Login again               LoginPage                   GET /employee/me
                                        → Role now set              → role = 'kasir'/'dapur'/etc.
                                        → Routed to workspace       → Routed correctly
```

### 6.6 Journey: Daily Closing & Financial Reconciliation

```
ACTOR         ACTION                    FRONTEND                    BACKEND
─────────────────────────────────────────────────────────────────
Kasir         End cashier shift         EndShift overlay            PUT /shift/cashier/:id/end
              (enter actual cash)       → input actual_cash         → Records final_cash
                                                                    → Discrepancy computed

Dapur         End kitchen shift         UpdateShift overlay         PUT /shift/kitchen/:id (final counts)
              (enter final quantities)  → final per-menu qty        PUT /shift/kitchen/:id/end

Gudang        End warehouse shift       UpdateShift overlay         PUT /shift/warehouse/:id/end

Bendahara/    View financial summary    FinanceDashboard            GET /finance-summary
Owner         (today/week/month/year)   → TotalEarning,             → Computes from:
                                          TotalIncome,                OrderPayment (revenue)
                                          TotalExpense charts         CashierShiftCashOut (expenses)
                                                                      FundRequestItem (procurement costs)
```

---

## 7. End-to-End Workflow Map

### 7.1 Full Stack Trace: Order Creation

```
PAGE: /halaman/kasir (CashierPage.vue)
  │
  ├── FEATURE: CreateOrder button → opens UpdateOrder overlay
  │     │
  │     ├── COMPOSABLE: useCurrentOrder().createOrder(payload)
  │     │     │
  │     │     ├── SERVICE: currentOrderService.createOrder(payload)
  │     │     │     │
  │     │     │     └── API: POST /order  [with Firebase JWT]
  │     │     │               │
  │     │     │               ├── MIDDLEWARE: auth.js → verifyIdToken → load employee profile
  │     │     │               │
  │     │     │               ├── HANDLER: order.handler.js → parse body
  │     │     │               │
  │     │     │               └── SERVICE: orderService.create()
  │     │     │                     │
  │     │     │                     ├── DOMAIN: Shift Operations
  │     │     │                     │     READ: KitchenShift (must be active)
  │     │     │                     │     READ: CashierShift (must be active)
  │     │     │                     │
  │     │     │                     ├── DOMAIN: Customer Management
  │     │     │                     │     READ/WRITE: Customer (find-or-create by phone)
  │     │     │                     │
  │     │     │                     ├── DOMAIN: Menu & Catalog
  │     │     │                     │     READ: KitchenShiftDetail (validate + check stock)
  │     │     │                     │     RULE: end_stock >= ordered quantity
  │     │     │                     │     RULE: table not occupied in same KitchenShift
  │     │     │                     │
  │     │     │                     └── [SEQUELIZE TRANSACTION]
  │     │     │                           WRITE: orders (UUID PK, status=Pending)
  │     │     │                           WRITE: order_items (N records, status=Pending)
  │     │     │                           WRITE: order_payments (status=Pending, amount)
  │     │     │                           UPDATE: kitchen_shift_details.end_stock -= qty
  │     │     │                         [COMMIT]
  │     │     │
  │     │     └── Returns typed Order object → stored in composable local ref
  │     │
  │     └── COMPONENT: UpdateOrder.vue triggers refresh()
  │
  └── FEATURE: CurrentOrderQue refreshes → new order visible
        └── COMPOSABLE: useCurrentOrder().loadCurrentOrder()
              └── GET /orders/current (filtered by branch)
```

### 7.2 Full Stack Trace: Financial Summary

```
PAGE: /dashboard/bendahara (FinanceDashboard.vue)
  │
  ├── FEATURE: TotalIncome widget (period filter: today/week/month/year)
  │     │
  │     ├── COMPOSABLE: useFinanceSummary().loadSummary({ branch_id, period })
  │     │     │
  │     │     ├── SERVICE: financeService.getSummary(params)
  │     │     │     │
  │     │     │     └── API: GET /finance-summary?branch_id=X&period=Y
  │     │     │               │
  │     │     │               └── SERVICE: financeService.getSummary()
  │     │     │                     │
  │     │     │                     ├── DOMAIN: Payment Processing
  │     │     │                     │     READ: order_payments WHERE status='Lunas' → gross income
  │     │     │                     │     READ: order_payments WHERE status='Refund' → refunds
  │     │     │                     │
  │     │     │                     ├── DOMAIN: Cashier Shift
  │     │     │                     │     READ: cashier_shift_cash_outs → operational expenses
  │     │     │                     │
  │     │     │                     ├── DOMAIN: Finance
  │     │     │                     │     READ: fund_requests_item × purchase_price → procurement costs
  │     │     │                     │
  │     │     │                     └── COMPUTE (no stored summary):
  │     │     │                           Net Income = Gross Sales - Refunds
  │     │     │                           Net Cashier = Cash+Digital - Refunds - Expenses
  │     │     │
  │     │     └── Returns FinanceSummary → ApexCharts renders bar chart
  │     │
  └── BUSINESS OUTCOME: Owner/Treasurer sees real-time financial health
```

---

## 8. API Relationship Model

### 8.1 Frontend Feature → API Dependency Map

| Frontend Feature | Required APIs | Optional APIs |
|---|---|---|
| Cashier order creation | `POST /order`, `GET /menus`, `GET /shift/cashier/current`, `GET /shift/kitchen/current` | — |
| Cashier payment (cash) | `PUT /order/:id` (updatePayment) | — |
| Cashier payment (Midtrans) | `POST /order/process-direct-payment` → Midtrans API | — |
| Kitchen order queue | `GET /orders/current`, `PUT /order/:id` (updateItems/updateStatus) | — |
| Stock request (kitchen) | `POST /inventory/stock-request`, `GET /inventory/stock-requests`, `GET /shift/kitchen/current`, `GET /shift/warehouse/current` | — |
| Stock request (warehouse) | `GET /inventory/stock-requests`, `PUT /inventory/stock-request` | — |
| Inventory CRUD | `GET /inventory/items`, `POST /inventory/item`, `PUT /inventory/item`, `DELETE /inventory/item/:id` | `GET /categories` |
| Stock movement | `POST /inventory/stock-movement`, `GET /inventory/stock-movements` | — |
| Fund request (create) | `POST /finance/fund-request`, `GET /inventory/items` | — |
| Fund request (approve) | `GET /finance/fund-requests`, `PUT /finance/fund-request` | — |
| Finance summary | `GET /finance-summary` | — |
| Owner management | `GET /employees`, `PUT /employee/:uid`, `DELETE /employee/:uid`, `GET /branch`, `POST /branch`, `PUT /branch/:id`, `GET /menus`, `POST /menu`, `PUT /menu/:id`, `DELETE /menu/:id`, `GET /categories`, `POST /category`, `PUT /category/:id` | — |
| Reservation management | `GET /reservations`, `POST /reservation`, `PUT /reservation`, `DELETE /reservation/:id` | — |
| Shift management | All `GET/POST/PUT /shift/{type}/...` endpoints | — |
| Employee active widget | `GET /employees-activity` | — |

### 8.2 API → Backend Service → Domain → Entity Dependency Map

```
API Endpoint                        Handler         Service              Entities Touched
─────────────────────────────────────────────────────────────────────────────────────────
POST /order                         order.handler   orderService         Order, OrderItem,
                                                                         OrderPayment,
                                                                         KitchenShiftDetail,
                                                                         Customer, KitchenShift,
                                                                         CashierShift

PUT /order/:id                      order.handler   orderService         Order, OrderItem,
  (updateStatus/Items/Payment)                                           OrderPayment,
                                                                         KitchenShiftDetail
                                                                         (stock restore on cancel)

PUT /order/:id/refund               order.handler   orderService         OrderItem, RefundItem,
                                                                         OrderPayment, Order

POST /order/webhook                 order.handler   orderService         OrderPayment, Order
  (Midtrans callback, public)                                            (Midtrans signature verify)

GET /finance-summary                finance.handler financeService       OrderPayment,
                                                                         CashierShiftCashOut,
                                                                         FundRequestItem
                                                                         (read-only aggregation)

POST /shift/kitchen/:id/start       shift.handler   kitchenShiftService  KitchenShift,
                                                                         KitchenShiftDetail (bulk)

PUT /shift/kitchen/:id/manage-qty   shift.handler   kitchenShiftService  KitchenShiftDetail

POST /inventory/stock-request       inv.handler     inventoryService     StockRequest,
                                                                         StockRequestItem

POST /inventory/stock-movement      inv.handler     inventoryService     StockMovement,
                                                                         InventoryItem (quantity±)

POST /finance/fund-request          finance.handler financeService       FundRequest,
                                                                         FundRequestItem
```

### 8.3 API Impact Map (Change Radius)

> If this API changes, these frontend features are directly affected:

| API | Frontend Features Affected | Business Impact |
|---|---|---|
| `POST /order` | CashierPage order creation, customer self-order | Revenue generation halts |
| `GET /orders/current` | CurrentOrderQue (cashier + kitchen) | Both roles lose order visibility |
| `PUT /order/:id` | Kitchen status updates, cashier payment, refunds | Fulfillment and payment broken |
| `POST /shift/kitchen/start` | Kitchen StartShift, KitchenShiftDetails | Kitchen cannot open; orders blocked |
| `POST /shift/cashier/start` | Cashier StartShift | Cashier cannot open; orders blocked |
| `GET /finance-summary` | All TotalIncome/TotalExpense/TotalEarning charts | Finance dashboard goes blank |
| `GET /employee/me` | Login flow, route guards, all pages (auth gate) | Complete system auth failure |
| `PUT /inventory/stock-request` | Warehouse approval flow | Stock coordination breaks |
| `POST /inventory/stock-movement` | InventoryPage StockMovement | Stock levels cannot be updated |
| `GET /menus` | Cashier UpdateOrder (menu selection), Kitchen shift start | Cannot create orders or shifts |

---

## 9. Data Ownership Model

### 9.1 Source of Truth Map

| Data | Source of Truth | System of Record | Who Can Modify |
|---|---|---|---|
| **Employee Identity** | Firebase Auth | `employees` table (local cache of Firebase UID + role) | Firebase (identity), Backend (role/branch) |
| **Employee Role** | `employees.role` (backend DB) | Backend only | Owner/Admin via PUT /employee/:uid |
| **Customer Identity** | `customers` table | Backend DB | Auto-created on first order (phone deduplication) |
| **Orders** | `orders` + `order_items` tables | Backend DB | Cashier (create), Kitchen (item status), Auto (completion) |
| **Order Stock** (session) | `kitchen_shift_details.end_stock` | Backend DB (per shift) | Auto (decrement on order), Auto (restore on cancel) |
| **Payment State** | `order_payments.status` | Backend DB | Cashier (updatePayment), Midtrans webhook (Lunas) |
| **Inventory Levels** | `inventory_items.quantity` | Backend DB | Warehouse (StockMovement only) |
| **Kitchen Stock** (session) | `kitchen_shift_details.end_stock` | Backend DB | Kitchen shift start (init), Orders (decrement), Cancels (restore) |
| **Financial Summary** | Computed from OrderPayment + CashierShiftCashOut + FundRequestItem | No stored table — always recomputed | Never directly written — emerges from transactions |
| **Reservations** | `reservations` table | Backend DB | Customer (create), Employee (create/update/delete) |
| **Shift Records** | 4 shift tables | Backend DB | Each role (own shift); Admin/Owner (all shifts) |
| **Branch Config** | `branches` table | Backend DB | Owner/Admin only |
| **Menu Catalog** | `menus` + `categories` tables | Backend DB | Owner/Admin only |

### 9.2 Frontend vs Backend State Ownership

| State Type | Owner | Storage | Sync Mechanism |
|---|---|---|---|
| **Firebase auth session** | Frontend (Firebase SDK) | IndexedDB | `onIdTokenChanged` listener → JWT auto-refreshed |
| **Employee profile** | Frontend (Pinia `authUser.ts`) | Memory (session) | `fetchMe()` on boot + on each login |
| **Current shift status** | Frontend (Pinia `authUser.ts`) | Memory (session) | `fetchShift()` on mount of operational pages |
| **Branch selection** | Frontend (local `ref` per page) | Memory (component) | `watch(selectedBranch)` triggers re-fetch |
| **Feature data** (orders, inventory, etc.) | Frontend (composable local `ref`) | Memory (component) | Manual refresh after mutations |
| **UI alerts/toasts** | Frontend (Pinia `alert.ts`) | Memory (session) | Triggered by any component |
| **All business data** | Backend (MySQL) | Persistent DB | REST API on every fetch/mutation |
| **Financial summary** | Backend (computed) | No persistence | Recomputed on every GET /finance-summary call |

### 9.3 Data Lifecycle Map

| Data | Created By | Modified By | Consumed By | Archived/Deleted By |
|---|---|---|---|---|
| **Order** | Cashier or Customer | Cashier (status, payment), Kitchen (item status) | Kitchen queue, Finance summary, Shift reports | Soft (status=Batal/Selesai); hard delete not standard |
| **KitchenShiftDetail** | Kitchen shift start | Order creation (decrement), Order cancel (restore), Manual update | Order validation, Kitchen stock display | End of kitchen shift (historical) |
| **OrderPayment** | Order creation | Payment confirmation, Refund | Finance summary, Cashier shift summary | Never modified after Lunas |
| **InventoryItem** | Warehouse (create) | Warehouse (StockMovement changes quantity) | Stock requests, Fund requests, Finance cost | Hard delete by Warehouse |
| **StockRequest** | Kitchen | Warehouse (approve), Kitchen (complete) | Warehouse queue, Kitchen status display | 1-month window on list queries |
| **FundRequest** | Warehouse | Treasurer (approve), Warehouse (complete) | Finance dashboard, Expense reporting | 1-month window on list queries |
| **Employee** | Self (register) | Owner (role/branch), Self (profile) | Auth/routing, Shift creation, Order audit | Hard delete (DB + Firebase) by Admin |

---

## 10. Domain Relationship Model

### 10.1 Domain Dependency Graph

```
                    ┌─────────────────────┐
                    │   IDENTITY & ACCESS  │
                    │  Firebase + Employee │
                    └──────────┬──────────┘
                               │ gates
                    ┌──────────▼──────────┐
                    │   BRANCH MANAGEMENT  │
                    │  (root FK anchor)    │
                    └──────────┬──────────┘
                               │ scopes
              ┌────────────────┼────────────────┐
              │                │                │
   ┌──────────▼──────┐ ┌───────▼──────┐ ┌──────▼──────────┐
   │  MENU & CATALOG  │ │    SHIFT      │ │    RESERVATION  │
   │  Menu, Category  │ │  OPERATIONS  │ │                 │
   └──────────┬───────┘ └───┬──────┬───┘ └─────────────────┘
              │             │      │
              │             │      │
   ┌──────────▼─────────────▼─┐ ┌──▼─────────────────────┐
   │     ORDER MANAGEMENT      │ │    WAREHOUSE / INVENTORY│
   │  Order,OrderItem,OrderPay │ │  InventoryItem,StockMov │
   └──────────┬────────────────┘ └──────────┬─────────────┘
              │                             │
              │                    ┌────────▼────────────┐
              │                    │  STOCK WORKFLOW      │
              │                    │  StockRequest,Items  │
              │                    └────────┬────────────┘
              │                             │
              └──────────────┬──────────────┘
                             │ aggregated into
                  ┌──────────▼──────────┐
                  │  FINANCE & REPORTING │
                  │  FinanceSummary,     │
                  │  FundRequest         │
                  └─────────────────────┘
```

### 10.2 Cross-Domain Data Flow

| From Domain | To Domain | Data Transferred | Mechanism |
|---|---|---|---|
| Menu & Catalog | Shift Operations | Menu items + initial stock quantities | Kitchen shift start `initial_menu[]` |
| Shift Operations | Order Management | `kitchen_shift_id` + `cashier_shift_id` | FK anchors on Order |
| Shift Operations | Stock Workflow | `kitchen_shift_id` + `warehouse_shift_id` | FK anchors on StockRequest |
| Order Management | Finance | OrderPayment records (Lunas/Refund) | Queried in finance-summary |
| Shift Operations (Cashier) | Finance | CashierShiftCashOut records | Queried in finance-summary |
| Stock Workflow (Fund) | Finance | FundRequestItem × purchase_price | Queried in finance-summary |
| Identity & Access | All Domains | Employee profile + role | `req.user.profile` from auth middleware |
| Branch Management | All Operational Domains | `branch_id` FK | Every operational entity scoped by branch |

### 10.3 Domain Isolation Rules

| Domain | Can Write To | Cannot Write To | Reads From |
|---|---|---|---|
| Order Management | Order, OrderItem, OrderPayment, KitchenShiftDetail (decrement) | Shifts (no direct write), InventoryItem | KitchenShift, CashierShift, Menu, Customer |
| Kitchen | KitchenShift, KitchenShiftDetail, (reads OrderItem) | Orders, Payments, InventoryItem | Order, Menu |
| Cashier | CashierShift, CashierShiftCashIn/Out, OrderPayment | KitchenShift, InventoryItem | Order, KitchenShift |
| Warehouse | WarehouseShift, InventoryItem, StockMovement, StockRequest, FundRequest | Orders, Payments, Shifts (other) | StockRequest, InventoryItem |
| Finance | FundRequest (approval), FinanceSummary (read only) | Orders, Inventory, Shifts | OrderPayment, CashierShiftCashOut, FundRequestItem |

---

## 11. Dependency Map

### 11.1 Critical Dependency Chain

```
[Firebase Auth] ──────────────────────────────────────────────┐
       │                                                       │
       ▼ (JWT token)                                          ▼
[Backend Auth Middleware] ──── REQUIRED BY ──── [Every protected API]
       │
       ▼
[Employee.role] ──── REQUIRED BY ──── [Frontend route guards]
                                       [Role-based workspace routing]
       │
       ▼
[Active EmployeeShift] ──── GATE ──── [Operational UI visibility]
       │
       ▼
[Active KitchenShift]  ─────────────────── REQUIRED BY ──── [POST /order]
[Active CashierShift]  ─────────────────── REQUIRED BY ──── [POST /order]
[Active WarehouseShift] ─────────────────── REQUIRED BY ──── [POST /inventory/stock-request]
                                                              [POST /finance/fund-request]
                                                              [POST /inventory/stock-movement]
       │
       ▼
[KitchenShiftDetail.end_stock] ─── GATE ──── [Order item quantity validation]
       │
       ▼
[Order created] ──── TRIGGERS ──── [Kitchen queue updates]
                                   [OrderPayment record]
                                   [Cashier shift revenue]
       │
       ▼
[OrderPayment.status=Lunas] ──── CONSUMED BY ──── [Finance summary income]
[CashierShiftCashOut] ─────────── CONSUMED BY ──── [Finance summary expenses]
[FundRequestItem × price] ─────── CONSUMED BY ──── [Finance summary expenses]
```

### 11.2 External Dependency Map

| Dependency | Used By | Failure Mode | Fallback |
|---|---|---|---|
| **Firebase Auth** | All auth, JWT for every API call | Complete system lock-out | None — no fallback |
| **MySQL Database** | Backend — every operation | Complete system failure | None — single DB |
| **Midtrans Snap API** | Payment.vue, POST /order/process-direct-payment | Digital payment broken | Cash payment still works |
| **snap.js CDN** | Payment.vue (loaded via `<script>` tag) | Midtrans UI broken | Cash payment still works |
| **Railway** | Both frontend and backend hosting | System offline | None |
| **ApexCharts** | Finance Dashboard charts | Charts blank | Data API still works; no visual |

### 11.3 Frontend Internal Dependencies

| Depends On | Required By | If Missing |
|---|---|---|
| `authStore` (Pinia) | Router guards, `authUser`, all API calls | System cannot authenticate |
| `authUser.me.role` | Route guards, `beforeEnter`, page rendering | Roles not enforced (security gap) |
| `useOverlayManager` singleton | All sub-modal components | Modals cannot open |
| `api.ts` (Axios + JWT) | All service files | API calls fail auth injection |
| `useAlertStore` | All mutation composables | No user feedback on errors |
| Firebase `onIdTokenChanged` | `authStore.initialize()` | Boot sequence hangs |

### 11.4 Backend Internal Dependencies

| Depends On | Required By | If Missing |
|---|---|---|
| `getSequelize()` singleton | Every service function | DB calls fail on first request |
| `model.js` (all 20 models) | Every service | Entity CRUD broken |
| `auth.js` middleware | All protected routes | No authentication enforcement |
| `error.js` middleware | All routes | Unhandled errors return 500s |
| Active `KitchenShift` | `orderService.create()` | Order creation blocked (R1) |
| Active `CashierShift` | `orderService.create()` | Order creation blocked (R2) |
| Active `WarehouseShift` | StockRequest, StockMovement, FundRequest | Warehouse ops blocked |

---

## 12. Architectural Boundaries

### 12.1 Responsibility Assignment

| Responsibility | Owned By | Details |
|---|---|---|
| **Identity management** (tokens, OAuth, email verify) | Firebase + Auth Store | Frontend: Firebase SDK; Backend: Admin SDK verify |
| **Role assignment** | Backend only | `employees.role` — Owner sets via API |
| **Route access control** | Frontend (UI gate) | Router `beforeEach` checks role; Backend has NO route-level RBAC |
| **Business rule enforcement** | Backend exclusively | Order stock, shift requirements, payment state machine |
| **UI state** | Frontend exclusively | Branch selection, loading states, overlay stack, alerts |
| **Financial computation** | Backend exclusively | Always recomputed from source records; never stored |
| **Session-level stock tracking** | Backend (KitchenShiftDetail) | Per-shift, not global inventory |
| **Global inventory levels** | Backend (InventoryItem.quantity) | Updated atomically by StockMovement |
| **Payment token generation** | Backend → Midtrans | Frontend only invokes window.snap.pay(token) |
| **Payment webhook verification** | Backend only | SHA512 signature verified server-side |
| **Data validation** | Backend (business logic in service layer) | Frontend has Vuetify v-form inline rules only |
| **Multi-branch data isolation** | Backend (branch_id FK filtering) | All queries filtered by branch |
| **Audit trail** | Backend (`created_by`/`updated_by` on all entities) | Polymorphic via users table |

### 12.2 Shared Responsibilities

| Responsibility | Frontend Role | Backend Role |
|---|---|---|
| **Authentication state** | Stores Firebase user, exposes `isAuthenticated` | Verifies JWT token on each request |
| **Error communication** | Displays `message` from backend response; handles 401/403 | Returns structured `{status, message, error}` envelope |
| **Currency formatting** | Formats IDR integers for display (utility functions) | Stores as BIGINT/INT; never computes floats |
| **Order status display** | Maps status strings to UI state and colors | Defines and enforces status transition rules |
| **Branch filtering** | Sends `branch_id` as query param | Filters all queries by `branch_id` |

### 12.3 Architectural Anti-Patterns to Maintain Awareness Of

| Anti-Pattern | Current Reality | Risk |
|---|---|---|
| **No backend RBAC** | Frontend enforces roles via router guards; backend has none | Any authenticated employee can call any API endpoint |
| **No real-time updates** | Manual refresh only — no polling/SSE/WebSocket | Kitchen may miss new orders; roles out of sync |
| **Financial summary not cached** | Recomputed on every request (4–8 queries) | Performance degrades with data volume |
| **Stock requests ≠ automatic inventory deduction** | StockRequest completion does NOT update InventoryItem.quantity | Manual StockMovement required separately |
| **No input validation** | Backend has no Zod/Joi middleware | Malformed data may cause 500s |

---

## 13. Critical System Components

### 13.1 Mission Critical Components (Failure = System Down)

| Component | Layer | Why Critical | Failure Impact |
|---|---|---|---|
| **Firebase Auth** | External | All JWT verification depends on it | Complete system lock-out |
| **MySQL Database** | Infrastructure | All persistent data | Total data loss / system failure |
| **auth.js middleware** | Backend | Gates all protected routes | Any request passes without auth |
| **orderService** | Backend | Core revenue transaction processor | Orders cannot be created |
| **KitchenShiftDetail** | DB entity | Real-time stock ledger per session | Order stock validation breaks |
| **authStore + initialize()** | Frontend | Boot sequence auth resolution | Frontend mounts unauthenticated |
| **router/index.ts guards** | Frontend | Role-based access enforcement | Wrong roles access wrong workspaces |
| **api.ts (Axios + interceptors)** | Frontend | JWT injection for all API calls | All API calls return 401 |

### 13.2 Business Critical Components (Failure = Major Disruption)

| Component | Layer | Why Critical | Failure Impact |
|---|---|---|---|
| **Midtrans integration** | External + Backend | Digital payment | Digital payments fail (cash still works) |
| **kitchenShiftService** | Backend | Order creation precondition | Kitchen shift cannot start; orders blocked |
| **cashierShiftService** | Backend | Order creation precondition | Cashier shift cannot start; orders blocked |
| **financeService.getSummary()** | Backend | Financial reporting | Finance dashboard goes blank |
| **inventoryService** | Backend | Warehouse operations | Inventory cannot be tracked |
| **useOverlayManager** | Frontend | All sub-modal interactions | No overlays can open (order creation broken) |
| **useShift composable** | Frontend | All shift start/update/end operations | Staff cannot manage shifts |
| **useCurrentOrder composable** | Frontend | Order display and management | Cashier and kitchen pages go dark |

---

## 14. Business Critical Flows

### 14.1 Flow 1: Revenue Generation (Highest Priority)

```
PRECONDITIONS (must ALL be true):
  ✓ Employee authenticated (Firebase JWT valid)
  ✓ Employee.role = 'kasir' (or admin/pemilik)
  ✓ Active KitchenShift for branch (end = null)
  ✓ Active CashierShift for branch (end = null)
  ✓ Menu items exist in KitchenShiftDetail
  ✓ end_stock > 0 for ordered items
  ✓ Table not occupied (dine-in only)

FLOW:
  Cashier → UpdateOrder overlay → select items → confirm → POST /order
  → [TRANSACTION] Order + OrderItems + OrderPayment + end_stock decrement
  → Kitchen sees order in queue
  → Kitchen processes → updates item status
  → Cashier processes payment → PUT /order/:id (updatePayment)
  → Order.status = Selesai
  → OrderPayment.status = Lunas
  → Revenue recorded in cashier shift

POSTCONDITIONS:
  ✓ Revenue flows into /finance-summary income
  ✓ Order appears in ShiftList for audit
  ✓ end_stock permanently decremented (not restored)
```

### 14.2 Flow 2: Shift-Required Operation Guard

```
PRECONDITION CHECK (every operational page mount):
  Frontend: userStore.me.activity.is_active (EmployeeShift active)
  Backend: KitchenShift.end = null for branch (implicitly validated on order create)

If is_active = false:
  Frontend: Shows "belum memulai sif" warning
  All operational features hidden
  Staff must start shift first

If is_active = true BUT operational shift ended:
  Kitchen/Warehouse pages show warning
  Order creation will fail on backend (no active KitchenShift)
```

### 14.3 Flow 3: Payment Reconciliation (Midtrans Path)

```
1. Cashier initiates → POST /order/process-direct-payment
   Backend: Midtrans snap.createTransaction({order_id, amount, expiry: 15min})
   Backend: Stores snap_token in OrderPayment
   Returns: snap_token to frontend

2. Frontend: window.snap.pay(snap_token)
   Midtrans: Shows hosted payment UI
   Customer: Completes payment

3. Midtrans: POST /order/webhook (async callback, NO auth)
   Backend: SHA512 signature verification
   If verified AND status='settlement':
     OrderPayment.status = 'Lunas'
     If Order.status = 'Tersaji' → Order.status = 'Selesai'

4. Finance summary now includes this payment in income

RISK: If webhook fails or is delayed, payment may be Lunas in Midtrans
      but still Pending in the database. Manual reconciliation required.
```

### 14.4 Flow 4: Stock Depletion Protection

```
Kitchen shift start:
  Kitchen declares initial_stock per menu item
  → Creates KitchenShiftDetail (initial_stock = end_stock)

Each order:
  Validate: end_stock >= ordered_quantity for each item
  If passes: end_stock -= quantity (atomic via transaction)

Each cancellation:
  end_stock += quantity (restored atomically via SQL literal:
    `COALESCE(end_stock, 0) + qty`)

Kitchen can manually update end_stock during shift:
  PUT /shift/kitchen/:id/manage-qty

End of shift:
  Final counts reconciled
  KitchenShiftDetail becomes historical record
  New shift = new end_stock ledger
```

---

## 15. Impact Analysis Framework

### 15.1 Change Impact Matrix

For any proposed change, evaluate impact using this matrix:

| Change Type | Entities Affected | Frontend Impact | Backend Impact | Business Impact |
|---|---|---|---|---|
| Modify Order status values | Order, OrderItem | CurrentOrderQue, DetailOrder UI colors/labels | orderService status machine | Revenue flow integrity |
| Add new Menu field | Menu | UpdateOrder menu display, DetailMenu modal | menuService CRUD, KitchenShiftDetail init | Order accuracy |
| Change Shift start payload | CashierShift / KitchenShift | StartShift overlay form | kitchenShiftService / cashierShiftService | Operational opening |
| Modify KitchenShiftDetail | KitchenShiftDetail | MenuQuantityManagement widget | orderService stock check | Order creation reliability |
| Add new role | Employee | MainRoutes.ts, sidebar, LandingPage guard | Role check in service layer | Access control |
| Change finance-summary formula | OrderPayment, CashierShiftCashOut, FundRequestItem | FinanceDashboard charts | financeService queries | Financial accuracy |
| Add branch | Branch | Branch selector (all pages) | All FK-branch endpoints | Data isolation |
| Change payment flow | OrderPayment | Payment.vue, Midtrans integration | orderService, webhook handler | Revenue collection |
| Modify stock request workflow | StockRequest, StockRequestItem | CurrentStockRequestList (both pages) | inventoryService stock request service | Kitchen-warehouse coordination |

### 15.2 Blast Radius by Entity

| Entity | Directly Affects | Transitively Affects |
|---|---|---|
| **Employee** | Auth routing, all shift creation, audit trail | Every feature (user owns every operation) |
| **Branch** | Every page's branch selector, all FK-scoped queries | Financial reports, shift data, menu catalog |
| **KitchenShift** | Order creation, kitchen page, stock tracking | Revenue flow, financial reporting |
| **CashierShift** | Order creation, cashier page, payment records | Revenue flow, financial reporting |
| **WarehouseShift** | Inventory ops, stock requests, fund requests | Supply chain, financial expense reporting |
| **Order** | Cashier + kitchen pages | Financial summary, shift reports |
| **KitchenShiftDetail** | Per-order stock validation | Order creation, session stock accuracy |
| **OrderPayment** | Payment processing | Finance summary income |
| **InventoryItem** | Stock movements, stock requests, fund requests | Finance expense (via purchase_price) |
| **FundRequest** | Finance dashboard expense section | Financial reporting accuracy |
| **Menu** | Order creation, kitchen shift initialization, catalog display | Every order created, every kitchen shift |

### 15.3 How to Evaluate Any Feature Change

**Step 1: Identify the entity being changed**
→ See entity list in Section 9 + Section 10

**Step 2: Find all API endpoints that read/write that entity**
→ See API Relationship Model in Section 8

**Step 3: Find all frontend composables that call those APIs**
→ See Composable → API mapping in Section 4.3

**Step 4: Find all frontend features that use those composables**
→ See Feature → Capability Matrix in Section 5

**Step 5: Identify business rules that apply**
→ See Business Rules in Backend MASTER_CONTEXT Section 11

**Step 6: Identify all shift dependencies**
→ Any feature in operational pages requires the shift gate (Section 14.2)

**Step 7: Check cross-domain impact**
→ See Domain Relationship Model in Section 10

---

## 16. AI Agent Change Management Guide

### 16.1 Guiding Principles for All Changes

1. **The shift is the operational unit** — Never design a feature that bypasses shift requirements for cashier, kitchen, or warehouse operations.

2. **The backend owns all business rules** — Frontend validation is UX-only. Critical rules (stock limits, shift requirements, payment state machine) must remain in backend service layer.

3. **The finance summary is always computed, never stored** — Do not add a `finance_summaries` table. The summary must reflect real-time state.

4. **Inventory changes require StockMovement records** — Never directly update `InventoryItem.quantity` without creating a StockMovement record. This is the audit trail.

5. **Stock requests ≠ inventory deduction** — A completed StockRequest does NOT automatically update InventoryItem.quantity. This requires a separate explicit StockMovement.

6. **All UI text must be in Bahasa Indonesia** — Labels, messages, alerts, and status values are in Indonesian.

7. **Order payments once Lunas are immutable** — Never allow modification of an OrderPayment with status `Lunas` or `Refund`.

8. **UUIDs for Orders, integers for everything else** — Order PKs are UUIDv4. All other entities use auto-increment integers.

### 16.2 Frontend Change Checklist

When modifying or adding frontend features, verify:

```
□ Does this feature belong to a specific role? → Add requiredRoles to route meta
□ Does this feature touch operational data (orders/shifts/inventory)? → Add shift gate check
□ Does this feature make API calls? → Use composable → service → api.ts pattern (never direct axios)
□ Does this feature mutate data? → Pass refresh() callback; call useAlertStore().showAlert() on success/error
□ Does this feature need a dialog/modal? → Use useOverlayManager().openOverlay() (not v-dialog v-model)
□ Does this feature show data from multiple branches? → Add selectedBranch ref + watch + v-select in BaseBreadcrumb
□ Does this feature need to be embeddable? → Add ?show-only=key support and update IA table in this doc
□ Is all UI text in Bahasa Indonesia? → Verify all labels, messages, status displays
□ Does this add a new TypeScript type? → Add to src/types/<domain>.ts
□ Does this add a new API endpoint? → Add to src/services/<domain>/service.ts
```

### 16.3 Backend Change Checklist

When modifying or adding backend features, verify:

```
□ Does this add a new entity? → Add Sequelize model in model.js + associations at end of file + manual DDL
□ Does this involve multi-step writes? → Wrap in Sequelize transaction with commit/rollback
□ Does this involve operational data? → Add active shift check (KitchenShift/CashierShift/WarehouseShift)
□ Does this modify order stock? → Use atomic SQL literal for end_stock, never JS arithmetic
□ Does this add a route? → Place before authMiddleware if public, after if protected
□ Does this involve financial data? → Recompute from source records; never store aggregated totals
□ Does this change fund request approval? → Preserve partial approval logic (0/some/all items approved)
□ Does this change reservation creation? → Preserve: customer-created = Pending, employee-created = Disetujui
□ Does this involve inventory quantity? → Create StockMovement record; update InventoryItem.quantity atomically
□ Are all custom exceptions used correctly? → Use NotFoundException/ConflictException/BadRequestException/UnauthorizedException
□ Are IDs prefixed for display? → Use prefixId() for output, decodePrefixedId() for input on fund requests, reservations
□ Does this need to appear in finance summary? → Modify financeService.getSummary() query composition
```

### 16.4 Business Rules That Must Never Be Violated

These rules are the behavioral contracts of the system. Violations corrupt data integrity:

| Rule ID | Rule | Where Enforced |
|---|---|---|
| **R1** | Order cannot be created without active KitchenShift | Backend orderService.create() |
| **R2** | Order cannot be created without active CashierShift | Backend orderService.create() |
| **R3** | Same table cannot have two active dine-in orders in same KitchenShift | Backend orderService.create() |
| **R4** | Order items must exist in current KitchenShiftDetail | Backend orderService.create() |
| **R5** | Order items cannot exceed end_stock in KitchenShiftDetail | Backend orderService.create() |
| **R7** | Cancelled order restores end_stock atomically | Backend orderService.updateStatus() |
| **R8** | Order auto-completes when all items Tersaji AND payment Lunas | Backend orderService.updateItems/updatePayment() |
| **R9** | Only one active KitchenShift per branch | Backend kitchenShiftService.start() |
| **R10** | Only one active CashierShift per branch | Backend cashierShiftService.start() |
| **R11** | Only one active WarehouseShift globally | Backend warehouseShiftService.start() |
| **R13** | Stock deductions cannot exceed InventoryItem.quantity | Backend inventoryService.stockMovement() |
| **R14** | StockRequest and FundRequest require active WarehouseShift | Backend inventoryService / financeService |
| **R15** | StockRequest requires active KitchenShift for the branch | Backend inventoryService |
| **R17** | Midtrans snap token expires in 15 minutes | Backend orderService (Midtrans payload) |
| **R18** | Lunas/Refund payments cannot be updated | Backend orderService.updatePayment() |
| **R19** | Refunding an item creates RefundItem and sets item status=Refund | Backend orderService.refund() |
| **R20** | If ALL items refunded, Order.status = Refund | Backend orderService.refund() |
| **R22** | Employee with role=null throws UnauthorizedException | Backend auth.js middleware via employeeService.getOne() |

### 16.5 How Frontend and Backend Must Remain Aligned

| Concern | Frontend Must | Backend Must |
|---|---|---|
| **API endpoint paths** | Match service file URL strings exactly | Not change paths without frontend update |
| **Response envelope** | Parse `data` field from `{status, message, data}` | Always return this envelope structure |
| **Status strings** | Display status values using Indonesian strings (Pending, Diproses, Tersaji, Selesai, etc.) | Never change status string values without frontend update |
| **Role names** | Use exact role strings: admin, pemilik, bendahara, kasir, dapur, gudang | Never rename roles without frontend type update |
| **Branch ID filter** | Send `branch_id` query param | Respect and filter by `branch_id` |
| **Prefixed IDs** | Send prefixed IDs (e.g., `fun-req-1`) as received | Decode with `decodePrefixedId()` before DB lookup |
| **Firebase JWT** | Inject `Authorization: Bearer <token>` via api.ts | Verify via Firebase Admin SDK `verifyIdToken()` |
| **Currency** | Format IDR integers for display (no decimals) | Store as BIGINT/INT; never float |
| **Timezone** | Display times in WIB (UTC+7) | All computations in Asia/Jakarta timezone |

### 16.6 How to Introduce a New Feature

**Pattern: New widget on an existing page**

```
1. Backend: Add service logic + handler + register route
2. Backend: Add model if new entity needed (+ manual DDL)
3. Frontend: Add TypeScript type in src/types/<domain>.ts
4. Frontend: Add service function in src/services/<domain>/
5. Frontend: Add composable in src/composables/use<Feature>.ts
6. Frontend: Create Vue component in src/views/pages/<role>/components/
7. Frontend: Wire into page: call composable in onMounted + watch(selectedBranch)
8. Frontend: Add ?show-only key if widget should be embeddable
9. Update: This SYSTEM_RELATIONSHIP_SYNTHESIS.md with new capability/API/entity
```

**Pattern: New inter-department workflow**

```
1. Define: State machine (statuses as VARCHAR strings matching Indonesian business terms)
2. Define: Which shift types are required as preconditions
3. Define: Which role creates vs which role approves
4. Backend: Implement with multi-step PUT endpoint (type discriminator pattern, like updateOrder)
5. Frontend: Implement status-priority ordering in list display (actionable items first)
6. Frontend: Implement per-item approval sub-modal using useOverlayManager
7. Update: Add to User Journey Map in this document
```

### 16.7 How to Perform Impact Analysis for a Given Change

To answer "What happens if I change X?":

1. **Find X in the Entity list** (Section 9.1) or **API list** (Section 8)
2. **Check Blast Radius** (Section 15.2) for X
3. **Check which User Journeys** pass through X (Section 6)
4. **Check business rules** that reference X (Section 16.4)
5. **Check frontend composables** that call APIs touching X (Section 4.3)
6. **Check criticality** (Section 13) — is this Mission Critical?
7. **Verify frontend-backend alignment** items for X (Section 16.5)
8. **Write the change** using the appropriate checklist (Section 16.2 or 16.3)

---

## 17. Executive Technical Summary

### What This System Is

NURCHS POS is a **production-deployed, academically-originated restaurant management platform** that succeeds at its primary mission: digitizing the complete operational lifecycle of a multi-branch Indonesian restaurant. The system demonstrates architectural maturity in its core design patterns while carrying technical debt appropriate to its origin as a thesis project.

### The Architectural Contract

The system is built on two organizing principles:

1. **Shift-anchored data model**: Every revenue-generating and operational record is bound to a time-bounded shift. This enables daily reconciliation, session-scoped stock management, and a clean audit trail. The shift IS the operational session.

2. **Role-isolated workspaces**: Each of five staff roles has exactly one route, one workspace, and one set of capabilities. The system does not present a unified dashboard — it presents the right dashboard to the right person.

### Strengths

- **Correct business logic** — The order, payment, and stock management workflows accurately reflect restaurant operations
- **Transactional integrity** — All multi-step writes are wrapped in Sequelize transactions
- **Type-safe frontend** — Full TypeScript coverage with domain-complete types
- **Layered architecture** — Clear separation: handler → service → model on backend; composable → service → api on frontend
- **Production-proven** — Actively used in live restaurant operations

### Key Technical Risks

| Risk | Severity | Business Impact |
|---|---|---|
| No backend RBAC | High | Any authenticated employee can call any endpoint |
| No real-time updates (no WebSocket/SSE) | High | Kitchen may miss new orders without manual refresh |
| Firebase single point of failure | Medium | Auth unavailable if Firebase is down |
| No automated tests | High | Refactoring risk without safety net |
| Financial summary compute cost (no caching) | Medium | Performance degrades with scale |

### Evolution Path

The system has a clear path to production hardening:

1. **Immediate**: Add backend RBAC middleware (role guard arrays per route)
2. **Short-term**: Add Server-Sent Events for kitchen order board (real-time updates)
3. **Short-term**: Activate 401 auto-retry (already implemented, just commented out in api.ts)
4. **Medium-term**: Add input validation (Zod at handler layer), pagination on list endpoints
5. **Long-term**: Redis caching for finance-summary, test suite (Vitest + Playwright)

### For Any AI Agent Working on This System

**The most important question to ask before any change:**

> Does this change respect the shift-anchored data model? Does it preserve transactional integrity? Does it keep business rules in the backend service layer?

If the answer to all three is yes, the change is architecturally sound.

**The three files that touch everything:**
- Backend: `app/model/model.js` — all entities and relationships
- Backend: `app/service/orderService.js` — the central coordinator of revenue flow
- Frontend: `src/router/index.ts` — the gatekeeper of all role-based access

---

*Document synthesized from:*
- `Point-of-Sales/FRONTEND_MASTER_CONTEXT.md` (v1.0, 2026-06-05)
- `pos-service/BACKEND_MASTER_CONTEXT.md` (2026-06-05)

*This document should be updated whenever:*
- A new entity is added to the data model
- A new API endpoint is added or modified
- A new frontend capability or page is added
- A new role is added
- A business rule changes
- A new external integration is added
