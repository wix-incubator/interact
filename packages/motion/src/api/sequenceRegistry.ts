import type { AnimationGroup } from '../AnimationGroup';
import type { SequenceOptions } from '../types';
import { Sequence } from '../Sequence';

export type SequenceEffectConfig = {
  target: HTMLElement;
  effectOptions: Record<string, unknown>;
  sequenceOptions: SequenceOptions;
  index: number;
  total: number;
};

type GetAnimationFn = (
  target: HTMLElement,
  options: Record<string, unknown>,
  trigger?: undefined,
  reducedMotion?: boolean,
) => AnimationGroup | null;

let getAnimationFn: GetAnimationFn | null = null;

export const SequenceRegistry = {
  configs: new Map<string, SequenceEffectConfig[]>(),
  sequences: new Map<string, Sequence>(),

  setGetAnimationFn(fn: GetAnimationFn) {
    getAnimationFn = fn;
  },

  registerEffect(sequenceId: string, config: SequenceEffectConfig) {
    const list = this.configs.get(sequenceId) || [];
    list.push(config);
    this.configs.set(sequenceId, list);
  },

  getOrCreateSequence(sequenceId: string, reducedMotion?: boolean): Sequence | null {
    if (this.sequences.has(sequenceId)) {
      return this.sequences.get(sequenceId)!;
    }

    const configs = this.configs.get(sequenceId);
    if (!configs?.length || !getAnimationFn) return null;

    // Check if all effects have been registered
    const expectedTotal = configs[0].total;
    if (configs.length < expectedTotal) {
      return null; // Not all effects registered yet
    }

    // Sort by index to ensure correct order
    configs.sort((a, b) => a.index - b.index);

    // Create all AnimationGroups
    const groups: AnimationGroup[] = [];
    for (const cfg of configs) {
      const animation = getAnimationFn(cfg.target, cfg.effectOptions, undefined, reducedMotion);
      if (animation) {
        groups.push(animation);
      }
    }

    if (!groups.length) return null;

    // Create Sequence (applies delays internally)
    const sequence = new Sequence(groups, configs[0].sequenceOptions);
    this.sequences.set(sequenceId, sequence);
    return sequence;
  },

  clear() {
    this.configs.clear();
    this.sequences.clear();
  },

  clearSequence(sequenceId: string) {
    this.configs.delete(sequenceId);
    this.sequences.delete(sequenceId);
  },
};
