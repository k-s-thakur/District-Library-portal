# Coding Agent Prompts --- Smart Library System

Use these prompts after placing the two PRDs in the repository. Run the
audit prompt first. Do not ask the coding agent to rebuild everything in
one pass.

------------------------------------------------------------------------

## Prompt A --- Repository Audit and Implementation Plan

You are the senior engineer responsible for an existing Smart Library
System. Read these documents completely before changing code:

-   `PRD-Public-OPAC.md`
-   `PRD-Librarian-Admin-Portal.md`
-   The existing project PRD and design files, if present.

**First task: audit only. Do not modify files, schema, migrations or
dependencies yet.**

1.  Inspect the repository tree, package manifests, framework versions,
    routing, components, styles, API clients, authentication and
    environment-variable usage.
2.  Inspect all database migrations, schema definitions, RLS policies,
    grants, stored functions and indexes. If database access is
    unavailable, state that limitation explicitly.
3.  Trace the current data path for books, book copies, accession
    numbers, QR identifiers, members, loans, reservations, charges,
    payments, allocations and receipts.
4.  Identify the existing OPAC routes and staff portal routes. Confirm
    whether they share the same backend/database.
5.  Verify the reported implementation status in the source PRD. Treat
    every "completed" item as unverified until you locate code and
    tests.
6.  Run the existing test suite and build/type/lint checks where
    available. Report commands and results.
7.  Identify mock data, hardcoded dashboard statistics, fake success
    states, dead links, duplicate data models, missing authorization and
    unsafe client-side secrets.
8.  Compare implementation against both PRDs and create a gap matrix:
    Requirement ID, current evidence/file, status
    (implemented/partial/missing/uncertain), risk, recommended change,
    test needed.
9.  Propose a phased implementation plan with dependencies and small,
    reviewable commits.
10. Do not invent endpoints or tables where existing ones can be reused.
    Do not run destructive SQL or modify production data.

Deliver: - `implementation-audit.md` - Proposed route/API map - Schema
and permission findings - Test/build baseline - Ordered plan with
explicit risks and unresolved questions

Stop after the report and wait for approval before implementing.

------------------------------------------------------------------------

## Prompt B --- Implement the Public OPAC

You are implementing the public-facing discovery experience for a
government public library. Follow `PRD-Public-OPAC.md` exactly and use
the approved design direction: modern, editorial, book-cover-led,
responsive, accessible and search-first, inspired by the browsing
patterns in the provided ManyBooks screenshots without copying its
branding or content.

### Mandatory workflow

1.  Read the PRD and `implementation-audit.md`.
2.  Inspect existing routes, components, API client and catalog schema
    before editing.
3.  Reuse the authoritative backend and existing data model. Do not
    create a second catalog database.
4.  Make a short plan, then implement in small increments.
5.  Keep existing working features intact; avoid broad refactors
    unrelated to the OPAC.
6.  Never use hardcoded demo books or fake availability in production.
    If mock fixtures are required for tests, isolate them from
    production.
7.  Do not expose private member, payment, staff, audit or QR-secret
    data in public API responses.

### Required UI

-   Responsive header with library identity, Discover menu, prominent
    search, and member login link.
-   Homepage with a search-led hero, data-driven curated book sections,
    visual category tiles and library information.
-   Search results with query, result count, filters, sorting,
    pagination, URL-persisted state, clear filters, loading/empty/error
    states.
-   Book detail page with bibliographic metadata, cover fallback, actual
    copy-availability summary and shelf/location when approved.
-   All-categories page and category result pages.
-   Accessible mobile navigation; keyboard-operable menu and forms.
-   No prices, ebook downloads, online reading or fake reviews unless
    separately approved and backed by real rights-cleared functionality.

### Data correctness

-   One bibliographic title may have many physical copies.
-   Availability must come from the backend's copy/loan state and
    approved policy.
-   If availability cannot be confirmed, display "Availability unknown",
    not "Available".
-   Never expose raw QR tokens or internal database IDs.
-   Use existing API endpoints where possible. If an endpoint is
    missing, document the proposed contract and implement it only within
    the approved backend architecture.
-   Use real catalog data and meaningful empty states; do not substitute
    fake content when the API fails.

### Completion requirements

