---
name: BgZoom
category: backgroundScroll
tags: [zoom, background, scroll, scale, depth, 3d, perspective]
---

# BgZoom

## Synonyms

background zoom, bg zoom, zoom scroll, dolly zoom, zoom effect background, ken burns scroll

## Visual Description

Background image zooms in or out as you scroll, like a camera dolly move. Creates a cinematic, dramatic effect where the background appears to move towards or away from you.

## When to Use

- Cinematic hero sections
- Dramatic section reveals
- Photography/portfolio showcases

## When NOT to Use

- Multiple sections with zoom
- Mobile with performance concerns

## Parameters

```typescript
interface BgZoom {
  direction: 'in' | 'out';    // EffectRangeInOut, default: 'in'
  zoom?: number;              // min: 0.1, max: 10, step: 0.1, default: 10
  range?: 'continuous';       // only continuous supported
}
```

**Parameter Impact:**

- `direction`: Zoom behavior
  - `in`: Background zooms in (towards viewer) as scroll progresses
  - `out`: Background zooms out (away from viewer), uses 0.375x factor
- `zoom`: Maximum zoom amount (0.1-10)
  - Lower values (1-3): Subtle zoom
  - Medium values (5-7): Noticeable cinematic zoom
  - Higher values (8-10): Dramatic, pronounced zoom

## Minimal Examples

```typescript
// Zoom in as you scroll
{ type: 'BgZoom', direction: 'in' }

// Zoom out as you scroll
{ type: 'BgZoom', direction: 'out' }
```

## Related Presets

### Same Category (Background Scroll)

- **BgParallax** - Movement without zoom
- **BgFade** - Opacity-based transition
- **BgCloseUp** - Similar zoom with different implementation
- **BgPullBack** - Reverse zoom effect

### Parallel in Other Triggers

- **GrowScroll** (scroll) - Scale effect for regular elements
- **ShrinkScroll** (scroll) - Shrink effect for regular elements

### Alternatives

- **BgParallax** - When subtle movement preferred
- **BgCloseUp** - Alternative zoom implementation
- **BgFade** - When opacity transition preferred

## Decision Hints

```yaml
choose_this_when:
  - "cinematic background effect"
  - "dramatic section reveal"
  - "hero with depth"
  - "photography showcase"
  - "dolly zoom feel"

choose_alternative_when:
  - subtle_movement: BgParallax
  - opacity_transition: BgFade
  - alternative_zoom: BgCloseUp
  - regular_elements: GrowScroll
```
