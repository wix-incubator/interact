---
name: entrance-presets-reference
description: Full parameter details, examples, and intensity guide for entrance presets. Read when configuring specific entrance preset parameters or choosing intensity levels for entrance animations.
category: entrance
---

# Entrance Presets

All entrance preset parameters and TypeScript examples. For category overview and selection guidance, see [presets-main.md](presets-main.md).

## Table of Contents

- [Preset Reference](#preset-reference)
- [Intensity Values](#intensity-values)
- [Optional Parameters](#optional-parameters)

---

## Preset Reference

### FadeIn

Visual: Element transitions from invisible to visible. Simple opacity change, no movement.

Parameters:

- No preset-specific parameters

```typescript
{
  type: 'FadeIn';
}
```

### ArcIn

Visual: Element swings in along a curved 3D path, like a door opening. Dramatic, cinematic.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'right')
- `depth`: UnitLengthPercentage (default: { value: 200, type: 'px' })
- `perspective`: number (default: 800)

```typescript
{ type: 'ArcIn', direction: 'bottom' }
{ type: 'ArcIn', direction: 'left', depth: { value: 500, type: 'px' } }
```

### BlurIn

Visual: Element transitions from blurry to sharp focus while fading in. Soft, dreamy.

Parameters:

- `blur`: number in px (default: 6)

```typescript
{ type: 'BlurIn' }
{ type: 'BlurIn', blur: 25 }   // Medium
{ type: 'BlurIn', blur: 50 }   // Dramatic
```

### BounceIn

Visual: Element bounces into view with spring physics. Playful, attention-grabbing.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' | 'center' (default: 'bottom')
- `distanceFactor`: number (default: 1)
- `perspective`: number (default: 800) - only used with 'center' direction

```typescript
{ type: 'BounceIn' }
{ type: 'BounceIn', direction: 'center', distanceFactor: 2 }
```

### CurveIn

Visual: Curved 3D motion path entry. Cinematic arc trajectory.

Parameters:

- `direction`: 'left' | 'right' | 'pseudoLeft' | 'pseudoRight' (default: 'right')
- `depth`: UnitLengthPercentage (default: { value: 300, type: 'px' })
- `perspective`: number (default: 200)

```typescript
{ type: 'CurveIn', direction: 'left' }
```

### DropIn

Visual: Falls from above with subtle scale on landing. Gravity-like, natural.

Parameters:

- `initialScale`: number (default: 1.6)

```typescript
{ type: 'DropIn' }
{ type: 'DropIn', initialScale: 2 }
```

### ExpandIn

Visual: Scale from small to full size with directional expansion from edge. Emerging, growing outward.

Parameters:

- `direction`: number in degrees or keyword ('top' | 'right' | 'bottom' | 'left') (default: 90, from top)
- `distance`: UnitLengthPercentage (default: { value: 120, type: 'percentage' })
- `initialScale`: number (default: 0)

```typescript
{ type: 'ExpandIn' }
{ type: 'ExpandIn', direction: 'bottom', distance: { value: 100, type: 'px' }, initialScale: 0.3 }
```

### FlipIn

Visual: 3D card flip rotation to reveal element. Dramatic, card-like metaphor.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'top')
- `initialRotate`: number in degrees (default: 90)
- `perspective`: number (default: 800)

```typescript
{ type: 'FlipIn', direction: 'left' }
{ type: 'FlipIn', direction: 'top', initialRotate: 270 }
```

### FloatIn

Visual: Gentle floating/drifting entrance. Ethereal, light, dreamy.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'left')

```typescript
{ type: 'FloatIn', direction: 'bottom' }
```

### FoldIn

Visual: Paper-folding 3D effect. Origami-like, creative.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'top')
- `initialRotate`: number in degrees (default: 90)
- `perspective`: number (default: 800)

```typescript
{ type: 'FoldIn', direction: 'left' }
{ type: 'FoldIn', direction: 'top', initialRotate: 45 }
```

### GlideIn

Visual: Smooth 2D glide from any angle with distance control. Clean, directional.

Parameters:

- `direction`: number in degrees (default: 180, from left). 0° = right, 90° = top, 180° = left, 270° = bottom
- `distance`: UnitLengthPercentage | EffectFourDirections (default: { value: 100, type: 'percentage' })

```typescript
{ type: 'GlideIn' }
{ type: 'GlideIn', direction: 90, distance: { value: 50, type: 'percentage' } }
```

### RevealIn

Visual: Directional clip/mask reveal like a curtain opening. Theatrical.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'left')

