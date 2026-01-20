---
name: BgParallax
category: backgroundScroll
tags: [parallax, background, scroll, depth, continuous, vertical]
---

# BgParallax

## Synonyms

background parallax, bg parallax, background scroll, parallax background, depth background

## Visual Description

Background image or video moves slower than page scroll, creating an illusion of depth. Like the background is further away than the content in front of it. Subtle effect that adds visual richness without being distracting.

## When to Use

- Hero sections with depth
- Full-width section backgrounds
- Landing pages with visual richness

## When NOT to Use

- Mobile with performance concerns
- Color-only backgrounds (no benefit)

## Parameters

```typescript
interface BgParallax {
  speed?: number;         // min: 0.05, max: 0.95, step: 0.01, default: 0.2
  range?: 'continuous';   // only continuous supported
}
```

**Parameter Impact:**

- `speed`: Rate of background movement (0.05-0.95)
  - Lower values (0.1-0.2): Subtle, barely noticeable parallax
  - Medium values (0.3-0.5): Noticeable depth effect
  - Higher values (0.6-0.95): Dramatic, pronounced parallax
  - Default 0.2 is subtle and safe for most uses

## Minimal Examples

```typescript
// Basic
{ type: 'BgParallax' }
```

## Related Presets

### Same Category (Background Scroll)

- **BgZoom** - Zoom effect on background
- **BgFade** - Fade effect on background
- **BgPan** - Horizontal/vertical pan on background
- **ImageParallax** - For regular images (non-background)

### Parallel in Other Triggers

- **ParallaxScroll** (scroll) - Parallax for regular elements

### Alternatives

- **ParallaxScroll** - When animating regular elements
- **BgZoom** - When zoom effect preferred
- **BgFade** - When opacity transition preferred

## Decision Hints

```yaml
choose_this_when:
  - "background depth effect"
  - "hero section immersion"
  - "section visual interest"
  - "landing page polish"
  - "image/video backgrounds"

choose_alternative_when:
  - regular_elements: ParallaxScroll
  - zoom_effect: BgZoom
  - fade_effect: BgFade
  - horizontal_pan: BgPan
```
