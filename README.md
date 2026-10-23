# District Library Admin & Staff Portal

Dedicated management system for librarians and administrative staff of the District Public Library System.

---

## 🏛️ Features

- **Circulation Desk**:
  - Issue, return, and renew book loans.
  - Automatic calculation of late fees and fines.
  - Active loan monitoring with quick search by member ID or book accession number.
- **Member Management**:
  - New member registration, profile updates, and verification.
  - Automated member ID sequence generator (`LIB-YYYY-XXXX`).
- **Catalogue & Inventory Control**:
  - Add and edit books, authors, publishers, and categories.
  - Manage individual book copies with accession numbers, physical conditions, and shelf locations.
- **Finance & Fines**:
  - Fine collection, official receipt generation (`REC-YYYY-XXXX`), and payment reversal.
- **Administration & Audit**:
  - Role-based permissions (Head Librarian, Staff, Administrator).
  - Complete immutable audit logging for all administrative events.
  - Custom library circulation and fine policy configuration.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite / PostgreSQL with Prisma ORM
- **Authentication**: JWT with Jose & BcryptJS
- **Styling**: Tailwind CSS & Lucide Icons

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   DATABASE_URL="file:./library.db"
   JWT_SECRET="your-secure-random-secret-key"
   PORT=3001
   ```
3. **Database Setup & Seed**:
   ```bash
   npm run db:push
   npm run seed
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The portal runs at `http://localhost:3001` (redirects to `/login`).

---

## 🧪 Acceptance Tests

```bash
npm run test:acceptance
```
