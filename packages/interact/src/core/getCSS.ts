import type {
  InteractConfig,
  GetCSSResult,
  TriggerType,
  Effect,
  EffectRef,
  TimeEffect,
  TransitionEffect,
  CreateTransitionCSSParams,
  Condition,
} from '../types';
import { createTransitionCSS } from '../utils';
import { getSelector } from './Interact';
import { effectToAnimationOptions } from '../handlers/utilities';
import { getCSSAnimation, getEasing } from '@wix/motion';

// ============================================================================
// Types
// ============================================================================

type KeyframeProperty = Record<string, string | number | undefined>;

interface AnimationProps {
  names: string[];
  durations: string[];
  delays: string[];
  timingFunctions: string[];
  iterationCounts: string[];
  directions: string[];
  fillModes: string[];
}

// ============================================================================
// Helper Utilities
// ============================================================================

/**
 * Checks if the trigger is a time-based trigger (not scrub-based).
 */
function isTimeTrigger(trigger: TriggerType): boolean {
  return !['viewProgress', 'pointerMove'].includes(trigger);
}

/**
 * Determines the animation-direction CSS value based on alternate and reversed flags.
 */
function getDirection(alternate?: boolean, reversed?: boolean): string {
  if (alternate && reversed) return 'alternate-reverse';
  if (alternate) return 'alternate';
  if (reversed) return 'reverse';
  return 'normal';
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

/**
 * Gets animation data from an effect using the motion library's getCSSAnimation.
 */
function getTransitionData(effect: Effect & { key: string }): string[] {
    const args: CreateTransitionCSSParams = {
      key: effect.key,
      effectId: (effect as Effect).effectId!,
      transition: (effect as TransitionEffect).transition,
      properties: (effect as TransitionEffect).transitionProperties,
      childSelector: getSelector(effect, {
        // TODO: (ameerf) - paste the right conditions here
        asCombinator: true,
        addItemFilter: true,
      }),
    };
    return createTransitionCSS(args);
}

interface CSSAnimationResult {
  name: string;
  keyframes: KeyframeProperty[];
}

/**
 * Gets animation data from an effect using the motion library's getCSSAnimation.
 */
function getAnimationData(effect: Effect): CSSAnimationResult[] {
  const animationOptions = effectToAnimationOptions(effect as TimeEffect);

  // Use getCSSAnimation from motion to get the animation data
  const cssAnimations = getCSSAnimation(null, animationOptions);

  return cssAnimations
    .filter((anim) => anim.name !== undefined)
    .map((anim) => ({
      name: anim.name!,
      keyframes: anim.keyframes as KeyframeProperty[],
    }));
}

function resolveEffect(
  effectRef: Effect | EffectRef,
  effectsMap: Record<string, Effect>,
  interactionKey: string,
): Effect | null {
  const fullEffect: any = effectRef.effectId
      ? { ...effectsMap[effectRef.effectId], ...effectRef}
      : { ...effectRef};

  if (fullEffect.namedEffect || fullEffect.keyframeEffect || fullEffect.transition) {
    if (!fullEffect.key) {
      fullEffect.key = interactionKey;
    }
    return fullEffect as Effect;
  }

  return null;
}

/**
 * Builds the full CSS selector for an element.
 */
function buildSelector(
  key: string,
  effect: Effect,
  addItemFilter = false,
): string {
  const keySelector = `[data-interact-key="${key}"]`;
  const childSelector = getSelector(effect, { addItemFilter });
  return `${keySelector} ${childSelector}`;
}

/**
 * Creates empty animation props object.
 */
function createEmptyAnimationProps(): AnimationProps {
  return {
    names: [],
    durations: [],
    delays: [],
    timingFunctions: [],
    iterationCounts: [],
    directions: [],
    fillModes: [],
  };
}

/**
 * Adds animation data properties to the animation props object.
 */
function addAnimationProps(
  props: AnimationProps,
  animationResult: CSSAnimationResult,
  effect: Effect,
): void {
  const timeEffect = effect as TimeEffect;

  props.names.push(animationResult.name);
  props.durations.push(`${timeEffect.duration ?? 0}ms`);
  props.delays.push(`${timeEffect.delay ?? 0}ms`);

  props.timingFunctions.push(getEasing(timeEffect.easing));

  props.iterationCounts.push(
    timeEffect.iterations === 0 ? 'infinite' : String(timeEffect.iterations ?? 1),
  );

  props.directions.push(getDirection(timeEffect.alternate, timeEffect.reversed));

  props.fillModes.push(timeEffect.fill ?? 'none');
}

/**
 * Builds a CSS animation rule from animation props.
 */
function buildAnimationRule(selector: string, props: AnimationProps): string {
  const declarations: string[] = [];

  declarations.push(`animation-name: ${props.names.join(', ')};`);
  declarations.push(`animation-duration: ${props.durations.join(', ')};`);
  declarations.push(`animation-delay: ${props.delays.join(', ')};`);
  declarations.push(
    `animation-timing-function: ${props.timingFunctions.join(', ')};`,
  );
  declarations.push(
    `animation-iteration-count: ${props.iterationCounts.join(', ')};`,
  );
  declarations.push(`animation-direction: ${props.directions.join(', ')};`);
  declarations.push(`animation-fill-mode: ${props.fillModes.join(', ')};`);

  return `${selector} { ${declarations.join(' ')} }`;
}

/**
 * Wraps a CSS rule in a media query.
 */
function wrapInMediaQuery(rule: string, predicate: string): string {
  return `@media (${predicate}) { ${rule} }`;
}

/**
 * Gets the media predicate for conditions.
 */
function getMediaPredicate(
  conditionIds: string[] | undefined,
  conditions: Record<string, Condition> | undefined,
): string | null {
  if (!conditionIds || conditionIds.length === 0 || !conditions) {
    return null;
  }

  // Find the first media condition
  for (const id of conditionIds) {
    const condition = conditions[id];
    if (condition && condition.type === 'media' && condition.predicate) {
      return condition.predicate;
    }
  }

  return null;
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
  const keyframeMap = new Map<string, string>(); // name -> CSS @keyframes rule
  const selectorPropsMap = new Map<
    string,
    { props: AnimationProps; conditions: string | null }
  >();

  for (const interaction of config.interactions) {
    // Skip non-time-based triggers
    if (!isTimeTrigger(interaction.trigger)) {
      continue;
    }

    for (const effectRef of interaction.effects) {
      // Resolve the effect
      const effect = resolveEffect(effectRef, config.effects, interaction.key);
      if (!effect) continue;

      // Get animation data using motion's getCSSAnimation
      const animationDataList = getAnimationData(effect);
      if (animationDataList.length === 0) continue;

      // Build selector - use effect's key or fall back to interaction key
      const targetKey = effect.key || interaction.key;
      const hasListItemSelector = Boolean(effect.listItemSelector);
      const selector = buildSelector(targetKey, effect, hasListItemSelector);

      // Get media predicate for conditions
      const mediaPredicate = getMediaPredicate(
        effectRef.conditions,
        config.conditions,
      );

      // Create a unique key for the selector + conditions combination
      const selectorKey = mediaPredicate
        ? `${selector}::${mediaPredicate}`
        : selector;

      // Get or create props for this selector
      if (!selectorPropsMap.has(selectorKey)) {
        selectorPropsMap.set(selectorKey, {
          props: createEmptyAnimationProps(),
          conditions: mediaPredicate,
        });
      }
      const { props } = selectorPropsMap.get(selectorKey)!;

      // Process each animation data
      for (const data of animationDataList) {
        // Add keyframe (deduplicated)
        if (data.name && !keyframeMap.has(data.name)) {
          const keyframeCSS = keyframesToCSS(data.name, data.keyframes);
          if (keyframeCSS) {
            keyframeMap.set(data.name, keyframeCSS);
          }
        }

        // Add animation properties
        addAnimationProps(props, data, effect);
      }
    }
  }

  // Build animation rules
  const animationRules: string[] = [];
  for (const [selectorKey, { props, conditions }] of selectorPropsMap) {
    if (props.names.length === 0) continue;

    // Extract the actual selector (remove conditions suffix if present)
    const selector = conditions
      ? selectorKey.substring(0, selectorKey.lastIndexOf('::'))
      : selectorKey;

    let rule = buildAnimationRule(selector, props);

    // Wrap in media query if conditions exist
    if (conditions) {
      rule = wrapInMediaQuery(rule, conditions);
    }

    animationRules.push(rule);
  }

  return {
    keyframes: Array.from(keyframeMap.values()),
    animationRules,
  };
}
