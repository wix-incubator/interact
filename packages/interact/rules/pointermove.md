# PointerMove Trigger Rules for @wix/interact

These rules help generate pointer-driven interactions using the `@wix/interact` library. PointerMove triggers create real-time animations that respond to pointer movement over elements or the entire viewport.

## Trigger Source Elements with `hitArea: 'self'`

When using `hitArea: 'self'`, the source element is the hit area for pointer tracking:

- The source element **MUST NOT** have `pointer-events: none` — it needs to receive pointer events to track mouse movement.
- **MUST AVOID** using the same element as both source and target with `transform` effects. The transform shifts the hit area, causing jittery re-entry cycles. Instead, use `selector` to target a child element for the animation.

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
  - `'self'` — tracks mouse within the source element's bounds only. Use for local hover effects.
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

`pointerMove` works best on hover-capable devices. Use a `conditions` entry with a `(hover: hover)` media query to prevent the interaction from registering on touch-only devices:

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

---

## Rule 1: namedEffect

Use pre-built mouse presets from `@wix/motion-presets` that handle 2D progress internally.

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

- `[SOURCE_KEY]` — identifier matching the `data-interact-key` attribute on the element that tracks mouse movement.
- `[TARGET_KEY]` — identifier matching the `data-interact-key` attribute on the element to animate. Can be the same as source, or different when separating hit area from animation target.
- `[HIT_AREA]` — `'self'` (mouse within source element) or `'root'` (mouse anywhere in viewport).
- `[NAMED_EFFECT_TYPE]` — preset name from `@wix/motion-presets` mouse category (e.g., `'Tilt3DMouse'`, `'Track3DMouse'`, `'SwivelMouse'`, `'TrackMouse'`, `'AiryMouse'`, `'BounceMouse'`, `'ScaleMouse'`, `'BlurMouse'`, `'SpinMouse'`, `'SkewMouse'`).
- `[EFFECT_PROPERTIES]` — preset-specific properties (e.g., `angle`, `perspective`, `distance`, `axis`, `scale`).
- `[CENTERED_TO_TARGET]` — `true` or `false`. See **Centering with `centeredToTarget`** above.
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing transitions between progress updates.
- `[TRANSITION_EASING]` — optional. Easing for the smoothing transition (e.g., `'easeOut'`).

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
            fill: '[FILL_MODE]',
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
- `[EFFECT_NAME]` — arbitrary string name for the keyframe effect.
- `[START_KEYFRAME]` — CSS keyframe at progress 0 (left/top edge).
- `[CENTER_KEYFRAME]` - optoinal. CSS keyframe at progress 0.5 (center).
- `[END_KEYFRAME]` — CSS keyframe at progress 1 (right/bottom edge).
- `[FILL_MODE]` — typically `'both'` to ensure the effect applies before entering and after exiting the effect's active range.
- `[CENTERED_TO_TARGET]` — `true` or `false`.
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing transitions between progress updates.
- `[TRANSITION_EASING]` — optional. Easing for the smoothing transition (e.g., `'easeOut'`).
- `[UNIQUE_EFFECT_ID]` — optional string identifier.

---

## Rule 3: Two keyframeEffects with Two Axes and `composite`

Use two separate interactions on the same source/target pair — one for `axis: 'x'`, one for `axis: 'y'` — for independent 2D control with keyframes. When both effects animate the same CSS property, e.g. `transform` or `filter`, use `composite` to combine them.

```typescript
{
    interactions: [
        {
            key: '[SOURCE_KEY]',
            trigger: 'pointerMove',
            params: { hitArea: '[HIT_AREA]', axis: 'x' },
            effects: [
                {
                    key: '[TARGET_KEY]',
                    effectId: '[X_EFFECT_ID]'
                }
            ]
        },
        {
            key: '[SOURCE_KEY]',
            trigger: 'pointerMove',
            params: { hitArea: '[HIT_AREA]', axis: 'y' },
            effects: [
                {
                    key: '[TARGET_KEY]',
                    effectId: '[Y_EFFECT_ID]'
                }
            ]
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
- `[X_EFFECT_ID]` / `[Y_EFFECT_ID]` — distinct string identifiers for the X-axis and Y-axis effects, referenced from the top-level `effects` map.
- `[X_EFFECT_NAME]` / `[Y_EFFECT_NAME]` — arbitrary string names for each keyframe effect.
- `[PROPERTY]` — CSS property animated by both effects (e.g., `transform`).
- `[X_START_VALUE]` / `[X_CENTER_VALUE]` / `[X_END_VALUE]` — CSS values for the X-axis range. The `CENTER` keyframe is optional.
- `[Y_START_VALUE]` / `[Y_CENTER_VALUE]` / `[Y_END_VALUE]` — CSS values for the Y-axis range. The `CENTER` keyframe is optional.
- `[FILL_MODE]` — typically `'both'` to ensure the effect applies before entering and after exiting the effect's active range.
- `[COMPOSITE_OPERATION]` — `'add'` or `'accumulate'`. Required when both effects animate the same property so their values combine rather than override each other.
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing transitions between progress updates.
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
- `[TRANSITION_DURATION_MS]` — optional. Milliseconds for smoothing transitions between progress updates.
- `[TRANSITION_EASING]` — optional. Easing for the smoothing transition (e.g., `'easeOut'`).
