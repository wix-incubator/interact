---
name: Spin
category: ongoing
tags: [spin, rotation, continuous, loading, circular, rotate]
---

# Spin

## Synonyms

spinning, rotating, rotation, circular motion, revolve, turn continuously

## Visual Description

Element continuously rotates around its center, like a wheel or loading spinner. Can spin clockwise or counter-clockwise at constant speed or with acceleration/deceleration. Creates smooth, continuous circular motion.

## When to Use

- Loading indicators
- Processing/waiting states
- Refresh icons during action
- Decorative spinning elements

## When NOT to Use

- Text elements (unreadable)
- Multiple simultaneous spins

## Parameters

```typescript
interface Spin {
  direction: 'clockwise' | 'counter-clockwise';  // EffectSpinDirections, default: 'clockwise'
  power?: 'soft' | 'medium' | 'hard';            // default: 'soft'
  duration?: number;  // min: 100, max: 50000, step: 100, default: 7000
  delay?: number;     // min: 0, max: 8000, step: 100, default: 0
  easing?: Easing;    // default: 'linear' (responsive)
}
```

**Parameter Impact:**

- `direction`: Rotation direction
  - `clockwise`: Rotates right (default, natural feeling)
  - `counter-clockwise`: Rotates left
- `power`: Controls easing curve
  - `soft`: Linear - constant speed, mechanical feel
  - `medium`: `quintInOut` - accelerates then decelerates
  - `hard`: `backOut` - slight overshoot, more dynamic
- `duration`: One full rotation time (default 7000ms = 7 seconds, slow)

## Minimal Examples

```typescript
// Basic - clockwise spin
{ type: 'Spin', direction: 'clockwise' }

// Counter-clockwise
{ type: 'Spin', direction: 'counter-clockwise' }
```

## Related Presets

### Same Category (Ongoing)

- **Swing** - Oscillating rotation (back and forth)
- **Flip** - 180° flips, not continuous

### Parallel in Other Triggers

- **SpinIn** (entrance) - Spin into view (one-time)
- **SpinScroll** (scroll) - Rotation driven by scroll
- **SpinMouse** (mouse) - Rotation following mouse

### Alternatives

- **Swing** - When oscillation preferred over full rotation
- **Pulse** - When scale-based attention preferred
- **Flip** - When flip effect preferred

## Decision Hints

```yaml
choose_this_when:
  - "loading/processing indicator"
  - "refresh icon animation"
  - "decorative rotation"
  - "mechanical/gear effect"
  - "continuous circular motion"

choose_alternative_when:
  - oscillation_needed: Swing
  - scale_based: Pulse
  - entrance_spin: SpinIn
  - scroll_driven: SpinScroll
  - mouse_driven: SpinMouse
```
