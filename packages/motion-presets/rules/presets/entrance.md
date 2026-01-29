---
name: Entrance Animations
trigger: entrance
---

# Entrance Animations

One-shot animations that play once when an element first enters the viewport.

## Trigger Mechanism

Uses the `viewEnter` trigger (intersection observer). Plays automatically when element scrolls into view for the first time.

**Note:** For click, toggle, or other event-based triggers, implement the triggering logic separately and call the animation programmatically.

## When to Use

- Element reveals on viewport entry
- First-time visibility animations
- Content appearing as user scrolls down

## When NOT to Use

- Scroll-driven reveals → see [Scroll](presets-reference.md#scroll)
- Continuous/looping → see [Ongoing](presets-reference.md#ongoing)
- Mouse-reactive → see [Mouse](presets-reference.md#mouse)

## Available Presets

See [Entrance Presets](presets-reference.md#entrance-presets) for full details:

FadeIn, ArcIn, BlurIn, BounceIn, CircleIn, CurveIn, DropIn, ExpandIn, FlipIn, FloatIn, FoldIn, GlideIn, GlitchIn, GrowIn, PunchIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

## Common Parameters

All entrance presets share:

- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

See [Common Parameters](presets-reference.md#common-parameters) for details on `power` behavior.

## Quick Decision

| Tone                | Presets                                         |
| ------------------- | ----------------------------------------------- |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn        |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn, ExpandIn         |
| Playful/Energetic   | BounceIn, SpinIn, PunchIn, GlitchIn             |
| Geometric/Modern    | CircleIn, ShapeIn, RevealIn, ShuttersIn, WinkIn |

## Common Use Cases

| Use Case               | Recommended                |
| ---------------------- | -------------------------- |
| Hero sections          | ArcIn, ExpandIn, FloatIn   |
| Modals/Popups          | FadeIn, DropIn, GrowIn     |
| List items (staggered) | FadeIn, SlideIn with delay |
| Notifications          | BounceIn, PunchIn          |
| Cards                  | FlipIn, ArcIn, TiltIn      |

## Combining with Ongoing

Entrance + Ongoing is the only combination supported on a single element. Example:

- BounceIn plays on viewport entry
- Pulse continues indefinitely after
