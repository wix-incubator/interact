---
name: Motion Presets Reference
description: Comprehensive LLM reference for Interact motion presets
---

# Motion Presets Reference

## 1. Intro

This document is a comprehensive reference for Interact motion presets. Use it to select and configure animations based on user requirements.

### Decision Flow

1. **Select Trigger** - What causes the animation? (viewport entry, scroll position, mouse, continuous loop)
2. **Select Preset** - Which visual effect matches the intent?
3. **Configure Parameters** - Customize direction, power, timing, etc.

### Quick Trigger Lookup

| User Intent                                                          | Trigger           | Notes                                     |
| -------------------------------------------------------------------- | ----------------- | ----------------------------------------- |
| "animate when element enters viewport", "reveal on scroll into view" | entrance          | viewEnter trigger (intersection observer) |
| "animate based on scroll position", "parallax", "scroll-driven"      | scroll            | Tied to scroll progress                   |
| "always moving", "pulsing", "loading spinner", "continuous loop"     | ongoing           | Runs indefinitely                         |
| "react to mouse", "follow cursor", "tilt on hover"                   | mouse             | Desktop only                              |
| "background image effect", "hero background", "parallax bg"          | background-scroll | CSS backgrounds only                      |

---

## 2. Triggers

### Entrance

One-shot animations that play once when an element first enters the viewport.

**Trigger mechanism:** Uses the `viewEnter` trigger (intersection observer). Plays once when element first scrolls into view.

**When to use:**

- Element reveals on viewport entry
- First-time visibility animations

**When NOT to use:**

- Scroll-driven reveals → use scroll
- Continuous/looping → use ongoing
- Mouse-reactive → use mouse

**Note:** For click, toggle, or other event-based triggers, implement the triggering logic separately and call the animation programmatically. The library only provides viewEnter as a built-in trigger for entrance animations.

**Available presets:** FadeIn, ArcIn, BlurIn, BounceIn, CircleIn, CurveIn, DropIn, ExpandIn, FlipIn, FloatIn, FoldIn, GlideIn, GlitchIn, GrowIn, PunchIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

### Scroll

Animations tied to scroll position. Can animate in, out, or continuously throughout scroll range.

**When to use:**

- Progressive content reveals on scroll
- Parallax depth effects
- Storytelling tied to scroll progress
- De-emphasizing passed content

**When NOT to use:**

- One-time entrance → use entrance (more performant)
- Continuous loops → use ongoing
- Background images → use background-scroll

**Available presets:** ArcScroll, BlurScroll, FadeScroll, FlipScroll, GrowScroll, MoveScroll, PanScroll, ParallaxScroll, RevealScroll, ShapeScroll, ShrinkScroll, ShuttersScroll, SkewPanScroll, SlideScroll, Spin3dScroll, SpinScroll, StretchScroll, TiltScroll, TurnScroll

### Ongoing

Continuous looping animations that run indefinitely.

**When to use:**

- Loading/processing indicators
- Status indicators (live, active, recording)
- Attention-drawing elements (notifications, CTAs)
- Decorative ambient motion

**When NOT to use:**

- Multiple simultaneous animations (visual chaos)
- Content that needs to be read
- Professional/minimal interfaces
- One-time reveals → use entrance

**Available presets:** Pulse, Bounce, Spin, Breathe, Flash, Swing, Wiggle, Flip, Fold, Jello, Rubber, Poke, Cross, DVD

### Mouse

Animations that respond to cursor position. Desktop-only.

**When to use:**

- Interactive cards/products (tilt effect)
- Parallax depth with cursor
- Hero section interactivity
- Playful/game-like interfaces

**When NOT to use:**

