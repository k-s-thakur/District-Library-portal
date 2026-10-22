# Smart Library System: Repository Audit & Implementation Plan

**Date:** 21 October 2026  
**Auditor:** Senior Full-Stack & DevOps Engineer  
**Scope:** `PRD-Public-OPAC.md`, `PRD-Librarian-Admin-Portal.md`, `Product Requirements Document (PRD) 16 oct .md`, `homenest-DESIGN.md`, and codebases in `SMART LIBRARY APP/gplms-web` and `library project 2`.

---

## 1. Executive Summary

This audit evaluates the codebase against the requirements of the Public OPAC (`PRD-Public-OPAC.md`), the Librarian & Administration Portal (`PRD-Librarian-Admin-Portal.md`), and the source PRD (16 Oct).

### Key Takeaway
The repository contains a substantial, working **Government Public Library Management System (GPLMS)** core built with **Next.js 16.4 (Turbopack)**, **React 19.3**, **Tailwind CSS v4**, and **Prisma ORM (SQLite)** in `SMART LIBRARY APP/gplms-web`. Foundational data modeling (separating bibliographic `Book` from physical `BookCopy`), transaction-safe issue/return, fine assessment, atomic cash payments with idempotency keys, and compensating payment reversals are implemented and functionally sound.

However, **there are critical architectural, security, and UI gaps** that must be resolved:
1. **Critical Privacy Leaks:** Public endpoints (`/api/circulation/active`, `/api/members`, and `/api/catalogue`) leak active borrower names, phone numbers, full member lists, raw QR sticker tokens, and reservation queue member identities.
2. **Demo Auth Backdoor:** `POST /api/auth/switch-role` allows anyone to obtain a valid `SUPER_ADMIN` JWT session cookie without credentials.
3. **OPAC IA & Visual Mismatch:** The current public frontend is a single monolithic page with a linen/sage color scheme borrowed from the real-estate design system (`homenest-DESIGN.md`), whereas `PRD-Public-OPAC.md` mandates a multi-route, editorial, search-first discovery site with teal/coral accents, dedicated `/search`, `/books/:bookId`, `/categories`, and curated book rows (ManyBooks-inspired browsing patterns).
4. **Staff Portal Navigation & Operations:** The staff interface lacks the persistent left sidebar navigation, dedicated dashboard overview, staff user management, role-based export reports, and dedicated accession register endpoints.
5. **Test Hygiene:** The acceptance test suite fails on consecutive runs because test fixtures mutate database state without teardown/isolation.

---

## 2. Repository & Framework Baseline

