---
name: Pulse
category: ongoing
---

# Pulse

## Visual Description

Element gently expands and contracts in a continuous rhythmic pattern, like a heartbeat or something softly breathing. The scale oscillates—growing slightly larger, then shrinking back to normal size—in an endless loop.

**The motion**: The element starts at its normal size, grows slightly (maybe 5-15% larger), then shrinks back. This cycle repeats continuously. The timing feels organic, like a pulse or breath, not mechanical.

**The visual effect**: Creates a sense of life and activity without being aggressive or distracting. The pulsing draws attention subtly, suggesting "hey, look here" without shouting. It's the gentlest way to indicate something is active, alive, or important.

Pulse is the most universally safe ongoing animation—it's subtle enough for professional contexts and doesn't trigger motion sensitivity as strongly as movement-based animations.

## Parameters

```typescript
interface Pulse {
  power?: 'soft' | 'medium' | 'hard';  // default: 'soft'
  intensity?: number;                   // 0-1, min: 0, max: 1, step: 0.1, default: 0
  duration?: number;  // ms, min: 100, max: 4000, step: 100, default: 1300
  delay?: number;     // ms, min: 0, max: 8000, step: 100, default: 1000
}
```

**Parameter Impact:**

- `power`: Preset intensity levels for the pulse magnitude
  - `soft` (default): Very subtle pulse, barely noticeable—professional, gentle
  - `medium`: Noticeable pulse, clearly alive—good for status indicators
  - `hard`: Pronounced pulse, attention-demanding—use for important alerts
- `intensity`: Fine-grained control over pulse magnitude (0-1)
  - Overrides `power` if specified
  - 0 = no pulse, 1 = maximum pulse
  - Use for precise control when presets don't fit
- `duration`: Full pulse cycle time (expand + contract)
  - **800-1000ms**: Quick, energetic pulse
  - **1300ms (default)**: Balanced, natural feeling
  - **2000ms+**: Slow, breathing-like rhythm
- `delay`: Initial wait before pulsing begins
  - Useful for staggering multiple pulsing elements

## Best Practices

- **One pulsing element at a time**: Multiple simultaneous pulses are visually chaotic
- **Use for status, not content**: Pulse is for "this is active/important," not for decorating content
- **Prefer `soft` power**: Start subtle; increase only if attention isn't captured
- **Combine with color/icon**: Pulse alone may not convey meaning—pair with visual indicators
- **Safe for reduced motion**: Pulse (soft) is often acceptable even with reduced motion preference, but offer disable option

## Examples

```typescript
// Basic - subtle pulse indicating activity
{ type: 'Pulse' }

// Live status indicator (streaming, recording)
{ type: 'Pulse', power: 'medium', duration: 1000 }

// Gentle notification badge
{ type: 'Pulse', power: 'soft', duration: 1500 }

// Attention-demanding alert
{ type: 'Pulse', power: 'hard', duration: 800 }

// Slow, calming breathing effect
{ type: 'Pulse', power: 'soft', duration: 2500 }
```
