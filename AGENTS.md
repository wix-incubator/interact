# AGENTS.md

Declarative web animation library — trigger-based interactions using the Web Animations API.

## Commands

- **Install**: `yarn install` (Yarn 4 via Corepack)
- **Build**: `yarn build` (topological — packages first, then apps)
- **Test**: `yarn test` (runs Vitest across all packages)
- **Lint**: `yarn lint` (ESLint, zero warnings allowed)
- **Format**: `yarn format` (Prettier) / `yarn format:check`
- **Dev docs**: `yarn dev:docs`
- **Dev demo**: `yarn dev:demo`
- **Single workspace**: `yarn workspace @wix/<name> <script>`

## Tech Stack

- TypeScript 5.9 (strict mode), Vite 7 (library mode, dual CJS/ESM), Vitest 4
- React 18 (optional peer dep in `@wix/interact`)
- Package manager: Yarn 4.10.3
- Node: >=18

## Structure

| Path | What it is |
|------|-----------|
| `packages/interact/` | Core interaction library (`@wix/interact`) — triggers, handlers, React/Web Components |
| `packages/motion/` | Animation engine (`@wix/motion`) — Web Animations API wrapper |
| `packages/motion-presets/` | 82+ animation presets for `@wix/motion` |
| `apps/demo/` | Demo app (Vite + React) |
| `apps/docs/` | Documentation site (Vite + React + React Router) |
| `packages/interact/rules/` | **Library interaction rules** (markdown specs for triggers) — NOT AI/cursor rules |
| `packages/interact/dev/` | Internal spec/plan documents — not shipped code |
| `packages/interact/docs/` | Package API docs, guides, and examples |

## Conventions

- Use `fastdom` for all DOM reads/writes in animation code — never raw DOM access
- Use `??` for default values, not `||` (falsy values like `0` are valid in animation params)
- Never mutate function parameters — create copies when modifications are needed
- Prefer `export *` for barrel re-exports; be explicit about default vs named exports
- Update doc examples when changing implementation — reviewers catch stale docs
- Commit messages: `<type>(<scope>): <description>` — types: feat, fix, docs, refactor, test, chore — scopes: interact, motion, docs, demo
- Tests go in `packages/*/test/` as `*.spec.ts` / `*.spec.tsx`

## Boundaries

**Always:**
- Run `yarn build && yarn test && yarn lint` before committing
- Add tests for new functions/features — reviewers always request this
- Keep PRs focused on one logical change

**Ask first:**
- Before adding new dependencies
- Before architectural changes or new APIs

**Never:**
- Edit `dist/` directories — they are build output
- Confuse `packages/interact/rules/` with AI rules — those are library interaction rule specs
- Import between apps — packages are the shared layer

## Documentation Index

| Doc | Contents |
|-----|----------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Dev setup, PR process, code standards |
| [packages/interact/docs/](packages/interact/docs/) | API reference, guides, examples |
| [packages/motion/docs/](packages/motion/) | Motion API, animation categories |
