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

**Available presets:** FadeIn, ArcIn, BlurIn, BounceIn, CurveIn, DropIn, FlipIn, FloatIn, FoldIn, GlideIn, GrowIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

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

### Coordinate System

For angle-based parameters, the library uses standard mathematical coordinates:

- **0°** = right (east)
- **90°** = top (north)
- **180°** = left (west)
- **270°** = bottom (south)

### CSS Custom Properties

The library exposes these CSS custom properties for runtime control:

- `--motion-opacity`: Target opacity (default: 1)
- `--motion-rotate-z`: Element rotation for scroll effects

---

## 3. Trigger-Preset Relations

### By Tone

| Tone                | Entrance                                 | Scroll                                    | Ongoing                    | Mouse                            |
| ------------------- | ---------------------------------------- | ----------------------------------------- | -------------------------- | -------------------------------- |
| Subtle/Professional | FadeIn, BlurIn, SlideIn, GlideIn, TiltIn | FadeScroll, BlurScroll                    | Pulse (subtle), Breathe    | Tilt3DMouse (subtle), TrackMouse |
| Dramatic/Cinematic  | ArcIn, FlipIn, TurnIn, FoldIn            | ArcScroll, FlipScroll, TiltScroll         | Flip, Fold                 | Track3DMouse                     |
| Playful/Energetic   | BounceIn, SpinIn                         | SpinScroll, Spin3dScroll                  | Bounce, Wiggle, Jello, DVD | BounceMouse, BlobMouse           |
| Geometric/Modern    | ShapeIn, RevealIn, ShuttersIn, WinkIn    | ShapeScroll, RevealScroll, ShuttersScroll | Cross                      | -                                |

### By Use Case

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
- `perspective`: 3D perspective depth (default: 800)
- `angle`: arc rotation angle (default: 80)
- `depth`: Z translation distance (default: 300)

```typescript
{ type: 'ArcIn', direction: 'bottom' }
{ type: 'ArcIn', direction: 'left', angle: 120 }  // Dramatic hero entrance
```

#### BlurIn

Visual: Element transitions from blurry to sharp focus while fading in. Soft, dreamy.

Parameters:

- `blur`: blur amount in px (default: 25)

```typescript
{ type: 'BlurIn' }
{ type: 'BlurIn', blur: 6 }   // Subtle blur
{ type: 'BlurIn', blur: 50 }  // Dramatic blur
```

#### BounceIn

Visual: Element bounces into view with spring physics. Playful, attention-grabbing.

Parameters:

- `direction`: top | right | bottom | left | center (default: top)
- `distanceFactor`: 1-4 (default: 1)
- `perspective`: 3D perspective for center direction (default: 800)

```typescript
{ type: 'BounceIn' }
{ type: 'BounceIn', direction: 'center', distanceFactor: 2 }  // Reward popup
{ type: 'BounceIn', distanceFactor: 2.5 }  // Custom distance
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

- `initialScale`: starting scale (default: 1.6)

```typescript
{ type: 'DropIn' }
{ type: 'DropIn', initialScale: 2 }  // More dramatic
```

#### FlipIn

Visual: 3D card flip rotation to reveal element. Dramatic, card-like metaphor.

Parameters:

- `direction`: top | right | bottom | left
- `initialRotate`: starting rotation degrees (default: 90)
- `perspective`: 3D perspective depth (default: 800)

```typescript
{ type: 'FlipIn', direction: 'left' }
{ type: 'FlipIn', direction: 'top', initialRotate: 270 }  // Dramatic flip
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
- `initialRotate`: starting rotation degrees (default: 60)
- `perspective`: 3D perspective depth (default: 800)

```typescript
{ type: 'FoldIn', direction: 'left' }
{ type: 'FoldIn', direction: 'top', initialRotate: 90 }  // More dramatic fold
```

#### GlideIn

Visual: Smooth 2D glide from direction with angle control. Clean, directional.

Parameters:

- `angle`: angle in degrees (default: 270, from left). 0° = right, 90° = top, 180° = left, 270° = bottom
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }

```typescript
{ type: 'GlideIn', angle: 270, distance: { value: 100, type: 'px' } }  // From left (default)
{ type: 'GlideIn', angle: 90, distance: { value: 50, type: 'percentage' } }  // From top
```

#### GrowIn

Visual: Scale from small to full size with optional directional movement. Expanding, emerging.

Parameters:

- `angle`: angle in degrees (default: 0). 0° = right, 90° = top, 180° = left, 270° = bottom
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' } (default: 120px)
- `initialScale`: starting scale 0-1 (default: 0.6)

