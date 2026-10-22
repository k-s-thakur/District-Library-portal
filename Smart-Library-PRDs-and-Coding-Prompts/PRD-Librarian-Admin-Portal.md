# PRD 2 --- Smart Library Librarian & Administration Portal

**Version:** 1.0\
**Status:** Target-state requirements; implementation audit required\
**Product:** Government Public Library Management System --- Internal
Portal\
**Primary users:** Librarian, Library Admin, Accounts Operator,
Approving Officer, Super Admin\
**Related document:** `PRD-Public-OPAC.md`

------------------------------------------------------------------------

## 1. Executive Summary

Build a secure, operational staff portal for managing the complete
workflow of a single government public library. This is a task-oriented
internal application, not a consumer book-discovery website. Its
priorities are accuracy, speed, traceability, data integrity and
role-specific access.

The internal portal and public OPAC will have separate frontends and
user experiences, but share one authoritative backend/database. The
staff portal manages catalog records, physical copies, accession
numbers, DDC/book numbers, members, circulation, charges, payments,
receipts, reports, policies and users.

The source PRD reports most foundational, catalog and circulation work
as completed, with atomic payment/receipt finalization and production
readiness still pending. These are **reported statuses, not
independently verified facts**; inspect the repository and database
before modifying anything.

## 2. Product Outcomes

-   Maintain one reliable bibliographic record per title and one record
    per physical copy.
-   Prevent duplicate accession numbers and duplicate active loans.
-   Make issue/return/renewal/reservation workflows fast and
    predictable.
-   Maintain consistent member status, due dates, fines, payments,
    allocations and receipts.
-   Enforce least-privilege role permissions on the server/database.
-   Preserve immutable audit history for sensitive operations.
-   Provide accurate operational and financial reports.
-   Support safe import/export, backups, recovery testing and approved
    government hosting.

## 3. Users and Permissions

  -----------------------------------------------------------------------
  Role                                Core permissions
  ----------------------------------- -----------------------------------
  Super Admin                         Manage system configuration, staff
                                      accounts, roles, security and
                                      global settings

  Library Admin                       Manage catalog, members, policies,
                                      reports and operational approvals

  Librarian                           Manage catalog/copies, accession
                                      records, issue/return, renewal and
                                      reservations

  Accounts Operator                   Record authorized payments,
                                      allocate charges, generate/reprint
                                      receipts and reconcile collections

  Approving Officer                   Approve authorized waivers,
                                      refunds, cancellations and
                                      exceptional transactions

  Registered Member                   Only own loans, due dates, dues and
                                      eligible reservations through
                                      member-facing access

  Public Visitor                      Public catalog only; no staff
                                      portal access
  -----------------------------------------------------------------------

Rules: - Permissions must be enforced server-side and at the
database/API boundary, not only by hiding buttons. - Staff must not
approve their own exceptional transactions where segregation of duties
is required. - Accounts access must not imply permission to edit
catalog/circulation records. - Librarian access must not imply financial
write access unless explicitly assigned. - Audit log access is
restricted. - Public visitor/member UI is not a substitute for the staff
portal.

## 4. Navigation and Information Architecture

Use a persistent left sidebar on desktop and a responsive drawer on
smaller screens.

Primary modules: 1. Overview 2. Catalog - Titles / bibliographic
records - Authors - Publishers - Categories / subjects - DDC and book
numbers - Physical copies / accession register - QR labels and print
queue - Imports and validation reports 3. Circulation - Issue book -
Return book - Renew loan - Active loans - Overdue items - Reservations /
holds 4. Members - Member directory - Register member - Member profile -
Membership renewal/status 5. Finance (permission-gated) - Charges and
fines - Take payment - Payment allocations - Receipts -
Reversals/refunds - Daily collection/reconciliation 6. Reports 7. Staff
and Roles (admin-only) 8. Policies and Settings (authorized roles) 9.
Audit Log (restricted) 10. System Health / Backup status
(admin/operations access as approved)

