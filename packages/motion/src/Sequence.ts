import { AnimationGroup } from './AnimationGroup';
import { jsEasings } from './easings';
import { SequenceOptions } from './types';

/**
 * Creates a cubic-bezier easing function from control points.
 * Based on WebKit's implementation.
 */
export function createCubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  // Calculate the polynomial coefficients
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  // Sample the curve's x value at parameter t
  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;

  // Sample the curve's y value at parameter t
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;

  // Derivative of x with respect to t
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  // Given an x value, find the corresponding t using Newton-Raphson
  const solveCurveX = (x: number): number => {
    let t = x;

    // Newton-Raphson iteration (usually converges in 4-8 iterations)
    for (let i = 0; i < 8; i++) {
      const xError = sampleCurveX(t) - x;
      if (Math.abs(xError) < 1e-6) {
        return t;
      }
      const dx = sampleCurveDerivativeX(t);
      if (Math.abs(dx) < 1e-6) {
        break;
      }
      t -= xError / dx;
    }

    // Fall back to bisection if Newton-Raphson fails
    let t0 = 0;
    let t1 = 1;
    t = x;

    while (t0 < t1) {
      const xMid = sampleCurveX(t);
      if (Math.abs(xMid - x) < 1e-6) {
        return t;
      }
      if (x > xMid) {
        t0 = t;
      } else {
        t1 = t;
      }
      t = (t1 - t0) / 2 + t0;
    }

    return t;
  };

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return sampleCurveY(solveCurveX(x));
  };
}

/**
 * Parses a CSS cubic-bezier string and returns an easing function.
 * @example parseCubicBezier("cubic-bezier(0.4, 0, 0.2, 1)") // returns easing function
 */
export function parseCubicBezier(str: string): ((t: number) => number) | null {
  const match = str.match(/cubic-bezier\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/i);
  if (!match) return null;

  const [, x1, y1, x2, y2] = match.map((v, i) => (i === 0 ? v : parseFloat(v)));
  if ([x1, y1, x2, y2].some((v) => typeof v !== 'number' || isNaN(v as number))) {
    return null;
  }

  return createCubicBezier(x1 as number, y1 as number, x2 as number, y2 as number);
}

/**
 * Resolves an easing value to a function.
 * Supports:
 * - Direct function references
 * - Named easings from @wix/motion library
 * - CSS cubic-bezier strings (e.g., "cubic-bezier(0.4, 0, 0.2, 1)")
 * - Defaults to linear if not found
 */
function resolveEasingFunction(
  easing: string | ((t: number) => number) | undefined,
): (t: number) => number {
  if (typeof easing === 'function') {
    return easing;
  }

  if (typeof easing === 'string') {
    // Check named easings first
    if (easing in jsEasings) {
      return jsEasings[easing as keyof typeof jsEasings];
    }

    // Try parsing as cubic-bezier
    const bezierFn = parseCubicBezier(easing);
    if (bezierFn) {
      return bezierFn;
    }
  }

  // Default to linear
  return jsEasings.linear;
}

/**
 * Calculate staggered delay offsets for a sequence of effects.
 *
 * @param count - The number of effects in the sequence
 * @param offset - The base offset in milliseconds (default 100)
 * @param easingFn - The easing function to apply to the offset calculation
 * @returns An array of calculated delay offsets in milliseconds
 *
 * @example
 * // Linear easing with 5 items and 200ms offset
 * calculateOffsets(5, 200, linear) // [0, 200, 400, 600, 800]
 *
 * @example
 * // QuadIn easing with 5 items and 200ms offset
 * calculateOffsets(5, 200, quadIn) // [0, 50, 200, 450, 800]
 */
export function calculateOffsets(
  count: number,
  offset: number,
  easingFn: (t: number) => number,
): number[] {
  if (count <= 1) {
    return [0];
  }

  const last = count - 1;
  return Array.from({ length: count }, (_, i) => (easingFn(i / last) * last * offset) | 0);
}

/**
 * @class Sequence
 *
 * A class that manages multiple AnimationGroup instances as a coordinated timeline
 * with staggered delays. Extends AnimationGroup to inherit the playback control API.
 *
 * @example
 * const sequence = new Sequence([group1, group2, group3], {
 *   delay: 0,
 *   offset: 100,
 *   offsetEasing: 'quadIn'
 * });
 * sequence.play();
 */
export class Sequence extends AnimationGroup {
  animationGroups: AnimationGroup[];
  sequenceDelay: number;
  offset: number;
  offsetEasing: (t: number) => number;
  private _calculatedOffsets: number[];

  constructor(animationGroups: AnimationGroup[], options?: SequenceOptions) {
    // Pass an empty array to parent since we manage AnimationGroups, not Animations directly
    // We'll override the relevant methods to work with AnimationGroups
    const allAnimations = animationGroups.flatMap((group) => group.animations);
    super(allAnimations, options);

    this.animationGroups = animationGroups;
    this.sequenceDelay = options?.delay ?? 0;
    this.offset = options?.offset ?? 100;
    this.offsetEasing = resolveEasingFunction(options?.offsetEasing);

    // Calculate offsets for each animation group
    this._calculatedOffsets = calculateOffsets(
      animationGroups.length,
      this.offset,
      this.offsetEasing,
    );

    // Apply calculated delays to each animation group
    this._applyDelays();
  }

  /**
   * Apply the calculated staggered delays to each animation group's animations.
   * The delay is added to any existing delay on each animation.
   */
  private _applyDelays(): void {
    this.animationGroups.forEach((group, index) => {
      const groupDelay = this.sequenceDelay + this._calculatedOffsets[index];

      for (const animation of group.animations) {
        const timing = animation.effect?.getTiming();
        if (timing) {
          const existingDelay = (timing.delay as number) || 0;
          animation.effect?.updateTiming({
            delay: existingDelay + groupDelay,
          });
        }
      }
    });
  }

  /**
   * Get the calculated offset for a specific index in the sequence.
   */
  getOffsetAt(index: number): number {
    return this._calculatedOffsets[index] ?? 0;
  }

  /**
   * Get all calculated offsets.
   */
  getOffsets(): number[] {
    return [...this._calculatedOffsets];
  }

  /**
   * Recalculate offsets. Useful when animation groups are modified.
   */
  recalculateOffsets(): void {
    this._calculatedOffsets = calculateOffsets(
      this.animationGroups.length,
      this.offset,
      this.offsetEasing,
    );
  }

  // Note: play(), pause(), reverse(), cancel(), setPlaybackRate(), onFinish(),
  // finished, and playState are inherited from AnimationGroup.
  // Since we pass all flattened animations to super(), the parent's
  // implementations work correctly on the same Animation objects.
}
