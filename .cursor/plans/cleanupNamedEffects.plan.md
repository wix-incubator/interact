# Named Effects Cleanup Plan

## Overview

**Phase 1**: Remove/consolidate redundant presets (GlitchIn, CircleIn, PunchIn removed; ExpandIn consolidated into GrowIn). RevealIn remains as a separate preset.

**Phase 2**: Remove direction-fixing logic from 5 presets that use `getAdjustedDirection()` to compensate for element rotation. Remove "from out of screen" option.

**Phase 3**: Simplify opacity handling by removing redundant final keyframes where possible. Provide an API to set style properties such as element opacity and rotation.

**Phase 4**: Standardize parameter types and coordinate systems across all presets. Unify direction options. Allow all units for distance with sensible defaults.

**Phase 5**: Remove `power` parameter (`'soft' | 'medium' | 'hard'`) - it's editor wrapper logic that maps to actual numeric values. LLMs can suggest appropriate values directly.

**Phase 6**: Allow customization of previously hardcoded values like `perspective`, `depth`, `angle`, etc. and values based on DOM measurements. These will be reviewed on a case-by-case basis.

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

### 2. ExpandIn (Consolidate into GrowIn)

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

### 3. CircleIn (Legacy)

**Why Remove**: Legacy preset, no longer needed for consumers.

### 4. PunchIn (Legacy)

**Why Remove**: Legacy preset, no longer needed for consumers.

### RevealIn - NOT Being Removed

**Decision**: RevealIn will remain as a separate preset and will NOT be consolidated into ShapeIn. They serve different purposes:

- RevealIn: directional reveals (left, right, top, bottom)
- ShapeIn: geometric shape reveals (diamond, circle, rectangle, ellipse, window)

### ShapeIn Cleanup

Since RevealIn is not being consolidated into ShapeIn, if ShapeIn currently accepts a `direction` parameter, it should be removed from:

- Type definitions
- API/parameters
- Implementation code

### Files to Modify (Phase 1)

### Core Files to Delete

- [`packages/motion-presets/src/library/entrance/GlitchIn.ts`](packages/motion-presets/src/library/entrance/GlitchIn.ts)
- [`packages/motion-presets/src/library/entrance/ExpandIn.ts`](packages/motion-presets/src/library/entrance/ExpandIn.ts)
- [`packages/motion-presets/src/library/entrance/CircleIn.ts`](packages/motion-presets/src/library/entrance/CircleIn.ts)
- [`packages/motion-presets/src/library/entrance/PunchIn.ts`](packages/motion-presets/src/library/entrance/PunchIn.ts)

### Test Files to Delete

- `packages/motion-presets/src/library/entrance/test/GlitchIn.spec.ts`
- `packages/motion-presets/src/library/entrance/test/ExpandIn.spec.ts`
- `packages/motion-presets/src/library/entrance/test/CircleIn.spec.ts`
- `packages/motion-presets/src/library/entrance/test/PunchIn.spec.ts`

### Update Exports

- [`packages/motion-presets/src/library/entrance/index.ts`](packages/motion-presets/src/library/entrance/index.ts) - Remove GlitchIn, ExpandIn, CircleIn, and PunchIn exports

### Update Type Definitions

Check [`packages/motion-presets/src/types.ts`](packages/motion-presets/src/types.ts) for any GlitchIn, ExpandIn, CircleIn, and PunchIn type definitions and remove them.

---

## Phase 2: Remove Direction-Fixing Logic

### Overview

Many presets have complex `prepare()` functions that read `--comp-rotate-z` from computed styles and use `getAdjustedDirection()` to compensate for element rotation. This adds complexity and couples the presets to the element's rotation state.

**Goal**: Simplify presets by removing this rotation-aware direction adjustment. Effects should use the direction parameter as specified, without trying to compensate for element rotation.

### Additional: Remove "From Out of Screen" Option

