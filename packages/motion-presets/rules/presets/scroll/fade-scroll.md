---
name: FadeScroll
category: scroll
---

# FadeScroll

## Visual Description

Element's opacity changes in response to scroll position, creating smooth fade-in or fade-out effects as the user scrolls. This is the scroll-driven equivalent of FadeIn—subtle, accessible, and universally applicable.

**`range: 'in'` mode**: Element starts invisible and gradually becomes visible as it enters the viewport. By the time it reaches the middle of the viewport, it's fully visible. Perfect for revealing content as users scroll to it.

**`range: 'out'` mode**: Element starts visible and gradually becomes invisible as it exits the viewport. Creates a graceful "dismissal" of content as users scroll past. Good for de-emphasizing passed content.

The transition is smooth and linear, tied directly to scroll position—not time-based. Scroll faster, and the fade happens faster; scroll slower, and it's more gradual.

## Parameters

```typescript
interface FadeScroll {
  range: 'in' | 'out'; // default: 'in'
  opacity?: number; // 0-1, min: 0, max: 1, step: 0.01, default: 0
  start?: number; // %, min: 0, max: 100, default: 0 (in) or 50 (out)
  end?: number; // %, min: 0, max: 100, default: 50 (in) or 100 (out)
}
```

**Parameter Impact:**

- `range`: Direction of the fade effect
  - `in`: Fades from invisible → visible as element enters viewport. Element reaches full opacity by the `end` scroll position
  - `out`: Fades from visible → invisible as element exits viewport. Element becomes fully transparent by the `end` scroll position
- `opacity`: The "other" opacity value (what it fades from/to)
  - `0` (default): Element fades from/to completely invisible
  - `0.3-0.5`: Element fades from/to semi-transparent (never fully disappears)
  - `1`: No fade effect (element stays visible)
- `start`/`end`: Scroll position range as percentage of element visibility
  - For `in`: Default 0-50 means fade completes when element reaches viewport center
  - For `out`: Default 50-100 means fade starts from viewport center until element leaves
  - Adjust for slower/faster fades: wider range = slower fade

## Best Practices

- **`range: 'in'` is most common**: Revealing content as users scroll to it is the primary use case
- **Don't fade critical content**: Important information should be visible without needing to scroll to it
- **Combine in + out**: Apply both modes for content that fades in and out as user scrolls past
- **Adjust start/end for timing**: Want fade to complete earlier? Use `end: 30`. Later? Use `end: 70`
- **Safe for reduced motion**: FadeScroll is subtle enough to keep even with `prefers-reduced-motion`, though disabling is also fine

## Examples

```typescript
// Basic - fades in as enters viewport
{ type: 'FadeScroll', range: 'in' }

// Fade out as exits viewport
{ type: 'FadeScroll', range: 'out' }

// Slower fade in (completes later)
{ type: 'FadeScroll', range: 'in', start: 0, end: 70 }

// Quick fade in (completes earlier)
{ type: 'FadeScroll', range: 'in', start: 0, end: 25 }

// Fade to semi-transparent (not fully invisible)
{ type: 'FadeScroll', range: 'out', opacity: 0.3 }

// Combined fade in and out (use two animations or trigger logic)
// As element enters:
{ type: 'FadeScroll', range: 'in' }
// As element exits:
{ type: 'FadeScroll', range: 'out' }
```