```typescript
{ type: 'GrowIn', angle: 0, distance: { value: 0, type: 'px' } }  // Pure scale, no movement
{ type: 'GrowIn', angle: 270, distance: { value: 100, type: 'px' }, initialScale: 0.3 }  // From bottom with dramatic scale
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

```typescript
{ type: 'ShuttersIn', direction: 'left', shutters: 5, staggered: true }
```

#### SlideIn

Visual: Straight movement from direction. Clean, simple, versatile.

Parameters:

- `direction`: top | right | bottom | left
- `initialTranslate`: starting offset (0-1, default: 1)

```typescript
{ type: 'SlideIn', direction: 'bottom' }
{ type: 'SlideIn', direction: 'left', initialTranslate: 0.2 }  // Subtle slide
```

#### SpinIn

Visual: Rotating entrance with spin. Dynamic, playful.

Parameters:

- `direction`: clockwise | counter-clockwise
- `spins`: number of rotations
- `initialScale`: starting scale (default: 0)

```typescript
{ type: 'SpinIn', direction: 'clockwise', spins: 1 }
{ type: 'SpinIn', direction: 'counter-clockwise', spins: 2, initialScale: 0.5 }
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
- `angle`: rotation angle (default: 50)

```typescript
{ type: 'TurnIn', direction: 'bottom-left' }
{ type: 'TurnIn', direction: 'top-right', angle: 80 }  // More dramatic
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

- `range`: in | out | continuous
- `blur`: blur amount in px (default: 25)

```typescript
{ type: 'BlurScroll', range: 'in' }
{ type: 'BlurScroll', range: 'out', blur: 50 }  // More dramatic
```

#### FlipScroll

Visual: Full 3D card flip driven by scroll. Dramatic rotation.

Parameters:

- `axis`: vertical | horizontal
- `range`: in | out | continuous
- `rotate`: rotation degrees (default: 120)
- `perspective`: 3D perspective depth (default: 800)

```typescript
{ type: 'FlipScroll', axis: 'horizontal' }
{ type: 'FlipScroll', axis: 'vertical', range: 'in', rotate: 420 }  // Multiple rotations
```

#### GrowScroll

Visual: Scale up as element enters viewport.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `range`: in | out | continuous
- `scale`: target scale (default: 1.7)
- `speed`: animation speed

```typescript
{ type: 'GrowScroll', direction: 'center' }
{ type: 'GrowScroll', direction: 'center', range: 'in', scale: 4 }  // Dramatic scale
```

#### ShrinkScroll

Visual: Scale down as element exits viewport.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `range`: in | out | continuous
- `scale`: target scale (default: 0.3)
- `speed`: animation speed

```typescript
{ type: 'ShrinkScroll', direction: 'center', range: 'out' }
{ type: 'ShrinkScroll', direction: 'center', scale: 0 }  // Shrink to nothing
```

#### MoveScroll

Visual: Translation movement on scroll in any direction.

Parameters:

- `angle`: 0-360 degrees. 0° = right, 90° = top, 180° = left, 270° = bottom
- `range`: in | out | continuous
- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' } (default: 400px)

```typescript
{ type: 'MoveScroll', angle: 90, distance: { value: 100, type: 'px' } }
{ type: 'MoveScroll', angle: 0, distance: { value: 800, type: 'px' } }  // Long horizontal move
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
- `intensity`: 0-1 (default: varies by shape)

```typescript
{ type: 'ShapeScroll', shape: 'circle' }
{ type: 'ShapeScroll', shape: 'diamond', intensity: 0.8 }
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
- `skew`: skew angle (default: 17)

```typescript
{ type: 'SkewPanScroll', direction: 'left' }
{ type: 'SkewPanScroll', direction: 'right', skew: 24 }  // More dramatic
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
- `rotate`: rotation degrees (default: 100)
- `speed`: animation speed
- `perspective`: 3D perspective depth (default: 1000)

```typescript
{ type: 'Spin3dScroll' }
{ type: 'Spin3dScroll', range: 'continuous', rotate: 200 }  // More dramatic
```

#### SpinScroll

Visual: 2D rotation driven by scroll.

Parameters:

- `direction`: clockwise | counter-clockwise
- `spins`: number of rotations
- `range`: in | out | continuous
- `scale`: scale factor (default: 0.7)

```typescript
{ type: 'SpinScroll', direction: 'clockwise', spins: 1 }
{ type: 'SpinScroll', direction: 'counter-clockwise', spins: 2, scale: 0.4 }
```

#### StretchScroll

Visual: Stretch/squeeze deformation on scroll.

Parameters:

- `range`: in | out | continuous
- `stretch`: stretch amount (default: 1.5)

```typescript
{ type: 'StretchScroll' }
{ type: 'StretchScroll', stretch: 2 }  // More dramatic
```

