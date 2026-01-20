---
name: Generate LLM Preset Rules
overview: Create two-level rule files (category + preset) optimized for LLM decision flow.
todos:
  - id: restructure
    content: "Restructure: Create category files, update existing preset files to new format"
    status: pending
  - id: category-entrance
    content: "Create entrance.md category file with decision guide"
    status: pending
  - id: category-scroll
    content: "Create scroll.md category file with decision guide"
    status: pending
  - id: category-ongoing
    content: "Create ongoing.md category file with decision guide"
    status: pending
  - id: category-mouse
    content: "Create mouse.md category file with decision guide"
    status: pending
  - id: category-background
    content: "Create background-scroll.md category file with decision guide"
    status: pending
  - id: update-presets
    content: "Update existing preset files to simplified format (remove when-to-use, alternatives)"
    status: pending
  - id: review
    content: "Review new structure with user"
    status: pending
  - id: generate-remaining
    content: "Generate remaining preset files"
    status: pending
---

# Generate LLM Rules for Motion Presets

## Execution Phases

### Phase 1: Create Category Files (Current)

Create 5 category-level files with decision guides:

- `entrance.md` - Decision guide for 24 entrance presets
- `scroll.md` - Decision guide for 20 scroll presets
- `ongoing.md` - Decision guide for 14 ongoing presets
- `mouse.md` - Decision guide for 13 mouse presets
- `background-scroll.md` - Decision guide for 12 background-scroll presets

### Phase 2: Update Existing Preset Files

Update the 15 pilot preset files to the simplified format:

- Remove: When to Use, When NOT to Use, Related Presets, Decision Hints
- Keep: Visual Description, Parameters, Examples

### Phase 3: Review & Complete

- Review new structure with user
- Generate remaining ~70 preset files

---

## Structure Overview

**Two-level hierarchy optimized for LLM decision flow:**

### Level 1: Category Files (Decision Layer)

- `rules/presets/entrance.md` - When to use entrance, comparison of all 24 presets
- `rules/presets/scroll.md` - When to use scroll, comparison of all 20 presets
- `rules/presets/ongoing.md` - When to use ongoing, comparison of all 14 presets
- `rules/presets/mouse.md` - When to use mouse, comparison of all 13 presets
- `rules/presets/background-scroll.md` - When to use background-scroll, comparison of all 12 presets

### Level 2: Preset Files (Detail Layer)

- `rules/presets/entrance/arc-in.md` - Visual description, parameters, examples
- `rules/presets/entrance/fade-in.md` - Visual description, parameters, examples
- etc.

**Why this structure?**
LLM decision flow is a waterfall - it won't read all preset descriptions before selecting. It needs:

1. First: "Which category?" → Read category file
2. Then: "Which preset?" → Use decision table in category file
3. Finally: "How to configure?" → Read specific preset file

## Category File Format

Each category file guides the LLM to select the right preset.

---

### Category File Sections

#### 1. Header (YAML frontmatter)

```yaml
name: Entrance Animations
category: entrance
tags: [appear, reveal, enter, load, show, intro, page-load, modal, popup]
```

Tags help LLM match user intent via semantic search.

#### 2. Description & Synonyms

Verbose overview of the category with alternative phrasings:

```markdown
## Description

Entrance animations bring elements into view for the first time. They create the initial 
impression and set the tone for user interaction. These are one-shot animations that play 
once when an element first appears.

## Synonyms

appear animation, reveal effect, intro animation, show animation, enter animation, 
page load animation, element appearance, fade in effect, loading animation
```

#### 3. When to Use This Category

When should an LLM choose this category over others:

```markdown
## When to Use Entrance Animations

- Elements appearing for the first time on page load
- Modal/overlay/popup appearances
- Content revealing after user action (click, tab switch)
- Elements entering viewport (triggered once, not scroll-driven)
- First-time visibility of lazy-loaded content

## When NOT to Use

- Scroll-driven reveals → use Scroll animations
- Continuous/looping animations → use Ongoing animations
- Mouse-reactive elements → use Mouse animations
- Background media → use Background Scroll animations
```

#### 4. Accessibility Considerations

Important for inclusive design:

```markdown
## Accessibility Considerations

- **Respect prefers-reduced-motion**: Use FadeIn as fallback or disable animations entirely
- **Duration guidelines**: Keep under 500ms for functional UI, up to 1200ms for decorative
- **Avoid vestibular triggers**: Limit large-scale movement, spinning, parallax for motion-sensitive users
- **Focus management**: Ensure animated elements don't interfere with keyboard focus order
- **Screen readers**: Animations are visual-only; ensure content is accessible without them
```

#### 5. Preset List with Tags and Synonyms

Each preset as a block with description, tags, and synonyms for LLM matching:

```markdown
## Available Presets

### FadeIn
**Description**: Gradual opacity transition from invisible to visible. Universal, subtle, accessibility-safe.
**Tags**: `fade`, `opacity`, `subtle`, `simple`, `professional`, `minimal`, `appear`
**Synonyms**: fade in, appear, materialize, opacity transition, gentle reveal, soft entrance

### ArcIn
**Description**: 3D curved swing like a door opening. Dramatic, cinematic, creates depth.
**Tags**: `3d`, `arc`, `curved`, `dramatic`, `cinematic`, `perspective`, `rotation`, `premium`
**Synonyms**: arc entrance, curved reveal, swing in, cinematic entrance, perspective reveal

...
```

