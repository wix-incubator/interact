import type {
  AnimationEffectAPI,
  AnimationData,
  ScrubAnimationOptions,
  AnimationExtraOptions,
  DomApi,
} from '../types';

/**
 * Effect module interfaces use method syntax for bivariance,
 * allowing functions with more specific parameter types to be assignable.
 */

type ScrubOptions = ScrubAnimationOptions & AnimationExtraOptions;

/** Scroll effects - only have web, return AnimationData[] */
export interface ScrollEffectModule {
  web(options: ScrubOptions, dom?: DomApi): AnimationData[];
}

/** Mouse effects - web returns a factory function that creates animation instances */
export interface MouseEffectModule {
  web(options: ScrubOptions): (element: HTMLElement) => object;
}

/** Background scroll effects - use create instead of web */
export interface BackgroundScrollEffectModule {
  create(options: ScrubOptions, dom?: DomApi): AnimationData[];
}

/** Mouse effects using create - returns a factory function */
export interface MouseCreateEffectModule {
  create(options: ScrubOptions): (element: HTMLElement) => object;
}

/**
 * Effect modules can have different shapes depending on the effect type:
 * - Entrance/Ongoing: { web, style, getNames, prepare? } - returns AnimationData[]
 * - Scroll: { web } - returns AnimationData[]
 * - Mouse: { web | create } - returns (element: HTMLElement) => MouseAnimationInstance
 * - Background Scroll: { create } - returns AnimationData[]
 */
export type EffectModule =
  | AnimationEffectAPI<'time'>
  | AnimationEffectAPI<'scrub'>
  | ScrollEffectModule
  | MouseEffectModule
  | MouseCreateEffectModule
  | BackgroundScrollEffectModule;

const registry: Record<string, EffectModule> = {};

export function registerEffects(effects: Record<string, EffectModule>) {
  Object.assign(registry, effects);
}

export function getRegisteredEffect(name: string) {
  if (name in registry) {
    return registry[name];
  } else {
    console.warn(
      `${name} not found in registry. Please make sure to import and register the preset.`,
    );
    return null;
  }
}