-   Build/type/lint checks pass where available.
-   Add tests for search/filter behavior, availability mapping,
    empty/error states and public data privacy.
-   Test mobile layout, keyboard navigation and accessible labels.
-   Report changed files, routes, API assumptions, tests run and
    remaining gaps.
-   Do not claim completion if any key action is a placeholder.

------------------------------------------------------------------------

## Prompt C --- Implement the Librarian/Admin Portal

You are the senior full-stack engineer implementing the internal staff
portal described in `PRD-Librarian-Admin-Portal.md`.

### Mandatory workflow

1.  Read the PRD and `implementation-audit.md`.
2.  Inspect existing code, schema, migrations, RLS, API permissions and
    transaction functions.
3.  Preserve the current stack and established architecture unless the
    audit identifies a concrete blocker.
4.  Do not rebuild completed modules blindly. Implement confirmed gaps
    in small, reviewable increments.
5.  Never apply destructive migrations or modify production data without
    explicit approval and a tested rollback plan.
6.  Do not put secrets or privileged database credentials in frontend
    code.

### Required modules

-   Role-aware dashboard using live data.
-   Catalog, authors, publishers, categories, classification and
    physical copies.
-   Accession register, QR label generation and print flow.
-   Member directory, registration, renewal and status.
-   Issue, return, renew and reservation workflows with manual accession
    fallback.
-   Charges/fines, manual payments, allocations, receipts and controlled
    reversals.
-   Operational and finance reports with permission-aware exports.
-   Staff/role management, policy settings and audit views restricted by
    permission.

### Integrity is more important than visual success

-   Enforce permissions on the server/API/database, not only by hiding
    UI controls.
-   Use database transactions and appropriate row locks for
    issue/return/payment operations.
-   Enforce one active loan per physical copy.
-   Enforce unique accession number, QR identifier and receipt number.
-   Use decimal-safe money types.
-   Make payment posting idempotent.
-   Payment + allocations + receipt number + receipt + audit event must
    commit atomically.
-   A failed receipt step must roll back the payment transaction.
-   Reversal must be an authorized compensating transaction; never
    delete original financial history.
-   Validate all imports before committing; provide row-level errors.
-   Do not show a success toast before the server confirms the
    transaction committed.

### Required tests

Include tests for: - Role denial and direct URL/API access. - Duplicate
accession and QR identifiers. - Two simultaneous attempts to issue the
same copy. - Expired/suspended member and ineligible copy. - Fine
calculation under the applicable policy. - Partial payment and
invalid/over-allocation. - Repeated idempotency key. -
Receipt-generation failure rollback. - Concurrent receipt-number
generation. - Unauthorized and duplicate reversal. - Import validation
and report reconciliation.

### Completion report

Summarize: - Files and migrations changed. - Requirements completed and
still missing. - Permission and transaction behavior. - Tests run and
their results. - Manual staging/UAT steps. - Any schema/API assumptions
requiring approval.

Do not report a feature as complete if it lacks tests for its key
integrity rules.

------------------------------------------------------------------------

## Prompt D --- Final QA and Release Gate

Act as an independent QA/security reviewer. Do not add features unless a
defect requires a minimal fix.

1.  Compare implementation with both PRDs and the approved audit/gap
    matrix.
2.  Run build, type checks, lint, unit/integration tests and available
    end-to-end tests.
3.  Verify public OPAC endpoints cannot return private member,
    financial, staff or audit data.
4.  Verify every staff API enforces role permissions server-side.
5.  Test copy/loan consistency under concurrent issue/return requests.
6.  Test payment idempotency, atomic allocation, receipt uniqueness,
    rollback and reversal auditability.
7.  Verify dashboard counts and reports derive from the database, not
    hardcoded values.
8.  Verify loading, empty, validation, permission-denied,
    network-failure and retry states.
9.  Test responsive behavior, keyboard-only operation, visible focus and
    accessible form errors.
10. Check for secrets in frontend bundles and repository, unsafe SQL,
    unreviewed migrations and destructive operations.
11. Confirm backup restoration in a non-production environment and
    document results.
12. Produce `release-readiness-report.md` with PASS/FAIL/NOT TESTED for
    each requirement, evidence, severity, owner and next action.

Do not recommend production release if critical security, privacy,
financial-integrity, backup/restore or UAT gates are unverified or
failing.
