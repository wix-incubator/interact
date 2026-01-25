---
name: ParallaxScroll
category: scroll
---

# ParallaxScroll

## Visual Description

Element moves at a different rate than the page scroll, creating an illusion of depth and dimension. When you scroll the page, this element moves slower (or faster, or even opposite) compared to the rest of the content, making it feel like it exists on a different layer—closer or further away.

**How it works**: As the user scrolls, the element's vertical position is modified based on the `speed` parameter. A speed of 0.5 means the element moves at half the scroll rate (appears further away). A negative speed means the element moves opposite to scroll direction.

**The visual effect**: Imagine looking through a car window—distant mountains move slowly while nearby trees zip past. ParallaxScroll recreates this depth perception. Faster-moving elements feel closer; slower elements feel further away.

This is a continuous effect that runs throughout the entire time the element is in the viewport, creating an immersive, layered experience.

## Parameters

```typescript
interface ParallaxScroll {
  speed?: number; // ratio, min: -1, max: 1, step: 0.05, default: 0.5
  range?: 'continuous'; // only continuous supported
  start?: number; // %, min: 0, max: 0, default: 0
  end?: number; // %, min: 100, max: 100, default: 100
}
```

**Parameter Impact:**

- `speed`: The core parameter—determines movement rate relative to scroll
  - **Positive values (0.1 to 1)**: Element moves in same direction as scroll, but slower
    - `0.1-0.3`: Subtle parallax, element feels slightly "behind"
    - `0.4-0.6`: Noticeable depth effect (0.5 default is ideal)
    - `0.7-0.9`: Strong parallax, element moves almost with scroll
  - **Negative values (-1 to -0.1)**: Element moves opposite to scroll direction
    - Creates unusual "floating against current" effect
    - Use sparingly—can be disorienting
  - **0**: No movement (element scrolls normally with page)
- `range`: Only `continuous` is supported—effect runs throughout viewport visibility
- `start`/`end`: Fixed at 0-100, covering full scroll range

## Best Practices

- **Layer multiple elements**: Create depth by applying different speeds to different elements (e.g., background: 0.2, midground: 0.5, foreground: 0.8)
- **Subtle is usually better**: Start with `speed: 0.3` and adjust—strong parallax can cause motion sickness
- **Test on mobile**: Parallax can be janky on mobile devices; consider disabling or reducing
- **Don't use on text**: Moving text while scrolling is hard to read
- **Combine with position**: Elements should be positioned appropriately to have room to move
- **Reduced motion**: Disable entirely for `prefers-reduced-motion`

## Examples

```typescript
// Basic - element moves at half scroll speed
{ type: 'ParallaxScroll' }

// Subtle background element (feels very far away)
{ type: 'ParallaxScroll', speed: 0.2 }

// Strong parallax (noticeable depth)
{ type: 'ParallaxScroll', speed: 0.7 }

// Reverse parallax (floats against scroll direction)
{ type: 'ParallaxScroll', speed: -0.3 }

// Layered depth effect (apply to different elements)
// Background layer
{ type: 'ParallaxScroll', speed: 0.2 }
// Midground layer
{ type: 'ParallaxScroll', speed: 0.5 }
// Foreground decorative elements
{ type: 'ParallaxScroll', speed: 0.8 }
```
