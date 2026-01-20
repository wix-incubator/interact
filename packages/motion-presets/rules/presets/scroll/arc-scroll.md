---
name: ArcScroll
category: scroll
tags: [3d, arc, scroll, rotation, perspective, tilt, depth]
---

# ArcScroll

## Synonyms

scroll arc, 3d scroll, tilt scroll, rotation scroll, perspective scroll, scroll rotation

## Visual Description

Element tilts and rotates in 3D as you scroll, like a card flipping towards or away from you. Creates a dramatic, cinematic reveal with depth. The element appears to exist in 3D space, rotating on an invisible axis as scroll progresses.

## When to Use

- Dramatic scroll-based reveals
- Portfolio or showcase pages
- Hero sections with 3D depth

## When NOT to Use

- Multiple simultaneous elements
- Text-heavy content
- Mobile with performance concerns

## Parameters

```typescript
interface ArcScroll {
  direction: 'horizontal' | 'vertical';  // EffectTwoAxes, default: 'vertical'
  range?: 'in' | 'out' | 'continuous';   // default: 'continuous' (wix) or 'in'/'out' (responsive)
  // Scroll range params
  start?: number;    // varies by range
  end?: number;      // varies by range
}
```

**Parameter Impact:**

- `direction`: Rotation axis
  - `vertical`: Rotates on X-axis (tilts forward/backward)
  - `horizontal`: Rotates on Y-axis (tilts left/right)
- `range`: When rotation occurs
  - `in`: Rotates from tilted to flat as enters viewport
  - `out`: Rotates from flat to tilted as exits viewport
  - `continuous`: Full rotation throughout scroll

## Minimal Examples

```typescript
// Tilts left/right as you scroll
{ type: 'ArcScroll', direction: 'horizontal' }

// Tilts forward/backward as you scroll
{ type: 'ArcScroll', direction: 'vertical' }
```

## Related Presets

### Same Category (Scroll)

- **TiltScroll** - Similar 3D tilt, different implementation
- **FlipScroll** - Full flip rotation on scroll
- **Spin3dScroll** - Continuous spin on scroll

### Parallel in Other Triggers

- **ArcIn** (entrance) - Time-based arc entrance
- **FlipIn** (entrance) - Time-based 3D flip

### Alternatives

- **TiltScroll** - Alternative 3D tilt approach
- **FadeScroll** - When subtle effect needed
- **ParallaxScroll** - When 2D depth preferred

## Decision Hints

```yaml
choose_this_when:
  - "dramatic 3D scroll effect"
  - "cinematic reveal"
  - "portfolio/showcase"
  - "single focal element"
  - "creative/artistic design"

choose_alternative_when:
  - subtle_needed: FadeScroll, ParallaxScroll
  - full_flip: FlipScroll
  - continuous_spin: SpinScroll
  - 2d_depth: ParallaxScroll
  - time_based: ArcIn
```
