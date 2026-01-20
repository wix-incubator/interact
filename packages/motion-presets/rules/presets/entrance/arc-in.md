---
name: ArcIn
category: entrance
tags: [3d, arc, curved, dramatic, cinematic, perspective, rotation, entrance, premium]
---

# ArcIn

## Synonyms

arc entrance, curved reveal, 3d arc, swing in, cinematic entrance, perspective reveal, dramatic arc

## Visual Description

Element swings into view along a curved 3D arc path. Starts rotated on an axis (X-axis for top/bottom directions, Y-axis for left/right) at approximately 80 degrees, then rotates back to flat (0 degrees) while moving along the arc. Uses `perspective(800px)` to create depth. Includes an opacity fade from 0 to 1 during the first 70% of the animation (separate fade animation with `sineIn` easing). The main arc motion uses `quintInOut` easing by default, creating smooth acceleration and deceleration. Power level controls the rotation intensity through different easing curves: soft uses `cubicInOut`, medium uses `quintInOut`, hard uses `backOut` for slight overshoot.

## When to Use

- Hero sections requiring dramatic, cinematic entrance (high confidence)
- Premium product showcases where depth and drama matter
- Portfolio pieces and creative presentations
- Featured content that needs to stand out
- Landing page hero elements
- Single focal point elements (not for lists)

## When NOT to Use

- Multiple simultaneous elements (performance concern with 3D transforms)
- Users with vestibular sensitivity (provides reduced-motion alternative: FadeIn)
- Subtle, professional interfaces where drama is inappropriate
- Mobile with many animated elements (3D transforms are expensive)
- When 2D motion would suffice (use SlideIn, GlideIn instead)
- List items or repeated content

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
// Basic - element arcs in from the left
{ type: 'ArcIn', direction: 'bottom' }

// Dramatic hero entrance with overshoot
{ type: 'ArcIn', direction: 'bottom', power: 'hard' }
// with: duration: 1400

// Subtle side panel entrance
{ type: 'ArcIn', direction: 'left', power: 'soft' }
// with: duration: 800
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
