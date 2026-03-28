import type {
  InteractConfig,
  Effect,
  EffectRef,
  EffectBase,
  TransitionEffect,
  Interaction,
  TransitionOptions,
  StyleProperty,
  TransitionProperty,
} from '../types';
import {
  createStateRuleAndCSSTransitions,
  generateId,
  getFullPredicateByType,
  getSelectorCondition,
} from '../utils';
import { getSelector } from './Interact';
import { keyframesToCSS } from './utilities';
import { effectToAnimationOptions } from '../handlers/utilities';
import { getCSSAnimation, MotionKeyframeEffect, NamedEffect } from '@wix/motion';

const DEFAULT_INITIAL = {
  visibility: 'hidden',
  transform: 'none',
  translate: 'none',
  scale: 'none',
  rotate: 'none',
};

function isTemplatedKey(key: string) {
  return /\[]/g.test(key);
}

function resolveEffectForCSS(
  effect: Effect | EffectRef,
  interaction: Interaction,
  config: InteractConfig
): ({
  key: string;
  conditions: string[];
  effectId: string;
  listContainer?: string;
  listItemSelector?: string;
  selector?: string;
} & (
  { namedEffect: NamedEffect;
    keyframeEffect?: never;
    transition?: never;
    transitionProperties?: never;
  } |
  { namedEffect?: never;
    keyframeEffect: MotionKeyframeEffect;
    transition?: never;
    transitionProperties?: never;
  } |
  { namedEffect?: never;
    keyframeEffect?: never;
    transition: TransitionOptions & { styleProperties: StyleProperty[] };
    transitionProperties?: never;
  } |
  { namedEffect?: never;
    keyframeEffect?: never;
    transition?: never;
    transitionProperties: TransitionProperty[];
  } |
  { namedEffect?: never;
    keyframeEffect?: never;
    transition?: never;
    transitionProperties?: never;
  }
)) | null {
  const { effects = {}, conditions: configConditions = {} } = config;
  const { key: interactionKey, trigger } = interaction;
  const isPointerMove = trigger === 'pointerMove';

  // ensuring the original refernce of the effect has an id (required for states)
  if (!effect.effectId) {
    effect.effectId = generateId();
  }
  const { effectId } = effect;

  let fullEffect: EffectBase & TransitionEffect & {
    namedEffect?: NamedEffect,
    customEffect?: (element: Element, progress: any) => void,
    keyframeEffect?: MotionKeyframeEffect,
  } = {...(effects[effectId] || {}), ...effect};

  let { key, conditions } = fullEffect;
  
  if (!key) {
    //
    // Uncomment code below for safety against empty key
    //
    // if (!interactionKey) {
    //   return null;
    // }
    key = interactionKey;
  }
  if (!isTemplatedKey(key)) {
    // should probably find a way to support those
    return null;
  }
  // TODO: handle here any escaping if needed

  if (!conditions) {
    conditions = [];
  }
  // It should be examined if effects should inherit and apply the conditions of the
  // interaction, e.g. trigger, or whether it is the triggering mechanism that should enforce it.
  // In case we wish to do so, there is also the question of which of these could be inherited
  // when source is different than target (currently only media-type).
  //
  // Uncomment code below to inherit media-type conditions from interaction
  //
  // if (interaction.conditions && interaction.conditions.length) {
  //   conditions.push(...(interaction.conditions.filter(
  //     (condition) => configConditions[condition]?.type === 'media')
  //   ));
  // }
  conditions = [...(new Set(
    ...conditions.filter((condition: string) => configConditions[condition])
  ))];

  const resolvedEffect = { ...fullEffect, key, conditions, effectId }

  const {
    namedEffect,
    customEffect,
    keyframeEffect,
    transition,
    transitionProperties,
    ...rest
  } = resolvedEffect;

  if (namedEffect) {
    // With the 2D nature of pointerMove namedEffects, there is no easy way to mimic the
    // behavior with CSSAnimations. 
    return (isPointerMove || !namedEffect.type) ? null : { namedEffect, ...rest };
  } else if (keyframeEffect) {
    //
    // Uncomment code below for safety against empty keyframeEffect name
    //
    // if (!keyframeEffect.name) {
    //   const canUseEffectId = effectId && !(effects[effectId] && ('keyframeEffect' in effect));
    //   keyframeEffect.name = canUseEffectId ? effectId : generateId();
    // }
    return { keyframeEffect, ...rest };
  } else if (customEffect) {
    // customEffect does not necessarily have to be bailed out and we could already
    // create the dummy animation for it using CSS (except for pointerMove trigger).
    // This will also allow overriding it with an empty effect at another breakpoint.
    //
    // Uncomment code below to allow it by replacing customEffect with empty-frames keyframeEffect
    //
    // return isPointerMove ? null : {
    //   keyframeEffect: {name: 'custom-effect-css-anim', keyframes: [{}, {}]}, ...rest
    // };
    return null;
  } else if (transition) {
    return {transition, ...rest};
  } else {
    return transitionProperties ? { transitionProperties, ...rest } : rest;
  }
}

