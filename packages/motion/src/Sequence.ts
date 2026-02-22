import { AnimationGroup } from './AnimationGroup';
import type { SequenceOptions } from './types';
import { linear } from './easings';
import { getJsEasing } from './utils';

/**
 * @class Sequence
 *
 * Manages multiple AnimationGroups as a coordinated timeline with staggered delays.
 * Extends AnimationGroup to inherit the playback control API while delegating
 * to child AnimationGroup instances.
 */
export class Sequence extends AnimationGroup {
  animationGroups: AnimationGroup[];
  delay: number;
  offset: number;
  offsetEasing: (p: number) => number;

  constructor(animationGroups: AnimationGroup[], options: SequenceOptions = {}) {
    const allAnimations = animationGroups.flatMap((group) => [...group.animations]);
    super(allAnimations);

    this.animationGroups = animationGroups;
    this.delay = options.delay ?? 0;
    this.offset = options.offset ?? 0;
    this.offsetEasing =
      typeof options.offsetEasing === 'function'
        ? options.offsetEasing
        : (getJsEasing(options.offsetEasing) ?? linear);

    this.ready = Promise.all(animationGroups.map((g) => g.ready)).then(() => {
      this.applyOffsets();
    });
  }

  /**
   * Calculates stagger delay offsets for each animation group using the formula:
   *   easing(i / last) * last * offset
   * where i is the group index and last is the index of the final group.
   */
  private calculateOffsets(): number[] {
    const count = this.animationGroups.length;
    if (count <= 1) return [0];

    const last = count - 1;

    return Array.from(
      { length: count },
      (_, i) => (this.offsetEasing(i / last) * last * this.offset) | 0,
    );
  }

  private applyOffsets(): void {
    const offsets = this.calculateOffsets();

    this.animationGroups.forEach((group, index) => {
      const additionalDelay = this.delay + offsets[index];

      if (additionalDelay === 0) return;

      for (const animation of group.animations) {
        const effect = animation.effect;

        if (effect) {
          const timing = effect.getTiming();

          effect.updateTiming({
            delay: (timing.delay || 0) + additionalDelay,
          });
        }
      }
    });
  }

  async onFinish(callback: () => void): Promise<void> {
    try {
      await Promise.all(this.animationGroups.map((group) => group.finished));
      callback();
    } catch (_error) {
      console.warn('animation was interrupted - aborting onFinish callback - ', _error);
    }
  }
}