| Component | Current Implementation | Audit Finding & Version Note |
|---|---|---|
| **Framework** | Next.js 16.4.0 (Canary with Turbopack) | Latest release with Partial Prerendering and React 19.3. Builds cleanly in 25s. |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/turbopack`) | Configured via `@import "tailwindcss";` in `globals.css`. |
| **ORM & Database** | Prisma 6.4.1 with SQLite (`gplms.db`) | SQLite is suitable for local development/staging, but does not support Postgres RLS or native concurrency locks (`SELECT FOR UPDATE`). |
| **Authentication** | `jose` (JWT) + `bcryptjs` in HTTP-only cookie `gplms_session` | JWT cookie contains role and memberId. Hardcoded fallback secret in `src/lib/auth.ts`. Unprotected role-switcher endpoint present. |
| **Icons & UI** | `lucide-react` v1.52.0 | Clean SVG icon usage across client components. |
| **Testing** | Custom acceptance runner (`tsx scripts/verify_gplms_acceptance_tests.ts`) | No Jest / Vitest installed. Script tests PRD acceptance criteria AT-01 to AT-10. |

### Build & Test Results
- **TypeScript Compilation (`npx tsc --noEmit`):** ✅ **PASS** (0 errors).
- **Production Build (`npm run build`):** ✅ **PASS** (All 21 static and dynamic routes compiled successfully).
- **ESLint (`npm run lint`):** ❌ **FAIL** (Module resolution failure for `array.prototype.findlastindex` in `node_modules`).
- **Acceptance Tests (`scripts/verify_gplms_acceptance_tests.ts`):** ⚠️ **5 PASS / 5 FAIL** (Failures caused by dirty DB state from previous runs without fixture cleanup).

---

## 3. Database Schema & Concurrency Findings

### 3.1 Data Model Strengths
- **Title vs. Physical Copy:** Correct separation of bibliographic metadata (`Book`, `Author`, `Publisher`, `Category`, `BookAuthor`) from physical copies (`BookCopy` with `accessionNo`, `qrCodeToken`, `shelfLocation`, `status`, `condition`).
- **Atomic Finance Flow:** `FeeCharge`, `Payment`, `PaymentAllocation`, `ReceiptSequence`, `Receipt`, and `PaymentReversal` provide complete financial accountability.
- **Idempotency:** `Payment.idempotencyKey` prevents duplicate charges on replayed requests.
- **Compensating Reversals:** Payment reversal marks the payment `REVERSED`, receipt `CANCELLED`, restores the charge balance, and creates an audit entry without deleting history.

### 3.2 Schema & Integrity Risks
1. **Float vs. Decimal for Currency:**
   - In `schema.prisma`, `amount`, `paidAmount`, `balance`, `acquisitionCost`, and `fineRatePerDay` use `Float`. SQLite stores IEEE 754 floating-point numbers, leading to potential rounding inaccuracies (e.g., `0.1 + 0.2 = 0.30000000000000004`).
   - *Recommendation:* Migrate to `Decimal` in Prisma when moving to PostgreSQL, and use integer cents/paisa or `Math.round(val * 100)` in application calculations.
2. **Sequential Number Collisions:**
   - In `member.service.ts`, member numbers are generated with `count = await tx.member.count(); GPL-${year}-${count + 1}`. Concurrent registrations or past deletions will trigger unique constraint violations.
   - *Recommendation:* Introduce a dedicated sequence table (matching `ReceiptSequence`) or auto-incrementing ID.
3. **Database Concurrency & Postgres Migration:**
   - Current SQLite relies on database-level file locks. When deploying to NIC/government infrastructure running PostgreSQL, `circulation.service.ts` and `finance.service.ts` will need explicit transactional row locking (`SELECT ... FOR UPDATE` or optimistic status checks `UPDATE BookCopy SET status = 'ISSUED' WHERE id = :id AND status = 'AVAILABLE'`) to avoid race conditions.

---

## 4. Current vs. Target Route & API Map

### 4.1 Route Map Comparison

| Target Route (PRD 1 & PRD 2) | Current Route in Codebase | Status | Gap & Required Action |
|---|---|---|---|
| **`/` (Public OPAC Homepage)** | `src/app/page.tsx` | Partial | Currently a single search bar with monolithic stacks. Needs ManyBooks-inspired editorial homepage: curated rows (Recently Added, Popular, Staff Picks), Browse Genres grid, Discover navigation, and teal/coral accent styling. |
| **`/search?q=...`** | *Missing* (handled on `/`) | Missing | Dedicated search results page with facet filters (category, language, availability, DDC), sort controls, URL query persistence, pagination, and empty/error states. |
| **`/books/:bookId`** | *Missing* (uses client modal) | Missing | Dedicated book detail page with bibliographic metadata, cover fallback, copy availability counters, shelf/rack location, and authenticated reservation trigger. |
| **`/categories`** | *Missing* | Missing | All-categories taxonomy listing with title counts and visual tiles. |
| **`/categories/:slug`** | *Missing* | Missing | Category-specific catalog browse view. |
| **`/library-information`** | *Missing* (hardcoded footer snippet) | Missing | Official library timings, address, membership rules, fees structure, and contact information. |
| **`/login`** | *Missing* (uses navbar role switch) | Missing | Official citizen/staff login entry point with credential verification. |
| **`/account`** | `src/app/member/page.tsx` | Implemented | Dedicated member dashboard with loans, due dates, reservations, dues, and payment receipts. |
| **`/staff/dashboard`** | *Missing* | Missing | Operational overview with live stats, circulation counters, and daily collection snapshot. |
| **`/staff/circulation`** | `src/app/staff/circulation/page.tsx` | Implemented | Issue, return, renew, and active loans tabs. Needs persistent staff sidebar layout. |
| **`/staff/inventory`** | `src/app/staff/inventory/page.tsx` | Partial | Add book & accession register. Uses hardcoded values; needs dedicated staff copy register API. |
| **`/staff/finance`** | `src/app/staff/finance/page.tsx` | Implemented | Charge assessment, cash payment posting, receipt printing, daily collection register, and authorized payment reversal. |
| **`/staff/members`** | `src/app/staff/members/page.tsx` | Implemented | Member directory, registration, card preview. Needs permission gating on list API. |

---

## 5. Security & Privacy Findings

| Severity | Vulnerability / Issue | Impact | File Location | Remediation |
|---|---|---|---|---|
| **CRITICAL** | **Unauthenticated Member Directory** | Any anonymous user can fetch all members, phone numbers, emails, and balances. | `src/app/api/members/route.ts` (GET) | Enforce `SUPER_ADMIN`, `LIBRARY_ADMIN`, `LIBRARIAN`, `ACCOUNTS_OPERATOR` role checks on `GET /api/members`. |
| **CRITICAL** | **Unauthenticated Active Loans Leak** | Anonymous users can query all active borrowings with patron names, phone numbers, and book titles. | `src/app/api/circulation/active/route.ts` (GET) | Require staff session or member-specific scope (`memberId === session.memberId`). |
| **HIGH** | **Catalogue API Leaks QR Secrets & Reservations** | `GET /api/catalogue?id=...` returns raw `qrCodeToken` and reservation member names/IDs. | `src/app/services/catalogue.service.ts` | Strip `qrCodeToken`, `acquisitionCost`, and private `member` info from public catalog DTOs. |
| **HIGH** | **Unprotected Role Switcher (`/api/auth/switch-role`)** | Any client can forge a `SUPER_ADMIN` cookie by sending `{"role": "SUPER_ADMIN"}`. | `src/app/api/auth/switch-role/route.ts` | Restrict to development environment (`process.env.NODE_ENV !== "production"`) or remove and implement real credential-based authentication. |
| **HIGH** | **Hardcoded Fallback JWT Secret** | Fallback key `"gplms-nic-approved-secret-jwt-key-2026-production"` in source code. | `src/lib/auth.ts` | Throw error on startup if `JWT_SECRET` is unset in production. |
| **MEDIUM** | **IDOR in Member Details API** | Logged-in non-member roles (e.g. `PUBLIC_VISITOR`) can query any member ID via `GET /api/members/:id`. | `src/app/api/members/[id]/route.ts` | Explicitly enforce role whitelist (`isStaff || session.memberId === id`). |

---

## 6. Gap Matrix: PRD-Public-OPAC & PRD-Librarian-Admin-Portal

| Req ID | Requirement | Current Code / Evidence | Status | Risk | Recommended Change | Test Needed |
|---|---|---|---|---|---|---|
| **OPAC-01** | Anonymous Public Search | `api/catalogue/route.ts`, `page.tsx` | **Implemented** | Low | Enhance to dedicated `/search` with URL parameter persistence (`?q=&category=&sort=`). | Unit search query parsing & filter tests. |
| **OPAC-02** | Search Results & Filtering | `page.tsx` (client filtering) | **Partial** | Medium | Move from client state to URL-driven state; add sort (A-Z, newest), publication year, and language facets. | URL params sync & empty/error state tests. |
| **OPAC-03** | Book Detail Page | In-page modal on `page.tsx` | **Partial** | Medium | Create dedicated `/books/[bookId]` route. Display full bibliographic details, copy availability breakdown, shelf location, and fallback cover. | Route rendering & 404 on invalid ID. |
| **OPAC-04** | All Categories & Taxonomy | DDC pills on `page.tsx` | **Partial** | Low | Create `/categories` and `/categories/[slug]` with visual cards and real title counts. | Category count & empty category handling. |
| **OPAC-05** | Library Information Page | Hardcoded footer text | **Missing** | Low | Create `/library-information` with verified library timings, address, rules, and contact info. | Snapshot test. |
| **OPAC-06** | Visual Aesthetic (Teal/Coral Editorial) | Soft linen / sage `#7A8B6F` (HomeNest style) | **Missing** | Medium | Refactor OPAC palette away from real-estate warm brown/cream/sage to library editorial with teal/coral accents and book cover cards. | Responsive & visual contrast review. |
| **OPAC-07** | Data Privacy in Public APIs | `catalogue.service.ts` returns `qrCodeToken` and reservation member names | **Defect** | High | Create dedicated safe public DTO that strips `qrCodeToken`, `acquisitionCost`, and private patron information. | Test asserting zero private member/QR fields in public response. |
| **PORTAL-01** | Persistent Sidebar Layout | Top horizontal navbar only | **Missing** | Low | Implement responsive staff sidebar navigation with active route highlights. | Layout responsive test. |
| **PORTAL-02** | Role-Gated Access Control | API endpoints have checks; page components lack client route guards | **Partial** | High | Add Next.js middleware or layout-level server session guards for `/staff/*`. | Unauthorized redirect test for public/member sessions. |
| **PORTAL-03** | Accession Register & QR Printing | `staff/inventory/page.tsx` (loads 50 items from public catalogue) | **Partial** | Medium | Create dedicated `/api/staff/copies` endpoint with search by accession number, status, shelf location, and printable QR batching. | QR generation & accession uniqueness test. |
| **PORTAL-04** | Circulation Desk (Issue/Return/Renew) | `staff/circulation/page.tsx`, `circulation.service.ts` | **Implemented** | Low | Works well with atomic policy checks. Ensure optimistic locking on copy status. | Concurrency issue race condition test. |
| **PORTAL-05** | Atomic Payments & Receipts | `staff/finance/page.tsx`, `finance.service.ts` | **Implemented** | Low | Full transaction rollback, idempotency, sequential receipts, and reversing. | Idempotent replay & failure rollback tests. |
| **PORTAL-06** | Financial & Operational Reports | `api/finance/reports/collection` (Daily summary only) | **Partial** | Medium | Add CSV export, monthly report, and overdue loans report. | Report reconciliation test. |
| **PORTAL-07** | Super Admin Staff Management | *Missing* (Staff created only via seed) | **Missing** | Medium | Add `/staff/settings/users` for creating and managing staff credentials and roles. | Permission denial test for non-super-admin. |

