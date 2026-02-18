---
name: mouse-presets-reference
description: Full parameter details, examples, and intensity guide for mouse presets. Read when configuring specific mouse preset parameters or choosing intensity levels for cursor-follow and pointer-reactive effects.
category: mouse
---

# Mouse Presets

All mouse preset parameters and TypeScript examples. For category overview and selection guidance, see [presets-main.md](presets-main.md).

## Table of Contents

- [Preset Reference](#preset-reference)
- [Intensity Values](#intensity-values)
- [Mobile Considerations](#mobile-considerations)

All mouse presets accept an optional `inverted`: boolean parameter (default: false).

---

## Preset Reference

### AiryMouse

Visual: Floating/airy cursor response. Ethereal, gentle drift.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 200, type: 'px' })
- `axis`: 'horizontal' | 'vertical' | 'both' (default: 'both')
- `angle`: number (default: 30)

```typescript
{ type: 'AiryMouse' }
{ type: 'AiryMouse', angle: 10 }
```

### BlobMouse

Visual: Organic blob-like deformation. Fluid shape distortion.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 200, type: 'px' })
- `scale`: number (default: 1.4)

```typescript
{ type: 'BlobMouse' }
{ type: 'BlobMouse', scale: 2.4 }
```

### BlurMouse

Visual: Blur based on cursor distance. Focus/defocus by proximity.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 80, type: 'px' })
- `angle`: number (default: 5)
- `scale`: number (default: 0.3)
- `blur`: number (default: 20)
- `perspective`: number (default: 600)

```typescript
{ type: 'BlurMouse' }
{ type: 'BlurMouse', angle: 65, scale: 0.25 }
```

### BounceMouse

Visual: Bouncy/elastic cursor following. Overshoots and wobbles.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 80, type: 'px' })
- `axis`: 'horizontal' | 'vertical' | 'both'

```typescript
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both' }
```

### CustomMouse

Visual: Configurable custom behavior. For advanced custom implementations.

Parameters:

- No preset-specific parameters

```typescript
{
  type: 'CustomMouse';
}
```

### ScaleMouse

Visual: Scale based on cursor distance. Grows/shrinks by proximity.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 80, type: 'px' })
- `axis`: 'horizontal' | 'vertical' | 'both' (default: 'both')
- `scale`: number (default: 1.4)

```typescript
{ type: 'ScaleMouse', distance: { value: 100, type: 'px' } }
```

### SkewMouse

Visual: Skew distortion following cursor. Angular distortion.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 200, type: 'px' })
- `angle`: number (default: 25)
- `axis`: 'horizontal' | 'vertical' | 'both' (default: 'both')

```typescript
{ type: 'SkewMouse' }
{ type: 'SkewMouse', angle: 45 }
```

### SpinMouse

Visual: Rotation following mouse angle. Element spins based on cursor position.

Parameters:

- `axis`: 'horizontal' | 'vertical' | 'both' (default: 'both')

```typescript
{ type: 'SpinMouse' }
{ type: 'SpinMouse', axis: 'both' }
```

### SwivelMouse

Visual: Pivot-axis rotation following cursor. Gyroscope-like rotation.

Parameters:

- `angle`: number (default: 5)
- `perspective`: number (default: 800)
- `pivotAxis`: 'top' | 'bottom' | 'right' | 'left' | 'center-horizontal' | 'center-vertical' (default: 'center-horizontal')

```typescript
{ type: 'SwivelMouse' }
{ type: 'SwivelMouse', angle: 25, perspective: 1000 }
```

### Tilt3DMouse

Visual: Element tilts toward cursor in 3D, like angling a card. Premium, interactive.

Parameters:

- `angle`: number (default: 5)
- `perspective`: number (default: 800)

```typescript
{ type: 'Tilt3DMouse' }
{ type: 'Tilt3DMouse', angle: 25, perspective: 1000 }
{ type: 'Tilt3DMouse', angle: 85, perspective: 200 }
```

### Track3DMouse

Visual: Combined translation + 3D rotation following mouse. Complex, immersive.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 200, type: 'px' })
- `angle`: number (default: 5)
- `axis`: 'horizontal' | 'vertical' | 'both' (default: 'both')
- `perspective`: number (default: 800)

```typescript
{ type: 'Track3DMouse', distance: { value: 100, type: 'px' }, axis: 'both' }
{ type: 'Track3DMouse', distance: { value: 50, type: 'px' }, angle: 25, perspective: 1000 }
```

### TrackMouse

Visual: Element follows cursor position. Floating, parallax-like.

Parameters:

- `distance`: UnitLengthPercentage (default: { value: 200, type: 'px' })
- `axis`: 'horizontal' | 'vertical' | 'both' (default: 'both')

```typescript
{ type: 'TrackMouse', distance: { value: 200, type: 'px' }, axis: 'both' }
{ type: 'TrackMouse', distance: { value: 50, type: 'px' }, axis: 'horizontal' }
```

---

## Intensity Values

Tested values for different intensity levels. When a user asks for "soft", "subtle", "medium", or "hard"/"dramatic" motion, use these as guidelines.

| Preset            | Parameter(s)       | Subtle/Soft | Medium   | Dramatic/Hard |
| ----------------- | ------------------ | ----------- | -------- | ------------- |
| AiryMouse         | angle              | 10°         | 50°      | 85°           |
| BlobMouse         | scale              | 1.2         | 1.6      | 2.4           |
| BlurMouse         | angle, scale       | 0°, 1       | 25°, 0.7 | 65°, 0.25     |
| ScaleMouse (down) | scale              | 0.85        | 0.5      | 0             |
| ScaleMouse (up)   | scale              | 1.2         | 1.6      | 2.4           |
| SkewMouse         | angle              | 10°         | 20°      | 45°           |
| SwivelMouse       | angle, perspective | 25°, 1000   | 50°, 700 | 85°, 300      |
| Tilt3DMouse       | angle, perspective | 25°, 1000   | 50°, 500 | 85°, 200      |
| Track3DMouse      | angle, perspective | 25°, 1000   | 50°, 500 | 85°, 333      |

---

## Mobile Considerations

Mouse effects may behave differently on touch devices. Options:

1. Do nothing (static on mobile)
2. Use entrance animation instead
3. Use device orientation (advanced)
