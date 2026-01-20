---
name: BgFade
category: backgroundScroll
tags: [fade, background, scroll, opacity, reveal, transition]
---

# BgFade

## Synonyms

background fade, bg fade, fade background, background opacity, background reveal

## Visual Description

Background gradually appears or disappears as you scroll through a section. In "in" mode, background fades from invisible to visible. In "out" mode, it fades away. Creates smooth transitions between sections.

## When to Use

- Section transitions with background change
- Progressive background reveals
- Creating focus on content areas

## When NOT to Use

- When background must always be visible
- Critical visual information in background

## Parameters

```typescript
interface BgFade {
  range: 'in' | 'out';      // EffectRangeInOut, required
  // Scroll range params
  start?: number;           // min: 0, max: 100, default: 0 (in) or 50 (out)
  end?: number;             // min: 0, max: 100, default: 50 (in) or 100 (out)
}
```

**Parameter Impact:**

- `range`: Fade direction
  - `in`: Fades from transparent to visible (0→1) on entry
  - `out`: Fades from visible to transparent (1→0) on exit
- `start`/`end`: Scroll position range for fade
  - For `in`: Default 0-50 (fade completes by viewport center)
  - For `out`: Default 50-100 (fade starts from viewport center)

## Minimal Examples

```typescript
// Fade in as section enters
{ type: 'BgFade', range: 'in' }

// Fade out as section exits
{ type: 'BgFade', range: 'out' }
```

## Related Presets

### Same Category (Background Scroll)

- **BgFadeBack** - Fade with different layer targeting
- **BgParallax** - Movement without fade
- **BgZoom** - Zoom effect on background

### Parallel in Other Triggers

- **FadeScroll** (scroll) - Fade for regular elements
- **FadeIn** (entrance) - Time-based fade entrance

### Alternatives

- **BgParallax** - When movement preferred over opacity
- **BgZoom** - When zoom effect preferred
- **FadeScroll** - For regular (non-background) elements

## Decision Hints

```yaml
choose_this_when:
  - "background reveal/hide"
  - "section transitions"
  - "layered background effects"
  - "focus control via background"
  - "progressive disclosure"

choose_alternative_when:
  - movement_based: BgParallax
  - zoom_effect: BgZoom
  - regular_elements: FadeScroll
  - time_based: FadeIn
```
