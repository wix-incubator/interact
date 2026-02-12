---
name: Motion Presets Reference
description: Comprehensive LLM reference for Interact motion presets
---

# Motion Presets Reference

## 1. Intro

This document is a comprehensive reference for Interact motion presets. Use it to select and configure animations based on user requirements.

### Decision Flow

1. **Select Category** - What kind of animation? (entrance, scroll, ongoing, mouse)
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

## 2. Preset Categories

### Entrance

One-shot animations optimized for viewport entry, but can also be triggered by hover, click, animationEnd, and other triggers.

**When to use:**

- Element reveals on viewport entry
- First-time visibility animations
- Click/hover-triggered transitions

**When NOT to use:**

- Scroll-driven reveals → use scroll
- Continuous/looping → use ongoing
- Mouse-reactive → use mouse

**Available presets:** FadeIn, ArcIn, BlurIn, BounceIn, CurveIn, DropIn, ExpandIn, FlipIn, FloatIn, FoldIn, GlideIn, RevealIn, ShapeIn, ShuttersIn, SlideIn, SpinIn, TiltIn, TurnIn, WinkIn

### Scroll

Animations whose progress is tied to a ViewTimeline - the element's position in the viewport.

**When to use:**

- Progressive content reveals on scroll
- Parallax depth effects
- Storytelling tied to scroll progress
- De-emphasizing passed content

**When NOT to use:**

- One-time entrance → use entrance (more performant)
- Continuous loops → use ongoing

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
- One-time reveals → use entrance

**Available presets:** Bounce, Breathe, Cross, DVD, Flash, Flip, Fold, Jello, Poke, Pulse, Rubber, Spin, Swing, Wiggle

### Mouse

Animations that respond to cursor position. May behave differently on mobile.

**When to use:**

- Interactive cards/products (tilt effect)
- Parallax depth with cursor
- Hero section interactivity
- Playful/game-like interfaces

**When NOT to use:**

- Accessibility-critical interfaces
- Essential functionality (never rely on mouse for core features)

**Available presets:** AiryMouse, BlobMouse, BlurMouse, BounceMouse, CustomMouse, ScaleMouse, SkewMouse, SpinMouse, SwivelMouse, Tilt3DMouse, Track3DMouse, TrackMouse

---

## 3. Parameter Standards

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

### Overloaded Parameter Names

The `direction` parameter accepts different values depending on the preset:

| Meaning            | Accepted Values                                                    | Presets                          |
| ------------------ | ------------------------------------------------------------------ | -------------------------------- |
| Cardinal direction | 'top', 'right', 'bottom', 'left'                                   | FlipIn, FoldIn, SlideIn, FloatIn |
| Extended cardinal  | + 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center' | BounceIn, ShapeIn                |
| Rotation direction | 'clockwise', 'counter-clockwise'                                   | SpinIn, SpinScroll, Spin         |

### Coordinate System

For angle-based parameters:

- **0°** = right (east)
- **90°** = top (north)
- **180°** = left (west)
- **270°** = bottom (south)

### Distance Units

Distance parameters use the `UnitLengthPercentage` type:

```typescript
distance: { value: 120, type: 'px' }       // pixels
distance: { value: 50, type: 'percentage' } // percentage
distance: { value: 10, type: 'vh' }        // viewport height
```

Supported unit types: `px`, `em`, `rem`, `vh`, `vw`, `vmin`, `vmax`, `percentage`

---

## 4. Presets

### Entrance Presets

#### FadeIn

Visual: Element transitions from invisible to visible. Simple opacity change, no movement.

Parameters:

- No preset-specific parameters

```typescript
{
  type: 'FadeIn';
}
```

#### ArcIn

Visual: Element swings in along a curved 3D path, like a door opening. Dramatic, cinematic.

Parameters:

- `direction`: top | right | bottom | left (default: left)
- `depth`: UnitLengthPercentage (default: 300px) - Z translation distance
- `perspective`: number (default: 800)

```typescript
{ type: 'ArcIn', direction: 'bottom' }
{ type: 'ArcIn', direction: 'left', depth: { value: 500, type: 'px' } }
```

