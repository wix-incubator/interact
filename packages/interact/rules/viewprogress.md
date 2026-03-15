# ViewProgress Trigger Rules for @wix/interact

These rules help generate scroll-driven interactions using the `@wix/interact` library. ViewProgress triggers create animations that update continuously as elements move through the viewport, leveraging native CSS ViewTimelines. Use when animation progress should be tied to the element's scroll position.

> **IMPORTANT:** You MUST replace all usage of `overflow: hidden` with `overflow: clip` on every element between the trigger source element and the scroll container. `overflow: hidden` creates a new scroll context that breaks the ViewTimeline; `overflow: clip` clips overflow visually without affecting scroll ancestry.

**Offset semantics:** Values can be as a `string` representing CSS value, or `number` representing percentages. Positive offset values move the effective range forward along the scroll axis. 0 = start of range, 100 = end.

## Named Scroll Effects

From `@wix/motion-presets` scroll animations: ParallaxScroll, MoveScroll, FadeScroll, RevealScroll, GrowScroll, SlideScroll, SpinScroll, PanScroll, BlurScroll, ArcScroll, FlipScroll, Spin3dScroll, TiltScroll, TurnScroll, ShapeScroll, ShuttersScroll, ShrinkScroll, SkewPanScroll, StretchScroll.

---

## Rule 1: ViewProgress with keyframeEffect or namedEffect

**Use Case**: Scroll-driven CSS-based effects

**Pattern**:

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'viewProgress',
    conditions: ['[CONDITION_NAME]'],  // optional
    effects: [
        {
            key: '[TARGET_KEY]',
            // --- pick ONE of the two effect types ---
            namedEffect: { type: '[NAMED_EFFECT]' },
            // OR
            keyframeEffect: { name: '[EFFECT_NAME]', keyframes: [EFFECT_KEYFRAMES] },

            rangeStart: { name: '[RANGE_NAME]', offset: { unit: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_NAME]', offset: { unit: 'percentage', value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]',
            fill: '[FILL_MODE]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[SOURCE_KEY]`: Unique identifier for element that triggers when scrolled through viewport
- `[TARGET_KEY]`: Unique identifier for element to animate (can be same as source or different)
- `[NAMED_EFFECT]`: Preset name from Named Scroll Effects list above
- `[EFFECT_NAME]`: Unique name for custom keyframe effect
- `[EFFECT_KEYFRAMES]`: Array of keyframe objects defining CSS property transitions
- `[RANGE_NAME]`: Scroll range name — `'cover'` for full visibility span, `'entry'`/`'exit'` for partial phases, `'contain'` while contained in viewport - typically while in a stuck `position: stikcy` container
- `[START_PERCENTAGE]` / `[END_PERCENTAGE]`: 0–100, sub-range within the named range
- `[EASING_FUNCTION]`: Typically `'linear'` for scroll effects; non-linear easing can feel jarring as scroll position changes
- `[FILL_MODE]`: Almost always `'both'` — ensures the effect holds before entering and after exiting its active range
- `[UNIQUE_EFFECT_ID]`: Optional identifier for referencing the effect externally

---

## Rule 2: ViewProgress with customEffect

**Use Case**: Scroll-driven effects requiring JavaScript logic (e.g., changing SVG attributes, controlling WebGL/WebGPU effects)

**Pattern**:

```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'viewProgress',
    conditions: ['[CONDITION_NAME]'],  // optional
    effects: [
        {
            key: '[TARGET_KEY]',
            customEffect: (element: Element, progress: number) => {
                // progress is 0–1 within the specified range
                [CUSTOM_LOGIC]
            },
            rangeStart: { name: '[RANGE_NAME]', offset: { unit: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_NAME]', offset: { unit: 'percentage', value: [END_PERCENTAGE] } },
            fill: '[FILL_MODE]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[SOURCE_KEY]` / `[TARGET_KEY]`: Same as Rule 1
- `[CUSTOM_LOGIC]`: JavaScript that uses `progress` (0–1) to apply the effect. Avoid layout/style reads inside the callback for smooth performance.
- `[RANGE_NAME]` / `[START_PERCENTAGE]` / `[END_PERCENTAGE]`: Same as Rule 1
- `[FILL_MODE]`: Almost always `'both'`
- `[UNIQUE_EFFECT_ID]`: Optional identifier for referencing the effect externally

---

## Rule 3: ViewProgress with Tall Wrapper + Sticky Container (contain range)

**Use Case**: Scroll-driven animations inside a sticky-positioned container, where the source element is a tall wrapper and the effect applies during the "stuck" phase using `position: sticky` to lock a container and `contain` range to animate only during the stuck phase. Good for heavy effects on large media elements or scrolly-telling effects


**Layout Structure**:

- **Tall wrapper** (`[SOURCE_KEY]`): An element with enough height to create scroll distance (e.g., `height: 300vh`). This is the ViewTimeline source.
- **Sticky container** (`[TARGET_KEY]` or parent of targets): A direct child with `position: sticky; top: 0; height: 100vh` that stays fixed in the viewport while the wrapper scrolls past.
- **Animated elements**: Children of the sticky container that receive the effects.

**Pattern**:

```typescript
{
    key: '[TALL_WRAPPER_KEY]',
    trigger: 'viewProgress',
    conditions: ['[CONDITION_NAME]'],  // optional
    effects: [
        {
            key: '[STICKY_CHILD_KEY]',
            // Use keyframeEffect, namedEffect, or customEffect as in Rules 1–2
            keyframeEffect: { name: '[EFFECT_NAME]', keyframes: [EFFECT_KEYFRAMES] },
            rangeStart: { name: 'contain', offset: { unit: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: 'contain', offset: { unit: 'percentage', value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]',
            fill: '[FILL_MODE]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[TALL_WRAPPER_KEY]`: Key for the tall outer element that defines the scroll distance — this is the ViewTimeline source
- `[STICKY_CHILD_KEY]`: Key for the animated element inside the sticky container
- `[EFFECT_NAME]` / `[EFFECT_KEYFRAMES]`: Same as Rule 1
- `[START_PERCENTAGE]` / `[END_PERCENTAGE]`: 0–100 within the `contain` range, i.e. the phase where the sticky container is fully stuck
- `[EASING_FUNCTION]` / `[FILL_MODE]` / `[UNIQUE_EFFECT_ID]`: Same as Rule 1
