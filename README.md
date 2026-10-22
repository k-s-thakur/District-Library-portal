# District Library Portal (Smart Library OPAC & Management System)

A modern, full-stack Next.js and Prisma-based District Public Library Management System featuring a Public Online Public Access Catalog (OPAC) and comprehensive Librarian Admin Portal.

---

## 🚀 Features

- **Public OPAC Portal**:
  - Live catalog search by title, author, subject, ISBN, and category.
  - Real-time book availability and copy tracking.
  - Member book reservation and loan history.
- **Librarian & Admin Dashboard**:
  - Member registration, verification, and ID sequence management.
  - Circulation desk: loan issuance, book return, renewal, and overdue fee calculations.
  - Fine collection, receipt generation, and payment allocations.
  - Inventory and catalog management (books, authors, categories, publishers).
  - Role-based access control with secure authentication.
- **Audit & Governance**:
  - Comprehensive audit logging for administrative actions.
  - Built-in acceptance test verification suite.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Database & ORM**: SQLite with [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: JWT & Bcrypt

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm / yarn / pnpm

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/k-s-thakur/District-Library-portal.git
cd District-Library-portal
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
DATABASE_URL="file:./library.db"
JWT_SECRET="your-secure-secret-key"
PORT=3000
```

### 4. Database Setup & Seeding
Push the Prisma schema to generate the SQLite database and seed initial test data:
```bash
npm run db:push
npm run seed
```

### 5. Running the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the acceptance verification tests:
```bash
npm run test:acceptance
```

---

## 📄 License
This project is open-source and available under the MIT License.
