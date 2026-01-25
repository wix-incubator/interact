---
name: Mouse Animations
category: mouse
tags: [mouse, cursor, hover, interactive, follow, track, pointer, mousemove, desktop, response]
---

# Mouse Animations

## Description

Mouse animations respond to cursor position, creating interactive elements that follow, tilt, or transform based on where the user's mouse is located. These animations create a sense of depth, interactivity, and playfulness that makes interfaces feel responsive and alive.

Mouse animations are **desktop-only**—they require a mouse or trackpad and have no effect on touch devices. Always consider mobile fallbacks when using mouse animations.

## Synonyms

cursor animation, hover effect, mouse follow, cursor tracking, mouse parallax, interactive hover, pointer animation, mousemove effect, cursor response, mouse-driven animation, hover interaction

## When to Use Mouse Animations

- **Interactive cards/products**: Tilt effect on product images, cards
- **Parallax depth with cursor**: Layered elements responding to mouse
- **Hero section interactivity**: Adding depth and engagement to landing pages
- **Portfolio/showcase**: Interactive image galleries, project previews
- **Playful interfaces**: Game-like interactions, fun micro-interactions
- **Premium/luxury feel**: Subtle tilt effects convey quality

## When NOT to Use Mouse Animations

- **Mobile-first designs** → these simply won't work on touch devices
- **Clickable/interactive elements** → may interfere with click targets
- **Accessibility-critical interfaces** → mouse animations exclude keyboard users
- **Performance-sensitive pages** → constant calculations on mousemove
- **Multiple simultaneous effects** → visual overload, performance issues
- **Essential functionality** → never rely on mouse animation for core features

## Accessibility Considerations

- **Desktop-only limitation**: Mouse animations don't work on touch devices, keyboard navigation, or for users who can't use a mouse. Always ensure content is fully accessible without them
- **Respect `prefers-reduced-motion`**: Disable mouse animations entirely for users who prefer reduced motion
- **Vestibular concerns**: Tilt3DMouse, SpinMouse, and Track3DMouse with large values can cause discomfort. Keep effects subtle
- **Don't interfere with interaction**: Mouse animations shouldn't make it harder to click buttons, links, or form elements
- **Provide visual feedback alternatives**: If hover effects are important for understanding UI state, provide non-motion alternatives
- **Keyboard users excluded**: Mouse animations are invisible to keyboard navigators—don't use them to convey important information

## Available Presets

### Tilt3DMouse

**Description**: Element tilts towards cursor like holding a card and angling it. 3D perspective rotation following mouse position.
**Tags**: `tilt`, `3d`, `perspective`, `card`, `rotate`, `angle`, `premium`, `interactive`
**Synonyms**: 3d tilt, mouse tilt, perspective tilt, interactive tilt, hover tilt, card tilt, gyroscope effect

### TrackMouse

**Description**: Element follows cursor position, moving in same direction. Floating object that drifts towards where you point.
**Tags**: `track`, `follow`, `translate`, `movement`, `parallax`, `float`, `drift`
**Synonyms**: mouse tracking, follow cursor, cursor follow, mouse movement, parallax mouse, floating follow

### BounceMouse

**Description**: Bouncy/elastic cursor following. Overshoots and wobbles before settling, springy playful motion.
**Tags**: `bounce`, `elastic`, `spring`, `playful`, `wobble`, `overshoot`, `jelly`
**Synonyms**: bouncy mouse, elastic follow, spring mouse, bouncy cursor effect, elastic tracking

### Track3DMouse

**Description**: Combined translation + 3D rotation following mouse. Complex immersive effect with movement and tilt.
**Tags**: `track`, `3d`, `translate`, `rotate`, `complex`, `immersive`, `combined`
**Synonyms**: 3d track mouse, combined mouse effect, translate and tilt, immersive mouse

### SpinMouse

**Description**: Rotation following mouse angle. Element spins/rotates based on cursor position around element.
**Tags**: `spin`, `rotate`, `angle`, `circular`, `dynamic`, `follow`
**Synonyms**: mouse spin, rotation follow, angle mouse, spinning cursor effect

### ScaleMouse

**Description**: Scale based on cursor distance. Element grows/shrinks depending on how close mouse is.
**Tags**: `scale`, `zoom`, `distance`, `proximity`, `grow`, `shrink`, `size`
**Synonyms**: scale mouse, zoom mouse, proximity scale, distance zoom, hover scale

