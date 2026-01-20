---
name: TrackMouse
category: mouse
tags: [track, follow, mouse, movement, translate, interactive, cursor]
---

# TrackMouse

## Synonyms

mouse tracking, follow cursor, cursor follow, mouse movement, parallax mouse, floating follow

## Visual Description

Element translates (moves) to follow mouse position within tracking area. Mouse at center = element at original position. Moving mouse towards edges translates element in same (or opposite if inverted) direction. Distance parameter controls maximum translation distance. Axis parameter limits movement to horizontal, vertical, or both. Optional transition smoothing creates fluid following effect rather than instant tracking.

## When to Use

- Parallax-like mouse effects (high confidence)
- Interactive backgrounds with depth layers
- Floating elements that follow cursor
- Decorative elements responding to mouse
- Interactive hero sections
- Game-like cursor interactions
- Creating depth with multiple layers at different distances

## When NOT to Use

- Elements that need precise positioning
- Interactive/clickable elements (confusing hit targets)
- Text content (hard to read while moving)
- Mobile devices (no mouse)
- Performance-constrained with many elements
- When accessibility is priority

## Parameters

```typescript
interface TrackMouse {
  distance: { value: number; type: 'px' | 'percentage' | 'vh' | 'vw' };  // min: 5, max: 800, default: { value: 250, type: 'px' }
  axis: 'horizontal' | 'vertical' | 'both';                              // default: 'both'
  power?: 'soft' | 'medium' | 'hard';                                    // default: 'medium'
  inverted?: boolean;                                                    // default: false
  transitionDuration?: number;                                           // min: 0, max: 5000, step: 20, default: 500
  transitionEasing?: 'linear' | 'easeOut' | 'hardBackOut';              // default: 'easeOut'
}
```

**Parameter Impact:**

- `distance`: Maximum translation distance from center
  - Higher values = element moves further
  - Different units for responsive behavior
- `axis`: Movement constraint
  - `both`: Moves in 2D following cursor
  - `horizontal`: Only left/right movement
  - `vertical`: Only up/down movement
- `power`: Affects easing
  - `soft`: Linear easing
  - `medium`: `easeOut`
  - `hard`: `hardBackOut` (slight overshoot)
- `inverted`: Element moves opposite to mouse direction

## Minimal Examples

```typescript
// Basic - follows mouse
{ type: 'TrackMouse', distance: { value: 200, type: 'px' }, axis: 'both' }

// Horizontal only parallax
{ type: 'TrackMouse', distance: { value: 100, type: 'px' }, axis: 'horizontal' }
// with: transitionDuration: 300

// Inverted (moves away from mouse)
{ type: 'TrackMouse', distance: { value: 150, type: 'px' }, axis: 'both', inverted: true }

// Large range with smooth transition
{ type: 'TrackMouse', distance: { value: 400, type: 'px' }, axis: 'both' }
// with: transitionDuration: 600, transitionEasing: 'easeOut'
```

## Related Presets

### Same Category (Mouse)

- **Tilt3DMouse** - 3D rotation instead of translation
- **Track3DMouse** - Combined translation + rotation
- **BounceMouse** - Tracking with elastic easing

### Parallel in Other Triggers

- **ParallaxScroll** (scroll) - Parallax on scroll instead of mouse
- **MoveScroll** (scroll) - Movement on scroll
- **GlideIn** (entrance) - Directional entrance animation

### Alternatives

- **Tilt3DMouse** - When 3D rotation preferred
- **BounceMouse** - When bouncy/elastic feel wanted
- **ScaleMouse** - When scale effect preferred

## Decision Hints

```yaml
choose_this_when:
  - "element follows cursor"
  - "parallax mouse effect"
  - "floating/hovering elements"
  - "depth layers on mouse"
  - "decorative cursor interaction"

choose_alternative_when:
  - 3d_tilt: Tilt3DMouse
  - bouncy_elastic: BounceMouse
  - scale_effect: ScaleMouse
  - z_rotation: SwivelMouse
  - scroll_based: ParallaxScroll
```
