## Interact Monorepo Setup Plan

### 1. Define monorepo structure and tooling

- **Root layout**: Use npm workspaces with this high-level layout:
  - `package.json` (workspaces + root scripts)
  - `tsconfig.base.json` (shared compiler options)
  - `tsconfig.json` (root, extends base; primarily for tooling/IDE)
  - `.gitignore`, `README.md`, `LICENSE`
  - `packages/` (library and any future shared packages)
  - `apps/` (docs and demo applications)
- **Workspaces**: Configure npm workspaces in the root `package.json`:
  - `"workspaces": ["packages/*", "apps/*"]`
  - Define root scripts like `dev`, `build`, `lint`, `test` that delegate to workspaces.
- **Tooling stack**:
  - TypeScript for all packages and apps.
  - Vite for bundling the library (library mode) and powering the docs and demo apps.
  - Optionally add ESLint + Prettier at the root with shared config used by all packages.

### 2. Create the core Interact library package

- **Package location and name**:
  - Create `packages/interact/` as the core library.
  - In `packages/interact/package.json`, set name to something like `"@interact/core"` (or `"interact"` if you prefer a single public name).
- **Library entrypoints and source layout**:
  - `packages/interact/src/index.ts` as the main entry, exporting React components and utilities.
  - Subfolders for organization:
    - `src/components/` for React UI components.
    - `src/hooks/` for React hooks.
    - `src/utils/` for non-React TypeScript utilities.
    - `src/styles/` if you plan to include shared styles or design tokens.
- **TypeScript config for the library**:
  - `packages/interact/tsconfig.json` extending `../../tsconfig.base.json`.
  - Configure `compilerOptions` for library output (e.g., `declaration`, `jsx`, `moduleResolution`, `paths` if needed).
- **Vite config in library mode**:
  - `packages/interact/vite.config.ts` configured for library mode with:
    - `build.lib.entry` pointing to `src/index.ts`.
    - `build.lib.name` set to `"Interact"` (UMD/global name, if needed).
    - `build.lib.formats` including `es` and `cjs` (and `umd` if desired).
    - `rollupOptions.external` listing `react`, `react-dom`, and other peer deps.
- **Package metadata and scripts**:
  - Set `main`, `module`, and `types` fields in `package.json` to point at build outputs.
  - Add scripts like `build`, `dev` (for local playground or story-like page), `test`, and `lint`.

### 3. Create the docs app (Vite + React + TS)

- **App location**:
  - Create `apps/docs/` as a Vite React TypeScript app.
- **Base Vite app structure**:
  - `apps/docs/index.html`.
  - `apps/docs/src/main.tsx` as the React entrypoint.
  - `apps/docs/src/App.tsx` as the root component.
  - Subfolders under `src/` such as `components/`, `pages/`, and `routes/` as the docs grow.
- **TypeScript and Vite config**:
  - `apps/docs/tsconfig.json` extending `../../tsconfig.base.json`.
  - `apps/docs/vite.config.ts` configured for React with TS.
- **Workspace wiring to core library**:
  - Add `"@interact/core": "*"` as a dependency in `apps/docs/package.json` so it is resolved through the workspace.
  - Use path aliases in `tsconfig.json` and/or Vite aliases to make imports from the library ergonomic if needed.
- **Docs content scaffolding**:
  - Create basic pages for introduction and component examples, importing components and utilities from `@interact/core`.

### 4. Create the demo app (separate from docs)

- **App location**:
  - Create `apps/demo/` as another Vite React TypeScript app.
- **Structure and purpose**:
  - Similar base structure to `apps/docs` (`index.html`, `src/main.tsx`, `src/App.tsx`).
  - Focus on interactive playgrounds, scenario-specific demos, and performance/UX testing.
- **Config and dependencies**:
  - `apps/demo/tsconfig.json` extending `../../tsconfig.base.json`.
  - `apps/demo/vite.config.ts` for React with TS.
  - `apps/demo/package.json` depending on `"@interact/core": "*`, wired via npm workspaces.

### 5. Shared configuration and developer experience

- **TypeScript base config**:
  - In `tsconfig.base.json`, define common `compilerOptions` (target, module, strict mode, JSX settings, module resolution, etc.).
  - Each package/app `tsconfig.json` extends the base and sets its own `include`, `exclude`, and `references` if you choose to use project references.
- **Optional shared linting/formatting**:
  - Root-level ESLint config (`.eslintrc.cjs` or similar) with React + TypeScript settings.
  - Root-level Prettier config (if desired).
  - Root `lint` script that runs ESLint across `packages` and `apps`.
- **Root npm scripts for workflows**:
  - `dev:docs` and `dev:demo` scripts using `npm run dev --workspace apps/docs` and `apps/demo`.
  - `build` script that builds all packages and apps (e.g., via `npm run build --workspaces` or explicit workspace calls).
  - `test` script that runs tests where present.

### 6. Future enhancements (optional, after initial scaffolding)

- **Build and publish pipeline**:
  - Add a dedicated build tool (e.g., Rollup or tsup) if you outgrow Vite library mode.
  - Configure CI to run `lint`, `test`, and `build` on push.
  - Add publishing scripts (e.g., `npm publish --workspace packages/interact`).
- **Storybook or dedicated playground package**:
  - Optionally introduce a `packages/playground` or Storybook setup if you need more advanced component development tooling.
- **Additional internal packages**:
  - Add shared packages later (e.g., `packages/tokens`, `packages/theme`, `packages/eslint-config`) that all apps and the core library can consume.