Every route must have an explicit permission requirement. A user who
pastes a restricted URL must receive a safe 403/unauthorized state.

## 5. Dashboard

### 5.1 Operational summary

Show role-appropriate, database-derived indicators: - Total titles and
physical copies. - Available, issued, reserved/hold, reference-only,
lost, damaged, missing and withdrawn copies. - Active, expired and
suspended members. - Active loans, overdue loans and reservations
awaiting pickup. - Today's issue/return counts. - Pending operational
tasks or exceptions.

Finance cards appear only to authorized roles: - Today's collections. -
Outstanding charges. - Receipts and reversals. - Reconciliation status.

### 5.2 Dashboard behavior

-   Date range and relevant filters.
-   Each KPI links to the underlying filtered list.
-   Display "as of" time for derived counts where useful.
-   Do not hardcode statistics.
-   Empty states should explain what data/action is missing.
-   Failures should show an error and retry action, not zero values that
    could be mistaken for real totals.
-   Avoid overwhelming the dashboard with every metric; prioritize
    role-specific tasks.

## 6. Catalog and Physical Copy Management

### 6.1 Bibliographic record

Fields, when applicable: - Title, subtitle, ISBN, edition, publication
year. - One or more authors. - Publisher. - Subject/category and
language. - DDC classification number and book number. - Description and
cover image. - Acquisition metadata as required.

### 6.2 Physical copy

Each copy has: - Unique accession number. - Unique QR
identifier/token. - Copy number. - Shelf/rack/location code. -
Acquisition date and cost where required. - Physical condition. -
Status: Available, Issued, Reserved/Hold, Reference Only, Lost, Damaged,
Missing or Withdrawn. - Transaction/inventory history.

### 6.3 Required workflows

-   Create/edit a bibliographic record.
-   Add one or multiple physical copies to a title.
-   Validate uniqueness of accession number and QR identifier.
-   Search by title, author, ISBN, accession number, DDC, category and
    location.
-   Filter copies by status, location, acquisition date and condition.
-   Generate and print QR labels for selected copies.
-   Import CSV/Excel with preview, field mapping, validation, duplicate
    detection and downloadable error report.
-   Perform stock verification and authorized inventory adjustments.
-   Withdraw/deactivate a copy without deleting historical loans or
    finance records.

### 6.4 Data integrity rules

-   A title and a physical copy are separate entities.
-   Never reuse an accession number unless the approved policy
    explicitly permits it.
-   Do not hard-delete records referenced by circulation or finance
    history.
-   Record who changed status/location and when.
-   QR code must identify a copy safely; it must not expose a secret or
    grant unauthorized actions by itself.
-   Confirm existing schema before adding migrations.

## 7. Member Management

-   Generate unique member number.
-   Capture only required personal/contact information.
-   Configure member categories and eligibility rules.
-   Record registration and expiry dates.
-   Support active, expired, suspended and closed states.
-   Support membership renewal and authorized edits.
-   Display member loans, overdue items, outstanding charges and
    transaction history to authorized staff.
-   Enforce borrowing limits and loan periods by category.
-   Provide member search with appropriate privacy controls.
-   Prevent unauthorized export of unnecessary personal data.
-   Avoid assuming all membership categories have fees; fee policy is
    configurable.

## 8. Circulation: Issue, Return, Renew and Reserve

### 8.1 Issue workflow

1.  Authenticate staff and verify circulation permission.
2.  Identify member using member number or member QR.
3.  Scan book-copy QR or enter accession number manually.
4.  Validate member status, copy status, loan limits, overdue/financial
    blocks if policy specifies them, and other restrictions.
5.  Calculate due date from the active policy version.
6.  Create loan and update copy status in one database transaction.
7.  Record staff actor and timestamp.
8.  Show confirmation and due date.

### 8.2 Return workflow

1.  Scan QR or enter accession number.
2.  Find the active loan.
3.  Close the loan and record return time.
4.  Calculate overdue charge using the policy applicable to that loan.
5.  Update copy status and reservation queue.
6.  Display outstanding charges or next reservation instructions.
7.  Commit all related changes atomically.

