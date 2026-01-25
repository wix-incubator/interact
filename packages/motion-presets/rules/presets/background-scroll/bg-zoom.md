---
name: BgZoom
category: backgroundScroll
---

# BgZoom

## Visual Description

Background image scales up or down as the user scrolls, creating a cinematic dolly-like effect. The background appears to move toward you (zooming in) or away from you (zooming out) as you scroll through the section.

**`direction: 'in'`**: Background starts at normal scale and gradually zooms in as scroll progresses. Creates a "moving closer" sensation, like approaching something.

**`direction: 'out'`**: Background starts zoomed in and gradually zooms out. Creates an "expanding view" sensation, like pulling back to reveal more.

**The visual effect**: Dramatic, cinematic, and immersive. BgZoom transforms a static background into an active part of the scroll experience. It's attention-grabbing and best used for hero sections or focal points.

## Parameters

```typescript
interface BgZoom {
  direction: 'in' | 'out'; // default: 'in'
  zoom?: number; // multiplier, min: 0.1, max: 10, step: 0.1, default: 10
  range?: 'continuous'; // only continuous supported
}
```

**Parameter Impact:**

- `direction`: Zoom behavior
  - `in` (default): Background zooms in as scroll progresses—feels like approaching
  - `out`: Background zooms out—feels like pulling back/revealing
- `zoom`: Maximum zoom magnitude (0.1-10)
  - **1-3**: Subtle zoom, barely noticeable—safe for most uses
  - **4-6**: Medium zoom, clearly cinematic—good for hero sections
  - **7-10**: Dramatic zoom—very attention-grabbing, use sparingly
  - **10 (default)**: Maximum drama—ensure this fits your design
- `range`: Only `continuous` is supported

## Best Practices

- **Default zoom (10) is dramatic**: Consider starting with 3-5 for more subtle effect
- **One zooming background per page**: Multiple competing zooms are overwhelming
- **Ensure image resolution**: Zooming in reveals imperfections—use high-res images
- **Consider content overlap**: Ensure zooming doesn't make text over background harder to read
- **Test on mobile**: Zoom effects can be performance-heavy

## Examples

```typescript
// Basic - zooms in as you scroll
{ type: 'BgZoom', direction: 'in' }

// Zoom out (revealing, expanding view)
{ type: 'BgZoom', direction: 'out' }

// Subtle zoom in
{ type: 'BgZoom', direction: 'in', zoom: 3 }

// Medium dramatic zoom
{ type: 'BgZoom', direction: 'in', zoom: 6 }

// Dramatic full zoom
{ type: 'BgZoom', direction: 'in', zoom: 10 }
```