#### TiltScroll

Visual: 3D tilt effect as user scrolls. Subtle perspective.

Parameters:

- `direction`: left | right
- `range`: in | out | continuous
- `distance`: tilt distance (default: 0.5)
- `perspective`: 3D perspective depth (default: 400)

```typescript
{ type: 'TiltScroll', direction: 'left' }
{ type: 'TiltScroll', direction: 'right', distance: 1 }  // More dramatic
```

#### TurnScroll

Visual: Corner-pivot 3D rotation on scroll.

Parameters:

- `direction`: left | right
- `spin`: clockwise | counter-clockwise
- `range`: in | out | continuous
- `scale`: scale factor (default: 1.3)

```typescript
{ type: 'TurnScroll', direction: 'left', spin: 'clockwise' }
{ type: 'TurnScroll', direction: 'right', spin: 'counter-clockwise', scale: 1.6 }
```

---

### Ongoing Presets

#### Pulse

Visual: Gentle scale oscillation, heartbeat-like rhythm. Subtle, universal.

Parameters:

- `intensity`: 0-1 (default: 0.06)

```typescript
{ type: 'Pulse' }
{ type: 'Pulse', intensity: 0.12 }  // More dramatic
```

#### Bounce

Visual: Vertical bouncing motion like a ball on trampoline. Playful, energetic.

Parameters:

- `intensity`: 0-1 (default: 0.3)

```typescript
{ type: 'Bounce' }
{ type: 'Bounce', intensity: 0.6 }  // More energetic
```

#### Spin

Visual: Continuous rotation around center. Mechanical, precise.

Parameters:

- `direction`: clockwise | counter-clockwise (default: clockwise)

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

- `swing`: swing angle (default: 40)
- `direction`: top | right | bottom | left

```typescript
{ type: 'Swing' }
{ type: 'Swing', swing: 60 }  // More dramatic
```

#### Wiggle

Visual: Horizontal shake/wiggle. Side-to-side for attention.

Parameters:

- `intensity`: 0-1 (default: 0.5)

```typescript
{ type: 'Wiggle' }
{ type: 'Wiggle', intensity: 1 }  // More vigorous
```

#### Flip

Visual: Periodic 180° flips. Card-like rotation showing front/back.

Parameters:

- `axis`: vertical | horizontal

```typescript
{ type: 'Flip', axis: 'horizontal' }
```

#### Fold

Visual: 3D folding motion. Paper-like folding and unfolding.

Parameters:

- `direction`: top | right | bottom | left
- `angle`: fold angle (default: 30)

```typescript
{ type: 'Fold', direction: 'left' }
{ type: 'Fold', direction: 'top', angle: 45 }  // More dramatic
```

#### Jello

Visual: Wobbly elastic deformation. Jiggly, bouncy distortion.

Parameters:

- `intensity`: 0-1 (default: 0.5)

```typescript
{ type: 'Jello' }
{ type: 'Jello', intensity: 1 }  // More wobbly
```

#### Rubber

Visual: Elastic stretch effect. Springy stretching and snapping.

Parameters:

- `intensity`: 0-1 (default: 0.05)

```typescript
{ type: 'Rubber' }
{ type: 'Rubber', intensity: 0.1 }  // More stretchy
```

#### Poke

Visual: Quick scale bump like being tapped. Brief attention "boop".

Parameters:

- `direction`: top | right | bottom | left
- `intensity`: 0-1 (default: 0.5)

