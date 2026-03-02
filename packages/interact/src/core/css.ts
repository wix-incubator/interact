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
  ViewEnterParams,
} from '../types';
import {
  createStateRuleAndCSSTransitions,
  applySelectorCondition,
  generateId,
  isTimeTrigger,
  shortestRepeatingPatternLength,
  getFullPredicateByType,
  getSelectorCondition,
} from '../utils';
import { getSelector } from './Interact';
import { keyframeObjectToKeyframeCSS, keyframesToCSS } from './utilities';
import { effectToAnimationOptions } from '../handlers/utilities';
import { getCSSAnimation, MotionKeyframeEffect } from '@wix/motion';

const DEFAULT_INITIAL = {
  visibility: 'hidden',
  transform: 'none',
  translate: 'none',
  scale: 'none',
  rotate: 'none',
};

// update when more triggers are supported
function isCSSSupported(interaction: Interaction) {
  return isTimeTrigger(interaction.trigger);
}

function getTransitionData(effect: Effect & { key: string }, childSelector: string, selectorCondition?: string) {
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

function haveSameSelectorConditions(
  conditionsArray1: string[] | undefined,
  conditionsArray2: string[] | undefined,
  conditionDefinitions: Record<string, Condition>,
): boolean {
  const set1: Set<string> = new Set(...(conditionsArray1 || []).filter((condition) => conditionDefinitions[condition]?.type === 'selector'));
  const set2: Set<string> = new Set(...(conditionsArray2 || []).filter((condition) => conditionDefinitions[condition]?.type === 'selector'));
  if (set1.size !== set2.size) {
    return false;
  }
  return [...set1].every((condition) => set2.has(condition))
}

function shouldUseInitial(
  resolvedEffect: Effect & { key: string, conditions: string[] },
  interaction: Interaction,
  conditionDefinitions: Record<string, Condition>
): boolean {
  const { 
    initial,
    key: effectKey,
    selector: effectSelector,
    listContainer: effectListContainer,
    listItemSelector: effectlistItemSelector,
    conditions: effectConditions,
  } = resolvedEffect;

  const {
    trigger,
    params,
    key: interactionKey,
    selector: interactionSelector,
    listContainer: interactionListContainer,
    listItemSelector: interactionlistItemSelector,
    conditions: interactionConditions,
  } = interaction;

  const { type } = params as ViewEnterParams;

  return !(
    // initial is not disabled and trigger is entrance-once
    initial === false || trigger !== 'viewEnter' || (type && type !== 'once') ||
    // key is the same
    effectKey !== interactionKey ||
    // selector is the same or falsy in both
    effectSelector !== interactionSelector || !(effectSelector || interactionSelector) ||
    // listContainer is the same or falsy in both
    effectListContainer !== interactionListContainer || !(effectListContainer || interactionListContainer) ||
    // listItemSelector is the same or falsy in both
    effectlistItemSelector !== interactionlistItemSelector || !(effectlistItemSelector || interactionlistItemSelector) ||
    // selectors of type condition are the same
    haveSameSelectorConditions(effectConditions, interactionConditions, conditionDefinitions)
  );
}

function resolveEffect(
  effectRef: Effect | EffectRef,
  effectsMap: Record<string, Effect>,
  interaction: Interaction,
  conditionDefinitions: Record<string, Condition>,
): (Effect & { key: string; conditions: string[] }) {
  const fullEffect: any = effectRef.effectId
    ? { ...effectsMap[effectRef.effectId], ...effectRef }
    : { ...effectRef };

  if (!fullEffect.key) {
    fullEffect.key = interaction.key;
  }

  fullEffect.conditions = [
    ...new Set(...(fullEffect.conditions || [])),
  ].filter((condition) => conditionDefinitions[condition as string]);

  const { keyframeEffect } = fullEffect;
  if (keyframeEffect && !keyframeEffect.name) {
    const canUseEffectId =
      (effectRef.effectId && !effectsMap[effectRef.effectId]) ||
      !(effectRef as TimeEffect & { keyframeEffect: MotionKeyframeEffect }).keyframeEffect;
    keyframeEffect.name = canUseEffectId ? effectRef.effectId : generateId();
  }

  fullEffect.initial = shouldUseInitial(fullEffect, interaction, conditionDefinitions)
      ? fullEffect.initial || DEFAULT_INITIAL
      : undefined;

  return fullEffect;
}

const buildSelector = (
  key: string,
  effect: Effect,
  useFirstChild: boolean,
  configConditions: Record<string, Condition>,
): string => {
  const escapedKey = key.replace(/"/g, "'");

  let baseSelector = `[data-interact-key="${escapedKey}"]`;

  const elementSelector = getSelector(effect, { asCombinator: true, useFirstChild });

  if (elementSelector) {
    baseSelector = `${baseSelector} ${elementSelector}`;
  }

  const conditionSelector = getSelectorCondition(
    effect.conditions,
    configConditions,
  );

  if (conditionSelector) {
    baseSelector = applySelectorCondition(baseSelector, conditionSelector);
  }

  return baseSelector;
};

export function generateInitialStates(_config: InteractConfig, useFirstChild: boolean = false): string {
  const css: string[] = [];
  const processedSelectors = new Set<string>();

  _config.interactions.forEach(
    (interaction) => {
      const {
        key,
        trigger,
        params,
        effects,
      } = interaction;

      const configConditions = _config.conditions || {};

      const isViewEnter = trigger === 'viewEnter';
      if (isViewEnter) {
        const interactionParams = params as ViewEnterParams;
        const isOnce = !interactionParams?.type || interactionParams.type === 'once';

        if (isOnce) {
          effects.forEach((effect) => {
            const resolvedEffect = resolveEffect(effect, _config.effects, interaction, configConditions);
            const { initial } = resolvedEffect;

            if (!initial) {
              return;
            }

            const selector = buildSelector(
              key,
              resolvedEffect,
              useFirstChild,
              configConditions
            );

            if (!processedSelectors.has(selector)) {
              processedSelectors.add(selector);
              css.push(`@media (prefers-reduced-motion: no-preference) {\n${selector}:not([data-interact-enter])${keyframeObjectToKeyframeCSS(initial, '')}\n}`);
            }
          });
        }
      }
    },
  );

  return css.join('\n');
}

function buildConditionalRule(
  selector: string,
  propsToApply: Record<string, string | number | undefined | null>,
  conditions: string[],
  configConditions: Record<string, Condition>,
) {
  const declarations: string[] = [];
  for (const [key, val] of Object.entries(propsToApply)) {
    if (val !== undefined && val !== null) {
      declarations.push(`${key}: ${val};`);
    }
  }

  const selectorCondition = getSelectorCondition(conditions, configConditions);
  const targetSelector = selectorCondition
    ? applySelectorCondition(selector, selectorCondition)
    : selector;

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

  return `animation-composition: ${resultCompositions.join(', ')};`;
}

function buildUnconditionalRuleFromCustomProps(
  selector: string,
  declarationPropName: string,
  customPropNames: string[],
  fallback: string,
) {
  const declarations: string[] = [];

  const customProps = customPropNames.map((propName) => `var(${propName}, ${fallback})`);
  declarations.push(`${declarationPropName}: ${customProps.join(', ')};`);
  if (declarationPropName === 'animation') {
    const compositionCustomProps = customPropNames.map((propName) => `var(${propName}-composition, replace)`);
    declarations.push(`${declarationPropName}-composition: ${compositionCustomProps.join(', ')};`);
  }

  return `${selector} {\n${declarations.join('\n')}\n}`;
}

function generateTransitions(
  selectorTransitionPropsMap: Map<string, EffectCSSProps[]>,
  transitions: string[],
  selector: string,
  escapedTargetKey: string,
  conditions: string[],
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
      customPropName,
    });
  }
}

