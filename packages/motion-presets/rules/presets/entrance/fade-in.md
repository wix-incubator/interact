---
name: FadeIn
category: entrance
---

# FadeIn

## Visual Description

Element transitions smoothly from completely invisible (opacity 0) to fully visible (opacity 1). This is the simplest and most universal animation—there's no movement, rotation, scale change, or any other transformation. The element simply materializes in place, like a gentle reveal or a light gradually turning on.

At the start, the element is entirely transparent. During the animation, opacity increases linearly until the element reaches full visibility. The effect is subtle, clean, and professional. It draws minimal attention to the animation itself, instead letting the content take focus.

FadeIn is the safest animation choice—it works everywhere, doesn't trigger motion sensitivity issues, and serves as the ideal fallback for more complex animations when reduced motion is preferred.

## Parameters

```typescript
interface FadeIn {
  duration?: number;  // ms, min: 0, max: 4000, step: 100, default: 1200
  delay?: number;     // ms, min: 0, max: 8000, step: 100, default: 0
}
```

**Parameter Impact:**

- `duration`: Controls how quickly the opacity transition completes
  - **200-400ms**: Snappy, barely noticeable—good for functional UI elements like tooltips, dropdowns
  - **500-800ms**: Balanced, noticeable but not slow—good for modals, cards
  - **1000-1500ms**: Slow, deliberate—good for hero content, dramatic reveals
  - **1200ms (default)**: The sweet spot for most decorative uses
- `delay`: Time before animation starts
  - **0ms**: Immediate start
  - **100-300ms**: Slight pause, useful for staggered sequences
  - **500ms+**: Noticeable wait, use intentionally for dramatic effect

## Best Practices

- Use as the **default reduced-motion fallback** for all other entrance animations
- Keep duration under 500ms for functional UI (modals, dropdowns, tooltips)
- Combine with `delay` for elegant staggered list reveals
- Consider even shorter durations (200-300ms) for frequently shown/hidden elements
- Don't overthink it—FadeIn is often the right choice when you're unsure

## Examples

```typescript
// Basic - default settings work for most cases
{ type: 'FadeIn' }

// Quick functional fade (modal, dropdown)
{ type: 'FadeIn', duration: 300 }

// Slow dramatic reveal (hero content)
{ type: 'FadeIn', duration: 1500 }

// Staggered list items
{ type: 'FadeIn', delay: 0 }      // Item 1
{ type: 'FadeIn', delay: 100 }    // Item 2
{ type: 'FadeIn', delay: 200 }    // Item 3
{ type: 'FadeIn', delay: 300 }    // Item 4
```
