---
name: Background Scroll Animations
trigger: backgroundScroll
---

# Background Scroll Animations

Scroll animations for structured background media components. Animates DOM elements via CSS transforms (not `background-position`).

## DOM Structure Required

Requires `data-motion-part` attributes: `BG_LAYER`, `BG_MEDIA`, `BG_IMG`

## When to Use Background Scroll Animations

- Hero sections with background depth
- Full-width section backgrounds with `data-motion-part` structure
- Cinematic storytelling
- Section transitions

## When NOT to Use Background Scroll Animations

- Regular content elements → use [Scroll](presets-reference.md#scroll-presets)
- Elements without `data-motion-part` structure
- Simple CSS `background-image` (no DOM structure to animate)
- Mobile with performance concerns

## Available Background Scroll Presets

See [Background Scroll Presets](presets-reference.md#background-scroll-presets) for details.

| Effect Type    | Presets                       |
| -------------- | ----------------------------- |
| Depth/Movement | BgParallax, BgPan, BgFake3D   |
| Scale/Zoom     | BgZoom, BgCloseUp, BgPullBack |
| Opacity        | BgFade, BgFadeBack            |
| Rotation       | BgRotate                      |
| Reveal         | BgReveal                      |

## Note

`ImageParallax` works on regular `<img>` elements without `data-motion-part` structure.
