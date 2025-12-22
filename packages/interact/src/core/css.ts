import type {
  InteractConfig,
  GetCSSResult,
  Effect,
  EffectRef,
  TimeEffect,
  TransitionEffect,
  CreateTransitionCSSParams,
  Interaction,
  Condition,
} from '../types';
import {
  createTransitionCSS,
  applySelectorCondition,
  generateId,
  isTimeTrigger,
  shortestRepeatingPatternLength,
  getFullPredicateByType,
  getSelectorCondition
} from '../utils';
import { getSelector } from './Interact';
import { keyframesToCSS } from './utilities';
import { effectToAnimationOptions } from '../handlers/utilities';
import { getCSSAnimation, MotionKeyframeEffect } from '@wix/motion';

const DEFAULT_INITIAL = {
  visibility: 'hidden',
  transform: 'none',
  translate: 'none',
  scale: 'none',
  rotate: 'none',
};

interface AnimationProps {
  animations: string[],
  compositions: CompositeOperation[],
  custom: Keyframe,
}
interface CSSAnimationResult {
  animation: string,
  composition: CompositeOperation,
  custom: Keyframe,
  name: string,
  keyframes: Keyframe[],
}

function createEmptyAnimationProps(): AnimationProps {
  return {
    animations: [],
    compositions: [],
    custom: {},
  };
}

function addAnimationProps(
  props: AnimationProps,
  animationResult: CSSAnimationResult,
): void {
  props.animations.push(animationResult.animation);
  props.compositions.push(animationResult.composition);
  props.custom = {...props.custom, ...animationResult.custom};
}

function getTransitionRules(
  effect: Effect & { key: string },
  childSelector: string
): string[] {
  const args: CreateTransitionCSSParams = {
    key: effect.key,
    effectId: (effect as Effect).effectId!,
    transition: (effect as TransitionEffect).transition,
    properties: (effect as TransitionEffect).transitionProperties,
    childSelector,
  };
  return createTransitionCSS(args);
}

function getAnimationData(effect: Effect): CSSAnimationResult[] {
  const animationOptions = effectToAnimationOptions(effect as TimeEffect);

  const cssAnimations = getCSSAnimation(null, animationOptions);

  return cssAnimations
    .filter((anim) => anim.name)
    .map((anim) => ({
      animation: anim.animation,
      composition: anim.composition || 'replace',
      custom: anim.custom || {},
      name: anim.name as string,
      keyframes: anim.keyframes,
    }));
}

function resolveEffect(
  effectRef: Effect | EffectRef,
  effectsMap: Record<string, Effect>,
  interaction: Interaction,
  conditionDefinitions: Record<string, Condition>,
): (Effect & { key: string }) | null {
  const fullEffect: any = effectRef.effectId
      ? { ...effectsMap[effectRef.effectId], ...effectRef }
      : { ...effectRef };

  if (fullEffect.namedEffect || fullEffect.keyframeEffect || fullEffect.transition) {
    if (!fullEffect.key) {
      fullEffect.key = interaction.key;
    }
    if (interaction.conditions && interaction.conditions.length) {
      fullEffect.conditions = [...new Set(...interaction.conditions, ...(fullEffect.conditions || []))]
          .filter((condition) => conditionDefinitions[condition]);
    }
    
    const {keyframeEffect} = fullEffect;
    if (keyframeEffect && !keyframeEffect.name) {
      keyframeEffect.name = (effectRef as TimeEffect & { keyframeEffect: MotionKeyframeEffect }).keyframeEffect ?
          generateId() : effectRef.effectId;
    }

    fullEffect.initial = fullEffect.initial === 'disable' ?
      undefined : (fullEffect.initial || DEFAULT_INITIAL);

    return fullEffect;
  }

  return null;
}

