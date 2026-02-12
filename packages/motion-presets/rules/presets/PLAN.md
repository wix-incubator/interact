---
name: LLM Preset Rules
overview: Consolidated single-file reference with lightweight trigger entry points.
status: in-progress
version: 2.0
last-updated: 2026-02-01
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

---

## Preset Registry

### Entrance Presets

| Preset     | Status      | Notes                                                    |
| ---------- | ----------- | -------------------------------------------------------- |
| FadeIn     | Active      | Simple opacity transition                                |
| ArcIn      | Active      | 3D arc rotation entry                                    |
| BlurIn     | Active      | Blur-to-clear transition                                 |
| BounceIn   | Active      | Bouncy entrance with overshoot                           |
| CurveIn    | Active      | Curved path entry                                        |
| DropIn     | Active      | Drop from above with scale                               |
| FlipIn     | Active      | 3D flip rotation                                         |
| FloatIn    | Active      | Gentle floating entry                                    |
| FoldIn     | Active      | 3D fold unfold                                           |
| GlideIn    | Active      | Smooth directional slide (default: from left, angle 270) |
| GrowIn     | Active      | Scale + translate entry                                  |
| RevealIn   | Active      | Directional clip-path reveal                             |
| ShapeIn    | Active      | Geometric shape clip-path reveal                         |
| ShuttersIn | Active      | Multi-segment reveal                                     |
| SlideIn    | Active      | Directional slide with clip                              |
| SpinIn     | Active      | Rotation entry                                           |
| TiltIn     | Active      | 3D tilt entry                                            |
| TurnIn     | Active      | Corner-pivot rotation                                    |
| WinkIn     | Active      | Axis-based scale reveal                                  |
| CircleIn   | **REMOVED** | Legacy preset                                            |
| ExpandIn   | **REMOVED** | Consolidated into GrowIn                                 |
| GlitchIn   | **REMOVED** | Was wrapper for GlideIn                                  |
| PunchIn    | **REMOVED** | Legacy preset                                            |

### Scroll Presets

| Preset         | Status | Notes                         |
| -------------- | ------ | ----------------------------- |
| ArcScroll      | Active | 3D arc on scroll              |
| BlurScroll     | Active | Blur based on scroll          |
| FadeScroll     | Active | Opacity on scroll             |
| FlipScroll     | Active | 3D flip on scroll             |
| GrowScroll     | Active | Scale up on scroll            |
| MoveScroll     | Active | Translate on scroll           |
| PanScroll      | Active | Horizontal pan on scroll      |
| ParallaxScroll | Active | Depth-based parallax          |
| RevealScroll   | Active | Clip-path reveal on scroll    |
| ShapeScroll    | Active | Shape clip-path on scroll     |
| ShrinkScroll   | Active | Scale down on scroll          |
| ShuttersScroll | Active | Multi-segment on scroll       |
| SkewPanScroll  | Active | Skew + pan on scroll          |
| SlideScroll    | Active | Slide on scroll               |
| Spin3dScroll   | Active | 3D spin on scroll             |
| SpinScroll     | Active | 2D spin on scroll             |
| StretchScroll  | Active | Stretch deformation on scroll |
| TiltScroll     | Active | 3D tilt on scroll             |
| TurnScroll     | Active | Turn rotation on scroll       |

### Ongoing Presets

| Preset  | Status | Notes                  |
| ------- | ------ | ---------------------- |
| Bounce  | Active | Continuous bounce      |
| Breathe | Active | Gentle scale pulse     |
| Cross   | Active | Cross-pattern movement |
| DVD     | Active | DVD screensaver bounce |
| Flash   | Active | Opacity flash          |
| Flip    | Active | Continuous flip        |
| Fold    | Active | Continuous fold        |
| Jello   | Active | Jello wobble           |
| Poke    | Active | Directional poke       |
| Pulse   | Active | Scale pulse            |
| Rubber  | Active | Rubber stretch         |
| Spin    | Active | Continuous rotation    |
| Swing   | Active | Pendulum swing         |
| Wiggle  | Active | Shake wiggle           |

### Mouse Presets

