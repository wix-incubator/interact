---
name: scroll-presets-reference
description: Full parameter details, examples, and intensity guide for scroll presets. Read when configuring specific scroll preset parameters or choosing intensity levels for scroll-driven animations.
category: scroll
---

# Scroll Presets

All scroll preset parameters and TypeScript examples. For category overview and selection guidance, see [presets-main.md](presets-main.md).

## Table of Contents

- [Preset Reference](#preset-reference)
- [Intensity Values](#intensity-values)
- [Optional Parameters](#optional-parameters)

All scroll presets accept a `range` parameter:

- `'in'`: animation ends at the element's idle state (element animates in as it enters)
- `'out'`: animation starts from the element's idle state (element animates out as it exits)
- `'continuous'`: animation passes through the idle state (animates across the full scroll range)

---

## Preset Reference

### ArcScroll

Visual: 3D arc rotation as user scrolls. Dramatic, cinematic.

Parameters:

- `direction`: 'vertical' | 'horizontal' (default: 'horizontal')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `perspective`: number (default: 500)

```typescript
{ type: 'ArcScroll', direction: 'vertical' }
{ type: 'ArcScroll', direction: 'horizontal', range: 'in' }
```

### BlurScroll

Visual: Blur/unblur effect controlled by scroll. Focus transitions.

Parameters:

- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `blur`: number in px (default: 6)

```typescript
{ type: 'BlurScroll', range: 'in' }
{ type: 'BlurScroll', range: 'out', blur: 50 }
```

### FadeScroll

Visual: Opacity transition tied to scroll. Fade in on enter, out on exit.

Parameters:

- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `opacity`: number 0-1 (default: 0)

```typescript
{ type: 'FadeScroll', range: 'in' }
{ type: 'FadeScroll', range: 'out' }
```

### FlipScroll

Visual: Full 3D card flip driven by scroll. Dramatic rotation.

Parameters:

- `direction`: 'vertical' | 'horizontal' (default: 'horizontal')
- `range`: 'in' | 'out' | 'continuous' (default: 'continuous')
- `rotate`: number in degrees (default: 240)
- `perspective`: number (default: 800)

```typescript
{ type: 'FlipScroll', direction: 'horizontal' }
{ type: 'FlipScroll', direction: 'vertical', range: 'in', rotate: 420 }
```

### GrowScroll

Visual: Scale up as element enters viewport.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' (default: 'center')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `scale`: number (default: varies by range)
- `speed`: number (default: 0)

```typescript
{ type: 'GrowScroll', direction: 'center' }
{ type: 'GrowScroll', direction: 'center', range: 'in', scale: 4 }
```

### MoveScroll

Visual: Translation movement on scroll in any direction.

Parameters:

- `angle`: 0-360 degrees (default: 120). 0° = right, 90° = top, 180° = left, 270° = bottom
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `distance`: UnitLengthPercentage (default: { value: 400, type: 'px' })

```typescript
{ type: 'MoveScroll', angle: 90, distance: { value: 100, type: 'px' } }
{ type: 'MoveScroll', angle: 0, distance: { value: 800, type: 'px' } }
```

### PanScroll

Visual: Horizontal panning tied to scroll.

Parameters:

- `direction`: 'left' | 'right' (default: 'left')
- `distance`: UnitLengthPercentage (default: { value: 400, type: 'px' })
- `startFromOffScreen`: boolean (default: true)
- `range`: 'in' | 'out' | 'continuous' (default: 'in')

```typescript
{ type: 'PanScroll', direction: 'left', distance: { value: 200, type: 'px' } }
```

### ParallaxScroll

Visual: Element moves slower/faster than scroll, creating depth illusion.

Parameters:

- `parallaxFactor`: number (default: 0.5) - movement speed relative to scroll
- `range`: 'in' | 'out' | 'continuous'

```typescript
{ type: 'ParallaxScroll' }
{ type: 'ParallaxScroll', parallaxFactor: 0.3 }
```

### RevealScroll

Visual: Clip-based directional reveal on scroll.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'bottom')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')

```typescript
{ type: 'RevealScroll', direction: 'left' }
{ type: 'RevealScroll', direction: 'bottom', range: 'in' }
```

### ShapeScroll

Visual: Shape mask reveal controlled by scroll.

Parameters:

- `shape`: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window' (default: 'circle')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `intensity`: number 0-1 (default: 0.5)

```typescript
{ type: 'ShapeScroll', shape: 'circle' }
{ type: 'ShapeScroll', shape: 'diamond', intensity: 0.8 }
```

### ShrinkScroll

Visual: Scale down as element exits viewport.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' (default: 'center')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `scale`: number (default: varies by range)
- `speed`: number (default: 0)

```typescript
{ type: 'ShrinkScroll', direction: 'center', range: 'out' }
{ type: 'ShrinkScroll', direction: 'center', scale: 0 }
```

### ShuttersScroll

Visual: Venetian blind strips revealing on scroll.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'right')
- `shutters`: number of strips (default: 12)
- `staggered`: boolean (default: true)
- `range`: 'in' | 'out' | 'continuous' (default: 'in')

```typescript
{ type: 'ShuttersScroll', direction: 'left', shutters: 5, staggered: true }
```

### SkewPanScroll

Visual: Panning with skew distortion effect.

Parameters:

- `direction`: 'left' | 'right' (default: 'right')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `skew`: number in degrees (default: 10)

```typescript
{ type: 'SkewPanScroll', direction: 'left' }
{ type: 'SkewPanScroll', direction: 'right', skew: 24 }
```

### SlideScroll

Visual: Slide movement tied to scroll position.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'bottom')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')

