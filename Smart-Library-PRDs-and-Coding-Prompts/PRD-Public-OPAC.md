# PRD 1 --- Smart Library Public OPAC & Discovery Website

**Version:** 1.0\
**Status:** Ready for UX design and implementation planning\
**Product:** Government Public Library Management System --- Public
OPAC\
**Primary audience:** Citizens, students, researchers, readers\
**Related document:** `PRD-Librarian-Admin-Portal.md`

------------------------------------------------------------------------

## 1. Executive Summary

Build a modern, responsive public library discovery website inspired by
the **content hierarchy and visual browsing patterns** of ManyBooks: a
prominent search experience, curated book rows, visual genre/category
tiles, editor-style collections, and a Discover menu. The product is a
**catalogue for physical library holdings**, not an ebook store.

Visitors must be able to discover a title, inspect bibliographic
details, see real copy availability, identify its shelf/location and
accession information where appropriate, and understand what to do next.
Public users must never see private member data, staff-only records,
payment details, or internal audit information.

The public OPAC and staff portal will be separate frontends and
deployment entry points, but they must use the same authoritative
backend and database. Availability displayed in the OPAC must come from
the actual copy/loan records, not manually maintained homepage content.

## 2. Product Vision and Design Direction

### 2.1 Experience goal

Make the library feel like a welcoming place to explore ideas, while
preserving the clarity and trustworthiness expected of a government
public service.

### 2.2 Reference-site analysis

The supplied ManyBooks screenshots and current public site demonstrate
these reusable patterns:

-   A visible global search field with title/author/keyword intent.
-   A Discover navigation menu with genres and resource links.
-   A visually rich "Browse Genres" grid.
-   Curated rows such as editor's choice, trending/popular titles, and
    classics.
-   A dedicated all-genres page with a simple category list.
-   Book-cover imagery and clear section headings that encourage
    browsing.

Reference: https://manybooks.net/ and https://manybooks.net/categories

**Do not copy ManyBooks branding, text, book data, or proprietary
artwork.** Borrow interaction patterns, not the site's identity.
ManyBooks focuses on downloadable/online ebooks; this product focuses
primarily on the library's actual physical collection. Do not display
"Read online", "Download", prices, or ebook availability unless a
separate, rights-cleared digital collection is explicitly implemented.

### 2.3 Visual direction

Use an editorial library aesthetic rather than a generic admin-template
look:

-   A compact brand header and clear search-first hierarchy.
-   Book-cover cards with consistent image ratios and restrained
    metadata.
-   Category tiles using approved/licensed imagery or generated abstract
    illustrations.
-   Generous whitespace, visible focus states, calm surfaces and clear
    status labels.
-   A restrained teal/coral accent system inspired by the supplied
    screenshots, adapted to the library's official identity.
-   Optional warm neutral surfaces may be used selectively; **do not
    apply the HomeNest real-estate design system wholesale**. Its
    brown/cream/sage palette, house-listing card conventions and
    real-estate-specific content do not match a public library product.
-   Responsive desktop, tablet and mobile layouts. Do not rely on
    hover-only navigation.

### 2.4 Design principles

1.  Search before decoration.
2.  Availability and shelf location must be easy to find.
3.  Use authentic catalog data; never invent cover, author, rating,
    review, or stock information.
4.  A missing cover must use a designed placeholder, not a broken-image
    icon.
5.  Use accessible contrast, keyboard navigation, semantic headings and
    screen-reader labels.
6.  Keep public browsing open without sign-in. Sign-in is required only
    for member-specific actions.
7.  Distinguish "title" from "physical copy": one title may have many
    accessioned copies.

## 3. Goals and Non-Goals

### 3.1 Goals

-   Let a visitor search without signing in.
-   Find books by title, author, ISBN, subject, publisher, language,
    category and DDC classification.
-   Filter results by actual availability and relevant bibliographic
    fields.
-   Explain whether a title has available, issued, reference-only, lost,
    damaged or otherwise unavailable copies.
-   Show exact shelf/rack location when it exists in the catalog.
-   Help users discover books through curated homepage sections and
    category pages.
-   Provide library timings, address, membership rules, contact
    information and borrowing guidance.
-   Provide a safe path to member sign-in and eligible reservation
    features, if enabled by policy.

### 3.2 Non-goals for MVP

-   Ebook hosting, online reading, downloads, DRM or ebook purchases.
-   Public access to borrowing histories, member contact details, fines
    or payments.