### 8.3 Renewal and reservation

-   Renew only if policy allows and no conflicting hold/restriction
    applies.
-   Maintain reservation queue order and timestamps.
-   Enforce pickup deadlines and expiry rules.
-   Prevent duplicate active reservations where policy prohibits them.
-   Use locking/transactions to prevent two staff from issuing the same
    physical copy.
-   Clearly explain why an issue/renewal/reservation was rejected.

### 8.4 Critical circulation invariants

-   A physical copy can have at most one active loan.
-   Failed transactions must not leave contradictory copy, loan or
    member state.
-   Manual accession entry is always available as a fallback to camera
    scanning.
-   Camera permission denial must not block the entire workflow.
-   QR scanning must not bypass staff authentication or server-side
    policy validation.

## 9. Fees, Fines, Payments and Receipts

### 9.1 Charge types

-   Membership fee (only when configured).
-   Renewal fee.
-   Late fine.
-   Lost-book charge.
-   Damaged-book assessment.
-   Other approved charges.
-   Waiver/discount with permission, reason and audit history.

Rules must support configurable grace periods, daily rates, caps,
closed-day handling and effective dates. Policy changes must not
silently rewrite historical charges.

### 9.2 Manual payment

Online payment gateway is excluded from Version 1.0.

-   Accept cash and other explicitly approved manual methods.
-   Capture amount, date, method, operator and reference where
    applicable.
-   Allocate one payment to one or more eligible charges.
-   Support partial payments where policy permits.
-   Prevent allocation beyond payment amount or outstanding charge
    balance.
-   Use decimal-safe monetary types (`NUMERIC` in PostgreSQL).
-   Use a database transaction for payment, allocation, receipt and
    audit event.
-   Add idempotency protection for retries/double-clicks.
-   Do not treat an unverified bank/UPI reference as proof of receipt.

### 9.3 Receipt generation

-   Unique receipt number generated with concurrency-safe sequencing.
-   Library name and approved logo/address.
-   Member identifier, receipt date and receiving operator.
-   Charge descriptions, amounts, total paid and method/reference.
-   Receipt status and controlled reprint history.
-   Printable receipt and PDF export.
-   Cancellation/reversal requires reason, authorization and complete
    audit history.
-   Payment, allocations, receipt number, receipt and audit event must
    commit atomically.
-   If any step fails, the transaction rolls back fully.
-   Retrying the same idempotency key must not create another payment or
    receipt.

### 9.4 Payment reversal

-   Never delete the original posted payment.
-   Record reversal as a linked, authorized compensating transaction.
-   Require permission and reason.
-   Restore balances consistently and update reports.
-   Preserve original receipt and issue a reversal/credit document only
    according to approved policy.
-   Prevent duplicate reversal requests.

## 10. Reports and Exports

Reports: - Accession register. - Catalog and copy inventory by category,
language, DDC and location. -
Available/issued/reserved/lost/damaged/missing/withdrawn inventory. -
Active/expired/suspended members. - Daily/monthly issue and return
registers. - Overdue loans and outstanding charges. - Reservations and
pickup expiry. - Fee assessments, payments, allocations, receipts,
reversals and waivers. - Daily cash collection and reconciliation. -
Staff activity and security audit.

Requirements: - Date filters, status filters and authorized
CSV/Excel/PDF export. - Report totals must reconcile with underlying
transactions. - Exports must enforce the same permission rules as the
UI. - Log sensitive exports where policy requires. - Avoid including
personal data not needed for the report. - Large reports must be
paginated or generated asynchronously if necessary.

## 11. Administration, Policies and Audit

Authorized staff can configure: - Library name, address, timings and
contact information. - Membership categories and eligibility. - Loan
periods, limits, renewals and reservation rules. - Fine/fee rules with
effective dates. - Receipt numbering scheme. - Staff accounts, roles and
permissions. - Approved public catalog fields and curated homepage
selections.

