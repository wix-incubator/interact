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
  EffectCSSProps,
  MotionCSSAnimationResult,
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

function getTransitionData(
  effect: Effect & { key: string },
  childSelector: string
) {
  const args: CreateTransitionCSSParams = {
    key: effect.key,
    effectId: (effect as Effect).effectId!,
    transition: (effect as TransitionEffect).transition,
    properties: (effect as TransitionEffect).transitionProperties,
    childSelector,
  };
  return createStateRuleAndCSSTransitions(args);
}

function getAnimationData(effect: Effect): MotionCSSAnimationResult[] {
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

  if (fullEffect.namedEffect ||
      fullEffect.keyframeEffect ||
      fullEffect.transition ||
      fullEffect.transitionProperties) {
    if (!fullEffect.key) {
      fullEffect.key = interaction.key;
    }

    if (interaction.conditions && interaction.conditions.length) {
      fullEffect.conditions = [...new Set(...interaction.conditions, ...(fullEffect.conditions || []))]
          .filter((condition) => conditionDefinitions[condition]);
    }
    
    const { keyframeEffect } = fullEffect;
    if (keyframeEffect && !keyframeEffect.name) {
      // use effectId only if the keyframes are not overridden by effectRef or effectRef has a unique effectId (no reference)
      const canUseEffectId =
        (effectRef.effectId && !effectsMap[effectRef.effectId]) ||
        !(effectRef as TimeEffect & { keyframeEffect: MotionKeyframeEffect }).keyframeEffect;
      keyframeEffect.name = canUseEffectId ? effectRef.effectId : generateId();
    }

    fullEffect.initial = fullEffect.initial === false || interaction.trigger !== 'viewEnter' ?
      undefined : (fullEffect.initial || DEFAULT_INITIAL);

    return fullEffect;
  }

  return null;
}

function buildConditionalRule(
  selector: string,
  propsToApply: Record<string, string | number | undefined | null>,
  conditions: string[],
  configConditions: Record<string, Condition>
) {
  const declarations: string[] = [];
  for (const [key, val] of Object.entries(propsToApply)) {
    if (val !== undefined && val !== null) {
      declarations.push(`${key}: ${val};`);
    }
  }

  const selectorCondition = getSelectorCondition(conditions, configConditions);
  const targetSelector = selectorCondition ?
    applySelectorCondition(selector, selectorCondition) : selector;

  let rule = `${targetSelector} {\n${declarations.join('\n')}\n}`;

  ['container' as const, 'media' as const].forEach((type) => {
    const predicate = getFullPredicateByType(conditions, configConditions, type);
    if (predicate) {
      rule = `@${type} ${predicate} { ${rule} }`;
    }
  });

  return rule;
}

function buildAnimationCompositionDeclaration(compositions: CompositeOperation[]) {
  const compositionRepeatLength = shortestRepeatingPatternLength(compositions);
  let resultCompositions = compositions.slice(0, compositionRepeatLength);

  if (resultCompositions.length === 0) {
    return '';
  }

  return `animation-composition: ${resultCompositions.join(', ')};`
}

function buildUnconditionalRuleFromCustomProps(
  selector: string,
  declarationPropName: string,
  customPropNames: string[],
  fallback: string,
  extraDeclarations?: string[]
) {
  const declarations: string[] = extraDeclarations && extraDeclarations.length ? [...extraDeclarations] : [];

  const customProps = customPropNames.map((propName) => `var(${propName}, ${fallback})`);
  declarations.push(`${declarationPropName}: ${customProps.join(', ')};`);

  return `${selector} {\n${declarations.join('\n')}\n}`;
}

function generateTransitions(
  selectorTransitionPropsMap: Map<string, EffectCSSProps[]>,
  transitions: string[],
  selector: string,
  escapedTargetKey: string,
  conditions: string[]
) {
  if (!selectorTransitionPropsMap.has(selector)) {
    selectorTransitionPropsMap.set(selector, []);
  }
  const transitionPropsArray = selectorTransitionPropsMap.get(selector)!;

  for (const transition of transitions) {
    const customPropName = `--trans-def-${escapedTargetKey}-${transitionPropsArray.length}`;
    transitionPropsArray.push({
      declaration: transition,
      conditions,
      customPropName
    });
  }
}

