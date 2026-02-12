---
name: Update Interact docs
overview: Update the Interact documentation to match the current library code, fixing factual errors in API signatures, type definitions, and examples, while trimming for conciseness per user request.
todos:
  - id: fix-interact-class
    content: "Fix `api/interact-class.md`: correct `setup()` signature (scrollOptionsGetter, pointerOptionsGetter instead of forceReducedMotion/viewProgress/pointerMove), update class overview block and examples"
    status: completed
  - id: fix-functions
    content: "Fix `api/functions.md`: correct `generate()` signature (add useFirstChild param), fix CSS output to show actual key-based selectors, fix availability claim (all 3 entry points)"
    status: completed
  - id: fix-types
    content: "Fix `api/types.md`: add 'state' to ViewEnterType, add useSafeViewEnter to ViewEnterParams, add axis to PointerMoveParams, add 'selector' to Condition.type, add activate/interest to InteractionParamsTypes, add useFirstChild to IInteractionController, fix customEffect signature, remove fabricated InteractConfigBuilder, remove internal types"
    status: completed
  - id: fix-controller
    content: "Fix `api/interaction-controller.md`: add useFirstChild to interface, fix disconnect() signature, remove internal _childListChangeHandler, trim verbose sections"
    status: completed
  - id: fix-triggers-guide
    content: "Fix `guides/understanding-triggers.md`: add 'state' to viewEnter behaviors, add axis param to pointerMove, fix section numbering, add brief pageVisible note"
    status: completed
  - id: fix-react-integration
    content: "Fix `integration/react.md`: add `initial` prop to Interaction component props table, fix accordion example config"
    status: completed
  - id: fix-readme
    content: "Fix root `README.md`: update entry points table, remove all broken links to non-existent doc files, simplify TOC to only existing pages"
    status: completed
isProject: false
---

# Update Interact Docs to Match Current Library State

## Summary of Discrepancies Found

After comparing all 25 doc files against the source code in `src/core`, `src/handlers`, `src/types.ts`, `src/react`, `src/web`, and `src/dom`, here are the issues grouped by severity.

---

## 1. Fix Factual Errors in API Reference

### [api/interact-class.md](packages/interact/docs/api/interact-class.md) -- `Interact.setup()` wrong signature

The documented signature is:

```typescript
static setup(options: { forceReducedMotion?: boolean, viewEnter?: object, viewProgress?: object, pointerMove?: object, allowA11yTriggers?: boolean }): void
```

The actual code at `src/core/Interact.ts:173-200` is:

```typescript
static setup(options: {
  scrollOptionsGetter?: () => Partial<scrollConfig>;
  pointerOptionsGetter?: () => Partial<PointerConfig>;
  viewEnter?: Partial<ViewEnterParams>;
  allowA11yTriggers?: boolean;
}): void
```

Changes needed:

