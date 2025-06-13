# Groei - Garden Management Application

![Groei Logo](apps/frontend/public/brand/logo.webp)

Groei is a self-hosted application designed to help gardeners manage their vegetable gardens. Use it in the garden from
your phone to decide what to plant where, or from your laptop to manage your seed inventory and plan your garden layout.

## Features

- 🌱 **Seed Inventory Management**: Track your seeds, their varieties, and planting schedules
- 🏡 **Garden Bed Planning**: Design and manage your garden beds and layouts
- 📱 **Mobile-First Design**: Optimized for use on phones while in the garden
- 🖥️ **Desktop Management**: Comprehensive management interface for planning and data entry
- 📆 **Planting Calendar**: Schedule your planting based on seasonal requirements
- 📊 **Data Visualization**: Visualize your garden layout and planting history

## Tech Stack

### Frontend

- React with TypeScript
- TanStack Router for routing
- TanStack Query for data fetching
- Zustand for state management
- Tailwind CSS with ShadCN UI components
- Vite for build tooling
- Progressive Web App (PWA) capabilities

### Backend

- Deno runtime
- Hono for API framework
- Drizzle ORM
- SQLite database

### Infrastructure

- NX monorepo with PNPM package management
- GitHub Actions for CI/CD

## Project Structure

```
├── apps/
│   ├── backend/         # Deno Hono API with Drizzle ORM
│   └── frontend/        # React app with TanStack Router
├── libs/
│   └── common/          # Shared types, utilities, and constants
```

## Getting Started

### Prerequisites

- Node.js (v20.11.1 or higher)
- PNPM (v8.14.0 or higher)
- Deno (latest version)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/groei.git
   cd groei
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up the database

   ```bash
   cd apps/backend
   pnpm run db:generate
   pnpm run db:push
   pnpm run db:seed  # Optional: seed with sample data
   ```

4. Start the development environment
   ```bash
   cd ../..  # Return to root directory
   pnpm run dev
   ```

### Building for Production

```bash
pnpm run build
```

### Running in Production

```bash
pnpm start
```

## Development

### Code Standards

- Use functional components with React hooks
- Prefer TypeScript interfaces over types when appropriate
- Follow the established file/folder naming conventions
- Use TanStack Query for data fetching
- SVG icons for vegetables and garden elements

### Common Tasks

- Creating new components in the shared library
- Adding API endpoints on the backend
- Implementing mobile-responsive UI features
- Building data visualization for garden layouts

## License

[Apache License 2.0](LICENSE)

## Author

Janek Ozga (iam@janekozga.nl)
