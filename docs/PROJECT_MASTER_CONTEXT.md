# PROJECT MASTER CONTEXT
## NURCHS POS — Nasi Uduk Remaja Cikini Haji Sawid
### The Authoritative Project Knowledge Source
> **Version:** 1.0 | **Generated:** 2026-06-05 | **Status:** AUTHORITATIVE
>
> **Synthesized From:**
> - `FRONTEND_MASTER_CONTEXT.md` — Point-of-Sales (Vue 3 SPA, internal staff portal)
> - `BACKEND_MASTER_CONTEXT.md` — pos-service (Node.js/Express REST API)
> - `SYSTEM_RELATIONSHIP_SYNTHESIS.md` — End-to-end architecture model
>
> **Purpose:** Single source of truth for product understanding, system architecture, business domain, and engineering evolution. This document enables any Staff Engineer, Principal Architect, Product Manager, or AI Agent to understand what the product is, why it exists, how it operates, and how to evolve it safely without reading repository code.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Product Mission & Vision](#3-product-mission--vision)
4. [Business Domain Overview](#4-business-domain-overview)
5. [Business Capability Map](#5-business-capability-map)
6. [User Personas](#6-user-personas)
7. [User Journey Model](#7-user-journey-model)
8. [Product Workflow Model](#8-product-workflow-model)
9. [System Overview](#9-system-overview)
10. [Frontend Overview](#10-frontend-overview)
11. [Backend Overview](#11-backend-overview)
12. [Frontend ↔ Backend Relationship Model](#12-frontend--backend-relationship-model)
13. [Domain Model](#13-domain-model)
14. [Data Model](#14-data-model)
15. [Capability Model](#15-capability-model)
16. [Integration Landscape](#16-integration-landscape)
17. [Security Model](#17-security-model)
18. [Operational Model](#18-operational-model)
19. [Architectural Decisions](#19-architectural-decisions)
20. [Technical Constraints](#20-technical-constraints)
21. [Business Constraints](#21-business-constraints)
22. [Critical Dependencies](#22-critical-dependencies)
23. [Engineering Assessment](#23-engineering-assessment)
24. [Known Risks](#24-known-risks)
25. [Future Evolution Opportunities](#25-future-evolution-opportunities)
26. [Change Management Framework](#26-change-management-framework)
27. [AI Agent Implementation Guide](#27-ai-agent-implementation-guide)
28. [AI Agent Transformation Guide](#28-ai-agent-transformation-guide)
29. [Executive Technical Summary](#29-executive-technical-summary)

---

## 1. Executive Summary

**NURCHS POS** is a production-deployed, dual-application restaurant management platform built for **Nasi Uduk Remaja Cikini Haji Sawid** (NURCHS) — an Indonesian multi-branch restaurant chain. It was created as an undergraduate thesis project (Skripsi) by Prames Ray Lapian (Informatics Engineering, Universitas Padjadjaran) and is actively used in live restaurant operations.

The platform digitizes the **complete operational lifecycle** of a restaurant:

| Phase | Activities |
|---|---|
| **Before Service** | Menu management, inventory setup, shift opening, table reservations |
| **During Service** | Order creation, kitchen workflow, payment processing, stock requests |
| **After Service** | Shift closing, financial reconciliation, fund requests, reporting |

### System Identity at a Glance

| Property | Value |
|---|---|
| **Product Type** | Internal Staff POS Portal + Customer Self-Service App |
| **Business Domain** | Food & Beverage — Indonesian Restaurant Chain |
| **Operational Model** | Shift-bounded — ALL activity is shift-anchored |
| **Staff Roles** | 5 distinct roles (Owner, Treasurer, Cashier, Kitchen, Warehouse) |
| **Branch Model** | Multi-branch, centralized management |
| **Language** | Bahasa Indonesia (all UI, messages, status values) |
| **Currency** | Indonesian Rupiah (IDR), stored as BIGINT integers |
| **Timezone** | Asia/Jakarta (WIB, UTC+7) |
| **Frontend** | Vue 3 + Vuetify 3 SPA (TypeScript 5.7, Vite 6, Pinia) |
| **Backend** | Node.js 18 / Express 5 REST API (Sequelize 6, MySQL 8.0) |
| **Auth** | Firebase Authentication (JWT, Email/Password, Google OAuth) |
| **Payment** | Midtrans Snap API (digital) + Cash (direct) |
| **Deployment** | Railway (Production) + Docker Compose (Local) |

### The Core Organizing Principle

> **The shift is the operational unit.** Every transaction, order, payment, stock movement, and financial record is anchored to a time-bounded shift. Without an active shift, operational staff cannot perform their primary functions. Understanding the shift lifecycle is the key to understanding the entire system.

### Why This Document Exists

The three source documents (Frontend, Backend, System Synthesis) each describe a slice of the system. This document **unifies** them into a single authoritative knowledge source that answers:

- **WHAT** the product is and **WHY** it exists
- **WHO** it serves and **HOW** it creates value
- **HOW** the frontend and backend collaborate
- **HOW** the architecture supports business goals
- **HOW** future evolution should occur

If all other documentation disappeared, this document alone should allow the project to continue evolving safely and effectively.

---

## 2. Product Overview

### 2.1 Dual-Application Architecture

The NURCHS POS Platform comprises **two distinct frontend applications** backed by the **same single backend API**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NURCHS POS PLATFORM                              │
│                                                                     │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │   INTERNAL POS APP           │  │   CUSTOMER APP           │    │
│  │   internalposnurchs.         │  │   nurchs.up.railway.app  │    │
│  │   up.railway.app             │  │                          │    │
│  │                              │  │   - Browse menu            │    │
│  │   - Owner Dashboard          │  │   - Place orders           │    │
│  │   - Finance Dashboard        │  │   - Make reservations      │    │
│  │   - Cashier Workspace        │  │   - Pay via Midtrans       │    │
│  │   - Kitchen Workspace        │  │                          │    │
│  │   - Warehouse Workspace      │  │   [Separate repository]    │    │
│  │                              │  │                          │    │
│  │   [Point-of-Sales repo]      │  │                          │    │
│  └──────────────┬───────────────┘  └────────────┬─────────────┘    │
│                 │                               │                   │
│                 └───────────────┬───────────────┘                   │
│                                 ▼                                   │
│                  ┌─────────────────────────────┐                    │
│                  │     pos-service BACKEND      │                    │
│                  │     (Single monolith)        │                    │
│                  │     Railway / MySQL 8.0      │                    │
│                  └─────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

**Scope of this document:** The Internal POS (`Point-of-Sales` repository) and the `pos-service` backend. The Customer App is a separate frontend repository consuming the same backend via its public API routes.

### 2.2 The Internal POS Application

The Internal POS is **not** a traditional single-cashier POS. It is a **multi-branch, multi-role operational hub** where each role sees only their relevant operational workspace. This design reflects the real operational separation in a restaurant:

| Role | Indonesian Term | Workspace | Purpose |
|---|---|---|---|
| Owner/Admin | Pemilik / Admin | `/dashboard/pemilik` | Full operational + financial visibility across branches |
| Treasurer | Bendahara | `/dashboard/bendahara` | Revenue tracking, expense analysis, fund approvals |
| Cashier | Kasir | `/halaman/kasir` | Order creation, payment processing, cash management |
| Kitchen | Dapur | `/halaman/dapur` | Order queue, item status updates, stock requests |
| Warehouse | Gudang | `/halaman/gudang` | Inventory management, stock movements, fund requests |

### 2.3 What the Product Does

The system answers one core business question:

> *How does a multi-branch Indonesian restaurant chain achieve operational coordination, financial visibility, and inventory control across all departments without paper-based or disconnected tools?*

**The answer the system delivers:**
- Each role gets a **purpose-built digital workspace**, accessible only to that role
- All activities (orders, payments, stock movements) are **anchored to shifts** for auditability
- The owner gets a **real-time consolidated view** across all branches
- Financial reconciliation is **automatic from operational data**
- Kitchen-to-warehouse coordination follows a **formal request-approval workflow**

### 2.4 Product Classification

| Dimension | Classification |
|---|---|
| **System Type** | Enterprise Operational Management System (Staff-facing) |
| **Deployment Model** | Cloud-hosted SaaS (single-tenant per restaurant chain) |
| **User Model** | Role-isolated workspaces (not a unified dashboard) |
| **Data Model** | Shift-anchored transactional system |
| **Integration Profile** | Firebase (auth), Midtrans (payments), Railway (hosting) |
| **Maturity** | Production-deployed, academically originated, actively used |

---

## 3. Product Mission & Vision

### 3.1 Product Mission

> **To replace fragmented, paper-based restaurant operations with a unified digital platform that enforces business rules, provides real-time operational visibility, and generates financial intelligence — enabling every staff member to perform their role efficiently while giving management complete oversight of multi-branch operations.**

### 3.2 Product Vision

> **To become the operational backbone of NURCHS restaurant chain — where every order, every payment, every stock movement, and every financial record flows through a single trusted system that makes operations faster, audits trivial, and decision-making data-driven.**

### 3.3 Strategic Objectives

| # | Objective | Success Metric |
|---|---|---|
| 1 | **Operational Efficiency** | Replace paper-based or fragmented systems with a unified digital platform for all staff roles |
| 2 | **Financial Visibility** | Give owner and treasurer real-time insight into revenue, expenses, and net income across branches |
| 3 | **Shift-Based Accountability** | Tie all activities (orders, stock movements, cash flows) to shift records for complete auditability |
| 4 | **Multi-Branch Scalability** | Allow the owner to monitor and manage multiple branches from a single dashboard |
| 5 | **Inventory Control** | Reduce waste and stockouts through a request-approval workflow between kitchen and warehouse |
| 6 | **Academic Excellence** | Serve as a full-stack thesis project showcasing production-ready restaurant management engineering |

### 3.4 Value Proposition

**For the Owner:** Complete operational visibility across all branches with zero information delay. Every order, every payment, every stock movement is recorded and traceable to a specific employee and shift.

**For the Treasurer:** Automatic financial reconciliation from operational data. No more manual spreadsheet compilation — income, expenses, and net earnings are computed in real-time from source records.

**For the Cashier:** Fast, error-free order creation with integrated payment processing. Menu browsing, quantity selection, customer info, and payment — all in one smooth workflow.

**For the Kitchen:** Real-time order queue with clear status tracking. Know exactly what to cook, in what quantity, with per-shift stock management preventing overselling.

**For the Warehouse:** Accurate inventory tracking with formal request-approval workflows. Every stock movement is recorded; every fund request follows an approval chain.

### 3.5 Core Problems Solved

| Problem (Before) | Solution (After) |
|---|---|
| Orders taken on paper, prone to errors and loss | Digital order creation with automatic kitchen dispatch |
| No visibility into which orders are being cooked | Real-time order queue with status tracking (Pending → Processing → Served) |
| Cash management disconnected from orders | Cashier shift with opening float, tracked payments, and closing reconciliation |
| Kitchen runs out of ingredients mid-service | Per-shift stock declaration with automatic stock decrement on each order |
| Inventory tracked manually, stockouts common | Digital inventory with stock movements, thresholds, and expiry tracking |
| Financial reporting compiled manually from multiple sources | Automatic finance summary computed from OrderPayment + CashOut + FundRequest records |
| No audit trail for who did what | Every record has `created_by` / `updated_by` audit fields; all operations tied to shifts |
| Staff access uncontrolled | Role-based workspaces with Firebase authentication |

---

## 4. Business Domain Overview

### 4.1 Domain Classification

**Primary Domain:** Food & Beverage (F&B) — Full-service restaurant chain
**Business Model:** Multi-branch restaurant with centralized management
**Operational Model:** Shift-based — all operational activities are tied to a shift lifecycle (start → work → end)

### 4.2 Business Subdomains

| Subdomain | Type | Description | Criticality |
|---|---|---|---|
| **Shift Operations** | Core | Time-bounded operational windows for all roles | Mission Critical |
| **Order Management** | Core | Full order lifecycle from creation to completion | Mission Critical |
| **Payment Processing** | Core | Cash and online payment, refunds | Mission Critical |
| **Menu & Catalog** | Core | Menu items and categories per branch | Business Critical |
| **Inventory Management** | Core | Raw materials, stock levels, expiry tracking | Business Critical |
| **Stock Workflow** | Core | Inter-department ingredient request and fulfillment | Business Critical |
| **Finance & Reporting** | Supporting | Expense tracking, revenue aggregation, dashboards | Business Critical |
| **Identity & Access** | Supporting | Employee registration, Firebase auth, role assignment | Mission Critical |
| **Branch Management** | Supporting | Multi-location configuration | Business Critical |
| **Reservation** | Supporting | Table bookings for customers | Important |
| **Customer Management** | Generic | Customer identity and order history | Important |

### 4.3 Business Processes

The system supports **six core business processes**:

1. **Order Management:** Customer orders created by cashier → processed by kitchen → marked complete/refunded
2. **Inventory Management:** Warehouse tracks stock → Kitchen requests stock → Warehouse approves/rejects
3. **Financial Management:** Income from orders + cash flows → Treasurer reviews summaries, approves fund requests
4. **Shift Management:** All roles clock in/out via shift system; shift data drives financial and operational reports
5. **Reservation Management:** Customers book tables → Owner/management manages calendar
6. **Menu & Branch Management:** Owner manages menus, categories, branch definitions, and employee accounts

### 4.4 Business Domain Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RESTAURANT DOMAIN                           │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   IDENTITY   │    │    BRANCH    │    │   MENU & CATALOG     │  │
│  │  Firebase    │    │  Multi-Loc   │    │  Menu, Categories    │  │
│  │  Employee    │    │  Config      │    │  Pricing, Threshold  │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────┬───────────┘  │
│         │                   │                        │              │
│  ┌──────▼───────────────────▼────────────────────────▼──────────┐  │
│  │                    SHIFT OPERATIONS (Core)                    │  │
│  │  EmployeeShift │ KitchenShift │ CashierShift │ WarehouseShift │  │
│  └──────┬───────────────┬──────────────┬──────────────┬─────────┘  │
│         │               │              │              │             │
│  ┌──────▼──────┐  ┌─────▼──────┐ ┌────▼──────┐ ┌────▼──────────┐  │
│  │   ORDER     │  │  KITCHEN   │ │  CASHIER  │ │   WAREHOUSE   │  │
│  │  MANAGEMENT │  │  WORKFLOW  │ │  PAYMENT  │ │  INVENTORY    │  │
│  │             │  │            │ │           │ │               │  │
│  │ Orders      │  │ KSD Details│ │ OrderPay  │ │ InventoryItem │  │
│  │ OrderItems  │  │ Stock Mgmt │ │ CashIn    │ │ StockMovement │  │
│  │ Refunds     │  │            │ │ CashOut   │ │ StockRequest  │  │
│  └──────┬──────┘  └────────────┘ └───────────┘ └───────────────┘  │
│         │                                                           │
│  ┌──────▼─────────────────────────────────────────────────────┐    │
│  │              FINANCE & REPORTING                            │    │
│  │  FinanceSummary │ FundRequest │ Reservations               │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.5 Revenue Drivers

| Revenue Driver | Mechanism | System Support |
|---|---|---|
| **Order Sales** | Customers purchase menu items | Cashier order creation → Kitchen fulfillment → Payment settlement |
| **Digital Payments** | Midtrans online payment (cards, e-wallets, bank transfer) | Snap token generation → Webhook confirmation |
| **Cash Payments** | Direct cash settlement at cashier | Cashier shift tracks all cash-in/cash-out |

### 4.6 Operational Drivers

| Driver | System Feature |
|---|---|
| **Speed of Service** | Fast order creation with category-tab menu browsing |
| **Kitchen Efficiency** | Real-time order queue with item-level status tracking |
| **Stock Availability** | Per-shift stock declaration with automatic decrement |
| **Financial Accuracy** | Shift-anchored cash reconciliation + automatic finance summary |
| **Staff Accountability** | Every action tied to employee + shift + timestamp |

### 4.7 Critical Success Factors

1. **Shift discipline** — All staff must start shifts before operational features are available
2. **Stock accuracy** — Kitchen must declare accurate initial quantities; warehouse must track movements precisely
3. **Payment completeness** — Every order must be settled (cash or digital) for accurate financial reporting
4. **Role isolation** — Each staff member must only access their designated workspace
5. **Multi-branch data isolation** — Branch A data must never leak to Branch B views

### 4.8 Business Dependencies

| Dependency | Impact if Unavailable |
|---|---|
| Firebase Authentication | Complete system lockout — no staff can log in |
| MySQL Database | Total data loss — all operational records inaccessible |
| Midtrans (digital payments) | Cash-only fallback — digital revenue halts |
| Railway hosting | System offline entirely |

### 4.9 Business Risks

| Risk | Severity | Description |
|---|---|---|
| No backend RBAC | High | Any authenticated employee can call any API endpoint |
| No real-time updates | High | Kitchen may miss new orders without manual refresh |
| Firebase single point of failure | Medium | Auth completely unavailable if Firebase is down |
| Financial summary compute cost | Medium | 4-8 queries per request with no caching — degrades with scale |
| No automated tests | High | Refactoring risk without safety net |
| Manual inventory from stock requests | Medium | StockRequest completion does NOT auto-update InventoryItem.quantity |


---

## 5. Business Capability Map

### 5.1 Capability Hierarchy

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

### 5.2 Capability Definitions

#### C1: Authentication & Role Access Control
| Attribute | Value |
|---|---|
| **Purpose** | Verify identity, map to role, route to correct workspace |
| **Business Value** | Each employee sees and can only act within their operational domain |
| **User Value** | Staff log in once and land on their dedicated workspace automatically |
| **Frontend Features** | LoginPage, RegisterPage, EmailVerification, router guards, LandingPage redirect |
| **Backend Services** | Firebase Admin SDK verification, employee profile lookup |
| **Supporting Domains** | Identity & Access |
| **Criticality** | **Mission Critical** — gates the entire system |
| **Failure Impact** | Complete system inaccessibility |

#### C2: Shift Lifecycle Management
| Attribute | Value |
|---|---|
| **Purpose** | Create time-bounded operational windows for each department |
| **Business Value** | All records are session-scoped for daily reconciliation and auditability |
| **User Value** | Staff start their shift → work → end shift; all actions recorded per session |
| **Frontend Features** | StartShift, UpdateShift, EndShift overlays on each operational page |
| **Backend Services** | Four shift types (Employee, Cashier, Kitchen, Warehouse) with lifecycle enforcement |
| **Supporting Domains** | Shift Operations |
| **Dependencies** | C1 (Authentication) |
| **Criticality** | **Mission Critical** — orders CANNOT exist without active Kitchen + Cashier shifts |
| **Failure Impact** | Staff cannot begin work; all operational capabilities blocked |

#### C3: Order Management & Kitchen Fulfillment
| Attribute | Value |
|---|---|
| **Purpose** | Record customer purchases, dispatch to kitchen, track status to completion |
| **Business Value** | Revenue generation + kitchen coordination — the core restaurant transaction |
| **User Value** | Cashier creates orders fast; Kitchen sees clear work queue |
| **Frontend Features** | CashierPage (CreateOrder, UpdateOrder, CurrentOrderQue), KitchenPage (CurrentOrderQue, DetailOrder) |
| **Backend Services** | orderService with transactional create, status update, and stock decrement |
| **Supporting Domains** | Order Management, Kitchen Workflow |
| **Dependencies** | C1 (Auth), C2 (Active KitchenShift + CashierShift) |
| **Criticality** | **Mission Critical** |
| **Failure Impact** | Revenue halts; kitchen has no work queue |

#### C4: Payment Processing
| Attribute | Value |
|---|---|
| **Purpose** | Settle orders via cash or Midtrans digital payment |
| **Business Value** | Revenue collection with audit trail per cashier shift |
| **User Value** | Customers pay via their preferred method; cashier tracks all payments |
| **Frontend Features** | Payment.vue overlay (snap token flow + direct cash), Midtrans snap.js |
| **Backend Services** | OrderPayment record, Midtrans Snap token generation, webhook confirmation |
| **Supporting Domains** | Payment Processing |
| **Dependencies** | C1 (Auth), C2 (Active CashierShift), C3 (Order exists) |
| **Criticality** | **Mission Critical** for cash; **Business Critical** for digital |
| **Failure Impact** | Cash fallback still works; digital payment broken |

#### C5: Inventory Management
| Attribute | Value |
|---|---|
| **Purpose** | Track warehouse raw material quantities, costs, and expiry |
| **Business Value** | Prevent stockouts; feed cost data into financial reporting |
| **User Value** | Warehouse staff know exact stock levels and can track movements |
| **Frontend Features** | InventoryPage — InventoryItems (CRUD), StockMovement (record/view) |
| **Backend Services** | InventoryItem CRUD + StockMovement service (atomic quantity adjustment) |
| **Supporting Domains** | Inventory Management |
| **Dependencies** | C2 (Active WarehouseShift) |
| **Criticality** | **Business Critical** |
| **Failure Impact** | Warehouse operations blind; financial cost data inaccurate |

#### C6: Financial Reporting & Summaries
| Attribute | Value |
|---|---|
| **Purpose** | Aggregate revenue, expenses, and net income per period and branch |
| **Business Value** | Business performance visibility for owner and treasurer |
| **User Value** | One-click financial overview with period filtering and charts |
| **Frontend Features** | FinanceDashboard — TotalEarning, TotalIncome, TotalExpense (ApexCharts bar charts) |
| **Backend Services** | `/finance-summary` — computed from OrderPayment + CashierShiftCashOut + FundRequestItem |
| **Supporting Domains** | Finance & Reporting |
| **Dependencies** | C3 (Orders), C4 (Payments), C8 (FundRequests) |
| **Criticality** | Important (critical for decisions); does not block operations |
| **Note** | Financial summary is **always recomputed** — never stored; reflects real-time state |

#### C7: Menu & Catalog Management
| Attribute | Value |
|---|---|
| **Purpose** | Define sellable items, prices, and categories per branch |
| **Business Value** | Accurate menu for cashier ordering + kitchen shift stock initialization |
| **User Value** | Owner manages the product catalog; cashiers see up-to-date menu |
| **Frontend Features** | Owner Dashboard → Management modal → DetailMenu sub-component |
| **Backend Services** | Menu CRUD, Category CRUD, branch-scoped |
| **Supporting Domains** | Menu & Catalog |
| **Dependencies** | C1 (Auth as admin/pemilik) |
| **Criticality** | **Business Critical** — menu drives KitchenShiftDetail initialization |
| **Failure Impact** | New items cannot be added; stale menu causes ordering errors |

#### C8: Fund Request Approval Workflow
| Attribute | Value |
|---|---|
| **Purpose** | Controlled budget approval for warehouse procurement |
| **Business Value** | Financial governance over purchasing; feeds expense reporting |
| **User Value** | Warehouse requests funds; Treasurer approves/rejects per item |
| **Frontend Features** | Warehouse: CurrentFundRequest (create). Finance Dashboard: CurrentFundRequest (approve) |
| **Backend Services** | FundRequest CRUD with per-item approval logic |
| **Supporting Domains** | Finance & Reporting |
| **Dependencies** | C2 (Active WarehouseShift), C1 (Auth) |
| **Criticality** | Important |
| **Failure Impact** | Warehouse cannot procure supplies through approved channel |

#### C9: Reservation Management
| Attribute | Value |
|---|---|
| **Purpose** | Table booking by customers or staff |
| **Business Value** | Capacity planning, customer experience |
| **User Value** | Customers book tables; staff manage the calendar |
| **Frontend Features** | Owner Dashboard → CurrentReservation widget + UpdateReservation modal |
| **Backend Services** | Reservation CRUD; employee-created = auto-approved; customer-created = Pending |
| **Supporting Domains** | Reservation |
| **Criticality** | Important |

#### C10: Employee & Branch Management
| Attribute | Value |
|---|---|
| **Purpose** | CRUD for employee accounts, role assignment, branch configuration |
| **Business Value** | System administration — who can access what and where |
| **User Value** | Owner manages staff and locations from one place |
| **Frontend Features** | Owner Dashboard → Management widget → DetailAccount, DetailBranch sub-modals |
| **Backend Services** | Employee CRUD + Firebase user deletion; Branch CRUD |
| **Supporting Domains** | Identity & Access, Branch Management |
| **Criticality** | Important — failure blocks onboarding new staff |

#### C11: Stock Request Workflow (Kitchen ↔ Warehouse)
| Attribute | Value |
|---|---|
| **Purpose** | Formal inter-department ingredient request from kitchen to warehouse |
| **Business Value** | Controlled ingredient flow with accountability |
| **User Value** | Kitchen requests ingredients; Warehouse approves and prepares |
| **Frontend Features** | Kitchen: CurrentStockRequestList (create). Warehouse: CurrentStockRequestList (approve) |
| **Backend Services** | StockRequest multi-step status workflow with per-item approval |
| **Supporting Domains** | Stock Workflow |
| **Dependencies** | C2 (Active KitchenShift + WarehouseShift) |
| **Criticality** | Important |
| **Note** | Stock requests are **coordination records only** — do NOT auto-update InventoryItem.quantity |

#### C12: Attendance & Timesheet Tracking
| Attribute | Value |
|---|---|
| **Purpose** | Employee clock-in/out records, daily/weekly/monthly averages |
| **Business Value** | HR visibility, workforce utilization |
| **User Value** | Owner sees who's active and attendance trends |
| **Frontend Features** | Owner Dashboard → Timesheets widget, EmployeeActive widget |
| **Backend Services** | EmployeeShift CRUD + `/employees-activity` aggregation endpoint |
| **Supporting Domains** | Shift Operations |
| **Criticality** | Supporting — does not block any operations |

---

## 6. User Personas

### 6.1 Persona Summary

| Role | Indonesian Term | Workspace Route | Access Level | Staff Count |
|---|---|---|---|---|
| **Owner/Admin** | Pemilik / Admin | `/dashboard/pemilik` | Full — all dashboards and all pages | 1-2 |
| **Treasurer** | Bendahara | `/dashboard/bendahara` | Finance + shift visibility | 1-2 |
| **Cashier** | Kasir | `/halaman/kasir` | Order management only | 1+ per branch |
| **Kitchen** | Dapur | `/halaman/dapur` | Order display + stock request | 1+ per branch |
| **Warehouse** | Gudang | `/halaman/gudang` | Inventory + fund requests | 1 |

### 6.2 Pemilik / Admin (Owner / Administrator)

**Access Level:** Full — can see all dashboards and all pages
**Primary Workspace:** `/dashboard/pemilik` — Owner Dashboard
**Core Responsibilities:**
- Branch management (create, edit, delete branches)
- Employee management (assign roles, assign branches, deactivate accounts)
- Menu management (create, edit, delete menu items and categories)
- Reservation management (view, approve, reject, edit bookings)
- Shift oversight (view all shift records across all types)
- Overall business performance monitoring

**Key Concerns:**
- Full operational visibility across all branches
- Employee onboarding workflow (confirm new registrations)
- Accurate financial reporting
- Menu catalog accuracy

**System Entry:**
```
Login → Firebase Auth → GET /employee/me → role='admin' or 'pemilik'
→ LandingPage redirect → /dashboard/pemilik
```

### 6.3 Bendahara (Treasurer / Finance)

**Access Level:** Finance + shift visibility
**Primary Workspace:** `/dashboard/bendahara` — Finance Dashboard
**Core Responsibilities:**
- Revenue tracking (gross sales, refunds, net income)
- Expense tracking (cash-out, procurement costs via fund requests)
- Fund request approvals (review warehouse procurement requests)
- Shift financial summaries (correlate shift records with financial data)

**Key Concerns:**
- Accurate financial reconciliation per period and per branch
- Timely fund request approval for warehouse operations
- Discrepancy identification between expected and actual cash

**System Entry:**
```
Login → Firebase Auth → GET /employee/me → role='bendahara'
→ LandingPage redirect → /dashboard/bendahara
```

### 6.4 Kasir (Cashier)

**Access Level:** Order management only
**Primary Workspace:** `/halaman/kasir` — Cashier Page
**Core Responsibilities:**
- Creating orders (select menu items, quantities, customer info, table number)
- Updating orders (status changes, item modifications before kitchen starts)
- Processing payments (Midtrans snap + direct cash/digital)
- Managing refunds (partial refund of order items)
- Cash flow input (cash-in and cash-out entries to current shift)
- Starting and ending cashier shifts (opening float, actual cash count)

**Key Concerns:**
- **Speed of order creation and payment processing during peak hours**
- Accurate cash reconciliation at shift end
- Clear order queue visibility

**System Entry:**
```
Login → Firebase Auth → GET /employee/me → role='kasir'
→ LandingPage redirect → /halaman/kasir
→ Check: is_active? If false → show "belum memulai sif" warning
→ Must start CashierShift before operational UI appears
```

### 6.5 Dapur (Kitchen)

**Access Level:** Order display + stock request
**Primary Workspace:** `/halaman/dapur` — Kitchen Page
**Core Responsibilities:**
- Viewing incoming orders in real-time queue
- Updating order item status (Pending → Diproses → Tersaji)
- Updating overall order status
- Managing menu quantities per shift (declaring initial stock, monitoring remaining)
- Submitting stock requests to warehouse when ingredients run low
- Starting and ending kitchen shifts

**Key Concerns:**
- **Real-time visibility of order queue** (currently requires manual refresh)
- Clear stock availability per menu item
- Timely stock request submission to prevent service interruption

**System Entry:**
```
Login → Firebase Auth → GET /employee/me → role='dapur'
→ LandingPage redirect → /halaman/dapur
→ Check: is_active? If false → show warning
→ Must start KitchenShift (declare per-menu quantities) before operational UI appears
```

### 6.6 Gudang (Warehouse)

**Access Level:** Inventory + fund requests
**Primary Workspace:** `/halaman/gudang` — Inventory/Warehouse Page
**Core Responsibilities:**
- Managing inventory items (CRUD with categories, thresholds, expiry)
- Approving or rejecting stock requests from kitchen (per-item approval)
- Recording stock movements (in/out/reduction with quantity adjustment)
- Managing fund requests (create procurement requests for treasurer approval)
- Starting and ending warehouse shifts

**Key Concerns:**
- Accurate stock levels and timely request approval
- Proper stock movement recording for audit trail
- Procurement budget management via fund requests

**System Entry:**
```
Login → Firebase Auth → GET /employee/me → role='gudang'
→ LandingPage redirect → /halaman/gudang
→ Check: is_active? If false → show warning
→ Must start WarehouseShift before operational UI appears
```

### 6.7 Customer (External User)

**Access Level:** Self-service via separate Customer App (`nurchs.up.railway.app`)
**Primary Activities:**
- Browsing menu via QR code at table
- Placing orders with Midtrans payment
- Making table reservations
- Viewing order history

**Note:** Customers are NOT part of the Internal POS system. They use the separate Customer App repository, which consumes the backend's public API routes.

---

## 7. User Journey Model

### 7.1 Journey: Daily Restaurant Opening (Critical Path)

**Goal:** All operational staff are logged in and shifts are active so service can begin.

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

**Business Outcome:** Restaurant is operationally ready. All staff have active shifts. Orders can be created. Financial tracking is active.

### 7.2 Journey: Complete Order Lifecycle (Revenue Flow)

**Goal:** A customer order is created, prepared by kitchen, paid for, and completed.

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

**Business Outcome:** Revenue recorded. Kitchen fulfilled the order. Cashier collected payment. Financial summary will include this transaction.

### 7.3 Journey: Stock Request (Kitchen → Warehouse)

**Goal:** Kitchen requests ingredients from warehouse; warehouse approves and fulfills.

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

**Business Outcome:** Ingredient flow is documented and approved. Kitchen has what it needs. Warehouse has audit trail.

### 7.4 Journey: Fund Request (Warehouse → Treasurer → Completion)

**Goal:** Warehouse requests budget to purchase inventory; treasurer approves.

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

**Business Outcome:** Procurement is financially governed. Expense data feeds into financial reporting.

### 7.5 Journey: New Employee Onboarding

**Goal:** A new staff member is registered and granted system access.

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

**Business Outcome:** New staff member is authenticated, authorized, and routed to their correct operational workspace.

### 7.6 Journey: Daily Closing & Financial Reconciliation

**Goal:** All shifts are closed; financial summary is reviewed.

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

**Business Outcome:** Day's operations are closed. Financial performance is visible. Discrepancies are surfaced for investigation.

---

## 8. Product Workflow Model

### 8.1 Shift Lifecycle (The Core Operational Unit)

Every operational activity in the system is scoped to a **shift**. There are four shift types:

| Shift Type | Who Starts | Start Data | End Data | Tracks |
|---|---|---|---|---|
| **EmployeeShift** | All staff (auto) | (none — clock-in) | (none — clock-out) | Clock-in/out time, branch |
| **CashierShift** | Kasir | `branch_id`, `initial_cash` | `actual_cash` | Cash in/out, payments, orders, income, expenses |
| **KitchenShift** | Dapur | `branch_id`, `initial_menu[]` | `final_menu[]`, `notes` | Menu quantities, restock requests, order stats |
| **WarehouseShift** | Gudang | (none) | `notes` | Fund requests, stock movements |

**Operational Gate:** Pages check `userStore.me.activity.is_active` (employee shift active) AND operational shift state. If checks fail, operational UI is hidden and a warning is shown.

### 8.2 Order Status Lifecycle

```
Order Status:    Pending → Diproses → Tersaji → Selesai
                                          ↘ Batal
                                          ↘ Refund (partial refund of items)

Order Item Status: Pending → Diproses → Tersaji
                                          ↘ Batal
                                          ↘ Refund

Payment Status:  Pending → Lunas
                        ↘ Gagal
                        ↘ Batal
```

**Auto-promotion Rule:** When all items are `Tersaji` AND payment is `Lunas`, order auto-transitions to `Selesai`.

### 8.3 Stock Request Lifecycle

```
Dapur creates StockRequest (branch_id, items + quantities, note)
  → Status: Pending

Gudang reviews in InventoryPage → CurrentStockRequestList
  → Approves/rejects items individually (items: { id, approved: boolean })
  → Item status: Pending → Siap / Diproses / Ditolak
  → Request status: Pending → Diproses → Siap → Selesai / Ditolak
```

### 8.4 Fund Request Lifecycle

```
Gudang creates FundRequest (subject, description, items + quantities, amount)
  → Status: Pending

Bendahara reviews in FinanceDashboard → CurrentFundRequest widget
  → Approves/rejects items individually (items: { id, approved: boolean })
  → Sets approval_notes, total_approved
  → Status transitions: Pending → Disetujui / Beberapa Disetujui / Ditolak → Selesai
```

### 8.5 Reservation Lifecycle

| Status | Set By | Meaning |
|---|---|---|
| `Pending` | Customer self-service | Needs employee approval |
| `Disetujui` | Employee approval | Confirmed booking |
| `Ditolak` | Employee rejection | Booking declined |

**Rule:** Employee-created reservations are immediately `Disetujui`. Customer-created reservations start as `Pending`.

---

## 9. System Overview

### 9.1 System Architecture

The NURCHS POS platform follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION TIER                            │
│                                                                      │
│  ┌─────────────────────────┐    ┌──────────────────────────────┐    │
│  │   Internal POS SPA      │    │   Customer App (separate)    │    │
│  │   Vue 3 + Vuetify 3     │    │   Vue 3 + Vuetify 3          │    │
│  │   TypeScript + Pinia    │    │   (separate repository)      │    │
│  │   Firebase Auth Client  │    │                              │    │
│  └───────────┬─────────────┘    └──────────────┬───────────────┘    │
│              │                                 │                     │
│              └───────────────┬─────────────────┘                     │
│                              ▼                                       │
│              ┌───────────────────────────────┐                       │
│              │   Firebase Authentication      │                       │
│              │   (Identity Provider)           │                       │
│              └───────────────┬───────────────┘                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │ HTTPS + Bearer JWT
┌──────────────────────────────┼───────────────────────────────────────┐
│                         APPLICATION TIER                             │
│                              │                                        │
│              ┌───────────────▼───────────────┐                       │
│              │   pos-service (REST API)       │                       │
│              │   Node.js 18 + Express 5       │                       │
│              │   Sequelize 6 ORM              │                       │
│              │   Firebase Admin SDK           │                       │
│              │   Midtrans Client              │                       │
│              └───────────────┬───────────────┘                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────────┐
│                         DATA TIER                                    │
│                                                                      │
│              ┌───────────────────────────────┐                       │
│              │   MySQL 8.0 (Railway)          │                       │
│              │   20 tables, UTF8MB4             │                       │
│              │   Lazy singleton connection      │                       │
│              └───────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 System Properties

| Property | Frontend (Internal POS) | Backend (pos-service) |
|---|---|---|
| **Language** | TypeScript 5.7 | JavaScript (ES Modules) |
| **Runtime** | Browser (Vite 6 dev / production build) | Node.js ≥ 18 |
| **Framework** | Vue 3 (Composition API `<script setup>`) | Express 5.x |
| **UI Library** | Vuetify 3 (Material Design 3, PurpleTheme) | N/A |
| **State Management** | Pinia (3 global stores + composable-local refs) | N/A |
| **ORM** | N/A | Sequelize 6.x |
| **Database** | N/A | MySQL 8.0 |
| **Auth** | Firebase Client SDK (Email/Password + Google OAuth) | Firebase Admin SDK |
| **HTTP Client** | Axios with Firebase JWT interceptor | Express middleware |
| **Payment** | Midtrans snap.js (client-side popup) | Midtrans Client (server-side token) |
| **Charts** | ApexCharts via vue3-apexcharts | N/A |
| **Deployment** | Docker → Railway | Railway + Docker Compose (local) |
| **Live URL** | `internalposnurchs.up.railway.app` | Railway-hosted API |

### 9.3 Boot Sequence

**Frontend Boot (main.ts):**
```
1. Initialize Pinia stores
2. Register all plugins (Vuetify, ApexCharts, PerfectScrollbar, vue-tabler-icons, vue3-print-nb)
3. authStore.initialize() — attach Firebase onIdTokenChanged listener, await first resolution
4. If authenticated → userStore.fetchMe() — fetch employee profile from backend
5. router.isReady() — wait for router
6. app.mount('#app') — finally mount
```

**Backend Boot (src/index.js):**
```
src/index.js
  └─ cmd/index.js         (imports bootstrap)
       └─ app/app.js      (initializes express via initServer())
            └─ rest.js    (registers all routes, CORS, middleware)
                 └─ mysql.js    (lazy singleton Sequelize connection)
                      └─ model.js    (all 20 Sequelize model definitions + associations)
```

### 9.4 The Core Organizing Principle (Reinforced)

> **The shift is the operational unit.** Every transaction, order, payment, stock movement, and financial record is anchored to a time-bounded shift. Without an active shift, operational staff cannot perform their primary functions.

This principle is the lens through which the entire system must be understood:
- **Orders** require an active KitchenShift AND CashierShift
- **Stock requests** require an active KitchenShift AND WarehouseShift
- **Fund requests** require an active WarehouseShift
- **Stock movements** require an active WarehouseShift
- **Financial summaries** aggregate data from shift-anchored records
- **Audit trails** reference shifts via `created_by`/`updated_by` on every entity


---

## 10. Frontend Overview

### 10.1 Architectural Style

The frontend is a **Single-Page Application (SPA)** using Vue 3 Composition API (`<script setup>`) exclusively. It follows a **three-tier component model**:

```
Page (view) → Widget/Feature Component → Sub-modal (overlay) Component
```

Pages own data fetching and branch selection state. Feature components receive data via props and emit refresh calls. Sub-modals are opened imperatively via `useOverlayManager`.

### 10.2 Directory Structure & Responsibilities

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
        ├── shift/         # Shift start page
        └── user/          # User-related pages
```

### 10.3 Layout System

Two layouts exist:
- **`FullLayout.vue`** (`src/layouts/full/`) — The authenticated app shell with vertical sidebar, top header, and footer. Used for all authenticated routes.
- **Blank (no layout)** — Public routes (login, register, email verification, 404) render without the app shell.

### 10.4 Route Architecture

| Route | Path | Component | Allowed Roles |
|---|---|---|---|
| Authentication | `/login` | `LoginPage.vue` | Public |
| Register | `/register` | `RegisterPage.vue` | Public |
| Email Verification | `/verify-email` | `EmailSent.vue` | Public |
| Error 404 | `/error` | `Error404Page.vue` | Public |
| LandingPage | `/` | Role-redirect logic | All authenticated |
| **Owner Dashboard** | `/dashboard/pemilik` | `OwnerDashboard.vue` | admin, pemilik |
| **Finance Dashboard** | `/dashboard/bendahara` | `FinanceDashboard.vue` | admin, pemilik, bendahara |
| **Cashier Page** | `/halaman/kasir` | `CashierPage.vue` | admin, pemilik, kasir |
| **Warehouse Page** | `/halaman/gudang` | `InventoryPage.vue` | admin, pemilik, gudang |
| **Kitchen Page** | `/halaman/dapur` | `KitchenPage.vue` | admin, pemilik, dapur |
| Starter | `/starter` | `StarterPage.vue` | Any authenticated (unconfirmed roles) |

### 10.5 Route Guard Logic

The global `beforeEach` guard enforces a strict multi-step authentication pipeline:

```
1. Wait for auth.loading to resolve (prevents race condition on reload)
2. If auth required AND not authenticated → redirect to /login
3. If authenticated AND no profile → fetchMe() AND WAIT
4. If email not verified → redirect to /verify-email (no logout)
5. If role is null → redirect to /starter (no logout, pending owner approval)
6. If already on /login or /register → redirect to /
7. If route has requiredRoles AND user role not in list → redirect to /
```

### 10.6 State Management Architecture

**Global Pinia Stores (4):**

| Store | Purpose | Key State |
|---|---|---|
| `auth.ts` | Firebase auth session | `user`, `loading`, `isAuthenticated` |
| `authUser.ts` | Employee profile + shift | `me` (Employee), `shift`, `hasRole()` |
| `alert.ts` | Global toast alerts | `alerts[]` with deduplication |
| `customizer.ts` | UI preferences | sidebar state, mini mode, font |

**Composable-Local State (Feature Data):**
All feature data (orders, inventory, shifts, menus, etc.) is managed **inside composables** using `ref()`, NOT in Pinia stores. Each composable call gets its own isolated state — this is intentional for avoiding cross-page state pollution.

**Exception:** `useOverlayManager` uses a module-level singleton for one global overlay stack.

### 10.7 Component Communication Patterns

| Pattern | Description | Used By |
|---|---|---|
| **Props-down, Refresh-up** | Pages pass data as props and `refresh` callbacks. Components call `refresh()` after mutations. | All feature components |
| **Overlay Stack (Imperative)** | Sub-modals opened via `useOverlayManager().openOverlay({ component, props })` | All sub-modal components |
| **Global Alerts** | `useAlertStore().showAlert(message, type)` — fixed toast, auto-dismiss 3s, deduplicates | All mutation paths |
| **Branch Selector** | Each page owns `selectedBranch` ref; `watch(selectedBranch)` triggers re-fetch | All multi-branch pages |
| **`show-only` Query Param** | `?show-only=<key>` isolates a single widget for mobile/deep-linking | All dashboard pages |

### 10.8 Design System

**UI Framework:** Vuetify 3 — Material Design 3 with custom PurpleTheme

**Color Palette:**

| Token | Value | Usage |
|---|---|---|
| `primary` | `#1e88e5` | Primary actions, buttons, active states |
| `secondary` | `#5e35b1` | Secondary accents, badges |
| `info` | `#03c9d7` | Informational states |
| `success` | `#00c853` | Success alerts, completed states |
| `warning` | `#ffc107` | Warning alerts, low stock indicators |
| `error` | `#f44336` | Error alerts, destructive actions |
| `containerBg` | `#eef2f6` | Page background |
| `surface` | `#fff` | Card/dialog surface |

**Typography:** Roboto font via Vuetify text utilities (`text-h4`, `text-subtitle-1`, etc.)

**Responsive Strategy:** `useDisplay()` breakpoint detection; dual layouts per page (desktop sidebar vs. mobile stacked with sticky branch pill).

---

## 11. Backend Overview

### 11.1 Architectural Style

The backend is a **single monolithic REST API** — no microservices. All logic resides in the `pos-service` process. It follows a **layered architecture**:

```
HTTP Request
  ↓
infrastructure/rest/rest.js  (route registration, CORS, middleware)
  ↓
middleware/auth.js           (Firebase JWT verification)
  ↓
app/handler/*.js             (validate + parse HTTP request)
  ↓
app/service/*.js             (ALL business logic, workflows, transactions)
  ↓
app/model/model.js           (Sequelize ORM definitions + associations)
  ↓
infrastructure/database/mysql.js  (lazy singleton Sequelize → MySQL)
```

### 11.2 Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **HTTP Routing** | `infrastructure/rest/rest.js` | Route registration, CORS, middleware chain |
| **Request Handlers** | `app/handler/*.js` | Validate + parse HTTP request, call service |
| **Business Logic** | `app/service/*.js` | All domain rules, workflows, transactions |
| **Data Models** | `app/model/model.js` | Sequelize ORM definitions + associations (20 models, 1,463 lines) |
| **Auth Middleware** | `middleware/auth.js` | Firebase token verification |
| **Error Middleware** | `middleware/error.js` | Centralized error-to-HTTP-status mapping |
| **DB Connection** | `infrastructure/database/mysql.js` | Lazy singleton Sequelize connection |
| **Config** | `app/config/config.js` | Environment-based DB config (local/dev/prod) |
| **Response Format** | `infrastructure/rest/response.js` | Standardized `{status, message, data}` envelopes |
| **Exceptions** | `exception/*.js` | Typed exception classes (NotFound, Conflict, BadRequest, Unauthorized) |
| **Utilities** | `util/util.js` | Prefixed ID encoding/decoding |

### 11.3 Service Inventory

| Service | File | Domain |
|---|---|---|
| `employeeService` | `app/service/employee.service.js` | Identity & Access |
| `branchService` | `app/service/branch.service.js` | Branch Management |
| `menuService` | `app/service/menu.service.js` | Menu & Catalog |
| `orderService` | `app/service/order.service.js` | Order Management (central coordinator) |
| `kitchenShiftService` | `app/service/kitchen.shift.service.js` | Shift Operations (Kitchen) |
| `cashierShiftService` | `app/service/cashier.shift.service.js` | Shift Operations (Cashier) |
| `warehouseShiftService` | `app/service/warehouse.shift.service.js` | Shift Operations (Warehouse) |
| `employeeShiftService` | `app/service/employee.shift.service.js` | Shift Operations (Employee) |
| `inventoryService` | `app/service/inventory.service.js` | Inventory Management |
| `financeService` | `app/service/finance.service.js` | Finance & Reporting |
| `reservationService` | `app/service/reservation.service.js` | Reservation |

### 11.4 Response Envelope

```json
// Success
{ "status": "success", "message": "...", "data": {...} }

// Error
{ "status": "error", "message": "...", "error": "..." }
```

### 11.5 Key Backend Design Decisions

| Decision | Rationale |
|---|---|
| **Single file model** (`model.js`, 1,463 lines) | Simplicity; avoids circular dependency issues with ES module associations |
| **Lazy singleton DB connection** | Allows models to be imported without immediately connecting |
| **UUID for Order PKs** | Prevents enumeration attacks on the primary revenue-sensitive entity |
| **Shift-anchored data model** | Enables per-session financial reconciliation and auditability |
| **Kitchen stock at shift level** (`KitchenShiftDetail.end_stock`) | Session-level tracking prevents overselling within a shift |
| **Find-or-create Customer** | Customers don't pre-register; orders must still have a customer reference |
| **Polymorphic `created_by`/`updated_by`** | Both employees and customers can create orders — single FK column handles both |
| **Financial summary always recomputed** | Reflects real-time state; never stores aggregated totals |

---

## 12. Frontend ↔ Backend Relationship Model

### 12.1 Page-to-API Domain Mapping

| Frontend Page | Route | Primary API Domains Consumed |
|---|---|---|
| **OwnerDashboard** | `/dashboard/pemilik` | employees-activity, employees, shifts (all types), reservations, menus, branches, categories |
| **FinanceDashboard** | `/dashboard/bendahara` | finance-summary, fund-requests, shifts (all types), total-order |
| **CashierPage** | `/halaman/kasir` | orders, shift/cashier, shift/employee, shift/kitchen (read) |
| **KitchenPage** | `/halaman/dapur` | orders, shift/kitchen, shift/warehouse (read), inventory/stock-requests |
| **InventoryPage** | `/halaman/gudang` | inventory/items, inventory/stock-requests, inventory/stock-movements, finance/fund-requests, shift/warehouse |
| **LoginPage** | `/login` | auth/register (on register), employee/me (post-login) |
| **CustomerApp** | `nurchs.up.railway.app` | menu-sales, order/customer, reservation/customer, customer |

### 12.2 Complete Data Flow Chain

Every API interaction follows this exact chain:

```
Vue Component (template + script)
    ↓  calls composable function (e.g. loadCurrentOrder())
Composable (src/composables/useXxx.ts)
    ↓  calls service function (e.g. fetchCurrentOrders())
Service (src/services/<domain>/xxxService.ts)
    ↓  builds URLSearchParams, calls api.get/post/put/delete
Axios Instance (src/services/api.ts)
    ↓  request interceptor: injects Firebase bearer token
REST API (pos-service)
    ↓  middleware/auth.js verifies Firebase JWT
Handler (app/handler/*.js) parses HTTP request
    ↓  calls
Service (app/service/*.js) executes business logic
    ↓  uses
Model (app/model/model.js) via Sequelize ORM
    ↓
MySQL 8.0 Database
```

### 12.3 Composable → Service → Backend Service Mapping

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

### 12.4 API Endpoint Surface

**Public Routes (No Authentication):**

| Method | Path | Description |
|---|---|---|
| GET | `/health-check` | Server health probe |
| POST | `/auth/register` | Register new employee account |
| GET | `/branch` | Get all branches |
| POST | `/customer` | Create customer account |
| GET | `/customer/:id` | Get customer by ID |
| PUT | `/customer/:id` | Update customer |
| GET | `/menu-sales` | Menu sales statistics by branch |
| GET | `/categories` | Get all categories |
| GET | `/category/:id` | Get single category |
| GET | `/orders/customer` | Get customer's order list |
| POST | `/order/customer` | Customer places order |
| PUT | `/order/customer/:id` | Customer updates order |
| POST | `/order/webhook` | Midtrans payment webhook |
| GET | `/reservations/customer` | Customer's reservations |
| POST | `/reservation/customer` | Customer creates reservation |
| PUT | `/reservation/customer/:id` | Customer updates reservation |

**Protected Routes (Requires Firebase Auth Token):**

| Domain | Key Endpoints |
|---|---|
| Employee | `GET /employee/me`, `GET /employees`, `PUT /employee/:uid`, `DELETE /employee/:uid` |
| Branch | `GET /branch/:id`, `POST /branch`, `PUT /branch/:id`, `DELETE /branch/:id` |
| Menu | `GET /menus`, `POST /menu`, `PUT /menu/:id`, `DELETE /menu/:id` |
| Category | `POST /category`, `PUT /category/:id`, `DELETE /category/:id` |
| Shift (Employee) | `GET /shift/employee/current`, `POST /shift/employee/start`, `PUT /shift/employee/:id/end` |
| Shift (Cashier) | `GET /shift/cashier/current`, `POST /shift/cashier/:branchId/start`, `PUT /shift/cashier/:id`, `PUT /shift/cashier/:id/end` |
| Shift (Kitchen) | `GET /shift/kitchen/current`, `POST /shift/kitchen/:branchId/start`, `PUT /shift/kitchen/:id`, `PUT /shift/kitchen/:id/end` |
| Shift (Warehouse) | `GET /shift/warehouse/current`, `POST /shift/warehouse/start`, `PUT /shift/warehouse/:id`, `PUT /shift/warehouse/:id/end` |
| Orders | `GET /orders/current`, `POST /order`, `POST /order/process-direct-payment`, `PUT /order/:id`, `PUT /order/:id/refund` |
| Inventory | `GET /inventory/items`, `POST /inventory/item`, `PUT /inventory/item`, `DELETE /inventory/item/:id` |
| Stock Requests | `GET /inventory/stock-requests`, `POST /inventory/stock-request`, `PUT /inventory/stock-request` |
| Stock Movements | `GET /inventory/stock-movements`, `POST /inventory/stock-movement` |
| Finance | `GET /finance-summary`, `GET /finance/fund-requests`, `POST /finance/fund-request`, `PUT /finance/fund-request` |
| Reservations | `GET /reservations`, `POST /reservation`, `PUT /reservation`, `DELETE /reservation/:id` |

### 12.5 Frontend-Backend Alignment Contract

| Concern | Frontend Responsibility | Backend Responsibility |
|---|---|---|
| **API endpoint paths** | Match service file URL strings exactly | Not change paths without frontend update |
| **Response envelope** | Parse `data` field from `{status, message, data}` | Always return this envelope structure |
| **Status strings** | Display using Indonesian strings (Pending, Diproses, Tersaji, Selesai, etc.) | Never change status string values without frontend update |
| **Role names** | Use exact strings: admin, pemilik, bendahara, kasir, dapur, gudang | Never rename roles without frontend type update |
| **Branch ID filter** | Send `branch_id` query param | Respect and filter by `branch_id` |
| **Prefixed IDs** | Send prefixed IDs (e.g., `fun-req-1`) as received | Decode with `decodePrefixedId()` before DB lookup |
| **Firebase JWT** | Inject `Authorization: Bearer <token>` via api.ts | Verify via Firebase Admin SDK `verifyIdToken()` |
| **Currency** | Format IDR integers for display (no decimals) | Store as BIGINT/INT; never float |
| **Timezone** | Display times in WIB (UTC+7) | All computations in Asia/Jakarta timezone |

---

## 13. Domain Model

### 13.1 Domain Dependency Graph

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

### 13.2 Cross-Domain Data Flow

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

### 13.3 Domain Isolation Rules

| Domain | Can Write To | Cannot Write To | Reads From |
|---|---|---|---|
| Order Management | Order, OrderItem, OrderPayment, KitchenShiftDetail (decrement) | Shifts (no direct write), InventoryItem | KitchenShift, CashierShift, Menu, Customer |
| Kitchen | KitchenShift, KitchenShiftDetail, (reads OrderItem) | Orders, Payments, InventoryItem | Order, Menu |
| Cashier | CashierShift, CashierShiftCashIn/Out, OrderPayment | KitchenShift, InventoryItem | Order, KitchenShift |
| Warehouse | WarehouseShift, InventoryItem, StockMovement, StockRequest, FundRequest | Orders, Payments, Shifts (other) | StockRequest, InventoryItem |
| Finance | FundRequest (approval), FinanceSummary (read only) | Orders, Inventory, Shifts | OrderPayment, CashierShiftCashOut, FundRequestItem |

### 13.4 Domain Ownership Summary

| Domain | Frontend Owner | Backend Owner | Data Owner |
|---|---|---|---|
| Identity & Access | `auth.ts`, `authUser.ts` stores | `middleware/auth.js`, `employeeService` | Firebase (identity) + MySQL (role/branch) |
| Shift Operations | `useShift()` composable | `*ShiftService` (4 services) | MySQL (4 shift tables + KitchenShiftDetail) |
| Order Management | `useCurrentOrder()` composable | `orderService` | MySQL (orders, order_items, order_payments) |
| Menu & Catalog | `useMenuItems()` composable | `menuService` | MySQL (menus, categories) |
| Inventory | `useInventoryItems()` composable | `inventoryService` | MySQL (inventory_items, stock_movements) |
| Stock Workflow | `useStockRequest()` composable | `inventoryService` | MySQL (stock_requests, stock_request_items) |
| Finance | `useFinanceSummary()` composable | `financeService` | Computed (no stored summary) |
| Reservation | `useReservation()` composable | `reservationService` | MySQL (reservations) |

---

## 14. Data Model

### 14.1 Entity Overview (20 Models, 20 Tables)

```
users                       (base identity table)
├── employees               (staff accounts — FK to users, branches)
└── customers               (customer accounts — FK to users)

branches                    (restaurant locations)

categories                  (dual-use: type = 'menu' | 'inv')
├── menus                   (sellable items — FK to branches, categories)
└── inventory_items         (warehouse materials — FK to categories)

-- SHIFT TABLES (time-bounded operational windows) --
employee_shifts             (individual employee clock-in/out)
kitchen_shifts              (kitchen session — FK to branches)
├── kitchen_shift_details   (menu stock per kitchen session)
cashier_shifts              (cashier session — FK to branches)
├── cashier_shift_cash_ins  (cash received)
└── cashier_shift_cash_outs (cash spent)
warehouse_shifts            (warehouse session — global)

-- ORDER TABLES --
orders                      (order header — UUID PK)
├── order_items             (line items)
│   └── refund_items        (refunded items)
└── order_payments          (payment record)

-- INVENTORY WORKFLOW --
stock_requests              (ingredient requests)
└── stock_requests_item     (request line items)
stock_movements             (inventory adjustments)

-- FINANCE --
fund_requests               (budget requests)
└── fund_requests_item      (budget request line items)

reservations                (table bookings)
```

### 14.2 Core Entities

#### User (Base Identity)
| Field | Type | Purpose |
|---|---|---|
| id | INT PK | Internal identity |
| type | ENUM('employee','customer') | Discriminator for 1:1 relations |

**Purpose:** Polymorphic audit trail — `created_by` and `updated_by` on Orders and Reservations reference `users.id`, allowing both staff and customers to create records in the same column.

#### Employee
| Field | Type | Purpose |
|---|---|---|
| id | INT PK | Internal identity |
| uid | VARCHAR(200) UNIQUE | Firebase UID — primary lookup key |
| name | VARCHAR(200) | Display name |
| email | VARCHAR(200) UNIQUE | Login identifier |
| role | ENUM | Access role (admin, pemilik, bendahara, gudang, dapur, kasir) |
| fk_user_id | FK to users | Base identity link |
| fk_branch_id | FK to branches | Assigned home branch |

**Critical Rule:** An employee with `role = null` is considered UNCONFIRMED and cannot access protected routes.

#### Customer
| Field | Type | Purpose |
|---|---|---|
| id | INT PK | Internal identity |
| name | VARCHAR(200) | Display name |
| phone | VARCHAR(200) UNIQUE | Deduplication key — used for find-or-create |
| fk_user_id | FK to users | Base identity link |

**Purpose:** Customers are identified by phone number. Auto-created on first order/reservation if phone doesn't already exist.

#### Branch
| Field | Type | Purpose |
|---|---|---|
| id | INT PK | Location identifier |
| name, address, contact | VARCHAR | Location info |
| open_time, close_time | VARCHAR(10) | Operating hours (display only) |

**Purpose:** Root of multi-branch data segregation. All operational entities reference a branch.

#### Menu
| Field | Type | Purpose |
|---|---|---|
| id | INT PK | Item identifier |
| name, description | VARCHAR | Display info |
| price | BIGINT | Selling price in IDR |
| threshold | INT | Minimum stock warning level |
| fk_branch_id | FK to branches | Branch-specific menu |
| fk_category_id | FK to categories | Menu grouping |

**Note:** Prices in BIGINT prevent floating-point errors in IDR calculations.

#### Order
| Field | Type | Purpose |
|---|---|---|
| id | UUID PK | Non-enumerable order ID |
| status | VARCHAR | Order lifecycle state |
| table_number | INT | Dine-in table (null for takeaway) |
| is_take_away | BOOLEAN | Takeaway flag |
| fk_branch_id | FK to branches | Location |
| fk_kitchen_shift_id | FK to kitchen_shifts | Session anchor |
| fk_cashier_shift_id | FK to cashier_shifts | Payment session anchor |
| fk_customer_id | FK to customers | Who ordered |
| created_by, updated_by | FK to users | Audit (polymorphic) |

#### KitchenShift / KitchenShiftDetail
| Field | Type | Purpose |
|---|---|---|
| KitchenShift.id | INT PK | Shift identifier |
| KitchenShift.start, end | DATE | Session window (end=null = active) |
| KitchenShift.fk_branch_id | FK | Which location |
| KitchenShiftDetail.fk_kitchen_shift_id | FK | Parent shift |
| KitchenShiftDetail.fk_menu_id | FK | Which menu item |
| KitchenShiftDetail.initial_stock | INT | Stock declared at shift start |
| KitchenShiftDetail.end_stock | INT | Remaining stock (decremented on each order) |

**Purpose:** `end_stock` is the real-time per-shift stock counter. When an order is placed, `end_stock` is atomically decremented. When an order is cancelled, `end_stock` is restored.

### 14.3 Data Ownership Matrix

| Data | Source of Truth | System of Record | Who Can Modify |
|---|---|---|---|
| **Employee Identity** | Firebase Auth | `employees` table (local cache) | Firebase (identity), Backend (role/branch) |
| **Employee Role** | `employees.role` (backend DB) | Backend only | Owner/Admin via PUT /employee/:uid |
| **Customer Identity** | `customers` table | Backend DB | Auto-created on first order |
| **Orders** | `orders` + `order_items` | Backend DB | Cashier (create), Kitchen (item status), Auto (completion) |
| **Order Stock** (session) | `kitchen_shift_details.end_stock` | Backend DB (per shift) | Auto (decrement on order), Auto (restore on cancel) |
| **Payment State** | `order_payments.status` | Backend DB | Cashier (updatePayment), Midtrans webhook (Lunas) |
| **Inventory Levels** | `inventory_items.quantity` | Backend DB | Warehouse (StockMovement only) |
| **Kitchen Stock** (session) | `kitchen_shift_details.end_stock` | Backend DB | Kitchen shift start (init), Orders (decrement), Cancels (restore) |
| **Financial Summary** | Computed from OrderPayment + CashierShiftCashOut + FundRequestItem | No stored table | Never directly written — emerges from transactions |
| **Reservations** | `reservations` table | Backend DB | Customer (create), Employee (create/update/delete) |
| **Shift Records** | 4 shift tables | Backend DB | Each role (own shift); Admin/Owner (all shifts) |
| **Branch Config** | `branches` table | Backend DB | Owner/Admin only |
| **Menu Catalog** | `menus` + `categories` tables | Backend DB | Owner/Admin only |

### 14.4 Critical Data Flows

**Flow 1: Order Creation (with Stock Decrement)**
```
Cashier/Customer → POST /order
  → Read: KitchenShift (validate active)
  → Read: CashierShift (validate active)
  → Write: Customer (find-or-create by phone)
  → Read: KitchenShiftDetail (validate stock)
  → [DB TRANSACTION]
     Write: Order (UUID PK, status=Pending)
     Write: OrderItems (N records)
     Write: OrderPayment (status=Pending)
     Update: KitchenShiftDetail.end_stock -= quantity
  → [COMMIT]
  → If Midtrans → Midtrans API → snap_token stored in OrderPayment
```

**Flow 2: Financial Summary Computation**
```
Revenue:  OrderPayment (status='Lunas') → finance-summary.income
Expenses: CashierShiftCashOut → finance-summary.expenses (Kas Keluar)
          FundRequestItem (status='Disetujui') × purchase_price → expenses (Permintaan Dana)
Net Income = Gross Sales - Refunds
Net Cashier Income = Cash + Digital - Cash Refunds - Digital Refunds - Expenses
```

**Flow 3: Inventory Adjustment**
```
Stock In:  StockMovement (status='Masuk') → InventoryItem.quantity += movement.quantity
Stock Out: StockMovement (status='Keluar' | 'Pengurangan') → InventoryItem.quantity -= movement.quantity
```

**Flow 4: Order Cancellation (Stock Restoration)**
```
Order cancelled (status='Batal')
  → All OrderItem records set to 'Batal'
  → For each cancelled item: KitchenShiftDetail.end_stock += quantity
  → Restoral uses atomic SQL: COALESCE(end_stock, 0) + qty
```


---

## 15. Capability Model

### 15.1 Complete Capability Map

| ID | Capability | Criticality | Frontend Page | Backend Service | Business Outcome |
|---|---|---|---|---|---|
| C1 | Authentication & Role Access | Mission Critical | Login, Register, EmailVerify | `auth.js`, `employeeService` | Secure role-based access |
| C2 | Shift Lifecycle Management | Mission Critical | All operational pages | `*ShiftService` (4 services) | Session-scoped operations |
| C3 | Order Management & Kitchen Fulfillment | Mission Critical | CashierPage, KitchenPage | `orderService` | Revenue generation |
| C4 | Payment Processing | Mission Critical | CashierPage (Payment.vue) | `orderService` + Midtrans | Revenue collection |
| C5 | Inventory Management | Business Critical | InventoryPage | `inventoryService` | Stock accuracy |
| C6 | Financial Reporting | Business Critical | FinanceDashboard | `financeService` | Business visibility |
| C7 | Menu & Catalog Management | Business Critical | OwnerDashboard (Management) | `menuService` | Product catalog |
| C8 | Fund Request Approval | Important | InventoryPage, FinanceDashboard | `financeService` | Procurement governance |
| C9 | Reservation Management | Important | OwnerDashboard | `reservationService` | Capacity planning |
| C10 | Employee & Branch Management | Important | OwnerDashboard (Management) | `employeeService`, `branchService` | System administration |
| C11 | Stock Request Workflow | Important | KitchenPage, InventoryPage | `inventoryService` | Ingredient coordination |
| C12 | Attendance & Timesheet | Supporting | OwnerDashboard | `employeeShiftService` | HR visibility |

### 15.2 Capability Dependencies

```
C1 (Auth)
  └── Required by: ALL capabilities

C2 (Shift Management)
  └── Required by: C3, C4, C5, C8, C11
      └── C3 (Order) requires: KitchenShift + CashierShift active
      └── C5 (Inventory) requires: WarehouseShift active
      └── C8 (Fund Request) requires: WarehouseShift active
      └── C11 (Stock Request) requires: KitchenShift + WarehouseShift active

C3 (Order Management)
  └── Required by: C4 (Payment), C6 (Finance)
  └── Depends on: C7 (Menu exists)

C4 (Payment Processing)
  └── Required by: C6 (Finance income)

C5 (Inventory Management)
  └── Required by: C11 (Stock Request references inventory items)

C7 (Menu Management)
  └── Required by: C2 (KitchenShift initialization), C3 (Order creation)

C8 (Fund Request)
  └── Required by: C6 (Finance expenses)
```

### 15.3 Capability Failure Impact Analysis

| Capability | Failure Mode | Immediate Impact | Cascading Impact |
|---|---|---|---|
| C1 (Auth) | Firebase outage | No one can log in | Complete operational halt |
| C2 (Shift) | Shift cannot start | Staff cannot begin work | Orders cannot be created |
| C3 (Order) | Order creation fails | Cannot take customer orders | Revenue stops; kitchen idle |
| C4 (Payment) | Midtrans failure | Digital payments fail | Cash-only fallback; longer queues |
| C5 (Inventory) | Stock tracking fails | Warehouse operations blind | Inaccurate financial cost data |
| C6 (Finance) | Summary computation fails | Dashboard goes blank | No financial visibility (operations continue) |
| C7 (Menu) | Menu cannot be updated | Stale catalog | Ordering errors; kitchen shift init problems |
| C8 (Fund Request) | Approval workflow broken | Warehouse cannot request funds | Supply chain interruption |
| C11 (Stock Request) | Request flow broken | Manual coordination needed | Kitchen may run out of ingredients |

---

## 16. Integration Landscape

### 16.1 External Integrations

#### Firebase Authentication
| Aspect | Details |
|---|---|
| **Purpose** | Identity management, session persistence, OAuth |
| **Frontend** | Firebase Client SDK — Email/password auth, Google Sign-In (popup), email verification, password reset, `onIdTokenChanged` listener |
| **Backend** | Firebase Admin SDK — `verifyIdToken()`, `getUser()`, `deleteUser()` |
| **Config** | Dual env: `VITE_FIREBASE_*` (prod) and `VITE_FIREBASE_*_DEV` (dev) |
| **Token Flow** | Client gets Firebase ID Token → sends as `Authorization: Bearer <token>` → Backend verifies with Admin SDK |
| **Persistence** | IndexedDB (primary) → LocalStorage (fallback) |
| **Criticality** | **Mission Critical** — entire auth system depends on Firebase |
| **Failure Impact** | Firebase outage = complete auth failure; no fallback |
| **Risk** | Single point of failure for authentication |

#### Midtrans Payment Gateway (Snap API)
| Aspect | Details |
|---|---|
| **Purpose** | Online payment processing (credit card, e-wallet, bank transfer) |
| **Frontend** | `window.snap.pay(token)` — hosted payment popup |
| **Backend** | `midtrans-client` — `snap.createTransaction()` generates snap_token |
| **Flow** | Backend creates payment → returns snap_token → Frontend triggers snap popup → handles success/failure |
| **Webhook** | `POST /order/webhook` (public, no auth) — Midtrans payment confirmation |
| **Security** | SHA512 signature verification of `(order_id + status_code + gross_amount + server_key)` |
| **Token Expiry** | 15 minutes |
| **Criticality** | **Business Critical** — required for digital payment processing |
| **Failure Impact** | Digital payments fail; cash payment still works |
| **Risk** | Midtrans availability; snap.js CDN dependency |

#### Railway (Deployment Platform)
| Aspect | Details |
|---|---|
| **Purpose** | Production hosting for both frontend and backend |
| **Frontend Build** | Docker container; `npm run build` → `serve -s dist` |
| **Backend** | Node.js process on Railway |
| **Database** | Railway managed MySQL 8.0 |
| **URLs** | Internal: `internalposnurchs.up.railway.app` | Customer: `nurchs.up.railway.app` |

### 16.2 Internal Integration Patterns

| Pattern | Frontend | Backend |
|---|---|---|
| **Auth State Sync** | `authStore.initialize()` attaches `onIdTokenChanged` listener | `middleware/auth.js` verifies token on every protected request |
| **Error Communication** | Displays `message` from backend response envelope | Returns structured `{status, message, error}` |
| **Currency Handling** | Formats IDR integers for display | Stores as BIGINT/INT; never computes floats |
| **Branch Filtering** | Sends `branch_id` as query param | Filters all queries by `branch_id` |
| **Status Values** | Displays Indonesian status strings | Defines and enforces status transition rules |

### 16.3 Integration Criticality Matrix

| Integration | Business Criticality | Operational Criticality | Failure Fallback |
|---|---|---|---|
| Firebase Authentication | Critical | Critical | None — complete lockout |
| MySQL Database | Critical | Critical | None — total data loss |
| Midtrans Snap API | High | Medium | Cash payment |
| Railway Hosting | Critical | Critical | None |
| ApexCharts (charts only) | Low | Low | Data still available, no visual |

---

## 17. Security Model

### 17.1 Authentication Architecture

The system uses **Firebase Authentication as the identity provider** with a **dual-validation model**:

1. **Firebase Auth** — Identity/session management (email verification, JWT tokens, Google OAuth)
2. **Backend Employee API** — Role and branch assignment (the backend owns who has what role)

A user can have a Firebase account but no role in the backend (pending owner approval). This two-gate system is intentional.

### 17.2 Auth State Machine

```
State: Loading (boot)
  ↓ onIdTokenChanged fires
State: Authenticated OR Unauthenticated

Authenticated path:
  ├── Email not verified → /verify-email
  ├── Role is null → /starter (pending approval)
  └── Role present → role-based redirect to workspace

Session persistence:
  - indexedDBLocalPersistence (primary)
  - browserLocalPersistence (fallback)
  → Sessions persist across page reloads
```

### 17.3 Token Injection Flow

```
Frontend Request
  → Axios request interceptor calls getIdTokenSoft()
  → Injects Authorization: Bearer <Firebase ID Token>
  → Sends to Backend

Backend Processing
  → middleware/auth.js calls admin.auth().verifyIdToken(token)
  → Invalid/expired → 401
  → Valid → decodedToken (uid, email)
  → employeeService.getOne(decodedToken.uid)
     → Employee not found → req.user.profile = null (enables registration flow)
     → Employee found → req.user.profile = employeeData
  → next() → route handler
```

### 17.4 Role-Based Access Control (RBAC)

**Roles:** `admin` | `pemilik` | `bendahara` | `gudang` | `dapur` | `kasir`

**Frontend RBAC:** UI-level only — routes protected by `beforeEach` guard comparing `userStore.me.role` against `to.meta.requiredRoles`.

**Backend RBAC:** **NOT IMPLEMENTED** — This is a critical security gap. Any authenticated employee can call any endpoint. Authorization is implicit through business logic (e.g., kitchen shift anchors kitchen operations) but there are no explicit role guards.

### 17.5 Trust Boundaries

| Boundary | Inside | Outside | Protection |
|---|---|---|---|
| **Firebase Auth** | Verified users | Unauthenticated requests | JWT verification |
| **Protected Routes** | Authenticated employees | Public (no auth) | `auth.js` middleware |
| **Role Workspaces** | Specific role users | Other roles | Frontend router guards |
| **Branch Data** | Same-branch users | Other-branch users | `branch_id` query filtering |
| **Webhook Endpoint** | Midtrans servers | Everyone | SHA512 signature verification |

### 17.6 Security Gaps

| Gap | Severity | Description |
|---|---|---|
| **No backend RBAC** | **High** | Any authenticated employee can call any API endpoint |
| **No rate limiting** | Medium | Brute force / DoS not mitigated |
| **No input sanitization** | Medium | Mitigated by Sequelize parameterization; no explicit middleware |
| **Deprecated crypto package** | Low | `crypto@1.0.1` deprecated; should use Node.js built-in `crypto` |
| **No API versioning** | Low | Breaking changes require coordinated frontend/backend deployment |

### 17.7 Security Constraints

1. Firebase JWT must be injected on every API call via `api.ts` interceptor
2. All protected backend routes must pass through `auth.js` middleware
3. `role = null` employees must be rejected (throw UnauthorizedException)
4. Midtrans webhook must verify SHA512 signature before processing
5. Order UUIDs prevent enumeration attacks
6. `alter: false` on Sequelize sync prevents accidental schema changes in production
7. CORS origins are explicitly whitelisted

---

## 18. Operational Model

### 18.1 Daily Operational Workflows

**Opening Sequence:**
```
1. Admin opens Employee Shifts as staff arrive
2. Admin/Owner starts Kitchen Shift → declares menu quantities
3. Cashier starts Cashier Shift → declares opening cash
4. Warehouse starts Warehouse Shift (if restocking day)
5. Service begins — orders flow
```

**Closing Sequence:**
```
1. Cashier closes Cashier Shift → inputs actual cash count
2. Kitchen closes Kitchen Shift → final stock reconciliation
3. Warehouse closes Warehouse Shift → stock movement summary
4. Employees end their own shifts
5. Finance reviews daily summary
```

### 18.2 Operational Gates

| Gate | Check | Failure Result |
|---|---|---|
| **Authentication** | Firebase JWT valid | Redirect to /login |
| **Email Verification** | `emailVerified = true` | Redirect to /verify-email |
| **Role Assignment** | `role != null` | Redirect to /starter |
| **Role Authorization** | Role in `requiredRoles` | Redirect to / |
| **Employee Shift Active** | `userStore.me.activity.is_active` | Show "belum memulai sif" warning |
| **Kitchen Shift Active** | KitchenShift.end = null | Order creation blocked (backend) |
| **Cashier Shift Active** | CashierShift.end = null | Order creation blocked (backend) |
| **Warehouse Shift Active** | WarehouseShift.end = null | Stock requests/movements blocked (backend) |
| **Stock Available** | KitchenShiftDetail.end_stock ≥ order qty | Order creation blocked (backend) |
| **Table Available** | No active order at same table in same KitchenShift | Order creation blocked (backend, dine-in only) |

### 18.3 Observability

| Aspect | Current State |
|---|---|
| **Monitoring** | No dedicated monitoring (Railway provides basic uptime) |
| **Logging** | `console.log` statements in production code (debug output) |
| **Structured Logging** | Not implemented |
| **Request Tracing** | Not implemented |
| **Health Check** | `GET /health-check` endpoint available |

### 18.4 Reliability Considerations

| Aspect | Current State | Risk |
|---|---|---|
| **Single process** | No clustering | Cannot handle high load; no redundancy |
| **No caching layer** | All reads hit MySQL directly | Performance degrades with data volume |
| **No message queue** | All operations synchronous | Long operations block requests |
| **Transaction usage** | Correctly used for all multi-step writes | Data integrity protected |
| **DB retry logic** | 3-5 retries on connection | Handles transient DB failures |
| **No automated failover** | Single DB instance | DB outage = complete failure |

### 18.5 Scalability Considerations

| Bottleneck | Current State | Impact at Scale |
|---|---|---|
| **Finance summary** | 4-8 DB queries per call, no caching | Degrades linearly with order volume |
| **Employee listing** | N+1 query pattern (shift per employee) | Degrades linearly with employee count |
| **List endpoints** | No pagination — returns all records | Slow responses as data grows |
| **Single DB** | No read replicas | Read and write contention |
| **Single process** | No horizontal scaling | CPU/memory bottleneck |

### 18.6 Business Continuity

| Scenario | Current Mitigation |
|---|---|
| Firebase outage | None — complete lockout |
| MySQL outage | None — complete failure |
| Railway outage | None — system offline |
| Midtrans outage | Cash payment fallback |
| Token expiry mid-session | Immediate logout (401 hard logout) |

---

## 19. Architectural Decisions

### 19.1 Frontend Architectural Decisions

| ID | Decision | Rationale | Tradeoff |
|---|---|---|---|
| AD-01 | **Composition API Exclusively** | Vue 3 recommended; better TypeScript integration | Steeper learning curve for developers used to Options API |
| AD-02 | **Pinia with Minimal Global State** | Only auth, profile, alerts, UI in Pinia. Feature data in composable-local refs | Prevents cross-page state pollution; no global cache |
| AD-03 | **Firebase as Auth Provider** | OAuth, email verification, token refresh out of the box | Firebase outage = auth failure; vendor lock-in |
| AD-04 | **Vuetify 3 as UI Framework** | Material Design completeness accelerates development | Less flexible than Tailwind; thesis timeline demanded speed |
| AD-05 | **Imperative Overlay Pattern** | `useOverlayManager` singleton for nested modals | More complex than `v-dialog` v-model but enables nesting + confirm-before-close |
| AD-06 | **Manual Refresh over Polling** | Simplicity for thesis project; reduces backend load | No real-time collaboration; kitchen must refresh manually |
| AD-07 | **`show-only` Query Param** | Single route per role, `?show-only=` for mobile widget isolation | Avoids creating 10+ granular routes |
| AD-08 | **Dual Firebase Environment** | Separate dev/prod Firebase projects | Prevents dev data pollution; clean prod environment |

### 19.2 Backend Architectural Decisions

| ID | Decision | Rationale | Tradeoff |
|---|---|---|---|
| ADR-01 | **Single File Model Definition** (`model.js`, 1,463 lines) | Simplicity; avoids circular dependency issues | File is unwieldy if entities grow |
| ADR-02 | **Lazy Singleton DB Connection** | Allows models to be imported without immediately connecting | First request bears connection latency |
| ADR-03 | **UUID for Order Primary Keys** | Prevents enumeration attacks on revenue-sensitive entity | Slightly larger index size |
| ADR-04 | **Shift-Anchored Data Model** | Per-session financial reconciliation, daily reporting, auditability | All operations require active shifts |
| ADR-05 | **Stock at Kitchen Shift Level** (`KitchenShiftDetail.end_stock`) | Prevents overselling within a session | Stock levels reset each shift |
| ADR-06 | **Find-or-Create Customer Pattern** | Customers don't pre-register | Conflict handling via try-catch on unique constraint |
| ADR-07 | **Firebase for Authentication** | Reduces auth complexity | Firebase outage = complete auth failure |
| ADR-08 | **Polymorphic created_by/updated_by** | Both employees and customers create orders | Requires joining through User to resolve actor name |

### 19.3 System-Level Architectural Decisions

| ID | Decision | Rationale | Tradeoff |
|---|---|---|---|
| SYS-01 | **Role-Isolated Workspaces** | Each role has exactly one route/page reflecting operational reality | No unified dashboard; owner must navigate between views |
| SYS-02 | **Single Backend Monolith** | Thesis scope; small team; avoids distributed complexity | Cannot scale components independently |
| SYS-03 | **Financial Summary Computed, Not Stored** | Real-time accuracy; no stale data | Performance degrades with data volume |
| SYS-04 | **Stock Requests ≠ Auto Inventory Deduction** | Manual tracking provides explicit audit trail | Requires separate StockMovement for actual quantity changes |
| SYS-05 | **Bahasa Indonesia throughout** | Staff are Indonesian speakers | No i18n infrastructure for future localization |

---

## 20. Technical Constraints

### 20.1 Frontend Technical Constraints

1. **Vue 3 Composition API only** — No Options API; all components use `<script setup>`
2. **Vuetify 3 only** — No other CSS framework; styling via Vuetify classes + scoped `<style>` blocks
3. **Bahasa Indonesia UI only** — No i18n library; all labels, messages, alerts in Indonesian
4. **Firebase JWT for all API calls** — Backend expects `Authorization: Bearer <firebase_id_token>`
5. **Single-page design per role** — Each role has exactly one route/workspace
6. **Shift gate on operational pages** — Must check `is_active` before rendering operational UI
7. **Role-locked routes** — New routes must include `meta.requiredRoles`
8. **Branch selector pattern** — Every multi-branch page must implement `selectedBranch` + `watch` + re-fetch

### 20.2 Backend Technical Constraints

1. **Node.js ≥ 18** — ES Modules (`"type": "module"`)
2. **Express 5.x** — Specific version requirement
3. **Sequelize 6.x** — ORM locked to this major version
4. **MySQL 8.0** — Database engine requirement
5. **No schema auto-migration** — `sequelize.sync({ alter: false })`; manual DDL required
6. **Currency in IDR integers** — All monetary values are `BIGINT` or `INT`; no floating-point
7. **Timezone hardcoded to Asia/Jakarta** — Single-timezone operation
8. **CORS whitelist** — New frontend deployments require adding origin to `rest.js`
9. **List data window** — Stock requests, movements, fund requests only return records from the **last 1 month**
10. **Warehouse shift is global** — Only ONE active `WarehouseShift` across the entire system (not per-branch)
11. **UUID for Orders only** — All other entities use auto-increment integers
12. **No ENUM status values** — All statuses are VARCHAR strings

### 20.3 Cross-Cutting Technical Constraints

1. **Active shift requirement** — ALL operational actions require active shifts
2. **Menu per-branch** — Menus are branch-specific; items from Branch A cannot be ordered at Branch B
3. **Only one active KitchenShift per branch** — Enforced at backend
4. **Only one active CashierShift per branch** — Enforced at backend
5. **Only one active WarehouseShift globally** — Enforced at backend
6. **Dual Firebase environment** — Dev and prod Firebase projects are separate

---

## 21. Business Constraints

### 21.1 Organizational Constraints

1. **Indonesian restaurant context** — All business terminology, status values, and UI labels in Bahasa Indonesia
2. **Multi-branch operation** — System must support multiple physical restaurant locations
3. **Shift-based work culture** — Staff work in shifts; all activity tied to shift sessions
4. **Role separation** — Kitchen, cashier, and warehouse are distinct operational departments
5. **Owner approval required** — New employees must be confirmed by owner before gaining access

### 21.2 Regulatory Constraints

1. **Financial record keeping** — All transactions must be auditable with `created_by`/`updated_by`
2. **Payment reconciliation** — Cashier shifts must reconcile actual cash vs. expected cash
3. **Stock audit trail** — All inventory changes must be recorded via StockMovement

### 21.3 Market Constraints

1. **Indonesian payment methods** — Must support cash and local digital payment (Midtrans)
2. **IDR currency** — All prices in Indonesian Rupiah with no decimal places
3. **WIB timezone** — All timestamps in Asia/Jakarta (UTC+7)

### 21.4 Operational Constraints

1. **Real-time kitchen coordination** — Kitchen must see orders quickly (currently requires manual refresh)
2. **Peak hour performance** — Order creation and payment must be fast during lunch/dinner rushes
3. **Offline resilience** — No offline capability; internet required for all operations
4. **Device flexibility** — Must work on desktop (cashier) and tablet (kitchen/warehouse)


---

## 22. Critical Dependencies

### 22.1 Critical Dependency Chain

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

### 22.2 External Dependency Map

| Dependency | Used By | Failure Mode | Fallback |
|---|---|---|---|
| **Firebase Auth** | All auth, JWT for every API call | Complete system lock-out | None — no fallback |
| **MySQL Database** | Backend — every operation | Complete system failure | None — single DB |
| **Midtrans Snap API** | Payment.vue, POST /order/process-direct-payment | Digital payment broken | Cash payment still works |
| **snap.js CDN** | Payment.vue (loaded via `<script>` tag) | Midtrans UI broken | Cash payment still works |
| **Railway** | Both frontend and backend hosting | System offline | None |
| **ApexCharts** | Finance Dashboard charts | Charts blank | Data API still works; no visual |

### 22.3 Frontend Internal Dependencies

| Depends On | Required By | If Missing |
|---|---|---|
| `authStore` (Pinia) | Router guards, `authUser`, all API calls | System cannot authenticate |
| `authUser.me.role` | Route guards, `beforeEnter`, page rendering | Roles not enforced (security gap) |
| `useOverlayManager` singleton | All sub-modal components | Modals cannot open |
| `api.ts` (Axios + JWT) | All service files | API calls fail auth injection |
| `useAlertStore` | All mutation composables | No user feedback on errors |
| Firebase `onIdTokenChanged` | `authStore.initialize()` | Boot sequence hangs |

### 22.4 Backend Internal Dependencies

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

## 23. Engineering Assessment

### 23.1 Architectural Strengths

| # | Strength | Impact |
|---|---|---|
| 1 | **Clear layered architecture** (handler → service → model) | Easy to navigate, test, and modify |
| 2 | **Consistent transaction usage** | All multi-step writes are atomic — data integrity protected |
| 3 | **Centralized error handling** | Typed exceptions map cleanly to HTTP codes |
| 4 | **Descriptive API design** | Resources grouped by business domain — intuitive |
| 5 | **Dual-consumer design** | Employee and customer paths cleanly separated |
| 6 | **Status-priority ordering** | Lists always show actionable items first (Pending before completed) |
| 7 | **Type-safe frontend** | Full TypeScript coverage with domain-complete types |
| 8 | **Composable-driven data management** | Keeps pages clean, logic testable, state isolated |
| 9 | **useOverlayManager singleton** | Production-quality solution to complex nested modal UX |
| 10 | **Firebase dual-environment setup** | Clean separation of dev and production auth data |
| 11 | **Auth boot sequence** | Prevents race conditions between auth resolution and routing |
| 12 | **Role guard architecture** | Multi-step router guard with proper loading wait |
| 13 | **Production-proven** | Actively used in live restaurant operations |

### 23.2 Architectural Weaknesses

| # | Weakness | Severity | Impact |
|---|---|---|---|
| 1 | **No backend RBAC** | **High** | Any authenticated employee can call any endpoint |
| 2 | **No input validation layer** | **High** | No Zod/Joi middleware; malformed requests may cause 500s |
| 3 | **No real-time updates** | **High** | Kitchen may miss new orders without manual refresh |
| 4 | **No automated tests** | **High** | Zero test coverage; refactoring risks regressions |
| 5 | **Financial summary compute cost** | Medium | 4-8 queries per request with no caching |
| 6 | **N+1 query in employee listing** | Medium | Performance degrades linearly with employee count |
| 7 | **No pagination on list endpoints** | Medium | Large datasets cause slow responses |
| 8 | **Firebase single point of failure** | Medium | Auth completely unavailable if Firebase is down |
| 9 | **401 hard logout** | Medium | Token expiry mid-session logs user out abruptly |
| 10 | **Large single components** | Medium | `ShiftList.vue` (66KB), `UpdateOrder.vue` (24KB) |
| 11 | **Silent service errors** | Medium | Several services catch and swallow errors |
| 12 | **Debug console.logs in production** | Low | Debug statements in service files |
| 13 | **Deprecated crypto package** | Low | `crypto@1.0.1` deprecated |
| 14 | **Commented-out auto-retry** | Low | 401 auto-refresh is built but disabled |
| 15 | **No API versioning** | Low | Breaking changes require coordinated deployment |

### 23.3 Technical Debt Register

| Area | Debt Item | Remediation Effort |
|---|---|---|
| **Security** | Add RBAC middleware | Medium (add role checks to routes) |
| **Validation** | Add Zod schemas at handler layer | Medium |
| **Real-time** | Add SSE for kitchen order board | Medium |
| **Testing** | Add Vitest unit tests + Playwright E2E | Large |
| **Performance** | Add Redis caching for finance summary | Medium |
| **Performance** | Add pagination to list endpoints | Small |
| **Reliability** | Activate 401 auto-retry in api.ts | Small |
| **Maintainability** | Split large components (ShiftList.vue) | Small |
| **Cleanup** | Remove debug console.log statements | Small |
| **Security** | Replace deprecated crypto package | Small |

### 23.4 Maintainability Assessment

**What's Easy to Change:**
- Adding new widgets to existing dashboards (follows established composable → service → component pattern)
- Adding new menu fields (Menu CRUD is well-structured)
- Modifying finance summary formulas (computed in one backend service)
- Adding new roles (route + view + sidebar entry pattern is clear)

**What's Hard to Change:**
- Order status values (referenced across frontend UI, backend state machine, and business rules)
- Shift data model (core dependency of nearly all operational features)
- Authentication flow (touches Firebase, backend middleware, frontend boot sequence, route guards)
- Payment flow (touches frontend Payment.vue, backend orderService, Midtrans webhook, finance summary)

---

## 24. Known Risks

### 24.1 Risk Matrix

| Risk ID | Risk | Severity | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| RISK-01 | No automated tests | High | Certain | High regression risk on any change | Prioritize test suite addition |
| RISK-02 | No backend RBAC | High | Medium | Unauthorized endpoint access | Add role middleware per route |
| RISK-03 | No real-time updates | High | Certain | Kitchen-cashier desynchronization | Add SSE or polling |
| RISK-04 | Firebase outage | Medium | Low | Complete auth lockout | Document manual override procedure |
| RISK-05 | Financial summary performance | Medium | High | Slow dashboard with scale | Add caching layer |
| RISK-06 | N+1 query performance | Medium | High | Slow employee listing with scale | Eager load shift data |
| RISK-07 | Manual inventory from stock requests | Medium | Certain | Inventory drift if StockMovement missed | Consider auto-deduction |
| RISK-08 | 401 hard logout | Medium | High | Abrupt session termination | Enable auto-retry |
| RISK-09 | No input validation | Medium | Medium | 500 errors from malformed data | Add Zod middleware |
| RISK-10 | Large components | Medium | Certain | Maintenance difficulty | Component splitting |
| RISK-11 | Zero test coverage | High | Certain | No safety net for changes | Testing initiative |
| RISK-12 | No monitoring/alerting | Medium | Certain | Issues discovered by users | Add health checks + alerts |

### 24.2 Risk Interconnections

```
RISK-02 (No RBAC)
  └── Amplifies impact of: RISK-04 (Firebase compromise)

RISK-03 (No real-time)
  └── Affects: Kitchen efficiency during peak hours
  └── Workaround: Manual refresh (operational friction)

RISK-05 (Finance performance)
  └── Blocked by: RISK-01 (No tests) — caching changes risky without tests

RISK-07 (Manual inventory)
  └── Affects: C5 (Inventory Management) accuracy
  └── Affects: C6 (Financial Reporting) accuracy
```

---

## 25. Future Evolution Opportunities

### 25.1 Immediate Opportunities (Low Effort, High Value)

| # | Opportunity | Effort | Value |
|---|---|---|---|
| 1 | **Activate 401 auto-retry** — Uncomment `getIdTokenHardOnce` in api.ts | Small | Better session resilience |
| 2 | **Add polling for kitchen** — Auto-refresh CurrentOrderQue every 30-60s | Small | Kitchen sees orders faster |
| 3 | **Add form validation** — Use installed `vee-validate` + `yup` | Small-Medium | Consistent error handling |
| 4 | **Component splitting** — Break up `ShiftList.vue` (66KB) | Small | Better maintainability |
| 5 | **Add RBAC middleware** — Role guard arrays per route | Medium | Security hardening |
| 6 | **Add input validation** — Zod schemas at handler layer | Medium | Data integrity |

### 25.2 Short-Term Opportunities (Medium Effort, High Value)

| # | Opportunity | Effort | Value |
|---|---|---|---|
| 7 | **Real-time order updates** — SSE or WebSocket for kitchen order board | Medium | Kitchen sees orders instantly |
| 8 | **Redis caching** — Cache menu lists, branch data, finance summary | Medium | Performance at scale |
| 9 | **Pagination** — Add `limit`/`offset` to list endpoints | Medium | Handle large datasets |
| 10 | **Test suite** — Vitest unit tests for composables and services | Medium-Large | Regression safety net |
| 11 | **PWA support** — Service worker + manifest for installable mobile | Medium | Better kitchen/warehouse UX |
| 12 | **Print optimization** — Build proper receipt/report print templates | Medium | Operational utility |

### 25.3 Medium-Term Opportunities (Higher Effort, Strategic Value)

| # | Opportunity | Effort | Value |
|---|---|---|---|
| 13 | **Auto-inventory deduction** — Automate `InventoryItem.quantity` update when StockRequest completes | Medium | Reduce manual work |
| 14 | **Multi-warehouse support** — Branch-level warehouse shifts | Medium-Large | Scale to more branches |
| 15 | **Push notifications** — Firebase Cloud Messaging for order status | Medium | Better customer experience |
| 16 | **DB migrations** — Sequelize CLI or Umzug for schema management | Medium | Safer schema evolution |
| 17 | **API versioning** — Add `/v1/` prefix | Small-Medium | Backward compatibility |
| 18 | **Structured logging** — Winston/Pino with request IDs | Medium | Better observability |

### 25.4 Long-Term Opportunities (Strategic)

| # | Opportunity | Effort | Value |
|---|---|---|---|
| 19 | **Mobile native app** — React Native or Flutter for kitchen/warehouse tablets | Large | Better device integration |
| 20 | **AI-powered forecasting** — Predict demand, optimize stock levels | Large | Reduce waste, prevent stockouts |
| 21 | **Customer loyalty program** — Points, rewards, history | Large | Customer retention |
| 22 | **Multi-currency support** — Beyond IDR | Medium | Future international expansion |

---

## 26. Change Management Framework

### 26.1 How Changes Should Be Evaluated

**The Impact Analysis Framework:**

For any proposed change, evaluate using this seven-step process:

**Step 1: Identify the entity being changed**
→ See entity list in Data Model (Section 14)

**Step 2: Find all API endpoints that read/write that entity**
→ See API Relationship Model (Section 12.4)

**Step 3: Find all frontend composables that call those APIs**
→ See Composable → Service mapping (Section 12.3)

**Step 4: Find all frontend features that use those composables**
→ See Page-to-API mapping (Section 12.1)

**Step 5: Identify business rules that apply**
→ See Business Rules (Section 8 of this document)

**Step 6: Identify all shift dependencies**
→ Any operational feature requires the shift gate

**Step 7: Check cross-domain impact**
→ See Domain Relationship Model (Section 13)

### 26.2 Change Impact Matrix

| Change Type | Entities Affected | Frontend Impact | Backend Impact | Business Impact |
|---|---|---|---|---|
| Modify Order status values | Order, OrderItem | CurrentOrderQue, DetailOrder UI | orderService status machine | Revenue flow integrity |
| Add new Menu field | Menu | UpdateOrder display, DetailMenu modal | menuService CRUD, KitchenShiftDetail init | Order accuracy |
| Change Shift start payload | CashierShift/KitchenShift | StartShift overlay form | *ShiftService | Operational opening |
| Modify KitchenShiftDetail | KitchenShiftDetail | MenuQuantityManagement | orderService stock check | Order creation reliability |
| Add new role | Employee | MainRoutes.ts, sidebar, guard | Role check in service layer | Access control |
| Change finance-summary formula | OrderPayment, CashOut, FundRequestItem | FinanceDashboard charts | financeService queries | Financial accuracy |
| Add branch | Branch | Branch selector (all pages) | All FK-branch endpoints | Data isolation |
| Change payment flow | OrderPayment | Payment.vue, Midtrans | orderService, webhook | Revenue collection |
| Modify stock request workflow | StockRequest, StockRequestItem | CurrentStockRequestList (both) | inventoryService | Kitchen-warehouse coordination |

### 26.3 How New Features Should Be Introduced

**Pattern A: New widget on an existing page**
```
1. Backend: Add service logic + handler + register route
2. Backend: Add model if new entity needed (+ manual DDL)
3. Frontend: Add TypeScript type in src/types/<domain>.ts
4. Frontend: Add service function in src/services/<domain>/
5. Frontend: Add composable in src/composables/use<Feature>.ts
6. Frontend: Create Vue component in src/views/pages/<role>/components/
7. Frontend: Wire into page: call composable in onMounted + watch(selectedBranch)
8. Frontend: Add ?show-only key if widget should be embeddable
9. Update: This document with new capability/API/entity
```

**Pattern B: New inter-department workflow**
```
1. Define: State machine (statuses as VARCHAR strings matching Indonesian business terms)
2. Define: Which shift types are required as preconditions
3. Define: Which role creates vs which role approves
4. Backend: Implement with multi-step PUT endpoint (type discriminator pattern)
5. Frontend: Implement status-priority ordering in list display
6. Frontend: Implement per-item approval sub-modal using useOverlayManager
7. Update: Add to User Journey Model in this document
```

**Pattern C: New role**
```
1. Add role string to UserRole type in src/types/employee.ts
2. Add new route in src/router/MainRoutes.ts with meta.requiredRoles
3. Create new view page in src/views/pages/<newrole>/
4. Add role redirect in LandingPage.beforeEnter guard
5. Add sidebar entry in src/layouts/full/vertical-sidebar/
6. Create composables and services as needed
7. Update: This document with new persona and journeys
```

### 26.4 How Existing Features Should Be Modified

**Frontend Changes:**
- Verify role requirements (`meta.requiredRoles`)
- Verify shift gate checks for operational features
- Use composable → service → api.ts pattern (never direct axios)
- Pass `refresh()` callback for mutations; call `useAlertStore().showAlert()`
- Use `useOverlayManager().openOverlay()` for modals
- Add `selectedBranch` ref + watch for multi-branch features
- Ensure all UI text is in Bahasa Indonesia
- Verify `show-only` query param if widget isolation needed

**Backend Changes:**
- Verify new entity → add to model.js + associations + manual DDL
- Verify multi-step writes → wrap in Sequelize transaction
- Verify operational data → add active shift check
- Verify order stock changes → use atomic SQL literal for end_stock
- Verify new route → place before authMiddleware if public, after if protected
- Verify financial data → recompute from source; never store aggregates
- Verify inventory quantity → create StockMovement record
- Verify fund request changes → preserve partial approval logic
- Verify reservation changes → preserve customer/employee creation logic
- Use typed exceptions (NotFound/Conflict/BadRequest/Unauthorized)

### 26.5 How Frontend and Backend Must Remain Aligned

| Concern | Frontend Must | Backend Must |
|---|---|---|
| API endpoint paths | Match service file URL strings exactly | Not change paths without frontend update |
| Response envelope | Parse `data` field from `{status, message, data}` | Always return this envelope structure |
| Status strings | Display using Indonesian strings | Never change status string values without coordination |
| Role names | Use exact role strings | Never rename roles without frontend type update |
| Branch ID filter | Send `branch_id` query param | Respect and filter by `branch_id` |
| Prefixed IDs | Send prefixed IDs as received | Decode with `decodePrefixedId()` before DB lookup |
| Firebase JWT | Inject `Authorization: Bearer <token>` | Verify via Firebase Admin SDK |
| Currency | Format IDR integers for display | Store as BIGINT/INT; never float |
| Timezone | Display times in WIB (UTC+7) | All computations in Asia/Jakarta timezone |

### 26.6 Business Rules That Must Be Preserved

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
| **R17** | Midtrans snap token expires in 15 minutes | Backend orderService |
| **R18** | Lunas/Refund payments cannot be updated | Backend orderService.updatePayment() |
| **R19** | Refunding an item creates RefundItem and sets item status=Refund | Backend orderService.refund() |
| **R20** | If ALL items refunded, Order.status = Refund | Backend orderService.refund() |
| **R22** | Employee with role=null throws UnauthorizedException | Backend auth.js middleware |

---

## 27. AI Agent Implementation Guide

### 27.1 How to Understand This System

**The Three Core Principles:**

1. **The shift is the operational unit** — Never design a feature that bypasses shift requirements for cashier, kitchen, or warehouse operations.

2. **The backend owns all business rules** — Frontend validation is UX-only. Critical rules (stock limits, shift requirements, payment state machine) must remain in backend service layer.

3. **The finance summary is always computed, never stored** — Do not add a `finance_summaries` table. The summary must reflect real-time state.

**The Three Files That Touch Everything:**
- Backend: `app/model/model.js` — all entities and relationships
- Backend: `app/service/orderService.js` — the central coordinator of revenue flow
- Frontend: `src/router/index.ts` — the gatekeeper of all role-based access

### 27.2 How Features Should Be Implemented

**When adding a frontend widget:**
```
1. Create feature component in src/views/<page>/components/
2. Create composable in src/composables/use<Feature>.ts (ref + load function pattern)
3. Create service function in src/services/<domain>/<feature>Service.ts
4. Add TypeScript type in src/types/<domain>.ts
5. Wire into page: composable in onMounted + watch(selectedBranch)
6. Use useOverlayManager().openOverlay() for any modals
7. Call useAlertStore().showAlert() for user feedback
8. Ensure all UI text is in Bahasa Indonesia
```

**When adding a backend feature:**
```
1. Add Sequelize model in model.js (if new entity) + associations + manual DDL
2. Create service file in app/service/<feature>.service.js
3. Create handler file in app/handler/<feature>.handler.js
4. Register routes in infrastructure/rest/rest.js (before authMiddleware if public, after if protected)
5. Wrap multi-step writes in Sequelize transactions
6. Use typed exceptions (NotFound/Conflict/BadRequest/Unauthorized)
7. Add status-priority ordering for list endpoints
8. Use prefixId() for display IDs, decodePrefixedId() for input
```

### 27.3 How Architecture Should Be Preserved

| Pattern | Description | Where |
|---|---|---|
| **Branch selector** | Every page with multi-branch data has `selectedBranch` ref + watch + v-select | All pages |
| **Shift gate** | Check `is_active` before rendering operational UI | Cashier, Kitchen, Inventory |
| **Refresh callback** | Pass `refresh` prop down to sub-components | All feature components |
| **show-only query param** | Use `route.query['show-only']` for widget isolation | All dashboards |
| **Alert via store** | Always use `useAlertStore().showAlert()` | All mutations |
| **Loading states** | Always expose and use `loading` ref in composables | All composables |
| **Indonesian language** | All UI text in Bahasa Indonesia | All templates |
| **Service layer** | All HTTP calls isolated to src/services/ | Never call axios directly in components |
| **Composable-local state** | Feature data in composable refs, not Pinia stores | All feature data |
| **Transaction wrapping** | Multi-step writes in try/catch with commit/rollback | All mutations |

### 27.4 How Business Rules Should Be Protected

**NEVER:**
- Create an Order without validating active KitchenShift AND CashierShift
- Allow end_stock to go negative
- Forget to restore end_stock on order cancellation
- Update a Lunas or Refund payment
- Skip creating a StockMovement when inventory quantity changes
- Store computed financial totals in the database
- Add a branch FK to WarehouseShift (it's intentionally global)

**ALWAYS:**
- Check active shifts before operational actions
- Use atomic SQL literals for end_stock operations
- Wrap multi-write operations in transactions
- Use `decodePrefixedId()` before database lookup of prefixed IDs
- Return `{status, message, data}` envelope from handlers
- Validate with typed exceptions

### 27.5 How Impact Analysis Should Be Performed

To answer "What happens if I change X?":

1. **Find X in the Entity list** (Section 14)
2. **Check Blast Radius** — Which entities directly and transitively affect X?
3. **Check which User Journeys** pass through X (Section 7)
4. **Check business rules** that reference X (Section 26.6)
5. **Check frontend composables** that call APIs touching X (Section 12.3)
6. **Check criticality** — Is this Mission Critical? (Section 15)
7. **Verify frontend-backend alignment** items for X (Section 26.5)
8. **Write the change** using the appropriate checklist (Section 26.4)

### 27.6 Anti-Patterns to Avoid

| Anti-Pattern | Why | Correct Approach |
|---|---|---|
| Direct `axios` import in components | Breaks auth injection | Always import `api` from `@/services/api` |
| Pinia store for feature data | Pollutes global state | Use composable-local `ref()` |
| `v-dialog` with local v-model for complex modals | Misses confirm-before-close and nesting | Use `useOverlayManager().openOverlay()` |
| Hard-coded role strings in templates | Fragile, untyped | Use `userStore.hasRole('kasir')` |
| Inline API calls in components | Bypasses service layer | Create a service function |
| Blocking mount on data fetch | Slows initial render | Use `onMounted()` + non-blocking `load()` |
| Adding imports after statements | Breaks module semantics | Always import at top of `<script setup>` |
| Calling `sequelize.sync({ alter: true })` | Will alter production schema | Use `alter: false`; manual DDL only |
| Bypassing `getSequelize()` singleton | Creates connection leaks | Always use the singleton |
| Storing computed financial totals | Data inconsistency risk | Always recompute from source records |

### 27.7 Key Files for Common Tasks

| Task | Frontend File(s) | Backend File(s) |
|---|---|---|
| Add API endpoint | `src/services/<domain>/service.ts` | `app/handler/*.js` + `app/service/*.js` + `rest.js` |
| Add TypeScript type | `src/types/<domain>.ts` | `app/model/model.js` |
| Modify auth logic | `src/stores/auth.ts` | `middleware/auth.js` |
| Modify user profile | `src/stores/authUser.ts` | `app/service/employee.service.js` |
| Add route | `src/router/MainRoutes.ts` | `infrastructure/rest/rest.js` |
| Modify color palette | `src/theme/LightTheme.ts` | N/A |
| Add global alert | Call `useAlertStore().showAlert()` | Return message in response envelope |
| Open modal overlay | Call `useOverlayManager().openOverlay()` | N/A |
| Modify Vuetify defaults | `src/plugins/vuetify.ts` | N/A |
| Add Firebase feature | `src/plugins/firebase.ts` + `src/stores/auth.ts` | N/A |
| Environment variables | `.env` (prefix: `VITE_`) | `.env` (no prefix) |

---

## 28. AI Agent Transformation Guide

### 28.1 How Transformations Should Be Executed

**Guiding Principles:**

1. **Preserve the shift-anchored data model** — Never design a feature that bypasses shift requirements.
2. **Preserve transactional integrity** — Multi-step writes must remain atomic.
3. **Keep business rules in the backend service layer** — Frontend validation is UX-only.
4. **Maintain the frontend → composable → service → api → backend chain** — Never break this abstraction.
5. **Preserve the role-isolated workspace model** — Each role has one route and one page.
6. **Keep all UI text in Bahasa Indonesia** — This is non-negotiable.

### 28.2 How Future Modernization Should Occur

**Phase 1: Security Hardening (Immediate)**
- Add RBAC middleware to backend routes
- Add input validation (Zod schemas at handler layer)
- Enable 401 auto-retry in frontend api.ts
- Remove debug console.logs from production

**Phase 2: Performance & Reliability (Short-term)**
- Add Server-Sent Events for kitchen order board
- Add Redis caching for finance summary and menu lists
- Add pagination to list endpoints
- Add health check monitoring

**Phase 3: Testing & Quality (Short-term)**
- Add Vitest unit tests for composables and services
- Add Playwright E2E tests for critical flows (order → payment → completion)
- Add backend service unit tests

**Phase 4: Feature Enhancement (Medium-term)**
- Auto-inventory deduction from completed StockRequests
- PWA support for kitchen/warehouse tablets
- Push notifications for order status updates
- Print templates for receipts and reports

**Phase 5: Scale Preparation (Long-term)**
- DB migrations with Sequelize CLI/Umzug
- API versioning with `/v1/` prefix
- Read replicas for MySQL
- Structured logging with request IDs

### 28.3 How Future Design Enhancements Should Occur

**When modifying existing UI:**
- Follow Vuetify 3 patterns and the PurpleTheme color palette
- Maintain the `Page → Widget → Sub-modal` component hierarchy
- Preserve the branch selector pattern on all multi-branch pages
- Use `useOverlayManager` for all modals (not `v-dialog` v-model)
- Ensure responsive design with `useDisplay()` breakpoints
- Maintain `show-only` query param support for widget isolation

**When adding new UI:**
- Match existing card-based layout patterns (`UiParentCard`, `UiChildCard`)
- Use `GlobalTable.vue` for data tables
- Follow the loading state pattern (`:loading` prop on `v-btn`, `v-progress-circular`)
- Use `text-h4`, `text-h5`, `text-subtitle-1` for typography
- Apply glassmorphism for mobile branch pills (`bg-white bg-opacity-75 backdrop-blur-lg`)

### 28.4 How Future Product Evolution Should Occur

**New Role Addition:**
1. Add role to `UserRole` type in `src/types/employee.ts`
2. Add route in `MainRoutes.ts` with `meta.requiredRoles`
3. Create view page in `src/views/pages/<role>/`
4. Add redirect in `LandingPage.beforeEnter`
5. Add sidebar entry
6. Add backend role check if adding RBAC

**New Inter-Department Workflow:**
1. Model the state machine (status values in Indonesian)
2. Identify required shift types as preconditions
3. Identify which role creates vs. which role approves
4. Follow the `StockRequest` or `FundRequest` pattern as template
5. Implement per-item approval if applicable

**New Business Entity:**
1. Add Sequelize model in `model.js` with `created_by`/`updated_by`
2. Add associations at end of `model.js`
3. Create service + handler following existing patterns
4. Register routes in `rest.js`
5. Add TypeScript types, service, composable, and component on frontend
6. Update this document

### 28.5 Critical Anti-Patterns for AI Agents

**NEVER DO:**

1. **Never add a `finance_summaries` table** — The finance summary must always be computed from source records.
2. **Never bypass the shift requirement** — All operational features must check for active shifts.
3. **Never put business logic in handler files** — Handlers parse HTTP, call service, return response. Business rules belong in services.
4. **Never directly update `InventoryItem.quantity` without a StockMovement record** — This is the audit trail.
5. **Never add ENUM status values** — Use VARCHAR strings like existing statuses.
6. **Never use floating-point arithmetic for currency** — IDR values must be BIGINT/INT.
7. **Never hard-code English UI text** — All user-facing text must be in Bahasa Indonesia.
8. **Never call `sequelize.sync({ alter: true })`** — Will alter production schema. Manual DDL only.
9. **Never store computed totals** — Financial data must always be recomputed from source records.
10. **Never add a branch FK to WarehouseShift** — It's intentionally global (one warehouse for all branches).

### 28.6 The Most Important Question

Before any change, ask:

> **Does this change respect the shift-anchored data model? Does it preserve transactional integrity? Does it keep business rules in the backend service layer?**

If the answer to all three is **yes**, the change is architecturally sound.

---

## 29. Executive Technical Summary

### 29.1 What This System Is

NURCHS POS is a **production-deployed, academically-originated restaurant management platform** that succeeds at its primary mission: digitizing the complete operational lifecycle of a multi-branch Indonesian restaurant. The system demonstrates architectural maturity in its core design patterns while carrying technical debt appropriate to its origin as a thesis project.

### 29.2 The Architectural Contract

The system is built on **two organizing principles**:

1. **Shift-anchored data model**: Every revenue-generating and operational record is bound to a time-bounded shift. This enables daily reconciliation, session-scoped stock management, and a clean audit trail. **The shift IS the operational session.**

2. **Role-isolated workspaces**: Each of five staff roles has exactly one route, one workspace, and one set of capabilities. The system does not present a unified dashboard — it presents **the right dashboard to the right person**.

### 29.3 System Classification

| Dimension | Classification |
|---|---|
| **System Type** | Enterprise Operational Management (Staff-facing POS) |
| **Architecture** | Three-tier: Vue 3 SPA → Express REST API → MySQL |
| **Auth Model** | Firebase JWT with backend employee profile |
| **Data Model** | Shift-anchored transactional system |
| **Integration Profile** | Firebase (auth), Midtrans (payments), Railway (hosting) |
| **Maturity** | Production-deployed, actively used, thesis-originated |

### 29.4 Strengths at a Glance

- **Correct business logic** — Order, payment, and stock workflows accurately reflect restaurant operations
- **Transactional integrity** — All multi-step writes are wrapped in Sequelize transactions
- **Type-safe frontend** — Full TypeScript coverage with domain-complete types
- **Layered architecture** — Clear separation: handler → service → model (backend); composable → service → api (frontend)
- **Production-proven** — Actively used in live restaurant operations
- **Real-time financial visibility** — Summary computed from source records, never stale

### 29.5 Key Risks at a Glance

| Risk | Severity | Mitigation Priority |
|---|---|---|
| No backend RBAC | **High** | Add role middleware per route |
| No real-time updates | **High** | Add SSE for kitchen order board |
| No automated tests | **High** | Add Vitest + Playwright test suite |
| Financial summary performance | Medium | Add Redis caching |
| Firebase single point of failure | Medium | Document manual override procedure |

### 29.6 Evolution Path

The system has a **clear path to production hardening**:

1. **Immediate** — Add backend RBAC middleware; enable 401 auto-retry; remove debug logs
2. **Short-term** — Add SSE for kitchen order board; add Redis caching; add input validation
3. **Medium-term** — Add test suite; add pagination; add PWA support
4. **Long-term** — DB migrations; API versioning; multi-warehouse support

### 29.7 For Any Engineer, Architect, or AI Agent

**To work effectively with this system:**

1. **Understand the shift** — It's not just a feature; it's the core organizing principle
2. **Follow the chain** — Frontend: composable → service → api.ts. Backend: handler → service → model
3. **Respect the boundaries** — Business rules in backend. UI state in frontend. Never confuse the two.
4. **Preserve the contracts** — Status strings in Indonesian. IDR as integers. Response envelopes consistent.
5. **Check the blast radius** — Every entity change affects multiple features across both frontend and backend

**The highest-value immediate improvements:**
1. Add RBAC middleware (security)
2. Add real-time kitchen updates (operational)
3. Add a test suite (quality)
4. Add Redis caching for finance summary (performance)

The business logic is correct, the transaction management is solid, and the domain model accurately reflects real restaurant operations. The system is production-ready for its current scale (single restaurant chain, small trusted team) and has a clear path to growth.

---

*PROJECT MASTER CONTEXT — NURCHS POS*
*Synthesized from FRONTEND_MASTER_CONTEXT.md + BACKEND_MASTER_CONTEXT.md + SYSTEM_RELATIONSHIP_SYNTHESIS.md*
*This document is the authoritative knowledge source for the NURCHS POS platform.*
*Version 1.0 | Generated: 2026-06-05*
*Last updated: 2026-06-05*
*Update this document whenever: new entities added, APIs modified, new roles added, business rules change, new integrations added*
