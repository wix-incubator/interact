import { AnimationGroup } from './AnimationGroup';
import { SequenceOptions } from './types';
import { calculateOffsets, resolveEasingFunction } from './utils';

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
    this.offset = options?.offset ?? 100;
    this.offsetEasing = resolveEasingFunction(options?.offsetEasing);
    this._calculatedOffsets = calculateOffsets(animationGroups.length, this.offset, this.offsetEasing);
    this._applyDelays();
  }

  private _applyDelays(): void {
    const minOffset = Math.min(...this._calculatedOffsets);
    const maxOffset = Math.max(...this._calculatedOffsets);
    const totalSpan = maxOffset - minOffset;
  
    this.animationGroups.forEach((group, index) => {
      // Normalize offset to be non-negative
      const normalizedOffset = this._calculatedOffsets[index] - minOffset;
      const groupDelay = this.sequenceDelay + normalizedOffset;
      const endDelay = totalSpan - normalizedOffset;
      group.applyGroupDelay(groupDelay, endDelay);
    });
  }

  getOffsetAt(index: number): number {
    return this._calculatedOffsets[index] ?? 0;
  }

  getOffsets(): number[] {
    return [...this._calculatedOffsets];
  }

  recalculateOffsets(): void {
    this._calculatedOffsets = calculateOffsets(this.animationGroups.length, this.offset, this.offsetEasing);
  }

  // Note: play(), pause(), reverse(), cancel(), setPlaybackRate(), onFinish(),
  // finished, and playState are inherited from AnimationGroup.
  // Since we pass all flattened animations to super(), the parent's
  // implementations work correctly on the same Animation objects.
}