- Mobile-first designs (won't work on touch)
- Accessibility-critical interfaces
- Essential functionality (never rely on mouse for core features)

**Available presets:** Tilt3DMouse, TrackMouse, BounceMouse, Track3DMouse, SpinMouse, ScaleMouse, SwivelMouse, SkewMouse, BlurMouse, AiryMouse, BlobMouse, CustomMouse

### Background Scroll

Scroll animations for structured background media components. Animates DOM elements via CSS transforms (not `background-position`).

**Requires `data-motion-part` attributes:** `BG_LAYER`, `BG_MEDIA`, `BG_IMG`

**When to use:**

- Hero sections with background depth
- Full-width section backgrounds with `data-motion-part` structure

**When NOT to use:**

- Regular content elements → use scroll
- Elements without `data-motion-part` structure
- Simple CSS `background-image` (no DOM structure)

**Available presets:** BgParallax, BgZoom, BgFade, BgFadeBack, BgPan, BgRotate, BgSkew, BgReveal, BgCloseUp, BgPullBack, BgFake3D, ImageParallax

**Note:** `ImageParallax` works on regular `<img>` elements without `data-motion-part` structure.

---

## Common Parameters

### Shared by All Entrance Presets

- `duration`: 0-4000ms (default: 1200) - animation length
- `delay`: 0-8000ms (default: 0) - wait before starting

### Shared by Most Scroll Presets

- `range`: 'in' | 'out' | 'continuous' - when animation occurs relative to viewport
- `start`: 0-100% - scroll position to start animation
- `end`: 0-100% - scroll position to end animation

### Shared by Most Ongoing Presets

- `duration`: 100-4000ms - single cycle length
- `delay`: 0-8000ms - initial wait before looping starts

### The `power` Parameter

Many presets support `power: 'soft' | 'medium' | 'hard'`.

**Important:** `power` is a preset modifier that **overrides** fine-grained parameters when set.

- When `power` is provided, it sets predefined values for rotation angles, distances, scale factors, and easing curves
- For fine control, **omit `power`** and use specific parameters like `intensity`, `distanceFactor`, `initialRotate`, etc.
- Pattern: if `power` is set, specific params are ignored

```typescript
// power overrides other params
{ type: 'BounceIn', power: 'hard' }           // Uses hard preset (distanceFactor: 3)
{ type: 'BounceIn', distanceFactor: 2.5 }     // Fine control (no power)
{ type: 'BounceIn', power: 'hard', distanceFactor: 2.5 }  // power wins, distanceFactor ignored
```

---

## 3. Trigger-Preset Relations

### By Tone

| Tone                | Entrance                                        | Scroll                                    | Ongoing                    | Mouse                          |
| ------------------- | ----------------------------------------------- | ----------------------------------------- | -------------------------- | ------------------------------ |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn        | FadeScroll, BlurScroll                    | Pulse (soft), Breathe      | Tilt3DMouse (soft), TrackMouse |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn, ExpandIn         | ArcScroll, FlipScroll, TiltScroll         | Flip, Fold                 | Track3DMouse                   |
| Playful/Energetic   | BounceIn, SpinIn, PunchIn, GlitchIn             | SpinScroll, Spin3dScroll                  | Bounce, Wiggle, Jello, DVD | BounceMouse, BlobMouse         |
| Geometric/Modern    | CircleIn, ShapeIn, RevealIn, ShuttersIn, WinkIn | ShapeScroll, RevealScroll, ShuttersScroll | Cross                      | -                              |

### By Use Case

| Use Case               | Recommended Presets                                     |
| ---------------------- | ------------------------------------------------------- |
| Hero sections          | ArcIn, ExpandIn, FloatIn, RevealIn + BgParallax, BgZoom |
| Modals/Popups          | FadeIn, DropIn, GrowIn, SlideIn                         |
| List items (staggered) | FadeIn, SlideIn, GlideIn with increasing delay          |
| Cards                  | FlipIn, ArcIn, TiltIn + FadeScroll (in/out)             |
| Notifications/Badges   | BounceIn, PunchIn, DropIn + Pulse                       |
| CTAs/Buttons           | BounceIn, PunchIn, GrowIn + Pulse                       |
| Loading indicators     | Spin, Pulse                                             |
| Product images         | Tilt3DMouse, ScaleMouse                                 |
| Background depth       | BgParallax, ParallaxScroll, TrackMouse (layered)        |

### Cross-Category Parallels

Effects with similar visual results across triggers:

| Entrance | Scroll         | Ongoing | Mouse       | Background |
| -------- | -------------- | ------- | ----------- | ---------- |
| FadeIn   | FadeScroll     | Flash   | -           | BgFade     |
| ArcIn    | ArcScroll      | -       | -           | -          |
| SpinIn   | SpinScroll     | Spin    | SpinMouse   | BgRotate   |
| BounceIn | -              | Bounce  | BounceMouse | -          |
| TiltIn   | TiltScroll     | -       | Tilt3DMouse | -          |
| FlipIn   | FlipScroll     | Flip    | -           | -          |
| GrowIn   | GrowScroll     | Pulse   | ScaleMouse  | BgZoom     |
| SlideIn  | SlideScroll    | -       | TrackMouse  | BgPan      |
| BlurIn   | BlurScroll     | -       | BlurMouse   | -          |
| RevealIn | RevealScroll   | -       | -           | BgReveal   |
| -        | ParallaxScroll | -       | TrackMouse  | BgParallax |

### Combining Triggers

**On a single element (natively supported):**

- **Entrance + Ongoing only**: Element can have both entrance and ongoing animations
  - Example: BounceIn on viewport entry, then Pulse continuously

**Requires multiple containers (nested elements):**

- Entrance + Mouse
- Entrance + Scroll
- Scroll + Mouse
- Any other combination

These require nested elements with each animation on a separate container. Layout must ensure inner container can animate independently of outer.

**Multi-element patterns:**

- **Scroll + Background**: Content element uses FadeScroll, separate background element uses BgParallax
- **Layered parallax**: Multiple sibling elements with TrackMouse at different distances

---

## 4. Presets

### Entrance Presets

#### FadeIn

Visual: Element transitions from invisible to visible. Simple opacity change, no movement.

Parameters:

- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'FadeIn' }
{ type: 'FadeIn', duration: 300 }  // Quick functional fade
```

#### ArcIn

Visual: Element swings in along a curved 3D path, like a door opening. Dramatic, cinematic.

Parameters:

- `direction`: top | right | bottom | left (default: left)
- `power`: soft | medium | hard (default: medium)

**When `power` is set:** controls rotation intensity and easing curve

```typescript
{ type: 'ArcIn', direction: 'bottom' }
{ type: 'ArcIn', direction: 'left', power: 'hard' }  // Dramatic hero entrance
```

#### BlurIn

Visual: Element transitions from blurry to sharp focus while fading in. Soft, dreamy.

Parameters:

- `blur`: blur amount in px (default varies)
- `power`: soft | medium | hard

**When `power` is set:** overrides `blur` (soft=6, medium=25, hard=50)

```typescript
{ type: 'BlurIn' }
{ type: 'BlurIn', power: 'soft' }
{ type: 'BlurIn', blur: 15 }  // Custom blur, no power
```

#### BounceIn

Visual: Element bounces into view with spring physics. Playful, attention-grabbing.

Parameters:

- `direction`: top | right | bottom | left | center (default: top)
- `power`: soft | medium | hard (default: soft)
- `distanceFactor`: 1-4 (default: 1)

**When `power` is set:** overrides `distanceFactor` (soft=1, medium=2, hard=3)

```typescript
{ type: 'BounceIn' }
{ type: 'BounceIn', direction: 'center', power: 'medium' }  // Reward popup
{ type: 'BounceIn', distanceFactor: 2.5 }  // Custom distance, no power
```

#### CircleIn

Visual: Circular mask expanding from center to reveal element. Geometric, spotlight-like.

Parameters:

- `direction`: in | out (default: in)
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'CircleIn', direction: 'in' }
```

