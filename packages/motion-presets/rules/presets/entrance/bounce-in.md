---
name: BounceIn
category: entrance
tags: [bounce, playful, energetic, fun, elastic, entrance, attention, spring]
---

# BounceIn

## Synonyms

bounce entrance, bouncy reveal, spring in, elastic entrance, playful appear, jump in, hop in

## Visual Description

Element bounces into view from a specified direction with multiple decreasing bounces before settling. Starts with opacity 0 and full translation (distance based on power), then performs a series of bounces: first bounce reaches 100% distance, then progressively smaller bounces at ~35%, ~21%, ~9%, ~2% of original distance. Each bounce alternates between `sineIn` and `sineOut` easing for realistic physics. The opacity fades in during the first ~54% of the animation with `quadOut` easing. For `center` direction, uses `perspective(800px)` and bounces on Z-axis (towards/away from viewer). Creates a fun, energetic, attention-grabbing entrance.

## When to Use

- Playful, fun brand interfaces (high confidence)
- Gamification elements and rewards
- Notification badges or indicators
- Call-to-action buttons that need attention
- Success states and confirmations
- Child-friendly interfaces
- Marketing landing pages with energetic tone

## When NOT to Use

- Professional/corporate interfaces (too playful)
- Serious content like error messages or warnings
- Forms and data entry interfaces
- Multiple simultaneous elements (visual noise)
- Users with vestibular sensitivity (bouncing motion)
- When subtle entrance is appropriate

## Parameters

```typescript
interface BounceIn {
  direction: 'top' | 'right' | 'bottom' | 'left' | 'center';  // EffectFiveDirections, default: 'top'
  power?: 'soft' | 'medium' | 'hard';        // default: 'soft'
  distanceFactor?: number;                    // min: 1, max: 4, step: 0.1, default: 1 (responsive only)
  duration?: number;  // min: 0, max: 4000, step: 100, default: 1200
  delay?: number;     // min: 0, max: 8000, step: 100, default: 0
}
```

**Parameter Impact:**

- `direction`: Origin of the bounce movement
  - `top`: Bounces down from above
  - `bottom`: Bounces up from below
  - `left`/`right`: Bounces horizontally
  - `center`: Bounces on Z-axis with 3D perspective (towards viewer)
- `power`: Controls bounce amplitude
  - `soft`: Factor 1 - subtle bounces
  - `medium`: Factor 2 - noticeable bounces
  - `hard`: Factor 3 - dramatic, large bounces
- `distanceFactor`: Fine-grained control over bounce distance (1-4)

## Minimal Examples

```typescript
// Basic - bounces down from top
{ type: 'BounceIn', direction: 'top' }

// Energetic CTA button
{ type: 'BounceIn', direction: 'bottom', power: 'hard' }
// with: duration: 1000

// Subtle notification badge
{ type: 'BounceIn', direction: 'center', power: 'soft' }
// with: duration: 800

// Custom distance factor
{ type: 'BounceIn', direction: 'left', distanceFactor: 2.5 }
```

## Related Presets

### Same Category (Entrance)

- **PunchIn** - Similar energy but with scale, corner-based
- **DropIn** - Single drop with scale, no bounce
- **SpinIn** - Rotation-based energetic entrance

### Parallel in Other Triggers

- **Bounce** (ongoing) - Continuous bouncing animation
- **BounceMouse** (mouse) - Bouncy response to mouse movement

### Alternatives

- **FadeIn** - When subtle is needed, reduced motion fallback
- **SlideIn** - Same directional entrance without bounce
- **DropIn** - Single drop motion, more subtle than bounce

## Decision Hints

```yaml
choose_this_when:
  - "playful/fun interface"
  - "attention-grabbing element"
  - "gamification/rewards"
  - "energetic brand tone"
  - "notification/badge appearance"

choose_alternative_when:
  - professional_tone: FadeIn, SlideIn
  - subtle_needed: FadeIn, DropIn
  - rotation_based: SpinIn
  - scale_emphasis: PunchIn, GrowIn
  - continuous_bounce: Bounce (ongoing)
```
