# ViewEnter Trigger Rules for @wix/interact

This document contains rules for generating viewport-based interactions using the `@wix/interact`. ViewEnter triggers use IntersectionObserver to detect when elements enter the viewport and are ideal for entrance animations, scroll-triggered content reveals, and lazy-loading effects.

---

> **Important:** When the source (trigger) and target (effect) elements are the **same element** use ONLY `type: 'once'`. For all other types (`'repeat'`, `'alternate'`, `'state'`), MUST use **separate** source and target elements — animating the observed element itself can cause it to leave/re-enter the viewport, leading to rapid re-triggers or the animation never firing.

---

## Preventing Flash of Unstyled Content (FOUC)

Use `generate(config)` from `@wix/interact` server-side or at build time to produce critical CSS that hides entrance elements until their animation plays.

**Usage:**

- If possible SHOULD be called server-side or at build time - possible also in client, e.g. when entire content is initially hidden
- MUST set `data-interact-initial="true"` on the root element, i.e. with `data-interact-key`, or `<Interaction initial={true}>` for React integration
- Only valid for `viewEnter` + `params.type: 'once'` where source and target are the same element
- Do NOT use for `hover`, `click`, or `viewEnter` with `repeat`/`alternate`/`state` types
- For `repeat`/`alternate`/`state` types, MUST manually apply the initial keyframe as style on the target element and use `fill: 'backwards'` or `fill: 'both'` to keep the effect applied when finished, rewound, or reversed

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

const html = `
<head>
  <style>${css}</style>
</head>
<body>
  <interact-element data-interact-key="hero" data-interact-initial="true">
    <section class="hero">...</section>
  </interact-element>
</body>
`;
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

- `[SOURCE_KEY]` — identifier matching the `data-interact-key` attribute on the element that is observed for viewport intersection.
- `[TARGET_KEY]` — identifier matching the `data-interact-key` attribute on the element that animates.
- `[VIEW_ENTER_TYPE]` — `ViewEnterParams.type`. One of:
  - `'once'` — plays once when the element first enters the viewport and never again. Source and target may be the same element.
  - `'repeat'` — restarts the animation every time the element enters the viewport. Use separate source and target.
  - `'alternate'` — plays forward on enter, reverses on leave. Use separate source and target.
  - `'state'` — pauses/resumes the animation on enter/leave. Useful for continuous loops (`iterations: Infinity`). Use separate source and target.
- `[VISIBILITY_THRESHOLD]` — number between 0–1 indicating how much of the source element must be visible to trigger (e.g. `0.3` = 30%).
- `[VIEWPORT_INSETS]` — string adjusting the viewport detection area (e.g. `'-100px'` extends it, `'50px'` shrinks it).
- `[KEYFRAMES]` — WAAPI-style keyframes format as array of keyframe objects or object of properties to arrays of values.
- `[EFFECT_NAME]` — arbitrary string identifier for a `keyframeEffect`.
- `[NAMED_EFFECT_DEFINITION]` — object with properties of pre-built effect from `@wix/motion-presets`.
- `[FILL_MODE]` — `'backwards'` for entrance animations (applies initial keyframe before playing), `'both'` for looping or state-based animations.
- `[DURATION_MS]` — animation duration in milliseconds. Typical entrance range: 500–1200.
- `[EASING_FUNCTION]` — CSS easing string (e.g. `'ease-out'`, `'ease-in-out'`, `'cubic-bezier(0.16, 1, 0.3, 1)'`), or named easing from `@wix/motion`.
- `[DELAY_MS]` — optional delay before the effect starts, in milliseconds.
- `[ITERATIONS]` — optional. Number of iterations, or `Infinity` for continuous loops (pair with `type: 'state'`).
- `[ALTERNATE_BOOL]` — optional. `true` to alternate direction on every other iteration.
- `[UNIQUE_EFFECT_ID]` — optional. String identifier used for animation chaining or sequence references.

---

## Rule 2: customEffect with ViewEnterParams

Use `customEffect` when you need imperative control over the animation (e.g. counters, canvas drawing, custom DOM manipulation). The callback receives the element and a `progress` value (0–1) driven by the animation timeline.

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

- `[SOURCE_KEY]` / `[TARGET_KEY]` — same as Rule 1.
- `[VIEW_ENTER_TYPE]` — same as Rule 1.
- `[VISIBILITY_THRESHOLD]` / `[VIEWPORT_INSETS]` — same as Rule 1.
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
                {
                    effectId: '[EFFECT_ID]',
                    listContainer: '[LIST_CONTAINER_SELECTOR]'
                }
            ]
        }
    ]
}
```

The referenced `effectId` must be defined in the top-level `effects` map of the `InteractConfig`:

```typescript
effects: {
    '[EFFECT_ID]': {
        duration: [DURATION_MS],
        easing: '[EASING_FUNCTION]',
        fill: '[FILL_MODE]',
        keyframeEffect: {
            name: '[EFFECT_NAME]',
            keyframes: [KEYFRAMES]
        }
    }
}
```

### Variables

- `[SOURCE_KEY]` — same as Rule 1.
- `[VIEW_ENTER_TYPE]` — same as Rule 1.
- `[VISIBILITY_THRESHOLD]` / `[VIEWPORT_INSETS]` — same as Rule 1.
- `[OFFSET_MS]` — time offset between each child's animation start, in milliseconds.
- `[OFFSET_EASING]` — easing curve for the stagger distribution (e.g. `'sineOut'`, `'linear'`, `'quadIn'`).
- `[EFFECT_ID]` — string key referencing an entry in the top-level `effects` map.
- `[LIST_CONTAINER_SELECTOR]` — CSS selector for the container whose direct children will be staggered.
- Effect definition variables (`[DURATION_MS]`, `[EASING_FUNCTION]`, `[FILL_MODE]`, `[EFFECT_NAME]`, `[KEYFRAMES]`) — same as Rule 1.
