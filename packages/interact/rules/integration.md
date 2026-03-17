# @wix/interact Integration Rules

Rules for integrating `@wix/interact` into a webpage — binding animations and effects to user-driven triggers via declarative configuration.

## Table of Contents

- [Entry Points](#entry-points)
  - [Web (Custom Elements)](#web-custom-elements)
  - [React](#react)
  - [Vanilla JS](#vanilla-js)
- [Configuration Schema](#configuration-schema)
  - [InteractConfig](#interactconfig)
  - [Interaction](#interaction)
  - [Element Selection](#element-selection)
- [Triggers](#triggers)
- [Sequences](#sequences)
- [Named Effects & registerEffects](#named-effects--registereffects)
- [Critical CSS (FOUC Prevention)](#critical-css-fouc-prevention)
- [Static API](#static-api)

---

## Entry Points

### Web (Custom Elements)

```typescript
import { Interact } from '@wix/interact/web';

Interact.create(config);
```

Wrap target elements with `<interact-element>`:

```html
<interact-element data-interact-key="hero">
  <section class="hero">...</section>
</interact-element>
```

**Rules:**

- MUST set `data-interact-key` to a value unique within the page.
- MUST contain at least one child element (the library targets `.firstElementChild` by default).

### React

```typescript
import { Interact } from '@wix/interact/react';

Interact.create(config);
```

Replace target elements with `<Interaction>`:

```tsx
import { Interaction } from '@wix/interact/react';

<Interaction tagName="div" interactKey="hero" className="hero">
  ...
</Interaction>;
```

**Rules:**

- MUST set `tagName` to the HTML tag of the element being replaced.
- MUST set `interactKey` to a unique string within the page.

Alternatively, use `createInteractRef` to attach interactions to an existing element:

```tsx
import { createInteractRef } from '@wix/interact/react';

const ref = createInteractRef('hero');
<div ref={ref}>...</div>;
```

### Vanilla JS

```typescript
import { Interact } from '@wix/interact';

const interact = Interact.create(config);
interact.add(element, 'hero');
```

**Rules:**

- Call `add(element, key)` after elements exist in the DOM.
- Call `remove(key)` to unregister all interactions for a key.

---

## Configuration Schema

### InteractConfig

```typescript
type InteractConfig = {
  interactions: Interaction[];
  effects: Record<string, Effect>;
  sequences?: Record<string, SequenceConfig>;
  conditions?: Record<string, Condition>;
};
```

| Field          | Description                                                             |
| :------------- | :---------------------------------------------------------------------- |
| `interactions` | Required. Array of interaction definitions binding triggers to effects. |
| `effects`      | Required. Reusable named effects, referenced by `effectId`.             |
| `sequences`    | Optional. Reusable sequence definitions, referenced by `sequenceId`.    |
| `conditions`   | Optional. Named conditions (media/container queries), referenced by ID. |

Each call `Interact.create(config)` creates a new `Interact` instance.

### Interaction

```typescript
{
  key: 'hero',                     // Matches data-interact-key / interactKey
  trigger: 'viewEnter',            // Trigger type
  params?: { type: 'once' },       // Trigger-specific parameters
  selector?: '.child',             // CSS selector to refine target within the element
  listContainer?: '.grid',         // CSS selector for a list container
  listItemSelector?: '.item',      // CSS selector for items within listContainer
  conditions?: ['Desktop'],        // Array of condition IDs
  effects?: [ ... ],               // Effects to apply
  sequences?: [ ... ],             // Sequences to apply
}
```

### Element Selection

Resolved in order of priority:

1. **`listContainer` + `listItemSelector`** — matches items within the container.
2. **`listContainer` only** — targets immediate children of the container.
3. **`listContainer` + `selector`** - matches via `querySelector` within each immediate child of the container.
4. **`selector` only** — matches via `querySelectorAll` within the root element.
5. **Fallback** — first child of `<interact-element>` (web) or the root element (react/vanilla).

---

## Triggers

| Trigger        | Description                            | Key Parameters                                                                                                               | Rules                                |
| :------------- | :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| `hover`        | Mouse enter/leave                      | `type`: `'once'` \| `'alternate'` \| `'repeat'` \| `'state'` — or `method`: `'add'` \| `'remove'` \| `'toggle'` \| `'clear'` | [hover.md](./hover.md)               |
| `click`        | Mouse click                            | Same as `hover`                                                                                                              | [click.md](./click.md)               |
| `interest`     | Accessible hover (hover + focus)       | Same as `hover`                                                                                                              | [hover.md](./hover.md)               |
| `activate`     | Accessible click (click + Enter/Space) | Same as `click`                                                                                                              | [click.md](./click.md)               |
| `viewEnter`    | Element enters viewport                | `type`, `threshold` (0–1), `inset`                                                                                           | [viewenter.md](./viewenter.md)       |
| `viewProgress` | Scroll-driven (ViewTimeline)           | Uses effect `rangeStart`/`rangeEnd`                                                                                          | [viewprogress.md](./viewprogress.md) |
| `pointerMove`  | Mouse movement                         | `hitArea`: `'self'` \| `'root'`; `axis`: `'x'` \| `'y'`                                                                      | [pointermove.md](./pointermove.md)   |
| `animationEnd` | Chain after another effect             | `effectId`: ID of the preceding effect                                                                                       | —                                    |

Use `type` (via `PointerTriggerParams`) for keyframe/named effects, `method` (via `StateParams`) for transition effects.

---

## Sequences

Sequences coordinate multiple effects with staggered timing.

```typescript
{
  offset: 100,                // ms between consecutive items
  offsetEasing: 'quadIn',     // stagger distribution curve
  delay: 0,                   // base delay before the sequence starts
  effects: [
    { effectId: 'card-entrance', listContainer: '.card-grid' },
  ],
}
```

Define reusable sequences in `InteractConfig.sequences` and reference them by `sequenceId`:

```typescript
{
  sequences: {
    'stagger-fade': { offset: 80, offsetEasing: 'quadIn', effects: [{ effectId: 'fade-up', listContainer: '.items' }] },
  },
  interactions: [
    { key: 'section', trigger: 'viewEnter', params: { type: 'once' }, sequences: [{ sequenceId: 'stagger-fade' }] },
  ],
}
```

---

## Named Effects & registerEffects

Register `@wix/motion-presets` before calling `Interact.create`:

```typescript
import { Interact } from '@wix/interact/web';
import * as presets from '@wix/motion-presets';

Interact.registerEffects(presets);
```

Or register selectively:

```typescript
import { FadeIn, ParallaxScroll } from '@wix/motion-presets';
Interact.registerEffects({ FadeIn, ParallaxScroll });
```

Reference in effects:

```typescript
{ namedEffect: { type: 'FadeIn' }, duration: 800, easing: 'ease-out' }
```

For full effect type syntax (`keyframeEffect`, `customEffect`, `TransitionEffect`, `ScrubEffect`), see [full-lean.md](./full-lean.md).

---

## Critical CSS (FOUC Prevention)

`generate(config)` produces CSS that hides entrance elements until their animation plays. See [viewenter.md](./viewenter.md) for full details.

**Rules:**

- Call server-side or at build time.
- Set `data-interact-initial="true"` on the `<interact-element>` (or `initial={true}` on `<Interaction>` in React).
- Only valid for `viewEnter` + `type: 'once'` where source and target are the same element.

```javascript
import { generate } from '@wix/interact/web';

const css = generate(config);
```

Inside `<head>`:

```html
<style>
  {css}
</style>
```

---

## Static API

| Method / Property                   | Description                                                         |
| :---------------------------------- | :------------------------------------------------------------------ |
| `Interact.create(config)`           | Initialize with a config. Returns the instance.                     |
| `Interact.registerEffects(presets)` | Register named effect presets before `create`.                      |
| `Interact.destroy()`                | Tear down all instances.                                            |
| `Interact.forceReducedMotion`       | `boolean` — force reduced-motion behavior regardless of OS setting. |
| `Interact.allowA11yTriggers`        | `boolean` — enable accessibility triggers.                          |
| `Interact.setup(options)`           | Configure global scroll/pointer/viewEnter options.                  |