#### CurveIn

Visual: Alternative curved 3D motion path. Similar to ArcIn with different trajectory.

Parameters:

- `direction`: left | right
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'CurveIn', direction: 'left' }
```

#### DropIn

Visual: Falls from above with subtle scale/bounce on landing. Gravity-like, natural.

Parameters:

- `power`: soft | medium | hard
- `initialScale`: starting scale (default varies)

**When `power` is set:** overrides `initialScale` and easing (soft: 1.2/cubicInOut, medium: 1.6/quintInOut, hard: 2/backOut)

```typescript
{ type: 'DropIn' }
{ type: 'DropIn', power: 'medium' }
```

#### ExpandIn

Visual: Expands outward from a point. Growing, revealing emergence.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `power`: soft | medium | hard
- `initialScale`: starting scale

**When `power` is set:** controls scale and easing intensity

```typescript
{ type: 'ExpandIn', direction: 'center' }
{ type: 'ExpandIn', direction: 'bottom-left', power: 'hard' }
```

#### FlipIn

Visual: 3D card flip rotation to reveal element. Dramatic, card-like metaphor.

Parameters:

- `direction`: top | right | bottom | left
- `power`: soft | medium | hard
- `initialRotate`: starting rotation degrees

**When `power` is set:** overrides `initialRotate` (soft=45, medium=90, hard=270)

```typescript
{ type: 'FlipIn', direction: 'left' }
{ type: 'FlipIn', direction: 'top', power: 'hard' }
```

#### FloatIn

Visual: Gentle floating/drifting entrance. Ethereal, light, dreamy.

Parameters:

- `direction`: top | right | bottom | left
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'FloatIn', direction: 'bottom' }
```

#### FoldIn

Visual: Paper-folding 3D effect. Origami-like, creative.

Parameters:

- `direction`: top | right | bottom | left
- `power`: soft | medium | hard
- `initialRotate`: starting rotation degrees

**When `power` is set:** overrides `initialRotate` (soft=35, medium=60, hard=90)

```typescript
{ type: 'FoldIn', direction: 'left' }
```

#### GlideIn

Visual: Smooth 2D glide from direction with angle control. Clean, directional.

Parameters:

- `direction`: angle in degrees (0-360)
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `power`: soft | medium | hard
- `startFromOffScreen`: boolean

**When `power` is set:** controls easing curve intensity

```typescript
{ type: 'GlideIn', direction: 180, distance: { value: 100, type: 'px' } }
```

#### GlitchIn

Visual: Digital glitch/distortion effect. Edgy, tech-inspired.

Parameters:

- `direction`: angle in degrees
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `power`: soft | medium | hard
- `startFromOffScreen`: boolean

**When `power` is set:** controls glitch intensity

```typescript
{ type: 'GlitchIn', direction: 0, distance: { value: 50, type: 'px' } }
```

#### GrowIn

Visual: Scale from small to full size. Expanding, emerging.

Parameters:

- `direction`: angle in degrees
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `power`: soft | medium | hard
- `initialScale`: starting scale (0-1)

**When `power` is set:** controls scale and easing intensity

```typescript
{ type: 'GrowIn', direction: 0, distance: { value: 0, type: 'px' } }
```

#### PunchIn

Visual: Corner-based scale with energy and impact. Punchy, attention-grabbing.

Parameters:

- `direction`: top-left | top-right | bottom-left | bottom-right | center
- `power`: soft | medium | hard

**When `power` is set:** controls easing curve (soft=sineIn, medium=quadIn, hard=quintIn)

```typescript
{ type: 'PunchIn', direction: 'center' }
{ type: 'PunchIn', direction: 'bottom-right', power: 'hard' }
```

#### RevealIn

Visual: Directional clip/mask reveal like a curtain opening. Theatrical.

Parameters:

- `direction`: top | right | bottom | left
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'RevealIn', direction: 'left' }
```

#### ShapeIn

Visual: Shape mask reveal (circle, square, diamond, etc.). Geometric, precise.

Parameters:

- `shape`: circle | ellipse | rectangle | diamond | window
- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'ShapeIn', shape: 'circle', direction: 'center' }
{ type: 'ShapeIn', shape: 'diamond', direction: 'top' }
```

#### ShuttersIn

Visual: Venetian blind strip reveal. Segmented, rhythmic.

Parameters:

- `direction`: top | right | bottom | left
- `shutters`: number of strips
- `staggered`: boolean (animate strips sequentially)
- `power`: soft | medium | hard

**When `power` is set:** controls easing curve intensity

```typescript
{ type: 'ShuttersIn', direction: 'left', shutters: 5, staggered: true }
```

#### SlideIn

Visual: Straight movement from direction. Clean, simple, versatile.

Parameters:

- `direction`: top | right | bottom | left
- `power`: soft | medium | hard
- `initialTranslate`: starting offset

**When `power` is set:** controls easing curve intensity

