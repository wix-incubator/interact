import { AnimationGroup } from './AnimationGroup';
import type { IndexedGroup, SequenceOptions } from './types';
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
  private baseDelays: number[];

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

    this.baseDelays = animationGroups.map((g) => this.getGroupBaseDelay(g));
    this.applyOffsets();
    this.ready = Promise.all(animationGroups.map((g) => g.ready)).then(() => {});
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

  private getGroupBaseDelay(group: AnimationGroup): number {
    return (group.animations[0]?.effect?.getTiming().delay as number) || 0;
  }

  private applyOffsets(): void {
    const offsets = this.calculateOffsets();

    this.animationGroups.forEach((group, index) => {
      const absoluteDelay = (this.baseDelays[index] || 0) + this.delay + offsets[index];
      group.setDelay(absoluteDelay);
    });
  }

  /**
   * Inserts new AnimationGroups at specified indices, then recalculates
   * stagger offsets for all groups. Each entry specifies the target index
   * in the animationGroups array where the group should be inserted.
   */
  addGroups(entries: IndexedGroup[]): void {
    if (entries.length === 0) return;

    const sorted = [...entries].sort((a, b) => b.index - a.index);

    for (const { index, group } of sorted) {
      const clampedIndex = Math.min(index, this.animationGroups.length);
      this.animationGroups.splice(clampedIndex, 0, group);
      this.baseDelays.splice(clampedIndex, 0, this.getGroupBaseDelay(group));

      const flatAnimations = [...group.animations];
      const insertAt = this.animationGroups
        .slice(0, clampedIndex)
        .reduce((sum, g) => sum + g.animations.length, 0);
      this.animations.splice(insertAt, 0, ...flatAnimations);
    }

    this.applyOffsets();
    this.ready = Promise.all(this.animationGroups.map((g) => g.ready)).then(() => {});
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