```typescript
{ type: 'RevealIn', direction: 'left' }
```

### ShapeIn

Visual: Shape mask reveal (circle, square, diamond, etc.). Geometric, precise.

Parameters:

- `shape`: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window' (default: 'rectangle')

```typescript
{ type: 'ShapeIn', shape: 'circle' }
{ type: 'ShapeIn', shape: 'diamond' }
```

### ShuttersIn

Visual: Venetian blind strip reveal. Segmented, rhythmic.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'right')
- `shutters`: number of strips (default: 12)
- `staggered`: boolean - animate strips sequentially (default: true)

```typescript
{ type: 'ShuttersIn', direction: 'left', shutters: 5, staggered: true }
```

### SlideIn

Visual: Straight movement from direction with clip. Clean, simple, versatile.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'left')
- `initialTranslate`: number 0-1 (default: 1) - starting offset ratio

```typescript
{ type: 'SlideIn', direction: 'bottom' }
{ type: 'SlideIn', direction: 'left', initialTranslate: 0.2 }
```

### SpinIn

Visual: Rotating entrance with spin. Dynamic, playful.

Parameters:

- `direction`: 'clockwise' | 'counter-clockwise' (default: 'clockwise')
- `spins`: number of rotations (default: 0.5)
- `initialScale`: number (default: 0) - starting scale

```typescript
{ type: 'SpinIn', direction: 'clockwise', spins: 1 }
{ type: 'SpinIn', direction: 'counter-clockwise', spins: 2, initialScale: 0.5 }
```

### TiltIn

Visual: 3D tilt into view. Subtle depth, elegant perspective.

Parameters:

- `direction`: 'left' | 'right' (default: 'left')
- `depth`: UnitLengthPercentage (default: { value: 200, type: 'px' })
- `perspective`: number (default: 800)

```typescript
{ type: 'TiltIn', direction: 'left' }
```

### TurnIn

Visual: Corner-pivot 3D rotation. Complex, dramatic, premium.

Parameters:

- `direction`: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' (default: 'top-left')

```typescript
{ type: 'TurnIn', direction: 'bottom-left' }
```

### WinkIn

Visual: Split-in-half reveal from center. Unique, eye-like opening.

Parameters:

- `direction`: 'vertical' | 'horizontal' (default: 'horizontal')

```typescript
{ type: 'WinkIn', direction: 'vertical' }
```

---

## Intensity Values

Tested values for different intensity levels. When a user asks for "soft", "subtle", "medium", or "hard"/"dramatic" motion, use these as guidelines.

| Preset   | Parameter        | Subtle/Soft | Medium     | Dramatic/Hard |
| -------- | ---------------- | ----------- | ---------- | ------------- |
| ArcIn    | easing           | cubicInOut  | quintInOut | backOut       |
| BlurIn   | blur             | 6px         | 25px       | 50px          |
| BounceIn | distanceFactor   | 1           | 2          | 3             |
| DropIn   | initialScale     | 1.2         | 1.6        | 2             |
| FlipIn   | initialRotate    | 45°         | 90°        | 270°          |
| FoldIn   | initialRotate    | 35°         | 60°        | 90°           |
| ExpandIn | initialScale     | 0.8         | 0.6        | 0             |
| SlideIn  | initialTranslate | 0.2         | 0.8        | 1             |
| SpinIn   | initialScale     | 1           | 0.6        | 0             |

Example -- "I want a subtle flip entrance": `{ type: 'FlipIn', initialRotate: 45 }`

---

## Optional Parameters

These parameters are exposed but their defaults have been tuned for good visual results and rarely need adjustment.

### 3D Perspective

| Preset            | Parameter     | Default | Range    |
| ----------------- | ------------- | ------- | -------- |
| ArcIn             | `perspective` | 800     | 200-2000 |
| TiltIn            | `perspective` | 800     | 200-2000 |
| FoldIn            | `perspective` | 800     | 200-2000 |
| FlipIn            | `perspective` | 800     | 200-2000 |
| CurveIn           | `perspective` | 200     | 100-1000 |
| BounceIn (center) | `perspective` | 800     | 200-2000 |

### Depth (Z Translation)

| Preset  | Parameter | Default | Notes                  |
| ------- | --------- | ------- | ---------------------- |
| ArcIn   | `depth`   | 200px   | Z translation distance |
| CurveIn | `depth`   | 300px   | Z translation distance |
| TiltIn  | `depth`   | 200px   | Z translation distance |
