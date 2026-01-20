---
name: ParallaxScroll
category: scroll
tags: [parallax, scroll, depth, layered, continuous, vertical, movement]
---

# ParallaxScroll

## Synonyms

parallax effect, scroll parallax, depth scroll, layered scroll, differential scroll, scroll movement

## Visual Description

Element moves vertically at a different rate than the scroll, creating depth illusion. Uses `translateY` to shift element position relative to scroll progress. With default speed (0.5), element moves half the distance of scroll - negative speed moves opposite direction. Animation runs continuously through the entire scroll range (`cover` timeline). Movement is linear without easing for smooth, constant-rate parallax. Creates layered depth effect when multiple elements have different speeds.

## When to Use

- Landing pages with layered depth effect (high confidence)
- Hero sections with background/foreground separation
- Storytelling pages with cinematic scroll
- Creating depth hierarchy between page sections
- Decorative elements that should feel "behind" or "in front"
- Modern, visually rich marketing pages

## When NOT to Use

- Text-heavy content (readability issues)
- Data-dense interfaces (distracting)
- Accessibility-focused interfaces (motion sensitivity)
- Mobile with performance concerns
- When precise element positioning matters
- Forms or interactive elements

## Parameters

```typescript
interface ParallaxScroll {
  speed?: number;     // min: -1, max: 1, step: 0.05, default: 0.5
  range?: 'continuous';  // only continuous supported
  // Scroll range params (from base)
  start?: number;     // min: 0, max: 0, default: 0 (screen enter)
  end?: number;       // min: 100, max: 100, default: 100 (screen leave)
}
```

**Parameter Impact:**

- `speed`: Rate of movement relative to scroll
  - Positive (0.1-1): Element moves same direction as scroll, but slower
  - Negative (-1 to -0.1): Element moves opposite to scroll direction
  - Higher absolute value = more pronounced effect
  - 0.5 (default): Element moves at half scroll speed
- `range`: Only `continuous` - runs throughout entire scroll range

## Minimal Examples

```typescript
// Basic - gentle parallax
{ type: 'ParallaxScroll' }

// Strong parallax effect
{ type: 'ParallaxScroll', speed: 0.8 }

// Reverse parallax (moves opposite)
{ type: 'ParallaxScroll', speed: -0.3 }

// Subtle depth layer
{ type: 'ParallaxScroll', speed: 0.2 }
```

## Related Presets

### Same Category (Scroll)

- **MoveScroll** - General movement on scroll, more control
- **PanScroll** - Horizontal/vertical panning on scroll

### Parallel in Other Triggers

- **BgParallax** (background-scroll) - Parallax specifically for backgrounds

### Alternatives

- **FadeScroll** - When opacity change is preferred over movement
- **MoveScroll** - When more movement control needed
- **BgParallax** - When animating background media specifically

## Decision Hints

```yaml
choose_this_when:
  - "depth/layered effect needed"
  - "elements at different scroll rates"
  - "cinematic scroll experience"
  - "decorative elements"
  - "hero section depth"

choose_alternative_when:
  - background_specific: BgParallax
  - horizontal_movement: PanScroll
  - opacity_based: FadeScroll
  - more_control: MoveScroll
  - 3d_rotation: ArcScroll, TiltScroll
```
