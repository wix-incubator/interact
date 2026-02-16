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
- The config should support **custom event names** (callers can pass event names that are not predefined).

**Deliverable:** Types only (e.g. `EventTriggerKind`, `EventTriggerConfig`). No handler changes.

**Validation:**
- `yarn build` (or project build) succeeds.
- Existing test suite passes (e.g. `yarn test` or `yarn workspace @wix/interact test` in `packages/interact`).

---

### Task 0.2 — Extract shared effect logic and add event-config constants map

**Goal:** Remove duplication between click and hover and centralize event configuration so the future eventTrigger can reuse one implementation and one source of truth for trigger → event config.

**Scope:**
- Both handlers use:
  - `createTimeEffectHandler(element, effect, options, …)` (play/reverse/pause based on `type`).
  - `createTransitionHandler(element, targetController, effect, options, …)` (toggleEffect add/remove).
- Extract these into a **single shared module** (e.g. `packages/interact/src/handlers/effectHandlers.ts` or `eventTriggerEffectHandlers.ts`).
- **Do not** introduce a separate file per event type. Instead, define a **constants map** that maps trigger names (or config keys) to the shared event configuration:
  - Preset entries for `click`, `hover`, `activate`, `interest` (see Trigger → config table below).
  - Allow **custom event types**: the eventTrigger handler must accept either a key into this map or an **inline config object** (custom event names) so new triggers do not require new files.
- Have `click.ts` and `hover.ts` import and use the shared functions. Signatures and behavior unchanged.

**Deliverable:** New shared module with effect logic; constants map for event config (presets + support for custom config); click and hover refactored to use shared logic only.

**Validation:**
- All existing tests for click and hover pass (`web.spec.ts`, `mini.spec.ts`: click, hover, activate, interest, and a11y trigger tests).
- No change in which events are bound or how effects run.

**Future (out of scope for first commit):** Tests should eventually cover **other event types** beyond the current four triggers (e.g. custom event names, or other DOM events used via the same eventTrigger). The design (constants map + config object) must allow adding and testing them later without adding new handler files.

---

## Phase 1: Generic eventTrigger handler

### Task 1.1 — Implement eventTrigger handler (toggle mode only)

**Goal:** New handler that binds a single “toggle” action to a configurable list of event types; handler does not use `event.type`.

**Scope:**
- New file: `packages/interact/src/handlers/eventTrigger.ts`.
- Export `{ add, remove }` with the same interface as other trigger handlers (`source`, `target`, `effect`, `options`, `interactOptions`).
- Accept an **options-level or parameter** that supplies the event config. Config must support the **union type** (see Task 1.4): for toggle mode, accept `string` (e.g. `'click'`) or `string[]` (e.g. `['click', 'keydown']`). Resolve from constants map by trigger key or accept inline config.
- Reuse the shared effect logic from Task 0.2 to create the inner callback. Attach one listener per configured event type; same callback for all. Cleanup removes all listeners.
- Do **not** yet wire this from `handlers/index.ts` for `click`; keep existing click handler as-is.

**Deliverable:** `eventTrigger.ts` that can drive a toggle-style interaction from `'click'` or `['click']` (or a single config).

**Validation:**
- New unit test(s): add interaction with eventTrigger (toggle, `['click']`), dispatch click on source, assert effect runs (e.g. animation play/reverse or toggleEffect called). Remove element, assert listeners removed (no duplicate invocations after remove).
- Existing click/hover tests still pass (click still uses old handler).

---

### Task 1.2 — Implement eventTrigger enter/leave mode

**Goal:** eventTrigger supports a second mode: “enter/leave” with two sets of events; handler branches on `event.type` to apply play vs pause/reverse.

**Scope:**
- Extend eventTrigger to accept enter/leave config as **object** `{ enter?: string[], leave?: string[] }` (e.g. `enter: ['mouseenter', 'focusin']`, `leave: ['mouseleave', 'focusout']`). Config shape is part of the union type (Task 1.4).
- Reuse shared enter/leave effect logic (same behavior as current hover time-effect and transition handlers). Handler receives `MouseEvent | FocusEvent` and branches on `event.type` (e.g. `'mouseenter' | 'focusin'` vs `'mouseleave' | 'focusout'`).
- Attach one listener per event in `enter` and `leave`; all share the same handler. Cleanup removes all.
- Still do not wire hover in index to eventTrigger.

