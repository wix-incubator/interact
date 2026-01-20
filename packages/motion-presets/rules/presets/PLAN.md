---
name: Generate LLM Preset Rules
overview: Create concise, structured rule files for all 83 motion presets to help LLMs understand when to use each preset and generate appropriate implementation code.
todos:
  - id: setup
    content: Create directory structure and copy plan to rules/presets/
    status: in_progress
  - id: pilot-entrance
    content: "PILOT: Generate 2-3 entrance rules (FadeIn, ArcIn, BounceIn) for review"
    status: pending
  - id: pilot-scroll
    content: "PILOT: Generate 2-3 scroll rules (ParallaxScroll, FadeScroll, ArcScroll)"
    status: pending
  - id: pilot-ongoing
    content: "PILOT: Generate 2-3 ongoing rules (Pulse, Bounce, Spin)"
    status: pending
  - id: pilot-mouse
    content: "PILOT: Generate 2-3 mouse rules (Tilt3DMouse, TrackMouse, BounceMouse)"
    status: pending
  - id: pilot-background
    content: "PILOT: Generate 2-3 background-scroll rules (BgParallax, BgZoom, BgFade)"
    status: pending
  - id: review
    content: Review pilot files with user, adjust format if needed
    status: pending
  - id: generate-remaining
    content: Generate remaining ~70 preset rule files
    status: pending
  - id: create-index
    content: Create master index/README in rules/presets/
    status: pending
---

# Generate LLM Rules for Motion Presets

## Execution Phases

### Phase 1: Pilot (Current)

Generate 2-3 sample rule files per category to validate format:

| Category | Pilot Presets |

|----------|---------------|

| entrance | FadeIn, ArcIn, BounceIn |

| scroll | ParallaxScroll, FadeScroll, ArcScroll |

| ongoing | Pulse, Bounce, Spin |

| mouse | Tilt3DMouse, TrackMouse, BounceMouse |

| background-scroll | BgParallax, BgZoom, BgFade |

**Total pilot files: ~14 files**

### Phase 2: Review

Review pilot files, adjust format based on feedback.

### Phase 3: Complete Generation

Generate remaining ~70 preset rule files + master index.

---

## Structure Overview

Create rule markdown files mirroring the docs structure:

- `rules/presets/entrance/` (24 presets)
- `rules/presets/scroll/` (20 presets)
- `rules/presets/ongoing/` (14 presets)
- `rules/presets/mouse/` (13 presets)
- `rules/presets/background-scroll/` (12 presets)

## Rule File Format

Each rule file will be optimized for LLM token efficiency.

---

### 1. Header (YAML frontmatter)

```yaml
name: PresetName
category: entrance | scroll | ongoing | mouse | backgroundScroll
tags: [tag1, tag2, tag3, ...]  # Semantic search keywords
```

Tags are searchable intent keywords to help LLM match user requests:

- Motion type: `fade`, `slide`, `rotate`, `scale`, `3d`, `blur`
- Tone: `subtle`, `dramatic`, `playful`, `professional`
- Context: `entrance`, `hero`, `modal`, `cards`, `list-items`

---

### 2. Synonyms

Natural language variations to help LLM match user intent (3-7 alternatives):

```markdown
## Synonyms
fade in, appear, materialize, opacity transition, gentle reveal
```

---

### 3. Visual Description (Human-written)

**This section requires manual writing.** Describe exactly what the user SEES with specific cues:

- **Opacity**: Does it fade? From what to what?
- **Movement**: Direction, distance, path (straight, curved, arc)
- **Rotation**: Axis (X, Y, Z), degrees, perspective
- **Scale**: Grows, shrinks, from what size?
- **Timing feel**: Smooth, bouncy, snappy, elastic

Example for ArcIn:

> Element swings into view along a curved 3D arc path. Starts rotated on an axis (determined by direction), then rotates back to flat while moving along the arc. Includes a fade from transparent to opaque during the first 70% of the animation. Creates a dramatic, cinematic reveal with depth.

---

### 4. When to Use

Bulleted decision criteria for LLM to recommend this preset:

- User intent keywords (what they might ask for)
- Content type suitability (hero, cards, text, images)
- Design context (landing page, modal, dashboard)
- Emotional/brand tone match

Include **confidence scenarios** inline:

```markdown
- Hero sections requiring dramatic entrance (high confidence)
- Modal content reveal (medium confidence - consider FadeIn for subtler effect)
```

---

### 5. When NOT to Use

Anti-patterns and limitations:

- Accessibility concerns (vestibular, motion sensitivity)
- Performance issues (many elements, mobile)
- Design mismatches (too dramatic for subtle UI)
- Better alternatives (suggest specific presets)

---

### 6. Parameters

