---
name: ArcScroll
category: scroll
tags: [3d, arc, scroll, rotation, perspective, tilt, depth]
---

# ArcScroll

## Synonyms

scroll arc, 3d scroll, tilt scroll, rotation scroll, perspective scroll, scroll rotation

## Visual Description

Element rotates in 3D space along an arc path as user scrolls. Uses `perspective(500px)` with `translateZ(-300px)` to create depth, then rotates on X-axis (vertical direction) or Y-axis (horizontal direction) through 68 degrees. In `in` range, rotates from -68° to 0°. In `out` range, rotates from 0° to 68°. In `continuous` range, rotates full -68° to +68° throughout scroll. Fill mode set automatically based on range. Linear easing ensures smooth, predictable rotation mapped to scroll position.

## When to Use

- Dramatic scroll-based reveals (high confidence)
- Portfolio or showcase pages
- Storytelling with cinematic feel
- Hero sections with 3D depth
- Single featured elements per viewport
- Creative/artistic page designs

## When NOT to Use

- Multiple simultaneous elements (performance, visual noise)
- Text-heavy content (readability during rotation)
- Mobile devices with performance concerns
- Vestibular sensitivity concerns
- Data-dense interfaces
- When subtle scroll effect is needed

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
// Basic - continuous horizontal arc
{ type: 'ArcScroll', direction: 'horizontal' }

// Vertical arc on entry
{ type: 'ArcScroll', direction: 'vertical', range: 'in' }

// Arc out as exits
{ type: 'ArcScroll', direction: 'horizontal', range: 'out' }
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