#### BlurIn

Visual: Element transitions from blurry to sharp focus while fading in. Soft, dreamy.

Parameters:

- `blur`: number in px (default: 25)

```typescript
{ type: 'BlurIn' }
{ type: 'BlurIn', blur: 6 }   // Subtle
{ type: 'BlurIn', blur: 50 }  // Dramatic
```

#### BounceIn

Visual: Element bounces into view with spring physics. Playful, attention-grabbing.

Parameters:

- `direction`: top | right | bottom | left | center (default: top)
- `distanceFactor`: number (default: 1)
- `perspective`: number (default: 800) - only used with center direction

```typescript
{ type: 'BounceIn' }
{ type: 'BounceIn', direction: 'center', distanceFactor: 2 }
```

#### CurveIn

Visual: Curved 3D motion path entry. Cinematic arc trajectory.

Parameters:

- `direction`: 'left' | 'right' | 'pseudoLeft' | 'pseudoRight'
- `depth`: UnitLengthPercentage (default: 900px)
- `perspective`: number (default: 200)

```typescript
{ type: 'CurveIn', direction: 'left' }
```

#### DropIn

Visual: Falls from above with subtle scale on landing. Gravity-like, natural.

Parameters:

- `initialScale`: number (default: 1.6)

```typescript
{ type: 'DropIn' }
{ type: 'DropIn', initialScale: 2 }  // More dramatic
```

#### FlipIn

Visual: 3D card flip rotation to reveal element. Dramatic, card-like metaphor.

Parameters:

- `direction`: top | right | bottom | left
- `initialRotate`: number in degrees (default: 90)
- `perspective`: number (default: 800)

```typescript
{ type: 'FlipIn', direction: 'left' }
{ type: 'FlipIn', direction: 'top', initialRotate: 270 }  // Dramatic flip
```

#### FloatIn

Visual: Gentle floating/drifting entrance. Ethereal, light, dreamy.

Parameters:

- `direction`: top | right | bottom | left

```typescript
{ type: 'FloatIn', direction: 'bottom' }
```

#### FoldIn

Visual: Paper-folding 3D effect. Origami-like, creative.

Parameters:

- `direction`: top | right | bottom | left
- `initialRotate`: number in degrees (default: 60)
- `perspective`: number (default: 800)

```typescript
{ type: 'FoldIn', direction: 'left' }
{ type: 'FoldIn', direction: 'top', initialRotate: 90 }
```

#### GlideIn

Visual: Smooth 2D glide from any angle with distance control. Clean, directional.

Parameters:

- `direction`: number in degrees (default: 270, from left). 0° = right, 90° = top, 180° = left, 270° = bottom
- `distance`: UnitLengthPercentage | EffectFourDirections

```typescript
{ type: 'GlideIn' }  // From left (default angle 270)
{ type: 'GlideIn', direction: 90, distance: { value: 50, type: 'percentage' } }  // From top
```

#### ExpandIn

Visual: Scale from small to full size with directional expansion from edge. Emerging, growing outward.

Parameters:

- `direction`: number in degrees or keyword (top | right | bottom | left). Default: 90 (from top)
- `distance`: UnitLengthPercentage (default: { value: 120, unit: 'percentage' })
- `initialScale`: number (default: 0)

```typescript
{ type: 'ExpandIn' }
{ type: 'ExpandIn', direction: 'bottom', distance: { value: 100, type: 'px' }, initialScale: 0.3 }
```

#### RevealIn

Visual: Directional clip/mask reveal like a curtain opening. Theatrical.

Parameters:

- `direction`: top | right | bottom | left

```typescript
{ type: 'RevealIn', direction: 'left' }
```

#### ShapeIn

Visual: Shape mask reveal (circle, square, diamond, etc.). Geometric, precise.

Parameters:

- `shape`: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window'

