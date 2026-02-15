# Execution Plan: Event Triggers Support

This plan implements the feature described in [requirement.md](./requirement.md): a generic **eventTrigger** implementation that replaces the current separate click and hover handlers, with configurable event bindings for click, hover, activate, and interest.

Each task is small, leaves the codebase in a passing state, and is validated by existing or new tests.

---

## Phase 0: Baseline and shared types

### Task 0.1 — Add types for event-trigger configuration

**Goal:** Introduce types that describe how an event trigger binds to DOM events, without changing behavior.

**Scope:**
- In `packages/interact/src/types.ts` (or a dedicated types file), add:
  - **Toggle-style config:** list of event names that all invoke the same “toggle” action (e.g. `['click']` or `['click', 'keydown']`). Handler does not branch on `event.type`.
  - **Enter/leave-style config:** two lists — “enter” events (e.g. `mouseenter`, `focusin`) and “leave” events (e.g. `mouseleave`, `focusout`). Handler branches on `event.type` to decide play vs pause/reverse.

**Deliverable:** Types only (e.g. `EventTriggerKind`, `EventTriggerConfig`). No handler changes.

**Validation:**
- `pnpm build` (or project build) succeeds.
- Existing test suite passes (e.g. `pnpm test` in `packages/interact`).

---

### Task 0.2 — Extract shared effect logic used by click and hover

**Goal:** Remove duplication between click and hover so the future eventTrigger can reuse one implementation.

**Scope:**
- Both handlers use:
  - `createTimeEffectHandler(element, effect, options, …)` (play/reverse/pause based on `type`).
  - `createTransitionHandler(element, targetController, effect, options, …)` (toggleEffect add/remove).
- Extract these into a shared module (e.g. `packages/interact/src/handlers/effectHandlers.ts` or `eventTriggerEffectHandlers.ts`).
- Have `click.ts` and `hover.ts` import and use the shared functions. Signatures and behavior unchanged.

**Deliverable:** New shared module; click and hover refactored to use it only.

**Validation:**
- All existing tests for click and hover pass (`web.spec.ts`, `mini.spec.ts`: click, hover, activate, interest, and a11y trigger tests).
- No change in which events are bound or how effects run.

---

## Phase 1: Generic eventTrigger handler

### Task 1.1 — Implement eventTrigger handler (toggle mode only)

**Goal:** New handler that binds a single “toggle” action to a configurable list of event types; handler does not use `event.type`.

**Scope:**
- New file: `packages/interact/src/handlers/eventTrigger.ts`.
- Export `{ add, remove }` with the same interface as other trigger handlers (`source`, `target`, `effect`, `options`, `interactOptions`).
- Accept an **options-level or parameter** that supplies the event config (for now, hardcode or pass a toggle config: e.g. events `['click']`).
- Reuse the shared effect logic from Task 0.2 to create the inner callback. Attach one listener per configured event type; same callback for all. Cleanup removes all listeners.
- Do **not** yet wire this from `handlers/index.ts` for `click`; keep existing click handler as-is.

**Deliverable:** `eventTrigger.ts` that can drive a toggle-style interaction from `['click']` (or a single config).

**Validation:**
- New unit test(s): add interaction with eventTrigger (toggle, `['click']`), dispatch click on source, assert effect runs (e.g. animation play/reverse or toggleEffect called). Remove element, assert listeners removed (no duplicate invocations after remove).
- Existing click/hover tests still pass (click still uses old handler).

---

### Task 1.2 — Implement eventTrigger enter/leave mode

**Goal:** eventTrigger supports a second mode: “enter/leave” with two sets of events; handler branches on `event.type` to apply play vs pause/reverse.

**Scope:**
- Extend eventTrigger to accept an enter/leave config: `enter: ['mouseenter', 'focusin']`, `leave: ['mouseleave', 'focusout']`.
- Reuse shared enter/leave effect logic (same behavior as current hover time-effect and transition handlers). Handler receives `MouseEvent | FocusEvent` and branches on `event.type === 'mouseenter' | 'focusin'` vs `'mouseleave' | 'focusout'`.
- Attach one listener per event in `enter` and `leave`; all share the same handler. Cleanup removes all.
- Still do not wire hover in index to eventTrigger.

**Deliverable:** eventTrigger supports both toggle and enter/leave configs.

**Validation:**
- New unit test(s): add interaction with eventTrigger (enter/leave, mouseenter/mouseleave), dispatch mouseenter then mouseleave, assert play then reverse (or equivalent). Optionally focusin/focusout.
- Existing tests unchanged.

---

### Task 1.3 — Wire click and activate to eventTrigger

**Goal:** Use eventTrigger for click and activate so the handler is event-type-agnostic for toggle; activate adds keydown (Enter/Space).

