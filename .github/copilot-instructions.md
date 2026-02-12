This project uses NX monorepo with Pnpm and TypeScript everywhere. Vite React with Tailwind and ShadCN on the frontend, Deno Hono with Drizzle and SQLite on the backend. Look at the package.json files for more info. The application is a self-hosted app that helps manage a garden (mostly vegetables). It's used on mobile in the garden to choose which seeds to plant where, and on laptop to add new seeds.

## Project Structure

- `/apps/frontend`: React app with TanStack Router, React Query, and Zustand for state management
- `/apps/backend`: Deno Hono API with Drizzle ORM for SQLite database
- `/libs/common`: Shared types, utilities, and constants

## Development Workflow

### Available Scripts

- `pnpm dev` - Start development servers for all apps
- `pnpm build` - Build all apps
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Biome
- `pnpm type-check` - Run TypeScript type checking on all projects
- `pnpm lint:all` - Run NX affected lint task

### Code Quality Tools

- **Biome**: Linting and formatting configured via biome.json
- **TypeScript**: Strict type checking enabled
- **lint-staged**: Automatically formats and lints staged files before commit using Husky pre-commit hooks
- **Prettier**: Formats JSON, Markdown, and YAML files

### Pre-commit Hooks

- Automatically runs Biome format and lint on staged JS/TS files
- Runs TypeScript type checking via NX on staged TypeScript files
- Runs Prettier on staged JSON/Markdown/YAML files
- Prevents commits with formatting or type errors

### CI/CD Pipeline

- GitHub Actions runs on push to main and all pull requests
- Runs `pnpm exec nx affected -t lint typecheck build`
- Validates affected projects with linting, type checking, and builds

## Design System

We use Tailwind CSS with ShadCN UI components for a consistent look and feel across the application.

## Features

- Garden planning and management
- Seed inventory tracking
- Planting calendar and scheduling
- Mobile-first responsive design for field use

## Code Preferences

- Use functional components with React hooks
- Prefer TypeScript interfaces over types when appropriate
- Use TanStack Query for data fetching
- Follow the file/folder naming conventions established in the project
- SVG icons are used for vegetables and garden elements

## Common Tasks

- Creating new components in the shared library
- Adding API endpoints on the backend
- Implementing mobile-responsive UI features
- Building data visualization for garden layouts

## Backend Architecture

### API Structure (Deno/Hono)

- Routes defined in `/apps/backend/api/` with pattern: `*Route.ts` (e.g., `bedRoute.ts`, `seedRoute.ts`)
- Hono router with middleware-based request handling
- Database access via Drizzle ORM with `/apps/backend/db/schema.ts` defining table structures
- Main API entry point: `/apps/backend/app.ts`
- Database migrations tracked in `/apps/backend/db/meta/`

### Database (SQLite + Drizzle)

- Main entities: Users, Seeds, Beds, GridItems
- Schema defined in `apps/backend/db/schema.ts`
- Migrations stored as JSON snapshots in `apps/backend/db/meta/`
- Use Drizzle for all database operations - avoid raw SQL
- Always define TypeScript types alongside schema

### Import Mappings

- Deno uses `deno.json` import maps for npm packages: `@libsql/client`, `drizzle-orm`, `dotenv`, `hono`
- Backend files import with `.ts` extensions (required by Deno)

## Frontend Architecture

### State Management (Zustand + IndexedDB)

- Stores located in feature folders (e.g., `src/features/Seeds/seeds.store.ts`)
- Use IndexedDB for persistent storage via `src/core/store/indexedDbStorage.ts`
- Stores export hooks for component usage
- Synchronize server state with Zustand stores after API calls

### Data Fetching (TanStack Query)

- Service files handle API communication (e.g., `seed.service.ts`, `bed.service.ts`)
- Custom hooks for queries (e.g., `useSeedQuery.ts` patterns)
- Integrate with React Query for caching and synchronization

### Routing (TanStack Router)

- Routes defined in `src/routes/` with file-based routing
- Route tree auto-generated in `src/routeTree.gen.ts`
- Use `$paramName.tsx` for dynamic segments (e.g., `$bedId.tsx`)
- Main layout in `src/core/layouts/main.layout.tsx`

### SVG Icon System

- Custom vegetable/garden icons in `src/assets/icons/vegetables/vegetableSvgIcons.tsx`
- Icon mapping logic in `src/assets/icons/vegetables/vegetableIcons.ts`
- Add new icons by:
  1. Creating SVG component in `vegetableSvgIcons.tsx` (use `currentColor` for theming)
  2. Adding mapping in `vegetableIcons.ts` for seed type lookup
  3. Using `getVegetableIcon()` function in components
- Icons use stroke-based design with opacity layering for polish

## Common Patterns

### Error Handling

- Backend: Use Hono error middleware and proper HTTP status codes
- Frontend: Catch errors in service calls and display via toast notifications
- Type errors caught by strict TypeScript - no `any` unless necessary with `biome-ignore`

### Data Fetching Flow

1. Service calls API endpoint (e.g., `seedService.getSeeds()`)
2. Returns typed response from shared types
3. Component uses TanStack Query hook to manage loading/error states
4. Update Zustand store after successful fetch
5. Display data or error UI based on query state

### Responsive Design

- Mobile-first approach using Tailwind utilities
- Use `hidden group-hover:flex` for desktop hover interactions
- Use custom hooks like `use-mobile.tsx` for mobile detection
- Test on actual mobile devices for garden use case

## Key Dependencies & Versions

- **Frontend**: React 19, Vite, Tailwind CSS, ShadCN/UI, TanStack Query/Router, Zustand
- **Backend**: Deno runtime, Hono, Drizzle ORM 0.45.1, LibSQL
- **Monorepo**: NX 22.5.0, pnpm 8.14.0
- **Quality**: Biome 2.3.14, TypeScript 5.9.3

## Development Troubleshooting

### TypeScript Errors in lint-staged

- `pnpm type-check` runs full type checking; pre-commit runs NX's `typecheck` target with `--verbose --no-cloud`
- If type errors appear during commit, run `pnpm type-check` to see full error details
- Different projects have different TypeScript configs - this is intentional

### Import Resolution Issues

- Frontend uses path aliases via `tsconfig.json` (e.g., `@/components`)
- Backend uses Deno import maps from `deno.json`
- Common types from `/libs/common` are published separately

### Mobile Testing

- Use device browser dev tools for mobile-specific issues
- Test swipe interactions with `use-swipe.hook.ts` on actual touch devices
- Remember: users access this in the garden while holding plants!
