---
name: motion-presets-main-reference
description: Entry point for selecting and configuring Interact motion presets. Read when the user asks about motion animations, presets, effects, entrance/scroll/ongoing/mouse animations, or interaction design.
---

# Motion Presets Reference

## Table of Contents

- [Terminology](#terminology)
- [Decision Flow](#decision-flow)
- [Preset Categories](#preset-categories)
- [Parameter Standards](#parameter-standards)
- [Selection Tables](#selection-tables)
- [Combining Effects](#combining-effects)
- [Accessibility](#accessibility)

## Terminology

| Term          | Meaning                                                                                 |
| ------------- | --------------------------------------------------------------------------------------- |
| **Effect**    | Interact's term for an operation applied to an element (animation, custom effect, etc.) |
| **Preset**    | A pre-built, named effect configuration from this library (e.g., `FadeIn`, `BounceIn`)  |
| **Animation** | The actual visual motion that runs in the browser (CSS or WAAPI)                        |

A preset is a named effect. "Preset" is used when talking about selection and configuration; "effect" when talking about the Interact runtime; "animation" when referring to the visual motion or CSS/WAAPI mechanism.

## Decision Flow

1. **Select Category** - What kind of effect? (entrance, scroll, ongoing, mouse)
2. **Select Preset** - Which visual effect matches the intent?
3. **Configure Parameters** - Customize direction, intensity, timing, etc.

### Quick Category Lookup

| User Intent                                                          | Category | Notes                                                                   |
| -------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| "animate when element enters viewport", "reveal on scroll into view" | entrance | Optimized for `viewEnter`; also works with hover, click, animationEnd   |
| "animate based on scroll position", "parallax", "scroll-driven"      | scroll   | Animation progress tied to element's position in the viewport           |
| "always moving", "pulsing", "loading spinner", "continuous loop"     | ongoing  | Runs indefinitely until stopped                                         |
| "react to mouse", "follow cursor", "tilt on hover"                   | mouse    | Real-time response to cursor position; may behave differently on mobile |

---

## Preset Categories

### Entrance

One-shot animations optimized for viewport entry, but can also be triggered by hover, click, animationEnd, and other triggers.

**When to use:** Element reveals on viewport entry, first-time visibility animations, click/hover-triggered transitions

**When NOT to use:** Scroll-driven reveals → use scroll | Continuous/looping → use ongoing | Mouse-reactive → use mouse

**Available presets:** FadeIn, ArcIn, BlurIn, BounceIn, CurveIn, DropIn, ExpandIn, FlipIn, FloatIn, FoldIn, GlideIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

| Tone                | Presets                                  |
| ------------------- | ---------------------------------------- |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn            |
| Playful/Energetic   | BounceIn, SpinIn                         |
| Geometric/Modern    | ShapeIn, RevealIn, ShuttersIn, WinkIn    |

For full parameter details and examples, see [entrance-presets.md](entrance-presets.md).

### Scroll

Animations whose progress is tied to a ViewTimeline -- the element's position in the viewport.

**When to use:** Progressive content reveals on scroll, parallax depth effects, storytelling tied to scroll progress, de-emphasizing passed content

**When NOT to use:** One-time entrance → use entrance (more performant) | Continuous loops → use ongoing

**Available presets:** ArcScroll, BlurScroll, FadeScroll, FlipScroll, GrowScroll, MoveScroll, PanScroll, ParallaxScroll, RevealScroll, ShapeScroll, ShrinkScroll, ShuttersScroll, SkewPanScroll, SlideScroll, Spin3dScroll, SpinScroll, StretchScroll, TiltScroll, TurnScroll

**Scroll range modes:**

- `'in'`: animation ends at the element's idle state (element animates in as it enters)
- `'out'`: animation starts from the element's idle state (element animates out as it exits)
- `'continuous'`: animation passes through the idle state (animates across the full scroll range)

| Effect Type | Presets                                            |
| ----------- | -------------------------------------------------- |
| Opacity     | FadeScroll, BlurScroll                             |
| Movement    | ParallaxScroll, MoveScroll, PanScroll, SlideScroll |
| Scale       | GrowScroll, ShrinkScroll                           |
| 3D Rotation | ArcScroll, FlipScroll, TiltScroll, TurnScroll      |
| Reveal/Mask | RevealScroll, ShapeScroll, ShuttersScroll          |

For full parameter details and examples, see [scroll-presets.md](scroll-presets.md).

### Ongoing

Continuous looping animations that run indefinitely.

**When to use:** Loading/processing indicators, status indicators (live, active, recording), attention-drawing elements (notifications, CTAs), decorative ambient motion

**When NOT to use:** Multiple simultaneous effects (visual chaos) | Content that needs to be read | One-time reveals → use entrance

**Available presets:** Bounce, Breathe, Cross, DVD, Flash, Flip, Fold, Jello, Poke, Pulse, Rubber, Spin, Swing, Wiggle

| Tone                 | Presets                                 |
| -------------------- | --------------------------------------- |
| Subtle/Professional  | Pulse (subtle), Breathe, Flash (subtle) |
| Playful/Energetic    | Bounce, Wiggle, Jello, DVD              |
| Mechanical/Technical | Spin, Flip, Fold                        |
| Attention-grabbing   | Flash, Bounce, Pulse (hard), Poke       |

For full parameter details and examples, see [ongoing-presets.md](ongoing-presets.md).

### Mouse

Effects that respond to cursor position. May behave differently on mobile.

**When to use:** Interactive cards/products (tilt effect), parallax depth with cursor, hero section interactivity, playful/game-like interfaces

**When NOT to use:** Accessibility-critical interfaces | Essential functionality (never rely on mouse for core features)

**Available presets:** AiryMouse, BlobMouse, BlurMouse, BounceMouse, CustomMouse, ScaleMouse, SkewMouse, SpinMouse, SwivelMouse, Tilt3DMouse, Track3DMouse, TrackMouse

| Tone                 | Presets                                      |
| -------------------- | -------------------------------------------- |
| Professional/Premium | Tilt3DMouse (subtle), TrackMouse, ScaleMouse |
| Playful/Fun          | BounceMouse, BlobMouse, AiryMouse            |
| Game-like/Dynamic    | SpinMouse, Track3DMouse, SkewMouse           |

For full parameter details and examples, see [mouse-presets.md](mouse-presets.md).

---

## Parameter Standards

### Effect Options (Not Preset Parameters)

These are set on the effect configuration level, not on the preset itself:

- `duration`: Animation duration in ms (entrance, ongoing)
- `delay`: Animation delay in ms (entrance, ongoing)
- `easing`: Easing function
- `iterations`: Number of iterations
- `alternate`: Alternate direction on each iteration
- `fill`: Animation fill mode
- `reversed`: Reverse the animation

**Scroll-specific effect options:**

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

Prefer the object notation. In any case, be consistent within a configuration -- use one format, not both.

### Coordinate System

For angle-based parameters:

- **0°** = right (east)
- **90°** = top (north)
- **180°** = left (west)
- **270°** = bottom (south)

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

### Trigger and Effect Binding

In the simplest case, a trigger and its effect are bound to the same element. However, an effect on one element can also be triggered by another element (e.g., hovering a button triggers a FadeIn on a sibling panel).

---

## Selection Tables

### By Tone

| Tone                | Entrance                                 | Scroll                                    | Ongoing                    | Mouse                            |
| ------------------- | ---------------------------------------- | ----------------------------------------- | -------------------------- | -------------------------------- |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn | FadeScroll, BlurScroll                    | Pulse (subtle), Breathe    | Tilt3DMouse (subtle), TrackMouse |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn            | ArcScroll, FlipScroll, TiltScroll         | Flip, Fold                 | Track3DMouse                     |
| Playful/Energetic   | BounceIn, SpinIn                         | SpinScroll, Spin3dScroll                  | Bounce, Wiggle, Jello, DVD | BounceMouse, BlobMouse           |
| Geometric/Modern    | ShapeIn, RevealIn, ShuttersIn, WinkIn    | ShapeScroll, RevealScroll, ShuttersScroll | Cross                      | -                                |

### By Use Case

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

### Cross-Category Parallels

Effects with similar visual results across categories:

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

---

## Combining Effects

1. Avoid mixing multiple effects on the same element at the same time when possible
2. Never combine effects that affect the same CSS properties (e.g., two effects both using `transform`)
3. When combining is necessary, effect order matters -- later effects may override earlier ones
4. If possible, use nested containers to separate effects that would conflict -- place each effect on a separate wrapper element. Note: here also order matters

### Common Patterns

**Card reveal on scroll:**

```typescript
{ type: 'FadeScroll', range: 'in' }
```

**Interactive product card (nested containers):**

```typescript
// Outer container - entrance
{ type: 'FadeIn' }
// Inner container - mouse interaction
{ type: 'Tilt3DMouse', angle: 25, perspective: 1000 }
```

**Notification badge:**

```typescript
{ type: 'BounceIn', direction: 'top', distanceFactor: 1 }
{ type: 'Pulse', intensity: 0.5 }
```

**Loading indicator:**

```typescript
{ type: 'Spin', direction: 'clockwise' }
```

---

## Accessibility

### Host vs Preset Responsibility

The presets generally provide animations; the host platform decides when/whether to apply them.

Interact supports `conditions` in the config for handling reduced motion. Define a media condition for `(prefers-reduced-motion: reduce)` and use it to swap high-risk presets for safer alternatives (e.g., SpinIn → FadeIn, BounceIn → FadeIn). Conditions can be applied per-interaction or per-effect, and automatically re-evaluate when the user's preference changes.

If it is known that the host handles accessibility globally (e.g., disabling all animations on `(prefers-reduced-motion: reduce)`), presets don't need to address it separately.

### Preset Risk Levels

_Note:_ this section should be confirmed by an a11y expert

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

1. **Do not limit creativity by default** -- generate what the user asks for
2. **Apply constraints only when explicitly requested** -- keywords: "accessible", "a11y", "reduced motion safe", "subtle", "tone down"
3. **High-risk presets are informational, not blockers** -- optionally note vestibular concerns in response
4. **Mouse presets may behave differently on mobile** -- note this as context, not a restriction
5. **Duration guidelines are suggestions** -- functional UI <500ms, decorative up to 1200ms, hero up to 2000ms
