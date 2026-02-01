---
name: Entrance Animations
trigger: entrance
---

# Entrance Animations

One-shot animations that play once when an element first enters the viewport.

## Trigger Mechanism

Uses the `viewEnter` trigger (intersection observer). Plays automatically when element scrolls into view for the first time.

**Note:** For click, toggle, or other event-based triggers, implement the triggering logic separately and call the animation programmatically.

## When to Use Entrance Animations

- Element reveals on viewport entry
- First-time visibility animations
- Content appearing as user scrolls down

## When NOT to Use Entrance Animations

- Scroll-driven reveals → see [Scroll](presets-reference.md#scroll)
- Continuous/looping → see [Ongoing](presets-reference.md#ongoing)
- Mouse-reactive → see [Mouse](presets-reference.md#mouse)

## Available Entrance Presets

See [Entrance Presets](presets-reference.md#entrance-presets) for full details:

FadeIn, ArcIn, BlurIn, BounceIn, CurveIn, DropIn, FlipIn, FloatIn, FoldIn, GlideIn, GrowIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

## Entrance Common Parameters

All entrance presets share:

- `duration`: 0-4000 in ms (default: 1200)
- `delay`: 0-8000 in ms (default: 0)

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
| Modals/Popups          | FadeIn, DropIn, GrowIn     |
| List items (staggered) | FadeIn, SlideIn with delay |
| Notifications          | BounceIn, DropIn           |
| Cards                  | FlipIn, ArcIn, TiltIn      |

## Combining with Ongoing

Entrance + Ongoing is the only combination supported on a single element. Example:

- BounceIn plays on viewport entry
- Pulse continues indefinitely after
