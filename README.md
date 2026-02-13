# Threadmark

[![Netlify Status](https://api.netlify.com/api/v1/badges/c798eb65-db77-4b7a-89b6-48b9694ab7ae/deploy-status)](https://app.netlify.com/projects/threadmark/deploys)

Threadmark is a compliance platform designed to help e-commerce businesses manage audit trails, exports, and regulatory requirements. This monorepo includes landing pages for lead generation and the core application infrastructure.

## Project Structure

This is a monorepo managed with [Turborepo](https://turbo.build/repo) and npm workspaces.

```
threadmark/
├── apps/
│   ├── landing/          # Astro static site for landing pages (Netlify)
│   ├── api/              # API server
│   ├── shopify-admin/    # Shopify admin integration
│   └── worker/           # Background worker
├── packages/
│   ├── db/               # Database schemas and migrations
│   └── shared/           # Shared utilities and types
└── docs/                 # Documentation
```

## Prerequisites

- Node.js >= 18
- npm 11.1.0 (specified in `packageManager`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd threadmark
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start development:
   ```bash
   npm run dev
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Run linting across all packages |
| `npm run test` | Run tests across all packages |
| `npm run typecheck` | Type-check all TypeScript code |
| `npm run clean` | Clean build artifacts |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## Apps

### Landing Pages ([apps/landing](apps/landing))
- **Tech**: Astro (static site generation)
- **Deployment**: Netlify
- **Purpose**: Lead generation with dual-audience approach (EU merchants & mid-market brands)
- **Features**: Waitlist forms, calendar booking integration, responsive design
- **PRD**: [PRD.landing.json](PRD.landing.json)

See the [landing app README](apps/landing/README.md) for detailed setup and deployment instructions.

### API ([apps/api](apps/api))
Backend API server for the Threadmark platform.

### Shopify Admin ([apps/shopify-admin](apps/shopify-admin))
Shopify admin panel integration.

### Worker ([apps/worker](apps/worker))
Background job processing.

## Packages

### Database ([packages/db](packages/db))
Shared database schemas, migrations, and ORM configuration.

### Shared ([packages/shared](packages/shared))
Common utilities, types, and constants used across apps.

## Deployment

### Landing Pages
The landing site is automatically deployed to Netlify on every push to the main branch. Build configuration is managed in [netlify.toml](apps/landing/netlify.toml).

### Other Apps
Deployment instructions for other apps are documented in their respective directories.

## Documentation

- [Main Product PRD](PRD.json) - Core product requirements
- [Landing Pages PRD](PRD.landing.json) - Landing page strategy and requirements
- [Progress Tracker](progress.landing.txt) - Landing page implementation progress

## Contributing

This project follows [Conventional Commits](https://www.conventionalcommits.org/) format. Use prefixes like `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, etc.

```bash
# Format your commits like this:
git commit -m "feat: add new waitlist form validation"
git commit -m "fix: correct responsive layout on mobile"
```

## License

Private project - all rights reserved.
