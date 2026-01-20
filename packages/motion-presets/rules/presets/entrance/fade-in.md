---
name: FadeIn
category: entrance
tags: [fade, opacity, subtle, simple, professional, minimal, entrance, appear]
---

# FadeIn

## Synonyms

fade in, appear, materialize, opacity transition, gentle reveal, soft entrance, dissolve in

## Visual Description

Element transitions from fully transparent (opacity 0) to fully visible (opacity 1). No movement, rotation, or scale changes occur - purely an opacity transition. Uses `sineInOut` easing for a smooth, natural feel. The simplest and most universally applicable entrance animation.

## When to Use

- Subtle content reveals in professional interfaces (high confidence)
- Modal and overlay appearances where movement would be distracting
- Loading state transitions - content appearing after load
- Progressive disclosure in forms and wizards
- Image galleries revealing loaded images
- Any element requiring gentle, non-distracting introduction
- Fallback for `prefers-reduced-motion` accessibility

## When NOT to Use

- When user needs attention drawn to specific element (use more dramatic preset)
- When spatial relationship matters (use SlideIn, GlideIn to show direction)
- Hero sections where impact is needed (use ArcIn, BounceIn)
- When element position context is important

## Parameters

```typescript
interface FadeIn {
  // No preset-specific parameters
  duration?: number;  // min: 0, max: 4000, step: 100, default: 1200
  delay?: number;     // min: 0, max: 8000, step: 100, default: 0
}
```

**Parameter Impact:**

- `duration`: Controls how quickly opacity transitions. Shorter (300-500ms) feels snappy, longer (800-1200ms) feels gentle
- `delay`: Useful for staggered reveals in sequences

## Minimal Examples

```typescript
// Basic - minimal config
{ type: 'FadeIn' }

// Quick snappy fade
{ type: 'FadeIn' }
// with: duration: 300

// Slow dramatic fade
{ type: 'FadeIn' }
// with: duration: 1500, delay: 200
```

## Related Presets

### Same Category (Entrance)

- **BlurIn** - Adds blur-to-focus effect alongside fade
- **DropIn** - Combines fade with subtle scale effect

### Parallel in Other Triggers

- **FadeScroll** (scroll) - Opacity transition driven by scroll position
- **BgFade** (background-scroll) - Background-specific fade on scroll

### Alternatives

- **BlurIn** - When you want more visual interest than pure fade
- **SlideIn** - When directional context matters
- **GrowIn** - When scale emphasis is needed

## Decision Hints

```yaml
choose_this_when:
  - "subtle entrance needed"
  - "professional/minimal UI"
  - "reduced motion fallback"
  - "multiple elements appearing"
  - "modal/overlay appearance"

choose_alternative_when:
  - attention_needed: BounceIn, PunchIn
  - direction_matters: SlideIn, GlideIn
  - more_visual_interest: BlurIn, DropIn
  - dramatic_hero: ArcIn, FlipIn
```