| Preset       | Status | Notes                    |
| ------------ | ------ | ------------------------ |
| AiryMouse    | Active | Light floating follow    |
| BlobMouse    | Active | Blob-like scale response |
| BlurMouse    | Active | Blur on distance         |
| BounceMouse  | Active | Bouncy follow            |
| CustomMouse  | Active | Custom mouse effect      |
| ScaleMouse   | Active | Scale on mouse           |
| SkewMouse    | Active | Skew on mouse            |
| SpinMouse    | Active | Spin on mouse            |
| SwivelMouse  | Active | 3D swivel on mouse       |
| Tilt3DMouse  | Active | 3D tilt on mouse         |
| Track3DMouse | Active | 3D tracking on mouse     |
| TrackMouse   | Active | Direct mouse tracking    |

### Background Scroll Presets

| Preset        | Status | Notes                                       |
| ------------- | ------ | ------------------------------------------- |
| BgCloseUp     | Active | Zoom close-up effect                        |
| BgFade        | Active | Background fade                             |
| BgFadeBack    | Active | Fade with pullback                          |
| BgFake3D      | Active | Fake 3D depth                               |
| BgPan         | Active | Horizontal pan                              |
| BgParallax    | Active | Parallax depth                              |
| BgPullBack    | Active | Pull back zoom                              |
| BgReveal      | Active | Background reveal                           |
| BgRotate      | Active | Background rotation                         |
| BgSkew        | Active | Background skew                             |
| BgZoom        | Active | Background zoom                             |
| ImageParallax | Active | Image parallax (no data-motion-part needed) |

---

## Key Constraints

### Trigger Mechanisms

| Trigger           | Mechanism                             | Notes                                   |
| ----------------- | ------------------------------------- | --------------------------------------- |
| entrance          | `viewEnter` (intersection observer)   | Plays once when element enters viewport |
| scroll            | Scroll position binding               | Tied to scroll progress (0-100%)        |
| ongoing           | Continuous loop                       | Runs indefinitely until stopped         |
| mouse             | Pointer position binding              | Desktop only, real-time response        |
| background-scroll | Scroll + `data-motion-part` targeting | Requires structured DOM (see below)     |

**Important:** Entrance animations only support the `viewEnter` trigger natively. For click, toggle, or other event-based triggers, implement triggering logic separately.

### Combining Animations

| Combination           | Support                         |
| --------------------- | ------------------------------- |
| Entrance + Ongoing    | Single element (native support) |
| Entrance + Mouse      | Requires nested containers      |
| Entrance + Scroll     | Requires nested containers      |
| Scroll + Mouse        | Requires nested containers      |
| Any other combination | Requires multiple containers    |

### Background Scroll Requirements

Requires `data-motion-part` attributes: `BG_LAYER`, `BG_MEDIA`, `BG_IMG`

Animates DOM elements via CSS transforms (not `background-position`).

**Exception:** `ImageParallax` works on regular `<img>` elements without `data-motion-part`.

---

## Parameter Standards

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

### Parameter Naming Conventions

| Meaning                 | Parameter Name | Values                                                             | Example Presets                              |
| ----------------------- | -------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| Numeric angle (degrees) | `angle`        | 0-360                                                              | GrowIn, GlideIn, MoveScroll                  |
| Cardinal direction      | `direction`    | 'top', 'right', 'bottom', 'left'                                   | FlipIn, FoldIn, SlideIn, FloatIn             |
| Extended cardinal       | `direction`    | + 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center' | BounceIn, ShapeIn                            |
| Rotation direction      | `direction`    | 'clockwise', 'counter-clockwise'                                   | SpinIn, SpinScroll, Spin                     |
| Axis                    | `axis`         | 'horizontal', 'vertical'                                           | WinkIn, FlipScroll, ArcScroll, Flip, Breathe |

### Coordinate System

**Standard:** 0° = right (east), angles increase counter-clockwise

- 0° = right (east)
- 90° = top (north)
- 180° = left (west)
- 270° = bottom (south)

### Distance Units

All distance parameters accept any CSS unit with a default:

```typescript
distance: { value: 120, type: 'px' }      // pixels
distance: { value: 50, type: 'percentage' } // percentage
distance: { value: 10, type: 'vh' }       // viewport height
```