**Use TypeScript notation.** Pull min/max/step/enum from `@wix/effects-kit` ([wix-private/wow-libs/effects-kit](https://github.com/wix-private/wow-libs/tree/master/packages/effects-kit)).

**IMPORTANT: Parameter Subsets Vary Per Preset**

Different presets support different subsets of enum values:

**Direction variants:**

- `EffectFourDirections`: `'top' | 'right' | 'bottom' | 'left'`
- `EffectFiveDirections`: adds `'center'`
- `EffectEightDirections`: adds diagonals `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`
- `EffectNineDirections`: eight + `'center'`
- `EffectFourCorners`: `'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`
- `EffectTwoDirections`: `'left' | 'right'`
- `EffectTwoAxes`: `'horizontal' | 'vertical'`

**Easing variants:**

- Full easing set available for most presets
- **Clipped/masked animations** (ShapeIn, RevealIn, ShuttersIn, etc.) exclude `backOut`, `backIn`, `backInOut` because overshoot breaks the clip boundary
- Some presets have preset-specific easing maps tied to `power` levels

Always document the **exact subset** supported by each preset, not the base type.

Example:

```typescript
interface ArcIn {
  direction: 'top' | 'right' | 'bottom' | 'left';  // EffectFourDirections, default: 'left'
  power?: 'soft' | 'medium' | 'hard';              // default: 'medium'
  // Inherited from base
  duration?: number;   // min: 0, max: 4000, step: 100, default: 1200
  delay?: number;      // min: 0, max: 8000, step: 100, default: 0
  easing?: Easing;     // default: 'quintInOut'
}
```

Add brief impact notes:

- `direction`: Determines rotation axis and arc path origin
- `power`: Controls rotation intensity (soft: 15°, medium: 30°, hard: 45°)

---

### 7. Minimal Examples

2-3 terse, copy-paste ready snippets:

```typescript
// Basic - minimal config
{ type: 'ArcIn', direction: 'bottom' }

// Dramatic hero entrance
{ type: 'ArcIn', direction: 'bottom', power: 'hard' }
// with: duration: 1400, easing: 'quintOut'

// Subtle side panel
{ type: 'ArcIn', direction: 'left', power: 'soft' }
// with: duration: 800
```

---

### 8. Related Presets

**Specifically highlight parallel presets across triggers:**

```markdown
## Related Presets

### Same Category (Entrance)
- **FlipIn** - Simpler 3D flip without arc motion
- **TurnIn** - Corner-based 3D rotation, more complex

### Parallel in Other Triggers
- **ArcScroll** (scroll) - Same arc motion, scroll-driven
- **TiltScroll** (scroll) - Similar 3D tilt, scroll-driven

### Alternatives
- **FadeIn** - When subtle is needed over dramatic
- **SlideIn** - When 2D motion is preferred over 3D
```

---

### 9. Decision Hints (Optional)

Help LLM navigate similar presets:

```yaml
choose_this_when:
  - "user wants 3D dramatic entrance"
  - "hero section needs cinematic reveal"
  - "premium/luxury brand feel"

choose_alternative_when:
  - "subtle needed" → FadeIn, BlurIn
  - "2D motion preferred" → SlideIn, GlideIn  
  - "playful/bouncy" → BounceIn
  - "scroll-driven" → ArcScroll
```

---

## Data Sources

### From `motion-presets/src/types.ts`

- TypeScript interface definitions
- Parameter types and optionality

### From `motion-presets/src/library/{category}/{Preset}.ts`

- Default values in implementation
- Keyframe analysis for visual description cues
- Easing maps

### From `effects-kit/src/effects/{category}/{preset}.ts`

- `min`, `max`, `step` constraints
- `enum` options (check each preset - they override base enums!)
- `default` and `mobileDefault` values
- `units` for number-with-unit types
- Preset-specific schema overrides

### From `effects-kit/src/effects/baseParams.ts`

Common parameters (but presets may use subsets):

- `duration`: min: 0, max: 4000, step: 100
- `delay`: min: 0, max: 8000, step: 100
- `power`: enum: `['soft', 'medium', 'hard']`
- `easing`: full set (but clipped animations exclude `back*` easings)

**Direction base types:**

- `directionFourSides`: `['left', 'right', 'top', 'bottom']`
- `directionFiveSides`: four + `'center'`
- `directionEightSides`: four + diagonals
- `directionNineSides`: eight + `'center'`
- `directionFourCorners`: `['top-left', 'top-right', 'bottom-left', 'bottom-right']`
- `directionTwoSides`: `['left', 'right']`
- `directionTwoAxes`: `['horizontal', 'vertical']`

**Easing base types:**

- `easing`: full set including `backIn`, `backOut`, `backInOut`
- `easingExcludingBackOut`: for clipped/masked animations

---

## Sample Rule File

> **See**: [rules/presets/entrance/arc-in.md](rules/presets/entrance/arc-in.md) after generation

<details>

<summary><strong>Click to expand full sample: arc-in.md</strong></summary>

**Frontmatter:**

```yaml
name: ArcIn
category: entrance
tags: [3d, arc, curved, dramatic, cinematic, perspective, rotation, entrance]
```

**Synonyms:**

> arc entrance, curved reveal, 3d arc, swing in, cinematic entrance, perspective reveal

**Visual Description:**

> Element swings into view along a curved 3D arc path. Starts rotated on an axis (X for top/bottom, Y for left/right) then rotates back to flat while moving along the arc. Includes opacity fade from 0 to 1 during the first 70% of animation. The perspective (800px) creates depth. Power level controls rotation intensity: soft ~15°, medium ~30°, hard ~45°. Movement feels smooth and cinematic with quintInOut easing.

**When to Use:**

- Hero sections requiring dramatic, cinematic entrance (high confidence)
- Premium product showcases where depth and drama matter
- Portfolio pieces and creative presentations
- Featured content that needs to stand out
- Modal content reveal (medium confidence - consider FadeIn for subtler effect)

**When NOT to Use:**

- Multiple simultaneous elements (performance concern)
- Users with vestibular sensitivity (reduced-motion alternative: FadeIn)
- Subtle, professional interfaces where drama is inappropriate
- Mobile with many animated elements
- When 2D motion would suffice (use SlideIn, GlideIn instead)

**Parameters:**

```typescript
interface ArcIn {
  direction: 'top' | 'right' | 'bottom' | 'left';  // EffectFourDirections, default: 'left'
  power?: 'soft' | 'medium' | 'hard';              // default: 'medium'
  duration?: number;   // min: 0, max: 4000, step: 100, default: 1200
  delay?: number;      // min: 0, max: 8000, step: 100, default: 0
  easing?: Easing;     // full set supported, default: 'quintInOut'
}
```

**Parameter Impact:**

- `direction`: Determines rotation axis (top/bottom = X-axis, left/right = Y-axis) and arc origin
- `power`: Rotation intensity - soft: subtle tilt, medium: noticeable arc, hard: dramatic swing

**Minimal Examples:**

```typescript
// Basic
{ type: 'ArcIn', direction: 'bottom' }

// Dramatic hero
{ type: 'ArcIn', direction: 'bottom', power: 'hard' }
// duration: 1400, easing: 'quintOut'

// Subtle side entry  
{ type: 'ArcIn', direction: 'left', power: 'soft' }
// duration: 800
```

**Related Presets:**

| Category | Preset | Comparison |

|----------|--------|------------|

| Same (Entrance) | FlipIn | Simpler 3D flip, no arc path |

| Same (Entrance) | TurnIn | Corner-based 3D rotation |

| Same (Entrance) | CurveIn | Alternative curved 3D motion |

| Parallel (Scroll) | ArcScroll | Arc motion driven by scroll position |

| Parallel (Scroll) | TiltScroll | 3D tilt on scroll |

| Alternative | FadeIn | When subtle is needed |

| Alternative | SlideIn | When 2D motion preferred |

| Alternative | GlideIn | Smooth 2D glide with direction control |

**Decision Hints:**

```yaml
choose_this_when:
  - "dramatic 3D entrance needed"
  - "hero/featured content"
  - "cinematic feel"
  - "premium brand"

choose_alternative_when:
  - subtle_needed: FadeIn, BlurIn
  - 2d_preferred: SlideIn, GlideIn
  - playful_bouncy: BounceIn
  - scroll_driven: ArcScroll
```

</details>

---

## File Organization

```
rules/presets/
├── README.md                    # Master index
├── entrance/                    # 24 files
│   ├── fade-in.md
│   ├── arc-in.md
│   ├── blur-in.md
│   └── ...
├── scroll/                      # 20 files
│   ├── parallax-scroll.md
│   ├── arc-scroll.md
│   └── ...
├── ongoing/                     # 14 files
│   ├── pulse.md
│   ├── bounce.md
│   └── ...
├── mouse/                       # 13 files
│   ├── tilt-3d-mouse.md
│   └── ...
└── background-scroll/           # 12 files
    ├── bg-parallax.md
    └── ...
```

---

## Implementation Notes

1. **Visual Description**: Requires human writing - analyze keyframes in implementation files for cues about opacity, rotation axes, movement paths, and timing
2. **Parameters**: Combine TypeScript types from `motion-presets` with constraints from `effects-kit`. **Always check each preset's specific file** - they override base params with different enum subsets
3. **Direction/Easing subsets**: Document the exact subset each preset supports, not the base type. Clipped animations (ShapeIn, RevealIn, ShuttersIn, WinkIn) exclude back easings
4. **Cross-trigger mapping**: Map entrance presets to their scroll/mouse equivalents where they exist (e.g., ArcIn ↔ ArcScroll)
5. **Tags**: Derive from visual characteristics, use cases, and motion type