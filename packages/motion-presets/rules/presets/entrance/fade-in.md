---
name: FadeIn
category: entrance
tags: [fade, opacity, subtle, simple, professional, minimal, entrance, appear]
---

# FadeIn

## Synonyms

fade in, appear, materialize, opacity transition, gentle reveal, soft entrance, dissolve in

## Visual Description

Element gradually appears from invisible to fully visible. No movement or shape changes - just a smooth, gentle materialization. The simplest and most universally applicable entrance animation.

## When to Use

- Subtle content reveals in professional interfaces
- Modal and overlay appearances
- Loading state transitions
- Reduced motion fallback

## When NOT to Use

- When attention needs to be drawn to element
- Hero sections where impact is needed

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
// Basic
{ type: 'FadeIn' }
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
