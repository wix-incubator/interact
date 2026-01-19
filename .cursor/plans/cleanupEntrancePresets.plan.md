# Entrance Animations Cleanup Plan

## Overview

**Phase 1**: Remove/consolidate redundant presets (GlitchIn, ExpandIn, RevealIn → ShapeIn, CircleIn, PunchIn).

**Phase 2**: Remove direction-fixing logic from 6 presets that use `getAdjustedDirection()` to compensate for element rotation. Simplify presets to use direction parameters directly.

**Phase 3**: Simplify opacity handling by removing redundant final keyframes where possible, and renaming `--comp-opacity` to `--motion-opacity` for clearer library semantics.

---

## Phase 1: Remove Redundant Presets

### Presets to Remove

### 1. GlitchIn (Wrapper)

**Why Remove**: GlitchIn is just a thin wrapper around [`GlideIn.ts`](packages/motion-presets/src/library/entrance/GlideIn.ts) that provides no additional capabilities.

**What it does**:

- Defaults `direction` to 270° (from left, slides right)
- If user provides a direction, arbitrarily subtracts 90° from it
- Then calls GlideIn with the adjusted direction
- No unique visual effect or animation logic

**Change to GlideIn**: Update GlideIn's default `direction` from `0` to `270` to match the more common "from left" behavior that GlitchIn provided.

**Migration**: Use `GlideIn` directly with any `direction` angle (e.g., `direction: 270` for from left, or any value 0-360°).

### 2. ExpandIn (Same Effect as GrowIn)

**Why Remove**: ExpandIn and GrowIn achieve the same visual effect with minor parameter tweaks. The only notable difference is fade-in timing, which doesn't justify maintaining two separate presets.

**Comparison**:

**ExpandIn:**

- Scales from a transform origin point (edge/corner)
- Direction: Discrete positions (top, right, bottom-left, center, etc.)
- Complex transform origin manipulation with width/height calculations
- Uses element measurement (prepare function)
- Transform: `translateX(calc(width * x)) translateY(calc(height * y)) scale() translateX(calc(width * -x)) ...`

**GrowIn:**

- Translates from a direction + scales
- Direction: Angle-based (0-360 degrees, any direction)
- Simpler implementation with distance + direction
- Transform: `translate(x, y) rotate() scale()`

**Analysis**: After value tweaks, both effects behave almost identically except for fade-in timing. GrowIn provides more flexibility with 360° direction support and simpler configuration. ExpandIn's discrete position + complex transform origin approach can be replicated with GrowIn using appropriate angle and distance values.

**Migration**: Use `GrowIn` with appropriate `direction` (angle) and `distance` parameters to achieve the same expand-from-edge effect.

### 3. RevealIn (Consolidate into ShapeIn)

**Why Remove**: RevealIn and ShapeIn both use `clip-path` for reveals. They can be unified under ShapeIn.

- RevealIn: directional reveals (left, right, top, bottom)
- ShapeIn: geometric shape reveals (diamond, circle, rectangle, ellipse, window)

**Naming Options** (need to choose):

**Option A - Use "wipe-" prefix for directional values**:

- Keep `shape` parameter
- Add: `wipe-left`, `wipe-right`, `wipe-top`, `wipe-bottom`
- Migration: `RevealIn({ direction: 'left' })` → `ShapeIn({ shape: 'wipe-left' })`

**Option B - Rename parameter to "reveal"**:

- Change parameter from `shape` to `reveal`
- Add: `left`, `right`, `top`, `bottom`
- Migration: `RevealIn({ direction: 'left' })` → `ShapeIn({ reveal: 'left' }) ; ShapeIn({ shape: 'circle' })` → `ShapeIn({ reveal: 'circle' })`

### 4. CircleIn (Legacy)

**Why Remove**: Legacy preset, no longer needed for consumers.

### 5. PunchIn (Legacy)

**Why Remove**: Legacy preset, no longer needed for consumers.

### Files to Modify (Phase 1)

### Core Files to Delete