This format is optimal for LLM intent matching - tags and synonyms are explicitly labeled and grouped with each preset.

#### 6. Decision Guide

Help LLM choose between presets:

```markdown
## Decision Guide

### By Tone
- **Subtle/Professional**: FadeIn, BlurIn, SlideIn
- **Dramatic/Cinematic**: ArcIn, FlipIn, TurnIn
- **Playful/Energetic**: BounceIn, SpinIn, PunchIn

### By Use Case
- **Hero sections**: ArcIn, ExpandIn, GrowIn
- **Modals/Overlays**: FadeIn, DropIn
- **List items**: FadeIn, SlideIn (with stagger)
- **Notifications**: BounceIn, PunchIn

### Reduced Motion Alternatives
Always provide a reduced-motion fallback:
- Complex animations → FadeIn
- Movement-based → FadeIn or no animation
- 3D/Spinning → FadeIn

### Parallels in Other Categories
| Entrance | Scroll Equivalent | Mouse Equivalent |
|----------|-------------------|------------------|
| ArcIn | ArcScroll | - |
| FadeIn | FadeScroll | - |
| SpinIn | SpinScroll | SpinMouse |
```

---

### Preset File Sections

Each preset file contains the details needed AFTER the LLM has decided to use this preset.
Since category files handle decision-making, preset files can be more verbose about implementation details.

#### 1. Preset Header (YAML frontmatter)

```yaml
name: ArcIn
category: entrance
```

#### 2. Visual Description (Human-written, verbose)

**Describe what the user SEES in plain, non-technical language.** Be detailed and use analogies.

**DO describe:**

- What the element looks like at the start, middle, and end
- The path or direction of movement
- The overall feeling (smooth, bouncy, dramatic)
- Real-world analogies (like a door opening, a ball bouncing, etc.)
- How opacity, scale, rotation, and position change

**DO NOT reference:**

- CSS properties (translateY, perspective, rotateX)
- Keyframe percentages or offsets
- Easing function names (unless explaining power/easing parameter)
- Internal implementation details

**Example:**
> Element swings into view along a curved path, like a door opening towards you. At the start,
> the element is invisible and tilted away (as if rotated back into the screen). As the animation
> plays, it gradually rotates forward while simultaneously fading in. The element follows an arc
> trajectory rather than moving in a straight line, creating a sense of depth and dimension.
> By the end, it settles flat and fully visible in its final position. The motion feels cinematic
> and dramatic, best suited for hero elements that need to make an impression.

#### 3. Parameters (detailed)

**Use TypeScript notation.** Pull min/max/step/enum from `@wix/effects-kit`.
Include comprehensive parameter impact notes explaining what each value does visually.

```typescript
interface ArcIn {
  direction: 'top' | 'right' | 'bottom' | 'left';  // default: 'left'
  power?: 'soft' | 'medium' | 'hard';              // default: 'medium'
  duration?: number;   // ms, min: 0, max: 4000, step: 100, default: 1200
  delay?: number;      // ms, min: 0, max: 8000, step: 100, default: 0
}
```

**Parameter Impact (verbose):**

- `direction`: Controls which edge the element appears to swing from
  - `top`: Element tilts forward (rotates on X-axis), appears to fall into place from above
  - `bottom`: Element tilts backward, appears to rise up from below
  - `left`: Element tilts sideways (rotates on Y-axis), swings in from the left
  - `right`: Element tilts opposite direction, swings in from the right
- `power`: Controls how dramatic the rotation and arc appear
  - `soft`: Subtle 15° rotation, gentle arc - good for supporting content
  - `medium`: Balanced 30° rotation - the sweet spot for most uses
  - `hard`: Dramatic 45° rotation with slight overshoot - attention-grabbing
- `duration`: How long the animation takes (1200ms default is cinematic, 600ms is snappy)
- `delay`: Wait time before animation starts (useful for staggered sequences)

#### 4. Best Practices

Tips for effective use of this specific preset:

```markdown
## Best Practices

- Use on single focal elements, not multiple simultaneous items
- Combine with stagger delay for sequential reveals
- Consider `power: 'soft'` for mobile devices
- Pair with complementary exit animation if element will be removed
```

#### 5. Examples (with context)

Include examples with explanatory comments:

```typescript
// Basic usage - element swings in from bottom
{ type: 'ArcIn', direction: 'bottom' }

// Hero section - dramatic entrance from side
{ type: 'ArcIn', direction: 'left', power: 'hard' }

// Subtle supporting content
{ type: 'ArcIn', direction: 'top', power: 'soft', duration: 800 }

// Staggered cards (apply to each with increasing delay)
{ type: 'ArcIn', direction: 'bottom', delay: 0 }    // Card 1
{ type: 'ArcIn', direction: 'bottom', delay: 100 }  // Card 2
{ type: 'ArcIn', direction: 'bottom', delay: 200 }  // Card 3
```

