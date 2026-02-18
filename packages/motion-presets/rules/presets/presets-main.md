---
name: motion-presets
description: Reference for selecting and configuring Interact motion presets. Read when applying entrance, scroll, ongoing, or mouse animations to elements, choosing presets by tone or use case, combining effects, or handling accessibility and reduced motion.
---

# Motion Presets Reference

## Table of Contents

- [Terminology](#terminology)
- [Preset Categories](#preset-categories)
- [Trigger and Effect Binding](#trigger-and-effect-binding)
- [Combining Effects](#combining-effects)
- [Parameter Standards](#parameter-standards)
- [Available Presets](#available-presets)
- [Selection by Tone](#selection-by-tone)
- [Selection by Use Case](#selection-by-use-case)
- [Cross-Category Parallels](#cross-category-parallels)
- [Accessibility](#accessibility)

## Terminology

| Term          | Meaning                                                                                 |
| ------------- | --------------------------------------------------------------------------------------- |
| **Effect**    | Interact's term for an operation applied to an element (animation, custom effect, etc.) |
| **Preset**    | A pre-built, named effect configuration from this library (e.g., `FadeIn`, `BounceIn`)  |
| **Animation** | The actual visual motion that runs in the browser (CSS or WAAPI)                        |

A preset is a named effect. "Preset" is used when talking about selection and configuration; "effect" when talking about the Interact runtime; "animation" when referring to the visual motion or CSS/WAAPI mechanism.

## Preset Categories

| Category | Optimized For                                      | Implementation                              | Notes                                                                   |
| -------- | -------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| entrance | When an element enters the viewport                | `viewEnter` (intersection observer)         | Can also be triggered by hover, click, animationend, and other triggers |
| scroll   | Scroll position of an element relative to document | ViewTimeline (scroll progress)              | Animation progress tied to element's position in the viewport           |
| ongoing  | Continuous loop                                    | infinite CSS/WAAPI animation                | Runs indefinitely until stopped                                         |
| mouse    | Follow or Repel by Pointer position                | transform values driven by pointer position | Real-time response to cursor position; may behave differently on mobile |

For full parameter details per category, see the dedicated reference files:

- [Entrance Presets](./entrance-presets.md)
- [Scroll Presets](./scroll-presets.md)
- [Ongoing Presets](./ongoing-presets.md)
- [Mouse Presets](./mouse-presets.md)

## Trigger and Effect Binding

In the simplest case, a trigger and its effect are bound to the same element. However, an effect on one element can also be triggered by another element (e.g., hovering a button triggers a FadeIn on a sibling panel).

## Combining Effects

1. Avoid mixing multiple effects on the same element at the same time when possible
2. Never combine effects that affect the same CSS properties (e.g., two effects both using `transform`)
3. When combining is necessary, effect order matters — later effects may override earlier ones
4. If possible, use nested containers to separate effects that would conflict — place each effect on a separate wrapper element. Note: here also order matters

## Parameter Standards

### Animation Options (Not Preset Parameters)

These are set on the effect configuration level, not on the preset itself:

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

### Overloaded Parameter Names

The `direction` parameter accepts different values depending on the preset:

| Meaning            | Accepted Values                                        | Presets                          |
| ------------------ | ------------------------------------------------------ | -------------------------------- |
| Cardinal direction | 'top', 'right', 'bottom', 'left'                       | FlipIn, FoldIn, SlideIn, FloatIn |
| Cardinal + center  | 'top', 'right', 'bottom', 'left', 'center'             | BounceIn                         |
| Corner direction   | 'top-left', 'top-right', 'bottom-left', 'bottom-right' | TurnIn                           |
| Rotation direction | 'clockwise', 'counter-clockwise'                       | SpinIn, SpinScroll, Spin         |

### Using Units

Interact supports both a CSSUnitValue-style object (e.g., `distance: { value: 120, type: 'px' }`, mapped to the internal type `UnitLengthPercentage`) and flat string values (e.g., `distance: '120px'`).

Prefer the object notation. Be consistent within a configuration — use one format, not both.

### Coordinate System

**Standard:** 0° = right (east), angles increase counter-clockwise

- 0° = right (east)
- 90° = top (north)
- 180° = left (west)
- 270° = bottom (south)

### Distance Units

Supported unit types: `px`, `em`, `rem`, `vh`, `vw`, `vmin`, `vmax`, `percentage`

```typescript
distance: { value: 120, type: 'px' }       // pixels
distance: { value: 50, type: 'percentage' } // percentage
distance: { value: 10, type: 'vh' }        // viewport height
```

### CSS Custom Properties

The library uses these CSS custom properties for runtime control:

- `--motion-rotate`: Element rotation (used by SpinIn and other rotation presets)

## Available Presets

### Entrance (19 presets)

FadeIn, ArcIn, BlurIn, BounceIn, CurveIn, DropIn, ExpandIn, FlipIn, FloatIn, FoldIn, GlideIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

→ [Full entrance preset reference](./entrance-presets.md)

### Scroll (19 presets)

ArcScroll, BlurScroll, FadeScroll, FlipScroll, GrowScroll, MoveScroll, PanScroll, ParallaxScroll, RevealScroll, ShapeScroll, ShrinkScroll, ShuttersScroll, SkewPanScroll, SlideScroll, Spin3dScroll, SpinScroll, StretchScroll, TiltScroll, TurnScroll

→ [Full scroll preset reference](./scroll-presets.md)

### Ongoing (14 presets)

Bounce, Breathe, Cross, DVD, Flash, Flip, Fold, Jello, Poke, Pulse, Rubber, Spin, Swing, Wiggle

→ [Full ongoing preset reference](./ongoing-presets.md)

### Mouse (12 presets)

AiryMouse, BlobMouse, BlurMouse, BounceMouse, CustomMouse, ScaleMouse, SkewMouse, SpinMouse, SwivelMouse, Tilt3DMouse, Track3DMouse, TrackMouse

→ [Full mouse preset reference](./mouse-presets.md)

## Selection by Tone

| Tone                | Entrance                                 | Scroll                                    | Ongoing                    | Mouse                            |
| ------------------- | ---------------------------------------- | ----------------------------------------- | -------------------------- | -------------------------------- |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn | FadeScroll, BlurScroll                    | Pulse (subtle), Breathe    | Tilt3DMouse (subtle), TrackMouse |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn            | ArcScroll, FlipScroll, TiltScroll         | Flip, Fold                 | Track3DMouse                     |
| Playful/Energetic   | BounceIn, SpinIn                         | SpinScroll, Spin3dScroll                  | Bounce, Wiggle, Jello, DVD | BounceMouse, BlobMouse           |
| Geometric/Modern    | ShapeIn, RevealIn, ShuttersIn, WinkIn    | ShapeScroll, RevealScroll, ShuttersScroll | Cross                      | -                                |

## Selection by Use Case

| Use Case               | Recommended Presets                            |
| ---------------------- | ---------------------------------------------- |
| Hero sections          | ArcIn, FloatIn, RevealIn                       |
| Modals/Popups          | FadeIn, DropIn, ExpandIn, SlideIn              |
| List items (staggered) | FadeIn, SlideIn, GlideIn with increasing delay |
| Cards                  | FlipIn, ArcIn, TiltIn + FadeScroll (in/out)    |
| Notifications/Badges   | BounceIn, DropIn + Pulse                       |
| CTAs/Buttons           | BounceIn, ExpandIn + Pulse                     |
| Loading indicators     | Spin, Pulse                                    |
| Product images         | Tilt3DMouse, ScaleMouse                        |
| Background depth       | ParallaxScroll, TrackMouse (layered)           |

## Cross-Category Parallels

| Entrance | Scroll         | Ongoing | Mouse       |
| -------- | -------------- | ------- | ----------- |
| FadeIn   | FadeScroll     | Flash   | -           |
| ArcIn    | ArcScroll      | -       | -           |
| SpinIn   | SpinScroll     | Spin    | SpinMouse   |
| BounceIn | -              | Bounce  | BounceMouse |
| TiltIn   | TiltScroll     | -       | Tilt3DMouse |
| FlipIn   | FlipScroll     | Flip    | -           |
| ExpandIn | GrowScroll     | Pulse   | ScaleMouse  |
| SlideIn  | SlideScroll    | -       | TrackMouse  |
| BlurIn   | BlurScroll     | -       | BlurMouse   |
| RevealIn | RevealScroll   | -       | -           |
| -        | ParallaxScroll | -       | TrackMouse  |

## Accessibility

### Host vs Preset Responsibility

The presets provide animations; the host platform decides when/whether to apply them.

Interact supports `conditions` in the config for handling reduced motion. Define a media condition for `(prefers-reduced-motion: reduce)` and use it to swap high-risk presets for safer alternatives (e.g., SpinIn → FadeIn, BounceIn → FadeIn). Conditions can be applied per-interaction or per-effect, and automatically re-evaluate when the user's preference changes.

If the host handles accessibility globally (e.g., disabling all animations on `(prefers-reduced-motion: reduce)`), presets don't need to address it separately.

### Preset Risk Levels

**High risk** (vestibular triggers, seizure risk if motion is fast and repetitive):

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
| All mouse presets                 | Static state              |

### LLM Guidance Principles

1. **Do not limit creativity by default** — generate what the user asks for
2. **Apply constraints only when explicitly requested** — keywords: "accessible", "a11y", "reduced motion safe", "subtle", "tone down"
3. **High-risk presets are informational, not blockers** — optionally note vestibular concerns in response
4. **Mouse presets may behave differently on mobile** — note this as context, not a restriction
5. **Duration guidelines are suggestions** — functional UI <500ms, decorative up to 1200ms, hero up to 2000ms