Audit events must record: - Actor and role. - Action and affected
entity. - Timestamp. - Relevant before/after values, with secrets and
unnecessary personal data excluded. - Reason/approval reference for
sensitive actions. - Request/correlation ID where practical.

Audit logs and posted financial history must not be editable through
ordinary UI workflows.

## 12. Security and Architecture

### 12.1 Architecture boundary

-   Separate frontend applications/routes for OPAC and staff portal.
-   One authoritative backend/API and one canonical
    catalog/circulation/finance data model.
-   Do not duplicate the catalog or availability database.
-   All critical business rules must execute server-side or in database
    transactions.
-   Frontend hiding is not authorization.
-   Never expose database service-role credentials or secrets in browser
    bundles.

### 12.2 Database and transactional functions

The source PRD specifies PostgreSQL and proposes functions including: -
`issue_book(...)` - `return_book(...)` - `renew_loan(...)` -
`reserve_book(...)` - `assess_charge(...)` - `post_payment(...)` -
`reverse_payment(...)` - `calculate_overdue_fine(...)` -
`get_collection_report(...)`

Treat these as target contracts, not permission to recreate functions
blindly. Inspect current schema, migrations, grants, RLS and function
definitions first. If Supabase is used, review RLS policies and
service-role usage; if another API architecture is used, enforce
equivalent server-side authorization.

### 12.3 Essential controls

-   HTTPS in production.
-   Secure authentication/session management.
-   Server-side authorization on every protected operation.
-   Least privilege and separation of duties.
-   Input validation and safe output rendering.
-   Rate limiting for authentication and public endpoints.
-   Secure secret management.
-   Audit trail for sensitive actions.
-   Tested backup/restore.
-   No production secrets in source control.
-   Security review before production.

## 13. Non-Functional Requirements

  -----------------------------------------------------------------------
  Area                                Requirement
  ----------------------------------- -----------------------------------
  Performance                         Common OPAC searches target under 2
                                      seconds at p95 under an agreed test
                                      load; staff workflows should remain
                                      responsive under the agreed load

  Data integrity                      Constraints, transactions, foreign
                                      keys, unique identifiers and
                                      consistent balances

  Availability                        Agree target with hosting authority

  Security                            HTTPS, least privilege, server-side
                                      authorization and approved security
                                      testing

  Privacy                             Minimum necessary data;
                                      role-restricted access and exports

  Accessibility                       Keyboard operation, accessible
                                      labels, visible focus, readable
                                      contrast

  Compatibility                       Current supported desktop/mobile
                                      browsers; scanner camera
                                      permissions handled safely

  Auditability                        Traceable circulation,
                                      configuration and financial actions

  Backup/recovery                     Approved retention, tested
                                      restoration, documented RPO/RTO

  Maintainability                     Version-controlled migrations,
                                      automated tests and deployment
                                      documentation

  Localization                        English and Hindi labels where
                                      required

  Hosting                             Government-approved/NIC
                                      infrastructure subject to formal
                                      approval
  -----------------------------------------------------------------------

## 14. Required Error and Edge States

-   Invalid or unknown QR/accession number.
-   Camera unavailable or permission denied.
-   Member expired, suspended or over borrowing limit.
-   Copy already issued, lost, damaged, withdrawn or reference-only.
-   Two concurrent issue attempts for the same copy.
-   Renewal blocked by reservation or policy.
-   Reservation queue race or duplicate reservation.
-   Invalid/expired staff session.
-   Insufficient or over-allocated payment.
-   Duplicate payment request/idempotency retry.
-   Receipt number concurrency collision.
-   Receipt-generation failure after payment initiation.
-   Unauthorized reversal/waiver attempt.
-   CSV import duplicates, invalid dates, unknown category or malformed
    ISBN.
-   Database/network failure.
-   Export permission denied.
-   Backup restore failure.

Every failure must return a controlled message and leave data in a valid
state. Do not show success until the backend confirms commit.