```typescript
{ type: 'ShapeIn', shape: 'circle' }
{ type: 'ShapeIn', shape: 'diamond' }
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

Visual: Straight movement from direction with clip. Clean, simple, versatile.

Parameters:

- `direction`: top | right | bottom | left
- `initialTranslate`: number 0-1 (default: 1) - starting offset ratio

```typescript
{ type: 'SlideIn', direction: 'bottom' }
{ type: 'SlideIn', direction: 'left', initialTranslate: 0.2 }  // Subtle slide
```

#### SpinIn

Visual: Rotating entrance with spin. Dynamic, playful.

Parameters:

- `direction`: 'clockwise' | 'counter-clockwise'
- `spins`: number of rotations
- `initialScale`: number (default: 0) - starting scale

```typescript
{ type: 'SpinIn', direction: 'clockwise', spins: 1 }
{ type: 'SpinIn', direction: 'counter-clockwise', spins: 2, initialScale: 0.5 }
```

#### TiltIn

Visual: 3D tilt into view. Subtle depth, elegant perspective.

Parameters:

- `direction`: 'left' | 'right'
- `depth`: UnitLengthPercentage (default: 200px)
- `perspective`: number (default: 800)

```typescript
{ type: 'TiltIn', direction: 'left' }
```

#### TurnIn

Visual: Corner-pivot 3D rotation. Complex, dramatic, premium.

Parameters:

- `direction`: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

```typescript
{ type: 'TurnIn', direction: 'bottom-left' }
```

#### WinkIn

Visual: Split-in-half reveal from center. Unique, eye-like opening.

Parameters:

- `direction`: 'vertical' | 'horizontal'

```typescript
{ type: 'WinkIn', direction: 'vertical' }
```

---

### Scroll Presets

All scroll presets accept a `range` parameter: `'in'` | `'out'` | `'continuous'`

#### ArcScroll

Visual: 3D arc rotation as user scrolls. Dramatic, cinematic.

Parameters:

- `direction`: 'vertical' | 'horizontal'
- `range`: in | out | continuous
- `perspective`: number

```typescript
{ type: 'ArcScroll', direction: 'vertical' }
{ type: 'ArcScroll', direction: 'horizontal', range: 'in' }
```

#### BlurScroll

Visual: Blur/unblur effect controlled by scroll. Focus transitions.

Parameters:

- `range`: in | out | continuous
- `blur`: number in px (default: 25)

```typescript
{ type: 'BlurScroll', range: 'in' }
{ type: 'BlurScroll', range: 'out', blur: 50 }
```

#### FadeScroll

Visual: Opacity transition tied to scroll. Fade in on enter, out on exit.

Parameters:

- `range`: in | out
- `opacity`: number 0-1

```typescript
{ type: 'FadeScroll', range: 'in' }
{ type: 'FadeScroll', range: 'out' }
```

#### FlipScroll

Visual: Full 3D card flip driven by scroll. Dramatic rotation.

Parameters:

- `direction`: 'vertical' | 'horizontal'
- `range`: in | out | continuous
- `rotate`: number in degrees (default: 120)
- `perspective`: number (default: 800)

```typescript
{ type: 'FlipScroll', direction: 'horizontal' }
{ type: 'FlipScroll', direction: 'vertical', range: 'in', rotate: 420 }
```

#### GrowScroll

Visual: Scale up as element enters viewport.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `range`: in | out | continuous
- `scale`: number (default: 1.7)
- `speed`: number

```typescript
{ type: 'GrowScroll', direction: 'center' }
{ type: 'GrowScroll', direction: 'center', range: 'in', scale: 4 }
```

#### MoveScroll

Visual: Translation movement on scroll in any direction.

Parameters:

- `angle`: 0-360 degrees (default varies). 0° = right, 90° = top, 180° = left, 270° = bottom
- `range`: in | out | continuous
- `distance`: UnitLengthPercentage (default: 400px)

```typescript
{ type: 'MoveScroll', angle: 90, distance: { value: 100, type: 'px' } }
{ type: 'MoveScroll', angle: 0, distance: { value: 800, type: 'px' } }
```

#### PanScroll

Visual: Horizontal panning tied to scroll.

Parameters:

- `direction`: 'left' | 'right'
- `distance`: UnitLengthPercentage
- `startFromOffScreen`: boolean
- `range`: in | out | continuous

```typescript
{ type: 'PanScroll', direction: 'left', distance: { value: 200, type: 'px' } }
```

#### ParallaxScroll

Visual: Element moves slower/faster than scroll, creating depth illusion.

Parameters:

- `parallaxFactor`: number (default: 0.5) - movement speed relative to scroll
- `range`: in | out | continuous

```typescript
{ type: 'ParallaxScroll' }
{ type: 'ParallaxScroll', parallaxFactor: 0.3 }
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

