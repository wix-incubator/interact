---
name: BounceMouse
category: mouse
---

# BounceMouse

## Visual Description

Element follows the mouse cursor with a bouncy, elastic motion. Instead of moving directly to follow the cursor, the element overshoots its target and wobbles back and forth before settling—like a jelly or rubber ball being pulled by an invisible string.

**How it works**: Like TrackMouse, the element's position responds to cursor location. But instead of smooth easing, BounceMouse uses elastic/spring physics that cause the element to overshoot and oscillate before coming to rest.

**The visual effect**: Playful, springy, and game-like. The bouncing creates a sense of fun and energy, like the element is alive and excited to follow your cursor. It's inherently casual and not suited for serious professional contexts.

**The difference from TrackMouse**: TrackMouse smoothly follows; BounceMouse bounces and wobbles. TrackMouse feels responsive and professional; BounceMouse feels playful and energetic.

## Parameters

```typescript
interface BounceMouse {
  distance: { value: number; type: 'px' | 'percentage' | 'vh' | 'vw' };  // default: { value: 80, type: 'px' }
  axis: 'horizontal' | 'vertical' | 'both';                              // default: 'both'
  inverted?: boolean;                                                    // default: false
  transitionDuration?: number;                                           // ms, min: 0, max: 5000, step: 20, default: 500
  transitionEasing?: 'elastic' | 'bounce';                              // default: 'elastic'
}
```

**Parameter Impact:**

- `distance`: Maximum translation distance (smaller default than TrackMouse)
  - Default 80px is intentionally smaller—bouncy motion with large distances can be overwhelming
  - Keep values moderate (50-150px) for best results
- `axis`: Constrain movement direction
  - `both` (default): Bounces in 2D
  - `horizontal`/`vertical`: Constrains to one axis
- `inverted`: Reverse movement direction
  - Creates "repelled" bouncy effect
- `transitionDuration`: Affects bounce timing
- `transitionEasing`: Spring behavior type
  - `elastic` (default): Smooth spring with overshoot and gentle settle
  - `bounce`: Multiple distinct bounces before settling—more energetic

## Best Practices

- **Keep distances small**: Bouncy motion amplifies perceived distance—start with 50-100px
- **Match playful contexts**: BounceMouse screams "fun"—ensure it fits your brand
- **One bouncing element**: Multiple bouncing elements are visually overwhelming
- **Consider `elastic` vs `bounce`**: `elastic` is smoother; `bounce` is more cartoonish
- **Reduced motion**: Disable entirely—bouncy motion can cause discomfort

## Examples

```typescript
// Basic - bouncy cursor following
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both' }

// Smaller, more contained bounce
{ type: 'BounceMouse', distance: { value: 50, type: 'px' }, axis: 'both' }

// Horizontal only bounce
{ type: 'BounceMouse', distance: { value: 100, type: 'px' }, axis: 'horizontal' }

// More cartoonish bounce easing
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both', transitionEasing: 'bounce' }

// Inverted (bounces away from cursor)
{ type: 'BounceMouse', distance: { value: 60, type: 'px' }, axis: 'both', inverted: true }
```
