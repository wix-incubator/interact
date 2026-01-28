---
name: Background Scroll Animations
trigger: backgroundScroll
---

# Background Scroll Animations

Scroll animations specifically for CSS background images/videos.

## When to Use

- Hero sections with background depth
- Full-width section backgrounds
- Cinematic storytelling
- Section transitions

## When NOT to Use

- Regular content elements → see [Scroll](presets-reference.md#scroll)
- Non-media backgrounds (solid colors)
- Multiple animated backgrounds
- Mobile with performance concerns

## Available Presets

See [Background Scroll Presets](presets-reference.md#background-scroll-presets) for full details:

BgParallax, BgZoom, BgFade, BgFadeBack, BgPan, BgRotate, BgSkew, BgReveal, BgCloseUp, BgPullBack, BgFake3D, ImageParallax

## Quick Decision

| Effect Type | Presets |
| ------------- | --------- |
| Depth/Movement | BgParallax, BgPan, BgFake3D |
| Scale/Zoom | BgZoom, BgCloseUp, BgPullBack |
| Opacity | BgFade, BgFadeBack |
| Rotation | BgRotate |
| Reveal | BgReveal |

## Common Use Cases

| Use Case | Recommended |
| ---------- | ------------- |
| Depth/Immersion | BgParallax (speed: 0.2-0.4) |
| Cinematic reveals | BgZoom, BgCloseUp, BgReveal |
| Section transitions | BgFade |
| Creative/Experimental | BgSkew, BgRotate |

## Note

`ImageParallax` is for regular `<img>` elements, not CSS backgrounds.