```typescript
{ type: 'SlideIn', direction: 'bottom' }
{ type: 'SlideIn', direction: 'left', power: 'soft' }
```

#### SpinIn

Visual: Rotating entrance with spin. Dynamic, playful.

Parameters:

- `direction`: clockwise | counter-clockwise
- `spins`: number of rotations
- `power`: soft | medium | hard
- `initialScale`: starting scale

**When `power` is set:** controls easing curve intensity

```typescript
{ type: 'SpinIn', direction: 'clockwise', spins: 1 }
```

#### TiltIn

Visual: 3D tilt into view. Subtle depth, elegant perspective.

Parameters:

- `direction`: left | right
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'TiltIn', direction: 'left' }
```

#### TurnIn

Visual: Corner-pivot 3D rotation. Complex, dramatic, premium.

Parameters:

- `direction`: top-left | top-right | bottom-left | bottom-right
- `power`: soft | medium | hard
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'TurnIn', direction: 'bottom-left' }
```

#### WinkIn

Visual: Split-in-half reveal from center. Unique, eye-like opening.

Parameters:

- `direction`: vertical | horizontal
- `duration`: 0-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{ type: 'WinkIn', direction: 'vertical' }
```

---

### Scroll Presets

#### ParallaxScroll

Visual: Element moves slower/faster than scroll, creating depth illusion.

Parameters:

- `speed`: -1 to 1 (default: 0.5) — positive = same direction, slower; negative = opposite direction
- `range`: continuous

```typescript
{ type: 'ParallaxScroll' }
{ type: 'ParallaxScroll', speed: 0.3 }  // Subtle depth
{ type: 'ParallaxScroll', speed: -0.2 }  // Reverse parallax
```

#### FadeScroll

Visual: Opacity transition tied to scroll. Fade in on enter, out on exit.

Parameters:

- `range`: in | out (required)
- `opacity`: 0-1 (the "other" opacity value)
- `start`: 0-100% scroll position
- `end`: 0-100% scroll position

```typescript
{ type: 'FadeScroll', range: 'in' }
{ type: 'FadeScroll', range: 'out' }
{ type: 'FadeScroll', range: 'in', start: 0, end: 30 }  // Quick fade
```

#### ArcScroll

Visual: 3D tilt/rotation as user scrolls. Dramatic, cinematic.

Parameters:

- `direction`: vertical | horizontal
- `range`: in | out | continuous

```typescript
{ type: 'ArcScroll', direction: 'vertical' }
{ type: 'ArcScroll', direction: 'horizontal', range: 'in' }
```

#### BlurScroll

Visual: Blur/unblur effect controlled by scroll. Focus transitions.

Parameters:

- `power`: soft | medium | hard
- `range`: in | out | continuous
- `blur`: blur amount in px

**When `power` is set:** overrides `blur` (soft=6, medium=25, hard=50)

```typescript
{ type: 'BlurScroll', range: 'in' }
{ type: 'BlurScroll', range: 'out', power: 'medium' }
```

#### FlipScroll

Visual: Full 3D card flip driven by scroll. Dramatic rotation.

Parameters:

- `direction`: vertical | horizontal
- `power`: soft | medium | hard
- `range`: in | out | continuous
- `rotate`: rotation degrees

**When `power` is set:** overrides `rotate` (soft=60, medium=120, hard=420)

```typescript
{ type: 'FlipScroll', direction: 'horizontal' }
{ type: 'FlipScroll', direction: 'vertical', range: 'in' }
```

#### GrowScroll

Visual: Scale up as element enters viewport.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `power`: soft | medium | hard
- `range`: in | out | continuous
- `scale`: target scale
- `speed`: animation speed

**When `power` is set:** overrides scale range (soft: 0.8-1.2, medium: 0.3-1.7, hard: 0-4)

```typescript
{ type: 'GrowScroll', direction: 'center' }
{ type: 'GrowScroll', direction: 'center', range: 'in' }
```

#### ShrinkScroll

Visual: Scale down as element exits viewport.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `power`: soft | medium | hard
- `range`: in | out | continuous
- `scale`: target scale
- `speed`: animation speed

**When `power` is set:** overrides scale range (soft: 1.2-0.8, medium: 1.7-0.3, hard: 3.5-0)

```typescript
{ type: 'ShrinkScroll', direction: 'center', range: 'out' }
```

#### MoveScroll

Visual: Translation movement on scroll in any direction.

Parameters:

- `angle`: 0-360 degrees
- `power`: soft | medium | hard
- `range`: in | out | continuous
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }

**When `power` is set:** overrides `distance` (soft=150px, medium=400px, hard=800px)

```typescript
{ type: 'MoveScroll', angle: 90, distance: { value: 100, type: 'px' } }
```

#### PanScroll

Visual: Horizontal or vertical panning tied to scroll.

Parameters:

- `direction`: left | right
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `startFromOffScreen`: boolean
- `range`: in | out | continuous

```typescript
{ type: 'PanScroll', direction: 'left', distance: { value: 200, type: 'px' }, startFromOffScreen: false }
```

#### RevealScroll

Visual: Clip-based directional reveal on scroll.

Parameters:

- `direction`: top | right | bottom | left
- `range`: in | out | continuous

```typescript
{ type: 'RevealScroll', direction: 'left' }
{ type: 'RevealScroll', direction: 'bottom', range: 'in' }
```

#### ShapeScroll

Visual: Shape mask reveal controlled by scroll.

Parameters:

- `shape`: circle | ellipse | rectangle | diamond | window
- `range`: in | out | continuous
- `power`: soft | medium | hard
- `intensity`: 0-1

**When `power` is set:** overrides clipPath intensity (varies by shape)

```typescript
{ type: 'ShapeScroll', shape: 'circle' }
```

#### ShuttersScroll

Visual: Venetian blind strips revealing on scroll.

Parameters:

- `direction`: top | right | bottom | left
- `shutters`: number of strips
- `staggered`: boolean
- `range`: in | out | continuous

```typescript
{ type: 'ShuttersScroll', direction: 'left', shutters: 5, staggered: true }
```

#### SkewPanScroll

Visual: Panning with skew distortion effect.

Parameters:

- `direction`: left | right
- `range`: in | out | continuous
- `power`: soft | medium | hard
- `skew`: skew angle

**When `power` is set:** overrides `skew` (soft=10, medium=17, hard=24)

```typescript
{ type: 'SkewPanScroll', direction: 'left' }
```

#### SlideScroll

Visual: Slide movement tied to scroll position.

Parameters:

- `direction`: top | right | bottom | left
- `range`: in | out | continuous

```typescript
{ type: 'SlideScroll', direction: 'bottom' }
{ type: 'SlideScroll', direction: 'left', range: 'in' }
```

#### Spin3dScroll

Visual: 3D rotation around axis on scroll.

Parameters:

- `range`: in | out | continuous
- `power`: soft | medium | hard
- `rotate`: rotation degrees
- `speed`: animation speed

**When `power` is set:** overrides rotation and travel (soft: 45deg/0, medium: 100deg/0.5, hard: 200deg/1)

```typescript
{ type: 'Spin3dScroll' }
{ type: 'Spin3dScroll', range: 'continuous' }
```

#### SpinScroll

Visual: 2D rotation driven by scroll.

Parameters:

- `direction`: clockwise | counter-clockwise
- `spins`: number of rotations
- `range`: in | out | continuous
- `power`: soft | medium | hard
- `scale`: scale factor

**When `power` is set:** overrides `scale` (soft=1, medium=0.7, hard=0.4)

```typescript
{ type: 'SpinScroll', direction: 'clockwise', spins: 1 }
```

#### StretchScroll

Visual: Stretch/squeeze deformation on scroll.

Parameters:

- `power`: soft | medium | hard
- `range`: in | out | continuous
- `stretch`: stretch amount

**When `power` is set:** overrides scaleX/scaleY (soft: 0.8/1.2, medium: 0.6/1.5, hard: 0.4/2)

```typescript
{ type: 'StretchScroll' }
{ type: 'StretchScroll', power: 'medium' }
```

#### TiltScroll

Visual: 3D tilt effect as user scrolls. Subtle perspective.

Parameters:

- `direction`: left | right
- `range`: in | out | continuous
- `power`: soft | medium | hard
- `distance`: tilt distance

**When `power` is set:** overrides `distance` (soft=0, medium=0.5, hard=1)

```typescript
{ type: 'TiltScroll', direction: 'left' }
```

#### TurnScroll

Visual: Corner-pivot 3D rotation on scroll.

Parameters:

- `direction`: left | right
- `spin`: clockwise | counter-clockwise
- `range`: in | out | continuous
- `power`: soft | medium | hard
- `scale`: scale factor

**When `power` is set:** overrides scale range (soft: 1/1, medium: 0.7/1.3, hard: 0.4/1.6)

```typescript
{ type: 'TurnScroll', direction: 'left', spin: 'clockwise' }
```

---

### Ongoing Presets

#### Pulse

Visual: Gentle scale oscillation, heartbeat-like rhythm. Subtle, universal.

Parameters:

- `power`: soft | medium | hard (default: soft)
- `intensity`: 0-1 (default: 0)

**When `power` is set:** overrides `intensity`/pulse magnitude (soft=0, medium=0.06, hard=0.12)

```typescript
{ type: 'Pulse' }
{ type: 'Pulse', power: 'medium' }  // Status indicator
{ type: 'Pulse', intensity: 0.04 }  // Custom intensity, no power
```

#### Bounce

Visual: Vertical bouncing motion like a ball on trampoline. Playful, energetic.

Parameters:

- `power`: soft | medium | hard (default: soft)
- `intensity`: 0-1 (default: 0.3)

**When `power` is set:** overrides `intensity`/bounce factor (soft=1, medium=2, hard=3)

```typescript
{ type: 'Bounce' }
{ type: 'Bounce', power: 'medium' }  // Playful mascot
```

#### Spin

Visual: Continuous rotation around center. Mechanical, precise.

Parameters:

- `direction`: clockwise | counter-clockwise (default: clockwise)
- `power`: soft | medium | hard (default: soft)

**When `power` is set:** controls easing curve (linear → eased → bouncy)

```typescript
{ type: 'Spin', direction: 'clockwise' }
{ type: 'Spin', direction: 'clockwise', duration: 1500 }  // Loading spinner
```

#### Breathe

Visual: Slow scale in/out like breathing. Calm, organic, meditative.

Parameters:

- `direction`: vertical | horizontal | center
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }

```typescript
{ type: 'Breathe', direction: 'center', distance: { value: 10, type: 'percentage' } }
```

#### Flash

Visual: Opacity pulsing/blinking. Attention, warning indicator.

Parameters:

- `duration`: 100-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{
  type: 'Flash';
}
```