function generateAnimations(
  selectorAnimationPropsMap: Map<string, EffectCSSProps[]>,
  keyframeMap: Map<string, string>,
  animationDataList: MotionCSSAnimationResult[],
  initial: Effect['initial'],
  selector: string,
  customPropName: string,
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

    animationPropsArray.push({
      declaration: animation,
      composition,
      custom,
      conditions,
      customPropName,
    });
  }
}

function getRulesFromSelectorPropsMap(
  selectorPropsMap: Map<string, EffectCSSProps[]>,
  configConditions: Record<string, Condition>,
  isAnimation: boolean,
) {
  const rules: string[] = [];

  for (const [baseSelector, propsArray] of selectorPropsMap) {
    propsArray.forEach((props) => {
      const { customPropName, declaration, conditions, custom } = props;

      const propsToApply = {
        [customPropName]: declaration,
        ...(isAnimation ? custom : {}),
      };

      rules.push(buildConditionalRule(baseSelector, propsToApply, conditions, configConditions));
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

    rules.push(
      buildUnconditionalRuleFromCustomProps(
        baseSelector,
        isAnimation ? 'animation' : 'transition',
        customPropNames,
        isAnimation ? 'none' : '_',
        extraDeclarations,
      ),
    );
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
  const selectorTransitionPropsMap = new Map<string, string[]>();
  const selectorAnimationPropsMap = new Map<string, string[]>();
  const transitionRules: string[] = [];
  const animationRules: string[] = [];

  const configConditions = config.conditions || {};

  config.interactions.filter(isCSSSupported).forEach((interaction, interactionIdx) => {
    const resolvedEffcts = interaction.effects.map(
      (effectRef) => resolveEffect(effectRef, config.effects, interaction, configConditions)
    ).filter(
      ({key}) => !(/\[]/g.test(key))
    );

    for (const effect of resolvedEffcts) {
      const {key, conditions} = effect;
      const {transition, transitionProperties} = effect as TransitionEffect;
      const {namedEffect, keyframeEffect} = effect as TimeEffect;
      const escapedKey = CSS.escape(key);
      const keyWithNoSpecialChars = key.replace(/[^\w-]/g, '');
      const customPropName = `--interaction-${interactionIdx}-${keyWithNoSpecialChars}`;      

      const childSelector = getSelector(effect, {
        asCombinator: true,
        addItemFilter: true,
        useFirstChild: true,
      });

      const selectorCondition = getSelectorCondition(
        conditions,
        configConditions,
      );
      const isTransition = transition || transitionProperties;

      const selector = `[data-interact-key="${escapedKey}"] ${childSelector}`;

      if (isTransition) {
        const { stateRule, transitions } = getTransitionData(effect, childSelector, selectorCondition);
        transitionRules.push(stateRule);
        if (transitions.length === 0) {
          continue;
        }
        transitionRules.push(buildConditionalRule(
          selector,
          { [customPropName]: transitions.join(', ') },
          conditions,
          configConditions,
        ));  
      } else if (namedEffect || keyframeEffect) {
        const animationDataList = getAnimationData(effect);
        if (animationDataList.length === 0) {
          continue;
        }

        for (const data of animationDataList) {
          const keyframeCSS = keyframesToCSS(data.name, data.keyframes, effect.initial);
          if (keyframeCSS) {
            keyframeMap.set(data.name, keyframeCSS);
          }
        }
              
        const custom = animationDataList.reduce((acc, {custom}) => {
          Object.assign(acc, custom);
          return acc;
        }, {})

        animationRules.push(buildConditionalRule(
          selector,
          {
            [customPropName]: animationDataList.map(({ animation }) => animation).join(', '),
            [`${customPropName}-composition`]: animationDataList.map(({ composition }) => composition).join(', '),
            ...custom
          },
          conditions,
          configConditions,
        ));  
      } else {
        animationRules.push(buildConditionalRule(
          selector,
          {
            [customPropName]: 'none',
            [`${customPropName}-composition`]: 'replace',
          },
          conditions,
          configConditions,
        ));  
      }

      if (isNewInteraction) {
        const propsMap = isTransition ? selectorTransitionPropsMap : selectorAnimationPropsMap;
        if (!propsMap.has(selector)) {
          propsMap.set(selector, []);
        }
        const customPropsArray = selectorAnimationPropsMap.get(selector)!;
        customPropsArray.push(customPropName);
      }
    }
  });

  [selectorTransitionPropsMap, selectorAnimationPropsMap].forEach((propsMap, isAnimation) => {
    for (const [selector, customPropsArray] of propsMap) {
      (isAnimation ? animationRules : transitionRules).push(
        buildUnconditionalRuleFromCustomProps(
          selector,
          isAnimation ? 'animation' : 'transition',
          customPropsArray,
          isAnimation ? 'none' : '_',
        ),
      );
    }
  });

  return {
    keyframes: Array.from(keyframeMap.values()),
    animationRules,
    transitionRules,
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
