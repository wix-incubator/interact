---
name: Bounce
category: ongoing
tags: [bounce, vertical, movement, playful, continuous, attention, jump]
---

# Bounce

## Synonyms

bouncing, jumping, hopping, vertical bounce, continuous bounce, bouncy animation

## Visual Description

Element continuously bounces up and down with realistic physics-based motion. Keyframe sequence simulates gravity: rises quickly to peak (-98px at highest), falls back, bounces smaller (-55px), repeats with decreasing amplitude (-23px, -5px, -2px) before settling and restarting. Uses `sineOut` easing for natural acceleration/deceleration. Power/intensity controls the bounce height multiplier (factor 1-3). Creates playful, energetic continuous motion.

## When to Use

- Playful/fun interface elements (high confidence)
- Gamification indicators
- "Jump here" attention indicators
- Waiting states with personality
- Interactive elements in games
- Child-friendly interfaces
- Mascots or character elements

## When NOT to Use

- Professional/corporate interfaces (too playful)
- Text content (hard to read)
- Multiple simultaneous elements (chaotic)
- Serious contexts (warnings, errors)
- Accessibility concerns (motion sensitivity)
- When subtle attention is needed

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
// Basic - gentle bounce
{ type: 'Bounce' }

// Energetic bounce
{ type: 'Bounce', power: 'medium' }
// with: duration: 1000

// Dramatic attention bounce
{ type: 'Bounce', power: 'hard' }
// with: duration: 1500

// Custom intensity
{ type: 'Bounce', intensity: 0.6 }
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
