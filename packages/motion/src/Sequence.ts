import { AnimationGroup } from './AnimationGroup';
import type { AnimationOptions, SequenceOptions } from './types';
import { calculateOffsets, resolveEasingFunction } from './utils';
import { getAnimation } from './motion';

export class Sequence extends AnimationGroup {
  animationGroups: AnimationGroup[];
  sequenceDelay: number;
  offset: number;
  offsetEasing: (t: number) => number;
  private _calculatedOffsets: number[];

  constructor(animationGroups: AnimationGroup[], options?: SequenceOptions) {
    const allAnimations = animationGroups.flatMap((group) => group.animations);
    super(allAnimations, options);

    this.animationGroups = animationGroups;
    this.sequenceDelay = options?.delay ?? 0;
    this.offset = options?.offset ?? 0;
    this.offsetEasing = resolveEasingFunction(options?.offsetEasing);
    this._calculatedOffsets = calculateOffsets(
      animationGroups.length,
      this.offset,
      this.offsetEasing,
    );
    this._applyDelays();
  }

  private _applyDelays(): void {
    const minOffset = Math.min(...this._calculatedOffsets);
    const maxOffset = Math.max(...this._calculatedOffsets);
    const totalSpan = maxOffset - minOffset;

    this.animationGroups.forEach((group, index) => {
      // Normalize offset to be non-negative
      const normalizedOffset =
        minOffset < 0 ? this._calculatedOffsets[index] - minOffset : this._calculatedOffsets[index];
      const groupDelay = this.sequenceDelay + normalizedOffset;
      const endDelay = totalSpan - normalizedOffset;
      group.addGroupDelay(groupDelay, endDelay);
    });
  }

  getOffsetAt(index: number): number {
    return this._calculatedOffsets[index] ?? 0;
  }

  getOffsets(): number[] {
    return [...this._calculatedOffsets];
  }

  recalculateOffsets(): void {
    this._calculatedOffsets = calculateOffsets(
      this.animationGroups.length,
      this.offset,
      this.offsetEasing,
    );
  }

  static build(
    configs: Array<{ target: HTMLElement | string | null; animationOptions: AnimationOptions }>,
    sequenceOptions?: SequenceOptions,
    reducedMotion: boolean = false,
  ): Sequence | null {
    const groups = configs
      .map((cfg) => getAnimation(cfg.target, cfg.animationOptions, undefined, reducedMotion))
      .filter((a): a is AnimationGroup => a instanceof AnimationGroup);
    return groups.length ? new Sequence(groups, sequenceOptions) : null;
  }

  // Note: play(), pause(), reverse(), cancel(), setPlaybackRate(), onFinish(),
  // finished, and playState are inherited from AnimationGroup.
  // Since we pass all flattened animations to super(), the parent's
  // implementations work correctly on the same Animation objects.
}