### CSS Custom Properties

The library uses these CSS custom properties for runtime control:

- `--motion-opacity`: Target opacity (default: 1)
- `--motion-rotate`: Element rotation for scroll effects

---

## Optional Parameters (Previously Hardcoded)

Many presets now expose parameters that were previously hardcoded:

### 3D Perspective

| Preset            | Parameter     | Default | Range    |
| ----------------- | ------------- | ------- | -------- |
| ArcIn             | `perspective` | 800     | 200-2000 |
| TiltIn            | `perspective` | 800     | 200-2000 |
| FoldIn            | `perspective` | 800     | 200-2000 |
| FlipIn            | `perspective` | 800     | 200-2000 |
| CurveIn           | `perspective` | 200     | 100-1000 |
| BounceIn (center) | `perspective` | 800     | 200-2000 |
| FlipScroll        | `perspective` | 800     | 200-2000 |
| TiltScroll        | `perspective` | 400     | 200-2000 |
| Spin3dScroll      | `perspective` | 1000    | 200-2000 |

### Depth (Z Translation)

| Preset    | Parameter | Default | Notes                  |
| --------- | --------- | ------- | ---------------------- |
| ArcIn     | `depth`   | 300px   | Z translation distance |
| CurveIn   | `depth`   | 900px   | Z translation distance |
| TiltIn    | `depth`   | 200px   | Z translation distance |
| ArcScroll | `depth`   | 300     | Z translation distance |

### Rotation Angles

| Preset    | Parameter   | Default | Notes              |
| --------- | ----------- | ------- | ------------------ |
| ArcIn     | `angle`     | 80      | Arc rotation angle |
| ArcScroll | `angle`     | 68      | Arc rotation angle |
| TiltIn    | `tiltAngle` | 90      | Initial tilt angle |
| FloatIn   | `distance`  | 120     | Float distance     |
| TurnIn    | `angle`     | 50      | Rotation angle     |

---

## Accessibility

This section documents preset selection guidance for accessibility. It is not about library-level features (like `allowA11yTriggers`).

### Host vs Preset Responsibility

The presets provide animations; the host platform decides when/whether to apply them. When the host handles accessibility globally (e.g., disabling all animations under `prefers-reduced-motion`), presets don't need to address it separately.

### Preset Risk Levels

**High risk** (vestibular triggers, seizure risk):

- Spinning: SpinIn, Spin, SpinScroll, SpinMouse, Spin3dScroll
- Bouncing: BounceIn, Bounce, BounceMouse
- 3D rotations: ArcIn, FlipIn, ArcScroll, FlipScroll, Tilt3DMouse
- Continuous motion: Flash, DVD, Jello, Wiggle

**Medium risk** (strong motion, may affect some users):

- TurnIn
- ParallaxScroll, BgParallax at high speed values

**Low risk / safe** (opacity/blur changes, minimal spatial movement):

- FadeIn, FadeScroll, BlurIn, BlurScroll
- SlideIn (subtle), GlideIn (subtle)
- Pulse (subtle), Breathe

### Reduced Motion Fallbacks

| Original                          | Fallback                  |
| --------------------------------- | ------------------------- |
| BounceIn, SpinIn                  | FadeIn                    |
| ArcIn, FlipIn, TurnIn             | FadeIn                    |
| Spin, Bounce, Wiggle              | Stop or subtle Pulse      |
| Flash                             | Reduce frequency (<3/sec) |
| ParallaxScroll                    | Static position           |
| ArcScroll, FlipScroll, SpinScroll | FadeScroll or disable     |
| BgParallax, BgZoom                | Static background         |
| All mouse animations              | Static state              |

### LLM Guidance Principles

1. **Do not limit creativity by default** - generate what the user asks for
2. **Apply constraints only when explicitly requested** - keywords: "accessible", "a11y", "reduced motion safe", "subtle", "tone down"
3. **High-risk presets are informational, not blockers** - optionally note vestibular concerns in response
4. **Mouse presets are desktop-only** - note this as context, not a restriction
5. **Duration guidelines are suggestions** - functional UI <500ms, decorative up to 1200ms, hero up to 2000ms

