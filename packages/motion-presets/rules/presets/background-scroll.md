---
name: Background Scroll Animations
category: backgroundScroll
tags: [background, bg, scroll, section, hero, media, image, video, fullwidth, cinematic]
---

# Background Scroll Animations

## Description

Background Scroll animations are specifically designed for animating background media (images and videos) in response to scroll position. They're optimized for full-width section backgrounds and create immersive, cinematic effects as users scroll through a page.

These differ from regular Scroll animations in that they target the background layer of a container rather than the element itself. They're perfect for hero sections, full-bleed images, and creating depth between content and backgrounds.

## Synonyms

background animation, bg scroll effect, background parallax, section background, hero background, scroll background, media background animation, full-width background, background reveal, cinematic background

## When to Use Background Scroll Animations

- **Hero sections**: Landing page heroes with depth/movement
- **Full-width section backgrounds**: Sections with background images/videos
- **Cinematic storytelling**: Narrative pages with immersive backgrounds
- **Portfolio/Photography**: Showcasing images with scroll-driven effects
- **Section transitions**: Visual interest between content sections
- **Depth/Layering**: Creating separation between background and content

## When NOT to Use Background Scroll Animations

- **Regular content elements** → use Scroll animations instead
- **Non-media backgrounds** → color backgrounds don't benefit from these
- **Mobile with performance concerns** → background effects are heavy; test carefully
- **Text-heavy sections** → effects may distract from reading
- **Multiple animated backgrounds** → performance and visual overload
- **Small background areas** → effects are less noticeable, not worth the cost

## Accessibility Considerations

- **Respect `prefers-reduced-motion`**: Disable all background scroll animations or use only subtle BgFade
- **Vestibular triggers**: BgParallax, BgZoom, BgRotate, and BgFake3D can trigger motion sickness. These effects are particularly problematic because they affect large areas of the screen
- **Performance on low-end devices**: Background animations are computationally expensive. Provide graceful degradation
- **Content readability**: Ensure text overlaying animated backgrounds remains readable throughout the scroll range
- **Contrast maintenance**: Animated backgrounds shouldn't cause text contrast to drop below WCAG requirements
- **Video backgrounds**: If using video, ensure it doesn't autoplay with sound and provide pause controls

## Available Presets

### BgParallax

- **Description**: Background moves slower than scroll creating depth illusion. Like background is further away than foreground content.
- **Tags**: `parallax`, `depth`, `movement`, `slow`, `layer`, `distance`, `immersive`
- **Synonyms**: background parallax, bg parallax, background scroll, parallax background, depth background

### BgZoom

- **Description**: Background zooms in/out as user scrolls. Cinematic dolly-like effect, camera moving towards/away.
- **Tags**: `zoom`, `scale`, `dolly`, `cinematic`, `dramatic`, `approach`, `retreat`
- **Synonyms**: background zoom, bg zoom, zoom scroll, dolly zoom, zoom effect background, ken burns scroll

### BgFade

- **Description**: Background opacity transition on scroll. Subtle fade in/out as section enters/exits viewport.
- **Tags**: `fade`, `opacity`, `transition`, `subtle`, `reveal`, `in`, `out`
- **Synonyms**: background fade, bg fade, fade background, background opacity, background reveal

### BgFadeBack

- **Description**: Fade targeting back layer specifically. For layered backgrounds with separate fade control.
- **Tags**: `fade`, `back`, `layer`, `opacity`, `separate`, `control`
- **Synonyms**: bg fade back, back layer fade, layered fade, separate layer fade

### BgPan

- **Description**: Horizontal/vertical background panning. Background slides across as user scrolls.
- **Tags**: `pan`, `horizontal`, `vertical`, `slide`, `movement`, `traverse`
- **Synonyms**: background pan, bg pan, pan scroll, horizontal background, sliding background

### BgRotate

- **Description**: Background rotation driven by scroll. Dynamic unusual effect, background spins with scroll.
- **Tags**: `rotate`, `spin`, `dynamic`, `unusual`, `creative`, `turn`
- **Synonyms**: background rotate, bg rotate, spin background, rotation scroll, turning background