- Remove `forceReducedMotion` from `setup()` (it's a direct static property: `Interact.forceReducedMotion = true`)
- Replace `viewProgress` with `scrollOptionsGetter` (a callback, not an object)
- Replace `pointerMove` with `pointerOptionsGetter` (a callback, not an object)
- Update the class overview block and examples

### [api/functions.md](packages/interact/docs/api/functions.md) -- `generate()` errors

Multiple issues:

- **Wrong signature**: Docs show `generate(config: InteractConfig): string` but code has `generate(config: InteractConfig, useFirstChild?: boolean): string`
- **Wrong CSS output**: Docs show CSS targeting `[data-interact-initial='true']` but the actual code generates key-specific selectors like `[data-interact-key="hero"]:not([data-interact-enter])`
- **Wrong availability claim**: Docs say "generate is only available from the main `@wix/interact` entry point" but it is exported from all three entry points (`@wix/interact`, `@wix/interact/react`, `@wix/interact/web`)

### [api/interaction-controller.md](packages/interact/docs/api/interaction-controller.md) -- Missing interface members

- `useFirstChild: boolean` property is missing from the interface block
- `disconnect()` signature is wrong -- missing `options?: { removeFromCache?: boolean }` parameter

---

## 2. Fix Type Definitions ([api/types.md](packages/interact/docs/api/types.md))

All of these are in `api/types.md`, comparing against `src/types.ts`:

- `**ViewEnterType**`: Missing `'state'` -- should be `'once' | 'repeat' | 'alternate' | 'state'`
- `**ViewEnterParams**`: Missing `useSafeViewEnter?: boolean`
- `**PointerMoveParams**`: Missing `axis?: PointerMoveAxis` (where `PointerMoveAxis = 'x' | 'y'`)
- `**Condition.type**`: Missing `'selector'` -- should be `'media' | 'container' | 'selector'`
- `**InteractionParamsTypes**`: Missing `activate` and `interest` entries
- `**IInteractionController**`: Missing `useFirstChild: boolean` property
- `**customEffect` signature**: Docs show `(element: HTMLElement) => Animation` but code has `(element: Element, progress: any) => void`
- `**HandlerObject.handler**`: Docs show `handler?: () => void` but code has `handler?: (isIntersecting?: boolean) => void`
- **Remove fabricated `InteractConfigBuilder**`: This class does not exist anywhere in the source code

---

## 3. Fix Guides

### [guides/understanding-triggers.md](packages/interact/docs/guides/understanding-triggers.md)

- **ViewEnter section**: Only lists `once`, `repeat`, `alternate` -- missing `state` behavior type
- **PointerMove section**: Missing `axis` parameter documentation
- `**pageVisible` trigger**: Listed in overview table but has no dedicated section (add a brief note or remove from table)
- Section numbering jumps from 6 to 8 (missing 7 for PointerMove)

---

## 4. Fix Integration Docs

### [integration/react.md](packages/interact/docs/integration/react.md)

- `**Interaction` component props table**: Missing the `initial` prop (`initial?: boolean` sets `data-interact-initial="true"`)
- The accordion config example uses a non-existent `transitionEffect` structure (should use `transition`/`transitionProperties`)

---

## 5. Fix Root README and Remove Broken Links

### [README.md](packages/interact/docs/README.md)

- **Entry points table**: `@wix/interact/web` should also show `add`, `remove` in Key Exports
- **Remove or mark broken links** to non-existent files:
  - `guides/performance.md`
  - `examples/scroll-animations.md`, `examples/advanced-patterns.md`, `examples/real-world.md`
  - `integration/vanilla-js.md`, `integration/other-frameworks.md`, `integration/migration.md`, `integration/testing.md`, `integration/debugging.md`
  - `advanced/architecture.md`, `advanced/custom-triggers.md`, `advanced/browser-support.md`, `advanced/performance-optimization.md`, `advanced/contributing.md`
- Simplify the TOC to only link to files that exist

---

## 6. Conciseness Pass (per user request)

Across all docs:

- **Remove internal types** from `api/types.md`: `HandlerObject`, `HandlerObjectMap`, `InteractCache`, `CreateTransitionCSSParams`, `InteractionHandlerModule`, `TriggerHandlerMap` -- these are internal implementation details
- **Remove `_childListChangeHandler**` from `api/interaction-controller.md` -- it's an internal method (prefixed with `_`)
- **Trim verbose examples** in `api/interaction-controller.md` (e.g. the programmatic state management / dynamic list management sections can be shortened)
- **Trim `api/types.md**` significantly by removing internal types and overly detailed examples for rarely-used types
- **Simplify "See Also" sections** across all API docs -- many link to the same set of files repeatedly

---

## File-by-File Summary


| File                               | Changes                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `README.md`                        | Fix entry points table, remove broken links, trim TOC                       |
| `api/interact-class.md`            | Fix `setup()` signature and examples                                        |
| `api/functions.md`                 | Fix `generate()` signature, CSS output, and availability                    |
| `api/interaction-controller.md`    | Add `useFirstChild`, fix `disconnect()`, trim internals                     |
| `api/types.md`                     | Fix 8+ type discrepancies, remove fabricated builder, remove internal types |
| `guides/understanding-triggers.md` | Add `state` to viewEnter, add `axis` to pointerMove, fix numbering          |
| `integration/react.md`             | Add `initial` prop, fix accordion example                                   |


