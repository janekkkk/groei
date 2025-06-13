is project uses NX monorepo using Pnpm. Typescript everywhere. Vite React with Tailwind and ShadCdn on the frontend,
Deno Hono with Drizzle and Sqlite on the backend. Look at the package.json files for more info. The application is used
as a self hosted app, which helps me to manage my garden (mostly vegetables). I use this app in the garden from my
phone (
to choose which seeds to plant where) but also from my laptop mostly to add new seeds.

## Project Structure

- `/apps/frontend`: React app with TanStack Router, React Query, and Zustand for state management
- `/apps/backend`: Deno Hono API with Drizzle ORM for SQLite database
- `/libs/common`: Shared types, utilities, and constants

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