## 15. Acceptance Criteria

1.  Role permissions are enforced on the server/API and tested with
    unauthorized requests.
2.  Duplicate accession numbers and QR identifiers are rejected.
3.  One physical copy cannot have more than one active loan, including
    concurrent requests.
4.  Issue/return/renew/reservation workflows update related records
    atomically.
5.  Camera failure does not prevent manual accession entry.
6.  Fine calculation uses the applicable policy version and is
    reproducible.
7.  Partial payment leaves the correct outstanding balance.
8.  Over-allocation and negative amounts are rejected.
9.  Repeating the same payment request does not create duplicate
    payment/receipt records.
10. A receipt-generation failure rolls back payment and allocations.
11. Receipt numbers remain unique under concurrent requests.
12. Reversal is permission-controlled, reasoned and auditable; original
    records remain.
13. Reports reconcile with source transactions and respect permissions.
14. CSV/Excel import returns a validation report and does not partially
    import invalid rows without explicit transactional design.
15. Backup restore is tested in a non-production environment.
16. UAT is signed off by the Librarian, Accounts Operator and authorized
    approving authority.
17. No unresolved critical security or data-integrity defects remain
    before production.

## 16. MVP Scope and Priorities

### P0 --- Required for operational MVP

-   Authentication and role-based authorization.
-   Catalog and physical copy management.
-   Accession numbers, DDC/book numbers and QR labels.
-   Member management.
-   Issue, return, renewal and reservation rules.
-   Fine/charge assessment.
-   Atomic payment allocation and receipt generation.
-   Audit log and essential operational/financial reports.
-   Public OPAC integration using the same data.
-   Backup/restore and UAT.

### P1 --- After core workflow is stable

-   Improved bulk import/export tooling.
-   More configurable dashboard cards.
-   Advanced report filters.
-   Enhanced stock-verification workflow.
-   Staff-curated homepage collections.

### Explicitly out of scope for Version 1.0

-   Multi-branch administration.
-   Online payment gateway.
-   RFID hardware integration.
-   Automated government identity-system integration.
-   Procurement/accounting integration unless approved.
-   AI recommendations, predictive analytics or generative AI features.

## 17. Reported Implementation Status and Required Audit

The existing PRD reports React/JavaScript/Vite, PostgreSQL migrations,
staff login, role permissions, audit logging, catalog CRUD,
classification, accession register, QR labels, public search, member
registration, circulation, renewals, reservations and overdue fine as
implemented. It reports atomic payment allocation/receipt generation and
NIC hosting/backup/restore/UAT as pending.

Before coding: 1. Inspect repository structure and package manifests. 2.
Inspect all migrations and current database schema. 3. Inspect
authentication, role enforcement, RLS policies and backend functions. 4.
Trace payment posting from UI through API/SQL to receipt generation. 5.
Run existing tests and document current failures. 6. Verify whether
"completed" items work end-to-end. 7. Make a gap report and implement
only the confirmed gaps.

Do not assume a checklist means the code is correct or production-ready.

## 18. Delivery Plan

1.  Repository and database audit.
2.  Permission matrix and route map.
3.  UI flow/wireframes for catalog, issue/return, payments and reports.
4.  Confirm schema/API contracts.
5.  Finish P0 modules and integrity constraints.
6.  Add automated unit/integration/concurrency tests.
7.  Verify public OPAC availability consistency.
8.  Test financial reconciliation and reversals.
9.  Security review, backup/restore drill and staging deployment.
10. UAT, documentation and approved production release.

## 19. Definition of Done

A feature is done only when: - Implementation and reviewed migrations
are committed. - Server-side authorization and validation exist. -
Automated tests cover normal, invalid, failure and concurrency paths as
relevant. - No partial or contradictory transaction state can be
produced. - Reports and receipts reconcile to stored transactions. - UI
loading, empty, error and success states are complete. - Documentation
is updated. - No unresolved critical security/data-integrity issue
remains.