- [`packages/motion-presets/src/library/entrance/GlitchIn.ts`](packages/motion-presets/src/library/entrance/GlitchIn.ts)
- [`packages/motion-presets/src/library/entrance/ExpandIn.ts`](packages/motion-presets/src/library/entrance/ExpandIn.ts)
- [`packages/motion-presets/src/library/entrance/RevealIn.ts`](packages/motion-presets/src/library/entrance/RevealIn.ts)
- [`packages/motion-presets/src/library/entrance/CircleIn.ts`](packages/motion-presets/src/library/entrance/CircleIn.ts)
- [`packages/motion-presets/src/library/entrance/PunchIn.ts`](packages/motion-presets/src/library/entrance/PunchIn.ts)

### Test Files to Delete

- `packages/motion-presets/src/library/entrance/test/GlitchIn.spec.ts`
- `packages/motion-presets/src/library/entrance/test/ExpandIn.spec.ts`
- `packages/motion-presets/src/library/entrance/test/RevealIn.spec.ts`
- `packages/motion-presets/src/library/entrance/test/CircleIn.spec.ts`
- `packages/motion-presets/src/library/entrance/test/PunchIn.spec.ts`

### Update Exports

- [`packages/motion-presets/src/library/entrance/index.ts`](packages/motion-presets/src/library/entrance/index.ts) - Remove GlitchIn, ExpandIn, RevealIn, CircleIn, and PunchIn exports

### Update Type Definitions

Check [`packages/motion-presets/src/types.ts`](packages/motion-presets/src/types.ts) for any GlitchIn and ExpandIn type definitions and remove them.

---

## Phase 2: Remove Direction-Fixing Logic

### Overview

Many presets have complex `prepare()` functions that read `--comp-rotate-z` from computed styles and use `getAdjustedDirection()` to compensate for element rotation. This adds complexity and couples the presets to the element's rotation state.

**Goal**: Simplify presets by removing this rotation-aware direction adjustment. Effects should use the direction parameter as specified, without trying to compensate for element rotation.

### Presets with Direction-Fixing Logic

These 5 presets use `getAdjustedDirection()` in their prepare functions:

1. **FlipIn** - Adjusts rotateX/Y based on element rotation
2. **FoldIn** - Adjusts origin and rotation based on element rotation  
3. **SlideIn** - Adjusts clip-path direction based on element rotation
4. **TiltIn** - Adjusts clip-path direction based on element rotation
5. **WinkIn** - Adjusts direction based on element rotation

(RevealIn also had this logic but is being removed in Phase 1)

### Changes Required

For each preset:

1. **Remove rotation measurement** from `prepare()` function
2. **Remove `getAdjustedDirection()` calls**
3. **Use direction parameter directly** without adjustment
4. **Simplify or remove `prepare()` function** if it only did direction fixing
5. **Keep `prepare()` if it measures element dimensions** (width, height, left, top)

### Benefits

- **Simpler code**: Remove rotation measurement and adjustment logic
- **Predictable behavior**: Direction works as specified
- **Better performance**: No DOM measurements for rotation
- **Easier to understand**: Less coupling between element state and effect

---

## Phase 3: Simplify Opacity Handling

### Overview

Many presets include explicit final keyframes setting `opacity: 'var(--comp-opacity, 1)'`. The `--comp-opacity` variable was originally required because the element's computed opacity was 0 in order to keep the element hidden on load.

### Goals

1. **Remove redundant final keyframes**: When a final keyframe only specifies opacity, it can be removed to let the animation use the element's natural CSS opacity
2. **Rename for clarity**: If `--comp-opacity` is still needed in some cases, rename to `--motion-opacity` for generic library usage
3. **Evaluate each preset**: Determine which presets can omit the final opacity keyframe(s) entirely

### Strategy

**Option A - Remove Final Keyframe** (preferred when possible):
When the final keyframe only sets opacity and no other properties, omit it entirely. The Web Animations API will automatically use the element's computed opacity from CSS.

**Option B - Rename Variable** (when API is needed):
If explicit control over target opacity is necessary, rename `--comp-opacity` to `--motion-opacity` to make it clear this is a library feature, not Wix-specific, and add to documentation.