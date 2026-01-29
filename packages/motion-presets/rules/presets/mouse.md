---
name: Mouse Animations
trigger: mouse
---

# Mouse Animations

Animations that respond to cursor position. Desktop-only.

## When to Use

- Interactive cards/products (tilt effect)
- Parallax depth with cursor
- Hero section interactivity
- Playful/game-like interfaces

## When NOT to Use

- Mobile-first designs (won't work on touch)
- Accessibility-critical interfaces
- Essential functionality
- Multiple simultaneous effects

## Available Presets

See [Mouse Presets](presets-reference.md#mouse-presets) for full details:

Tilt3DMouse, TrackMouse, BounceMouse, Track3DMouse, SpinMouse, ScaleMouse, SwivelMouse, SkewMouse, BlurMouse, AiryMouse, BlobMouse, CustomMouse

## Quick Decision

| Tone                 | Presets                                    |
| -------------------- | ------------------------------------------ |
| Professional/Premium | Tilt3DMouse (soft), TrackMouse, ScaleMouse |
| Playful/Fun          | BounceMouse, BlobMouse, AiryMouse          |
| Game-like/Dynamic    | SpinMouse, Track3DMouse, SkewMouse         |

## Common Use Cases

| Use Case               | Recommended                         |
| ---------------------- | ----------------------------------- |
| Product cards          | Tilt3DMouse, ScaleMouse             |
| Hero depth layers      | TrackMouse with different distances |
| Interactive portfolios | Tilt3DMouse, Track3DMouse           |
| Playful interfaces     | BounceMouse, BlobMouse              |

## Mobile Fallback

Mouse animations don't work on touch devices. Options:

1. Do nothing (static on mobile)
2. Use entrance animation instead
3. Use device orientation (advanced)
