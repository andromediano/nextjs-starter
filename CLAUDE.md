# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production (runs `prisma generate` first)
- `npm start` - Start production server

### Code Quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run lint` - Run ESLint

### Database (Prisma)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply migrations in development
- `npx prisma migrate deploy` - Apply migrations in production
- `npx prisma studio` - Open Prisma Studio database GUI
- `npx prisma db push` - Push schema changes without migrations

Note: Prisma generates client to `src/generated/prisma/client` (custom output path)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **API Layer**: tRPC v11 for type-safe APIs
- **Database**: PostgreSQL via Prisma ORM (configured for Supabase)
- **Authentication**: Better Auth with email/password and Kakao social login
- **State Management**: TanStack Query (React Query) with tRPC integration, Zustand for client state
- **Forms**: React Hook Form with Zod validation
- **UI**: Radix UI + Tailwind CSS v4
- **Theme**: next-themes for dark/light mode

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/[...all]/ # Better Auth handler
│   │   └── trpc/[trpc]/   # tRPC handler
│   ├── signin/            # Sign-in page
│   ├── signup/            # Sign-up page
│   ├── users/             # User management pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Client-side provider composition
├── components/
│   ├── ui/                # shadcn/ui components (Radix + Tailwind)
│   ├── theme-provider.tsx # Theme switching
│   ├── login-form.tsx     # Login form with react-hook-form
│   └── signup-form.tsx    # Signup form with react-hook-form
├── server/
│   ├── trpc.ts           # tRPC initialization and context
│   └── routers/          # tRPC routers
│       ├── index.ts      # Root router (appRouter)
│       └── user.router.ts # User CRUD operations
├── trpc/
│   ├── client.tsx        # tRPC client setup for React components
│   └── server.ts         # tRPC server caller for Server Components
├── lib/
│   ├── prisma.ts         # Prisma Client singleton
│   ├── auth.ts           # Better Auth configuration
│   ├── auth-client.ts    # Better Auth client
│   └── utils.ts          # Utility functions (cn, etc.)
├── schemas/              # Zod validation schemas
│   └── user.schema.ts    # User validation schemas
├── generated/
│   ├── prisma/           # Generated Prisma Client
│   └── zod/              # Auto-generated Zod schemas from Prisma
└── hooks/                # Custom React hooks
    └── use-mobile.ts     # Mobile detection hook
```

### tRPC Architecture

This project uses a **modern tRPC v11 architecture** with separate client and server implementations:

**Server-side (Server Components):**
- Import from `@/trpc/server` to get the `api` caller
- Use in Server Components and Server Actions
- Example: `const users = await api.user.list()`
- Located in `src/trpc/server.ts`

**Client-side (Client Components):**
- Import `useTRPC` hook from `@/trpc/client`
- Wrapped with TanStack Query for caching/mutations
- Example: `const { data } = useTRPC.user.list.useQuery()`
- Located in `src/trpc/client.tsx`

**Creating new routers:**
1. Create router in `src/server/routers/[name].router.ts`
2. Use `publicProcedure` for public endpoints (or create `protectedProcedure` for auth)
3. Register in `src/server/routers/index.ts`
4. Types are automatically available on client via `AppRouter`

### Database & Prisma

**Custom Configuration:**
- Prisma Client output: `src/generated/prisma/client`
- Schema location: `prisma/schema.prisma`
- Import from: `@/generated/prisma/client`
- Connection pooler: Supabase with `pgbouncer=true` in DATABASE_URL

**Important:**
- Use `DATABASE_URL` for queries (connection pooler)
- Use `DIRECT_URL` for migrations (direct connection)
- Prisma generates Zod schemas to `src/generated/zod/` (though custom schemas in `src/schemas/` are preferred for forms)

### Authentication (Better Auth)

- Configuration: `src/lib/auth.ts`
- API route: `src/app/api/auth/[...all]/route.ts`
- Client: `src/lib/auth-client.ts`
- Supports email/password and Kakao OAuth
- Environment variables: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`

### Provider Hierarchy

Providers are composed in `src/app/providers.tsx` in this order (outer to inner):
1. TRPCProvider (TanStack Query + tRPC client)
2. ThemeProvider (dark/light mode)

When adding new providers, consider their dependencies and place them appropriately in this hierarchy.

### Form Validation

- Use React Hook Form + Zod for form handling
- Define schemas in `src/schemas/[model].schema.ts`
- Use `@hookform/resolvers/zod` for integration
- Example: `src/components/signup-form.tsx` and `src/components/login-form.tsx`

### Path Aliases

- `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Always use absolute imports: `import { Button } from "@/components/ui/button"`

### Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string (pooler)
- `DIRECT_URL` - PostgreSQL direct connection (migrations)
- `BETTER_AUTH_SECRET` - Auth secret (generate with `openssl rand -base64 33`)
- `BETTER_AUTH_URL` - App URL
- `KAKAO_CLIENT_ID` and `KAKAO_CLIENT_SECRET` - OAuth credentials
- `NEXT_PUBLIC_URI_*` - Public route URLs

### React Compiler

This project uses the React Compiler (enabled in `next.config.ts`). Be aware that certain patterns may need adjustment for compiler optimization.

### Styling

- Tailwind CSS v4 with custom configuration
- `tailwind-merge` via `cn()` utility for class merging
- UI components from shadcn/ui (Radix UI primitives)
- Dark mode support via `next-themes`