#### Swing

Visual: Rotation oscillation like a pendulum. Back and forth rhythmic.

Parameters:

- `power`: soft | medium | hard
- `swing`: swing angle
- `direction`: top | right | bottom | left

**When `power` is set:** overrides `swing` angle (soft: 20deg, medium: 40deg, hard: 60deg)

```typescript
{ type: 'Swing' }
{ type: 'Swing', power: 'medium' }
```

#### Wiggle

Visual: Horizontal shake/wiggle. Side-to-side for attention.

Parameters:

- `power`: soft | medium | hard
- `intensity`: 0-1

**When `power` is set:** overrides `intensity`/wiggle factor (soft=1, medium=2, hard=4)

```typescript
{ type: 'Wiggle' }
{ type: 'Wiggle', power: 'soft' }
```

#### Flip

Visual: Periodic 180° flips. Card-like rotation showing front/back.

Parameters:

- `direction`: vertical | horizontal
- `power`: soft | medium | hard

**When `power` is set:** controls easing curve intensity

```typescript
{ type: 'Flip', direction: 'horizontal' }
```

#### Fold

Visual: 3D folding motion. Paper-like folding and unfolding.

Parameters:

- `direction`: top | right | bottom | left
- `power`: soft | medium | hard
- `angle`: fold angle

