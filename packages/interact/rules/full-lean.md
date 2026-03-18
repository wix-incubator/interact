# @wix/interact — Rules

Declarative configuration-driven interaction library. Binds animations to triggers via JSON config.

## Table of Contents

- [Quick Start](#quick-start)
- [Element Binding](#element-binding)
- [Config Structure](#config-structure)
- [Interactions](#interactions)
  - [Source element resolution](#source-element-resolution-interaction)
  - [Target element resolution](#target-element-resolution-effect)
- [Triggers](#triggers)
  - [hover / click](#hover--click)
  - [viewEnter](#viewenter)
  - [viewProgress](#viewprogress)
  - [pointerMove](#pointermove)
  - [animationEnd](#animationend)
- [Effects](#effects)
  - [TimeEffect](#timeeffect-animation-over-time)
  - [ScrubEffect](#scrubeffect-scroll--pointer-driven)
  - [TransitionEffect](#transitioneffect-css-state-toggle)
  - [Animation Payloads](#animation-payloads)
- [Sequences](#sequences)
- [Conditions](#conditions)
- [FOUC Prevention](#fouc-prevention)
- [Common Pitfalls](#common-pitfalls)
- [Static API](#static-api)

---

## Quick Start

Create the full config up-front and pass it in a single `create` call. Subsequent calls create new `Interact` instances.

**Web (Custom Elements):**

```ts
import { Interact } from '@wix/interact/web';
Interact.create(config);
```

**React:**

```ts
import { Interact } from '@wix/interact/react';
Interact.create(config);
```

**Vanilla JS:**

```ts
import { Interact } from '@wix/interact';
const interact = Interact.create(config);
interact.add(element, 'hero'); // bind after element exists in DOM
interact.remove('hero'); // unregister
```

**CDN (no build tools):**

```html
<script type="module">
  import { Interact } from 'https://esm.sh/@wix/interact';
  Interact.create(config);
</script>
```

**Registering presets** — required before using `namedEffect`:

```ts
import * as presets from '@wix/motion-presets';
Interact.registerEffects(presets);
```

Or selectively:

```ts
import { FadeIn, ParallaxScroll } from '@wix/motion-presets';
Interact.registerEffects({ FadeIn, ParallaxScroll });
```

---

## Element Binding

Do NOT add observers/listeners manually. The runtime binds triggers and effects via element keys.

### Web: `<interact-element>`

- MUST set `data-interact-key` to a unique value.
- MUST contain at least one child element (the library targets `.firstElementChild`).
- If an effect targets a different element, that element also needs its own `<interact-element>`.

```html
<interact-element data-interact-key="hero">
  <section class="hero">...</section>
</interact-element>
```

### React: `<Interaction>` component

- MUST set `tagName` to the replaced element's HTML tag.
- MUST set `interactKey` to a unique string.

```tsx
import { Interaction } from '@wix/interact/react';

<Interaction tagName="section" interactKey="hero" className="hero">
  ...
</Interaction>;
```

---

## Config Structure

```ts
type InteractConfig = {
  interactions: Interaction[]; // REQUIRED
  effects?: Record<string, Effect>; // reusable effects referenced by effectId
  sequences?: Record<string, SequenceConfig>; // reusable sequences by sequenceId
  conditions?: Record<string, Condition>; // named guards by id
};
```

All cross-references (by id) MUST point to existing entries. Element keys MUST be stable for the config's lifetime.

---

## Interactions

Each interaction maps a source element + trigger to one or more effects.

```ts
{
  key: string;                   // REQUIRED — matches data-interact-key
  trigger: TriggerType;          // REQUIRED
  params?: TriggerParams;        // trigger-specific options
  effects?: (Effect | EffectRef)[];
  sequences?: (SequenceConfig | SequenceConfigRef)[];
  conditions?: string[];         // condition ids; all must pass
  selector?: string;             // CSS selector to refine element selection
  listContainer?: string;        // CSS selector for list container
  listItemSelector?: string;     // CSS selector for items within listContainer
}
```

At least one of `effects` or `sequences` MUST be provided.

### Source element resolution (Interaction)

The source element is the element the trigger attaches to. Resolved in priority order:

1. **`listContainer` + `listItemSelector`** — trigger attaches to each element matching `listItemSelector` within the `listContainer`.
2. **`listContainer` only** — trigger attaches to each immediate child of the container.
3. **`listContainer` + `selector`** — trigger attaches to the element found via `querySelector` within each immediate child of the container.
4. **`selector` only** — trigger attaches to all elements matching `querySelectorAll` within the root `<interact-element>`.
5. **Fallback** — first child of `<interact-element>` (web) or the root element (react/vanilla).

### Target element resolution (Effect)

The target element is the element the effect animates. Resolved in priority order:

1. **`Effect.key`** — if provided, the target is the `<interact-element>` with matching `data-interact-key`.
2. **Registry Effect's `key`** — if the effect is an `EffectRef`, the `key` from the referenced registry entry is used.
3. **Fallback to `Interaction.key`** — the source element acts as the target.
4. After resolving the root target, `selector`, `listContainer`, and `listItemSelector` on the effect further refine which child elements are animated, following the same priority order as source resolution above.

---

## Triggers

| Trigger        | Description                     | Accessible variant                          |
| :------------- | :------------------------------ | :------------------------------------------ |
| `hover`        | Mouse enter/leave               | `interest` (hover + focusin/out)            |
| `click`        | Mouse click                     | `activate` (click + keydown on Enter/Space) |
| `viewEnter`    | Element enters viewport         | —                                           |
| `viewProgress` | Scroll-driven (ViewTimeline)    | —                                           |
| `pointerMove`  | Continuous pointer motion       | —                                           |
| `animationEnd` | Fires after an effect completes | —                                           |

### hover / click

Use `type` (via `PointerTriggerParams`) for keyframe/named effects, `method` (via `StateParams`) for transitions.

**PointerTriggerParams** (`type`):

| Type                    | hover behavior                          | click behavior                   |
| :---------------------- | :-------------------------------------- | :------------------------------- |
| `'alternate'` (default) | Play on enter, reverse on leave         | Alternate play/reverse per click |
| `'repeat'`              | Play on enter, stop and rewind on leave | Restart per click                |
| `'once'`                | Play once on first enter only           | Play once on first click only    |
| `'state'`               | Play on enter, pause on leave           | Toggle play/pause per click      |

**StateParams** (`method`) — for `TransitionEffect`:

| Method               | hover behavior                      | click behavior         |
| :------------------- | :---------------------------------- | :--------------------- |
| `'toggle'` (default) | Add on enter, remove on leave       | Toggle per click       |
| `'add'`              | Add on enter; leave does NOT remove | Add on click           |
| `'remove'`           | Remove on enter                     | Remove on click        |
| `'clear'`            | Clear/reset all states on enter     | Clear/reset all states |

**Hit-area shift warning:** When a hover effect changes the size or position of the hovered element (e.g., `transform: scale(…)`), MUST use a separate source and target elements. Otherwise the hit-area shifts, causing rapid enter/leave events and flickering. Use `selector` to target a child element, or set the effect's `key` to a different element.

### viewEnter

```ts
params: {
  type: 'once' | 'repeat' | 'alternate' | 'state';
  threshold?: number;  // 0–1, IntersectionObserver threshold
  inset?: string;      // vertical rootMargin, e.g. '-100px'
}
```

**Critical rule:** When source and target are the **same element**, MUST use `type: 'once'`. For `repeat` / `alternate` / `state`, use **separate** source and target elements — animating the observed element can cause it to leave/re-enter the viewport, causing rapid re-triggers.

### viewProgress

Scroll-driven animations using ViewTimeline. Progress is driven by scroll position. Control the range via `rangeStart`/`rangeEnd` on the `ScrubEffect`.

**Critical rule:** Replace ALL `overflow: hidden` with `overflow: clip` on every element between the trigger source and the scroll container. `overflow: hidden` creates a new scroll context that breaks ViewTimeline. If using tailwind replace all `overflow-hidden` classes with `oveflow-clip`.

**Sticky container pattern** — for scroll-driven animations inside a stuck `position: sticky` container:

- Tall wrapper (`key`): enough height to create scroll distance (e.g., `height: 300vh`). This is the ViewTimeline source.
- Sticky child (`position: sticky; top: 0; height: 100vh`): stays fixed while the wrapper scrolls.
- Use `rangeStart/rangeEnd` with `name: 'contain'` to animate only during the stuck phase.

### pointerMove

```ts
params: {
  hitArea?: 'self' | 'root';  // 'self' = source element bounds, 'root' = viewport
  axis?: 'x' | 'y';           // only for keyframeEffect; selects which axis maps to 0–1 progress
}
```

**Rules:**

- Source element MUST NOT have `pointer-events: none`.
- Avoid using the same element as both source and target with `transform` effects — the transform shifts the hit area. Use `selector` to target a child.
- Use a `(hover: hover)` media condition to disable on touch-only devices. On touch-only devices prefer fallback to `viewEnter` or `viewProgress` based interactions.
- For 2D effects, use `namedEffect` mouse presets or `customEffect`. `keyframeEffect` only supports a single axis.
- For independent 2-axis control with keyframes, use two separate interactions (one `axis: 'x'`, one `axis: 'y'`) with `composite` value of `'add'`/`'accumulate'` on the latter effect to combine them.

**`centeredToTarget`** — set `true` when source and target are different elements, or when using `hitArea: 'root'` with a specific target, so the coordinate origin is centered on the target.

**Progress object** (for `customEffect`):

```ts
{ x: number; y: number; v?: { x: number; y: number }; active?: boolean }
```

### animationEnd

```ts
params: {
  effectId: string;
} // the effect to wait for
```

Fires when the specified effect completes on the source element. Useful for chaining sequences.

---

## Effects

Each effect applies a visual change to a target element. An effect is either inline or referenced by `effectId` from the `effects` registry. See [Target element resolution](#target-element-resolution-effect) for how the target is determined.

### Common fields

```ts
{
  key?: string;              // target element key; omit to target the source
  effectId?: string;         // reference to effects registry (EffectRef)
  conditions?: string[];     // all must pass
  selector?: string;         // CSS selector to refine target
  listContainer?: string;
  listItemSelector?: string;
  composite?: 'replace' | 'add' | 'accumulate';
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
}
```

**`fill` guidance:**

- `'both'` — preferred for scroll-driven (`viewProgress`) and pointer-driven (`pointerMove`) effects. Also for `type` of `alternate` or `repeat` `viewEnter`, `hover`, and `click` effects.
- `'backwards'` — good for entrance animations with `type: 'once'` (applies initial keyframe before playing).

**`composite`** — controls how this effect combines with others on the same property (transforms & filters):

- `'replace'` (default): fully replaces prior values.
- `'add'`: function values add up sequentially.
- `'accumulate'`: similar function values' arguments add up, new functions add up sequentially.

### TimeEffect (animation over time)

Used with `hover`, `click`, `viewEnter`, `animationEnd` triggers.

```ts
{
  duration: number;            // REQUIRED (ms)
  easing?: string;             // CSS easing or named easing from `@wix/motion`
  delay?: number;              // ms
  iterations?: number;         // >=1 or Infinity, 0 for Infinity
  alternate?: boolean;
  reversed?: boolean;
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
  composite?: 'replace' | 'add' | 'accumulate';
  // + one animation payload (see below)
}
```

### ScrubEffect (scroll / pointer driven)

Used with `viewProgress` and `pointerMove` triggers.

```ts
{
  rangeStart: RangeOffset;
  rangeEnd: RangeOffset;
  easing?: string;             // CSS easing or named easing from `@wix/motion`
  iterations?: number;         // NOT Infinity
  alternate?: boolean;
  reversed?: boolean;
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
  composite?: 'replace' | 'add' | 'accumulate';
  centeredToTarget?: boolean;
  transitionDuration?: number; // ms, smoothing on progress jumps
  transitionDelay?: number;
  transitionEasing?: string;
  // + one animation payload (see below)
}
```

**RangeOffset:**

```ts
{
  name?: 'entry' | 'exit' | 'contain' | 'cover' | 'entry-crossing' | 'exit-crossing';
  offset: { value: number; unit: 'percentage' | 'px' | 'em' | 'rem' | 'vh' | 'vw' | 'vmin' | 'vmax' }
}
```

| Range name | Meaning                                              |
| :--------- | :--------------------------------------------------- |
| `entry`    | Element entering viewport                            |
| `exit`     | Element exiting viewport                             |
| `contain`  | Element fully within view                            |
| `cover`    | Full range from `entry` through `contain` and `exit` |

### TransitionEffect (CSS state toggle)

Used with `hover` / `click` triggers. Pair with `StateParams` (`method`).

```ts
// Shared timing for all properties:
{
  transition: {
    duration?: number; delay?: number; easing?: string;
    styleProperties: [{ name: string; value: string }]
  }
}

// Per-property timing:
{
  transitionProperties: [
    { name: string; value: string; duration?: number; delay?: number; easing?: string }
  ]
}
```

CSS property names use **camelCase** (e.g. `'backgroundColor'`, `'borderRadius'`).

### Animation Payloads

Exactly one MUST be provided per TimeEffect or ScrubEffect:

1. **`namedEffect`** (preferred) — pre-built presets from `@wix/motion-presets`. GPU-friendly and tuned.

   ```ts
   namedEffect: { type: 'FadeIn', /* preset options */ }
   ```

   Available presets:

   | Category | Presets                                                                                                                                                                                                                                                                                      |
   | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Entrance | `FadeIn`, `SlideIn`, `BounceIn`, `FlipIn`, `ArcIn`, `BlurIn`, `ShuttersIn`, `CurveIn`, `DropIn`, `ExpandIn`, `FloatIn`, `FoldIn`, `GlideIn`, `ShapeIn`, `RevealIn`, `SpinIn`, `TiltIn`, `TurnIn`, `WinkIn`                                                                                   |
   | Ongoing  | `Pulse`, `Spin`, `Wiggle`, `Bounce`, `Breathe`, `Flash`, `Flip`, `Fold`, `Jello`, `Poke`, `Rubber`, `Swing`, `Cross`                                                                                                                                                                         |
   | Scroll   | `ParallaxScroll`, `FadeScroll`, `RevealScroll`, `TiltScroll`, `MoveScroll`, `PanScroll`, `BlurScroll`, `FlipScroll`, `GrowScroll`, `SlideScroll`, `SpinScroll`, `ArcScroll`, `ShapeScroll`, `ShuttersScroll`, `ShrinkScroll`, `SkewPanScroll`, `Spin3dScroll`, `StretchScroll`, `TurnScroll` |
   | Mouse    | `TrackMouse`, `Tilt3DMouse`, `Track3DMouse`, `SwivelMouse`, `AiryMouse`, `BounceMouse`, `ScaleMouse`, `BlurMouse`, `SpinMouse`, `SkewMouse`, `BlobMouse`, `CustomMouse`                                                                                                                      |
   - Scroll presets (`*Scroll`) with `viewProgress` MUST include `range: 'in' | 'out' | 'continuous'` in options; prefer `'continuous'`.
   - Mouse presets are preferred over `keyframeEffect` for `pointerMove` 2D effects.
   - Do NOT guess preset option names/types; omit unknown options and rely on defaults.

2. **`keyframeEffect`** — custom keyframe animations.

   ```ts
   keyframeEffect: { name: 'my-effect', keyframes: [{ opacity: 0 }, { opacity: 1 }] }
   ```

   Keyframes use standard CSS/WAAPI object format. Property names are in JS format (cameCase).

3. **`customEffect`** — imperative update callback. Last resort.

   ```ts
   customEffect: (element: Element, progress: number | ProgressObject) => void
   ```

---

## Sequences

Coordinate multiple effects with staggered timing. Prefer sequences over manual delay stagger.

```ts
{
  effects: (Effect | EffectRef)[];      // REQUIRED
  delay?: number;                       // ms before sequence starts
  offset?: number;                      // ms offset between consecutive effects
  offsetEasing?: string;                // offset-stagger distribution curve
  sequenceId?: string;                  // for caching/referencing
  conditions?: string[];
}
```

`offsetEasing` values: `'linear'`, `'quadIn'`, `'quadOut'`, `'sineOut'`, `'cubicIn'`, `'cubicOut'`, `'cubicInOut'`, `'cubic-bezier(...)'`, or `'linear(...)'`.

**Example — staggered list entrance:**

```ts
{
  interactions: [{
    key: 'card-grid',
    trigger: 'viewEnter',
    params: { type: 'once', threshold: 0.3 },
    sequences: [{
      offset: 100,
      offsetEasing: 'quadIn',
      effects: [{ effectId: 'card-entrance', listContainer: '.card-grid' }],
    }],
  }],
  effects: {
    'card-entrance': {
      namedEffect: { type: 'FadeIn' }, duration: 600, easing: 'ease-out', fill: 'backwards',
    },
  },
}
```

Reusable sequences can be defined in `InteractConfig.sequences` and referenced by `sequenceId`.

---

## Conditions

Named guards that gate interactions/effects.

```ts
conditions: {
  'Desktop': { type: 'media', predicate: '(min-width: 768px)' },
  'HoverDevice': { type: 'media', predicate: '(hover: hover)' },
  'ReducedMotion': { type: 'media', predicate: '(prefers-reduced-motion: reduce)' },
  'OddItems': { type: 'selector', predicate: ':nth-of-type(odd)' },
}
```

| Type        | Predicate                                                       |
| :---------- | :-------------------------------------------------------------- |
| `media`     | CSS media query without `@media` (e.g., `'(min-width: 768px)'`) |
| `container` | CSS container query condition                                   |
| `selector`  | CSS selector; `&` is replaced with the base element selector    |

Attach via `conditions: ['Desktop']` on interactions, effects, or sequences. All must pass.

---

## FOUC Prevention

Use `generate(config)` to create critical CSS that hides elements until their entrance animation plays.

```ts
import { generate } from '@wix/interact/web';
const css = generate(config);
// Include in <head>: <style>${css}</style>
```

**Rules:**

- Should be called server-side or at build time. Can also be called on client-side and be injected if page content is initially hidden, e.g. behind a loader/splash screen.
- Set `data-interact-initial="true"` on the effect's root element or `<interact-element>` (or `initial={true}` on `<Interaction>`).
- Only valid for `viewEnter` + `type: 'once'` where source and target are the same element.
- Do NOT use for `hover`, `click`, or `viewEnter` with `repeat`/`alternate`/`state`.
- For `repeat`/`alternate`/`state`, manually apply the initial keyframe as a style and use `fill: 'both'`.

---

## Common Pitfalls

- **`overflow: hidden` breaks `viewProgress`** — use `overflow: clip` instead on all ancestors between source and scroll container.
- **Stacking contexts and `viewProgress`**: Avoid `transform`, `filter`, `perspective`, `opacity < 1`, `will-change`, `contain: paint/layout/size` on the target or its ancestors. These can prevent or freeze ViewTimeline. Apply such styles to an inner child instead.
- **Perspective**: Prefer `transform: perspective(...)` inside keyframes. Use the CSS `perspective` property only when multiple children share the same `perspective-origin`.
- **Unknown preset options**: If you don't know the expected type/structure for a `namedEffect` param, omit it — rely on defaults rather than guessing.
- **Reduced motion**: Use conditions to provide gentler alternatives (shorter durations, fewer transforms, no perpetual motion) for users who prefer reduced motion.

---

## Static API

| Method / Property                   | Description                                                         |
| :---------------------------------- | :------------------------------------------------------------------ |
| `Interact.create(config)`           | Initialize with a config. Returns the instance.                     |
| `Interact.registerEffects(presets)` | Register named effect presets before `create`.                      |
| `Interact.destroy()`                | Tear down all instances.                                            |
| `Interact.forceReducedMotion`       | `boolean` — force reduced-motion behavior.                          |
| `Interact.allowA11yTriggers`        | `boolean` — enable accessibility triggers (`interest`, `activate`). |
| `Interact.setup(options)`           | Configure global scroll/pointer/viewEnter options.                  |