function getElementHash(
  elementIdentifier: {
    key: string;
    listContainer?: string;
    listItemSelector?: string;
    selector?: string;
  },
) : string {
  const { key, listContainer, listItemSelector, selector } = elementIdentifier;
  return `key-${key}-lc-${listContainer || ''}-lis-${listItemSelector || ''}-s-${selector || ''}`;
}

type RuleObj = {
  key: string;
  childSelector?: string;
  declarations: {name: string; value: string | number; }[];
  media?: string;
  states?: string[];
  selectorCondition?: string;
};

function buildCSSRule(rule: RuleObj) : string {
  const {
    key,
    childSelector,
    declarations,
    media,
    states,
    selectorCondition,
  } = rule;
  if (!declarations.length) {
    return '';
  }

  let cssRule = declarations.map(({name, value}) => `${name}: ${value};`).join('\n');

  if (selectorCondition) {
    cssRule = `${selectorCondition} {\n${cssRule}\n}`;
  }
  if (childSelector) {
    cssRule = `${childSelector} {\n${cssRule}\n}`;
  }

  if (states && states.length) {
    const statesSelector = states.map(
      (state) => `:state(${state}), :--${state}, [data-interact-effect~="${state}"]`
    ).join(', ');
    cssRule = `&:is(${statesSelector}) {\n${cssRule}\n}`;
  }

  const keySelector = `[data-interact-key="${key}"]`;
  cssRule = `${keySelector} {\n${cssRule}\n}`;

  if (media) {
    cssRule = `@media ${media} {\n${cssRule}\n}`;
  }

  return cssRule;
}

function addCustomPropToListDeclaration(
  declarations: {name: string; value: string | number; }[],
  propName: string,
  customPropName: string,
  fallback: string
) : void {
  const newValue = `var(${customPropName}, ${fallback})`;
  const existingDeclaration = declarations.find(({name}) => name === propName);

  if (!existingDeclaration) {
    declarations.push({
      name: propName,
      value: newValue
    });
  } else {
    existingDeclaration.value = `${existingDeclaration.value}, ${newValue}`
  }
}

