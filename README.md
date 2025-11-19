# Interact Monorepo

This repository hosts the Interact component system, accompanying docs, and any supporting applications. It is structured as an npm workspace-powered monorepo with the following layout:

- `packages/` for publishable libraries (starting with the core Interact library).
- `apps/` for documentation, demos, and future experience-specific frontends.
- Shared root tooling such as TypeScript configs, linting, and scripts.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run workspace scripts. For example, to run all workspace dev servers once they exist:
   ```bash
   npm run dev
   ```

Workspace-specific scripts (e.g., `apps/docs`, `apps/demo`, `packages/interact`) will be added as those projects are scaffolded.

## Tooling

- `npm run lint` – runs ESLint across all packages and apps using the shared config.
- `npm run format` – formats the repo with Prettier’s shared settings.
- `npm run format:check` – verifies formatting without writing changes.

