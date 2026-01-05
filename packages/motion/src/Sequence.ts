import { jsEasings } from './easings';
import type { SequenceOptions, SequenceOffsetEasing } from './types';
import { AnimationGroup } from './AnimationGroup';

function resolveEasingFunction(easing: SequenceOffsetEasing | undefined): (p: number) => number {
  if (typeof easing === 'function') {
    return easing;
  }

  if (typeof easing === 'string') {
    const easingFn = jsEasings[easing as keyof typeof jsEasings];
    if (easingFn) {
      return easingFn;
    }
  }

  return jsEasings.linear;
}

/**
 * Calculates staggered delay offsets for a sequence of effects.
 *
 * @param count - The number of effects in the sequence
 * @param options - Sequence configuration options
 * @returns Array of delay offsets in milliseconds for each effect index
 *
 * @example
 * // Linear stagger with 200ms offset
 * calculateSequenceOffsets(5, { offset: 200 })
 * // Returns: [0, 200, 400, 600, 800]
 */
export function calculateSequenceOffsets(count: number, options: SequenceOptions = {}): number[] {
  const { delay = 0, offset = 100, offsetEasing } = options;

  if (count <= 0) {
    return [];
  }

  if (count === 1) {
    return [delay];
  }

  const easingFn = resolveEasingFunction(offsetEasing);
  const last = count - 1;

  return Array.from({ length: count }, (_, index) => {
    const easedValue = easingFn(index / last);
    const calculatedOffset = (easedValue * last * offset) | 0; // | 0 floors the number
    return delay + calculatedOffset;
  });
}

/**
 * @class Sequence
 *
 * Manages a list of AnimationGroup instances with staggered timing.
 * Sequences allow effects to be applied in order with calculated delay offsets.
 */
export class Sequence {
  private animations: AnimationGroup[];
  private options: SequenceOptions;

  constructor(animations: AnimationGroup[], options: SequenceOptions = {}) {
    this.animations = animations;
    this.options = options;
  }

  static calculateOffsets(count: number, options: SequenceOptions = {}): number[] {
    return calculateSequenceOffsets(count, options);
  }

  getOffsets(): number[] {
    return calculateSequenceOffsets(this.animations.length, this.options);
  }

  getAnimations(): AnimationGroup[] {
    return this.animations;
  }

  getOptions(): SequenceOptions {
    return this.options;
  }
}
