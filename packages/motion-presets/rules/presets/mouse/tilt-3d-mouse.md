---
name: Tilt3DMouse
category: mouse
tags: [3d, tilt, mouse, perspective, interactive, hover, rotation]
---

# Tilt3DMouse

## Synonyms

3d tilt, mouse tilt, perspective tilt, interactive tilt, hover tilt, card tilt, gyroscope effect

## Visual Description

Element tilts towards the mouse cursor, like holding a card and angling it. Moving mouse left tilts element left, moving up tilts it back. Creates an interactive 3D feel where elements respond to cursor position.

## When to Use

- Interactive cards and product displays
- Hero sections with depth effect
- Portfolio thumbnails
- Game-like interfaces

## When NOT to Use

- Mobile devices (no mouse)
- Text-heavy content

## Parameters

```typescript
interface Tilt3DMouse {
  power?: 'soft' | 'medium' | 'hard';      // default: 'medium'
  angle?: number;                           // min: 5, max: 85, step: 1, default: 50 (responsive)
  perspective?: number;                     // min: 200, max: 1000, step: 50, default: 1000 (base) / 800 (impl)
  inverted?: boolean;                       // default: false
  transitionDuration?: number;              // min: 0, max: 5000, step: 20, default: 500
  transitionEasing?: 'linear' | 'easeOut' | 'hardBackOut';  // default: 'easeOut'
}
```

**Parameter Impact:**

- `power`: Preset combinations of angle + perspective + easing
  - `soft`: 25° angle, 1000px perspective - subtle tilt
  - `medium`: 50° angle, 500px perspective - noticeable tilt
  - `hard`: 85° angle, 200px perspective - dramatic tilt
- `angle`: Maximum rotation degrees (5-85)
- `perspective`: 3D depth perception (lower = more dramatic)
- `inverted`: Reverses tilt direction (element tilts away from mouse)
- `transitionDuration`: Smoothing delay for tilt changes
- `transitionEasing`: Easing curve for transitions

## Minimal Examples

```typescript
// Basic
{ type: 'Tilt3DMouse' }

// Inverted (tilts away from mouse)
{ type: 'Tilt3DMouse', inverted: true }
```

## Related Presets

### Same Category (Mouse)

- **Track3DMouse** - Translation + rotation, different effect
- **SwivelMouse** - Rotation following mouse angle

### Parallel in Other Triggers

- **TiltScroll** (scroll) - 3D tilt driven by scroll
- **ArcScroll** (scroll) - Arc rotation on scroll
- **TiltIn** (entrance) - One-time tilt entrance

### Alternatives

- **TrackMouse** - When translation preferred over rotation
- **ScaleMouse** - When scale effect preferred
- **SwivelMouse** - When rotation around Z-axis preferred

## Decision Hints

```yaml
choose_this_when:
  - "interactive 3D card effect"
  - "product hover enhancement"
  - "premium/gaming interface"
  - "depth/perspective on hover"
  - "gyroscope-like effect"

choose_alternative_when:
  - translation_preferred: TrackMouse
  - scale_effect: ScaleMouse
  - z_rotation: SwivelMouse
  - scroll_driven: TiltScroll
  - mobile_device: (use device orientation)
```
