---
name: Spin
category: ongoing
tags: [spin, rotation, continuous, loading, circular, rotate]
---

# Spin

## Synonyms

spinning, rotating, rotation, circular motion, revolve, turn continuously

## Visual Description

Element continuously rotates 360 degrees around its center. Direction determines clockwise (default) or counter-clockwise rotation. Power level affects the easing: soft uses linear (constant speed), medium uses `quintInOut` (accelerate/decelerate), hard uses `backOut` (slight overshoot at end). Rotation preserves any existing component rotation (`--comp-rotate-z`). Creates smooth, continuous circular motion.

## When to Use

- Loading indicators (high confidence)
- Processing/waiting states
- Refresh icons during action
- Decorative spinning elements
- Gear/mechanical animations
- Fan/propeller effects
- Abstract decorative motion

## When NOT to Use

- Text elements (unreadable)
- Interactive elements during spin
- Multiple simultaneous spins (dizzying)
- Vestibular sensitivity concerns
- When spin direction is semantically meaningful but not clear
- Professional interfaces (can feel amateurish if overused)

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
// Basic - slow constant spin
{ type: 'Spin', direction: 'clockwise' }

// Loading indicator (faster)
{ type: 'Spin', direction: 'clockwise' }
// with: duration: 1000, easing: 'linear'

// Dynamic spin with overshoot
{ type: 'Spin', direction: 'counter-clockwise', power: 'hard' }
// with: duration: 2000

// Very slow decorative spin
{ type: 'Spin', direction: 'clockwise', power: 'soft' }
// with: duration: 15000
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
