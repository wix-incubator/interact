import type {
  InteractConfig,
  GetCSSResult,
  TriggerType,
  Effect,
  EffectRef,
  TimeEffect,
  Condition,
} from '../types';
import { getSelector } from './Interact';
import { getEasing } from '@wix/motion';
import { entranceAnimations } from '../../../motion/src/library/entrance';
import { ongoingAnimations } from '../../../motion/src/library/ongoing';
import { scrollAnimations } from '../../../motion/src/library/scroll';
import { mouseAnimations } from '../../../motion/src/library/mouse';
import { backgroundScrollAnimations } from '../../../motion/src/library/backgroundScroll';

// ============================================================================
// Types
// ============================================================================

type KeyframeProperty = Record<string, string | number | undefined>;

interface AnimationData {
  name: string;
  keyframes: KeyframeProperty[];
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number;
  alternate?: boolean;
  reversed?: boolean;
  fill?: string;
}

interface AnimationProps {
  names: string[];
  durations: string[];
  delays: string[];
  timingFunctions: string[];
  iterationCounts: string[];
  directions: string[];
  fillModes: string[];
}

interface AnimationEffectAPI {
  style?: (options: any) => any[];
  web?: (options: any) => any[];
  getNames?: (options: any) => string[];
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
 * Checks if effect has customEffect (JS-only).
 */
function isCustomEffect(effect: Effect): boolean {
  return 'customEffect' in effect && (effect as any).customEffect !== undefined;
}

/**
 * Checks if effect has namedEffect.
 */
function hasNamedEffect(effect: any): boolean {
  return 'namedEffect' in effect && effect.namedEffect !== undefined;
}

/**
 * Checks if effect has keyframeEffect.
 */
function hasKeyframeEffect(effect: any): boolean {
  return 'keyframeEffect' in effect && effect.keyframeEffect !== undefined;
}

/**
 * Gets the named effect API from animation libraries.
 */
function getNamedEffectAPI(namedEffect: { type: string }): AnimationEffectAPI | null {
  const name = namedEffect.type;

  if (name in entranceAnimations) {
    return entranceAnimations[name as keyof typeof entranceAnimations] as unknown as AnimationEffectAPI;
  }
  if (name in ongoingAnimations) {
    return ongoingAnimations[name as keyof typeof ongoingAnimations] as unknown as AnimationEffectAPI;
  }
  if (name in scrollAnimations) {
    return scrollAnimations[name as keyof typeof scrollAnimations] as unknown as AnimationEffectAPI;
  }
  if (name in mouseAnimations) {
    return mouseAnimations[name as keyof typeof mouseAnimations] as unknown as AnimationEffectAPI;
  }
  if (name in backgroundScrollAnimations) {
    return backgroundScrollAnimations[name as keyof typeof backgroundScrollAnimations] as unknown as AnimationEffectAPI;
  }

  return null;
}

/**
 * Gets animation data from an effect using the motion library.
 * Config values take precedence over effect defaults.
 */
function getAnimationData(effect: Effect): AnimationData[] {
  const timeEffect = effect as TimeEffect;

  if (hasNamedEffect(effect)) {
    const namedEffectApi = getNamedEffectAPI((effect as any).namedEffect);

    if (namedEffectApi && namedEffectApi.style) {
      const styleResult = namedEffectApi.style(effect);
      return styleResult.map((data: any) => ({
        name: data.name,
        keyframes: data.keyframes,
        // Config values take precedence over effect defaults
        duration: timeEffect.duration ?? data.duration,
        delay: timeEffect.delay ?? data.delay,
        easing: timeEffect.easing ?? data.easing,
        iterations: timeEffect.iterations ?? data.iterations,
        alternate: timeEffect.alternate ?? data.alternate,
        reversed: timeEffect.reversed ?? data.reversed,
        fill: timeEffect.fill ?? data.fill,
      }));
    }
  } else if (hasKeyframeEffect(effect)) {
    const { name, keyframes } = (effect as any).keyframeEffect;
    return [
      {
        name,
        keyframes: keyframes as KeyframeProperty[],
        duration: timeEffect.duration,
        delay: timeEffect.delay,
        easing: timeEffect.easing,
        iterations: timeEffect.iterations,
        alternate: timeEffect.alternate,
        reversed: timeEffect.reversed,
        fill: timeEffect.fill,
      },
    ];
  }

  return [];
}

/**
 * Resolves an effect from effectId reference or inline effect.
 */
function resolveEffect(
  effectRef: Effect | EffectRef,
  effectsMap: Record<string, Effect>,
): Effect | null {
  if ('effectId' in effectRef && effectRef.effectId) {
    const baseEffect = effectsMap[effectRef.effectId];
    if (baseEffect) {
      // Merge the base effect with any overrides from the reference
      return { ...baseEffect, ...effectRef };
    }
    return null;
  }

  // Inline effect - check if it has namedEffect or keyframeEffect
  if (hasNamedEffect(effectRef) || hasKeyframeEffect(effectRef)) {
    return effectRef as Effect;
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
  data: AnimationData,
  effect: Effect,
): void {
  const timeEffect = effect as TimeEffect;

  props.names.push(data.name);
  props.durations.push(`${data.duration ?? timeEffect.duration ?? 0}ms`);
  props.delays.push(`${data.delay ?? timeEffect.delay ?? 0}ms`);

  const easing = data.easing ?? timeEffect.easing;
  props.timingFunctions.push(getEasing(easing));

  const iterations = data.iterations ?? timeEffect.iterations;
  props.iterationCounts.push(
    iterations === 0 ? 'infinite' : String(iterations ?? 1),
  );

  const alternate = data.alternate ?? timeEffect.alternate;
  const reversed = data.reversed ?? timeEffect.reversed;
  props.directions.push(getDirection(alternate, reversed));

  const fill = data.fill ?? timeEffect.fill ?? 'none';
  props.fillModes.push(fill);
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
      const effect = resolveEffect(effectRef, config.effects);
      if (!effect) continue;

      // Skip customEffect (JS-only)
      if (isCustomEffect(effect)) continue;

      // Get animation data
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
