---
name: TrackMouse
category: mouse
---

# TrackMouse

## Visual Description

Element follows the mouse cursor, translating its position based on cursor location. Like a floating object that drifts toward where you point, the element moves in the direction of the cursor within defined bounds.

**How it works**: As the cursor moves across the viewport, the element shifts position proportionally. The `distance` parameter defines how far the element can move from its center position. Movement can be constrained to horizontal, vertical, or both axes.

**The visual effect**: Creates a responsive, floating feel. Multiple elements with different distances create parallax-like depth. The effect feels interactive and playful, like objects following your gaze.

**Inverted mode**: When inverted, the element moves in the opposite direction—cursor goes right, element goes left. This can create interesting "repelling" effects.

## Parameters

```typescript
interface TrackMouse {
  distance: { value: number; type: 'px' | 'percentage' | 'vh' | 'vw' };  // default: { value: 250, type: 'px' }
  axis: 'horizontal' | 'vertical' | 'both';                              // default: 'both'
  power?: 'soft' | 'medium' | 'hard';                                    // default: 'medium'
  inverted?: boolean;                                                    // default: false
  transitionDuration?: number;                                           // ms, min: 0, max: 5000, step: 20, default: 500
  transitionEasing?: 'linear' | 'easeOut' | 'hardBackOut';              // default: 'easeOut'
}
```

**Parameter Impact:**

- `distance`: Maximum translation distance from center position
  - `value`: How far the element can move (5-800)
  - `type`: Unit of measurement
    - `px`: Fixed pixel distance
    - `percentage`: Relative to element size
    - `vh`/`vw`: Relative to viewport
  - Larger values = more dramatic movement
- `axis`: Constrain movement direction
  - `both` (default): Element moves in 2D, following cursor anywhere
  - `horizontal`: Only left/right movement
  - `vertical`: Only up/down movement
- `power`: Affects easing curve
  - `soft`: Linear easing—direct, mechanical
  - `medium` (default): `easeOut`—smooth, natural
  - `hard`: `hardBackOut`—slight overshoot, bouncy
- `inverted`: Reverse movement direction
  - `false`: Element follows cursor
  - `true`: Element moves opposite to cursor
- `transitionDuration`: Smoothing delay
- `transitionEasing`: Easing curve for smooth transitions

## Best Practices

- **Layer multiple elements**: Apply different distances to create parallax depth (e.g., 50px, 150px, 300px)
- **Keep distances reasonable**: Very large distances can make elements move off-screen
- **Constrain axis when appropriate**: Horizontal-only is great for decorative elements in hero sections
- **Inverted creates depth**: Use inverted on "background" elements to create separation from "foreground"
- **Desktop only**: Always ensure content is usable without mouse tracking

## Examples

```typescript
// Basic - follows mouse in all directions
{ type: 'TrackMouse', distance: { value: 200, type: 'px' }, axis: 'both' }

// Horizontal only (good for hero backgrounds)
{ type: 'TrackMouse', distance: { value: 100, type: 'px' }, axis: 'horizontal' }

// Subtle background layer
{ type: 'TrackMouse', distance: { value: 50, type: 'px' }, axis: 'both' }

// Dramatic foreground element
{ type: 'TrackMouse', distance: { value: 300, type: 'px' }, axis: 'both' }

// Inverted (moves opposite to cursor)
{ type: 'TrackMouse', distance: { value: 150, type: 'px' }, axis: 'both', inverted: true }

// Parallax depth layers (apply to different elements)
// Far background
{ type: 'TrackMouse', distance: { value: 30, type: 'px' }, axis: 'both' }
// Mid layer
{ type: 'TrackMouse', distance: { value: 80, type: 'px' }, axis: 'both' }
// Foreground
{ type: 'TrackMouse', distance: { value: 150, type: 'px' }, axis: 'both' }
```
