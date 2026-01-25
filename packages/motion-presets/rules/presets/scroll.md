---
name: Scroll Animations
category: scroll
tags:
  [
    scroll,
    parallax,
    scroll-driven,
    viewport,
    scroll-reveal,
    on-scroll,
    scroll-triggered,
    storytelling,
    progressive,
  ]
---

# Scroll Animations

## Description

Scroll animations tie element transformations to the user's scroll position. Unlike entrance animations that play once, scroll animations continuously respond to scroll progress—elements can animate in as they enter the viewport, animate out as they leave, or transform throughout the entire scroll range.

Scroll animations create immersive, storytelling experiences where the user's scrolling becomes an active part of the interaction. They're powerful for landing pages, portfolios, and narrative-driven designs. However, they require careful consideration for performance and accessibility.

## Synonyms

scroll-driven animation, scroll-triggered effect, parallax effect, scroll reveal, scroll fade, on-scroll animation, viewport animation, scroll-linked animation, scroll storytelling, progressive reveal, scroll-based transition

## When to Use Scroll Animations

- **Progressive content reveals**: Elements fading/sliding in as user scrolls to them
- **Parallax depth effects**: Layered elements moving at different rates
- **Storytelling experiences**: Narrative tied to scroll progress
- **Section transitions**: Effects as user scrolls between sections
- **Emphasis on scroll progress**: Progress indicators, timeline-like reveals
- **De-emphasizing passed content**: Fading out content as user scrolls past

## When NOT to Use Scroll Animations

- **One-time entrance effects** → use Entrance animations (more performant)
- **Continuous/looping animations** → use Ongoing animations
- **Mouse-reactive elements** → use Mouse animations
- **Background media** → use Background Scroll animations
- **Mobile-first designs** → scroll animations can be janky on mobile; test carefully
- **Content that must remain readable** → avoid on text-heavy sections

## Accessibility Considerations

- **Respect `prefers-reduced-motion`**: Disable scroll animations entirely or use subtle FadeScroll only
- **Vestibular safety**: ParallaxScroll, ArcScroll, FlipScroll, SpinScroll, and Spin3dScroll can trigger motion sickness. Provide alternatives or disable for sensitive users
- **Performance impact**: Scroll animations run continuously; optimize for 60fps. Janky animations are worse than no animations
- **Content accessibility**: Ensure all content is readable without animations. Don't hide critical information behind scroll-triggered reveals
- **Keyboard navigation**: Users navigating with keyboard may not trigger scroll animations in expected ways
- **Duration of scroll range**: Don't make users scroll excessively to reveal content

## Available Presets

### ParallaxScroll

**Description**: Element moves slower/faster than scroll, creating depth illusion. Like looking through a window where distant objects move slower.
**Tags**: `parallax`, `depth`, `layered`, `continuous`, `movement`, `distance`, `speed`
**Synonyms**: parallax effect, scroll parallax, depth scroll, layered scroll, differential scroll, scroll movement

### FadeScroll

**Description**: Opacity transition tied to scroll position. Fade in on enter, fade out on exit. Smooth, cinematic content reveals.
**Tags**: `fade`, `opacity`, `reveal`, `in`, `out`, `transition`, `subtle`
**Synonyms**: scroll fade, fade on scroll, opacity scroll, scroll reveal, scroll disappear

### ArcScroll

**Description**: 3D tilt/rotation as user scrolls. Like a card tilting towards or away. Dramatic, cinematic depth effect.
**Tags**: `3d`, `arc`, `rotation`, `perspective`, `tilt`, `cinematic`, `dramatic`
**Synonyms**: scroll arc, 3d scroll, tilt scroll, rotation scroll, perspective scroll

### BlurScroll

**Description**: Blur/unblur effect controlled by scroll position. Creates focus/defocus transitions tied to scroll.
**Tags**: `blur`, `focus`, `defocus`, `soft`, `transition`, `depth`
**Synonyms**: scroll blur, blur on scroll, focus scroll, defocus scroll, blur transition

### FlipScroll

**Description**: Full 3D card flip driven by scroll. Dramatic rotation revealing content as user scrolls.
**Tags**: `flip`, `3d`, `rotation`, `card`, `dramatic`, `turn`, `reveal`
**Synonyms**: scroll flip, 3d flip scroll, card flip scroll, flip on scroll

### GrowScroll

**Description**: Scale up as element enters viewport. Element grows larger tied to scroll progress.
**Tags**: `grow`, `scale`, `zoom`, `expand`, `size`, `enlarge`, `in`
**Synonyms**: scroll grow, scale scroll, zoom scroll, grow on scroll, expand scroll

### ShrinkScroll

**Description**: Scale down as element exits viewport. Element shrinks tied to scroll progress.
**Tags**: `shrink`, `scale`, `reduce`, `minimize`, `size`, `out`
**Synonyms**: scroll shrink, scale down scroll, shrink on scroll, minimize scroll

### MoveScroll

**Description**: General translation movement on scroll. Move element in any direction tied to scroll position.
**Tags**: `move`, `translate`, `position`, `movement`, `direction`, `shift`
**Synonyms**: scroll move, translate scroll, movement scroll, position scroll

### PanScroll

**Description**: Horizontal or vertical panning effect. Element slides across tied to scroll.
**Tags**: `pan`, `horizontal`, `vertical`, `slide`, `traverse`, `sweep`
**Synonyms**: scroll pan, pan on scroll, horizontal scroll, sliding scroll

### RevealScroll