---

## Preset Entry Format

For each preset in presets-reference.md:

```markdown
#### PresetName

Visual: [1-2 sentences describing what user SEES]

Parameters:

- `param1`: type/range (default: value)
- `param2`: type/range (default: value)

\`\`\`typescript
{ type: 'PresetName', param1: 'value' }
\`\`\`
```

**Notes:**

- Include all required parameters
- Include optional parameters with their defaults
- For angle-based presets, note that 0° = right (east)
- For 3D presets, include perspective parameter if customizable

---

## Selection Tables

### Preset Selection By Tone

| Tone                | Entrance                                 | Scroll                                    | Ongoing                    | Mouse                            |
| ------------------- | ---------------------------------------- | ----------------------------------------- | -------------------------- | -------------------------------- |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn | FadeScroll, BlurScroll                    | Pulse (subtle), Breathe    | Tilt3DMouse (subtle), TrackMouse |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn            | ArcScroll, FlipScroll, TiltScroll         | Flip, Fold                 | Track3DMouse                     |
| Playful/Energetic   | BounceIn, SpinIn                         | SpinScroll, Spin3dScroll                  | Bounce, Wiggle, Jello, DVD | BounceMouse, BlobMouse           |
| Geometric/Modern    | ShapeIn, RevealIn, ShuttersIn, WinkIn    | ShapeScroll, RevealScroll, ShuttersScroll | Cross                      | -                                |

### Preset Selection By Use Case

| Use Case               | Recommended Presets                              |
| ---------------------- | ------------------------------------------------ |
| Hero sections          | ArcIn, FloatIn, RevealIn + BgParallax, BgZoom    |
| Modals/Popups          | FadeIn, DropIn, GrowIn, SlideIn                  |
| List items (staggered) | FadeIn, SlideIn, GlideIn with increasing delay   |
| Cards                  | FlipIn, ArcIn, TiltIn + FadeScroll (in/out)      |
| Notifications/Badges   | BounceIn, DropIn + Pulse                         |
| CTAs/Buttons           | BounceIn, GrowIn + Pulse                         |
| Loading indicators     | Spin, Pulse                                      |
| Product images         | Tilt3DMouse, ScaleMouse                          |
| Background depth       | BgParallax, ParallaxScroll, TrackMouse (layered) |

---

## Data Sources

To regenerate presets-reference.md:

1. **Preset registry**: This file (PLAN.md) - see Preset Registry section for active/removed status
2. **Preset list**: `motion-presets/src/types.ts` - EntranceAnimation, ScrollAnimation, OngoingAnimation, MouseAnimation, BackgroundScrollAnimation unions
3. **Parameter constraints**: `motion-presets/src/library/{category}/{Preset}.ts` - parameter types and defaults
4. **Parameter standards**: This file (PLAN.md) - see Parameter Standards section
5. **Optional parameters**: This file (PLAN.md) - see Optional Parameters section
6. **Accessibility**: This file (PLAN.md) - see Accessibility section
7. **Selection tables**: This file (PLAN.md) - see Selection Tables section

## Regeneration Steps

1. Check Preset Registry in this file for active presets (skip REMOVED presets)
2. Read preset type definitions from types.ts
3. For each active preset, get params from library implementation
4. Apply parameter naming conventions from this file
5. Generate using preset entry format above
6. Organize by trigger category
7. Include selection tables from this file
8. Include accessibility section from this file
9. Run `yarn format` on all generated markdown files to ensure they pass CI formatting checks

---

## Intensity Value Guide (Legacy Power Reference)

The `power` parameter was removed from presets. When users ask for "soft", "subtle", "medium", or "hard"/"dramatic" effects, use these value mappings as guidance for suggesting appropriate parameter values.

### Entrance Presets Intensity Values