-   AI recommendations, chatbots, social feeds, ratings/reviews,
    gamification or book clubs.
-   RFID hardware integration.
-   Public self-checkout or issuing/returning books without staff.
-   Multi-branch discovery unless the single-library scope changes.
-   Promising a reservation unless the authenticated reservation
    workflow confirms it.

## 4. Users and Core Jobs

  -----------------------------------------------------------------------
  User                                Job to be done
  ----------------------------------- -----------------------------------
  First-time visitor                  Search a book and understand
                                      whether it is available

  Student                             Find books by subject, language,
                                      class/level or topic

  Reader                              Browse genres, popular titles and
                                      curated collections

  Researcher                          Find exact editions, authors, ISBNs
                                      and classification details

  Registered member                   View own loans/dues and reserve
                                      eligible books after authentication

  Library staff                       Use the public listing as the
                                      public-facing view of authoritative
                                      catalog records
  -----------------------------------------------------------------------

## 5. Information Architecture

### 5.1 Primary navigation

-   Home
-   Discover (menu)
    -   Browse all categories
    -   Popular categories
    -   New additions (only if acquisition dates support it)
    -   Recently added titles
    -   Subject / DDC browse
-   About the Library
-   Membership & Rules
-   Visit / Timings / Contact
-   Member Login

The navigation may include "Authors", "Languages" and "Subjects" only
when those routes have meaningful data and are implemented. Do not
expose dead links.

### 5.2 Required routes

-   `/` --- Home
-   `/search?q=...` --- Search results
-   `/books/:bookId` --- Book detail
-   `/categories` --- All categories
-   `/categories/:slug` --- Category results
-   `/authors/:authorId` --- Author detail and associated titles, if in
    MVP
-   `/subjects/:slug` --- Subject/DDC browsing, if in MVP
-   `/library-information` --- About, rules, timings, address and
    contact
-   `/login` --- Member login entry point or redirect to the approved
    authentication route
-   `/account` --- Authenticated member area, if included in this
    release

## 6. Homepage Requirements

### 6.1 Header

-   Library logo/name.
-   "Discover" menu with click/tap and keyboard support.
-   Global search field with placeholder such as "Search by title,
    author, ISBN or subject".
-   Search submit button and accessible label.
-   Member sign-in link.
-   Mobile navigation that remains usable at narrow widths.

### 6.2 Hero / primary search

-   Short library-focused headline and one sentence explaining that the
    visitor can search the physical collection.
-   Search field is the dominant action.
-   Optional secondary link: "Browse all books" or "Browse categories".
-   Avoid fake promotional claims, invented collection counts or claims
    such as "50,000 books" unless computed from verified data.

### 6.3 Featured sections

Each section must be driven by data or explicit librarian/admin
curation:

-   Recently added (based on acquisition/catalogue date).
-   Popular / frequently borrowed (only if reliable circulation data and
    approved public reporting rules exist).
-   Staff picks / Editor's choice (requires a curated flag and
    authorized editing workflow).
-   Browse categories (visual tiles).
-   Subject / language browse (optional, only when useful data exists).
-   Library information and visit details.

If a section has no records, hide it or show a purposeful empty state.
Do not insert hard-coded demo books in production.

### 6.4 Book card

Display: - Cover or fallback image. - Title. - Primary author(s), with
overflow handling. - Publication year or edition when useful and
available. - Short status: "Available", "All copies currently issued",
"Reference only", or "Availability unknown". - Click target to book
detail.

Do not show user ratings, prices, discounts or download actions unless a
future approved feature requires them.

## 7. Search and Results

### 7.1 Search fields

Search must support: - Title and subtitle. - Author name. - ISBN (with
normalized punctuation where applicable). - Subject/category. -
Publisher. - Language. - DDC classification. - Accession number as a
direct lookup where permitted for public discovery.

Support English and Hindi labels where required. Search matching should
account for case and harmless whitespace differences. Romanized Hindi
and Devanagari cross-script matching are **not guaranteed** unless the
catalog stores normalized/alternate-script metadata and implementation
explicitly supports it.

### 7.2 Results UI

-   Show the submitted query and total result count.
-   Filters: category, author, language, publication year, DDC range and
    availability.
-   Sorting: relevance (default), title A--Z, author A--Z, newest added
    where supported.
-   Pagination or accessible "Load more"; use one consistent pattern.
-   Preserve filters and query in URL parameters so results can be
    shared and browser back works.