- `shape`: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window'
- `range`: in | out | continuous
- `intensity`: number 0-1

```typescript
{ type: 'ShapeScroll', shape: 'circle' }
{ type: 'ShapeScroll', shape: 'diamond', intensity: 0.8 }
```

#### ShrinkScroll

Visual: Scale down as element exits viewport.

Parameters:

- `direction`: top | right | bottom | left | top-left | top-right | bottom-left | bottom-right | center
- `range`: in | out | continuous
- `scale`: number (default: 0.3)
- `speed`: number

```typescript
{ type: 'ShrinkScroll', direction: 'center', range: 'out' }
{ type: 'ShrinkScroll', direction: 'center', scale: 0 }
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

- `direction`: 'left' | 'right'
- `range`: in | out | continuous
- `skew`: number in degrees (default: 17)

```typescript
{ type: 'SkewPanScroll', direction: 'left' }
{ type: 'SkewPanScroll', direction: 'right', skew: 24 }
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
- `rotate`: number in degrees (default: 100)
- `speed`: number
- `perspective`: number (default: 1000)

```typescript
{ type: 'Spin3dScroll' }
{ type: 'Spin3dScroll', range: 'continuous', rotate: 200 }
```

#### SpinScroll

Visual: 2D rotation driven by scroll.

Parameters:

- `direction`: 'clockwise' | 'counter-clockwise'
- `spins`: number of rotations
- `range`: in | out | continuous
- `scale`: number (default: 0.7)

```typescript
{ type: 'SpinScroll', direction: 'clockwise', spins: 1 }
{ type: 'SpinScroll', direction: 'counter-clockwise', spins: 2, scale: 0.4 }
```

#### StretchScroll

Visual: Stretch/squeeze deformation on scroll.

Parameters:

- `range`: in | out | continuous
- `stretch`: number (default: 1.5)

```typescript
{ type: 'StretchScroll' }
{ type: 'StretchScroll', stretch: 2 }
```

#### TiltScroll

Visual: 3D tilt effect as user scrolls. Subtle perspective.

Parameters:

- `direction`: 'left' | 'right'
- `range`: in | out | continuous
- `parallaxFactor`: number (default: 0.5) - tilt distance factor
- `perspective`: number (default: 400)

```typescript
{ type: 'TiltScroll', direction: 'left' }
{ type: 'TiltScroll', direction: 'right', parallaxFactor: 1 }
```

#### TurnScroll

Visual: Corner-pivot 3D rotation on scroll.

Parameters:

- `direction`: 'left' | 'right'
- `spin`: 'clockwise' | 'counter-clockwise'
- `range`: in | out | continuous
- `scale`: number (default: 1.3)
- `rotation`: number

```typescript
{ type: 'TurnScroll', direction: 'left', spin: 'clockwise' }
{ type: 'TurnScroll', direction: 'right', spin: 'counter-clockwise', scale: 1.6 }
```

---

### Ongoing Presets

#### Bounce

Visual: Vertical bouncing motion. Playful, energetic.

Parameters:

- `intensity`: number 0-1 (default: 0)

```typescript
{ type: 'Bounce' }
{ type: 'Bounce', intensity: 0.5 }
```

#### Breathe

Visual: Slow scale in/out like breathing. Calm, organic, meditative.

Parameters:

- `direction`: 'vertical' | 'horizontal' | 'center'
- `distance`: UnitLengthPercentage
- `perspective`: number