function buildAnimationRule(
  selector: string,
  props: AnimationProps,
  conditionNames: string[],
  configConditions: Record<string, Condition>
): string {
  const declarations: string[] = [];

  let { compositions } = props;
  const compositionRepeatLength = shortestRepeatingPatternLength(props.compositions);
  compositions = compositions.slice(0, compositionRepeatLength);
  if (compositions.length === 1 && compositions[0] === 'replace') {
    compositions = [];
  }

  const { animations, custom } = props;

  declarations.push(`animation: ${animations.join(', ')};`);
  declarations.push(`animation-composition: ${compositions.join(', ')};`);

  for (const [key, val] of Object.entries(custom)) {
    if (val !== undefined && val !== null) {
      declarations.push(`${key}: ${val};`);
    }
  }

  // TODO: (ameerf) - getSelectorCondition takes the first selector - fix it to get the AND of all selectors
  const selectorCondition = getSelectorCondition(conditionNames, configConditions);
  const targetSelector = selectorCondition ?
    applySelectorCondition(selector, selectorCondition) : selector;

  let rule = `${targetSelector} { ${declarations.join(' ')} }`;

  ['container' as const, 'media' as const].forEach((type) => {
    const predicate = getFullPredicateByType(conditionNames, configConditions, type);
    if (predicate) {
      rule = `@${type} ${predicate} { ${rule} }`;
    }
  });

  return rule;
}

/**
 * Generates CSS for time-based animations from an InteractConfig.
 *
 * @param config - The interact configuration containing effects and interactions
 * @returns GetCSSResult with keyframes and animationRules
 */
export function getCSS(config: InteractConfig): GetCSSResult {
  const transitionRules: string[] = [];
  const keyframeMap = new Map<string, string>(); // name -> CSS @keyframes rule
  // TODO: (ameerf) - this couldn't possibly be the correct mapping along with condition cascading - get a well-defined structure from ydaniv
  const selectorPropsMap = new Map< // selector -> conditionSetHash -> CSS props to apply
    string,
    Map<number, AnimationProps>
  >();

  const configConditions = config.conditions || {};
  const conditionHashNumbers = Object.keys(configConditions).reduce((acc, condition, index) => {
    acc[condition] = 1 << index;
    return acc;
  }, {} as Record <string, number>);

  for (const interaction of config.interactions) {
    if (!isTimeTrigger(interaction.trigger)) {
      continue;
    }

    for (const effectRef of interaction.effects) {
      const effect = resolveEffect(effectRef, config.effects, interaction, configConditions);
      if (!effect) continue;

      const childSelector = getSelector(effect, {
        asCombinator: true, // TODO: (ameerf) - correct?
        addItemFilter: Boolean(effect.listItemSelector), // TODO: (ameerf) - correct?
      });

      if (
        (effect as TransitionEffect).transition ||
        (effect as TransitionEffect).transitionProperties
      ) {
        // TODO: (ameerf) - Do we want to override transition property like this?
        transitionRules.push(...getTransitionRules(effect, childSelector));
      }

      if (
        (effect as any).namedEffect ||
        (effect as any).keyframeEffect
      ) {
        const animationDataList = getAnimationData(effect);
        if (animationDataList.length === 0) continue;          
                
        const escapedKey = effect.key.replace(/"/g, "'");
        const selector = `[data-interact-key="${escapedKey}"] ${childSelector}`;
        if (!selectorPropsMap.has(selector)) {
          selectorPropsMap.set(selector, new Map<number, AnimationProps>());
        }

        for (const data of animationDataList) {
          const keyframeCSS = keyframesToCSS(data.name, data.keyframes, effect.initial);
          if (keyframeCSS) {
            keyframeMap.set(data.name, keyframeCSS);
          }

          const conditions = effect.conditions || [];
          const conditionSetHash = conditions.reduce((acc, condition) => {return acc + conditionHashNumbers[condition]}, 0);
          const conditionToProps = selectorPropsMap.get(selector)!;
          if (!conditionToProps.has) {
            conditionToProps.set(conditionSetHash, createEmptyAnimationProps());
          }

          const props = conditionToProps.get(conditionSetHash);
          addAnimationProps(props!, data);
        }
      }
    }
  }

  const animationRules: string[] = [];
  for (const [baseSelector, conditionsMap] of selectorPropsMap) {
    for (const [conditionSetHash, props] of conditionsMap) {
      if (props.animations.length === 0) {
        continue;
      }
      const conditions = Object.entries(conditionHashNumbers).reduce((acc, [condition, hash]) => {
        if (hash & conditionSetHash) {
          acc.push(condition);
        }
        return acc;
      }, [] as string[]);
      const rule = buildAnimationRule(
        baseSelector,
        props,
        conditions,
        configConditions
      );
      animationRules.push(rule);
    }
  }

  return {
    keyframes: Array.from(keyframeMap.values()),
    animationRules,
    transitionRules
  };
}

export function generate(config: InteractConfig): string {
  const {keyframes, animationRules, transitionRules} = getCSS(config);
  const css: string[] = [...keyframes, ...animationRules, ...transitionRules];

  return css.join('\n');
}