```typescript
{ type: 'Poke', direction: 'top' }
{ type: 'Poke', direction: 'right', intensity: 1 }  // More dramatic
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

- `angle`: 5-85 degrees (default: 50)
- `perspective`: 200-1000px (default: 500)
- `inverted`: boolean (default: false)

```typescript
{ type: 'Tilt3DMouse' }
{ type: 'Tilt3DMouse', angle: 25, perspective: 1000 }  // Subtle professional
{ type: 'Tilt3DMouse', angle: 85, perspective: 200 }   // Dramatic
```

#### TrackMouse

Visual: Element follows cursor position. Floating, parallax-like.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' } (default: { value: 250, type: 'px' })
- `axis`: horizontal | vertical | both (default: both)
- `inverted`: boolean (default: false)

```typescript
{ type: 'TrackMouse', distance: { value: 200, type: 'px' }, axis: 'both' }
{ type: 'TrackMouse', distance: { value: 50, type: 'px' }, axis: 'horizontal' }  // Background layer
```

#### BounceMouse

Visual: Bouncy/elastic cursor following. Overshoots and wobbles.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' } (default: { value: 80, type: 'px' })
- `axis`: horizontal | vertical | both (default: both)
- `inverted`: boolean (default: false)

```typescript
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both' }
```

#### Track3DMouse

Visual: Combined translation + 3D rotation following mouse. Complex, immersive.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `angle`: rotation angle (default: 50)
- `axis`: horizontal | vertical | both
- `perspective`: perspective distance (default: 500)
- `inverted`: boolean

```typescript
{ type: 'Track3DMouse', distance: { value: 100, type: 'px' }, axis: 'both' }
{ type: 'Track3DMouse', distance: { value: 50, type: 'px' }, angle: 25, perspective: 1000 }  // Subtle
```

#### SpinMouse

Visual: Rotation following mouse angle. Element spins based on cursor position.

Parameters:

- `axis`: horizontal | vertical | both
- `inverted`: boolean

```typescript
{ type: 'SpinMouse' }
{ type: 'SpinMouse', axis: 'both' }
```

#### ScaleMouse

Visual: Scale based on cursor distance. Grows/shrinks by proximity.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `axis`: horizontal | vertical | both
- `scale`: scale factor (default: depends on scaleDirection)
- `scaleDirection`: in | out
- `inverted`: boolean

```typescript
{ type: 'ScaleMouse', distance: { value: 100, type: 'px' }, scaleDirection: 'in' }
{ type: 'ScaleMouse', distance: { value: 100, type: 'px' }, scaleDirection: 'out', scale: 2.4 }  // Dramatic grow
```

#### SwivelMouse

Visual: Z-axis rotation following cursor. Gyroscope-like vertical rotation.

Parameters:

- `angle`: rotation angle (default: 50)
- `perspective`: perspective distance (default: 700)
- `pivotAxis`: top | bottom | right | left | center-horizontal | center-vertical
- `inverted`: boolean

```typescript
{ type: 'SwivelMouse' }
{ type: 'SwivelMouse', angle: 25, perspective: 1000 }  // Subtle
```

#### SkewMouse

Visual: Skew distortion following cursor. Angular distortion.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `angle`: skew angle (default: 20)
- `axis`: horizontal | vertical | both
- `inverted`: boolean

```typescript
{ type: 'SkewMouse' }
{ type: 'SkewMouse', angle: 45 }  // More dramatic
```

#### BlurMouse

Visual: Blur based on cursor distance. Focus/defocus by proximity.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `angle`: angle (default: 25)
- `scale`: scale factor (default: 0.7)
- `blur`: blur amount
- `perspective`: perspective distance
- `inverted`: boolean

```typescript
{ type: 'BlurMouse' }
{ type: 'BlurMouse', angle: 65, scale: 0.25 }  // More dramatic
```

#### AiryMouse

Visual: Floating/airy cursor response. Ethereal, gentle drift.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `axis`: horizontal | vertical | both
- `angle`: angle (default: 50)
- `inverted`: boolean

```typescript
{ type: 'AiryMouse' }
{ type: 'AiryMouse', angle: 10 }  // Subtle
```

#### BlobMouse

Visual: Organic blob-like deformation. Fluid shape distortion.

Parameters:

- `distance`: { value: number, type: 'px' | 'percentage' | 'vh' | 'vw' }
- `scale`: scale factor (default: 1.6)
- `inverted`: boolean

```typescript
{ type: 'BlobMouse' }
{ type: 'BlobMouse', scale: 2.4 }  // More dramatic
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

- TurnIn
- ParallaxScroll, BgParallax at high speed values

**Low risk / safe** (opacity/blur changes, minimal spatial movement):

- FadeIn, FadeScroll, BlurIn, BlurScroll
- SlideIn (subtle settings), GlideIn (subtle settings)
- Pulse (low intensity), Breathe

### Reduced Motion Fallback Table

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
{ type: 'Tilt3DMouse', angle: 25, perspective: 1000 }  // subtle
```

**Hero with depth (separate elements):**

```typescript
// Background element
{ type: 'BgParallax', speed: 0.2 }
// Content element
{ type: 'ArcIn', direction: 'bottom' }
```

**Notification badge (single element - entrance + ongoing supported):**

```typescript
// Same element can have both
{ type: 'BounceIn', direction: 'top', distanceFactor: 1 }  // entrance, subtle
{ type: 'Pulse', intensity: 0.06 }  // ongoing
```

**Loading indicator:**

```typescript
{ type: 'Spin', direction: 'clockwise', duration: 1500 }
```

---

## 7. Intensity Value Guide

When users ask for "soft", "subtle", "medium", or "hard"/"dramatic" effects, use these value mappings as guidance for suggesting appropriate parameter values.

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

### Usage Example

When a user asks: "I want a subtle flip entrance"

Suggest: `{ type: 'FlipIn', initialRotate: 45 }`
