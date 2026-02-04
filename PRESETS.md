# Motion Presets Refactoring Plan

## Part 1: Shared Utilities to Build First

These utilities are dependencies for all preset changes. Build these before modifying individual presets.

### 1.1 Distance Parser
Create a parser that normalizes distance values. **Apply to all presets (except bgscroll) that accept a distance parameter.**

- **Input types accepted:**
  - String: number + unit (e.g., `"100px"`, `"50%"`, `"2rem"`)
  - Object: `{ value: number, type: string }`
- **Behavior:**
  - If string: parse and convert using CSS factory functions (see: https://developer.mozilla.org/en-US/docs/Web/API/CSS/factory_functions_static)
  - If object: validate and use directly
  - If invalid: fallback to preset's default value

### 1.2 Direction Parser
Create a parser that normalizes direction values. **Apply to all presets (except bgscroll) that accept a direction parameter.**

- **Input types accepted:**
  - String keyword (preset-specific valid keywords, e.g., `"left"`, `"top"`, `"center"`)
  - Number (interpreted as degrees)
  - String with degrees (e.g., `"45deg"`)
- **Behavior:**
  - If keyword: validate against preset's allowed keywords
  - If number or degree string: convert to angle
  - If invalid: fallback to preset's default value

### 1.3 Integration Task
After building the parsers, integrate them into **every preset** (except bgscroll) that uses:
- A `distance` parameter → use Distance Parser
- A `direction` parameter → use Direction Parser

---

## Part 2: Preset-Specific Changes

### 2.1 Entrance Presets

#### Remove `prepare()` methods - add `depth` param instead

| Preset | Change |
|--------|--------|
| ArcIn | Add `depth` param instead of measuring height/width |
| CurveIn | Add `depth` param instead of measuring width |
| TiltIn | Add `depth` param instead of measuring height |

#### Direction parameter behavior changes

| Preset | Change |
|--------|--------|
| GlideIn | Keep `direction`; accept both angle numbers and string keywords |
| GrowIn | Keep `direction`; accept both angle numbers and string keywords; **rename preset to `ExpandIn`** |
| ShapeIn | Remove `direction` param entirely (hardcode to center) |

#### No preset-specific changes (still apply parsers)
BlurIn, BounceIn, DropIn, FadeIn, FlipIn, FloatIn, FoldIn, RevealIn, ShuttersIn, SlideIn, SpinIn, TurnIn, WinkIn

---

### 2.2 Scroll Presets

#### Remove `prepare()` methods
Replace measurement logic with user-provided values or fallbacks.

#### Replace CSS variable `--comp-rotate-z` → `--motion-rotate`

| Presets to update |
|-------------------|
| ArcScroll, FlipScroll, GrowScroll, MoveScroll, PanScroll, ShrinkScroll, SkewPanScroll, SlideScroll, Spin3dScroll, SpinScroll, TurnScroll |

#### Parameter renames

| Preset | Change |
|--------|--------|
| ParallaxScroll | Rename `speed` → `parallaxFactor` |
| TiltScroll | Rename `distance` → `parallaxFactor` |

#### No preset-specific changes (still apply parsers)
BlurScroll, FadeScroll, RevealScroll, ShapeScroll, ShuttersScroll, StretchScroll

---

### 2.3 Mouse Presets
No preset-specific changes. **Still apply distance/direction parsers where applicable.**

---

### 2.4 Ongoing Presets
No preset-specific changes. **Still apply distance/direction parsers where applicable.**

---

## Implementation Order (Recommended)

1. **Build shared utilities** (Part 1)
   - Distance parser
   - Direction parser

2. **Integrate parsers into all presets** (except bgscroll)
   - Audit each preset for `distance` and `direction` params
   - Replace raw validation with parser calls

3. **Apply preset-specific changes** (Part 2)
   - Entrance: depth params, direction behavior, rename GrowIn → ExpandIn
   - Scroll: CSS variable rename, param renames, remove prepare() methods