---
name: Tilt3DMouse
category: mouse
---

# Tilt3DMouse

## Visual Description

Element tilts in 3D space toward the mouse cursor, like holding a physical card and angling it to catch the light. Moving the mouse left makes the element tilt left; moving up makes it tilt back. The effect creates an interactive, premium feel where elements respond to cursor position.

**How it works**: The element's rotation is calculated based on the cursor's position relative to the element's center. The closer to an edge, the more pronounced the tilt. Moving the cursor away from the element returns it to flat.

**The visual effect**: The element feels tangible and responsive, like a physical object you can manipulate. It creates depth and interactivity, making the interface feel premium and engaging. Commonly used for product cards, images, and interactive showcases.

**Inverted mode**: When inverted, the element tilts away from the cursor instead of toward it—creating a "repelled" rather than "attracted" feel.

## Parameters

```typescript
interface Tilt3DMouse {
  power?: 'soft' | 'medium' | 'hard';      // default: 'medium'
  angle?: number;                           // degrees, min: 5, max: 85, step: 1, default: 50
  perspective?: number;                     // px, min: 200, max: 1000, step: 50, default: 800
  inverted?: boolean;                       // default: false
  transitionDuration?: number;              // ms, min: 0, max: 5000, step: 20, default: 500
  transitionEasing?: 'linear' | 'easeOut' | 'hardBackOut';  // default: 'easeOut'
}
```

**Parameter Impact:**

- `power`: Preset combinations for quick setup
  - `soft`: 25° max angle, 1000px perspective—subtle, professional
  - `medium` (default): 50° max angle, 500px perspective—balanced, noticeable
  - `hard`: 85° max angle, 200px perspective—dramatic, attention-grabbing
- `angle`: Maximum rotation degrees (5-85)
  - Lower values (5-25): Subtle tilt, professional feel
  - Medium values (30-50): Noticeable, engaging
  - High values (60-85): Dramatic, can feel exaggerated
- `perspective`: 3D depth perception (200-1000px)
  - Lower values (200-400): Dramatic perspective, close-up feel
  - Higher values (800-1000): Subtle perspective, more natural
- `inverted`: Reverses tilt direction
  - `false` (default): Tilts toward cursor
  - `true`: Tilts away from cursor
- `transitionDuration`: Smoothing delay for tilt changes (0-5000ms)
  - Lower values: Snappy response
  - Higher values: Smooth, laggy response
- `transitionEasing`: Easing curve for transitions

## Best Practices

- **Use on cards and images**: Tilt3DMouse is perfect for product cards, portfolio items, and interactive images
- **Keep it subtle in professional contexts**: Use `power: 'soft'` or low `angle` values for business sites
- **Consider hover area**: Works best when element has space around it for mouse movement
- **Add shadow for depth**: Combine with dynamic shadows that shift with tilt for extra realism
- **Desktop only**: Remember this doesn't work on touch devices—ensure content is accessible without it

## Examples

```typescript
// Basic - balanced tilt effect
{ type: 'Tilt3DMouse' }

// Subtle professional effect
{ type: 'Tilt3DMouse', power: 'soft' }

// Dramatic interactive card
{ type: 'Tilt3DMouse', power: 'hard' }

// Custom subtle tilt
{ type: 'Tilt3DMouse', angle: 15, perspective: 1000 }

// Inverted (tilts away from cursor)
{ type: 'Tilt3DMouse', inverted: true }

// Snappy response
{ type: 'Tilt3DMouse', transitionDuration: 100 }

// Smooth, dreamy response
{ type: 'Tilt3DMouse', transitionDuration: 800, transitionEasing: 'easeOut' }
```