**Note:** "When to use", "When not to use", "Alternatives", and "Decision hints" remain in the **category file**.

---

---

## Sample Files

### Sample Category File: entrance.md

```markdown
---
name: Entrance Animations
category: entrance
---

# Entrance Animations

## When to Use Entrance Animations

- Elements appearing for the first time on page load
- Modal/overlay appearances
- Content revealing after user action
- Triggered once (not continuous or scroll-driven)

## Available Presets

| Preset | Description |
|--------|-------------|
| FadeIn | Gradual opacity transition, subtle and universal |
| ArcIn | 3D curved swing, dramatic and cinematic |
| BounceIn | Playful bouncing, energetic |
| SlideIn | Straight movement from direction |
| FlipIn | 3D flip rotation |
| ... | ... |

## Decision Guide

### By Tone
- **Subtle/Professional**: FadeIn, BlurIn, SlideIn
- **Dramatic/Cinematic**: ArcIn, FlipIn, TurnIn
- **Playful/Energetic**: BounceIn, SpinIn, PunchIn

### By Use Case
- **Hero sections**: ArcIn, ExpandIn, GrowIn
- **Modals/Overlays**: FadeIn, DropIn
- **List items (staggered)**: FadeIn, SlideIn
- **Notifications/Badges**: BounceIn, PunchIn

### Parallels in Other Categories

| Entrance | Scroll | Mouse |
|----------|--------|-------|
| ArcIn | ArcScroll | - |
| FadeIn | FadeScroll | - |
| SpinIn | SpinScroll | SpinMouse |
| - | ParallaxScroll | TrackMouse |
```

---

### Sample Preset File: entrance/arc-in.md

```markdown
---
name: ArcIn
category: entrance
---

# ArcIn

## Visual Description

Element swings into view along a curved path, like a door opening towards you. 
It starts tilted away and gradually flattens as it settles into place. 
Fades in while moving. The effect feels dramatic and cinematic.

## Parameters

\`\`\`typescript
interface ArcIn {
  direction: 'top' | 'right' | 'bottom' | 'left';  // default: 'left'
  power?: 'soft' | 'medium' | 'hard';              // default: 'medium'
  duration?: number;   // min: 0, max: 4000, default: 1200
  delay?: number;      // min: 0, max: 8000, default: 0
}
\`\`\`

**Parameter Impact:**
- `direction`: top/bottom tilts forward/back, left/right tilts sideways
- `power`: soft = subtle, medium = noticeable, hard = dramatic

## Examples

\`\`\`typescript
// Basic
{ type: 'ArcIn', direction: 'bottom' }

// Side entry (tilts on different axis)
{ type: 'ArcIn', direction: 'left' }
\`\`\`
```

---

## File Organization

```text
rules/presets/
├── README.md                    # Master index
├── entrance.md                  # Category: when to use, decision guide
├── scroll.md                    # Category: when to use, decision guide
├── ongoing.md                   # Category: when to use, decision guide
├── mouse.md                     # Category: when to use, decision guide
├── background-scroll.md         # Category: when to use, decision guide
├── entrance/                    # Preset details (24 files)
│   ├── fade-in.md
│   ├── arc-in.md
│   └── ...
├── scroll/                      # Preset details (20 files)
│   ├── parallax-scroll.md
│   └── ...
├── ongoing/                     # Preset details (14 files)
│   ├── pulse.md
│   └── ...
├── mouse/                       # Preset details (13 files)
│   ├── tilt-3d-mouse.md
│   └── ...
└── background-scroll/           # Preset details (12 files)
    ├── bg-parallax.md
    └── ...
```

---

## Implementation Notes

### Category Files (Verbose)

1. **Header**: Include tags for semantic search matching
2. **Description & Synonyms**: Verbose overview with alternative phrasings
3. **When to Use / When NOT to Use**: Clear guidance on category selection
4. **Accessibility Considerations**: Reduced motion, vestibular safety, duration guidelines
5. **Preset List**: Brief 1-line descriptions for quick scanning
6. **Decision Guide**: Group by tone, use case, reduced-motion alternatives, cross-category parallels

### Preset Files (Verbose)

1. **Visual Description**: Detailed, use analogies, describe start/middle/end states
2. **Parameters**: TypeScript notation with comprehensive impact notes for each value
3. **Best Practices**: Tips specific to this preset
4. **Examples**: Multiple examples with explanatory comments, including stagger patterns

### Data Sources

- **Types**: `motion-presets/src/types.ts`
- **Constraints**: `effects-kit/src/effects/{category}/{preset}.ts`
- **Base params**: `effects-kit/src/effects/baseParams.ts`

### Notes on Parameter Subsets

- Direction types vary: FourDirections, FiveDirections (adds center), EightDirections (adds diagonals)
- Clipped animations (ShapeIn, RevealIn, ShuttersIn, WinkIn) exclude back easings

### Accessibility Guidelines

- Always mention `prefers-reduced-motion` media query support
- Recommend FadeIn as universal fallback
- Note vestibular triggers (spinning, parallax, large movement)
- Duration guidance: <500ms functional, <1200ms decorative