**Scope:**
- In `handlers/index.ts`:
  - **click:** Invoke eventTrigger with toggle config `['click']` (no keydown).
  - **activate:** Invoke eventTrigger with toggle config `['click', 'keydown']` and a11y behavior (Enter/Space trigger the same action; ensure no double-fire on Enter as in current tests). Preserve `allowA11yTriggers` behavior (tabIndex, etc.) via interactOptions.
- Remove or bypass the old click handler for these two trigger types. If needed, keep `click.ts` as a thin wrapper that calls eventTrigger with click config until cleanup phase.

**Deliverable:** click and activate are implemented via eventTrigger; handler does not branch on `event.type` for which action to run.

**Validation:**
- All existing click and activate tests pass (`describe('click')`, `describe('activate trigger')`, “should not double-invoke handler when Enter triggers both keydown and click”, etc.) in both `web.spec.ts` and `mini.spec.ts`.

---

### Task 1.4 — Wire hover and interest to eventTrigger

**Goal:** Use eventTrigger for hover and interest with enter/leave event mapping; handler branches on `event.type` for enter vs leave.

**Scope:**
- **hover:** eventTrigger with enter/leave config `enter: ['mouseenter']`, `leave: ['mouseleave']`; no focus events.
- **interest:** eventTrigger with `enter: ['mouseenter', 'focusin']`, `leave: ['mouseleave', 'focusout']`, and a11y options (tabIndex, etc.) when `allowA11yTriggers` is true. Preserve focusin/focusout containment check (only trigger when focus moves in/out of source).
- Remove or bypass the old hover handler for these trigger types.

**Deliverable:** hover and interest implemented via eventTrigger; enter/leave behavior unchanged.

**Validation:**
- All existing hover and interest tests pass (`describe('hover')`, `describe('interest trigger')`, a11y hover tests) in both test files.

---

## Phase 2: Cleanup and documentation

### Task 2.1 — Remove legacy click and hover handler implementations

**Goal:** Single implementation path: eventTrigger only for the four event-style triggers.

**Scope:**
- If `click.ts` and `hover.ts` still exist as thin wrappers, either remove them and have `handlers/index.ts` call eventTrigger with the appropriate config for `click`, `hover`, `activate`, `interest`, or keep minimal wrappers that only pass config to eventTrigger.
- Ensure no duplicated logic remains in click.ts/hover.ts (all logic in shared effect module + eventTrigger).
- Fix any inconsistency (e.g. hover time-effect uses `dataset.motionEnter` in one place vs `dataset.interactEnter` elsewhere) to a single convention.

**Deliverable:** No duplicate handler logic; eventTrigger is the single implementation for click, hover, activate, interest.

**Validation:**
- Full test suite passes.
- Grep for `createTimeEffectHandler` / `createTransitionHandler` shows usage only in the shared module and eventTrigger (or files that delegate to it).

---

### Task 2.2 — Document eventTrigger and align with requirement

**Goal:** Code and docs reflect the design in requirement.md and support future extensibility.

**Scope:**
- Add a short comment in `eventTrigger.ts` (or handlers/README if present) describing:
  - Toggle vs enter/leave modes.
  - That click/activate are toggle (handler ignores `event.type`); hover/interest are enter/leave (handler checks `event.type`).
  - That new event types can be added by extending config (future: arbitrary event names, stateless triggers).
- Optionally add a “Trigger implementation” section to the main README or requirement.md referencing this plan and eventTrigger.

**Deliverable:** Comments/docs updated; requirement.md goals clearly met (generic eventTrigger, event-type-agnostic for click/activate, event-type-based for hover/interest).

**Validation:**
- Review requirement.md checklist: all design points covered by implementation.

---

## Summary table

| Task   | Description                                      | Main validation                          |
|--------|--------------------------------------------------|------------------------------------------|
| 0.1    | Add event-trigger config types                   | Build + tests pass                       |
| 0.2    | Extract shared effect logic (click/hover)       | Click/hover/activate/interest tests pass |
| 1.1    | eventTrigger toggle mode                         | New unit tests for toggle                |
| 1.2    | eventTrigger enter/leave mode                    | New unit tests for enter/leave           |
| 1.3    | Wire click & activate to eventTrigger            | All click/activate tests pass            |
| 1.4    | Wire hover & interest to eventTrigger            | All hover/interest tests pass            |
| 2.1    | Remove legacy click/hover implementation        | Full suite + no duplicate logic          |
| 2.2    | Document eventTrigger and requirement alignment | Requirement checklist met                |

---

## Out of scope (per requirement)

- **viewEnter / pageVisible:** No change (Timeline Trigger).
- **animationEnd:** Deferred to next phase.
- **viewProgress / pointerMove:** No change (scrub/timeline).
- **Stateless triggers / granular spec actions:** Future work; this plan only establishes the generic eventTrigger and current stateful behavior.
