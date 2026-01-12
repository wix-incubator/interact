# Interact Monorepo

This repository hosts the Interact library, accompanying docs, and any supporting applications. It is structured as an npm workspace-powered monorepo with the following layout:

- `packages/` for publishable libraries (starting with the core Interact library).
- `apps/` for documentation, demos, and future experience-specific frontends.
- Shared root tooling such as TypeScript configs, linting, and scripts.

## Getting Started

### Install dependencies

```bash
npm install
```

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Running demo app

```bash
npm run dev:demo
```

## Running documentation app

```bash
npm run dev:docs
```

## Tooling

- `npm run lint` – runs ESLint across all packages and apps using the shared config.
- `npm run format` – formats the repo with Prettier’s shared settings.
- `npm run format:check` – verifies formatting without writing changes.

-v-1
