---
name: Ongoing Animations
category: ongoing
tags:
  [ongoing, continuous, loop, looping, repeating, infinite, persistent, ambient, status, indicator]
---

# Ongoing Animations

## Description

Ongoing animations run continuously in a loop, creating persistent motion on the page. Unlike entrance animations (one-shot) or scroll animations (scroll-driven), ongoing animations repeat indefinitely until stopped. They're used to draw attention, indicate status, or add ambient visual interest.

Use ongoing animations sparingly—they constantly draw the eye and can be distracting or fatiguing if overused. They work best for single focal points like loading indicators, status badges, or attention-grabbing CTAs.

## Synonyms

continuous animation, looping animation, infinite animation, repeating animation, ambient motion, persistent animation, attention animation, status indicator, loading animation, idle animation, background motion

## When to Use Ongoing Animations

- **Loading/Processing indicators**: Spinners, progress indicators
- **Status indicators**: Live/active/online status, recording indicator
- **Attention-drawing elements**: Notification badges, important CTAs
- **Decorative ambient motion**: Background elements, illustrations
- **Waiting states**: While content loads or processes
- **Gamification elements**: Rewards, achievements, collectibles

## When NOT to Use Ongoing Animations

- **Multiple simultaneous animations** → visual chaos, distracting
- **Content that needs to be read** → motion interferes with reading
- **Professional/minimal interfaces** → may feel unprofessional
- **Mobile with battery concerns** → continuous animation drains battery
- **One-time reveals** → use Entrance animations
- **Scroll-driven effects** → use Scroll animations

## Accessibility Considerations

- **Respect `prefers-reduced-motion`**: Stop all ongoing animations or reduce to very subtle Pulse
- **Provide pause controls**: Users should be able to stop animations. WCAG 2.2.2 requires pause/stop for any motion lasting more than 5 seconds
- **Vestibular safety**: Spin, Bounce, Wiggle, and Swing can trigger motion sickness. Pulse and Flash (subtle) are safer
- **Avoid flashing**: Flash animation at high intensity or speed can trigger seizures. Never exceed 3 flashes per second
- **Attention interference**: Ongoing animations can distract users with ADHD or cognitive disabilities
- **Screen reader announcement**: Ensure status changes are announced, not just animated

## Available Presets

### Pulse

- **Description**: Gentle scale oscillation, heartbeat-like rhythm. Shrinks and expands continuously. Subtle, universal attention indicator.
- **Tags**: `pulse`, `scale`, `heartbeat`, `throb`, `attention`, `subtle`, `status`, `breathing`
- **Synonyms**: pulse effect, heartbeat, throb, breathing, scale pulse, attention pulse, pulsing

### Bounce

- **Description**: Vertical bouncing motion like a ball on trampoline. Playful, energetic, attention-grabbing continuous motion.
- **Tags**: `bounce`, `vertical`, `movement`, `playful`, `energetic`, `jump`, `hop`, `spring`
- **Synonyms**: bouncing, jumping, hopping, vertical bounce, continuous bounce, bouncy animation

### Spin

- **Description**: Continuous rotation around center. Like a wheel or loading spinner. Mechanical, precise circular motion.
- **Tags**: `spin`, `rotate`, `loading`, `circular`, `wheel`, `continuous`, `mechanical`
- **Synonyms**: spinning, rotating, rotation, circular motion, revolve, turn continuously

### Breathe

- **Description**: Slow scale in/out like breathing rhythm. Calm, organic, meditative expansion and contraction.
- **Tags**: `breathe`, `scale`, `slow`, `calm`, `organic`, `meditative`, `expansion`, `zen`
- **Synonyms**: breathing animation, slow pulse, meditation, calm scale, organic rhythm

### Flash

- **Description**: Opacity pulsing/blinking effect. Attention, warning, notification indicator through visibility changes.
- **Tags**: `flash`, `blink`, `opacity`, `attention`, `warning`, `notification`, `visibility`
- **Synonyms**: flashing, blinking, blink animation, attention flash, warning blink

### Swing

- **Description**: Rotation oscillation like a pendulum. Back and forth pivoting motion, playful rhythmic movement.
- **Tags**: `swing`, `pendulum`, `oscillation`, `rotation`, `pivot`, `rhythmic`, `back-forth`
- **Synonyms**: swinging, pendulum motion, oscillating, pivot swing, back and forth

### Wiggle