**When `power` is set:** overrides `angle` (soft: 15deg, medium: 30deg, hard: 45deg)

```typescript
{ type: 'Fold', direction: 'left' }
```

#### Jello

Visual: Wobbly elastic deformation. Jiggly, bouncy distortion.

Parameters:

- `power`: soft | medium | hard
- `intensity`: 0-1

**When `power` is set:** overrides `intensity`/jello factor (soft=1, medium=2, hard=4)

```typescript
{ type: 'Jello' }
{ type: 'Jello', power: 'medium' }
```

#### Rubber

Visual: Elastic stretch effect. Springy stretching and snapping.

Parameters:

- `power`: soft | medium | hard
- `intensity`: 0-1

**When `power` is set:** overrides `intensity`/rubber offset (soft=0, medium=0.05, hard=0.1)

```typescript
{
  type: 'Rubber';
}
```

#### Poke

Visual: Quick scale bump like being tapped. Brief attention "boop".

Parameters:

- `direction`: top | right | bottom | left
- `power`: soft | medium | hard
- `intensity`: 0-1

**When `power` is set:** overrides `intensity`/poke factor (soft=1, medium=2, hard=4)

```typescript
{ type: 'Poke', direction: 'top' }
```

#### Cross

Visual: X-pattern diagonal movement. Unique geometric motion.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right

```typescript
{ type: 'Cross', direction: 'top-left' }
```

#### DVD

Visual: Corner-to-corner bounce (DVD screensaver). Nostalgic, retro.

Parameters:

- `power`: soft | medium | hard
- `duration`: 100-4000ms (default: 1200)
- `delay`: 0-8000ms (default: 0)

```typescript
{
  type: 'DVD';
}
```

---

### Mouse Presets

#### Tilt3DMouse

Visual: Element tilts toward cursor in 3D, like angling a card. Premium, interactive.

Parameters:

- `power`: soft | medium | hard (default: medium)
- `angle`: 5-85 degrees (default: 50)
- `perspective`: 200-1000px (default: 800)
- `inverted`: boolean (default: false)

**When `power` is set:** overrides `angle` and `perspective` (soft: 25/1000, medium: 50/500, hard: 85/200)

```typescript
{ type: 'Tilt3DMouse' }
{ type: 'Tilt3DMouse', power: 'soft' }  // Subtle professional
{ type: 'Tilt3DMouse', angle: 15, perspective: 1000 }  // Custom, no power
```

#### TrackMouse

Visual: Element follows cursor position. Floating, parallax-like.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' } (default: { value: 250, type: 'px' })
- `axis`: horizontal | vertical | both (default: both)
- `power`: soft | medium | hard (default: medium)
- `inverted`: boolean (default: false)

**When `power` is set:** overrides easing (soft=linear, medium=easeOut, hard=hardBackOut)

```typescript
{ type: 'TrackMouse', distance: { value: 200, type: 'px' }, axis: 'both' }
{ type: 'TrackMouse', distance: { value: 50, type: 'px' }, axis: 'horizontal' }  // Background layer
```

#### BounceMouse

Visual: Bouncy/elastic cursor following. Overshoots and wobbles.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' } (default: { value: 80, type: 'px' })
- `axis`: horizontal | vertical | both (default: both)
- `power`: soft | medium | hard
- `inverted`: boolean (default: false)

**When `power` is set:** controls spring easing behavior

```typescript
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both' }
```

#### Track3DMouse

Visual: Combined translation + 3D rotation following mouse. Complex, immersive.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `angle`: rotation angle
- `axis`: horizontal | vertical | both
- `perspective`: perspective distance
- `power`: soft | medium | hard
- `inverted`: boolean

**When `power` is set:** overrides `angle` and `perspective` (soft: 25/1000, medium: 50/500, hard: 85/333)

```typescript
{ type: 'Track3DMouse', distance: { value: 100, type: 'px' }, axis: 'both' }
```

#### SpinMouse

Visual: Rotation following mouse angle. Element spins based on cursor position.

Parameters:

- `axis`: horizontal | vertical | both
- `power`: soft | medium | hard
- `inverted`: boolean

**When `power` is set:** controls rotation intensity and easing

```typescript
{ type: 'SpinMouse' }
{ type: 'SpinMouse', axis: 'both' }
```

#### ScaleMouse

