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
  createStateRuleAndCSSTransitions,
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
  animation: string,
  composition: CompositeOperation,
  custom: Keyframe,
  conditions: string[],
  animationCustomPropName: string,
}

interface TransitionProps {
  transition: string,
  conditions: string[],
  transitionCustomPropName: string,
}
interface CSSAnimationResult {
  animation: string,
  composition: CompositeOperation,
  custom: Keyframe,
  name: string,
  keyframes: Keyframe[],
}

interface CSSTransitionResult {
  stateRule: string,
  transitions: string[],
}

function getTransitionData(
  effect: Effect & { key: string },
  childSelector: string
): CSSTransitionResult {
  const args: CreateTransitionCSSParams = {
    key: effect.key,
    effectId: (effect as Effect).effectId!,
    transition: (effect as TransitionEffect).transition,
    properties: (effect as TransitionEffect).transitionProperties,
    childSelector,
  };
  return createStateRuleAndCSSTransitions(args);
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
    
    const { keyframeEffect } = fullEffect;
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

function buildCascadingTransitionCustomPropRule(
  selector: string,
  props: TransitionProps,
  configConditions: Record<string, Condition>
) {
  const { transitionCustomPropName, transition, conditions } = props;

  const declaration: string = `${transitionCustomPropName}: ${transition};`;

  const selectorCondition = getSelectorCondition(conditions, configConditions);
  const targetSelector = selectorCondition ?
    applySelectorCondition(selector, selectorCondition) : selector;

  let rule = `${targetSelector} { ${declaration} }`;

  ['container' as const, 'media' as const].forEach((type) => {
    const predicate = getFullPredicateByType(conditions, configConditions, type);
    if (predicate) {
      rule = `@${type} ${predicate} { ${rule} }`;
    }
  });

  return rule;
}

function buildCascadingAnimationCustomPropRule(
  selector: string,
  props: AnimationProps,
  configConditions: Record<string, Condition>
) {
  const declarations: string[] = [];
  const { animationCustomPropName, animation, custom, conditions } = props;

  const propsToApply = { [animationCustomPropName]: animation, ...custom };
  for (const [key, val] of Object.entries(propsToApply)) {
    if (val !== undefined && val !== null) {
      declarations.push(`${key}: ${val};`);
    }
  }

  const selectorCondition = getSelectorCondition(conditions, configConditions);
  const targetSelector = selectorCondition ?
    applySelectorCondition(selector, selectorCondition) : selector;

  let rule = `${targetSelector} { ${declarations.join(' ')} }`;

  ['container' as const, 'media' as const].forEach((type) => {
    const predicate = getFullPredicateByType(conditions, configConditions, type);
    if (predicate) {
      rule = `@${type} ${predicate} { ${rule} }`;
    }
  });

  return rule;
}

function buildTransitionRule(
  selector: string,
  propsArray: TransitionProps[],
): string {
  const declarations: string[] = [];

  const transitions = propsArray.map((props) => `var(${props.transitionCustomPropName}, _)`);
  declarations.push(`transition: ${transitions.join(', ')};`);

  return `${selector} { ${declarations.join(' ')} }`;
}

function buildAnimationRule(
  selector: string,
  propsArray: AnimationProps[],
): string {
  const declarations: string[] = [];

  const animations = propsArray.map((props) => `var(${props.animationCustomPropName}, none)`);
  declarations.push(`animation: ${animations.join(', ')};`);

  let compositions = propsArray.map((props) => props.composition);
  const compositionRepeatLength = shortestRepeatingPatternLength(compositions);
  compositions = compositions.slice(0, compositionRepeatLength);

  if (compositions.length === 1 && compositions[0] === 'replace') {
    compositions = [];
  }

  declarations.push(`animation-composition: ${compositions.join(', ')};`);

  return `${selector} { ${declarations.join(' ')} }`;
}

/**
 * Generates CSS for time-based animations from an InteractConfig.
 *
 * @param config - The interact configuration containing effects and interactions
 * @returns GetCSSResult with keyframes and animationRules
 */
export function getCSS(config: InteractConfig): GetCSSResult {
  const keyframeMap = new Map<string, string>();
  const selectorTransitionPropsMap = new Map<
    string,
    TransitionProps[]
  >();
  const selectorAnimationPropsMap = new Map<
    string,
    AnimationProps[]
  >();
  const transitionRules: string[] = [];

  const configConditions = config.conditions || {};

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
                
      const escapedKey = CSS.escape(effect.key);
      const keyWithNoSpecialChars = effect.key.replace(/[^a-zA-Z0-9_-]/g, '');
      const selector = `[data-interact-key="${escapedKey}"] ${childSelector}`;
      const conditions = (effect.conditions || []);

      if (
        (effect as TransitionEffect).transition ||
        (effect as TransitionEffect).transitionProperties
      ) {
        const {stateRule, transitions} = getTransitionData(effect, childSelector);
        transitionRules.push(stateRule);
        if (transitions.length === 0) {
          continue;
        }          

        if (!selectorTransitionPropsMap.has(selector)) {
          selectorTransitionPropsMap.set(selector, []);
        }
        const transitionPropsArray = selectorTransitionPropsMap.get(selector)!;

        for (const transition of transitions) {
          const transitionCustomPropName = `--trans-def-${keyWithNoSpecialChars}-${transitionPropsArray.length}`;
          transitionPropsArray.push({
            transition,
            conditions,
            transitionCustomPropName
          });
        }
      }

      if (
        (effect as any).namedEffect ||
        (effect as any).keyframeEffect
      ) {
        const animationDataList = getAnimationData(effect);
        if (animationDataList.length === 0) {
          continue;
        }          

        if (!selectorAnimationPropsMap.has(selector)) {
          selectorAnimationPropsMap.set(selector, []);
        }
        const animationPropsArray = selectorAnimationPropsMap.get(selector)!;

        for (const data of animationDataList) {
          const keyframeCSS = keyframesToCSS(data.name, data.keyframes, effect.initial);
          if (keyframeCSS) {
            keyframeMap.set(data.name, keyframeCSS);
          }

          const { animation, composition, custom } = data;
          const animationCustomPropName = `--anim-def-${keyWithNoSpecialChars}-${animationPropsArray.length}`;

          animationPropsArray.push({
            animation,
            composition,
            custom,
            conditions,
            animationCustomPropName
          });
        }
      }
    }
  }

  for (const [baseSelector, transitionPropsArray] of selectorTransitionPropsMap) {
    transitionPropsArray.forEach((transitionProps) => {
      transitionRules.push(buildCascadingTransitionCustomPropRule(
        baseSelector,
        transitionProps,
        configConditions
      ));
    });

    transitionRules.push(buildTransitionRule(baseSelector, transitionPropsArray));
  }

  const animationRules: string[] = [];
  for (const [baseSelector, animationPropsArray] of selectorAnimationPropsMap) {
    animationPropsArray.forEach((animationProps) => {
      animationRules.push(buildCascadingAnimationCustomPropRule(
        baseSelector,
        animationProps,
        configConditions
      ));
    });

    animationRules.push(buildAnimationRule(baseSelector, animationPropsArray));
  }

  return {
    keyframes: Array.from(keyframeMap.values()),
    animationRules,
    transitionRules
  };
}

export function generate(config: InteractConfig): string {
  const { keyframes, animationRules, transitionRules } = getCSS(config);
  const css: string[] = [...keyframes, ...animationRules, ...transitionRules];
  return css.join('\n');
}