```typescript
{ type: 'SlideScroll', direction: 'bottom' }
{ type: 'SlideScroll', direction: 'left', range: 'in' }
```

### Spin3dScroll

Visual: 3D rotation around axis on scroll.

Parameters:

- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `rotate`: number in degrees (default: -100)
- `speed`: number (default: 0)
- `perspective`: number (default: 1000)

```typescript
{ type: 'Spin3dScroll' }
{ type: 'Spin3dScroll', range: 'continuous', rotate: 200 }
```

### SpinScroll

Visual: 2D rotation driven by scroll.

Parameters:

- `direction`: 'clockwise' | 'counter-clockwise' (default: 'clockwise')
- `spins`: number of rotations (default: 0.15)
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `scale`: number (default: 1)

```typescript
{ type: 'SpinScroll', direction: 'clockwise', spins: 1 }
{ type: 'SpinScroll', direction: 'counter-clockwise', spins: 2, scale: 0.4 }
```

### StretchScroll

Visual: Stretch/squeeze deformation on scroll.

Parameters:

- `range`: 'in' | 'out' | 'continuous' (default: 'out')
- `stretch`: number (default: 0.6)

```typescript
{ type: 'StretchScroll' }
{ type: 'StretchScroll', stretch: 2 }
```

### TiltScroll

Visual: 3D tilt effect as user scrolls. Subtle perspective.

Parameters:

- `direction`: 'left' | 'right' (default: 'right')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `parallaxFactor`: number (default: 0) - tilt distance factor
- `perspective`: number (default: 400)

```typescript
{ type: 'TiltScroll', direction: 'left' }
{ type: 'TiltScroll', direction: 'right', parallaxFactor: 1 }
```

### TurnScroll

Visual: Corner-pivot 3D rotation on scroll.

Parameters:

- `direction`: 'left' | 'right' (default: 'right')
- `spin`: 'clockwise' | 'counter-clockwise' (default: 'clockwise')
- `range`: 'in' | 'out' | 'continuous' (default: 'in')
- `scale`: number (default: 1)
- `rotation`: number

```typescript
{ type: 'TurnScroll', direction: 'left', spin: 'clockwise' }
{ type: 'TurnScroll', direction: 'right', spin: 'counter-clockwise', scale: 1.6 }
```

---

## Intensity Values

Tested values for different intensity levels. When a user asks for "soft", "subtle", "medium", or "hard"/"dramatic" motion, use these as guidelines.

| Preset        | Parameter | Subtle/Soft | Medium | Dramatic/Hard |
| ------------- | --------- | ----------- | ------ | ------------- |
| BlurScroll    | blur      | 6px         | 25px   | 50px          |
| FlipScroll    | rotate    | 60°         | 120°   | 420°          |
| GrowScroll    | scale     | 1.2         | 1.7    | 4             |
| MoveScroll    | distance  | 150px       | 400px  | 800px         |
| ShrinkScroll  | scale     | 0.8         | 0.3    | 0             |
| SkewPanScroll | skew      | 10°         | 17°    | 24°           |
| Spin3dScroll  | rotate    | 45°         | 100°   | 200°          |
| SpinScroll    | scale     | 1           | 0.7    | 0.4           |
| StretchScroll | stretch   | 1.2         | 1.5    | 2             |
| TiltScroll    | distance  | 0           | 0.5    | 1             |
| TurnScroll    | scale     | 1           | 1.3    | 1.6           |

---

## Optional Parameters

These parameters are exposed but their defaults have been tuned for good visual results and rarely need adjustment.

### 3D Perspective

| Preset       | Parameter     | Default | Range    |
| ------------ | ------------- | ------- | -------- |
| FlipScroll   | `perspective` | 800     | 200-2000 |
| TiltScroll   | `perspective` | 400     | 200-2000 |
| Spin3dScroll | `perspective` | 1000    | 200-2000 |
