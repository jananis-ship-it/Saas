# Taskflow – Team Task Manager

Minimal SaaS app for tracking **projects** and **tasks** in **workspaces**. Built with Next.js 14+ (App Router), TypeScript, Tailwind, shadcn/ui, React Hook Form + Zod, Clerk, and Prisma.

- **Core users:** Small teams and project managers  
- **Jobs to be done:**  
  - Track tasks and deadlines in one place  
  - Collaborate in workspaces with clear roles  
  - See activity and stay in sync  

---

## Prerequisites

- Node.js 18+
- npm or pnpm

## Install

```bash
npm install
```

## Environment variables

Copy the example env and set your keys:

```bash
cp .env.example .env
```

Edit `.env` with **real** values (placeholders will break build and runtime):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite: `file:./dev.db` (or Postgres URL for production) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From [Clerk Dashboard](https://dashboard.clerk.com) (required for build) |
| `CLERK_SECRET_KEY` | From Clerk Dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/onboarding` |

## Database

Generate Prisma client, create DB, and (optional) seed:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

- **Migrate (with history):** `npm run db:migrate`  
- **Open Prisma Studio:** `npm run db:studio`  

To switch to **Postgres**, change `provider` in `prisma/schema.prisma` to `postgresql` and set `DATABASE_URL` to your Postgres connection string.

## Run dev

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up to create an account, complete onboarding (create a workspace or skip), then use Projects and Tasks.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema (no migrations) |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright e2e tests |

## Tests

- **Unit (Vitest):** `npm run test`  
- **E2E (Playwright):** `npm run test:e2e` (starts dev server and runs tests)

## Project structure (high level)

```
app/
  page.tsx                 # Marketing landing (public)
  sign-in/[[...sign-in]]/   # Clerk sign-in
  sign-up/[[...sign-up]]/   # Clerk sign-up
  (app)/                    # Protected app
    layout.tsx              # AppShell, auth, workspaces
    dashboard/
    onboarding/
    w/[workspaceId]/        # Workspace-scoped
      projects/             # CRUD + list with search/sort/pagination
      projects/[id]/        # Detail + tasks
      projects/[id]/tasks/
    activity/
    settings/
    help/
actions/                    # Server actions (projects, tasks, workspaces, etc.)
components/
  app/                      # AppShell, Sidebar, Topbar, PageHeader, SectionCard, etc.
  ui/                       # shadcn components
lib/                        # db, auth, workspace, validations
prisma/
  schema.prisma
  seed.ts
tests/
  e2e/
  unit/
```

## Auth & multi-tenant

- **Auth:** Clerk (sign up, sign in, sign out, email verification). User record is synced in DB on first load.  
- **Workspaces:** Each workspace has members with roles (Owner, Admin, Member). All projects and tasks are scoped to a workspace.  
- **Authorization:** Server actions and layouts check membership and roles before mutating or rendering.

## License

Private / MIT as needed.
