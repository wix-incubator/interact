---
name: BgParallax
category: backgroundScroll
---

# BgParallax

## Visual Description

Background image or video moves at a different rate than the page scroll, creating an illusion of depth. As users scroll, the background shifts slower than the content in front of it, making it feel like it's further away—like distant scenery through a window.

**How it works**: The background's vertical position is adjusted based on scroll position, but at a slower rate than the scroll itself. When you scroll 100 pixels down, the background might only move 20-50 pixels.

**The visual effect**: Subtle depth and dimension without being distracting. The background feels "behind" the content, creating layers of depth. It's one of the most widely used scroll effects because it adds polish without overwhelming.

This is specifically for CSS background images/videos on containers, not for regular `<img>` elements in the content flow.

## Parameters

```typescript
interface BgParallax {
  speed?: number;         // ratio, min: 0.05, max: 0.95, step: 0.01, default: 0.2
  range?: 'continuous';   // only continuous supported
}
```

**Parameter Impact:**

- `speed`: Rate of background movement relative to scroll (0.05-0.95)
  - **0.05-0.2**: Very subtle, barely noticeable—safe, professional
  - **0.2 (default)**: Subtle but perceptible—ideal starting point
  - **0.3-0.5**: Noticeable depth effect—clearly parallax
  - **0.6-0.95**: Strong parallax, dramatic movement—use carefully
  - **Visual rule**: Lower speed = background feels further away
- `range`: Only `continuous` is supported
  - Effect runs throughout entire time section is in viewport

## Best Practices

- **Start subtle (0.2)**: Increase only if depth effect isn't noticeable enough
- **Test on real content**: Parallax can make text over backgrounds harder to read
- **Consider mobile**: Background parallax can be janky on mobile—test or disable
- **One section at a time**: Multiple parallax backgrounds competing can feel chaotic
- **Use high-quality images**: Parallax reveals more of the background—ensure images are large enough and high-res

## Examples

```typescript
// Basic - subtle parallax (default)
{ type: 'BgParallax' }

// Very subtle (barely noticeable)
{ type: 'BgParallax', speed: 0.1 }

// Noticeable depth effect
{ type: 'BgParallax', speed: 0.4 }

// Strong parallax (use sparingly)
{ type: 'BgParallax', speed: 0.6 }
```
