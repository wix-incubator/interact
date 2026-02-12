---
name: Entrance Animations
category: entrance
---

# Entrance Animations

One-shot animations optimized for viewport entry, but can also be triggered by hover, click, animationEnd, and other triggers.

## When to Use Entrance Animations

- Element reveals on viewport entry
- First-time visibility animations
- Click/hover-triggered transitions
- Content appearing as user scrolls down

## When NOT to Use Entrance Animations

- Scroll-driven reveals → see [Scroll](presets-reference.md#scroll-presets)
- Continuous/looping → see [Ongoing](presets-reference.md#ongoing-presets)
- Mouse-reactive → see [Mouse](presets-reference.md#mouse-presets)

## Available Entrance Presets

See [Entrance Presets](presets-reference.md#entrance-presets) for full details:

FadeIn, ArcIn, BlurIn, BounceIn, CurveIn, DropIn, ExpandIn, FlipIn, FloatIn, FoldIn, GlideIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

## Entrance Quick Decision

| Tone                | Presets                                  |
| ------------------- | ---------------------------------------- |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn            |
| Playful/Energetic   | BounceIn, SpinIn                         |
| Geometric/Modern    | ShapeIn, RevealIn, ShuttersIn, WinkIn    |

## Entrance Common Use Cases

| Use Case               | Recommended                |
| ---------------------- | -------------------------- |
| Hero sections          | ArcIn, FloatIn, RevealIn   |
| Modals/Popups          | FadeIn, DropIn, ExpandIn   |
| List items (staggered) | FadeIn, SlideIn with delay |
| Notifications          | BounceIn, DropIn           |
| Cards                  | FlipIn, ArcIn, TiltIn      |
