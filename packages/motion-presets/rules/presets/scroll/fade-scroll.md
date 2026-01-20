---
name: FadeScroll
category: scroll
tags: [fade, opacity, scroll, reveal, in, out, transition]
---

# FadeScroll

## Synonyms

scroll fade, fade on scroll, opacity scroll, scroll reveal, scroll disappear, fade in scroll, fade out scroll

## Visual Description

Element gradually appears or disappears as you scroll. In "in" mode, content fades from invisible to visible as it enters the viewport. In "out" mode, it fades away as you scroll past. Creates smooth, cinematic content reveals.

## When to Use

- Content reveal as user scrolls
- Section transitions
- De-emphasizing passed content

## When NOT to Use

- Critical content that must always be visible
- Navigation or persistent UI elements

## Parameters

```typescript
interface FadeScroll {
  range: 'in' | 'out';        // EffectRangeInOut, default: 'in'
  opacity?: number;           // min: 0, max: 1, step: 0.01, default: 0
  // Scroll range params
  start?: number;             // min: 0, max: 100, default: 0 (in) or 50 (out)
  end?: number;               // min: 0, max: 100, default: 50 (in) or 100 (out)
}
```

**Parameter Impact:**

- `range`: Direction of the fade
  - `in`: Fades from `opacity` to 1 as element enters viewport
  - `out`: Fades from 1 to `opacity` as element leaves viewport
- `opacity`: Target opacity value (what it fades from/to)
  - 0 (default): Fully transparent
  - 0.5: Semi-transparent
- `start`/`end`: Scroll position range (0-100% of element visibility)

## Minimal Examples

```typescript
// Fade in as enters viewport
{ type: 'FadeScroll', range: 'in' }

// Fade out as leaves viewport
{ type: 'FadeScroll', range: 'out' }
```

## Related Presets

### Same Category (Scroll)

- **BlurScroll** - Blur effect on scroll, can combine with fade
- **RevealScroll** - Clip-based reveal on scroll

### Parallel in Other Triggers

- **FadeIn** (entrance) - Time-based fade, not scroll-driven
- **BgFade** (background-scroll) - Fade specifically for backgrounds

### Alternatives

- **BlurScroll** - When blur effect is preferred over pure opacity
- **RevealScroll** - When directional reveal is needed
- **GrowScroll** - When scale change is preferred

## Decision Hints

```yaml
choose_this_when:
  - "content reveal on scroll"
  - "section transitions"
  - "progressive disclosure"
  - "de-emphasize passed content"
  - "simple opacity transition"

choose_alternative_when:
  - blur_effect: BlurScroll
  - directional_reveal: RevealScroll, SlideScroll
  - scale_change: GrowScroll, ShrinkScroll
  - background_specific: BgFade
  - time_based: FadeIn
```
