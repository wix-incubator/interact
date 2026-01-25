---
name: Spin
category: ongoing
---

# Spin

## Visual Description

Element rotates continuously around its center point, like a wheel, gear, or loading spinner. The rotation can be clockwise or counter-clockwise, at a constant speed or with easing variations.

**The motion**: The element pivots around its center, completing full 360° rotations indefinitely. By default, the rotation is smooth and constant (linear easing), creating a mechanical, precise feel. With power variations, the rotation can accelerate/decelerate for a more organic feel.

**The visual effect**: Mechanical, precise, often associated with loading or processing states. Spin is universally understood as "something is happening" or "please wait." It can also be decorative for elements like gears, wheels, or abstract shapes.

Spin is ideal for loading indicators and decorative rotating elements, but it can be a strong vestibular trigger for motion-sensitive users.

## Parameters

```typescript
interface Spin {
  direction: 'clockwise' | 'counter-clockwise'; // default: 'clockwise'
  power?: 'soft' | 'medium' | 'hard'; // default: 'soft'
  duration?: number; // ms, min: 100, max: 50000, step: 100, default: 7000
  delay?: number; // ms, min: 0, max: 8000, step: 100, default: 0
}
```

**Parameter Impact:**

- `direction`: Rotation direction
  - `clockwise` (default): Rotates right, natural/expected direction for most users
  - `counter-clockwise`: Rotates left, can feel like "rewinding" or unconventional
- `power`: Controls the easing curve of rotation
  - `soft` (default): Linear, constant speed—mechanical, precise
  - `medium`: Eased rotation (accelerate/decelerate)—more organic feel
  - `hard`: Strong easing with slight overshoot—dynamic, bouncy
- `duration`: Time for one complete rotation
  - **1000-2000ms**: Fast spin, energetic
  - **3000-5000ms**: Medium speed, typical for loaders
  - **7000ms (default)**: Slow, deliberate rotation
  - **10000ms+**: Very slow, decorative/ambient
- `delay`: Wait before spinning starts

## Best Practices

- **Default duration is slow**: 7 seconds per rotation is intentionally calm. For loaders, consider 1000-2000ms
- **Use for loading states**: Spin is the universal "loading" indicator
- **Don't spin text**: Rotating text is unreadable and disorienting
- **Consider direction**: Clockwise feels natural; counter-clockwise may feel "wrong" to some users
- **Reduced motion**: Always provide static fallback—spinning is a strong vestibular trigger

## Examples

```typescript
// Basic - slow clockwise spin
{ type: 'Spin', direction: 'clockwise' }

// Loading spinner (faster)
{ type: 'Spin', direction: 'clockwise', duration: 1500 }

// Counter-clockwise (for variety or specific meaning)
{ type: 'Spin', direction: 'counter-clockwise' }

// Fast energetic spin
{ type: 'Spin', direction: 'clockwise', duration: 800 }

// Slow decorative rotation (gear, wheel)
{ type: 'Spin', direction: 'clockwise', duration: 15000 }

// Dynamic spin with easing
{ type: 'Spin', direction: 'clockwise', power: 'medium', duration: 2000 }
```
