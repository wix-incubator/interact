# PointerMove Trigger Rules for @wix/interact

These rules help generate pointer-driven interactions using `@wix/interact`. PointerMove triggers create real-time animations that respond to mouse movement over elements or the entire viewport.

## Table of Contents

- [Trigger Source Elements with `hitArea: 'self'`](#trigger-source-elements-with-hitarea-self)
- [PointerMoveParams](#pointermoveparams)
- [Progress Object Structure](#progress-object-structure)
- [Centering with `centeredToTarget`](#centering-with-centeredtotarget)
- [Device Conditions](#device-conditions)
- [Rule 1: namedEffect](#rule-1-namedeffect)
- [Rule 2: keyframeEffect with Single Axis](#rule-2-keyframeeffect-with-single-axis)
- [Rule 3: Two keyframeEffects with Two Axes and `composite`](#rule-3-two-keyframeeffects-with-two-axes-and-composite)
- [Rule 4: customEffect](#rule-4-customeffect)

## Trigger Source Elements with `hitArea: 'self'`

When using `hitArea: 'self'`, the source element is the hit area for pointer tracking:

- The source element **MUST NOT** have `pointer-events: none` — it needs to receive pointer events.
- **MUST AVOID** using the same element as both source and target with effects that change size or position (e.g. `transform: translate(…)`, `scale(…)`). The transform shifts the hit area, causing jittery re-entry cycles. Instead, use `selector` to target a child element for the animation.

---

## PointerMoveParams

`params` object for `pointerMove` interactions:

```typescript
type PointerMoveParams = {
  hitArea?: 'root' | 'self';
  axis?: 'x' | 'y';
};
```

### Properties

- `hitArea` — determines where mouse movement is tracked:
  - `'self'` — tracks mouse within the source element's bounds only. Use for local mouse-tracking effects on a specific element.
  - `'root'` — tracks mouse anywhere in the viewport. Use for global cursor followers, ambient effects.
- `axis` — restricts pointer tracking to a single axis. Only relevant when using `keyframeEffect`:
  - `'x'` — maps horizontal pointer position to 0–1 progress for keyframe interpolation.
  - `'y'` — maps vertical pointer position to 0–1 progress for keyframe interpolation. **Default** when `keyframeEffect` is used.
  - When omitted with `namedEffect` or `customEffect`, both axes are available via the 2D progress object.

---

## Progress Object Structure

When using `customEffect` with `pointerMove`, the progress parameter is an object:

```typescript
type Progress = {
  x: number; // 0-1: horizontal position (0 = left edge, 1 = right edge)
  y: number; // 0-1: vertical position (0 = top edge, 1 = bottom edge)
  v?: {
    // Velocity (optional)
    x: number; // Horizontal velocity
    y: number; // Vertical velocity
  };
  active?: boolean; // Whether mouse is currently in the hit area
};
```

---

## Centering with `centeredToTarget`

Controls how the progress range is calculated relative to the target element.

Set `centeredToTarget: true` when:

- The source and target are **different elements** (e.g., a container sources mouse tracking while a child element animates)
- Using `hitArea: 'root'` with a specific target element — centers the coordinate origin on the target
- Multiple effects target different elements from one source — each target gets its own centered coordinate space
- The target element is offset from the source and needs progress values relative to its own center

When `false` (or omitted), the source element's bounds are used for progress calculations. Use for cursor followers and global effects where progress should be relative to the hit area, not the target.

---

## Device Conditions

`pointerMove` works best on hover-capable devices. Use a `conditions` entry with a `(hover: hover)` media query to prevent the interaction from registering on touch-only devices. On touch-only devices, consider a fallback to `viewEnter` or `viewProgress` based interactions:

```typescript
{
    conditions: {
        '[CONDITION_NAME]': { type: 'media', predicate: '(hover: hover)' }
    },
    interactions: [
        {
            key: '[SOURCE_KEY]',
            trigger: 'pointerMove',
            conditions: ['[CONDITION_NAME]'],
            params: { hitArea: '[HIT_AREA]' },
            effects: [ /* ... */ ]
        }
    ]
}
```

For devices with dynamic viewport sizes (e.g. mobile browsers where the address bar collapses), consider using viewport-relative units carefully and prefer `lvh`/`svh` over `dvh` unless dynamic viewport behavior is specifically desired.

---

## Rule 1: namedEffect

Use pre-built mouse presets from `@wix/motion-presets` that handle 2D mouse tracking internally. Mouse presets are preferred over `keyframeEffect` for 2D effects.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            namedEffect: {
                type: '[NAMED_EFFECT_TYPE]',
                [EFFECT_PROPERTIES]
            },
            centeredToTarget: [CENTERED_TO_TARGET],
            transitionDuration: [TRANSITION_DURATION_MS],
            transitionEasing: '[TRANSITION_EASING]'
        }
    ]
}
```

### Variables

- `[SOURCE_KEY]` — identifier matching the element's key (`data-interact-key` for web, `interactKey` for React). The element that tracks mouse movement.
- `[TARGET_KEY]` — identifier matching the element's key on the element to animate. Can be the same as source, or different when separating hit area from animation target.
- `[HIT_AREA]` — `'self'` (mouse within source element) or `'root'` (mouse anywhere in viewport).
- `[NAMED_EFFECT_TYPE]` — preset name from `@wix/motion-presets` mouse category:
  - `'TrackMouse'` — follows the cursor with direct translation.
  - `'Tilt3DMouse'` — tilts in 3D based on cursor position.
  - `'Track3DMouse'` — translates and tilts in 3D following the cursor.
  - `'SwivelMouse'` — tilts in 3D around a chosen pivot axis.
  - `'AiryMouse'` — floats and rotates gently following the cursor.
  - `'ScaleMouse'` — translates and scales uniformly following the cursor.
  - `'BlurMouse'` — translates, tilts, scales, and blurs based on cursor distance.
  - `'SkewMouse'` — translates and skews following the cursor.
  - `'BlobMouse'` — translates and scales non-uniformly, creating a liquid-like deformation.
  - Refer to motion-presets rules for detailed options of each preset. Do NOT guess preset option names/types; omit unknown options and rely on defaults.
- `[CENTERED_TO_TARGET]` — `true` or `false`. See **Centering with `centeredToTarget`** above.
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing between progress updates. Adds inertia to the effect.
- `[TRANSITION_EASING]` — optional. Easing for the smoothing transition (e.g., `'easeOut'`). Adds a natural deceleration feel.

---

## Rule 2: keyframeEffect with Single Axis

Use `keyframeEffect` when the pointer position along a single axis should drive a keyframe animation. The pointer's position on the chosen axis is mapped to linear 0–1 progress.

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]',
        axis: '[AXIS]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            keyframeEffect: {
                name: '[EFFECT_NAME]',
                keyframes: [
                    [START_KEYFRAME],
                    [CENTER_KEYFRAME],
                    [END_KEYFRAME]
                ]
            },
            fill: 'both',
            centeredToTarget: [CENTERED_TO_TARGET],
            transitionDuration: [TRANSITION_DURATION_MS],
            transitionEasing: '[TRANSITION_EASING]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

### Variables

- `[SOURCE_KEY]` / `[TARGET_KEY]` — same as Rule 1.
- `[HIT_AREA]` — `'self'` or `'root'`.
- `[AXIS]` — `'x'` (horizontal) or `'y'` (vertical). Defaults to `'y'` when omitted.
- `[EFFECT_NAME]` — unique string name for the keyframe effect.
- `[START_KEYFRAME]` — CSS keyframe at progress 0 (left/top edge).
- `[CENTER_KEYFRAME]` — optional. CSS keyframe at progress 0.5 (center).
- `[END_KEYFRAME]` — CSS keyframe at progress 1 (right/bottom edge).
- `[FILL_MODE]` — typically `'both'` to ensure the effect applies before entering and after exiting the effect's active range.
- `[CENTERED_TO_TARGET]` — `true` or `false`.
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing between progress updates.
- `[TRANSITION_EASING]` — optional. Easing for the smoothing transition (e.g., `'easeOut'`).
- `[UNIQUE_EFFECT_ID]` — optional string identifier.

---

## Rule 3: Two keyframeEffects with Two Axes and `composite`

Use two separate interactions on the same source/target pair — one for `axis: 'x'`, one for `axis: 'y'` — for independent 2D control with keyframes. When both effects animate the same CSS property (e.g. `transform` or `filter`), use `composite` to combine them.

```typescript
{
    interactions: [
        {
            key: '[SOURCE_KEY]',
            trigger: 'pointerMove',
            params: { hitArea: '[HIT_AREA]', axis: 'x' },
            effects: [{ key: '[TARGET_KEY]', effectId: '[X_EFFECT_ID]' }]
        },
        {
            key: '[SOURCE_KEY]',
            trigger: 'pointerMove',
            params: { hitArea: '[HIT_AREA]', axis: 'y' },
            effects: [{ key: '[TARGET_KEY]', effectId: '[Y_EFFECT_ID]' }]
        }
    ],
    effects: {
        '[X_EFFECT_ID]': {
            keyframeEffect: {
                name: '[X_EFFECT_NAME]',
                keyframes: [
                    { [PROPERTY]: '[X_START_VALUE]' },
                    { [PROPERTY]: '[X_CENTER_VALUE]' },
                    { [PROPERTY]: '[X_END_VALUE]' }
                ]
            },
            fill: '[FILL_MODE]',
            composite: '[COMPOSITE_OPERATION]',
            transitionDuration: [TRANSITION_DURATION_MS],
            transitionEasing: '[TRANSITION_EASING]'
        },
        '[Y_EFFECT_ID]': {
            keyframeEffect: {
                name: '[Y_EFFECT_NAME]',
                keyframes: [
                    { [PROPERTY]: '[Y_START_VALUE]' },
                    { [PROPERTY]: '[Y_CENTER_VALUE]' },
                    { [PROPERTY]: '[Y_END_VALUE]' }
                ]
            },
            fill: '[FILL_MODE]',
            composite: '[COMPOSITE_OPERATION]',
            transitionDuration: [TRANSITION_DURATION_MS],
            transitionEasing: '[TRANSITION_EASING]'
        }
    }
}
```

### Variables

- `[SOURCE_KEY]` / `[TARGET_KEY]` — same as Rule 1.
- `[HIT_AREA]` — `'self'` or `'root'`.
- `[X_EFFECT_ID]` / `[Y_EFFECT_ID]` — unique string identifiers for the X-axis and Y-axis effects, referenced from the top-level `effects` map.
- `[X_EFFECT_NAME]` / `[Y_EFFECT_NAME]` — unique string names for each keyframe effect.
- `[PROPERTY]` — CSS property animated by both effects (e.g., `transform`).
- `[X_START_VALUE]` / `[X_CENTER_VALUE]` / `[X_END_VALUE]` — CSS values for the X-axis range. The `CENTER` keyframe is optional.
- `[Y_START_VALUE]` / `[Y_CENTER_VALUE]` / `[Y_END_VALUE]` — CSS values for the Y-axis range. The `CENTER` keyframe is optional.
- `[COMPOSITE_OPERATION]` — `'add'` or `'accumulate'`. Required when both effects animate the same property so their values combine rather than override each other. `'add'`: function values add up sequentially. `'accumulate'`: similar functions' arguments add up.
- `[FILL_MODE]` — typically `'both'` to ensure the effect applies before entering and after exiting the effect's active range.
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing between progress updates.
- `[TRANSITION_EASING]` — optional. Easing for the smoothing transition (e.g., `'easeOut'`).

---

## Rule 4: customEffect

Use `customEffect` when you need full imperative control over pointer-driven animations — custom physics, complex multi-property animations, velocity-reactive effects, or controlling WebGL/WebGPU and other JavaScript-driven effects. The callback receives the 2D progress object (see **Progress Object Structure**).

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            customEffect: (element: Element, progress: Progress) => {
                [CUSTOM_ANIMATION_LOGIC]
            },
            centeredToTarget: [CENTERED_TO_TARGET],
            transitionDuration: [TRANSITION_DURATION_MS],
            transitionEasing: '[TRANSITION_EASING]'
        }
    ]
}
```

### Variables

- `[SOURCE_KEY]` / `[TARGET_KEY]` — same as Rule 1.
- `[HIT_AREA]` — `'self'` or `'root'`.
- `[CUSTOM_ANIMATION_LOGIC]` — JavaScript using `progress.x`, `progress.y`, `progress.v`, and `progress.active` to apply the effect.
- `[CENTERED_TO_TARGET]` — `true` or `false`.
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing between progress updates.
- `[TRANSITION_EASING]` — optional. Easing for the smoothing transition (e.g., `'easeOut'`).
