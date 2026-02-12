---
name: Scroll Animations
category: scroll
---

# Scroll Animations

Animations whose progress is tied to a ViewTimeline - the element's position in the viewport.

## When to Use Scroll Animations

- Progressive content reveals on scroll
- Parallax depth effects
- Storytelling tied to scroll progress
- De-emphasizing passed content

## When NOT to Use Scroll Animations

- One-time entrance → see [Entrance](presets-reference.md#entrance-presets) (more performant)
- Continuous loops → see [Ongoing](presets-reference.md#ongoing-presets)

## Available Scroll Presets

See [Scroll Presets](presets-reference.md#scroll-presets) for full details:

ArcScroll, BlurScroll, FadeScroll, FlipScroll, GrowScroll, MoveScroll, PanScroll, ParallaxScroll, RevealScroll, ShapeScroll, ShrinkScroll, ShuttersScroll, SkewPanScroll, SlideScroll, Spin3dScroll, SpinScroll, StretchScroll, TiltScroll, TurnScroll

## Scroll Range Modes

- `in`: Animates as element enters viewport
- `out`: Animates as element exits viewport
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
