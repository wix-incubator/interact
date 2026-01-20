---
name: BgFade
category: backgroundScroll
---

# BgFade

## Visual Description

Background opacity changes in response to scroll position, fading in as the section enters the viewport or fading out as it exits. This is the scroll-driven equivalent of FadeIn, applied specifically to background media.

**`range: 'in'`**: Background starts invisible (or semi-transparent) and gradually becomes fully visible as the user scrolls into the section. Creates a smooth reveal effect.

**`range: 'out'`**: Background starts visible and gradually becomes invisible as the user scrolls past the section. Creates a graceful dismissal effect.

**The visual effect**: Subtle and elegant. BgFade transitions backgrounds smoothly without the drama of zoom or parallax. It's perfect for section transitions, layered reveals, or guiding focus.

This is one of the safest background scroll effects—it's subtle, doesn't cause motion sickness, and degrades gracefully.

## Parameters

```typescript
interface BgFade {
  range: 'in' | 'out';      // required
  start?: number;           // %, min: 0, max: 100, default: 0 (in) or 50 (out)
  end?: number;             // %, min: 0, max: 100, default: 50 (in) or 100 (out)
}
```

**Parameter Impact:**

- `range`: Fade direction (required)
  - `in`: Background fades from transparent to visible as section enters
  - `out`: Background fades from visible to transparent as section exits
- `start`/`end`: Scroll position range for the fade (0-100)
  - Values represent percentage of element visibility in viewport
  - **For `in`**: Default 0-50 means fade completes by mid-viewport
  - **For `out`**: Default 50-100 means fade starts at mid-viewport
  - Wider range = slower fade; narrower range = faster fade

## Best Practices

- **Combine in + out for full lifecycle**: Apply both for backgrounds that fade in and out
- **Adjust timing with start/end**: Want fade to complete earlier? Lower the `end` value
- **Use for section transitions**: Fade backgrounds between sections for smooth visual flow
- **Safe for reduced motion**: BgFade is subtle enough to keep in most cases
- **Test overlap with content**: Ensure fading background doesn't make content unreadable at any point

## Examples

```typescript
// Basic - fade in as section enters
{ type: 'BgFade', range: 'in' }

// Fade out as section exits
{ type: 'BgFade', range: 'out' }

// Quick fade in (completes early)
{ type: 'BgFade', range: 'in', start: 0, end: 25 }

// Slow fade in (completes late)
{ type: 'BgFade', range: 'in', start: 0, end: 75 }

// Delayed fade out (starts later)
{ type: 'BgFade', range: 'out', start: 70, end: 100 }
```