-   Provide "Clear filters".
-   Provide loading, empty, error and retry states.
-   Do not leak private records through search responses.

### 7.3 Search behavior acceptance criteria

-   Empty query submitted: remain on the page and show a helpful prompt;
    do not send an unbounded request.
-   No results: show the query, explain no match was found, offer
    spelling/alternate-search guidance and clear filters.
-   Backend unavailable: show a non-technical message and retry action;
    do not show fake results.
-   Query contains unusual characters: safely validate/escape input and
    return a controlled response.
-   Search result availability must be computed from copy status and
    active loans according to the approved policy.
-   A title with multiple copies is one bibliographic result with a copy
    summary, not duplicated title cards by default.

## 8. Book Detail Page

Display the following when present: - Title and subtitle. - Author(s). -
Edition, publication year, publisher and ISBN. - Language,
category/subject and DDC classification. - Description/summary, if
entered and approved. - Cover image or placeholder. - Total copies and
availability summary. - Shelf/rack/location code for available copies
when safe and maintained. - Copy status summary; do not expose internal
notes or staff names. - Library membership and borrowing guidance. -
Reservation action only for authenticated members and only when
reservation policy allows it.

Accession numbers should be displayed publicly only if the library
chooses to expose them. If displayed, show only identifiers needed to
help staff locate the copy; never expose QR secret tokens or internal
database IDs.

### Availability definitions

-   **Available:** at least one lendable copy is eligible for issue.
-   **Currently issued:** all lendable copies are on active loan.
-   **Reference only:** copies exist but are not eligible for borrowing.
-   **Unavailable:** no copy can currently be borrowed due to
    status/policy.
-   **Availability unknown:** API or inventory data cannot reliably
    establish status; never infer "Available".

## 9. Category and Browse Pages

### `/categories`

-   Page title and short explanation.
-   Search/filter categories when the category list is long.
-   Responsive grid or two-column text list depending on density.
-   Category name, optional approved image/illustration, and title count
    only if count is accurate.
-   Categories sorted by configured display order or alphabetically.

### `/categories/:slug`

-   Category name and description when available.
-   Search results pre-filtered to the category.
-   Standard result filters and sorting.
-   Clear route back to all categories.

Do not force fiction genres onto a government library catalog if the
actual taxonomy is based on subjects, DDC, language or collection type.
Support configurable category tiles and a full taxonomy listing.

## 10. Member Actions (Optional MVP Gate)

If member accounts are enabled: - Login/logout through the approved
authentication system. - View own active loans, due dates and
outstanding dues. - Reserve an eligible title if policy allows. - Show
reservation status and cancellation eligibility. - Never allow a user to
query another member's account by changing a URL or request parameter.

If authentication or reservation backend is not ready, show a clear
"Member services coming soon" or direct users to the official library
desk; do not fake a successful reservation.

## 11. Data and API Contract

The OPAC must consume the existing authoritative backend. It must not
create a separate catalog database or maintain a second copy of
availability state.

Suggested read endpoints (adapt to existing backend; do not create
duplicates without inspecting the repository): -
`GET /api/public/catalog/search?q=&category=&author=&language=&available=&page=` -
`GET /api/public/catalog/books/:bookId` -
`GET /api/public/catalog/categories` -
`GET /api/public/catalog/categories/:slug` -
`GET /api/public/library-information` - Optional authenticated endpoints
for member loans/reservations.

A public response may include only published bibliographic fields and a
safe availability summary. Never return member IDs, private contact
data, payment records, internal staff notes, security tokens or audit
logs.

### Canonical data model

Follow the existing PRD's separation: - `books`: bibliographic record. -
`book_authors`: many-to-many author mapping. - `book_copies`: physical
copy with accession number, QR token, shelf/location and status. -
`loans`: active and historical circulation. - `categories` and related
subject/classification metadata.

Do not treat the book title row as an individual physical copy. Do not
calculate availability from stale UI state.

## 12. Non-Functional Requirements

-   Performance target: common catalogue searches should meet the
    existing PRD target of **under 2 seconds at the 95th percentile
    under an agreed test load**. Confirm test volume before production.
-   Responsive layout: usable at 360px mobile width and up.
-   Accessibility: target WCAG 2.2 AA where practical; keyboard
    operation, visible focus, semantic structure, text alternatives and
    accessible form errors.
-   Security: HTTPS in production, server-side validation, safe output
    rendering, rate limits for public search and no secrets in frontend
    code.