**Deliverable:** eventTrigger supports both toggle (string | string[]) and enter/leave (object with enter/leave arrays) configs.

**Validation:**
- New unit test(s): add interaction with eventTrigger (enter/leave, mouseenter/mouseleave), dispatch mouseenter then mouseleave, assert play then reverse (or equivalent). Optionally focusin/focusout.
- Existing tests unchanged.

---

### Task 1.3 — Wire click and activate to eventTrigger

**Goal:** Use eventTrigger for click and activate so the handler is event-type-agnostic for toggle; activate adds keydown (Enter/Space).

**Scope:**
- In `handlers/index.ts` (or via constants map):
  - **click:** Invoke eventTrigger with toggle config `'click'` or `['click']` (no keydown).
  - **activate:** Invoke eventTrigger with toggle config `['click', 'keydown']` and a11y behavior (keydown restricted to Enter or Space; same action as click; ensure no double-fire on Enter as in current tests). Preserve `allowA11yTriggers` behavior (tabIndex, etc.) via interactOptions.
- Remove or bypass the old click handler for these two trigger types. If needed, keep `click.ts` as a thin wrapper that calls eventTrigger with click config until cleanup phase.

**Deliverable:** click and activate are implemented via eventTrigger; handler does not branch on `event.type` for which action to run.

**Validation:**
- All existing click and activate tests pass (`describe('click')`, `describe('activate trigger')`, “should not double-invoke handler when Enter triggers both keydown and click”, etc.) in both `web.spec.ts` and `mini.spec.ts`.

---

### Task 1.4 — Wire hover and interest to eventTrigger; define config union type

**Goal:** Use eventTrigger for hover and interest with enter/leave event mapping; handler branches on `event.type` for enter vs leave. Standardize the trigger config type so eventTrigger accepts a single, flexible shape.

**Scope:**
- **Trigger config type** — eventTrigger must accept a config expressed as one of:
  - **Enter/leave object:** `{ enter?: string[], leave?: string[] }`  
    e.g. `{ enter: ['mouseenter', 'focusin'], leave: ['mouseleave', 'focusout'] }`
  - **Toggle as array:** `string[]`  
    e.g. `['click', 'keydown']`
  - **Toggle as single event:** `string`  
    e.g. `'click'`
  - Normalize internally (e.g. string → array for toggle; detect enter/leave vs toggle from shape).
- **hover:** eventTrigger with enter/leave config `{ enter: ['mouseenter'], leave: ['mouseleave'] }`; no focus events.
- **interest:** eventTrigger with `{ enter: ['mouseenter', 'focusin'], leave: ['mouseleave', 'focusout'] }`, and a11y options (tabIndex, etc.) when `allowA11yTriggers` is true. Preserve focusin/focusout containment check (only trigger when focus moves in/out of source).
- Remove or bypass the old hover handler for these trigger types.
- Preset configs for hover and interest should come from the constants map (Task 0.2).

**Deliverable:** hover and interest implemented via eventTrigger; config union type defined and used; enter/leave behavior unchanged.

**Validation:**
- All existing hover and interest tests pass (`describe('hover')`, `describe('interest trigger')`, a11y hover tests) in both test files.

---

## Phase 2: Cleanup and documentation

### Task 2.1 — Remove legacy click and hover handler implementations

**Goal:** Single implementation path: eventTrigger only for the four event-style triggers.

**Scope:**
- If `click.ts` and `hover.ts` still exist as thin wrappers, either remove them and have `handlers/index.ts` call eventTrigger with the appropriate config from the constants map for `click`, `hover`, `activate`, `interest`, or keep minimal wrappers that only pass config to eventTrigger.
- Ensure no duplicated logic remains in click.ts/hover.ts (all logic in shared effect module + eventTrigger).
- Fix any inconsistency (e.g. hover time-effect uses `dataset.motionEnter` in one place vs `dataset.interactEnter` elsewhere) to a single convention.

