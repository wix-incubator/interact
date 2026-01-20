---
name: CONTRIBUTING.md plan
overview: Create a contributor guide tailored to this Yarn-4 monorepo (packages + apps), with clear issue/PR workflow, local dev commands, and expectations for tests/docs/formatting—modeled after proven OSS templates and anime.js’ guidelines.
todos:
  - id: collect-repo-workflows
    content: Verify the exact Yarn workspace names and the canonical dev/test/build commands for packages and apps to document accurately.
    status: pending
  - id: draft-contributing
    content: Draft `/CONTRIBUTING.md` using the outline above with copy/paste commands and issue/PR checklists.
    status: pending
  - id: wire-readme-link
    content: Add a prominent link to `CONTRIBUTING.md` in `/README.md`.
    status: pending
  - id: optional-templates
    content: (Optional) Add `.github` issue + PR templates aligned with the CONTRIBUTING checklists.
    status: pending
  - id: optional-coc-security
    content: (Optional) Add `CODE_OF_CONDUCT.md` and `SECURITY.md` (or decide on existing org-standard docs) and link them from CONTRIBUTING.
    status: pending
---

# Plan: Create a strong `CONTRIBUTING.md`

## Context we’ll bake in (repo-specific)

- **Monorepo + workspaces**: `packages/*` (publishable libs like `@wix/interact`, `@wix/motion`) and `apps/*` (docs + demo).
- **Tooling**: Node `>=18`, Yarn `4.10.3` workspaces; root scripts: `build`, `test`, `lint`, `format`, `format:check`, `dev:docs`, `dev:demo`.
- **Per-package workflow**: packages build via `vite build` + `tsc`, tests via `vitest run`, typecheck via `tsc --noEmit`.

## Reference patterns to emulate (what we’ll borrow)

- **Strict “use the template or it’ll be closed” intake + clear issue categories** from anime.js’ guide ([anime.js CONTRIBUTING](https://raw.githubusercontent.com/juliangarnier/anime/master/CONTRIBUTING.md)).
- **A concise, maintainers-friendly structure** from common OSS templates (e.g. CNCF contributing template and Nayafia’s template as inspiration).

## Outline we’ll implement in `CONTRIBUTING.md`

- **Welcome + scope**: what kinds of contributions are valuable (bugs, docs, examples, performance, new interactions/motion presets).
- **Quick links / Table of contents** (keep short).
- **Before you start**:
- Search existing issues.
- For big changes: open an issue/discussion first (design/API alignment).
- What maintainers will merge vs decline (scope control for OSS).
- **Development setup (copy/paste)**:
- Prereqs: Node `>=18`, Yarn `4.x`.
- Install: `yarn install`.
- Build: `yarn build`.
- Test: `yarn test` (and optionally per-workspace examples).
- Lint/typecheck + format: `yarn lint`, `yarn format:check`.
- Run apps:
- `yarn dev:demo`
- `yarn dev:docs`
- Workspace tips: how to run a single package/app script (e.g. `yarn workspace <name> test`).
- **Project map**: a small “where to change what” section:
- `packages/interact/src` (core library)
- `packages/motion/src` (motion toolkit)
- `apps/docs/src` (docs app)
- `apps/demo/src` (demo app)
- `packages/*/test` (Vitest suites)
- `packages/*/docs` (markdown docs content)
- **How to report a bug** (template/checklist): repro steps, expected/actual, minimal example, environment (browser + OS + versions), screenshots.
- **How to propose a feature** (template/checklist): motivation, proposed API, alternatives, backwards compatibility, performance concerns.
- **Pull request process**:
- Fork → branch naming suggestions.
- Keep PRs focused; link the issue; describe behavior changes.
- **Tests required** for behavior changes; where to add them.
- **Docs required** when public API or behavior changes.
- What CI checks must pass (build/test/lint/format).
- Review expectations and how to respond to feedback.
- **Code standards**:
- TypeScript expectations, public API design guidance, performance guardrails (avoid layout thrash; prefer existing utilities).
- Formatting: Prettier; lint/typecheck: ESLint + `tsc`.
- **Commit messages**:
- A simple convention (imperative, scoped) and examples; optionally “Conventional Commits encouraged” (but not required unless you want to enforce later).
- **Docs & examples contributions**:
- Where docs live and how they’re built (docs app).
- How to add/update examples and what makes a “good example” for an animation library (clear before/after, reduced-motion note).
- **Accessibility & motion** (short but important for animation libs): recommend respecting reduced motion where applicable.
- **Legal**:
- Contributions are under the repo license (MIT) by default.
- **Security reporting**:
- Add a short pointer to `SECURITY.md` (and include a placeholder process if the file doesn’t exist yet).

## Repo changes to make alongside the guide (small, high leverage)

- Add/ensure links from the root README to `CONTRIBUTING.md`.
- (Optional but recommended) Add `.github/ISSUE_TEMPLATE/*` and `.github/pull_request_template.md` aligned with the templates/checklists described above.
- (Optional) Add `CODE_OF_CONDUCT.md` and `SECURITY.md` if missing, and link them from `CONTRIBUTING.md`.

## Quality bar / validation

- Do a “new contributor dry run”: follow the steps on a clean clone and confirm commands work.
- Ensure every command in the doc matches the repo’s actual scripts.
- Keep the doc skimmable (short sections, checklists, concrete commands).

## Files we’ll touch

- `/Users/Yehonatand/dev/interact/CONTRIBUTING.md`
- `/Users/Yehonatand/dev/interact/README.md` (add link)
- Optional:
- `/Users/Yehonatand/dev/interact/.github/ISSUE_TEMPLATE/*`
- `/Users/Yehonatand/dev/interact/.github/pull_request_template.md`
- `/Users/Yehonatand/dev/interact/CODE_OF_CONDUCT.md`
- `/Users/Yehonatand/dev/interact/SECURITY.md`