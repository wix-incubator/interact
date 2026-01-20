---
name: BgZoom
category: backgroundScroll
tags: [zoom, background, scroll, scale, depth, 3d, perspective]
---

# BgZoom

## Synonyms

background zoom, bg zoom, zoom scroll, dolly zoom, zoom effect background, ken burns scroll

## Visual Description

Background image zooms in or out as user scrolls, creating dramatic depth effect. Uses `perspective` and `translateZ` transforms for true 3D zoom rather than scale. In `in` direction, background starts normal and zooms in (moves towards viewer) as scroll progresses. In `out` direction, background zooms out (moves away). Uses different starting Y positions and easing per direction: `in` starts at 20svh with `sineIn`, `out` starts at 0 with `sineInOut`. Creates cinematic dolly/zoom effect.

## When to Use

- Cinematic hero sections (high confidence)
- Dramatic section reveals
- Photography/portfolio showcases
- Landing pages with high visual impact
- Storytelling with depth emphasis
- Single featured image sections

## When NOT to Use

- Text-heavy backgrounds (hard to read during zoom)
- Multiple sections with zoom (overwhelming)
- Mobile with performance concerns
- When background details must stay sharp
- Vestibular sensitivity concerns
- Precise background positioning needed

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
// Basic - zoom in effect
{ type: 'BgZoom', direction: 'in' }

// Zoom out as scroll
{ type: 'BgZoom', direction: 'out' }

// Subtle zoom
{ type: 'BgZoom', direction: 'in', zoom: 3 }

// Dramatic zoom
{ type: 'BgZoom', direction: 'in', zoom: 10 }
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