function generateAnimations(
  selectorAnimationPropsMap: Map<string, EffectCSSProps[]>,
  keyframeMap: Map<string, string>,
  animationDataList: MotionCSSAnimationResult[],
  initial: Effect['initial'],
  selector: string,
  escapedTargetKey: string,
  conditions: string[],
) {
  if (!selectorAnimationPropsMap.has(selector)) {
    selectorAnimationPropsMap.set(selector, []);
  }
  const animationPropsArray = selectorAnimationPropsMap.get(selector)!;

  for (const data of animationDataList) {
    const keyframeCSS = keyframesToCSS(data.name, data.keyframes, initial);
    if (keyframeCSS) {
      keyframeMap.set(data.name, keyframeCSS);
    }

    const { animation, composition, custom } = data;
    const customPropName = `--anim-def-${escapedTargetKey}-${animationPropsArray.length}`;

    animationPropsArray.push({
      declaration: animation,
      composition,
      custom,
      conditions,
      customPropName
    });
  }
}

function getRulesFromSelectorPropsMap(
  selectorPropsMap: Map<string, EffectCSSProps[]>,
  configConditions: Record<string, Condition>,
  isAnimation: boolean
) {
  const rules: string[] = [];

  for (const [baseSelector, propsArray] of selectorPropsMap) {
    propsArray.forEach((props) => {
      const { customPropName, declaration, conditions, custom } = props;

      const propsToApply = {
        [customPropName]: declaration,
        ...(isAnimation ? custom : {})
      };

      rules.push(buildConditionalRule(
        baseSelector,
        propsToApply,
        conditions,
        configConditions,
      ));
    });

    const customPropNames = propsArray.map(({ customPropName }) => customPropName);

    const extraDeclarations = [];
    if (isAnimation) {
      const compositions = propsArray.map(({ composition }) => composition || 'replace');
      const compositionDeclaration = buildAnimationCompositionDeclaration(compositions);
      if (compositionDeclaration) {
        extraDeclarations.push(buildAnimationCompositionDeclaration(compositions));
      }
    }

    rules.push(buildUnconditionalRuleFromCustomProps(
      baseSelector,
      isAnimation ? 'animation' : 'transition',
      customPropNames,
      isAnimation ? 'none' : '_',
      extraDeclarations,
    ));
  }

  return rules;
}

/**
 * Generates CSS for time-based animations from an InteractConfig.
 *
 * @param config - The interact configuration containing effects and interactions
 * @returns GetCSSResult with keyframes and animationRules
 */
export function _generateCSS(config: InteractConfig): GetCSSResult {
  const keyframeMap = new Map<string, string>();
  const selectorTransitionPropsMap = new Map<
    string,
    EffectCSSProps[]
  >();
  const selectorAnimationPropsMap = new Map<
    string,
    EffectCSSProps[]
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
        asCombinator: true,
        addItemFilter: true,
        useFirstChild: true,
      });
                
      const escapedKey = CSS.escape(effect.key);
      const keyWithNoSpecialChars = effect.key.replace(/[^\w-]/g, '');
      const selector = `[data-interact-key="${escapedKey}"] ${childSelector}`;
      const conditions = (effect.conditions || []);

      if (
        (effect as TransitionEffect).transition ||
        (effect as TransitionEffect).transitionProperties
      ) {
        const { stateRule, transitions } = getTransitionData(effect, childSelector);
        transitionRules.push(stateRule);
        if (transitions.length === 0) {
          continue;
        }

        generateTransitions(
          selectorTransitionPropsMap,
          transitions,
          selector,
          keyWithNoSpecialChars,
          conditions
        );
      }

      if (
        (effect as any).namedEffect ||
        (effect as any).keyframeEffect
      ) {
        const animationDataList = getAnimationData(effect);
        if (animationDataList.length === 0) {
          continue;
        }          

        generateAnimations(
          selectorAnimationPropsMap,
          keyframeMap,
          animationDataList,
          effect.initial,
          selector,
          keyWithNoSpecialChars,
          conditions
        );
      }
    }
  }

  transitionRules.push(...getRulesFromSelectorPropsMap(
    selectorTransitionPropsMap,
    configConditions,
    false
  ));
  const animationRules: string[] = getRulesFromSelectorPropsMap(
    selectorAnimationPropsMap,
    configConditions,
    true
  );


  return {
    keyframes: Array.from(keyframeMap.values()),
    animationRules,
    transitionRules
  };
}

/**
 * Generates CSS for animations from an InteractConfig.
 *
 * @param config - The interact configuration containing effects and interactions
 * @returns string containing all of the CSS rules needed for time-based animations
 */
export function generateCSS(config: InteractConfig): string {
  const { keyframes, animationRules, transitionRules } = _generateCSS(config);
  const css: string[] = [...keyframes, ...animationRules, ...transitionRules];
  return css.join('\n');
}
