---
name: Bounce
category: ongoing
---

# Bounce

## Visual Description

Element bounces up and down continuously in a playful, physics-inspired motion. Like a ball on a trampoline, the element jumps upward, reaches a peak, falls back down, and bounces again with decreasing height until the cycle resets.

**The motion**: Starting from its rest position, the element moves upward, reaches its peak, falls back down past the rest position (like a ball compressing on impact), then bounces up again with less height. This continues until bounces become minimal, then the cycle restarts.

**The visual effect**: Energetic, playful, and attention-grabbing. The bouncing feels alive, like something excited or trying to get your attention. It's inherently fun and casual—not suitable for serious or professional contexts.

Bounce is one of the more intense ongoing animations. Use it when you want to add playful energy and don't mind the element constantly demanding attention.

## Parameters

```typescript
interface Bounce {
  power?: 'soft' | 'medium' | 'hard'; // default: 'soft'
  intensity?: number; // 0-1, min: 0, max: 1, step: 0.1, default: 0.3
  duration?: number; // ms, min: 100, max: 4000, step: 100, default: 1200
  delay?: number; // ms, min: 0, max: 8000, step: 100, default: 1000
}
```

**Parameter Impact:**

- `power`: Preset bounce height multipliers
  - `soft` (default): ~49px maximum height, contained bounces—noticeable but not wild
  - `medium`: ~98px maximum height, clearly bouncy—playful and energetic
  - `hard`: ~147px maximum height, dramatic bounces—very attention-grabbing, potentially annoying
- `intensity`: Fine-grained control (0-1) mapping to factor 1-3
  - 0.3 (default) = soft
  - 0.5 = medium
  - 1.0 = hard
- `duration`: Full bounce cycle time
  - **800-1000ms**: Quick, energetic bouncing
  - **1200ms (default)**: Balanced timing
  - **1500ms+**: Slower, more deliberate bounces
- `delay`: Initial wait before bouncing starts
  - Gives users a moment before the motion begins

## Best Practices

- **Use sparingly**: Bounce is inherently distracting—reserve for elements that truly need attention
- **One bouncing element**: Multiple bouncing elements create visual chaos
- **Match the brand**: Bounce is playful/casual; ensure it fits the overall tone
- **Consider the context**: Bouncing indefinitely can become annoying—consider triggering only when relevant
- **Reduced motion**: Always provide alternative (stop animation entirely or switch to subtle Pulse)

## Examples

```typescript
// Basic - subtle continuous bounce
{ type: 'Bounce' }

// Playful mascot/character
{ type: 'Bounce', power: 'medium', duration: 1000 }

// Attention indicator (jump here!)
{ type: 'Bounce', power: 'soft', duration: 1500 }

// Game reward/achievement
{ type: 'Bounce', power: 'hard', duration: 800 }

// Gentle notification (less intrusive)
{ type: 'Bounce', power: 'soft', intensity: 0.2, duration: 1400 }
```
