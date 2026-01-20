---
name: BgFade
category: backgroundScroll
tags: [fade, background, scroll, opacity, reveal, transition]
---

# BgFade

## Synonyms

background fade, bg fade, fade background, background opacity, background reveal

## Visual Description

Background layer opacity transitions as user scrolls through the section. In `in` range, background fades from transparent (0) to fully visible (1) as element enters viewport and reaches center. In `out` range, background fades from visible to transparent as element exits. Targets the `BG_LAYER` element specifically. Uses `sineIn` easing for fade in, `sineOut` for fade out. Covers the scroll range from element entering viewport to center (in) or center to leaving (out).

## When to Use

- Section transitions with background change (high confidence)
- Progressive background reveals
- Layered backgrounds that appear/disappear
- Storytelling with background reveals
- Section dividers with visual transitions
- Creating focus on/off content areas

## When NOT to Use

- When background must always be visible
- Critical visual information in background
- Fast-scrolling interfaces
- When abrupt transitions are acceptable
- Mobile with color-only backgrounds (no benefit)

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
// Basic - fade in on entry
{ type: 'BgFade', range: 'in' }

// Fade out on exit
{ type: 'BgFade', range: 'out' }

// Custom scroll range for earlier fade
{ type: 'BgFade', range: 'in', start: 0, end: 30 }
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
