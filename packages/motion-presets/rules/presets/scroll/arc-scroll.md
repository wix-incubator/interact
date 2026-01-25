---
name: ArcScroll
category: scroll
---

# ArcScroll

## Visual Description

Element tilts and rotates in 3D space as the user scrolls, creating a dramatic cinematic effect similar to ArcIn but driven by scroll position instead of time. The element appears to exist in 3D space, rotating on an axis as scroll progresses.

**How it looks**: Imagine a trading card slowly tilting as you scroll—it starts tilted away from you and gradually rotates flat, or vice versa. The effect creates depth and dimension, making the element feel like it's pivoting in real space.

**`direction: 'vertical'`**: Element rotates on the X-axis, tilting forward/backward like a laptop screen opening or closing.

**`direction: 'horizontal'`**: Element rotates on the Y-axis, tilting left/right like a door swinging open.

The rotation is tied directly to scroll position, creating a satisfying connection between user input and visual transformation.

## Parameters

```typescript
interface ArcScroll {
  direction: 'horizontal' | 'vertical'; // default: 'vertical'
  range?: 'in' | 'out' | 'continuous'; // default varies
  start?: number; // %, scroll position start
  end?: number; // %, scroll position end
}
```

**Parameter Impact:**

- `direction`: Determines the rotation axis
  - `vertical`: Rotates on X-axis—element tilts forward/backward
    - At start: tilted back (top edge away from viewer)
    - At end: flat, facing viewer
    - Feels like a screen or lid opening toward you
  - `horizontal`: Rotates on Y-axis—element tilts left/right
    - At start: tilted to one side
    - At end: flat, facing viewer
    - Feels like a door or panel swinging open
- `range`: When the rotation occurs
  - `in`: Rotates from tilted → flat as element enters viewport
  - `out`: Rotates from flat → tilted as element exits viewport
  - `continuous`: Full rotation range throughout scroll visibility
- `start`/`end`: Fine-tune when rotation begins and completes (0-100)

## Best Practices

- **Use on single focal elements**: ArcScroll is dramatic; multiple simultaneous rotations are overwhelming
- **Test performance**: 3D transforms can be expensive; ensure smooth 60fps
- **Consider viewport position**: Element needs to be positioned where rotation is visible during scroll range
- **Pair with complementary content**: Works well with text that doesn't rotate alongside
- **Reduced motion**: Provide FadeScroll or static fallback—3D rotation is a vestibular trigger

## Examples

```typescript
// Basic - tilts forward/backward as you scroll
{ type: 'ArcScroll', direction: 'vertical' }

// Tilts left/right as you scroll
{ type: 'ArcScroll', direction: 'horizontal' }

// Only rotate while entering viewport
{ type: 'ArcScroll', direction: 'vertical', range: 'in' }

// Only rotate while exiting viewport
{ type: 'ArcScroll', direction: 'horizontal', range: 'out' }

// Custom scroll range (rotation completes earlier)
{ type: 'ArcScroll', direction: 'vertical', range: 'in', start: 0, end: 40 }
```
