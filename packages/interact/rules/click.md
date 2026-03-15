# Click Trigger Rules for @wix/interact

This document contains rules for generating click-triggered interactions in `@wix/interact`.

**Accessible click**: Use `trigger: 'activate'` instead of `trigger: 'click'` to also respond to keyboard activation (Enter / Space).

---

## Rule 1: keyframeEffect / namedEffect with PointerTriggerParams

Use `keyframeEffect` or `namedEffect` when the click should play an animation (CSS or WAAPI). Pair with `PointerTriggerParams` to control playback behavior.

Always include `fill: 'both'` so the effect remains applied while finished and is not garbage-collected, allowing it to be efficiently toggled.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'click',
    params: {
        type: '[POINTER_TYPE]'
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
            namedEffect: { type: '[NAMED_EFFECT_TYPE]' },

            fill: '[FILL_MODE]',
            reversed: [INITIAL_REVERSED_BOOL],
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

- `[SOURCE_KEY]` — identifier matching the `data-interact-key` attribute on the element that listens for clicks.
- `[TARGET_KEY]` — identifier matching the `data-interact-key` attribute on the element that animates. Same as `[SOURCE_KEY]` for self-targeting, or different for cross-targeting.
- `[POINTER_TYPE]` — `PointerTriggerParams.type`. One of:
  - `'alternate'` — plays forward on first click, reverses on next click. Most common for toggles.
  - `'repeat'` — restarts the animation from the beginning on each click.
  - `'once'` — plays once on the first click and never again.
  - `'state'` — pauses/resumes the animation on each click. Useful for continuous loops (`iterations: Infinity`).
- `[KEYFRAMES]` — WAAPI-style keyframes format as array of keyframe objects or object of properties to arrays of values.
- `[EFFECT_NAME]` — arbitrary string identifier for a `keyframeEffect`.
- `[NAMED_EFFECT_TYPE]` — pre-built effect from `@wix/motion-presets` (e.g. `'FadeIn'`, `'SlideIn'`, `'Pulse'`, `'Breathe'`).
- `[INITIAL_REVERSED_BOOL]` — optional. `true` to start in the "played" state so the first click reverses the animation.
- `[FILL_MODE]` — usually `'both'`. Keeps the final state applied while hovering, and prevents garbage-collection of animation when finished.
- `[DURATION_MS]` — animation duration in milliseconds. Typical click range: 100–500.
- `[EASING_FUNCTION]` — CSS easing string (e.g. `'ease-out'`, `'ease-in-out'`, `'cubic-bezier(0.4, 0, 0.2, 1)'`), or named easing from `@wix/motion`.
- `[DELAY_MS]` — optional delay before the effect starts, in milliseconds.
- `[ITERATIONS]` — optional. Number of iterations, or `Infinity` for continuous loops (pair with `type: 'state'`).
- `[ALTERNATE_BOOL]` — optional. `true` to alternate direction on every other iteration.
- `[UNIQUE_EFFECT_ID]` — optional. String identifier used for animation chaining or sequence references.

---

## Rule 2: transition / transitionProperties with StateParams

Use `transition` or `transitionProperties` when the click should toggle CSS property values via CSS transitions rather than keyframe animations. Pair with `StateParams` to control how the style is applied.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'click',
    params: {
        method: '[TRANSITION_METHOD]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',

            // --- pick ONE of the two transition forms ---
            transition: {
                duration: [DURATION_MS],
                delay: [DELAY_MS],
                easing: '[EASING_FUNCTION]',
                styleProperties: [
                    { name: '[CSS_PROP]', value: '[VALUE]' }
                ]
            },
            // OR (when each property needs its own timing)
            transitionProperties: [
                {
                    name: '[CSS_PROP]',
                    value: '[VALUE]',
                    duration: [DURATION_MS],
                    delay: [DELAY_MS],
                    easing: '[EASING_FUNCTION]'
                }
            ]
        }
    ]
}
```

### Variables

- `[SOURCE_KEY]` / `[TARGET_KEY]` — same as Rule 1.
- `[TRANSITION_METHOD]` — `StateParams.method`. One of:
  - `'add'` — adds the state on click.
  - `'remove'` — removes the state on click.
  - `'toggle'` — toggles the state on each click. Default.
  - `'clear'` — clears all previously applied states on click.
- `[CSS_PROP]` — CSS property name as a string in camelCase format (e.g. `'backgroundColor'`, `'borderRadius'`, `'opacity'`).
- `[VALUE]` — target CSS value for the property.
- `[DURATION_MS]` — transition duration in milliseconds.
- `[DELAY_MS]` — optional transition delay in milliseconds.
- `[EASING_FUNCTION]` — CSS easing string, or named easing from `@wix/motion`.

Use `transition` when all properties share timing. Use `transitionProperties` when each property needs independent `duration`, `delay`, or `easing`.

---

## Rule 3: Sequences

Use sequences when a click should sync/stagger animations across multiple elements.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'click',
    params: {
        type: '[POINTER_TYPE]'
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
        fill: 'both',
        keyframeEffect: {
            name: '[EFFECT_NAME]',
            keyframes: [KEYFRAMES]
        }
    }
}
```

### Variables

- `[SOURCE_KEY]` — same as Rule 1.
- `[POINTER_TYPE]` — same as Rule 1.
- `[OFFSET_MS]` — time offset between each child's animation start, in milliseconds.
- `[OFFSET_EASING]` — easing curve for the stagger distribution (e.g. `'sineOut'`, `'linear'`).
- `[EFFECT_ID]` — string key referencing an entry in the top-level `effects` map.
- `[LIST_CONTAINER_SELECTOR]` — CSS selector for the container whose direct children will be staggered.
- Effect definition variables (`[DURATION_MS]`, `[EASING_FUNCTION]`, `[EFFECT_NAME]`, `[KEYFRAMES]`) — same as Rule 1.
