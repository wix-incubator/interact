# Named effects Cleanup Plan

## Overview

**Phase 1**: Remove/consolidate redundant presets (GlitchIn → GlideIn, ExpandIn → GrowIn, RevealIn → ShapeIn, CircleIn, PunchIn).

**Phase 2**: Remove direction-fixing logic from 5 presets that use `getAdjustedDirection()` to compensate for element rotation. Simplify presets to use direction parameters directly.

**Phase 3**: Simplify opacity handling by removing redundant final keyframes where possible, and renaming `--comp-opacity` to `--motion-opacity` for clearer library semantics.

**Phase 4**: Standardize parameter types and coordinate systems across all presets.

**Phase 5**: Allow customization of previously hardcoded values like `perspective`, `depth`, `angle`, etc. and values based on DOM measurements

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

**Changes to GlideIn**:

- Update default `direction` from `0` to `270` to match the more common "from left" behavior that GlitchIn provided
- Remove `startFromOffScreen` option - this requires DOM measurements (left, top) and adds complexity

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

---

## Phase 4: Standardize Parameter Types and Coordinate Systems

### Overview

Standardize parameter naming and coordinate systems across all presets for consistency and predictability.

### 1. Rename `direction` → `angle` for Numeric Degrees

Presets using numeric degrees should use `angle` instead of `direction`:

| Preset | Current | Change To |

|--------|---------|-----------|

| GrowIn | `direction = 0` | `angle = 0` |

| GlideIn | `direction = 270` | `angle = 270` |

**Files to update**:

- `packages/motion-presets/src/library/entrance/GrowIn.ts`
- `packages/motion-presets/src/library/entrance/GlideIn.ts`
- Corresponding type definitions in `types.ts`

### 2. Fix Coordinate System (0° = East)

**Current system** (incorrect):

- `0°` = from top (north)
- `90°` = from right (east)

**Standard system** (correct):

- `0°` = from right (east)
- `90°` = from top (north)

**Change required**:

```typescript
// Current (wrong)
const x = Math.sin(angleInRad) * distance.value;
const y = Math.cos(angleInRad) * distance.value * -1;

// Standard (correct)
const x = Math.cos(angleInRad) * distance.value;
const y = Math.sin(angleInRad) * distance.value * -1;
```

**Files to update**:

- `packages/motion-presets/src/library/entrance/GrowIn.ts`
- `packages/motion-presets/src/library/entrance/GlideIn.ts`
- `packages/motion-presets/src/library/scroll/MoveScroll.ts` (verify)

### 3. Suggestion: Rename `direction` (options include `axis` or `orientation)` for Horizontal/Vertical

Presets using `'horizontal' | 'vertical'` should use a different parameter name to avoid confusion with cardinal directions.

**Options** (need to choose):

- `axis: 'horizontal' | 'vertical'`
- `orientation: 'horizontal' | 'vertical'`

**Presets to update**:

- `packages/motion-presets/src/library/entrance/WinkIn.ts`
- `packages/motion-presets/src/library/scroll/FlipScroll.ts`
- `packages/motion-presets/src/library/scroll/ArcScroll.ts`
- `packages/motion-presets/src/library/ongoing/Flip.ts`
- `packages/motion-presets/src/library/ongoing/Breathe.ts`
- Corresponding type definitions in `types.ts`

### Summary of `direction` Parameter Usage (After Changes)

| Meaning | Parameter | Values | Presets |

|---------|-----------|--------|---------|

| Numeric angle | `angle` | `0-360` (degrees) | GrowIn, GlideIn, MoveScroll, mouse presets |

| Cardinal | `direction` | `'top' \| 'right' \| 'bottom' \| 'left'` | FlipIn, FoldIn, SlideIn, FloatIn, BounceIn, etc. |

| Rotation | `direction` | `'clockwise' \| 'counter-clockwise'` | SpinIn, SpinScroll, Spin |

| Axis | `axis` or `orientation` | `'horizontal' \| 'vertical'` | WinkIn, FlipScroll, ArcScroll, Flip, Breathe |

---

## Phase 5: Expose Hardcoded Values (and some DOM measurements) as Parameters

### Overview

Many presets measure element dimensions or use hardcoded values that could instead be customizable parameters. This phase removes DOM measurements and exposes these values as optional parameters with sensible defaults.

### Category 1: DOM Measurements That Could Be Parameters

These presets measure element dimensions and derive values that could instead be customizable:

| Preset | What's Measured | Hardcoded Calculation | Suggested Parameter |
|--------|-----------------|----------------------|---------------------|
| ArcIn | `width`, `height` | `z = (height or width) / 2` | `depth` (default: 300px) |
| CurveIn | `width` | `translateZ = width * 3` | `depth` (default: 900px) |
| TiltIn | `height` | `translateZ = height / 2` | `depth` (default: 200px) |
| TurnScroll | `left` | Viewport-relative translation | Use CSS fallback |
| SkewPanScroll | `left` | Viewport-relative translation | Use CSS fallback |

### Category 2: Hardcoded Values That Could Be Parameters

| Preset | Hardcoded Value | What It Controls | Suggested Parameter |
|--------|-----------------|------------------|---------------------|
| **ArcIn** | `ROTATION_ANGLE = 80` | Arc rotation angle | `angle = 80` |
| **ArcIn** | `perspective(800px)` | 3D perspective | `perspective = 800` |
| **ArcScroll** | `translateZ(-300px)` | Arc depth | `depth = 300` |
| **ArcScroll** | `ROTATION = 68` | Arc rotation | `angle = 68` |
| **ArcScroll** | `perspective(500px)` | 3D perspective | `perspective = 500` |
| **TiltIn** | `rotateX(-90deg)` | Tilt angle | `tiltAngle = 90` |
| **TiltIn** | `ROTATION_MAP = { left: 30, right: -30 }` | Z rotation | `rotateZ = 30` |
| **TiltIn** | `perspective(800px)` | 3D perspective | `perspective = 800` |
| **FoldIn** | `perspective(800px)` | 3D perspective | `perspective = 800` |
| **FlipIn** | `perspective(800px)` | 3D perspective | `perspective = 800` |
| **FlipScroll** | `perspective(800px)` | 3D perspective | `perspective = 800` |
| **TiltScroll** | `perspective(400px)` | 3D perspective | `perspective = 400` |
| **TiltScroll** | `[ROTATION_X, ROTATION_Y, ROTATION_Z] = [10, 25, 25]` | Rotation angles | `rotationX`, `rotationY`, `rotationZ` |
| **TiltScroll** | `MAX_Y_TRAVEL = 40` | Max vertical travel | `maxTravelY = 40` |
| **Spin3dScroll** | `perspective(1000px)` | 3D perspective | `perspective = 1000` |
| **Spin3dScroll** | `MAX_Y_TRAVEL = 40` | Max vertical travel | `maxTravelY = 40` |
| **FloatIn** | `distance: 120` | Float distance | `distance = 120` |
| **TurnIn** | `angle: -50 / 50` | Rotation angle | `angle = 50` |
| **CurveIn** | `perspective(200px)` | 3D perspective | `perspective = 200` |
| **BounceIn** | `perspective(800px)` (center only) | 3D perspective | `perspective = 800` |
| **CircleIn** | `ROTATION = 45` | Rotation angle | `rotation = 45` |
| **TurnScroll** | `ELEMENT_ROTATION = 45` | Element rotation | `rotation = 45` |
| **Breathe** | `FACTORS_SEQUENCE` | Decay pattern | Could allow custom decay factors |
| **ShapeIn** | Fixed clip-path shapes | Shape dimensions | `size` or `radius` for circle/ellipse |