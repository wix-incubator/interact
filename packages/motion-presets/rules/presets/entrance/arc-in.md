---
name: ArcIn
category: entrance
tags: [3d, arc, curved, dramatic, cinematic, perspective, rotation, entrance, premium]
---

# ArcIn

## Synonyms

arc entrance, curved reveal, 3d arc, swing in, cinematic entrance, perspective reveal, dramatic arc

## Visual Description

Element swings into view along a curved path, like a door opening towards you. It starts tilted away and gradually flattens as it settles into place. Fades in while moving. The effect feels dramatic and cinematic, with a sense of depth.

## When to Use

- Hero sections needing dramatic reveal
- Premium/featured content
- Single focal elements requiring attention

## When NOT to Use

- Multiple simultaneous elements
- Subtle, professional interfaces
- Mobile with many animated elements

## Parameters

```typescript
interface ArcIn {
  direction: 'top' | 'right' | 'bottom' | 'left';  // EffectFourDirections, default: 'left'
  power?: 'soft' | 'medium' | 'hard';              // default: 'medium'
  duration?: number;   // min: 0, max: 4000, step: 100, default: 1200
  delay?: number;      // min: 0, max: 8000, step: 100, default: 0
  easing?: Easing;     // full set supported, default: 'quintInOut'
}
```

**Parameter Impact:**

- `direction`: Determines rotation axis and arc origin
  - `top`/`bottom`: Rotates on X-axis (tilts forward/backward)
  - `left`/`right`: Rotates on Y-axis (tilts sideways)
- `power`: Controls easing curve and perceived intensity
  - `soft`: `cubicInOut` - gentle, subtle arc
  - `medium`: `quintInOut` - balanced, noticeable arc
  - `hard`: `backOut` - dramatic with slight overshoot

## Minimal Examples

```typescript
// Basic - swings in from bottom
{ type: 'ArcIn', direction: 'bottom' }

// Side entry (tilts on different axis)
{ type: 'ArcIn', direction: 'left' }
```

## Related Presets

### Same Category (Entrance)

- **FlipIn** - Simpler 3D flip without arc path, just rotation
- **TurnIn** - Corner-based 3D rotation, more complex pivot point
- **CurveIn** - Alternative curved 3D motion, different path

### Parallel in Other Triggers

- **ArcScroll** (scroll) - Arc motion driven by scroll position
- **TiltScroll** (scroll) - 3D tilt on scroll, similar perspective

### Alternatives

- **FadeIn** - When subtle is needed, reduced motion fallback
- **SlideIn** - When 2D motion preferred, less dramatic
- **GlideIn** - Smooth 2D glide with angle control

## Decision Hints

```yaml
choose_this_when:
  - "dramatic 3D entrance needed"
  - "hero/featured content"
  - "cinematic feel"
  - "premium brand"
  - "single focal element"

choose_alternative_when:
  - subtle_needed: FadeIn, BlurIn
  - 2d_preferred: SlideIn, GlideIn
  - playful_bouncy: BounceIn
  - scroll_driven: ArcScroll
  - simpler_3d: FlipIn
```