Visual: Scale based on cursor distance. Grows/shrinks by proximity.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `axis`: horizontal | vertical | both
- `scale`: scale factor
- `power`: soft | medium | hard
- `scaleDirection`: in | out
- `inverted`: boolean

**When `power` is set:** overrides `scale` (varies by scaleDirection - down: 0.85/0.5/0, up: 1.2/1.6/2.4)

```typescript
{ type: 'ScaleMouse', distance: { value: 100, type: 'px' }, scaleDirection: 'in' }
```

#### SwivelMouse

Visual: Z-axis rotation following cursor. Gyroscope-like vertical rotation.

Parameters:

- `angle`: rotation angle
- `perspective`: perspective distance
- `pivotAxis`: top | bottom | right | left | center-horizontal | center-vertical
- `power`: soft | medium | hard
- `inverted`: boolean

**When `power` is set:** overrides `angle` and `perspective` (soft: 25/1000, medium: 50/700, hard: 85/300)

```typescript
{
  type: 'SwivelMouse';
}
```

#### SkewMouse

Visual: Skew distortion following cursor. Angular distortion.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `angle`: skew angle
- `axis`: horizontal | vertical | both
- `power`: soft | medium | hard
- `inverted`: boolean

**When `power` is set:** overrides `angle` (soft=10, medium=20, hard=45)

```typescript
{
  type: 'SkewMouse';
}
```

#### BlurMouse

Visual: Blur based on cursor distance. Focus/defocus by proximity.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `angle`: angle
- `scale`: scale factor
- `blur`: blur amount
- `perspective`: perspective distance
- `power`: soft | medium | hard
- `inverted`: boolean

**When `power` is set:** overrides `angle` and `scale` (soft: 0/1, medium: 25/0.7, hard: 65/0.25)

```typescript
{
  type: 'BlurMouse';
}
```

#### AiryMouse

Visual: Floating/airy cursor response. Ethereal, gentle drift.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `axis`: horizontal | vertical | both
- `angle`: angle
- `power`: soft | medium | hard
- `inverted`: boolean

**When `power` is set:** overrides `angle` (soft=10, medium=50, hard=85)

```typescript
{
  type: 'AiryMouse';
}
```

#### BlobMouse

Visual: Organic blob-like deformation. Fluid shape distortion.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `scale`: scale factor
- `power`: soft | medium | hard
- `inverted`: boolean

**When `power` is set:** overrides `scale` (soft=1.2, medium=1.6, hard=2.4)

```typescript
{
  type: 'BlobMouse';
}
```

#### CustomMouse

Visual: Configurable custom behavior. For advanced custom implementations.

```typescript
{
  type: 'CustomMouse';
}
```

---

### Background Scroll Presets

