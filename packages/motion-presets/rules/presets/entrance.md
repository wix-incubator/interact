---
name: Entrance Animations
category: entrance
tags: [entrance, appear, reveal, enter, load, show, intro, page-load, modal, popup, first-time, visibility]
---

# Entrance Animations

## Description

Entrance animations bring elements into view for the first time. They create the initial impression and set the tone for user interaction. These are one-shot animations that play once when an element first appears, whether on page load, after a user action, or when content becomes visible.

Entrance animations are the most commonly used animation category. They help establish visual hierarchy, guide user attention, and make interfaces feel polished and responsive. A well-chosen entrance animation can make the difference between a static, lifeless page and an engaging, dynamic experience.

## Synonyms

appear animation, reveal effect, intro animation, show animation, enter animation, page load animation, element appearance, fade in effect, loading animation, first-time visibility, content reveal, emergence effect

## When to Use Entrance Animations

- **Page load reveals**: Elements appearing when the page first loads
- **Modal/overlay/popup appearances**: Dialogs, tooltips, dropdowns appearing
- **Content revealing after user action**: Click, tab switch, accordion expand
- **Elements entering viewport once**: Triggered once (not scroll-driven continuous)
- **Lazy-loaded content**: Images, cards, or sections loading asynchronously
- **State transitions**: Empty → populated states, loading → loaded

## When NOT to Use Entrance Animations

- **Scroll-driven reveals** → use Scroll animations instead
- **Continuous/looping animations** → use Ongoing animations instead
- **Mouse-reactive elements** → use Mouse animations instead
- **Background media** → use Background Scroll animations instead
- **Frequently toggled elements** → may cause animation fatigue

## Accessibility Considerations

- **Respect `prefers-reduced-motion`**: Always provide FadeIn as fallback or disable animations entirely for users who prefer reduced motion
- **Duration guidelines**: Keep animations under 500ms for functional UI elements (buttons, modals), up to 1200ms for decorative/hero content
- **Avoid vestibular triggers**: Limit large-scale movement, spinning (SpinIn), and 3D rotations for motion-sensitive users. BounceIn, ArcIn, FlipIn, and TurnIn can trigger vestibular disorders
- **Focus management**: Ensure animated elements don't interfere with keyboard focus order. Modal entrances should trap focus appropriately
- **Screen readers**: Animations are visual-only; ensure all content is accessible without them. Use `aria-live` regions for dynamic content
- **Reduced motion fallback order**: SpinIn/FlipIn → FadeIn, BounceIn → FadeIn or SlideIn, ArcIn → FadeIn

## Available Presets

### FadeIn

**Description**: Gradual opacity transition from invisible to visible. No movement or shape changes - just smooth materialization. The simplest and most universally applicable entrance.
**Tags**: `fade`, `opacity`, `subtle`, `simple`, `professional`, `minimal`, `appear`, `universal`, `accessible`
**Synonyms**: fade in, appear, materialize, opacity transition, gentle reveal, soft entrance, dissolve in

### ArcIn

**Description**: 3D curved swing like a door opening towards you. Starts tilted away and gradually flattens as it settles. Dramatic, cinematic, creates depth.
**Tags**: `3d`, `arc`, `curved`, `dramatic`, `cinematic`, `perspective`, `rotation`, `premium`, `hero`
**Synonyms**: arc entrance, curved reveal, 3d arc, swing in, cinematic entrance, perspective reveal, dramatic arc, door opening

### BlurIn

**Description**: Element transitions from blurry to sharp focus while fading in. Soft, dreamy, draws attention to the sharpening moment.
**Tags**: `blur`, `focus`, `soft`, `dreamy`, `gentle`, `elegant`, `attention`
**Synonyms**: blur reveal, focus in, soft reveal, dreamy entrance, blur to focus, defocus to focus

### BounceIn

**Description**: Playful bouncing physics - overshoots landing spot then bounces smaller and smaller until settled. Fun, energetic, attention-grabbing.
**Tags**: `bounce`, `playful`, `energetic`, `fun`, `elastic`, `spring`, `attention`, `physics`
**Synonyms**: bounce entrance, bouncy reveal, spring in, elastic entrance, playful appear, jump in, hop in

### CircleIn

