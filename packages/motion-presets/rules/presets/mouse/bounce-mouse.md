---
name: BounceMouse
category: mouse
tags: [bounce, elastic, mouse, spring, playful, follow, interactive]
---

# BounceMouse

## Synonyms

bouncy mouse, elastic follow, spring mouse, bouncy cursor effect, elastic tracking

## Visual Description

Element follows mouse position with elastic/bouncy easing, creating spring-like motion. Built on TrackMouse foundation but with `elastic` or `bounce` transition easing. When mouse moves, element overshoots its target position then bounces back to settle. Creates playful, game-like interaction feel. Same translation behavior as TrackMouse but with springy physics.

## When to Use

- Playful/fun interface elements (high confidence)
- Game-like interactions
- Child-friendly interfaces
- Mascot/character elements following cursor
- Energetic brand interactions
- Interactive easter eggs
- Engaging decorative elements

## When NOT to Use

- Professional/corporate interfaces
- Precise interactions needed
- Multiple elements (chaotic)
- Performance-constrained
- Accessibility-focused (motion sensitivity)
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
// Basic - elastic bounce following
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both' }

// Bounce easing variant
{ type: 'BounceMouse', distance: { value: 100, type: 'px' }, axis: 'both' }
// with: transitionEasing: 'bounce'

// Horizontal only bounce
{ type: 'BounceMouse', distance: { value: 60, type: 'px' }, axis: 'horizontal' }

// Inverted bounce (moves away)
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both', inverted: true }
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
