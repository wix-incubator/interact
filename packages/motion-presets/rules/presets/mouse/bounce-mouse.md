---
name: BounceMouse
category: mouse
tags: [bounce, elastic, mouse, spring, playful, follow, interactive]
---

# BounceMouse

## Synonyms

bouncy mouse, elastic follow, spring mouse, bouncy cursor effect, elastic tracking

## Visual Description

Element follows the mouse with a bouncy, springy motion. Like a jelly or rubber ball that overshoots and wobbles before settling. Creates a playful, game-like interaction feel.

## When to Use

- Playful/fun interface elements
- Game-like interactions
- Mascot/character elements
- Child-friendly interfaces

## When NOT to Use

- Professional/corporate interfaces
- When smooth following is preferred

## Parameters

```typescript
interface BounceMouse {
  distance: { value: number; type: 'px' | 'percentage' | 'vh' | 'vw' };  // min: 5, max: 800, default: { value: 80, type: 'px' }
  axis: 'horizontal' | 'vertical' | 'both';                              // default: 'both'
  inverted?: boolean;                                                    // default: false
  transitionDuration?: number;                                           // min: 0, max: 5000, step: 20, default: 500
  transitionEasing?: 'elastic' | 'bounce';                              // default: 'elastic'
}
```

**Parameter Impact:**

- `distance`: Maximum translation distance (default 80px, smaller than TrackMouse)
- `axis`: Movement constraint (horizontal, vertical, or both)
- `transitionEasing`: Spring behavior
  - `elastic`: Smooth spring with overshoot and settle
  - `bounce`: Multiple bounces before settling
- `inverted`: Element bounces away from mouse instead of towards

## Minimal Examples

```typescript
// Basic
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both' }
```

## Related Presets

### Same Category (Mouse)

- **TrackMouse** - Same tracking without bounce easing
- **ScaleMouse** - Scale-based mouse response
- **Tilt3DMouse** - 3D tilt mouse response

### Parallel in Other Triggers

- **BounceIn** (entrance) - Bouncy entrance animation
- **Bounce** (ongoing) - Continuous bounce animation

### Alternatives

- **TrackMouse** - When smooth following preferred
- **Tilt3DMouse** - When 3D effect preferred
- **ScaleMouse** - When scale response preferred

## Decision Hints

```yaml
choose_this_when:
  - "playful mouse interaction"
  - "game-like interface"
  - "elastic/springy feel"
  - "character/mascot following"
  - "fun/energetic brand"

choose_alternative_when:
  - smooth_following: TrackMouse
  - 3d_effect: Tilt3DMouse
  - scale_based: ScaleMouse
  - professional_interface: TrackMouse (with easeOut)
```
