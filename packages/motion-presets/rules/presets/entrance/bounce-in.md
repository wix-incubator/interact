---
name: BounceIn
category: entrance
---

# BounceIn

## Visual Description

Element bounces into view with playful, physics-inspired motion that mimics a ball dropping and bouncing to rest. The animation creates an energetic, fun, attention-grabbing entrance that feels alive and dynamic.

**At the start**: The element is invisible and positioned away from its final location (based on direction). If coming from `top`, it's above; if from `center`, it's scaled down like approaching from far away.

**During the animation**: The element moves toward its final position but overshoots it, then bounces back. This bounce-settle pattern repeats with decreasing amplitude—each bounce is smaller than the last—until the element comes to rest. Simultaneously, the element fades in during the initial approach.

**At the end**: The element is fully visible, in its final position, completely settled with no residual motion.

The effect feels playful, energetic, and attention-grabbing. It's perfect for elements that should feel fun, alive, or important enough to demand attention.

## Parameters

```typescript
interface BounceIn {
  direction: 'top' | 'right' | 'bottom' | 'left' | 'center';  // default: 'top'
  power?: 'soft' | 'medium' | 'hard';        // default: 'soft'
  distanceFactor?: number;                    // min: 1, max: 4, step: 0.1, default: 1
  duration?: number;  // ms, min: 0, max: 4000, step: 100, default: 1200
  delay?: number;     // ms, min: 0, max: 8000, step: 100, default: 0
}
```

**Parameter Impact:**

- `direction`: Origin point of the bounce
  - `top`: Bounces down from above, like something dropping from the ceiling
  - `bottom`: Bounces up from below, like something popping up from the ground
  - `left`/`right`: Bounces horizontally, like something thrown from the side
  - `center`: Bounces on Z-axis with 3D perspective—element appears to bounce toward the viewer from far away. Most dramatic option
- `power`: Controls bounce amplitude (how far it overshoots)
  - `soft` (default): Factor 1, subtle bounces—professional enough for business contexts
  - `medium`: Factor 2, noticeable bounces—clearly playful
  - `hard`: Factor 3, dramatic large bounces—very energetic, potentially distracting
- `distanceFactor`: Fine-grained control over bounce travel distance (1-4)
  - Lower values = tighter, more contained bounces
  - Higher values = larger, more exaggerated bounces
- `duration`: Total animation time including all bounces
  - **800-1000ms**: Quick, snappy bounces
  - **1200ms (default)**: Balanced timing
  - **1500ms+**: Slow, deliberate bounces

## Best Practices

- **Use for attention**: BounceIn demands attention—reserve for elements that deserve it (notifications, CTAs, rewards)
- **Limit to one element**: Multiple simultaneous bounces create visual chaos
- **Consider the context**: BounceIn is inherently playful; it may feel unprofessional in corporate/serious contexts
- **`center` direction is most dramatic**: Use for maximum impact, but it's also the most intense for motion-sensitive users
- **Reduced motion**: Always provide FadeIn fallback—bouncing can trigger vestibular discomfort

## Examples

```typescript
// Basic - bounces down from above
{ type: 'BounceIn' }

// Notification badge - subtle but noticeable
{ type: 'BounceIn', direction: 'top', power: 'soft' }

// Reward/Achievement popup - dramatic center bounce
{ type: 'BounceIn', direction: 'center', power: 'medium' }

// Playful CTA button
{ type: 'BounceIn', direction: 'bottom', power: 'medium', duration: 1000 }

// Chat message appearing (from side)
{ type: 'BounceIn', direction: 'left', power: 'soft', duration: 800 }
```
