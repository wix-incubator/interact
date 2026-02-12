---
name: LLM Preset Rules
overview: Consolidated single-file reference with category-specific preset guides.
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
├── entrance.md               # Entrance preset category guide
├── scroll.md                 # Scroll preset category guide
├── ongoing.md                # Ongoing preset category guide
└── mouse.md                  # Mouse preset category guide
```

---

## Preset Registry

### Entrance Presets

| Preset     | Notes                                                    |
| ---------- | -------------------------------------------------------- |
| FadeIn     | Simple opacity transition                                |
| ArcIn      | 3D arc rotation entry                                    |
| BlurIn     | Blur-to-clear transition                                 |
| BounceIn   | Bouncy entrance with overshoot                           |
| CurveIn    | Curved path entry                                        |
| DropIn     | Drop from above with scale                               |
| FlipIn     | 3D flip rotation                                         |
| FloatIn    | Gentle floating entry                                    |
| FoldIn     | 3D fold unfold                                           |
| GlideIn    | Smooth directional slide (default: from left, angle 270) |
| GrowIn     | Scale + translate entry                                  |
| RevealIn   | Directional clip-path reveal                             |
| ShapeIn    | Geometric shape clip-path reveal                         |
| ShuttersIn | Multi-segment reveal                                     |
| SlideIn    | Directional slide with clip                              |
| SpinIn     | Rotation entry                                           |
| TiltIn     | 3D tilt entry                                            |
| TurnIn     | Corner-pivot rotation                                    |
| WinkIn     | Axis-based scale reveal                                  |

### Scroll Presets

| Preset         | Notes                         |
| -------------- | ----------------------------- |
| ArcScroll      | 3D arc on scroll              |
| BlurScroll     | Blur based on scroll          |
| FadeScroll     | Opacity on scroll             |
| FlipScroll     | 3D flip on scroll             |
| GrowScroll     | Scale up on scroll            |
| MoveScroll     | Translate on scroll           |
| PanScroll      | Horizontal pan on scroll      |
| ParallaxScroll | Depth-based parallax          |
| RevealScroll   | Clip-path reveal on scroll    |
| ShapeScroll    | Shape clip-path on scroll     |
| ShrinkScroll   | Scale down on scroll          |
| ShuttersScroll | Multi-segment on scroll       |
| SkewPanScroll  | Skew + pan on scroll          |
| SlideScroll    | Slide on scroll               |
| Spin3dScroll   | 3D spin on scroll             |
| SpinScroll     | 2D spin on scroll             |
| StretchScroll  | Stretch deformation on scroll |
| TiltScroll     | 3D tilt on scroll             |
| TurnScroll     | Turn rotation on scroll       |

### Ongoing Presets

| Preset  | Notes                  |
| ------- | ---------------------- |
| Bounce  | Continuous bounce      |
| Breathe | Gentle scale pulse     |
| Cross   | Cross-pattern movement |
| DVD     | DVD screensaver bounce |
| Flash   | Opacity flash          |
| Flip    | Continuous flip        |
| Fold    | Continuous fold        |
| Jello   | Jello wobble           |
| Poke    | Directional poke       |
| Pulse   | Scale pulse            |
| Rubber  | Rubber stretch         |
| Spin    | Continuous rotation    |
| Swing   | Pendulum swing         |
| Wiggle  | Shake wiggle           |

### Mouse Presets

| Preset       | Notes                    |
| ------------ | ------------------------ |
| AiryMouse    | Light floating follow    |
| BlobMouse    | Blob-like scale response |
| BlurMouse    | Blur on distance         |
| BounceMouse  | Bouncy follow            |
| CustomMouse  | Custom mouse effect      |
| ScaleMouse   | Scale on mouse           |
| SkewMouse    | Skew on mouse            |
| SpinMouse    | Spin on mouse            |
| SwivelMouse  | 3D swivel on mouse       |
| Tilt3DMouse  | 3D tilt on mouse         |
| Track3DMouse | 3D tracking on mouse     |
| TrackMouse   | Direct mouse tracking    |

---

## Key Constraints

### Preset Categories

These are categories of presets, each optimized for certain use cases but not limited to a single trigger mechanism.

| Category | Optimized For                       | Notes                                                                    |
| -------- | ----------------------------------- | ------------------------------------------------------------------------ |
| entrance | `viewEnter` (intersection observer) | Can also be triggered by hover, click, animationend, and other triggers  |
| scroll   | ViewTimeline (scroll progress)      | Animation progress tied to element's position in the viewport            |
| ongoing  | Continuous loop                     | Runs indefinitely until stopped                                          |
| mouse    | Pointer position binding            | Real-time response to cursor position; may behave differently on mobile  |

### Combining Animations

1. Avoid mixing multiple animations on the same element when possible
2. Never combine animations that affect the same CSS properties (e.g., two animations both using `transform`)
3. When combining is necessary, animation order matters - later animations may override earlier ones
4. If possible, use nested containers to separate animations that would conflict - place each animation on a separate wrapper element

---

## Parameter Standards

### Animation Options (Not Preset Parameters)

These are set on the animation/effect configuration level, not on the preset itself:

- `duration`: Animation duration in ms (entrance, ongoing)
- `delay`: Animation delay in ms (entrance, ongoing)
- `easing`: Easing function
- `iterations`: Number of iterations
- `alternate`: Alternate direction on each iteration
- `fill`: Animation fill mode
- `reversed`: Reverse the animation

**Scroll-specific animation options:**

- `rangeStart` / `rangeEnd`: `RangeOffset` controlling when the scroll animation starts/ends
- `transitionDuration` / `transitionDelay` / `transitionEasing`: Transition smoothing

### Preset-Specific Parameters

**Most Scroll presets:**

- `range`: 'in' | 'out' | 'continuous' (controls animation direction relative to scroll)

### Overloaded Parameter Names

The `direction` parameter accepts different values depending on the preset:

| Meaning            | Accepted Values                                                    | Presets                              |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------ |
| Cardinal direction | 'top', 'right', 'bottom', 'left'                                  | FlipIn, FoldIn, SlideIn, FloatIn    |
| Extended cardinal  | + 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center' | BounceIn, ShapeIn                    |
| Rotation direction | 'clockwise', 'counter-clockwise'                                  | SpinIn, SpinScroll, Spin             |

### Coordinate System

**Standard:** 0° = right (east), angles increase counter-clockwise

- 0° = right (east)
- 90° = top (north)
- 180° = left (west)
- 270° = bottom (south)

### Distance Units

Distance parameters use the `UnitLengthPercentage` type:

```typescript
distance: { value: 120, type: 'px' }       // pixels
distance: { value: 50, type: 'percentage' } // percentage
distance: { value: 10, type: 'vh' }        // viewport height
```

Supported unit types: `px`, `em`, `rem`, `vh`, `vw`, `vmin`, `vmax`, `percentage`

### CSS Custom Properties

The library uses these CSS custom properties for runtime control:

- `--motion-rotate`: Element rotation (used by SpinIn and other rotation presets)

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

The presets provide animations; the host platform decides when/whether to apply them.

Interact supports `conditions` in the config for handling reduced motion. Define a media condition for `(prefers-reduced-motion: reduce)` and use it to swap high-risk presets for safer alternatives (e.g., SpinIn → FadeIn, BounceIn → FadeIn). Conditions can be applied per-interaction or per-effect, and automatically re-evaluate when the user's preference changes.

When the host handles accessibility globally (e.g., disabling all animations), presets don't need to address it separately.

### Preset Risk Levels

**High risk** (vestibular triggers, seizure risk):

- Spinning: SpinIn, Spin, SpinScroll, SpinMouse, Spin3dScroll
- Bouncing: BounceIn, Bounce, BounceMouse
- 3D rotations: ArcIn, FlipIn, ArcScroll, FlipScroll, Tilt3DMouse
- Continuous motion: Flash, DVD, Jello, Wiggle

**Medium risk** (strong motion, may affect some users):

- TurnIn
- ParallaxScroll at high speed values

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
| All mouse animations              | Static state              |

### LLM Guidance Principles

1. **Do not limit creativity by default** - generate what the user asks for
2. **Apply constraints only when explicitly requested** - keywords: "accessible", "a11y", "reduced motion safe", "subtle", "tone down"
3. **High-risk presets are informational, not blockers** - optionally note vestibular concerns in response
4. **Mouse presets may behave differently on mobile** - note this as context, not a restriction
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
| Hero sections          | ArcIn, FloatIn, RevealIn                          |
| Modals/Popups          | FadeIn, DropIn, GrowIn, SlideIn                  |
| List items (staggered) | FadeIn, SlideIn, GlideIn with increasing delay   |
| Cards                  | FlipIn, ArcIn, TiltIn + FadeScroll (in/out)      |
| Notifications/Badges   | BounceIn, DropIn + Pulse                         |
| CTAs/Buttons           | BounceIn, GrowIn + Pulse                         |
| Loading indicators     | Spin, Pulse                                      |
| Product images         | Tilt3DMouse, ScaleMouse                          |
| Background depth       | ParallaxScroll, TrackMouse (layered)              |

---

## Regeneration Steps

To regenerate `presets-reference.md`:

1. Check Preset Registry in this file for active presets
2. Read preset type definitions from `motion-presets/src/types.ts`
3. For each active preset, get params from `motion-presets/src/library/{category}/{Preset}.ts`
4. Apply parameter naming conventions from this file
5. Generate using preset entry format above
6. Organize by preset category
7. Include selection tables from this file
8. Include accessibility section from this file
9. Run `yarn format` on all generated markdown files to ensure they pass CI formatting checks

---

## Intensity Value Guide

When users ask for "soft", "subtle", "medium", or "hard"/"dramatic" effects, use these value mappings as guidance for suggesting appropriate parameter values.

### Entrance Presets Intensity Values

| Preset   | Parameter        | Subtle/Soft | Medium     | Dramatic/Hard |
| -------- | ---------------- | ----------- | ---------- | ------------- |
| ArcIn    | easing           | cubicInOut  | quintInOut | backOut       |
| BlurIn   | blur             | 6px         | 25px       | 50px          |
| BounceIn | distanceFactor   | 1           | 2          | 3             |
| DropIn   | initialScale     | 1.2         | 1.6        | 2             |
| FlipIn   | initialRotate    | 45°         | 90°        | 270°          |
| FoldIn   | initialRotate    | 35°         | 60°        | 90°           |
| GrowIn   | initialScale     | 0.8         | 0.6        | 0             |
| SlideIn  | initialTranslate | 0.2         | 0.8        | 1             |
| SpinIn   | initialScale     | 1           | 0.6        | 0             |

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
| TiltScroll    | distance  | 0           | 0.5    | 1             |
| TurnScroll    | scale     | 1           | 1.3    | 1.6           |

### Ongoing Presets Intensity Values

| Preset | Parameter | Subtle/Soft | Medium | Dramatic/Hard |
| ------ | --------- | ----------- | ------ | ------------- |
| Bounce | intensity | 0           | 0.5    | 1             |
| Fold   | angle     | 15°         | 30°    | 45°           |
| Jello  | intensity | 0           | 0.33   | 1             |
| Poke   | intensity | 0           | 0.33   | 1             |
| Pulse  | intensity | 0           | 0.5    | 1             |
| Rubber | intensity | 0           | 0.5    | 1             |
| Swing  | swing     | 20°         | 40°    | 60°           |
| Wiggle | intensity | 0           | 0.33   | 1             |

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

Suggest: `{ type: 'FlipIn', initialRotate: 45 }`