-   Privacy: public endpoints return only published catalog information.
-   Reliability: show honest loading/error/unknown availability states;
    never silently substitute mock data.
-   Localization: support English and Hindi UI labels where required;
    content language must reflect stored metadata.
-   SEO: meaningful page titles, descriptions and shareable URLs; avoid
    indexing private/member pages.
-   Browser support: current stable desktop and mobile browsers agreed
    by the project owner.

## 13. Analytics and Success Metrics

Instrument privacy-conscious events: - Search submitted. - Search
returned results / zero results. - Filter applied. - Book detail
opened. - Category opened. - Member-login action selected. - Reservation
started/completed (if enabled).

Initial targets must be baselined after pilot use. Proposed launch
measures: - At least 90% of test users can find a known title and locate
its availability without assistance in moderated UAT. - 100% of
displayed availability states in acceptance tests match backend
copy/loan state. - Zero public API responses expose private member or
financial fields. - Record search latency and zero-result rate for the
first 30 days, then set evidence-based improvement targets.

## 14. Error, Empty and Edge States

Design and implement: - Loading skeletons that do not shift the page
excessively. - No search query. - No matching titles. - Missing cover. -
Missing optional metadata. - Unknown availability. - Backend/network
failure. - Category with zero published titles. -
Invalid/deleted/unpublished book URL. - Session expired during a member
action. - Reservation not allowed, title not reservable or reservation
race condition. - Mobile menu open/closed and keyboard focus behavior.

## 15. Acceptance Criteria

1.  A visitor can search the catalog without logging in.
2.  Search by title, author and ISBN returns matching published records.
3.  Filters can be combined, cleared and preserved in the URL.
4.  A book detail page shows bibliographic data and real availability.
5.  Availability cannot be marked available when no lendable copy is
    eligible.
6.  A title with multiple copies displays one title result and an
    accurate copy summary.
7.  Category cards and Discover links lead to working routes.
8.  Missing cover/metadata and zero-result/error states are
    intentionally designed.
9.  Public API responses do not expose private member, payment,
    staff-only or audit fields.
10. Mobile, keyboard and screen-reader checks pass the agreed
    accessibility review.
11. No fabricated sample data appears in production mode.
12. Any reservation action requires authenticated server-side
    eligibility validation.

## 16. Dependencies, Assumptions and Risks

### Dependencies

-   Existing backend and database schema.
-   Published/public catalog fields and safe availability API.
-   Official library name, logo, address, timings, rules and contact
    information.
-   Approved cover images/category art and usage rights.
-   Authentication and reservation service if member features are
    enabled.

### Assumptions to verify

-   Current application already has catalog and availability endpoints
    or can safely expose them.
-   The library has permission to publish book metadata and cover art.
-   The institution will approve the public fields and whether accession
    number/shelf data are shown.
-   "Popular" means a measurable, approved signal; otherwise use curated
    or recently added content.

### Risks and mitigations

-   **Stale availability:** calculate server-side from copies and loans;
    use cache invalidation or short TTL.
-   **Wrong taxonomy:** use configurable catalog categories rather than
    blindly copying ebook genres.
-   **Design without content:** define empty states and use only real
    data.
-   **Split frontend drift:** keep a single API contract and shared
    design tokens where appropriate.
-   **Cross-script search expectations:** document metadata limitations
    and test Hindi/English catalog records.

## 17. Delivery Plan

1.  Audit repository, schema, routes and existing API.
2.  Approve OPAC sitemap, visual direction and responsive wireframes.
3.  Define the safe public API contract.
4.  Implement shared header/search and the homepage.
5.  Implement search results, filters and book detail.
6.  Implement categories and library information pages.
7.  Add optional member actions only after auth/reservation validation.
8.  Run accessibility, security, responsive and availability correctness
    tests.
9.  Conduct citizen/student UAT with realistic catalog records.
10. Release behind a staged deployment and monitor search/availability
    errors.

## 18. Implementation Guardrails

-   Do not rewrite the backend or database just to match a frontend
    design.
-   Do not use mock arrays as a substitute for API integration.
-   Do not claim the OPAC is an ebook reader.
-   Do not add AI, RFID, recommendation engines or social features to
    the MVP without explicit approval.
-   Inspect the existing repository before choosing component libraries,
    routes, API names or migrations.
-   Preserve existing working features and schema; make additive,
    reviewed changes only.
-   Every visible action must work or be clearly disabled/labelled as
    unavailable.
