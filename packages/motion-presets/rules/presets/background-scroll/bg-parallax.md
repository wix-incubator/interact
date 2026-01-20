---
name: BgParallax
category: backgroundScroll
tags: [parallax, background, scroll, depth, continuous, vertical]
---

# BgParallax

## Synonyms

background parallax, bg parallax, background scroll, parallax background, depth background

## Visual Description

Background media (image or video) moves vertically at a different rate than content scroll, creating depth illusion. Uses `translateY` on the `BG_MEDIA` element. With default speed (0.2), background moves slowly relative to scroll - positive values move background in scroll direction, creating effect of background being "further away". Runs continuously through entire element visibility (`cover` timeline). More subtle than element parallax due to lower default speed.

## When to Use

- Hero sections with depth (high confidence)
- Full-width section backgrounds
- Landing pages with visual richness
- Storytelling pages with immersive feel
- Section separators with visual interest
- Photography portfolio backgrounds

## When NOT to Use

- Content-heavy sections (distracting)
- Mobile with performance concerns
- Backgrounds with important visual details (may be cropped)
- When background position precision matters
- Accessibility-focused sites (motion concerns)
- Color-only backgrounds (no visual benefit)

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
// Basic - subtle parallax
{ type: 'BgParallax' }

// Noticeable depth effect
{ type: 'BgParallax', speed: 0.4 }

// Very subtle (barely moves)
{ type: 'BgParallax', speed: 0.1 }

// Dramatic parallax
{ type: 'BgParallax', speed: 0.7 }
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
