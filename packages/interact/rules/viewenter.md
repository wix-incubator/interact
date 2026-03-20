# ViewEnter Trigger Rules for @wix/interact

This document contains rules for generating viewport-based interactions using the `@wix/interact`. ViewEnter triggers use IntersectionObserver to detect when elements enter the viewport and are ideal for entrance animations, scroll-triggered content reveals, and lazy-loading effects.

---

> **CRITICAL:** When the source (trigger) and target (effect) elements are the **same element**, use ONLY `type: 'once'`. For all other types (`'repeat'`, `'alternate'`, `'state'`), MUST use **separate** source and target elements — animating the observed element itself can cause it to leave/re-enter the viewport, leading to rapid re-triggers or the animation never firing.

## Table of Contents

- [Preventing Flash of Unstyled Content (FOUC)](#preventing-flash-of-unstyled-content-fouc)
- [Rule 1: keyframeEffect / namedEffect with ViewEnterParams](#rule-1-keyframeeffect--namedeffect-with-viewenterparams)
- [Rule 2: customEffect with ViewEnterParams](#rule-2-customeffect-with-viewenterparams)
- [Rule 3: Sequences with ViewEnterParams](#rule-3-sequences-with-viewenterparams)

---

## Preventing Flash of Unstyled Content (FOUC)

Use `generate(config)` from `@wix/interact` server-side or at build time to produce critical CSS that hides entrance elements until their animation plays.

**Usage:**

- Should be called server-side or at build time. Can also be called on the client if the page content is initially hidden (e.g. behind a loader/splash screen).
- MUST set `data-interact-initial="true"` on the root element (the one with `data-interact-key`), or `<Interaction initial={true}>` for React.
- Only valid for `viewEnter` + `params.type: 'once'` where source and target are the same element.
- Do NOT use for `viewEnter` with `repeat`/`alternate`/`state` types. For those, MUST manually apply the initial keyframe as style on the target element and use `fill: 'both'`.
- `generate(config)` should still be called if other interactions in the config need it; set `initial` only on the relevant `viewEnter` + `type: 'once'` elements.

```typescript
import { generate } from '@wix/interact';

const config: InteractConfig = {
  interactions: [
    {
      key: 'hero',
      trigger: 'viewEnter',
      params: { type: 'once', threshold: 0.2 },
      effects: [{ namedEffect: { type: 'FadeIn' }, duration: 800 }],
    },
  ],
};

const css = generate(config);

/* then add the styles to the document's <head>
 * <style>${css}</style>
 */
```

**Web integration:**

```html
<interact-element data-interact-key="hero" data-interact-initial="true">
  <section class="hero">...</section>
</interact-element>
```

**React integration:**

```tsx
<Interaction tagName="section" interactKey="hero" initial={true} className="hero">
  ...
</Interaction>
```

## Rule 1: keyframeEffect / namedEffect with ViewEnterParams

Use `keyframeEffect` or `namedEffect` when the viewEnter should play an animation (CSS or WAAPI). Pair with `params: ViewEnterParams` to configure the IntersectionObserver trigger.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'viewEnter',
    params: {
        type: '[VIEW_ENTER_TYPE]',
        threshold: [VISIBILITY_THRESHOLD],
        inset: '[VIEWPORT_INSETS]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            selector: '[TARGET_SELECTOR]',

            // --- pick ONE of the two effect types ---
            keyframeEffect: {
                name: '[EFFECT_NAME]',
                keyframes: [KEYFRAMES],
            },
            // OR
            namedEffect: [NAMED_EFFECT_DEFINITION],

            fill: '[FILL_MODE]',
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]',
            delay: [DELAY_MS],
            iterations: [ITERATIONS],
            alternate: [ALTERNATE_BOOL],
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

### Variables

- `[SOURCE_KEY]` — identifier matching the element's key (`data-interact-key` for web/vanilla, `interactKey` for React). The **source element** is observed for viewport intersection. This is the element the IntersectionObserver watches.
- `[TARGET_KEY]` — identifier matching the element's key on the element that animates.
- `[TARGET_SELECTOR]` - optional. Selector for the child element to select inside the root element. For `type` of `'alternate'`/`'repeat'`/`'state'` MUST either use a separate `[TARGET_KEY]` from `[SOURCE_KEY]` or `selector` for selecting a child element as target.
- `[VIEW_ENTER_TYPE]` — `ViewEnterParams.type`. One of:
  - `'once'` — plays once when the source element first enters the viewport and never again. Source and target may be the same element.
  - `'repeat'` — restarts the animation every time the source element enters the viewport. Use separate source and target.
  - `'alternate'` — plays forward when the source element enters the viewport, reverses when it leaves. Use separate source and target.
  - `'state'` — resumes on enter, pauses on leave. Useful for continuous loops (`iterations: Infinity`). Use separate source and target.
- `[VISIBILITY_THRESHOLD]` — optional. Number between 0–1 indicating how much of the source element must be visible to trigger (e.g. `0.3` = 30%).
- `[VIEWPORT_INSETS]` — optional. String adjusting the viewport detection area (e.g. `'-100px'` extends it, `'50px'` shrinks it).
- `[KEYFRAMES]` — array of keyframe objects (e.g. `[{ opacity: 0 }, { opacity: 1 }]`). Property names in camelCase.
- `[EFFECT_NAME]` — unique string identifier for a `keyframeEffect`.
- `[NAMED_EFFECT_DEFINITION]` — object with properties of pre-built effect from `@wix/motion-presets`. Refer to motion-presets rules for available presets and their options.
- `[FILL_MODE]` — `'backwards'` for entrance animations with `type: 'once'` (applies initial keyframe before playing). `'both'` for `'alternate'`, `'repeat'`, or `'state'` types.
- `[DURATION_MS]` — animation duration in milliseconds.
- `[EASING_FUNCTION]` — CSS easing string (e.g. `'ease-out'`, `'ease-in-out'`, `'cubic-bezier(0.16, 1, 0.3, 1)'`), or named easing from `@wix/motion`.
- `[DELAY_MS]` — optional delay before the effect starts, in milliseconds.
- `[ITERATIONS]` — optional. Number of iterations, or `Infinity` for continuous loops. Primarily useful with `type: 'state'`.
- `[ALTERNATE_BOOL]` — optional. `true` to alternate direction on every other iteration (within a single playback).
- `[UNIQUE_EFFECT_ID]` — optional. String identifier used by `animationEnd` triggers for chaining, and by sequences for referencing effects.

---

## Rule 2: customEffect with ViewEnterParams

Use `customEffect` when you need imperative control over the animation (e.g. counters, canvas drawing, custom DOM manipulation). The callback receives the target element and a `progress` value (0–1) driven by the animation timeline.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'viewEnter',
    params: {
        type: '[VIEW_ENTER_TYPE]',
        threshold: [VISIBILITY_THRESHOLD],
        inset: '[VIEWPORT_INSETS]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            customEffect: [CUSTOM_EFFECT_CALLBACK],
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

### Variables

- `[SOURCE_KEY]` / `[TARGET_KEY]` / `[VIEW_ENTER_TYPE]` / `[VISIBILITY_THRESHOLD]` / `[VIEWPORT_INSETS]` — same as Rule 1.
- `[CUSTOM_EFFECT_CALLBACK]` — function with signature `(element: HTMLElement, progress: number) => void`. Called on each animation frame with `progress` from 0 to 1.
- `[DURATION_MS]` — animation duration in milliseconds.
- `[EASING_FUNCTION]` — CSS easing string, or named easing from `@wix/motion`.
- `[UNIQUE_EFFECT_ID]` — optional. String identifier used for animation chaining.

---

## Rule 3: Sequences with ViewEnterParams

Use sequences when a viewEnter should sync/stagger animations across multiple elements.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'viewEnter',
    params: {
        type: '[VIEW_ENTER_TYPE]',
        threshold: [VISIBILITY_THRESHOLD],
        inset: '[VIEWPORT_INSETS]'
    },
    sequences: [
        {
            offset: [OFFSET_MS],
            offsetEasing: '[OFFSET_EASING]',
            effects: [
                // can be an inline Effect, or a reference to an effect defined in top level `effects` map
                {
                    effectId: '[EFFECT_ID]',
                    listContainer: '[LIST_CONTAINER_SELECTOR]'
                }
            ]
        }
    ]
}
```

Each `[EFFECT_ID]` must be defined in the top-level `effects` map of the `InteractConfig`:

```typescript
effects: {
    '[EFFECT_ID]': {
        duration: [DURATION_MS],
        easing: '[EASING_FUNCTION]',
        fill: '[FILL_MODE]',
        // keyframeEffect or namedEffect
        keyframeEffect: {
            name: '[EFFECT_NAME]',
            keyframes: [KEYFRAMES]
        }
    }
}
```

### Variables

- `[SOURCE_KEY]` / `[VIEW_ENTER_TYPE]` / `[VISIBILITY_THRESHOLD]` / `[VIEWPORT_INSETS]` — same as Rule 1.
- `[OFFSET_MS]` — time offset between each child's animation start, in milliseconds.
- `[OFFSET_EASING]` — easing curve for the stagger distribution (e.g. `'sineOut'`, `'linear'`, `'quadIn'`).
- `[EFFECT_ID]` — string key referencing an entry in the top-level `effects` map. Same concept as `[UNIQUE_EFFECT_ID]` in Rule 1.
- `[LIST_CONTAINER_SELECTOR]` — CSS selector for the container whose direct children will be staggered.
- Effect definition variables (`[DURATION_MS]`, `[EASING_FUNCTION]`, `[FILL_MODE]`, `[EFFECT_NAME]`, `[KEYFRAMES]`) — same as Rule 1.
