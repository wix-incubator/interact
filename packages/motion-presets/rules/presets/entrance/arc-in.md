---
name: ArcIn
category: entrance
---

# ArcIn

## Visual Description

Element swings into view along a curved arc path, like a door opening towards you or a card being dealt onto a table. The motion has a sense of depth and dimension—the element appears to exist in 3D space, rotating on an axis as it enters.

**At the start**: The element is invisible and tilted away from the viewer. Depending on the direction, it's either rotated back (like looking at the top of a tilted card), forward (like seeing the bottom edge), or sideways (like a door partially open).

**During the animation**: The element simultaneously fades in and rotates toward its final flat position. The rotation follows a smooth arc trajectory, not a linear path, which creates the cinematic "swinging" feel. The opacity increases as the rotation progresses.

**At the end**: The element is fully visible and flat (no rotation), settled in its final position.

The effect feels dramatic, premium, and cinematic—best suited for hero elements, featured content, or moments where you want to make an impression.

## Parameters

```typescript
interface ArcIn {
  direction: 'top' | 'right' | 'bottom' | 'left';  // default: 'left'
  power?: 'soft' | 'medium' | 'hard';              // default: 'medium'
  duration?: number;   // ms, min: 0, max: 4000, step: 100, default: 1200
  delay?: number;      // ms, min: 0, max: 8000, step: 100, default: 0
}
```

**Parameter Impact:**

- `direction`: Determines the rotation axis and where the element appears to come from
  - `top`: Rotates on X-axis, element tilts forward as if falling into place from above
  - `bottom`: Rotates on X-axis opposite direction, element rises up from below
  - `left`: Rotates on Y-axis, element swings in from the left like a door opening
  - `right`: Rotates on Y-axis opposite direction, swings in from the right
  - **Visual tip**: `left`/`right` feel like hinged doors; `top`/`bottom` feel like flaps or lids
- `power`: Controls the intensity of the rotation and easing
  - `soft`: ~15° rotation, gentle easing—subtle, elegant, good for supporting content
  - `medium`: ~30° rotation, balanced easing—the sweet spot for most uses
  - `hard`: ~45° rotation with slight overshoot—dramatic, attention-grabbing, use sparingly
- `duration`: Animation length
  - **800-1000ms**: Snappy but still cinematic
  - **1200ms (default)**: Balanced cinematic feel
  - **1500-2000ms**: Very slow, dramatic, use for hero moments only
- `delay`: Pre-animation wait time, useful for sequencing

## Best Practices

- **Use on single focal elements**—ArcIn is dramatic and competes for attention. Don't use on multiple simultaneous elements
- **Consider mobile**: Use `power: 'soft'` on mobile devices for better performance and reduced motion intensity
- **Match direction to layout**: If content comes from the left side of the screen, use `direction: 'left'`
- **Pair with stagger for sequences**: If animating multiple items, use increasing `delay` values
- **Have a simpler fallback**: Use FadeIn for reduced-motion preference

## Examples

```typescript
// Basic - swings in from left (default)
{ type: 'ArcIn' }

// Hero section - dramatic entrance from bottom
{ type: 'ArcIn', direction: 'bottom', power: 'hard' }

// Subtle supporting content
{ type: 'ArcIn', direction: 'left', power: 'soft', duration: 800 }

// Side-by-side cards with stagger
{ type: 'ArcIn', direction: 'left', delay: 0 }     // Left card
{ type: 'ArcIn', direction: 'right', delay: 150 }  // Right card

// Sequential vertical reveal
{ type: 'ArcIn', direction: 'top', delay: 0 }
{ type: 'ArcIn', direction: 'top', delay: 200 }
{ type: 'ArcIn', direction: 'top', delay: 400 }
```
