# PROJECT CONSTITUTION
## NURCHS POS — Nasi Uduk Remaja Cikini Haji Sawid

> **Version:** 1.0 | **Generated:** 2026-06-05 | **Status:** AUTHORITATIVE
>
> **Derived From:** PROJECT_MASTER_CONTEXT.md (Version 1.0)
>
> **Purpose:** The governing principles of the NURCHS POS platform. This document guides decisions made by engineers, architects, product managers, and AI agents. It is not a rulebook. It is a strategic compass.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Identity](#2-project-identity)
3. [Mission](#3-mission)
4. [Vision](#4-vision)
5. [Definition of Success](#5-definition-of-success)
6. [Decision Priorities](#6-decision-priorities)
7. [Engineering Principles](#7-engineering-principles)
8. [Product Principles](#8-product-principles)
9. [Architectural Principles](#9-architectural-principles)
10. [Data Principles](#10-data-principles)
11. [Security Principles](#11-security-principles)
12. [User Experience Principles](#12-user-experience-principles)
13. [Change Management Principles](#13-change-management-principles)
14. [AI Agent Governance](#14-ai-agent-governance)
15. [Future Evolution Principles](#15-future-evolution-principles)
16. [Strategic Decision Framework](#16-strategic-decision-framework)
17. [Executive Summary for Future Contributors](#17-executive-summary-for-future-contributors)

---

## 1. Executive Summary

NURCHS POS is a production-deployed restaurant management platform serving **Nasi Uduk Remaja Cikini Haji Sawid**, a multi-branch Indonesian restaurant chain. It digitizes the complete operational lifecycle of a restaurant — from shift opening to order fulfillment to financial reconciliation — across five distinct staff roles and multiple physical locations.

The platform was built as an undergraduate thesis project and is actively used in live restaurant operations. It consists of two frontend applications (an internal staff portal and a customer self-service app) sharing a single backend API.

**The single most important thing to understand about this system:**

> The shift is the operational unit. Every transaction, order, payment, stock movement, and financial record is anchored to a time-bounded shift. This is not a feature — it is the architectural identity of the platform.

This constitution defines the principles that should guide every future decision about this system, regardless of how the technology stack evolves.

---

## 2. Project Identity

| Dimension | Identity |
|---|---|
| **What it is** | A multi-branch restaurant operational management platform |
| **Who it serves** | Five internal staff roles and external customers |
| **What problem it solves** | Operational fragmentation, financial opacity, and coordination failures in a multi-branch restaurant |
| **How it creates value** | Unified workflows, real-time financial visibility, formal approval chains, and complete audit trails |
| **Where it came from** | An undergraduate thesis project (Informatics Engineering, Universitas Padjadjaran) |
| **Where it lives** | Production deployment serving real restaurant operations |
| **Cultural context** | Indonesian F&B industry — Bahasa Indonesia throughout; IDR currency; WIB timezone |

The platform is simultaneously an operational tool, an audit instrument, and a financial intelligence system. These three identities must coexist in every design decision.

---

## 3. Mission

> **To replace fragmented, paper-based restaurant operations with a unified digital platform — one that enforces business rules, maintains a complete audit trail, and delivers real-time financial intelligence — so that every staff member can perform their role with clarity and confidence, while management has complete operational visibility across all branches.**

This mission is grounded in five concrete problems the system was built to solve:

1. Orders taken on paper, prone to loss and error → **Digital order creation with atomic kitchen dispatch**
2. Financial reporting compiled manually from disconnected sources → **Finance summary derived in real time from operational records**
3. Kitchen ingredient management done by memory or estimate → **Per-shift stock tracking with automatic decrement and restoration**
4. No audit trail for who did what → **Every record carries who created it, who modified it, and which shift it belongs to**
5. Staff access uncontrolled → **Role-isolated workspaces with authenticated, role-gated access**

---

## 4. Vision

> **To become the trusted operational backbone of the NURCHS restaurant chain — a system where every order, every payment, every stock movement, and every financial record flows through a single platform that makes daily operations faster, makes audits effortless, and makes management decisions data-driven.**

The vision is realized when:
- No staff member needs paper, spreadsheets, or informal coordination to perform their core role
- Every financial number the owner sees can be traced directly to a source transaction
- Every operational action is attributable to a specific person, role, and shift
- Adding a new branch means configuring the system, not rebuilding workflows

---

## 5. Definition of Success

Success is defined across four dimensions, each with equal weight.

### 5.1 Business Success

- Every staff role performs their core function entirely within the platform, without paper-based fallbacks
- Financial reconciliation at shift close happens automatically from operational records, not manual calculation
- The owner has accurate, real-time financial visibility across all branches without requesting reports from anyone
- Every transaction is auditable: traceable to an employee, a shift, and a timestamp

### 5.2 User Success

- Cashiers can create orders and process payments without hesitation during peak service hours
- Kitchen staff can see and act on their order queue without needing to coordinate by voice or paper
- Warehouse staff know their current stock levels accurately and can request ingredients and funding through a clear workflow
- The treasurer can review financial summaries and approve fund requests without leaving the platform
- The owner can monitor operations, manage staff, and review performance from a single dashboard

### 5.3 Engineering Success

- Business rules are enforced in the backend service layer, not in frontend validation alone
- All multi-step operations are atomic — partial writes do not occur
- Financial data is always derived from its source records — no stale aggregates
- Every entity modification is traceable through audit fields
- The system can be safely modified by a developer who has only read this document and the master context

### 5.4 Operational Success

- The shift opening sequence completes reliably every service day
- Order creation and payment processing never fail silently — all errors surface clearly
- The system remains available throughout service hours
- All inventory movements are recorded — no untracked quantity changes

### 5.5 What Failure Looks Like

Failure is not just outages. Failure also includes:
- Financial data that is inaccurate, stale, or unauditable
- Business rules enforced only in the frontend, leaving the backend unprotected
- Inventory quantities modified without a movement record
- Shift requirements bypassed to "simplify" a feature
- Computed financial summaries stored as denormalized tables that can drift from source data

---

## 6. Decision Priorities

When tradeoffs must be made, the following hierarchy guides decisions. Higher priorities take precedence over lower ones.

| Priority | Principle | Why |
|---|---|---|
| **1. Data Integrity** | Transactional consistency and audit completeness above all | Financial and operational records must be trustworthy |
| **2. Business Rule Correctness** | Shift requirements, payment state machines, and stock constraints must be enforced | These represent the real business contracts |
| **3. Operational Reliability** | The system must remain available and correct during service hours | Revenue is generated in real time |
| **4. Security** | Authentication and role-based authorization must be enforced at the API layer | The platform handles financial and operational data |
| **5. User Experience** | Operational roles (cashier, kitchen) require speed and clarity | Friction during service causes real business harm |
| **6. Financial Accuracy** | Reports must always reflect current transactional reality | The owner and treasurer make decisions from this data |
| **7. Maintainability** | Clear layered architecture; business rules isolated in services | Enables safe evolution without regressions |
| **8. Scalability** | Architecture should handle growth, but not at the cost of correctness | Scale to real need; don't over-engineer |

### 6.1 Tradeoff Guidance

| When choosing between... | Prefer... |
|---|---|
| A correct slow query vs. a fast potentially incorrect one | Correctness — optimize with evidence later |
| A simple UI shortcut that bypasses the shift requirement vs. a correct flow that enforces it | Correct flow — simplicity does not justify breaking the model |
| Storing a precomputed financial aggregate vs. computing it from source | Compute from source — caching is acceptable; denormalized storage is not |
| Adding a new feature quickly vs. following established architectural patterns | Following patterns — consistency enables future engineers and AI agents to reason about the system |
| Explicit verbose code vs. clever implicit behavior | Explicit — this is an auditable financial system; clarity is a correctness concern |

---

## 7. Engineering Principles

### P-ENG-1: Business Rules Live in the Service Layer

Handlers parse HTTP and dispatch to services. Services own business logic, state transitions, and enforcement. Frontend validation is UX-only — it protects user experience, not data integrity. When a critical rule can only be found in a frontend component, it is not protected.

### P-ENG-2: The Shift Requirement Is Non-Negotiable

All revenue-bearing and operational state-changing actions require an active shift. This is not a legacy constraint — it is what makes the system auditable. Any code that bypasses the shift check to "simplify" a workflow has fundamentally broken the data model.

### P-ENG-3: Financial Truth Is Always Derived, Never Stored

Revenue, expenses, and net income are computed from their source records at query time. A denormalized finance summary table cannot be kept in sync with the transactions it represents without constant maintenance — and when it drifts, financial reports become untrustworthy. Caching query results is acceptable; storing derived aggregates as canonical data is not.

### P-ENG-4: Every Inventory Change Leaves a Trail

Inventory quantities are changed by creating stock movement records. The movement record is the action; the quantity is the consequence. Never modify a quantity field without creating the movement record that explains why.

### P-ENG-5: Multi-Step Writes Must Be Atomic

Any operation that creates or modifies more than one record must be wrapped in a database transaction. This includes order creation (Order + OrderItems + OrderPayment + KitchenShiftDetail.end_stock), cancellation (status update + stock restoration), and any future workflow that crosses entity boundaries.

### P-ENG-6: Money Is an Integer

Indonesian Rupiah has no decimal places. All monetary values are stored, computed, and transmitted as integers. Floating-point arithmetic on currency values introduces silent rounding errors. This applies everywhere the currency is handled — storage, computation, and API boundaries.

### P-ENG-7: Status Strings Are Behavioral Contracts

Order status values, payment status values, stock request statuses, and similar strings are not labels — they are behavioral contracts that drive business logic, state machine transitions, UI rendering, and financial computations. They exist in both frontend and backend, and changing them requires coordinating both systems simultaneously.

### P-ENG-8: Explicit Behavior Over Implicit Convenience

Schema changes are manual DDL. Status values are strings, not enums. Inventory changes require explicit movement records. Approval workflows follow explicit state machines. This explicitness is not bureaucracy — it is what makes an operational and financial system auditable and trustworthy.

### P-ENG-9: Audit Fields Are Mandatory

Every entity that participates in operational or financial workflows must carry `created_by` and `updated_by`. The ability to answer "who did this, in which shift?" is a core product requirement, not a logging concern.

### P-ENG-10: Prefer Correctness; Optimize When There Is Evidence

At the current scale of a restaurant chain, a correct slow query is always better than a fast incorrect one. Apply optimization when performance degradation is observed and measured — not speculatively.

---

## 8. Product Principles

### P-PROD-1: Each Role Gets Exactly the Workspace They Need

Role isolation is not a limitation — it is the product's core design philosophy. Kitchen staff need their order queue. Cashiers need order creation and payment. Warehouse staff need inventory and requests. Presenting each role with only their relevant context is what makes the platform fast and safe to use under operational pressure.

### P-PROD-2: The Shift Lifecycle Is the Product's Heartbeat

Restaurant operations have a rhythm: open, serve, close. Every product feature should reinforce this rhythm. Features that cannot be cleanly anchored to a shift context are likely misaligned with the operational model.

### P-PROD-3: Formal Workflows Over Ad-Hoc Coordination

Ingredient requests, fund approvals, and payment processing follow defined state machines with clear role ownership. This formalism is intentional — it creates accountability, audit trails, and clear handoffs between departments. When the temptation arises to skip a step "for speed," consider what auditability and accountability are sacrificed.

### P-PROD-4: Financial Reporting Must Reflect Operational Reality in Real Time

The financial dashboard is not a separate system — it is a live window into operational data. Income, expenses, and reconciliation are meaningful only if they reflect current transactional state. Any architectural change that introduces staleness into financial reporting is a product regression.

### P-PROD-5: Solve Real Friction for Real People

Feature decisions should trace to a named staff role and a concrete operational friction point. If a proposed feature cannot be connected to "this makes the cashier's peak-hour workflow faster" or "this gives the warehouse manager accurate stock visibility," its value should be questioned.

### P-PROD-6: The Owner's View Is Aggregated, Not Duplicated

Owner visibility is achieved through summaries, cross-branch aggregation, and consolidated reporting — not by giving the owner raw access to every operational screen. The owner dashboard is a governance and monitoring tool, not a replication of all five other workspaces.

### P-PROD-7: Language Is Part of the Product Identity

All user-facing content is in Bahasa Indonesia. This is not an internationalization setting that can be toggled — it is the product's identity and the language of the operational environment it serves.

---

## 9. Architectural Principles

### P-ARCH-1: Three-Tier Separation Must Be Preserved

Presentation, application, and data concerns must remain separated. The frontend renders and interacts. The backend enforces and processes. The database persists and queries. Any feature that blurs these boundaries — by placing business rules in the frontend or query logic in handlers — weakens the architecture's integrity.

### P-ARCH-2: The Backend Owns the Source of Truth

The database is the authoritative record. The backend enforces all behavioral contracts. The frontend is a client that renders and interacts with data — it is never the authoritative enforcement point for data integrity, business rules, or security.

### P-ARCH-3: Role Isolation Is Structural, Not Just Visual

The separation between workspaces exists in routing, component organization, API design, and backend validation. It is not sufficient to hide UI elements from a role — the backend must also refuse to serve or accept data outside a role's authorized scope.

### P-ARCH-4: Evaluate New Capabilities by Their Dependency Graph

Before adding a feature, trace its dependencies: which entities does it touch? Which shift types does it require? Which financial computations are downstream? Which roles are affected? Understanding the dependency graph before building prevents unintended side effects.

### P-ARCH-5: Avoid Premature Decomposition

A monolithic backend has served this platform well. Service decomposition introduces distributed systems complexity — eventual consistency, network failures, and coordination overhead. Decomposition should be motivated by a real, measured operational need, not architectural fashion.

### P-ARCH-6: Insulate Core Logic from External Dependencies

Authentication providers, payment gateways, and hosting platforms can change. The platform's business logic — shift management, order processing, financial computation — should be insulated from these external dependencies through clear interface boundaries. If Firebase were replaced tomorrow, the shift model should not need to change.

### P-ARCH-7: The Layered Pattern Is the Maintainability Strategy

Backend: `handler → service → model`. Frontend: `composable → service → api`. These are not stylistic preferences — they are what allows any engineer or AI agent to navigate the codebase predictably. New capabilities should reinforce these patterns, not create diverging structures.

---

## 10. Data Principles

### P-DATA-1: The Shift Is the Primary Data Partition

All operational data is time-bounded within a shift. Financial reports, stock levels, order queues, and audit trails are interpreted within shift context. Queries that span shifts are aggregation queries — they are always computed from shift-bounded records.

### P-DATA-2: Source Records Are the Canonical Truth

Financial summaries, stock totals, and activity aggregations are computed at query time from their source records. They are never the canonical truth — their sources are. The source records are the system of record; everything else is a view.

### P-DATA-3: The Audit Trail Is a Product Requirement

Every entity that participates in operational or financial workflows carries `created_by` and `updated_by` fields. These are not optional instrumentation — they are what makes the platform trustworthy as a financial and operational system.

### P-DATA-4: Inventory Quantity Is the Consequence of Movements

Stock quantity changes are caused by stock movement records, not the other way around. Every inventory adjustment has a movement record that explains the reason. Without the movement record, the audit trail is broken.

### P-DATA-5: Data Ownership Is Explicitly Assigned

| Data Domain | Owner |
|---|---|
| Identity (who a user is) | Firebase Authentication |
| Role and branch assignment (what they can do) | Backend database |
| Operational records (orders, shifts, stock movements) | Backend database, created by the role that initiated them |
| Financial summaries | No storage — derived from source records at query time |

When a change touches data ownership boundaries, all systems that depend on that ownership must be evaluated.

### P-DATA-6: Currency Precision Is a Data Constraint

IDR values are integers at every layer — storage, computation, API transmission, and display formatting. This is a data model constraint, not a display preference. Floating-point operations on monetary values are incorrect.

### P-DATA-7: Transactional Boundaries Reflect Business Boundaries

Multi-step operations that represent a single business action (creating an order, cancelling an order, approving a fund request item) must succeed or fail as a unit. Partial state is an error state.

---

## 11. Security Principles

### P-SEC-1: Authentication Is a Prerequisite for All Business Operations

Every operation that reads or modifies business data must be performed by a verified, authenticated employee. The identity verification (Firebase JWT) and the role verification (backend employee profile) are both required — neither is sufficient alone.

### P-SEC-2: Authorization Must Be Enforced at the API Layer

Frontend route guards protect the user interface. They do not protect the data. Backend role enforcement is the only meaningful security boundary. UI-level access control is a usability feature; backend access control is the security model.

### P-SEC-3: Own Role Assignment; Delegate Identity

Firebase handles who a user is (authentication, email verification, token issuance). The backend owns what a user is authorized to do (role assignment, branch access, operational scope). These two concerns must remain separated — the backend is the authority on authorization.

### P-SEC-4: Principle of Least Privilege by Operational Role

Each staff role should be able to perform their defined operational scope and no more. Warehouse staff should not approve their own fund requests. Kitchen staff should not modify inventory levels directly. A cashier should not access financial reporting. The role model reflects real operational accountability — the security model should enforce it.

### P-SEC-5: The Shift Requirement Is Also a Security Boundary

The requirement for an active shift is both a business rule and an implicit security gate. It ensures that operational actions are only performed within a valid, time-bounded operational session. Bypassing this requirement removes a layer of accountability.

### P-SEC-6: Financial Data Requires Heightened Scrutiny

Changes to payment status, refund processing, and financial record modification touch the most sensitive data in the system. Operations that affect these records should have role authorization enforced explicitly, not implicitly through business logic.

### P-SEC-7: External Webhooks Are Untrusted by Default

Inbound requests from external systems (payment gateways, future integrations) arrive without user context. They must be verified through the mechanism appropriate to that integration before any business action is taken. Signature verification is not optional.

### P-SEC-8: The Current RBAC Gap Is a Known Risk, Not a Design Intent

The absence of backend role enforcement is a documented security weakness, not an architectural decision. Every new endpoint should be designed with the expectation that role-based access control will be applied. Write service logic in a way that will be easy to protect.

---

## 12. User Experience Principles

### P-UX-1: Operational Roles Require Speed Above Anything Else

Cashier and kitchen workflows happen under time pressure with impatient customers. In these workspaces, every additional step, every ambiguous state, and every unclear error costs real money. Optimize for the minimum number of interactions to complete a task.

### P-UX-2: Role Focus Is a UX Feature

Clutter is an operational risk. Each role's workspace should contain exactly what they need to do their job — no more. The system does not present a unified dashboard because that is not how restaurants are actually operated.

### P-UX-3: Errors Must Be Visible, Immediate, and Actionable

In an operational context, silent failures cause business harm. A failed order creation, a payment that didn't process, or a stock request that wasn't submitted — these must surface clearly, immediately, and with enough context for the staff member to act. Errors in Bahasa Indonesia are required.

### P-UX-4: The Shift State Must Always Be Visible

Staff must always know whether their shift is active. The shift gate should be presented as a clear, friendly starting point ("Mulai shift Anda untuk memulai"), not as a confusing error state. Shift status is operationally critical context.

### P-UX-5: Branch Context Must Be Explicit at All Times

When a workspace supports multiple branches, the currently active branch must be permanently visible and trivially changeable. Branch ambiguity is a data integrity risk — a cashier operating in the wrong branch context will assign orders to the wrong location.

### P-UX-6: Mobile and Tablet Usability Are Part of the Contract

Kitchen and warehouse operations frequently happen on handheld devices. Components in these workspaces must remain fully operable at mobile and tablet viewport widths. Desktop-first assumptions in these contexts create operational friction.

### P-UX-7: Consistency Across Workspaces Builds Operational Trust

Even though each role sees different data, the interaction patterns — how modals open, how alerts appear, how tables are structured, how forms behave — should feel consistent across all workspaces. Consistency reduces training burden and prevents errors from role-switching.

---

## 13. Change Management Principles

### P-CHG-1: Understand the Blast Radius Before Touching Core Entities

Order, Payment, Shift, and KitchenShiftDetail are the most interconnected entities in the system. Changes to these entities propagate across multiple services, multiple frontend components, and multiple financial computations. Before changing them, map every consumer.

### P-CHG-2: Status String Changes Are Coordinated Deployments

Any change to a status value — order status, payment status, stock request status — is a behavioral contract change that requires simultaneous update to both frontend and backend. These are not refactors; they are breaking changes that must be treated as such.

### P-CHG-3: The Shift Model Is Load-Bearing

Before any change that affects how shifts work — how they start, how they end, what they gate, what is anchored to them — identify every feature that depends on shift presence. The shift is not just a feature; it is the organizing principle of the entire data model.

### P-CHG-4: Financial Logic Changes Require Full Audit Path Review

Any change to how income, expenses, or net calculations are performed must trace through the entire financial data flow. It is not sufficient to change the computation — verify that the source records feeding it remain intact.

### P-CHG-5: New Capabilities Should Follow Established Patterns

The composable-service-API pattern on the frontend and the handler-service-model pattern on the backend are the system's maintainability strategy. New capabilities that deviate from these patterns create isolated islands that become harder to maintain over time.

### P-CHG-6: Database Schema Changes Are High-Risk Manual Operations

There are no automated migrations in production. Schema changes require manual DDL, careful validation against existing data, and coordinated deployment. Never rely on ORM synchronization to manage production schema. Assume the migration will run once, against live data, with no rollback.

### P-CHG-7: Risk Assessment Is Based on Operational Impact, Not Technical Complexity

A technically simple change that touches the order creation flow carries higher risk than a complex change to reservation management. Assess risk by asking: "If this fails in production during lunch service, what stops?" Let that answer determine the level of caution applied.

---

## 14. AI Agent Governance

This section defines how AI agents should reason and act when working with this system.

### P-AI-1: Treat the Shift Model as Inviolable

The shift-anchored data model is the behavioral heart of the system. It is not a legacy constraint or a simplification target. Any AI-generated code that bypasses shift requirements — for any stated reason — is architecturally incorrect. Verify before proceeding, not after.

### P-AI-2: Business Rules Belong in Services

When implementing features, validation logic, state machine transitions, and business enforcement must live in the backend service layer. Placing these in handlers reduces enforceability. Placing them only in the frontend removes protection entirely.

### P-AI-3: Never Propose Derived Storage as a Solution to Performance

If asked to "cache" or "precompute" financial summaries, ask: would this stored table become a source of truth? If yes, it must be rejected. The correct solutions are query optimization, caching layers (Redis, in-memory), or pagination — not denormalized aggregate tables.

### P-AI-4: Trace the Dependency Graph Before Proposing Changes

For any change request, before writing a single line of code, identify:
- Which entities are touched?
- Which roles are affected?
- Which shift types are required?
- Which financial computations are downstream?
- Which behavioral contracts (status strings, API envelopes) are touched?

Present this analysis with the proposal.

### P-AI-5: Preserve All Behavioral Contracts

Status string values, API response envelope structure (`{status, message, data}`), role name strings, currency integer conventions, and timezone assumptions are contracts shared between frontend and backend. Never rename, restructure, or reformat these without explicitly flagging the coordination requirement.

### P-AI-6: When Uncertain About a Business Rule, Ask Rather Than Assume

The system encodes many implicit rules — in service logic, in state machines, in shift validations. If a change would remove a validation, alter a state transition, or change how shifts gate operations, verify intent before proceeding. Confidence is not a substitute for verification in a financial system.

### P-AI-7: Maintain Bahasa Indonesia Throughout

All user-facing text, status values, alert messages, and UI labels must be in Bahasa Indonesia. This is not a formatting preference — it is the product's operational identity. Any user-facing string in English is an error.

### P-AI-8: Integer Arithmetic for All Monetary Operations

Any code that touches IDR values must use integer arithmetic. Never introduce floating-point operations into currency computation. This applies to financial summaries, order totals, payment amounts, and refund calculations.

### P-AI-9: Evaluate the Full Lifecycle of Every New Entity

When introducing a new entity, evaluate its complete lifecycle:
- **Read:** Who can read it, filtered by what (role, branch, shift, date)?
- **Create:** What business rules must be satisfied at creation?
- **Update:** What state transitions are valid, and who can initiate them?
- **Delete:** Is deletion permitted, or should soft-delete be used?
- **Audit:** Does it need `created_by`/`updated_by`?
- **Financial:** Does it feed into any expense, revenue, or summary computation?

### P-AI-10: Respect the Audit Trail as a Product Requirement

Audit fields are not logging conveniences — they are product requirements that make the platform trustworthy. Every new entity in the operational domain should carry `created_by` and `updated_by`. Every financial or inventory change must be traceable to a person, role, and shift.

### P-AI-11: Assess Risk by the Three-Question Test

Before finalizing any change, ask three questions:
1. Does this respect the shift-anchored data model?
2. Does this preserve transactional integrity?
3. Does this keep business rules in the backend service layer?

If the answer to all three is **yes**, the change is architecturally sound. If any answer is **no**, reconsider before proceeding.

---

## 15. Future Evolution Principles

### P-EVOL-1: Harden Before Expanding

Backend RBAC enforcement, real-time kitchen order updates, request input validation, and automated test coverage are not nice-to-haves — they are structural gaps in a production financial system. New feature work should follow security and reliability hardening, not precede it.

### P-EVOL-2: Real-Time Communication Is the Next Structural Need

The most painful operational gap is the kitchen's reliance on manual refresh to see new orders. Real-time update capability (Server-Sent Events or equivalent) is the highest-impact improvement for the operational experience. Investments in real-time capability should prioritize the kitchen order board first.

### P-EVOL-3: Performance Improvements Should Be Additive

Caching the finance summary, adding pagination to list endpoints, and eliminating N+1 query patterns are additive improvements — they do not require changing the data model or business rules. Apply these when evidence of degradation exists. They are not prerequisites for new features unless measured performance has become a user problem.

### P-EVOL-4: Architecture Can Evolve; the Core Business Model Should Not

Regardless of future technical decisions — microservices, new databases, new frontend frameworks, new hosting platforms — the shift-anchored data model and the role-isolated workspace model represent the business's operational reality. These are not technology decisions; they are the platform's identity.

### P-EVOL-5: Multi-Warehouse Expansion Is a Model-Breaking Change

Currently, there is one global WarehouseShift for the entire operation. Supporting per-branch warehouses would require significant changes to the shift model, inventory relationships, and stock request workflow. This is a high-effort, high-impact evolution that requires careful planning — not an incremental improvement.

### P-EVOL-6: Test Coverage Is Prerequisite for Confident Refactoring

Before any major refactoring of core services — order service, finance service, shift services — automated test coverage must be established. The system's correctness is currently verified only by production usage. Refactoring without tests risks regressions that go undetected until a cashier can't create an order during service.

### P-EVOL-7: New Roles Follow an Established Pattern

The system is already designed for role extensibility: add a role string, add a route, create a workspace page, add a sidebar entry, add a backend role check. This pattern should be followed strictly. Ad-hoc role additions that bypass this structure create access control gaps.

### P-EVOL-8: API Versioning Enables Safe Evolution

As the system grows — particularly as the Customer App deepens its dependency on the same backend — the ability to evolve APIs without breaking consumers becomes critical. New endpoints should be designed with version-awareness. Breaking changes without versioning are silent regressions in dependent clients.

---

## 16. Strategic Decision Framework

Use this framework to evaluate any proposed change to the system.

### Step 1: Identify What Is Changing

Answer these questions before writing any code:

- Which entities are touched?
- Which roles are affected?
- Which shift types are involved?
- Which financial computations are downstream?
- Which behavioral contracts (status strings, API response structure, role names) are touched?

### Step 2: Apply the Three-Question Test

> 1. Does this respect the shift-anchored data model?
> 2. Does this preserve transactional integrity?
> 3. Does this keep business rules in the backend service layer?

If all three answers are **yes**, the change is architecturally sound.
If any answer is **no**, the change requires justification or redesign before proceeding.

### Step 3: Assess Operational Impact

| What is affected? | Sensitivity |
|---|---|
| Authentication / role assignment | Critical — affects all staff access |
| Shift lifecycle (start, end, gates) | Critical — affects all operational workflows |
| Order creation or payment processing | Critical — affects revenue generation |
| Financial summary computation | High — affects management visibility |
| Inventory or stock movement logic | High — affects audit trail |
| Kitchen-warehouse coordination workflows | Medium — affects service continuity |
| Reservation or reporting features | Lower — does not block core operations |

Higher sensitivity → more review, more caution, more coordination.

### Step 4: Evaluate Behavioral Contract Impact

Does this change any of the following shared contracts?

- Status string values (order, payment, stock request, fund request)
- API response envelope structure
- Role name strings
- Currency handling conventions
- Timezone handling
- Branch filtering behavior

If yes → **both frontend and backend must change simultaneously**. This is a coordinated deployment, not an independent change.

### Step 5: Determine Ownership and Coordination

| Type of Change | Ownership |
|---|---|
| Business rule changes | Backend service layer |
| UI/UX changes | Frontend, within established component patterns |
| Data model changes | Backend model + manual DDL, with migration planning |
| Status string changes | Both frontend and backend, coordinated deployment |
| Security enforcement | Backend middleware and service layer |
| Cross-cutting concerns | Both systems, with explicit coordination plan |

---

## 17. Executive Summary for Future Contributors

This section is written for any engineer, architect, product manager, or AI agent encountering this system for the first time.

### What This System Is

NURCHS POS is a production restaurant management platform. It is not a demo or a prototype — it runs live restaurant operations. Decisions made in this codebase affect real cashiers, real kitchen staff, and real financial records.

### The One Thing You Must Understand

**The shift is the operational unit.**

Everything in this system — orders, payments, stock movements, fund requests, financial reports — is anchored to a time-bounded shift. Before a cashier can take an order, a KitchenShift and CashierShift must be active. Before the warehouse can request funds, a WarehouseShift must be active. The financial summary is only meaningful in the context of the shifts that generated it.

If you change how shifts work, you change how everything works.

### The Three Rules That Must Never Be Broken

1. **Business rules live in the backend service layer.** Frontend validation protects the user experience. Backend service logic protects the data. Never confuse the two.

2. **Financial data is always computed from source records.** There is no finance_summaries table, and there should never be one. The summary is derived from OrderPayment + CashierShiftCashOut + FundRequestItem at query time.

3. **Inventory changes require movement records.** Never modify `InventoryItem.quantity` directly. Create a StockMovement record — the quantity change is the consequence, the movement record is the action.

### The Five Most Important Files to Understand

- **Backend:** `model.js` — all 20 entities and their relationships. This is the data contract.
- **Backend:** `orderService.js` — the central coordinator of all revenue flow.
- **Frontend:** `router/index.ts` — the gatekeeper of all role-based access.
- **Frontend:** `useOverlayManager.ts` — the singleton that drives all modal interactions.
- **Frontend:** `api.ts` — the Axios instance that injects Firebase JWT on every request.

### The Highest-Value Improvements (In Order)

1. **Add backend RBAC middleware** — Currently, any authenticated employee can call any endpoint. This is the most critical security gap.
2. **Add real-time kitchen order updates** — Kitchen staff manually refresh to see new orders. This is the most painful operational gap.
3. **Add automated tests** — There is zero test coverage. Core service refactoring without tests is a reliability risk.
4. **Add Redis caching for finance summary** — The finance summary hits 4–8 DB queries per request with no caching. This degrades with order volume.

### The Questions to Ask Before Any Change

> Does this respect the shift-anchored data model?
> Does this preserve transactional integrity?
> Does this keep business rules in the backend service layer?

If yes to all three, proceed. If no to any one, reconsider.

---

*PROJECT CONSTITUTION — NURCHS POS*
*Derived from PROJECT_MASTER_CONTEXT.md Version 1.0*
*This document is the governing principles source for the NURCHS POS platform.*
*Version 1.0 | Generated: 2026-06-05*

*This constitution remains valid regardless of changes to the technology stack, framework versions, or hosting infrastructure. It defines principles, not implementations. Update it only when the business model, the organizational structure, or the strategic intent of the platform changes.*
