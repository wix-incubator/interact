import type {
  InteractConfig,
  GetCSSResult,
  TriggerType,
  Effect,
  EffectRef,
  TimeEffect,
  TransitionEffect,
  CreateTransitionCSSParams,
  Interaction,
} from '../types';
import { createTransitionCSS, applySelectorCondition } from '../utils';
import { getSelector } from './Interact';
import { effectToAnimationOptions } from '../handlers/utilities';
import { getCSSAnimation } from '@wix/motion';

type KeyframeProperty = Record<string, string | number | undefined>;
interface AnimationProps {
  animations: string[],
  compositions: CompositeOperation[],
  custom: KeyframeProperty,
}

interface CSSAnimationResult {
  animation: string,
  composition: CompositeOperation,
  custom: KeyframeProperty,
  name: string,
  keyframes: KeyframeProperty[],
}

function isTimeTrigger(trigger: TriggerType): boolean {
  return !['viewProgress', 'pointerMove'].includes(trigger);
}

/**
 * Interpolates missing offset values in keyframes array.
 * When offsets are not provided, they are evenly distributed.
 */
function interpolateOffsets(
  keyframes: KeyframeProperty[],
): KeyframeProperty[] {
  if (keyframes.length === 0) return keyframes;

  const result = keyframes.map((kf) => ({ ...kf }));
  const n = result.length;

  // Set first and last if not present
  if (result[0].offset === undefined) {
    result[0].offset = 0;
  }
  if (result[n - 1].offset === undefined) {
    result[n - 1].offset = 1;
  }

  // Find segments between defined offsets and interpolate
  let lastDefinedIndex = 0;
  for (let i = 1; i < n; i++) {
    if (result[i].offset !== undefined) {
      // Interpolate between lastDefinedIndex and i
      const startOffset = result[lastDefinedIndex].offset as number;
      const endOffset = result[i].offset as number;
      const gap = i - lastDefinedIndex;

      for (let j = lastDefinedIndex + 1; j < i; j++) {
        const progress = (j - lastDefinedIndex) / gap;
        result[j].offset = startOffset + (endOffset - startOffset) * progress;
      }

      lastDefinedIndex = i;
    }
  }

  return result;
}

/**
 * Rounds a number to avoid floating point precision issues.
 */
function roundOffset(offset: number): number {
  // Round to 2 decimal places
  return Math.round(offset * 100) / 100;
}

/**
 * Converts keyframes array to CSS @keyframes rule string.
 */
function keyframesToCSS(name: string, keyframes: KeyframeProperty[]): string {
  if (!keyframes || keyframes.length === 0) return '';

  const interpolated = interpolateOffsets(keyframes);

  const keyframeBlocks = interpolated
    .map((kf) => {
      const offset = kf.offset as number;
      const percentage = roundOffset(offset * 100);

      // Filter out offset and build property string
      const properties = Object.entries(kf)
        .filter(([key]) => key !== 'offset')
        .map(([key, value]) => {
          // Convert camelCase to kebab-case for CSS
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `${cssKey}: ${value};`;
        })
        .join(' ');

      return `${percentage}% { ${properties} }`;
    })
    .join(' ');

  return `@keyframes ${name} { ${keyframeBlocks} }`;
}

function shortestCompositionPatternLength(compositions: CompositeOperation[]): number {
  let patternLength = 1;
  let index = 1;
  while (index < compositions.length) {
    if (compositions[index] === compositions[index % patternLength]) {
      index++;
    } else {
      patternLength = Math.max(index - patternLength, patternLength) + 1;
      index = patternLength;
    }
  }
  return patternLength;
}

function getTransitionRules(effect: Effect & { key: string }, childSelector: string): string[] {
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
      name: anim.name,
      keyframes: anim.keyframes,
    }));
}