```typescript
{ type: 'Breathe', direction: 'center' }
{ type: 'Breathe', direction: 'center', distance: { value: 10, type: 'percentage' } }
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

- No preset-specific parameters

```typescript
{
  type: 'DVD';
}
```

#### Flash

Visual: Opacity pulsing/blinking. Attention, warning indicator.

Parameters:

- No preset-specific parameters

```typescript
{
  type: 'Flash';
}
```

#### Flip

Visual: Periodic 180° flips. Card-like rotation showing front/back.

Parameters:

- `direction`: 'vertical' | 'horizontal'
- `perspective`: number

```typescript
{ type: 'Flip', direction: 'horizontal' }
```

#### Fold

Visual: 3D folding motion. Paper-like folding and unfolding.

Parameters:

- `direction`: top | right | bottom | left
- `angle`: number in degrees (default: 15)

```typescript
{ type: 'Fold', direction: 'left' }
{ type: 'Fold', direction: 'top', angle: 45 }
```

#### Jello

Visual: Wobbly elastic deformation. Jiggly, bouncy distortion.

Parameters:

- `intensity`: number 0-1 (default: 0.25)

```typescript
{ type: 'Jello' }
{ type: 'Jello', intensity: 1 }
```

#### Poke

Visual: Quick scale bump like being tapped. Brief attention "boop".

Parameters:

- `direction`: top | right | bottom | left (default: 'right')
- `intensity`: number 0-1 (default: 0.5)

```typescript
{ type: 'Poke', direction: 'top' }
{ type: 'Poke', direction: 'right', intensity: 1 }
```

#### Pulse

Visual: Gentle scale oscillation, heartbeat-like rhythm. Subtle, universal.

Parameters:

- `intensity`: number 0-1 (default: 0)

```typescript
{ type: 'Pulse' }
{ type: 'Pulse', intensity: 0.5 }
```

#### Rubber

Visual: Elastic stretch effect. Springy stretching and snapping.

Parameters:

- `intensity`: number 0-1 (default: 0.5)

```typescript
{ type: 'Rubber' }
{ type: 'Rubber', intensity: 1 }
```

#### Spin

Visual: Continuous rotation around center. Mechanical, precise.

Parameters:

- `direction`: 'clockwise' | 'counter-clockwise' (default: clockwise)

```typescript
{ type: 'Spin', direction: 'clockwise' }
```

#### Swing

Visual: Rotation oscillation like a pendulum. Back and forth rhythmic.

Parameters:

- `swing`: number in degrees (default: 20)
- `direction`: top | right | bottom | left

```typescript
{ type: 'Swing' }
{ type: 'Swing', swing: 60 }
```

#### Wiggle

Visual: Horizontal shake/wiggle. Side-to-side for attention.

Parameters:

- `intensity`: number 0-1 (default: 0.5)

```typescript
{ type: 'Wiggle' }
{ type: 'Wiggle', intensity: 1 }
```

---

### Mouse Presets

All mouse presets accept an optional `inverted`: boolean parameter.

#### AiryMouse

Visual: Floating/airy cursor response. Ethereal, gentle drift.

Parameters:

- `distance`: UnitLengthPercentage
- `axis`: 'horizontal' | 'vertical' | 'both'
- `angle`: number (default: 50)

```typescript
{ type: 'AiryMouse' }
{ type: 'AiryMouse', angle: 10 }  // Subtle
```

#### BlobMouse

Visual: Organic blob-like deformation. Fluid shape distortion.

Parameters:

- `distance`: UnitLengthPercentage
- `scale`: number (default: 1.6)

```typescript
{ type: 'BlobMouse' }
{ type: 'BlobMouse', scale: 2.4 }
```

#### BlurMouse

Visual: Blur based on cursor distance. Focus/defocus by proximity.

Parameters:

- `distance`: UnitLengthPercentage
- `angle`: number (default: 25)
- `scale`: number (default: 0.7)
- `blur`: number
- `perspective`: number

```typescript
{ type: 'BlurMouse' }
{ type: 'BlurMouse', angle: 65, scale: 0.25 }
```

#### BounceMouse

Visual: Bouncy/elastic cursor following. Overshoots and wobbles.

Parameters:

- `distance`: UnitLengthPercentage (default: 80px)
- `axis`: 'horizontal' | 'vertical' | 'both'

```typescript
{ type: 'BounceMouse', distance: { value: 80, type: 'px' }, axis: 'both' }
```

#### CustomMouse

Visual: Configurable custom behavior. For advanced custom implementations.

```typescript
{
  type: 'CustomMouse';
}
```

#### ScaleMouse

Visual: Scale based on cursor distance. Grows/shrinks by proximity.

Parameters:

- `distance`: UnitLengthPercentage
- `axis`: 'horizontal' | 'vertical' | 'both'
- `scale`: number

```typescript
{ type: 'ScaleMouse', distance: { value: 100, type: 'px' } }
```

#### SkewMouse

Visual: Skew distortion following cursor. Angular distortion.

Parameters:

- `distance`: UnitLengthPercentage
- `angle`: number (default: 20)
- `axis`: 'horizontal' | 'vertical' | 'both'

```typescript
{ type: 'SkewMouse' }
{ type: 'SkewMouse', angle: 45 }
```

#### SpinMouse

Visual: Rotation following mouse angle. Element spins based on cursor position.

Parameters:

- `axis`: 'horizontal' | 'vertical' | 'both'

```typescript
{ type: 'SpinMouse' }
{ type: 'SpinMouse', axis: 'both' }
```

#### SwivelMouse

Visual: Z-axis rotation following cursor. Gyroscope-like vertical rotation.

Parameters:

- `angle`: number (default: 50)
- `perspective`: number (default: 700)
- `pivotAxis`: 'top' | 'bottom' | 'right' | 'left' | 'center-horizontal' | 'center-vertical'

```typescript
{ type: 'SwivelMouse' }
{ type: 'SwivelMouse', angle: 25, perspective: 1000 }  // Subtle
```

#### Tilt3DMouse

Visual: Element tilts toward cursor in 3D, like angling a card. Premium, interactive.

Parameters:

- `angle`: number (default: 50)
- `perspective`: number (default: 500)

```typescript
{ type: 'Tilt3DMouse' }
{ type: 'Tilt3DMouse', angle: 25, perspective: 1000 }  // Subtle professional
{ type: 'Tilt3DMouse', angle: 85, perspective: 200 }   // Dramatic
```

#### Track3DMouse

Visual: Combined translation + 3D rotation following mouse. Complex, immersive.

Parameters:

- `distance`: UnitLengthPercentage
- `angle`: number (default: 50)
- `axis`: 'horizontal' | 'vertical' | 'both'
- `perspective`: number (default: 500)

```typescript
{ type: 'Track3DMouse', distance: { value: 100, type: 'px' }, axis: 'both' }
{ type: 'Track3DMouse', distance: { value: 50, type: 'px' }, angle: 25, perspective: 1000 }
```

#### TrackMouse

Visual: Element follows cursor position. Floating, parallax-like.

Parameters:

- `distance`: UnitLengthPercentage (default: 250px)
- `axis`: 'horizontal' | 'vertical' | 'both'

```typescript
{ type: 'TrackMouse', distance: { value: 200, type: 'px' }, axis: 'both' }
{ type: 'TrackMouse', distance: { value: 50, type: 'px' }, axis: 'horizontal' }
```

---

## 5. Selection Tables

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

## 6. Combining Animations

1. Avoid mixing multiple animations on the same element when possible
2. Never combine animations that affect the same CSS properties (e.g., two animations both using `transform`)
3. When combining is necessary, animation order matters - later animations may override earlier ones
4. If possible, use nested containers to separate animations that would conflict - place each animation on a separate wrapper element

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

## 7. Accessibility

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

### Performance Notes

- **Scroll animations run continuously**: use sparingly, test on low-end devices
- **Mouse animations calculate on every mousemove**: limit to 1-3 elements
- **3D transforms require GPU**: can cause jank on older devices
- **Prefer `transform` and `opacity`**: these are GPU-accelerated

---

## 8. Intensity Value Guide

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
| ExpandIn | initialScale     | 0.8         | 0.6        | 0             |
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