**Requires DOM structure with `data-motion-part` attributes** (`BG_LAYER`, `BG_MEDIA`, `BG_IMG`). See [Background Scroll trigger](#background-scroll) for structure details.

#### BgParallax

Visual: Background moves slower than scroll, creating depth. Most common bg effect.

Parameters:

- `speed`: 0.05-0.95 (default: 0.2) — lower = further away feeling

```typescript
{ type: 'BgParallax' }
{ type: 'BgParallax', speed: 0.4 }  // Noticeable depth
```

#### BgZoom

Visual: Background zooms in/out as user scrolls. Cinematic dolly effect.

Parameters:

- `direction`: in | out (default: in)
- `zoom`: 0.1-10 (default: 10) — start lower for subtle effect

```typescript
{ type: 'BgZoom', direction: 'in' }
{ type: 'BgZoom', direction: 'in', zoom: 3 }  // Subtle zoom
```

#### BgFade

Visual: Background opacity changes on scroll. Subtle section transitions.

Parameters:

- `range`: in | out (required)
- `start`: 0-100%
- `end`: 0-100%

```typescript
{ type: 'BgFade', range: 'in' }
{ type: 'BgFade', range: 'out' }
```

#### BgFadeBack

Visual: Fade targeting back layer specifically. For layered backgrounds.

Parameters:

- `scale`: scale factor

```typescript
{
  type: 'BgFadeBack';
}
```

#### BgPan

Visual: Horizontal/vertical background panning on scroll.

Parameters:

- `direction`: left | right
- `speed`: pan speed

```typescript
{ type: 'BgPan', direction: 'left' }
```

#### BgRotate

Visual: Background rotation driven by scroll. Dynamic, unusual.

Parameters:

- `direction`: clockwise | counter-clockwise
- `angle`: rotation angle

```typescript
{ type: 'BgRotate' }
{ type: 'BgRotate', direction: 'clockwise', angle: 15 }
```

#### BgSkew

Visual: Background skew distortion on scroll. Experimental.

Parameters:

- `direction`: clockwise | counter-clockwise
- `angle`: skew angle

```typescript
{
  type: 'BgSkew';
}
```

#### BgReveal

Visual: Clip-based background reveal. Theatrical unveiling.

```typescript
{
  type: 'BgReveal';
}
```

#### BgCloseUp

Visual: Alternative zoom implementation. Cinematic close-up approach.

Parameters:

- `scale`: zoom scale

```typescript
{
  type: 'BgCloseUp';
}
```

#### BgPullBack

Visual: Reverse zoom (pulling away). Expansive revealing.

Parameters:

- `scale`: zoom scale

```typescript
{
  type: 'BgPullBack';
}
```

#### BgFake3D

Visual: Simulated 3D depth layers. Immersive parallax-enhanced depth.

Parameters:

- `stretch`: stretch amount
- `zoom`: zoom factor

```typescript
{
  type: 'BgFake3D';
}
```

#### ImageParallax

Visual: Parallax for regular `<img>` elements (not CSS backgrounds).

Parameters:

- `reverse`: boolean
- `speed`: parallax speed
- `isPage`: boolean

```typescript
{ type: 'ImageParallax' }
{ type: 'ImageParallax', speed: 0.3 }
```

---

## 5. Accessibility

### Host vs Preset Responsibility

The presets provide animations; the host platform decides when and whether to apply them.

- When the host handles accessibility globally (e.g., disabling all animations under `prefers-reduced-motion`), presets don't need to address it separately
- Keyboard triggers (`activate`/`interest`) and config options like `allowA11yTriggers` are library-level features, not part of preset configuration
- This section provides guidance for preset selection, not library configuration

### Preset Risk Levels

**High risk** (vestibular triggers, seizure risk):

- Spinning: SpinIn, Spin, SpinScroll, SpinMouse, Spin3dScroll
- Bouncing: BounceIn, Bounce, BounceMouse
- 3D rotations: ArcIn, FlipIn, ArcScroll, FlipScroll, Tilt3DMouse
- Continuous motion: Flash, DVD, Jello, Wiggle

**Medium risk** (strong motion, may affect some users):

- GlitchIn, PunchIn, TurnIn
- ParallaxScroll, BgParallax at high speed values

**Low risk / safe** (opacity/blur changes, minimal spatial movement):

- FadeIn, FadeScroll, BlurIn, BlurScroll
- SlideIn (soft), GlideIn (soft)
- Pulse (soft), Breathe

### Reduced Motion Fallback Table

| Original                          | Fallback                  |
| --------------------------------- | ------------------------- |
| BounceIn, SpinIn, PunchIn         | FadeIn                    |
| ArcIn, FlipIn, TurnIn             | FadeIn                    |
| GlitchIn                          | FadeIn                    |
| Spin, Bounce, Wiggle              | Stop or subtle Pulse      |
| Flash                             | Reduce frequency (<3/sec) |
| ParallaxScroll                    | Static position           |
| ArcScroll, FlipScroll, SpinScroll | FadeScroll or disable     |
| BgParallax, BgZoom                | Static background         |
| All mouse animations              | Static state              |

### Trigger Considerations

All preset triggers play automatically without explicit user action:

| Trigger           | Behavior                              | Note                                       |
| ----------------- | ------------------------------------- | ------------------------------------------ |
| Entrance          | Plays on viewport entry (`viewEnter`) | Not user-initiated                         |
| Scroll            | Tied to scroll position               | Continuous while scrolling                 |
| Background Scroll | Tied to scroll position               | Continuous while scrolling                 |
| Ongoing           | Loops indefinitely                    | Flash must stay under 3 flashes/sec        |
| Mouse             | Responds to cursor position           | Desktop only, no touch/keyboard equivalent |

### LLM Guidance for Preset Selection

**Do not limit creativity by default.** If the user asks for "grand", "energetic", "stunning", or similar, generate accordingly using any appropriate presets.

**Apply accessibility constraints only when explicitly requested** via phrases like:

- "accessible", "a11y", "reduced motion safe"
- "subtle", "tone down", "gentle"
- "professional", "minimal"

**When generating high-risk presets:** Optionally note in your response that some presets may affect users with vestibular sensitivity. This is informational, not a blocker.

**Mouse presets:** Note that these are desktop-only (no touch/keyboard equivalent). This is informational context, not a restriction.

**Duration guidelines** (suggestions, not limits):

- Functional UI (modals, dropdowns): under 500ms
- Decorative content: up to 1200ms
- Hero moments: up to 2000ms

### Stagger Patterns

For lists/grids, apply increasing subtle `delay` values

### Performance Notes

- **Scroll animations run continuously**: use sparingly, test on low-end devices
- **Mouse animations calculate on every mousemove**: limit to 1-3 elements
- **Background animations are heavy**: avoid multiple simultaneous bg effects
- **3D transforms require GPU**: can cause jank on older devices
- **Prefer `transform` and `opacity`**: these are GPU-accelerated

### Combining Animations

**Single element (natively supported):**

- Entrance + Ongoing only: `{ entrance: 'BounceIn', ongoing: 'Pulse' }`

**Requires nested containers:**

- Entrance + Mouse: Outer container has entrance, inner has mouse effect
- Entrance + Scroll: Separate containers for each
- Any other cross-trigger combination

**Separate elements:**

- Scroll + Background: Content element with FadeScroll, background element with BgParallax

**Invalid (same trigger type on same element):**

- Two entrance animations
- Multiple scroll animations
- Multiple ongoing animations

### Common Patterns

**Card reveal on scroll:**

```typescript
{ type: 'FadeScroll', range: 'in' }
```

**Interactive product card (requires nested containers):**

```typescript
// Outer container - entrance
{ type: 'FadeIn' }
// Inner container - mouse interaction
{ type: 'Tilt3DMouse', power: 'soft' }
```

**Hero with depth (separate elements):**

```typescript
// Background element
{ type: 'BgParallax', speed: 0.2 }
// Content element
{ type: 'ArcIn', direction: 'bottom', power: 'medium' }
```

**Notification badge (single element - entrance + ongoing supported):**

```typescript
// Same element can have both
{ type: 'BounceIn', direction: 'top', power: 'soft' }  // entrance
{ type: 'Pulse', power: 'soft' }  // ongoing
```

**Loading indicator:**

```typescript
{ type: 'Spin', direction: 'clockwise', duration: 1500 }
```
