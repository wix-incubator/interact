import type {
  AnimationEffectAPI,
  AnimationData,
  ScrubAnimationOptions,
  AnimationExtraOptions,
  DomApi,
} from '../types';

type ScrubOptions = ScrubAnimationOptions & AnimationExtraOptions;

export interface ScrollEffectModule {
  web(options: ScrubOptions, dom?: DomApi): AnimationData[];
}

export interface MouseEffectModule {
  web(options: ScrubOptions): (element: HTMLElement) => object;
}

export interface BackgroundScrollEffectModule {
  create(options: ScrubOptions, dom?: DomApi): AnimationData[];
}

export interface MouseCreateEffectModule {
  create(options: ScrubOptions): (element: HTMLElement) => object;
}

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
