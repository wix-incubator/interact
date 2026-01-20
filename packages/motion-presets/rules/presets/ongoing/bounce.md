---
name: Bounce
category: ongoing
tags: [bounce, vertical, movement, playful, continuous, attention, jump]
---

# Bounce

## Synonyms

bouncing, jumping, hopping, vertical bounce, continuous bounce, bouncy animation

## Visual Description

Element continuously bounces up and down like a ball on a trampoline. Bounces high, then smaller and smaller before the cycle repeats. Creates playful, energetic, attention-grabbing continuous motion.

## When to Use

- Playful/fun interface elements
- Gamification indicators
- "Jump here" attention indicators
- Child-friendly interfaces

## When NOT to Use

- Professional/corporate interfaces
- Multiple simultaneous elements

## Parameters

```typescript
interface Bounce {
  power?: 'soft' | 'medium' | 'hard';  // default: 'soft'
  intensity?: number;                   // min: 0, max: 1, step: 0.1, default: 0.3 (responsive)
  duration?: number;  // min: 100, max: 4000, step: 100, default: 1200
  delay?: number;     // min: 0, max: 8000, step: 100, default: 1000
}
```

**Parameter Impact:**

- `power`: Preset bounce height multipliers
  - `soft`: Factor 1 - subtle bounces (~49px max height)
  - `medium`: Factor 2 - noticeable bounces (~98px)
  - `hard`: Factor 3 - dramatic bounces (~147px)
- `intensity`: Fine-grained control (0-1), maps to factor 1-3
- `delay`: Pause before bounce cycle starts
- `duration`: Full bounce cycle time

## Minimal Examples

```typescript
// Basic
{ type: 'Bounce' }
```

## Related Presets

### Same Category (Ongoing)

- **Pulse** - Scale-based instead of movement
- **Swing** - Rotation-based oscillation
- **Wiggle** - Horizontal movement oscillation

### Parallel in Other Triggers

- **BounceIn** (entrance) - One-time bounce entrance
- **BounceMouse** (mouse) - Bouncy response to mouse

### Alternatives

- **Pulse** - When scale-based attention preferred
- **Swing** - When rotation preferred
- **Wiggle** - When horizontal movement preferred

## Decision Hints

```yaml
choose_this_when:
  - "playful/fun interface"
  - "gamification element"
  - "energetic attention"
  - "character/mascot animation"
  - "vertical movement needed"

choose_alternative_when:
  - scale_based: Pulse
  - rotation_based: Swing, Spin
  - horizontal: Wiggle
  - subtle_attention: Pulse (soft)
  - one_time: BounceIn
```