**Deliverable:** No duplicate handler logic; eventTrigger is the single implementation for click, hover, activate, interest; constants map is the single source of preset configs.

**Validation:**
- Full test suite passes (use `yarn test` or `yarn workspace @wix/interact test`).
- Grep for `createTimeEffectHandler` / `createTransitionHandler` shows usage only in the shared module and eventTrigger (or files that delegate to it).

---

### Task 2.2 — Document eventTrigger, trigger → config mapping, and update rules

**Goal:** Code and docs reflect the design in requirement.md; implementers and rules know the exact config per trigger; rules in `packages/interact/rules/` stay in sync with the implementation.

**Scope:**
- Add a short comment in `eventTrigger.ts` (or handlers/README if present) describing:
  - Toggle vs enter/leave modes and the config union type (`string | string[] | { enter?, leave? }`).
  - That click/activate are toggle (handler ignores `event.type`); hover/interest are enter/leave (handler checks `event.type`).
  - That new event types can be added via the constants map or inline config (future: arbitrary event names, stateless triggers).
- **Trigger → config mapping (single source of truth):** Document the exact runtime config for each trigger (in code comments and/or a small table in plan/docs):

  | Trigger   | Config (runtime) |
  |-----------|------------------|
  | **click** | `'click'` or `['click']` (toggle) |
  | **activate** | `['click', 'keydown']` (toggle; keydown only Enter or Space) |
  | **hover** | `{ enter: ['mouseenter'], leave: ['mouseleave'] }` |
  | **interest** | `{ enter: ['mouseenter', 'focusin'], leave: ['mouseleave', 'focusout'] }` |

  Ensure this mapping matches the constants map so the “actual config” is the single source of truth.
- **Update rules:** Update the rule files in **`packages/interact/rules/`** (e.g. `click.md`, `hover.md`, `integration.md`, `full-lean.md`, and any other rule files that describe triggers) so that they:
  - Describe trigger configuration as the **config object** (string | string[] | `{ enter?, leave? }`) rather than only “trigger: 'click'” or “trigger: 'hover'”.
  - Document that **click** and **activate** use the same handler with different configs (toggle: `'click'` vs `['click', 'keydown']` with Enter/Space).
  - Document that **hover** and **interest** use the same handler with different configs (enter/leave: mouse only vs mouse + focusin/focusout).
  - Align rule examples and variable placeholders with the actual config shapes (e.g. custom events as string arrays or enter/leave arrays).

**Deliverable:** Comments/docs updated; trigger → config table documented; requirement.md goals clearly met; rules in `packages/interact/rules/` updated to describe eventTrigger config and the trigger-to-config mapping.

**Validation:**
- Review requirement.md checklist: all design points covered by implementation.
- Rules reference the config union and the trigger → config mapping where relevant.

---

## Summary table

| Task   | Description                                      | Main validation                          |
|--------|--------------------------------------------------|------------------------------------------|
| 0.1    | Add event-trigger config types                   | `yarn build` + tests pass                 |
| 0.2    | Extract shared effect logic + constants map      | Click/hover/activate/interest tests pass |
| 1.1    | eventTrigger toggle mode                         | New unit tests for toggle                |
| 1.2    | eventTrigger enter/leave mode                    | New unit tests for enter/leave           |
| 1.3    | Wire click & activate to eventTrigger            | All click/activate tests pass            |
| 1.4    | Wire hover & interest; config union type          | All hover/interest tests pass            |
| 2.1    | Remove legacy click/hover implementation        | Full suite + no duplicate logic           |
| 2.2    | Document eventTrigger, mapping, update rules     | Requirement checklist + rules updated    |

---

## Out of scope (per requirement)

- **viewEnter / pageVisible:** No change (Timeline Trigger).
- **animationEnd:** Deferred to next phase.
- **viewProgress / pointerMove:** No change (scrub/timeline).
- **Stateless triggers / granular spec actions:** Future work; this plan only establishes the generic eventTrigger and current stateful behavior.
- **Tests for other event types:** Out of scope for the first commit; design (constants map + config) must allow adding and testing them later.
