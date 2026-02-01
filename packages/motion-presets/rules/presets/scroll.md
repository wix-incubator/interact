---
name: Scroll Animations
trigger: scroll
---

# Scroll Animations

Animations tied to scroll position. Can animate in, out, or continuously.

## When to Use Scroll Animations

- Progressive content reveals on scroll
- Parallax depth effects
- Storytelling tied to scroll progress
- De-emphasizing passed content

## When NOT to Use Scroll Animations

- One-time entrance → see [Entrance](presets-reference.md#entrance) (more performant)
- Continuous loops → see [Ongoing](presets-reference.md#ongoing)
- Background images → see [Background Scroll](presets-reference.md#background-scroll)

## Available Scroll Presets

See [Scroll Presets](presets-reference.md#scroll-presets) for full details:

ParallaxScroll, FadeScroll, ArcScroll, BlurScroll, FlipScroll, GrowScroll, ShrinkScroll, MoveScroll, PanScroll, RevealScroll, ShapeScroll, ShuttersScroll, SkewPanScroll, SlideScroll, Spin3dScroll, SpinScroll, StretchScroll, TiltScroll, TurnScroll

## Scroll Range Modes

- `in`: Animates as element enters viewport (0% → 50%)
- `out`: Animates as element exits viewport (50% → 100%)
- `continuous`: Animates throughout entire scroll range

## Scroll Quick Decision

| Effect Type | Presets                                            |
| ----------- | -------------------------------------------------- |
| Opacity     | FadeScroll, BlurScroll                             |
| Movement    | ParallaxScroll, MoveScroll, PanScroll, SlideScroll |
| Scale       | GrowScroll, ShrinkScroll                           |
| 3D Rotation | ArcScroll, FlipScroll, TiltScroll, TurnScroll      |
| Reveal/Mask | RevealScroll, ShapeScroll, ShuttersScroll          |

## Scroll Common Use Cases

| Use Case            | Recommended                          |
| ------------------- | ------------------------------------ |
| Depth/Layering      | ParallaxScroll with different speeds |
| Content reveal      | FadeScroll (in), RevealScroll        |
| Dramatic sections   | ArcScroll, FlipScroll, TiltScroll    |
| De-emphasize passed | FadeScroll (out), ShrinkScroll       |