### SwivelMouse

**Description**: Z-axis rotation following cursor. Unique gyroscope-like rotation on vertical axis.
**Tags**: `swivel`, `z-axis`, `rotate`, `gyroscope`, `unique`, `vertical`
**Synonyms**: swivel mouse, z rotation, gyroscope mouse, vertical rotation

### SkewMouse

**Description**: Skew distortion following cursor. Experimental angular distortion based on mouse position.
**Tags**: `skew`, `distortion`, `angle`, `experimental`, `warp`, `tilt`
**Synonyms**: skew mouse, distortion mouse, angle skew, warp mouse

### BlurMouse

**Description**: Blur based on cursor distance. Focus/defocus effect depending on mouse proximity.
**Tags**: `blur`, `focus`, `distance`, `proximity`, `defocus`, `depth`
**Synonyms**: blur mouse, focus mouse, proximity blur, distance focus

### AiryMouse

**Description**: Floating/airy cursor response. Ethereal, light movement as if carried by air currents.
**Tags**: `airy`, `float`, `ethereal`, `light`, `gentle`, `drift`, `soft`
**Synonyms**: airy mouse, floating mouse, ethereal cursor, light follow, gentle drift

### BlobMouse

**Description**: Organic blob-like deformation. Experimental fluid shape distortion following cursor.
**Tags**: `blob`, `organic`, `fluid`, `deform`, `experimental`, `shape`, `morph`
**Synonyms**: blob mouse, organic deform, fluid mouse, shape morph, blob effect

### CustomMouse

**Description**: Configurable custom behavior. Flexible preset for custom mouse-driven transformations.
**Tags**: `custom`, `configurable`, `flexible`, `advanced`, `custom-behavior`
**Synonyms**: custom mouse, configurable mouse, flexible mouse effect, advanced mouse

## Decision Guide

### By Effect Type

- **Translation/Movement**: TrackMouse, BounceMouse, AiryMouse
- **3D Rotation/Tilt**: Tilt3DMouse, Track3DMouse, SwivelMouse
- **2D Rotation**: SpinMouse
- **Scale**: ScaleMouse
- **Distortion**: SkewMouse, BlobMouse
- **Blur**: BlurMouse

### By Tone

- **Professional/Premium**: Tilt3DMouse (subtle), TrackMouse (subtle), ScaleMouse
- **Playful/Fun**: BounceMouse, BlobMouse, AiryMouse
- **Game-like/Dynamic**: SpinMouse, Track3DMouse, SkewMouse
- **Experimental/Creative**: BlobMouse, SkewMouse

### By Use Case

- **Product cards/Images**: Tilt3DMouse, ScaleMouse
- **Hero section depth**: TrackMouse (multiple layers with different distances)
- **Interactive portfolios**: Tilt3DMouse, Track3DMouse
- **Playful interfaces**: BounceMouse, BlobMouse, AiryMouse
- **Decorative elements**: TrackMouse, SpinMouse
- **Focus/Attention**: ScaleMouse, BlurMouse

### Important: Mobile Fallback Strategies

Since mouse animations don't work on touch devices:

1. **Do nothing**: Element remains static on mobile (acceptable for decorative effects)
2. **Use entrance animation**: Apply FadeIn or similar on mobile instead
3. **Use device orientation**: Some effects can map to device tilt (advanced)
4. **Touch-based alternative**: Respond to touch position (requires custom implementation)

### Reduced Motion Alternatives

| Original                  | Reduced Motion Fallback      |
| ------------------------- | ---------------------------- |
| Tilt3DMouse, Track3DMouse | Disable or very subtle scale |
| TrackMouse, BounceMouse   | Disable                      |
| SpinMouse                 | Disable                      |
| All mouse animations      | Static state                 |

### Parallels in Other Categories

| Mouse       | Entrance | Scroll         | Ongoing |
| ----------- | -------- | -------------- | ------- |
| Tilt3DMouse | TiltIn   | TiltScroll     | -       |
| TrackMouse  | GlideIn  | ParallaxScroll | -       |
| BounceMouse | BounceIn | -              | Bounce  |
| SpinMouse   | SpinIn   | SpinScroll     | Spin    |
| ScaleMouse  | GrowIn   | GrowScroll     | Pulse   |
| BlurMouse   | BlurIn   | BlurScroll     | -       |