Remove the `startFromOffScreen` option from presets that support it. This option requires DOM measurements (left, top) and adds unnecessary complexity.

### Presets with Direction-Fixing Logic

These 5 presets use `getAdjustedDirection()` in their prepare functions:

1. **FlipIn** - Adjusts rotateX/Y based on element rotation
2. **FoldIn** - Adjusts origin and rotation based on element rotation
3. **SlideIn** - Adjusts clip-path direction based on element rotation
4. **TiltIn** - Adjusts clip-path direction based on element rotation
5. **WinkIn** - Adjusts direction based on element rotation

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

## Phase 3: Simplify Opacity and Rotation Handling

### Overview

Many presets include explicit final keyframes setting `opacity: 'var(--comp-opacity, 1)'`. The `--comp-opacity` variable was originally required because the element's computed opacity was 0 in order to keep the element hidden on load.

Additionally, `--comp-rotate-z` is used for scroll effects - we need to enable users to set rotation.

### Goals

1. **Remove redundant final keyframes**: When a final keyframe only specifies opacity, it can be removed to let the animation use the element's natural CSS opacity
2. **Provide an API for style properties**: Create an API that allows users to set element opacity and rotation values that presets can reference
3. **Evaluate each preset**: Determine which presets can omit the final opacity keyframe(s) entirely

### Strategy

**For Opacity**:

When the final keyframe only sets opacity and no other properties, omit it entirely. The Web Animations API will automatically use the element's computed opacity from CSS.

**For Style Properties API**:

Provide a mechanism for users to specify target values for:

- Element opacity (final opacity after animation)
- Element rotation (target rotation state)

This allows presets to animate to user-specified values rather than relying on CSS custom properties with fallbacks.

---

## Phase 4: Standardize Parameter Types and Coordinate Systems

### Overview

Standardize parameter naming and coordinate systems across all presets for consistency and predictability.

### 1. Unify Direction Options

Standardize how direction is specified across all presets for consistency.

Presets using numeric degrees should use `angle` instead of `direction`:

| Preset | Current | Change To |

| :---- | :---- | :---- |

| GrowIn | `direction = 0` | `angle = 0` |

| GlideIn | `direction = 270` | `angle = 270` |

**Files to update**:

- `packages/motion-presets/src/library/entrance/GrowIn.ts`
- `packages/motion-presets/src/library/entrance/GlideIn.ts`
- Corresponding type definitions in `types.ts`

### 2. Standardize Coordinate System (0° = Right)

**Current system** (incorrect):

- `0°` = from top (north)
- `90°` = from right (east)

**Standard system** (correct):

- `0°` = from right (east)
- `90°` = from top (north)

**Change required**:

