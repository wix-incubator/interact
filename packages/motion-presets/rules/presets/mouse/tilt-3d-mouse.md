---
name: Tilt3DMouse
category: mouse
tags: [3d, tilt, mouse, perspective, interactive, hover, rotation]
---

# Tilt3DMouse

## Synonyms

3d tilt, mouse tilt, perspective tilt, interactive tilt, hover tilt, card tilt, gyroscope effect

## Visual Description

Element tilts in 3D space following mouse position within the tracking area. Uses `perspective` and `rotateX`/`rotateY` transforms to create depth. When mouse is at center, element is flat (0° rotation). Moving mouse left/right tilts element on Y-axis; moving up/down tilts on X-axis. Maximum tilt angle controlled by power/angle parameter. Perspective distance affects depth perception. Optional smooth transition easing when mouse moves. Inverted mode reverses tilt direction.

## When to Use

- Interactive cards and product displays (high confidence)
- Hero sections with depth effect
- Image galleries with hover enhancement
- Portfolio thumbnails
- Call-to-action buttons with premium feel
- Game-like interfaces
- 3D showcase elements

## When NOT to Use

- Text-heavy content (readability issues during tilt)
- Mobile devices (no mouse, use device orientation instead)
- Accessibility-focused interfaces
- Multiple overlapping elements
- When precise click targeting is needed
- Performance-constrained environments

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
// Basic - medium tilt
{ type: 'Tilt3DMouse' }

// Subtle card tilt
{ type: 'Tilt3DMouse', power: 'soft' }
// with: transitionDuration: 300

// Dramatic interactive element
{ type: 'Tilt3DMouse', power: 'hard' }
// with: transitionDuration: 200

// Custom angle with inverted
{ type: 'Tilt3DMouse', angle: 30, inverted: true }
// with: perspective: 600
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