export function _generate(
  config: InteractConfig,
  useFirstChild: boolean = true
): {
  cssRules: RuleObj[];
  keyframes: MotionKeyframeEffect[]
} {
  const configConditions = config.conditions || {};

  const keyframesMap = new Map <string, Keyframe[]>();
  const targetToAccumulatedRule = new Map<string, RuleObj>();

  const cssRules: RuleObj[] = [];

  config.interactions.forEach((interaction, interactionIdx) => {
    const {effects = [], sequences = []} = interaction;
    const animationTargets = new Map<string, {animationCustomProp: string; compositionCustomProp: string}>();
    const transitionTargets = new Map<string, {transitionCustomProp: string; cascadingProps: string[]}>();

    effects.forEach((effect) => {
      const resolvedEffect = resolveEffectForCSS(effect, interaction, config);
      if (!resolvedEffect) {
        return;
      }

      const {
        key,
        effectId,
        conditions,
        namedEffect,
        keyframeEffect,
        transition,
        transitionProperties
      } = resolvedEffect;

      // TODO: fix for uniqueness and escaping
      const targetHash = getElementHash(resolvedEffect);

      const childSelector = getSelector(
        resolvedEffect,
        { asCombinator: true, useFirstChild, addItemFilter: true }
      );

      if (!targetToAccumulatedRule.has(targetHash)) {
        targetToAccumulatedRule.set(targetHash, {
          key,
          childSelector,
          declarations: []
        });
      }

      const media = getFullPredicateByType(conditions, configConditions, 'media');
      // TODO: fix for & if needed
      const selectorCondition = getSelectorCondition(conditions, configConditions);

      const effectRule: RuleObj = {
        key,
        childSelector,
        declarations: [],
        media,
        selectorCondition,
      };
      const { declarations } = effectRule;

      const animationCustomProp = `--animation-${interactionIdx}-${targetHash}`;
      const compositionCustomProp = `--animation-composition-${interactionIdx}-${targetHash}`;
      const transitionCustomProp = `--transition-${interactionIdx}-${targetHash}`;

      if (namedEffect || keyframeEffect) {
        // accumulate animation custom-properties to the list
        if (!animationTargets.has(targetHash)) {
          animationTargets.set(targetHash, {animationCustomProp, compositionCustomProp});
        }

        const animationOptions = effectToAnimationOptions(resolvedEffect);
        const cssAnimations = getCSSAnimation(null, animationOptions).filter((anim) => anim.name);

        // accumulate keyframes
        cssAnimations.forEach(({ name, keyframes }) => {
          keyframesMap.set(name as string, keyframes);
        });

        // declare custom parameters
        declarations.push(...cssAnimations.flatMap(({custom}) => 
          Object.entries(custom || {})
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => ({name: key, value: value as string | number}))
        ))

        // declare animation and composition custom properties
        declarations.push({
          name: animationCustomProp,
          value: cssAnimations.map(({animation}) => animation).join(', '),
        }, {
          name: compositionCustomProp,
          value: cssAnimations.map(({composition}) => composition || 'replace').join(', '),
        });
      } else if (transition || transitionProperties) {
        // Mark as seen to add transition custom-property to the list
        // cascaded props from earlier transitions in the array of effects on the same target
        // are passed on for invalidation, effectively turning off earlier same-target transitions
        // from same interaction.
        if (!transitionTargets.has(targetHash)) {
          transitionTargets.set(targetHash, {transitionCustomProp, cascadingProps: []});
        }
        const { cascadingProps } = transitionTargets.get(targetHash)!;

        effectRule.states = [effectId];

        const properties = (transition?.styleProperties || transitionProperties || []);
        const { transitions } = createStateRuleAndCSSTransitions(resolvedEffect);

        // invalidating earlier cascaded custom properties
        declarations.push(...cascadingProps.map((name) => ({name, value: ' '})));
        // pushing new custom properties to cascade
        const newCascadingProps = properties.map(({name}) => `--${name}-${targetHash}`);
        cascadingProps.push(...newCascadingProps);

        // declaring custom properties and their assignments to the actual properties
        declarations.push(...newCascadingProps.map((name, index) => ({name, value: properties[index].value})));
        declarations.push(...newCascadingProps.map((name, index) => ({name: properties[index].name, value: `var(${name}, )`})));

        // declaring transition custom property
        declarations.push({
          name: transitionCustomProp,
          value: transitions.join(', '),
        });
      } else {
        // invalidating any earlier cascaded custom properties
        declarations.push(...(transitionTargets.get(targetHash)!.cascadingProps || []).map(
          (name) => ({name, value: ' '})
        ));

        // setting off animation, composition and transition custom properties
        declarations.push({
          name: animationCustomProp,
          value: 'none',
        }, {
          name: compositionCustomProp,
          value: 'replace',
        }, {
          name: transitionCustomProp,
          value: '_',
        });
      }

      cssRules.push(effectRule);
    });

    // assuming sequences should be prioritized in cascade
    sequences.forEach((sequence) => {
    });

    animationTargets.forEach(({animationCustomProp, compositionCustomProp}, hash) => {
      const { declarations } = targetToAccumulatedRule.get(hash)!;
      addCustomPropToListDeclaration(
        declarations, 'animation', animationCustomProp, 'none'
      );
      addCustomPropToListDeclaration(
        declarations, 'animation-composition', compositionCustomProp, 'replace'
      );
    });
    transitionTargets.forEach(({transitionCustomProp}, hash) => {
      const { declarations } = targetToAccumulatedRule.get(hash)!;
      addCustomPropToListDeclaration(
        declarations, 'animation', transitionCustomProp, 'none'
      );
    });
  });

  for (const rule of targetToAccumulatedRule.values()) {
    cssRules.push(rule);
  }

  const keyframes = Object.entries(keyframesMap).map(([name, keyframes]) => ({name, keyframes}));

  return {cssRules, keyframes };
}

/**
 * Generates CSS for animations from an InteractConfig.
 *
 * @param config - The interact configuration containing effects and interactions
 * @returns string containing all of the CSS rules needed for time-based animations
 */
export function generate(config: InteractConfig): string {
  const {cssRules, keyframes} = _generate(config);

  const css = [
    ...keyframes.map(({name, keyframes}) => keyframesToCSS(name, keyframes)),
    ...cssRules.map(buildCSSRule)
  ];

  return css.join('\n');
}

