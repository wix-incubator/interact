---
name: Update interact system rules
overview: Update the 8 rule files in `packages/interact/rules/` to fix bugs, add missing features, and align with the current codebase (types, handlers, core logic, and docs).
todos:
  - id: fix-full-lean
    content: 'Update full-lean.md: add selector condition type, activate/interest triggers, state to ViewEnterParams, axis to PointerMoveParams'
    status: completed
  - id: fix-click-md
    content: 'Fix click.md: change source/target to key in Rule 2, fix TransitionEffect params in Rule 4'
    status: completed
  - id: fix-viewprogress-md
    content: "Fix viewprogress.md: fix missing comma in Rule 3, fix 'enter' to 'entry' in Rule 4, fix customEffect 3-param signatures"
    status: completed
  - id: fix-viewenter-md
    content: 'Fix viewenter.md: fix broken FOUC section, fix import path, rename SELECTOR variables to KEY'
    status: completed
  - id: fix-integration-md
    content: 'Update integration.md: add activate, interest, pageVisible to triggers table'
    status: completed
  - id: fix-scroll-list-md
    content: 'Fix scroll-list.md: fix customEffect 3-param signature, standardize variable naming'
    status: completed
  - id: fix-pointermove-md
    content: 'Review pointermove.md: fix any customEffect 3-param signatures if present'
    status: completed
isProject: false
---

# Update Interact System Rules

The rules in `packages/interact/rules/` have several discrepancies with the current code in `types.ts`, `handlers/`, `core/`, and the docs. Changes fall into three categories: **bug fixes**, **missing features**, and **consistency improvements**.

---

## 1. Fix Bugs and Syntax Errors

### [full-lean.md](packages/interact/rules/full-lean.md)

- **Line 118**: Condition `type` only lists `'media' | 'container'` -- add `'selector'`. The `selector` type is used in code (`getSelectorCondition` in [utils.ts](packages/interact/src/utils.ts)) to produce a CSS selector predicate (with `&` replacement) that guards when an effect/interaction applies:

```typescript
type: 'media' | 'container' | 'selector';
```

Add documentation:

- `'selector'`: The predicate is a CSS selector pattern. If it contains `&`, the `&` is replaced with the base element selector; otherwise the predicate is appended to the base selector. Used for conditional styling based on element state (e.g., `:hover`, `.active`).

### [click.md](packages/interact/rules/click.md)

- **Rule 2 (lines 122-141)**: Pattern uses `source` and `target` property names -- must be changed to `key`:

```typescript
// WRONG (current):
source: '[SOURCE_IDENTIFIER]',
effects: [{ target: '[TARGET_IDENTIFIER]', ... }]

// CORRECT:
key: '[SOURCE_IDENTIFIER]',
effects: [{ key: '[TARGET_IDENTIFIER]', ... }]
```

- **Rule 4 (line 313)**: TransitionEffect patterns use `params: { type: 'alternate' }` but TransitionEffects should use `StateParams` with `method`. Change to `params: { method: 'toggle' }` for the toggle behavior, or remove `params` (toggle is the default). Per the handler code in [click.ts](packages/interact/src/handlers/click.ts), `TransitionEffect` goes through `createTransitionHandler` which reads `StateParams.method`, not `PointerTriggerParams.type`.

### [viewprogress.md](packages/interact/rules/viewprogress.md)

- **Rule 3 example (~line 230)**: Missing comma after `name: 'fade-out'`:

```typescript
// WRONG:
name: 'fade-out'
keyframes: [{ ...

// CORRECT:
name: 'fade-out',
keyframes: [{ ...
```

- **Rule 4 example (~line 333)**: Uses range name `'enter'` instead of `'entry'`. Per [types.ts](packages/interact/src/types.ts) `RangeOffset` names are `'entry' | 'exit' | 'contain' | 'cover' | 'entry-crossing' | 'exit-crossing'`:

```typescript
// WRONG:
rangeStart: { name: 'enter', ... }
// CORRECT:
rangeStart: { name: 'entry', ... }
```

### [viewenter.md](packages/interact/rules/viewenter.md)

- **FOUC section (lines ~887-941)**: Contains broken/duplicated markdown with nested code blocks. The section has an incomplete `InteractConfig` declaration followed by a duplicate `generate` usage block. Clean up to a single well-formed code block.
- **FOUC import path (line ~895)**: Uses `import { generate } from '@wix/interact'` -- should be `'@wix/interact/web'` per the code and [full-lean.md](packages/interact/rules/full-lean.md).

### Multiple files: `customEffect` signature

- **viewprogress.md** (Rules 7, 8, 9): Patterns show `(element, progress, params)` with 3 parameters
- **scroll-list.md** (Rule 7): Pattern shows `(element, progress, params)` with 3 parameters

Per [types.ts](packages/interact/src/types.ts) line 90, the actual signature is `(element: Element, progress: any) => void` (2 parameters). Remove the third `params` parameter from all patterns.

---

## 2. Add Missing Triggers and Parameters

### [full-lean.md](packages/interact/rules/full-lean.md)

- **Trigger list (line ~136)**: Add `'activate'` and `'interest'` triggers. Per [handlers/index.ts](packages/interact/src/handlers/index.ts):
  - `activate`: Same as `click` but with `allowA11yTriggers: true` (adds keyboard Space/Enter listeners, sets `tabIndex=0`)
  - `interest`: Same as `hover` but with `allowA11yTriggers: true` (adds focusin/focusout listeners)
- **Params section**: Add activate/interest params (same as click/hover respectively)
- **ViewEnterParams type (line ~156)**: Add `'state'` to the type list: `type?: 'once' | 'repeat' | 'alternate' | 'state'`. The `state` type is documented in [viewenter.md](packages/interact/rules/viewenter.md) Rule 4 and supported in [viewEnter.ts](packages/interact/src/handlers/viewEnter.ts).
- Add `'state'` description: plays on entry, pauses on exit (for looping/continuous animations).
- **PointerMoveParams (line ~170)**: Add `axis?: 'x' | 'y'` parameter. Already documented in [pointermove.md](packages/interact/rules/pointermove.md) Rules 10-11 but missing from the central reference. Note: `axis` selects which pointer coordinate maps to linear 0-1 progress for `keyframeEffect`; defaults to `'y'`.

### [integration.md](packages/interact/rules/integration.md)

- **Triggers table (lines 178-186)**: Add missing triggers:
  - `activate` -- Accessible click (click + keyboard Space/Enter)
  - `interest` -- Accessible hover (hover + focus)

---

## 3. Consistency Improvements

### Variable naming standardization across rule files

- **[viewenter.md](packages/interact/rules/viewenter.md)**: Uses `[SOURCE_SELECTOR]`, `[TARGET_SELECTOR]`, `[OBSERVER_SELECTOR]` -- these are element keys (`data-interact-key` values), not CSS selectors. Rename to `[SOURCE_KEY]`, `[TARGET_KEY]`, `[OBSERVER_KEY]` for consistency with [pointermove.md](packages/interact/rules/pointermove.md) which correctly uses `[SOURCE_KEY]`.
- **[viewprogress.md](packages/interact/rules/viewprogress.md)**: Same issue -- rename `[SOURCE_SELECTOR]`/`[TARGET_SELECTOR]` to `[SOURCE_KEY]`/`[TARGET_KEY]`.
- **[scroll-list.md](packages/interact/rules/scroll-list.md)**: Uses a mix (`[CONTAINER_SELECTOR]` vs `[ITEM_KEY]`) -- standardize to `KEY` suffix for interact key values, reserving `SELECTOR` for actual CSS selector fields like `selector` or `listItemSelector`.
