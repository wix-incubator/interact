---
name: LLM Preset Rules
overview: Consolidated single-file reference with lightweight trigger entry points.
status: completed
---

# LLM Rules for Motion Presets

This file serves as the **source of truth** for regenerating `presets-reference.md` when presets change.

## Structure

```text
rules/presets/
├── presets-reference.md      # Comprehensive reference (all presets, all info)
├── entrance.md               # Lightweight trigger entry point
├── scroll.md                 # Lightweight trigger entry point
├── ongoing.md                # Lightweight trigger entry point
├── mouse.md                  # Lightweight trigger entry point
└── background-scroll.md      # Lightweight trigger entry point
```

## Key Constraints

### Trigger Mechanisms

| Trigger | Mechanism | Notes |
| --------- | ----------- | ------- |
| entrance | `viewEnter` (intersection observer) | Plays once when element enters viewport |
| scroll | Scroll position binding | Tied to scroll progress (0-100%) |
| ongoing | Continuous loop | Runs indefinitely until stopped |
| mouse | Pointer position binding | Desktop only, real-time response |
| background-scroll | Scroll position for CSS backgrounds | Specifically for background media |

**Important:** Entrance animations only support the `viewEnter` trigger natively. For click, toggle, or other event-based triggers, implement triggering logic separately.

### Combining Animations

| Combination | Support |
| ------------- | --------- |
| Entrance + Ongoing | Single element (native support) |
| Entrance + Mouse | Requires nested containers |
| Entrance + Scroll | Requires nested containers |
| Scroll + Mouse | Requires nested containers |
| Any other combination | Requires multiple containers |

### Common Parameters

**All Entrance presets:**

- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

**Most Scroll presets:**

- `range`: 'in' | 'out' | 'continuous'
- `start`: 0-100%
- `end`: 0-100%

**Most Ongoing presets:**

- `duration`: 100-4000ms
- `delay`: 0-8000ms

---

## Power Parameter Mappings

`power: 'soft' | 'medium' | 'hard'` **overrides** fine-grained parameters when set.

### Entrance Presets

| Preset | Power Controls | soft | medium | hard |
| -------- | --------------- | ------ | -------- | ------ |
| ArcIn | easing curve | subtle | balanced | dramatic |
| BlurIn | blur | 6px | 25px | 50px |
| BounceIn | distanceFactor | 1 | 2 | 3 |
| DropIn | scale, easing | 1.2/cubicInOut | 1.6/quintInOut | 2/backOut |
| ExpandIn | scale, easing | subtle | balanced | dramatic |
| FlipIn | initialRotate | 45deg | 90deg | 270deg |
| FoldIn | initialRotate | 35deg | 60deg | 90deg |
| GlideIn | easing curve | subtle | balanced | dramatic |
| GlitchIn | glitch intensity | subtle | balanced | dramatic |
| GrowIn | scale, easing | subtle | balanced | dramatic |
| PunchIn | easing | sineIn | quadIn | quintIn |
| ShuttersIn | easing curve | subtle | balanced | dramatic |
| SlideIn | easing curve | subtle | balanced | dramatic |
| SpinIn | easing curve | subtle | balanced | dramatic |

### Scroll Presets

| Preset | Power Controls | soft | medium | hard |
| -------- | --------------- | ------ | -------- | ------ |
| BlurScroll | blur | 6px | 25px | 50px |
| FlipScroll | rotate | 60deg | 120deg | 420deg |
| GrowScroll | scaleFrom/scaleTo | 0.8-1.2 | 0.3-1.7 | 0-4 |
| MoveScroll | distance | 150px | 400px | 800px |
| ShapeScroll | clipPath intensity | varies by shape | | |
| ShrinkScroll | scaleFrom/scaleTo | 1.2-0.8 | 1.7-0.3 | 3.5-0 |
| SkewPanScroll | skew | 10deg | 17deg | 24deg |
| Spin3dScroll | rotationZ/travelY | 45/0 | 100/0.5 | 200/1 |
| SpinScroll | scale | 1 | 0.7 | 0.4 |
| StretchScroll | scaleX/scaleY | 0.8/1.2 | 0.6/1.5 | 0.4/2 |
| TiltScroll | distance | 0 | 0.5 | 1 |
| TurnScroll | scaleFrom/scaleTo | 1/1 | 0.7/1.3 | 0.4/1.6 |

### Ongoing Presets

| Preset | Power Controls | soft | medium | hard |
| -------- | --------------- | ------ | -------- | ------ |
| Bounce | bounceFactor | 1 | 2 | 3 |
| Flip | easing curve | subtle | balanced | dramatic |
| Fold | angle | 15deg | 30deg | 45deg |
| Jello | jelloFactor | 1 | 2 | 4 |
| Poke | pokeFactor | 1 | 2 | 4 |
| Pulse | pulseOffset | 0 | 0.06 | 0.12 |
| Rubber | rubberOffset | 0 | 0.05 | 0.1 |
| Spin | easing curve | linear | eased | bouncy |
| Swing | swing angle | 20deg | 40deg | 60deg |
| Wiggle | wiggleFactor | 1 | 2 | 4 |

### Mouse Presets

| Preset | Power Controls | soft | medium | hard |
| -------- | --------------- | ------ | -------- | ------ |
| AiryMouse | angle | 10deg | 50deg | 85deg |
| BlobMouse | scale | 1.2 | 1.6 | 2.4 |
| BlurMouse | angle/scale | 0/1 | 25/0.7 | 65/0.25 |
| BounceMouse | spring easing | subtle | balanced | dramatic |
| ScaleMouse | scale (varies by direction) | down: 0.85, up: 1.2 | down: 0.5, up: 1.6 | down: 0, up: 2.4 |
| SkewMouse | angle | 10deg | 20deg | 45deg |
| SpinMouse | rotation intensity | subtle | balanced | dramatic |
| SwivelMouse | angle/perspective | 25/1000 | 50/700 | 85/300 |
| Tilt3DMouse | angle/perspective | 25/1000 | 50/500 | 85/200 |
| Track3DMouse | angle/perspective | 25/1000 | 50/500 | 85/333 |
| TrackMouse | easing | linear | easeOut | hardBackOut |

---

## Preset Entry Format

For each preset in presets-reference.md:

```markdown
#### PresetName

Visual: [1-2 sentences describing what user SEES]

Parameters:
- `param1`: type/range (default: value)
- `param2`: type/range (default: value)
- `power`: soft | medium | hard (if supported)

**When `power` is set:** overrides `paramX` (soft=value, medium=value, hard=value)

\`\`\`typescript
{ type: 'PresetName', param1: 'value' }
\`\`\`
```

---

## Data Sources

To regenerate presets-reference.md:

1. **Preset list**: `motion-presets/src/types.ts` - EntranceAnimation, ScrollAnimation, OngoingAnimation, MouseAnimation, BackgroundScrollAnimation unions
2. **Parameter constraints**: `effects-kit/src/effects/{category}/{preset}.ts` - min/max/step/defaults
3. **Power mappings**: This file (PLAN.md) - see tables above
4. **Base params**: `effects-kit/src/effects/baseParams.ts`

## Regeneration Steps

1. Read preset list from types.ts
2. For each preset, get params from effects-kit
3. Apply power mappings from this file
4. Generate using preset entry format above
5. Organize by trigger category