function resolveEffect(
  effectRef: Effect | EffectRef,
  effectsMap: Record<string, Effect>,
  interaction: Interaction,
): (Effect & { key: string }) | null {
  const fullEffect: any = effectRef.effectId
      ? { ...effectsMap[effectRef.effectId], ...effectRef}
      : { ...effectRef};

  if (fullEffect.namedEffect || fullEffect.keyframeEffect || fullEffect.transition) {
    if (!fullEffect.key) {
      fullEffect.key = interaction.key;
    }
    if (interaction.conditions && interaction.conditions.length) {
      fullEffect.conditions = [...new Set(...interaction.conditions, ...(fullEffect.conditions || []))]
    }
    
    const {keyframeEffect} = fullEffect;
    if (keyframeEffect && !keyframeEffect.name) {
      keyframeEffect.name = effectRef.keyframeEffect ? generateUniqueKeyframesName(keyframeEffect) : effectRef.effectId;
    }
    return fullEffect;
  }

  return null;
}

/**
 * Builds the full CSS selector for an element.
 */
function buildSelector(
  effect: Effect & {key: string},
  childSelector: string,
  selectorCondition?: string
): string {
  const escapedKey = effect.key.replace(/"/g, "'");
  const selector = `[data-interact-key="${escapedKey}"] ${childSelector}`;
  return selectorCondition
    ? applySelectorCondition(selector, selectorCondition)
    : selector;
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

function buildAnimationRule(selector: string, props: AnimationProps): string {
  const declarations: string[] = [];

  let {compositions} = props;
  const compositionRepeatLength = shortestCompositionPatternLength(props.compositions);
  compositions = compositions.slice(0, compositionRepeatLength);
  if (compositions.length === 1 && compositions[0] === 'replace') {
    compositions = [];
  }

  const {animations, custom} = props;

  declarations.push(`animation: ${animations.join(', ')};`);
  declarations.push(`animation-composition: ${compositions.join(', ')};`);

  for (const [key, val] of Object.entries(custom)) {
    declarations.push(`${key}: ${val};`);  
  }

  return `${selector} { ${declarations.join(' ')} }`;
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Generates CSS for time-based animations from an InteractConfig.
 *
 * @param config - The interact configuration containing effects and interactions
 * @returns GetCSSResult with keyframes and animationRules
 */
export function getCSS(config: InteractConfig): GetCSSResult {
  const transitionRules: string[] = [];
  const keyframeMap = new Map<string, string>(); // name -> CSS @keyframes rule
  const selectorPropsMap = new Map< // selector -> condition -> CSS props to apply
    string,
    Record<string, AnimationProps>
  >();


  for (const interaction of config.interactions) {
    if (!isTimeTrigger(interaction.trigger)) {
      continue;
    }

    for (const effectRef of interaction.effects) {
      const effect = resolveEffect(effectRef, config.effects, interaction);
      if (!effect) continue;

      const hasListItemSelector = Boolean(effect.listItemSelector);
      const childSelector = getSelector(effect, {
        asCombinator: true,
        addItemFilter: hasListItemSelector, // TODO: (ameerf) - correct?
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
          selectorPropsMap.set(selector, {});
        }

        for (const data of animationDataList) {
          const keyframeCSS = keyframesToCSS(data.name, data.keyframes);
          if (keyframeCSS) {
            keyframeMap.set(data.name, keyframeCSS);
          }

          const conditionToProps = selectorPropsMap.get(selector)!;
          const conditions = effect.conditions?.length ? effect.conditions : [''];
          for (const condition of conditions) {
            if (!conditionToProps[condition]) {
              conditionToProps[condition] = createEmptyAnimationProps();  
            }
            addAnimationProps(conditionToProps[condition], data);
          }
        }
      }
    }
  }

  const animationRules: string[] = [];
  for (const [baseSelector, conditionsMap] of selectorPropsMap) {
    for (const [condition, props] of Object.entries(conditionsMap)) {
      if (props.animations.length === 0) continue;
      const rule = buildAnimationRule(baseSelector, props, condition);
      animationRules.push(rule);
    }
  }

  return {
    keyframes: Array.from(keyframeMap.values()),
    animationRules,
    transitionRules
  };
}