---

## 7. Phased Implementation Plan

### Phase 1: Security Hardening & Safe API Contracts (Prompt A/B Pre-requisite)
1. **Sanitize Public Catalogue DTO:** Remove `qrCodeToken`, `acquisitionCost`, and reservation member names from `searchCatalogue` and `getBookDetails`.
2. **Authorize Sensitive Endpoints:** Add staff role checks to `GET /api/members` and `GET /api/circulation/active`.
3. **Isolate / Disable Demo Switcher:** Gate `/api/auth/switch-role` behind development mode and enforce strict JWT secret handling.
4. **Fix Test Suite Teardown:** Add cleanup/isolation logic to `scripts/verify_gplms_acceptance_tests.ts` so tests pass deterministically on repeated execution.

### Phase 2: Public OPAC Implementation (Prompt B)
1. **Design System & Tokens:** Establish the approved editorial public palette (teal/coral accents, neutral reading surfaces, book-cover card ratios) and remove real-estate HomeNest artifacts.
2. **Global Header & Navigation:** Responsive header with library identity, Discover dropdown, prominent global search, and login link.
3. **Discovery Homepage (`/`):** Hero with prominent search, data-driven curated rows ("Recently Added", "Popular / Circulated", "Staff Picks"), and visual category tiles.
4. **Dedicated Search Page (`/search`):** Query input, live count, multi-facet sidebar filters (category, language, publication year, availability), sort dropdown, and URL persistence.
5. **Book Detail Page (`/books/[bookId]`):** Bibliographic summary, book cover fallback, real copy availability counter, shelf/rack location, and authenticated member reservation trigger.
6. **Browse Pages:** `/categories` and `/categories/[slug]` taxonomy pages.
7. **Official Information Page:** `/library-information` with timings, membership rules, fees, and contact details.