```ts
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

### 3. Allow All Units for Distance

Distance parameters should accept all CSS units while maintaining a sensible default.

**Current**: Distance may be limited to specific units or numeric values

**Change**: Accept any valid CSS unit (px, em, rem, %, vw, vh, etc.)

**Default**: Maintain a sensible default value (e.g., `100px`)

### 4. Rename `direction` for Horizontal/Vertical Presets

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

| :---- | :---- | :---- | :---- |

| Numeric angle | `angle` | `0-360` (degrees) | GrowIn, GlideIn, MoveScroll, mouse presets |

| Cardinal | `direction` | `'top' \| 'right' \| 'bottom' \| 'left'` | FlipIn, FoldIn, SlideIn, FloatIn, BounceIn, etc. |

| Rotation | `direction` | `'clockwise' \| 'counter-clockwise'` | SpinIn, SpinScroll, Spin |

| Axis | `axis` or `orientation` | `'horizontal' \| 'vertical'` | WinkIn, FlipScroll, ArcScroll, Flip, Breathe |

---

## Phase 5: Remove `power` Parameter

### Overview

The `power` parameter (`'soft' | 'medium' | 'hard'`) is a simplified abstraction designed for editor UIs (like Wix Editor). It maps these three intensity levels to actual numeric parameter values, which differ per preset.

**Why Remove**: This adds wrapper logic and indirection without real benefit. Users calling these presets directly (or through an LLM) can use the actual parameters with precise values.

### Current Behavior

Each preset has a `POWER_MAP` (or similar) that translates power levels:

| Preset | Parameter | soft | medium | hard |

| :---- | :---- | :---- | :---- | :---- |

| **FlipIn** | `initialRotate` | 45° | 90° | 270° |

| **FoldIn** | `initialRotate` | 45° | 90° | 120° |

| **GrowIn** | `initialScale` | 0.8 | 0.6 | 0 |

| **BounceIn** | `distanceFactor` | 0.5 | 0.75 | 1 |

| **ArcIn** | easing | quintInOut | backOut | backInOut |

| **FlipScroll** | `rotate` | 45° | 90° | 120° |

| **TiltScroll** | travel distance | 0.25× | 0.5× | 1× multiplier |

| **Spin3dScroll** | rotation + travel | varies | varies | varies |

| **Mouse presets** | angle/scale/easing | varies | varies | varies |

### Migration Strategy

1. **Remove power parameter** from all preset type definitions
2. **Remove POWER_MAP constants** from preset implementations
3. **Use direct parameters** - users specify exact values like `initialRotate: 45` instead of `power: 'soft'`
4. **Document conversions** - provide a reference table so LLMs can suggest appropriate values when users ask for "soft" or "hard" effects

---

## Phase 6: Expose Hardcoded Values as Parameters

### Overview

Many presets measure element dimensions or use hardcoded values that could instead be customizable parameters. This phase exposes these values as optional parameters with sensible defaults. If those params are not passed, we fallback to hardcoded defaults or measurements like before.

**Note**: These will be reviewed on a case-by-case basis.

### Category 1: DOM Measurements That Could Be Parameters

These presets measure element dimensions and derive values that could instead be customizable:

| Preset | What's Measured | Hardcoded Calculation | Suggested Parameter |

| :---- | :---- | :---- | :---- |

| ArcIn | `width`, `height` | `z = (height or width) / 2` | `depth` (default: 300px) |

| CurveIn | `width` | `translateZ = width * 3` | `depth` (default: 900px) |

| TiltIn | `height` | `translateZ = height / 2` | `depth` (default: 200px) |

| TurnScroll | `left` | Viewport-relative translation | Use CSS fallback |

| SkewPanScroll | `left` | Viewport-relative translation | Use CSS fallback |

### Category 2: Hardcoded Values That Could Be Parameters

| Preset | Hardcoded Value | What It Controls | Suggested Parameter |

| :---- | :---- | :---- | :---- |

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

| **TiltScroll** | `[ROTATION_X, ROTATION_Y, ROTATION_Z] = [10, 25, 25] `| Rotation angles | `rotationX`, `rotationY`, `rotationZ` |

| **TiltScroll** | `MAX_Y_TRAVEL = 40` | Max vertical travel | `maxTravelY = 40` |

| **Spin3dScroll** | `perspective(1000px)` | 3D perspective | `perspective = 1000` |

| **Spin3dScroll** | `MAX_Y_TRAVEL = 40` | Max vertical travel | `maxTravelY = 40` |

| **FloatIn** | `distance: 120` | Float distance | `distance = 120` |

| **TurnIn** | `angle: -50 / 50` | Rotation angle | `angle = 50` |

| **CurveIn** | `perspective(200px)` | 3D perspective | `perspective = 200` |

| **BounceIn** | `perspective(800px)` (center only) | 3D perspective | `perspective = 800` |

| **TurnScroll** | `ELEMENT_ROTATION = 45` | Element rotation | `rotation = 45` |

| **Breathe** | `FACTORS_SEQUENCE` | Decay pattern | Could allow custom decay factors |