**Description**: Clip-based directional reveal on scroll. Content unveils progressively as user scrolls.
**Tags**: `reveal`, `clip`, `mask`, `directional`, `unveil`, `progressive`, `wipe`
**Synonyms**: scroll reveal, clip scroll, wipe scroll, unveil scroll, mask reveal scroll

### ShapeScroll

**Description**: Shape mask reveal controlled by scroll. Geometric shapes expanding/contracting on scroll.
**Tags**: `shape`, `mask`, `geometric`, `circle`, `expand`, `contract`
**Synonyms**: shape scroll, mask scroll, geometric reveal scroll, shape reveal

### ShuttersScroll

**Description**: Venetian blind strips revealing on scroll. Segmented progressive reveal tied to scroll.
**Tags**: `shutters`, `blinds`, `strips`, `segmented`, `progressive`, `venetian`
**Synonyms**: shutters scroll, blind scroll, strip reveal scroll, venetian scroll

### SkewPanScroll

**Description**: Panning with skew distortion effect. Movement plus angular distortion on scroll.
**Tags**: `skew`, `pan`, `distortion`, `angle`, `movement`, `warp`
**Synonyms**: skew scroll, skew pan, distortion scroll, angled pan scroll

### SlideScroll

**Description**: Slide movement tied to scroll position. Directional sliding as user scrolls.
**Tags**: `slide`, `move`, `directional`, `translate`, `shift`
**Synonyms**: scroll slide, slide on scroll, directional slide scroll

### Spin3dScroll

**Description**: 3D rotation around axis on scroll. Element rotates in 3D space as user scrolls.
**Tags**: `spin`, `3d`, `rotation`, `axis`, `revolve`, `orbit`
**Synonyms**: 3d spin scroll, rotation scroll, spin on scroll, 3d rotate scroll

### SpinScroll

**Description**: 2D rotation driven by scroll. Element spins flat as user scrolls.
**Tags**: `spin`, `rotate`, `2d`, `turn`, `circular`
**Synonyms**: scroll spin, rotate scroll, 2d spin scroll, turning scroll

### StretchScroll

**Description**: Stretch/squeeze deformation on scroll. Element distorts proportionally tied to scroll.
**Tags**: `stretch`, `squeeze`, `deform`, `distort`, `elastic`, `proportion`
**Synonyms**: stretch scroll, squeeze scroll, deform scroll, elastic scroll

### TiltScroll

**Description**: 3D tilt effect as user scrolls. Subtle perspective shift tied to scroll position.
**Tags**: `tilt`, `3d`, `perspective`, `angle`, `subtle`, `depth`
**Synonyms**: scroll tilt, 3d tilt scroll, perspective scroll, angle scroll

### TurnScroll

**Description**: Corner-pivot 3D rotation on scroll. Complex rotation with pivot point on scroll.
**Tags**: `turn`, `3d`, `corner`, `pivot`, `rotation`, `complex`
**Synonyms**: turn scroll, corner turn scroll, pivot scroll, 3d turn scroll

## Decision Guide

### By Effect Type

- **Opacity**: FadeScroll, BlurScroll
- **Movement/Position**: ParallaxScroll, MoveScroll, PanScroll, SlideScroll
- **Scale**: GrowScroll, ShrinkScroll, StretchScroll
- **3D Rotation**: ArcScroll, FlipScroll, TiltScroll, TurnScroll, Spin3dScroll
- **2D Rotation**: SpinScroll
- **Reveal/Mask**: RevealScroll, ShapeScroll, ShuttersScroll

### By Use Case

- **Depth/Layering effects**: ParallaxScroll, MoveScroll (with different speeds)
- **Content reveal**: FadeScroll (in), RevealScroll, GrowScroll
- **Dramatic/Cinematic sections**: ArcScroll, FlipScroll, TiltScroll
- **Storytelling/Timeline**: Multiple presets with coordinated ranges
- **De-emphasize passed content**: FadeScroll (out), ShrinkScroll, BlurScroll (out)
- **Hero sections**: ArcScroll, TiltScroll, GrowScroll

### Range Modes

Most scroll presets support range modes that control when the animation occurs:

- **`in`**: Animates as element enters viewport (0% → 50% visibility)
- **`out`**: Animates as element exits viewport (50% → 100% visibility)
- **`continuous`**: Animates throughout entire scroll range (0% → 100%)

Custom `start` and `end` values allow fine-tuning the scroll range.

### Reduced Motion Alternatives

| Original                            | Reduced Motion Fallback   |
| ----------------------------------- | ------------------------- |
| ParallaxScroll                      | Disable (static position) |
| ArcScroll, FlipScroll, Spin3dScroll | FadeScroll or disable     |
| SpinScroll                          | Disable                   |
| TiltScroll, TurnScroll              | FadeScroll                |
| GrowScroll, ShrinkScroll            | FadeScroll                |

### Parallels in Other Categories

| Scroll         | Entrance | Ongoing | Background |
| -------------- | -------- | ------- | ---------- |
| FadeScroll     | FadeIn   | -       | BgFade     |
| ArcScroll      | ArcIn    | -       | -          |
| ParallaxScroll | -        | -       | BgParallax |
| TiltScroll     | TiltIn   | -       | -          |
| FlipScroll     | FlipIn   | Flip    | -          |
| GrowScroll     | GrowIn   | -       | BgZoom     |
| SpinScroll     | SpinIn   | Spin    | BgRotate   |
| RevealScroll   | RevealIn | -       | BgReveal   |
| BlurScroll     | BlurIn   | -       | -          |
