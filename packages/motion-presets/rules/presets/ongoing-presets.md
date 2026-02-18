---
name: ongoing-presets-reference
description: Full parameter details, examples, and intensity guide for ongoing presets. Read when configuring specific ongoing preset parameters or choosing intensity levels for looping and continuous animations.
category: ongoing
---

# Ongoing Presets

All ongoing preset parameters and TypeScript examples. For category overview and selection guidance, see [presets-main.md](presets-main.md).

## Table of Contents

- [Preset Reference](#preset-reference)
- [Intensity Values](#intensity-values)

---

## Preset Reference

### Bounce

Visual: Vertical bouncing motion. Playful, energetic.

Parameters:

- `intensity`: number 0-1 (default: 0)

```typescript
{ type: 'Bounce' }
{ type: 'Bounce', intensity: 0.5 }
```

### Breathe

Visual: Slow scale in/out like breathing. Calm, organic, meditative.

Parameters:

- `direction`: 'vertical' | 'horizontal' | 'center' (default: 'vertical')
- `distance`: UnitLengthPercentage (default: { value: 25, type: 'px' })
- `perspective`: number (default: 800)

```typescript
{ type: 'Breathe', direction: 'center' }
{ type: 'Breathe', direction: 'center', distance: { value: 10, type: 'percentage' } }
```

### Cross

Visual: X-pattern diagonal movement. Unique geometric motion.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' (default: 'right')

```typescript
{ type: 'Cross', direction: 'top-left' }
```

### DVD

Visual: Corner-to-corner bounce (DVD screensaver). Nostalgic, retro.

Parameters:

- No preset-specific parameters

```typescript
{
  type: 'DVD';
}
```

### Flash

Visual: Opacity pulsing/blinking. Attention, warning indicator.

Parameters:

- No preset-specific parameters

```typescript
{
  type: 'Flash';
}
```

### Flip

Visual: Periodic 180° flips. Card-like rotation showing front/back.

Parameters:

- `direction`: 'vertical' | 'horizontal' (default: 'horizontal')
- `perspective`: number (default: 800)

```typescript
{ type: 'Flip', direction: 'horizontal' }
```

### Fold

Visual: 3D folding motion. Paper-like folding and unfolding.

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'top')
- `angle`: number in degrees (default: 15)

```typescript
{ type: 'Fold', direction: 'left' }
{ type: 'Fold', direction: 'top', angle: 45 }
```

### Jello

Visual: Wobbly elastic deformation. Jiggly, bouncy distortion.

Parameters:

- `intensity`: number 0-1 (default: 0.25)

```typescript
{ type: 'Jello' }
{ type: 'Jello', intensity: 1 }
```

### Poke

Visual: Quick scale bump like being tapped. Brief attention "boop".

Parameters:

- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'right')
- `intensity`: number 0-1 (default: 0.5)

```typescript
{ type: 'Poke', direction: 'top' }
{ type: 'Poke', direction: 'right', intensity: 1 }
```

### Pulse

Visual: Gentle scale oscillation, heartbeat-like rhythm. Subtle, universal.

Parameters:

- `intensity`: number 0-1 (default: 0)

```typescript
{ type: 'Pulse' }
{ type: 'Pulse', intensity: 0.5 }
```

### Rubber

Visual: Elastic stretch effect. Springy stretching and snapping.

Parameters:

- `intensity`: number 0-1 (default: 0.5)

```typescript
{ type: 'Rubber' }
{ type: 'Rubber', intensity: 1 }
```

### Spin

Visual: Continuous rotation around center. Mechanical, precise.

Parameters:

- `direction`: 'clockwise' | 'counter-clockwise' (default: 'clockwise')

```typescript
{ type: 'Spin', direction: 'clockwise' }
```

### Swing

Visual: Rotation oscillation like a pendulum. Back and forth rhythmic.

Parameters:

- `swing`: number in degrees (default: 20)
- `direction`: 'top' | 'right' | 'bottom' | 'left' (default: 'top')

```typescript
{ type: 'Swing' }
{ type: 'Swing', swing: 60 }
```

### Wiggle

Visual: Horizontal shake/wiggle. Side-to-side for attention.

Parameters:

- `intensity`: number 0-1 (default: 0.5)

```typescript
{ type: 'Wiggle' }
{ type: 'Wiggle', intensity: 1 }
```

---

## Intensity Values

Tested values for different intensity levels. When a user asks for "soft", "subtle", "medium", or "hard"/"dramatic" motion, use these as guidelines.

| Preset | Parameter | Subtle/Soft | Medium | Dramatic/Hard |
| ------ | --------- | ----------- | ------ | ------------- |
| Bounce | intensity | 0           | 0.5    | 1             |
| Fold   | angle     | 15°         | 30°    | 45°           |
| Jello  | intensity | 0           | 0.33   | 1             |
| Poke   | intensity | 0           | 0.33   | 1             |
| Pulse  | intensity | 0           | 0.5    | 1             |
| Rubber | intensity | 0           | 0.5    | 1             |
| Swing  | swing     | 20°         | 40°    | 60°           |
| Wiggle | intensity | 0           | 0.33   | 1             |