### BgSkew

- **Description**: Background skew distortion on scroll. Experimental angled distortion effect.
- **Tags**: `skew`, `distortion`, `angle`, `experimental`, `warp`, `tilt`
- **Synonyms**: background skew, bg skew, skew scroll, distortion background, angled background

### BgReveal

- **Description**: Clip-based background reveal. Theatrical curtain-like unveiling of background.
- **Tags**: `reveal`, `clip`, `mask`, `theatrical`, `curtain`, `unveil`, `progressive`
- **Synonyms**: background reveal, bg reveal, clip reveal, curtain background, unveiling background

### BgCloseUp

- **Description**: Alternative zoom implementation. Cinematic close-up approach effect on background.
- **Tags**: `closeup`, `zoom`, `cinematic`, `approach`, `alternative`, `scale`
- **Synonyms**: bg close up, close up zoom, cinematic closeup, approach zoom

### BgPullBack

- **Description**: Reverse zoom (pulling away). Expansive revealing effect, camera retreating from background.
- **Tags**: `pullback`, `zoom`, `reverse`, `expansive`, `retreat`, `reveal`, `wide`
- **Synonyms**: bg pull back, pull back zoom, reverse zoom, expansive reveal, retreat zoom

### BgFake3D

- **Description**: Simulated 3D depth layers. Immersive parallax-enhanced depth simulation.
- **Tags**: `fake3d`, `depth`, `layers`, `immersive`, `3d`, `parallax`, `simulation`
- **Synonyms**: bg fake 3d, simulated 3d, depth layers, immersive background, 3d parallax

### ImageParallax

- **Description**: Parallax for regular img elements (not CSS backgrounds). Same parallax effect for inline images.
- **Tags**: `image`, `parallax`, `img`, `inline`, `element`, `depth`
- **Synonyms**: image parallax, img parallax, inline image parallax, element parallax

## Decision Guide

### By Effect Type

- **Movement/Depth**: BgParallax, BgPan, ImageParallax, BgFake3D
- **Scale/Zoom**: BgZoom, BgCloseUp, BgPullBack
- **Opacity**: BgFade, BgFadeBack
- **Rotation**: BgRotate
- **Distortion**: BgSkew
- **Reveal/Mask**: BgReveal

### By Use Case

- **Depth/Immersion**: BgParallax (most common), BgFake3D
- **Cinematic reveals**: BgZoom, BgCloseUp, BgReveal, BgPullBack
- **Section transitions**: BgFade, BgFadeBack
- **Creative/Experimental**: BgSkew, BgRotate
- **Horizontal storytelling**: BgPan

### Background vs Regular Element Animations

| Use Background Scroll for...       | Use regular Scroll for...      |
| ---------------------------------- | ------------------------------ |
| `background-image` on sections     | `<img>` elements in flow       |
| CSS background media               | Content that scrolls with page |
| Full-width/full-height backgrounds | Individual elements            |
| Media behind content               | Media as content               |

**Exception**: `ImageParallax` is in this category but works on regular `<img>` elements, not CSS backgrounds.

### Reduced Motion Alternatives

| Original                      | Reduced Motion Fallback     |
| ----------------------------- | --------------------------- |
| BgParallax                    | Static background (disable) |
| BgZoom, BgCloseUp, BgPullBack | BgFade or static            |
| BgRotate, BgSkew              | Disable                     |
| BgFake3D                      | Static or subtle BgParallax |
| BgFade                        | Keep (it's already subtle)  |

### Parallels in Other Categories

| Background | Scroll         | Entrance |
| ---------- | -------------- | -------- |
| BgParallax | ParallaxScroll | -        |
| BgZoom     | GrowScroll     | GrowIn   |
| BgFade     | FadeScroll     | FadeIn   |
| BgReveal   | RevealScroll   | RevealIn |
| BgRotate   | SpinScroll     | SpinIn   |