**Description**: Circular mask expanding from center point to reveal element. Geometric, modern, spotlight-like effect.
**Tags**: `circle`, `mask`, `geometric`, `modern`, `spotlight`, `radial`, `reveal`
**Synonyms**: circle reveal, radial reveal, spotlight entrance, circular mask, expanding circle

### CurveIn

**Description**: Alternative curved 3D motion path. Similar to ArcIn but with different trajectory characteristics.
**Tags**: `3d`, `curve`, `path`, `motion`, `trajectory`, `cinematic`
**Synonyms**: curved entrance, path reveal, curved motion, trajectory entrance

### DropIn

**Description**: Falls from above with subtle scale/bounce on landing. Gravity-like, natural feeling entrance with soft impact.
**Tags**: `drop`, `fall`, `gravity`, `natural`, `scale`, `bounce`, `impact`, `landing`
**Synonyms**: drop entrance, fall in, gravity drop, landing animation, drop down

### ExpandIn

**Description**: Expands outward from center point. Growing, revealing, spotlight-like emergence effect.
**Tags**: `expand`, `grow`, `center`, `scale`, `emergence`, `spotlight`, `reveal`
**Synonyms**: expand entrance, growing reveal, center expand, emergence, outward growth

### FlipIn

**Description**: 3D card flip rotation to reveal element. Dramatic, reveals "other side", card-like metaphor.
**Tags**: `flip`, `3d`, `rotation`, `card`, `dramatic`, `reveal`, `turn`
**Synonyms**: flip entrance, card flip, 3d flip, flip reveal, turn over, flip animation

### FloatIn

**Description**: Gentle floating/drifting entrance. Ethereal, light, dreamy movement as if carried by air.
**Tags**: `float`, `drift`, `ethereal`, `light`, `dreamy`, `gentle`, `air`, `soft`
**Synonyms**: float entrance, drift in, floating reveal, ethereal entrance, airy entrance

### FoldIn

**Description**: Paper-folding 3D effect. Origami-like, creative, element unfolds into view.
**Tags**: `fold`, `3d`, `paper`, `origami`, `creative`, `unfold`, `dimensional`
**Synonyms**: fold entrance, paper fold, origami reveal, unfold animation, folding entrance

### GlideIn

**Description**: Smooth 2D glide from direction with angle control. Clean, directional, professional movement.
**Tags**: `glide`, `slide`, `smooth`, `directional`, `clean`, `professional`, `angle`
**Synonyms**: glide entrance, smooth slide, directional glide, angled entrance, sliding reveal

### GlitchIn

**Description**: Digital glitch/distortion effect. Edgy, tech-inspired, disruptive visual entrance.
**Tags**: `glitch`, `digital`, `distortion`, `edgy`, `tech`, `disruption`, `modern`, `cyber`
**Synonyms**: glitch entrance, digital reveal, distortion entrance, tech glitch, cyber entrance

### GrowIn

**Description**: Scale from small to full size. Expanding, emerging, element grows into existence.
**Tags**: `grow`, `scale`, `expand`, `emerge`, `size`, `zoom`, `magnify`
**Synonyms**: grow entrance, scale up, expanding entrance, zoom in, size grow, emergence

### PunchIn

**Description**: Corner-based scale with energy and impact. Impactful, attention-grabbing, punchy entrance.
**Tags**: `punch`, `impact`, `corner`, `scale`, `energy`, `attention`, `bold`, `strong`
**Synonyms**: punch entrance, impact reveal, corner punch, bold entrance, powerful entrance

### RevealIn

**Description**: Directional clip/mask reveal like a curtain opening. Theatrical, unveiling, directional exposure.
**Tags**: `reveal`, `clip`, `mask`, `curtain`, `directional`, `theatrical`, `unveil`
**Synonyms**: reveal entrance, curtain reveal, clip reveal, unveiling, mask reveal, wipe in

### ShapeIn

**Description**: Shape mask reveal (circle, square, diamond, etc.). Geometric, precise, customizable mask shapes.
**Tags**: `shape`, `mask`, `geometric`, `circle`, `square`, `diamond`, `precise`, `custom`
**Synonyms**: shape reveal, geometric reveal, mask entrance, shape mask, custom shape reveal

### ShuttersIn

