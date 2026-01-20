---
name: Pulse
category: ongoing
tags: [pulse, scale, attention, heartbeat, throb, continuous, subtle]
---

# Pulse

## Synonyms

pulse effect, heartbeat, throb, breathing, scale pulse, attention pulse, pulsing

## Visual Description

Element gently shrinks and expands in a rhythmic, heartbeat-like pattern. Like something breathing or pulsing with life. Creates subtle, continuous attention without being distracting.

## When to Use

- Drawing attention to important elements
- Live/active status indicators
- Notification badges
- Waiting/processing states

## When NOT to Use

- Multiple elements simultaneously
- Professional/minimal interfaces

## Parameters

```typescript
interface Pulse {
  power?: 'soft' | 'medium' | 'hard';  // default: 'soft'
  intensity?: number;                   // min: 0, max: 1, step: 0.1, default: 0 (responsive)
  duration?: number;  // min: 100, max: 4000, step: 100, default: 1300
  delay?: number;     // min: 0, max: 8000, step: 100, default: 1000
}
```

**Parameter Impact:**

- `power`: Preset intensity levels
  - `soft`: Offset 0 - very subtle pulse
  - `medium`: Offset 0.06 - noticeable pulse
  - `hard`: Offset 0.12 - pronounced pulse
- `intensity`: Fine-grained control (0-1), overrides power
- `delay`: Time before animation starts (useful for staggering)
- `duration`: Full cycle time (includes delay in calculation)

## Minimal Examples

```typescript
// Basic
{ type: 'Pulse' }
```

## Related Presets

### Same Category (Ongoing)

- **Breathe** - Scale-based but different timing pattern
- **Flash** - Opacity-based attention effect

### Parallel in Other Triggers

- **GrowScroll** (scroll) - Scale change on scroll
- **DropIn** (entrance) - Scale-based entrance

### Alternatives

- **Flash** - When opacity-based attention preferred
- **Bounce** - When vertical movement preferred
- **Breathe** - When different rhythm needed

## Decision Hints

```yaml
choose_this_when:
  - "subtle continuous attention"
  - "heartbeat/living effect"
  - "status indicator"
  - "notification badge"
  - "gentle CTA emphasis"

choose_alternative_when:
  - opacity_based: Flash
  - vertical_movement: Bounce
  - rotation: Spin
  - different_rhythm: Breathe
  - one_time_attention: BounceIn, PunchIn
```