### Phase 3: Librarian & Admin Portal Refinements (Prompt C)
1. **Staff Layout & Persistent Sidebar:** Responsive drawer on mobile, persistent left sidebar on desktop with role-gated items.
2. **Staff Overview Dashboard (`/staff/dashboard`):** Real-time operational cards (active loans, today's issues/returns, overdue count, today's cash collection).
3. **Accession Register & QR Queue:** Dedicated staff copy endpoints with accession search, shelf filter, and bulk printable label sheet.
4. **Reports & Exports:** Daily/monthly collection CSV export and overdue loan register.
5. **Route-Level Access Middleware:** Next.js middleware protecting `/staff/*` from non-staff roles.

### Phase 4: Release Gate & QA Verification (Prompt D)
1. Execute full regression suite including concurrency and idempotency tests.
2. Verify zero sensitive data exposure on all public endpoints.
3. Complete WCAG 2.2 AA accessibility audit (keyboard navigation, visible focus, ARIA labels).
4. Generate `release-readiness-report.md`.

---

## 8. Explicit Risks & Unresolved Questions

1. **Workspace Location:**
   - The current codebase resides in `E:\KHAGENDRA SINGH THAKUR\DEVOPS BUILD\SMART LIBRARY APP\gplms-web`, while the active agent workspace was initialized in `E:\KHAGENDRA SINGH THAKUR\DEVOPS BUILD\library project 2`.
   - *Question for Project Owner:* Should we develop and refactor directly inside `SMART LIBRARY APP/gplms-web`, or clone/relocate the application directly into `library project 2`?
2. **Authentication for Citizens/Members:**
   - Current member sign-in relies on demo role-switching.
   - *Question for Project Owner:* For MVP, should members log in using `Member No` + `Phone/Password` or an OTP mock?
3. **Curated Sections Curation Mechanism:**
   - "Staff Picks / Editor's Choice" requires a curation flag (`isFeatured` or `isStaffPick`) on the `Book` model.
   - *Recommendation:* Add an optional boolean `isStaffPick Boolean @default(false)` in `schema.prisma`.