| Preset   | Parameter        | Subtle/Soft | Medium  | Dramatic/Hard |
| -------- | ---------------- | ----------- | ------- | ------------- |
| ArcIn    | easing           | quintInOut  | backOut | backInOut     |
| BlurIn   | blur             | 6px         | 25px    | 50px          |
| BounceIn | distanceFactor   | 1           | 2       | 3             |
| DropIn   | initialScale     | 1.2         | 1.6     | 2             |
| FlipIn   | initialRotate    | 45°         | 90°     | 270°          |
| FoldIn   | initialRotate    | 35°         | 60°     | 90°           |
| GrowIn   | initialScale     | 0.8         | 0.6     | 0             |
| SlideIn  | initialTranslate | 0.2         | 0.8     | 1             |
| SpinIn   | initialScale     | 0.8         | 0.5     | 0             |

### Scroll Presets Intensity Values

| Preset        | Parameter | Subtle/Soft | Medium | Dramatic/Hard |
| ------------- | --------- | ----------- | ------ | ------------- |
| BlurScroll    | blur      | 6px         | 25px   | 50px          |
| FlipScroll    | rotate    | 60°         | 120°   | 420°          |
| GrowScroll    | scale     | 1.2         | 1.7    | 4             |
| MoveScroll    | distance  | 150px       | 400px  | 800px         |
| ShrinkScroll  | scale     | 0.8         | 0.3    | 0             |
| SkewPanScroll | skew      | 10°         | 17°    | 24°           |
| Spin3dScroll  | rotate    | 45°         | 100°   | 200°          |
| SpinScroll    | scale     | 1           | 0.7    | 0.4           |
| StretchScroll | stretch   | 1.2         | 1.5    | 2             |
| TiltScroll    | distance  | 0.25        | 0.5    | 1             |
| TurnScroll    | scale     | 1           | 1.3    | 1.6           |

### Ongoing Presets Intensity Values

| Preset | Parameter | Subtle/Soft | Medium | Dramatic/Hard |
| ------ | --------- | ----------- | ------ | ------------- |
| Bounce | intensity | 0.3         | 0.5    | 1             |
| Fold   | angle     | 15°         | 30°    | 45°           |
| Jello  | intensity | 0.25        | 0.5    | 1             |
| Poke   | intensity | 0.25        | 0.5    | 1             |
| Pulse  | intensity | 0           | 0.06   | 0.12          |
| Rubber | intensity | 0           | 0.05   | 0.1           |
| Swing  | swing     | 20°         | 40°    | 60°           |
| Wiggle | intensity | 0.25        | 0.5    | 1             |

### Mouse Presets Intensity Values

| Preset            | Parameter(s)       | Subtle/Soft | Medium   | Dramatic/Hard |
| ----------------- | ------------------ | ----------- | -------- | ------------- |
| AiryMouse         | angle              | 10°         | 50°      | 85°           |
| BlobMouse         | scale              | 1.2         | 1.6      | 2.4           |
| BlurMouse         | angle, scale       | 0°, 1       | 25°, 0.7 | 65°, 0.25     |
| ScaleMouse (down) | scale              | 0.85        | 0.5      | 0             |
| ScaleMouse (up)   | scale              | 1.2         | 1.6      | 2.4           |
| SkewMouse         | angle              | 10°         | 20°      | 45°           |
| SwivelMouse       | angle, perspective | 25°, 1000   | 50°, 700 | 85°, 300      |
| Tilt3DMouse       | angle, perspective | 25°, 1000   | 50°, 500 | 85°, 200      |
| Track3DMouse      | angle, perspective | 25°, 1000   | 50°, 500 | 85°, 333      |

### Intensity Usage Example

When a user asks: "I want a subtle flip entrance"

Instead of: `{ type: 'FlipIn', power: 'soft' }`

Suggest: `{ type: 'FlipIn', initialRotate: 45 }`

---

## Migration Reference

For users migrating from removed presets:

| Removed Preset | Migration                                                                   |
| -------------- | --------------------------------------------------------------------------- |
| GlitchIn       | Use `GlideIn` with desired `angle` (default 270 = from left)                |
| ExpandIn       | Use `GrowIn` with `angle` and `distance` to achieve expand-from-edge effect |
| CircleIn       | No direct replacement (legacy preset)                                       |
| PunchIn        | No direct replacement (legacy preset)                                       |

### GlideIn Default Change

GlideIn default `angle` changed from `0` (from top) to `270` (from left) to match the more common slide-in-from-left behavior.