- **Description**: Horizontal shake/wiggle motion. Side-to-side movement for attention, playful "notice me" effect.
- **Tags**: `wiggle`, `shake`, `horizontal`, `attention`, `playful`, `notice`, `side-to-side`
- **Synonyms**: wiggling, shaking, horizontal shake, side wiggle, shake animation

### Flip

- **Description**: Periodic 180° flips. Card-like rotation showing front/back, dramatic periodic turn.
- **Tags**: `flip`, `rotation`, `180`, `card`, `periodic`, `turn`, `front-back`
- **Synonyms**: flipping, card flip, periodic flip, turn animation, flip cycle

### Fold

- **Description**: 3D folding motion. Paper-like folding and unfolding, creative dimensional movement.
- **Tags**: `fold`, `3d`, `paper`, `dimensional`, `creative`, `unfold`
- **Synonyms**: folding, paper fold, 3d fold, origami motion, fold animation

### Jello

- **Description**: Wobbly elastic deformation. Jiggly, bouncy distortion like gelatin wobbling.
- **Tags**: `jello`, `wobble`, `elastic`, `jiggly`, `bouncy`, `gelatin`, `deform`
- **Synonyms**: jello wobble, jiggly, elastic wobble, bouncy deform, gelatin shake

### Rubber

- **Description**: Elastic stretch effect. Springy stretching and snapping back, rubbery distortion.
- **Tags**: `rubber`, `elastic`, `stretch`, `spring`, `snap`, `distortion`
- **Synonyms**: rubber stretch, elastic animation, stretchy, springy, snap back

### Poke

- **Description**: Quick scale bump like being tapped. Brief attention "boop" effect, momentary scale spike.
- **Tags**: `poke`, `bump`, `tap`, `quick`, `attention`, `boop`, `spike`
- **Synonyms**: poke effect, bump animation, tap, boop, attention tap, quick bump

### Cross

- **Description**: X-pattern diagonal movement. Unique geometric motion crossing diagonally.
- **Tags**: `cross`, `diagonal`, `x-pattern`, `geometric`, `unique`, `movement`
- **Synonyms**: cross movement, diagonal cross, x-pattern, crossing animation

### DVD

- **Description**: Corner-to-corner bounce (DVD screensaver). Nostalgic bouncing around container, retro effect.
- **Tags**: `dvd`, `screensaver`, `corner`, `bounce`, `nostalgic`, `retro`, `container`
- **Synonyms**: dvd bounce, screensaver, corner bounce, retro bounce, dvd logo

## Decision Guide

### By Motion Type

- **Scale-based**: Pulse, Breathe, Poke, Rubber
- **Movement/Position**: Bounce, Wiggle, Cross, DVD
- **Rotation**: Spin, Swing, Flip, Fold
- **Opacity**: Flash
- **Deformation**: Jello, Rubber

### By Tone

- **Subtle/Professional**: Pulse (soft), Breathe, Flash (soft)
- **Playful/Energetic**: Bounce, Wiggle, Jello, DVD, Rubber
- **Mechanical/Technical**: Spin, Flip, Fold
- **Attention-grabbing**: Flash, Bounce, Pulse (hard), Poke

### By Use Case

- **Loading/Processing**: Spin, Pulse
- **Status indicator (live/active)**: Pulse, Breathe
- **Notification badge**: Bounce, Pulse, Poke, Flash
- **CTA emphasis**: Pulse, Bounce
- **Character/Mascot**: Bounce, Wiggle, Jello
- **Decorative background**: Spin (slow), Breathe, Float

### Reduced Motion Alternatives

| Original              | Reduced Motion Fallback                    |
| --------------------- | ------------------------------------------ |
| Spin, Swing, Flip     | Stop animation or very slow Pulse          |
| Bounce, Wiggle, Jello | Pulse (soft) or stop                       |
| Flash                 | Reduce frequency, ensure <3 flashes/second |
| DVD, Cross            | Stop animation                             |

### Parallels in Other Categories

| Ongoing | Entrance | Scroll     | Mouse       |
| ------- | -------- | ---------- | ----------- |
| Pulse   | DropIn   | GrowScroll | ScaleMouse  |
| Bounce  | BounceIn | -          | BounceMouse |
| Spin    | SpinIn   | SpinScroll | SpinMouse   |
| Flip    | FlipIn   | FlipScroll | -           |
| Flash   | FadeIn   | FadeScroll | -           |