**Description**: Venetian blind strip reveal. Segmented, rhythmic, strips revealing content progressively.
**Tags**: `shutters`, `blinds`, `strips`, `segmented`, `rhythmic`, `venetian`, `progressive`
**Synonyms**: shutters reveal, blind reveal, strip entrance, venetian entrance, segmented reveal

### SlideIn

**Description**: Straight movement from direction. Clean, simple, versatile directional entrance.
**Tags**: `slide`, `move`, `directional`, `clean`, `simple`, `versatile`, `translate`
**Synonyms**: slide entrance, slide in, directional slide, movement entrance, translate in

### SpinIn

**Description**: Rotating entrance with spin. Dynamic, playful, attention-grabbing rotation into view.
**Tags**: `spin`, `rotate`, `dynamic`, `playful`, `attention`, `rotation`, `turn`
**Synonyms**: spin entrance, rotating reveal, spin in, rotation entrance, twirl in

### TiltIn

**Description**: 3D tilt into view. Subtle depth, elegant perspective shift as element appears.
**Tags**: `tilt`, `3d`, `subtle`, `depth`, `elegant`, `perspective`, `angle`
**Synonyms**: tilt entrance, perspective tilt, 3d tilt, angled reveal, subtle 3d

### TurnIn

**Description**: Corner-pivot 3D rotation. Complex, dramatic, premium feeling entrance with pivot point.
**Tags**: `turn`, `3d`, `corner`, `pivot`, `dramatic`, `premium`, `complex`, `rotation`
**Synonyms**: turn entrance, corner turn, pivot reveal, 3d turn, corner rotation

### WinkIn

**Description**: Split-in-half reveal from center. Unique, eye-like opening, center-split entrance.
**Tags**: `wink`, `split`, `center`, `unique`, `eye`, `opening`, `divide`
**Synonyms**: wink entrance, split reveal, center split, eye opening, divide reveal

## Decision Guide

### By Tone

- **Subtle/Professional**: FadeIn, BlurIn, SlideIn, GlideIn, TiltIn
- **Dramatic/Cinematic**: ArcIn, FlipIn, TurnIn, FoldIn, ExpandIn
- **Playful/Energetic**: BounceIn, SpinIn, PunchIn, GlitchIn
- **Geometric/Modern**: CircleIn, ShapeIn, RevealIn, ShuttersIn, WinkIn
- **Soft/Dreamy**: FloatIn, BlurIn, FadeIn

### By Use Case

- **Hero sections**: ArcIn, ExpandIn, GrowIn, FloatIn, RevealIn
- **Modals/Overlays**: FadeIn, DropIn, GrowIn, SlideIn
- **List items (staggered)**: FadeIn, SlideIn, GlideIn
- **Notifications/Badges**: BounceIn, PunchIn, DropIn
- **Cards**: FlipIn, ArcIn, TiltIn, FadeIn
- **Images/Media**: RevealIn, ShapeIn, ShuttersIn, CircleIn, BlurIn
- **Text content**: FadeIn, SlideIn, BlurIn
- **CTAs/Buttons**: BounceIn, PunchIn, GrowIn

### Reduced Motion Alternatives

Always provide a reduced-motion fallback. Recommended mappings:

| Original | Reduced Motion Fallback |
|----------|------------------------|
| BounceIn, SpinIn, PunchIn | FadeIn |
| ArcIn, FlipIn, TurnIn | FadeIn |
| SlideIn, GlideIn | FadeIn (or keep with shorter duration) |
| ShuttersIn, ShapeIn | FadeIn |
| GlitchIn | FadeIn |

### Parallels in Other Categories

| Entrance | Scroll | Ongoing | Mouse |
|----------|--------|---------|-------|
| ArcIn | ArcScroll | - | - |
| FadeIn | FadeScroll | Flash | - |
| SpinIn | SpinScroll | Spin | SpinMouse |
| BounceIn | - | Bounce | BounceMouse |
| TiltIn | TiltScroll | - | Tilt3DMouse |
| FlipIn | FlipScroll | Flip | - |
| GrowIn | GrowScroll | - | ScaleMouse |
| SlideIn | SlideScroll | - | TrackMouse |
| BlurIn | BlurScroll | - | BlurMouse |
| RevealIn | RevealScroll | - | - |
