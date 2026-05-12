# Ethara Project Manager

Welcome to the Ethara Project Manager! This application is designed to help teams organize, manage, and track their projects and tasks efficiently with a robust role-based hierarchy.

## 🚀 Getting Started

Follow these steps to set up the project locally on your device.

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
# Install all dependencies
npm install
```

### 3. Environment Variables Setup

You will need to set up your environment variables, specifically `DATABASE_URL` and `NEXTAUTH_SECRET`. We recommend using [Railway](https://railway.app/) for a quick PostgreSQL database setup.

1. **Create a Railway Account:** Go to [Railway.app](https://railway.app/) and sign up or log in.
2. **Create a New Project:** Click "New Project" and select "Provision PostgreSQL".
3. **Get the Database URL:**
   - Once your database is provisioned, click on the PostgreSQL service.
   - Go to the **Variables** tab.
   - Copy the `DATABASE_URL` value.
4. **Generate NextAuth Secret:**
   - You can generate a strong secret by running `openssl rand -base64 32` in your terminal or by using a secret generator online.
5. **Configure `.env` File:**
   - Create a `.env` file in the root of the project.
   - Add the following variables, replacing the placeholders with your actual values:
     ```env
     DATABASE_URL="your_copied_railway_database_url_here"
     NEXTAUTH_SECRET="your_generated_secret_here"
     NEXTAUTH_URL="http://localhost:3000"
     ```

### 4. Database Initialization

Run the following commands to initialize your Prisma database schema:

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your Railway database
npx prisma db push
```

### 5. Run the Project

Now you can start the development server:

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running!

---

## 👥 Role Hierarchy & Structure

The system uses a strict role-based access control (RBAC) hierarchy to ensure proper delegation and access to projects and organizations. Below is a flowchart showing how the roles interact:

```mermaid
graph TD
    SA((**Superadmin**))
    A1((**Admin**))
    A2((**Admin**))
    M1([Member])
    M2([Member])
    M3([Member])

    SA -->|System-wide access, manages all Organizations & Admins| A1
    SA -->|System-wide access, manages all Organizations & Admins| A2
    
    A1 -->|Manages Organization A, creates Projects & invites Members| M1
    A1 -->|Manages Organization A, creates Projects & invites Members| M2
    
    A2 -->|Manages Organization B, creates Projects & invites Members| M3

    classDef superadmin fill:#f9d0c4,stroke:#333,stroke-width:2px;
    classDef admin fill:#f9f0c4,stroke:#333,stroke-width:2px;
    classDef member fill:#c4e6f9,stroke:#333,stroke-width:2px;
    
    class SA superadmin;
    class A1,A2 admin;
    class M1,M2,M3 member;
```

### Role Descriptions
- **Superadmin:** The highest level of access. They have overarching control of the entire platform, can view all organizations, manage all users, and assign Admins to organizations.
- **Admin:** Manages a specific Organization. They can create projects, manage settings for their organization, and invite/manage Members within their workspace.
- **Member:** The standard user role. They belong to an organization and can view projects they are assigned to, create tasks, move tasks across the Kanban board, and collaborate with their team.

---

## 🛠️ Scripts Overview

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Generates the Prisma client and builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.

---

## 🔑 Demo Accounts

Use the following pre-seeded credentials to explore the application across different permission levels. All accounts use the same password.

Password for all accounts: 123456

Role          | Email              | Access
--------------|--------------------|---------------------------------------------------------------
Superadmin    | j@j.com            | Full platform access — manage all orgs, admins & users (/superadmin)
Admin         | satya@micro.com    | Org-level access — projects, members, task analytics (/dashboard)
Member        | elsa@micro.com     | Standard access — assigned projects & Kanban board
Member        | sam@micro.com      | Standard access — assigned projects & Kanban board

Role Capabilities at a Glance:

- Superadmin (j@j.com)         → Go to /superadmin for the global admin panel.
- Admin (satya@micro.com)      → Go to /dashboard to see Task Analytics (Tasks by Status,
                                  Tasks per User, Overdue Tasks) — hidden from Members.
- Members (elsa, sam @micro.com) → Go to /dashboard to see only their projects & summary stats.
