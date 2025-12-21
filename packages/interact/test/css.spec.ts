import { describe, it, expect } from 'vitest';
import type { InteractConfig, TimeEffect, Effect } from '../src/types';
import type { NamedEffect } from '@wix/motion';
import { getCSS } from '../src/core/css';
import { getSelector } from '../src/core/Interact';

/**
 * getCSS Test Suite
 *
 * Tests CSS generation for time-based animations only.
 * CSS should be generated for triggers: viewEnter, animationEnd, hover, click, pageVisible
 * CSS should NOT be generated for scrub triggers: viewProgress, pointerMove
 */
describe('getCSS', () => {
  // ============================================================================
  // Helpers
  // ============================================================================

  /** Get keyframe names - mocked to return predictable values */
  const getFadeInNames = (_: number): string[] => ['motion-fadeIn'];
  const getArcInNames = (_: number): string[] => [
    'motion-fadeIn',
    'motion-arcIn',
  ];

  /** Extract duration from an effect in a config */
  const getEffectDuration = (config: InteractConfig, effectId: string) =>
    (config.effects[effectId] as { duration: number }).duration;

  /**
   * Creates a regex pattern for a keyframe block that allows properties in any order.
   * @param percentage - The percentage value (e.g., '0', '25', '100')
   * @param properties - Array of [property, value] tuples to match
   * @returns RegExp that matches the keyframe block with properties in any order
   */
  const createKeyframeBlockPattern = (
    percentage: string,
    properties: [string, string][],
  ): RegExp => {
    // Each property must appear exactly once, but order doesn't matter
    // Use lookahead assertions for unordered matching
    const propertyLookaheads = properties
      .map(([prop, val]) => {
        const escapedVal = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return `(?=.*${prop}:\\s*${escapedVal})`;
      })
      .join('');

    return new RegExp(`${percentage}%\\s*\\{${propertyLookaheads}[^}]+\\}`);
  };

  /**
   * Builds the full CSS selector for an element with a given key and optional child selector.
   * @param key - The data-interact-key value
   * @param effect - Optional effect object to derive child selector from
   * @returns Full CSS selector string
   */
  const buildFullSelector = (key: string, effect?: Effect): string => {
    const keySelector = `[data-interact-key="${key}"]`;
    const childSelector = effect ? getSelector(effect) : getSelector({});
    return `${keySelector} ${childSelector}`;
  };

  /**
   * Escapes special regex characters in a string.
   */
  const escapeRegex = (str: string): string =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /**
   * Creates a regex pattern that matches a CSS rule with selector and specific property.
   * @param selector - The CSS selector
   * @param property - The animation property name
   * @param value - The expected value
   * @returns RegExp that matches the full rule
   */
  const createAnimationRulePattern = (
    selector: string,
    property: string,
    value: string,
  ): RegExp => {
    const escapedSelector = escapeRegex(selector);
    const escapedValue = escapeRegex(value);
    return new RegExp(
      `${escapedSelector}\\s*\\{[^}]*${property}:\\s*${escapedValue}[^}]*\\}`,
    );
  };

  /**
   * Gets all effect names/values for multipleEffectsConfig.
   * Must be called after multipleEffectsConfig is defined.
   */
  const getMultiEffectValues = () => {
    const dur1 = getEffectDuration(multipleEffectsConfig, 'first-effect');
    const dur2 = getEffectDuration(multipleEffectsConfig, 'second-effect');
    const dur3 = getEffectDuration(multipleEffectsConfig, 'third-effect');

    const [name1] = getFadeInNames(dur1);
    const name2 = (
      multipleEffectsConfig.effects['second-effect'] as {
        keyframeEffect: { name: string };
      }
    ).keyframeEffect.name;
    const [name3] = getFadeInNames(dur3);

    const delay1 = (
      multipleEffectsConfig.effects['first-effect'] as { delay: number }
    ).delay;
    const delay2 = (
      multipleEffectsConfig.effects['second-effect'] as { delay: number }
    ).delay;
    const delay3 = (
      multipleEffectsConfig.effects['third-effect'] as { delay: number }
    ).delay;

    const fill1 = (
      multipleEffectsConfig.effects['first-effect'] as { fill: string }
    ).fill;
    const fill2 = (
      multipleEffectsConfig.effects['second-effect'] as { fill: string }
    ).fill;
    const fill3 = (
      multipleEffectsConfig.effects['third-effect'] as { fill: string }
    ).fill;

    return {
      names: [name1, name2, name3],
      durations: [dur1, dur2, dur3],
      delays: [delay1, delay2, delay3],
      fills: [fill1, fill2, fill3],
    };
  };

  // ============================================================================
  // Test Configurations
  // ============================================================================

  /** Config with FadeIn namedEffect */
  const fadeInConfig: InteractConfig = {
    effects: {
      'fade-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'fade-element',
        effects: [{ key: 'fade-element', effectId: 'fade-effect' }],
      },
    ],
  };

  /** Config with custom keyframeEffect */
  const keyframeEffectConfig: InteractConfig = {
    effects: {
      'custom-slide': {
        keyframeEffect: {
          name: 'custom-slide-animation',
          keyframes: [
            { offset: 0, transform: 'translateX(-100px)', opacity: '0' },
            { offset: 1, transform: 'translateX(0)', opacity: '1' },
          ],
        },
        duration: 800,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'slide-element',
        effects: [{ key: 'slide-element', effectId: 'custom-slide' }],
      },
    ],
  };

  /** Config with customEffect - should NOT generate CSS */
  const customEffectConfig: InteractConfig = {
    effects: {
      'js-effect': {
        customEffect: (_element: Element, _progress: number) => {
          // JavaScript-only animation
        },
        duration: 1000,
      } as Effect,
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'js-element',
        effects: [{ key: 'js-element', effectId: 'js-effect' }],
      },
    ],
  };

  /** Config with all TimeEffect options */
  const fullOptionsConfig: InteractConfig = {
    effects: {
      'full-options': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 1000,
        delay: 200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        iterations: 3,
        alternate: true,
        fill: 'both',
        reversed: false,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'full-options-element',
        effects: [{ key: 'full-options-element', effectId: 'full-options' }],
      },
    ],
  };

  /** Config with reversed direction */
  const reversedConfig: InteractConfig = {
    effects: {
      'reversed-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
        reversed: true,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'reversed-element',
        effects: [{ key: 'reversed-element', effectId: 'reversed-effect' }],
      },
    ],
  };

  /** Config with alternate-reverse direction */
  const alternateReversedConfig: InteractConfig = {
    effects: {
      'alt-rev-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
        alternate: true,
        reversed: true,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'alt-rev-element',
        effects: [{ key: 'alt-rev-element', effectId: 'alt-rev-effect' }],
      },
    ],
  };

  /** Config with infinite iterations */
  const infiniteIterationsConfig: InteractConfig = {
    effects: {
      'infinite-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
        iterations: 0, // 0 means infinite
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'infinite-element',
        effects: [{ key: 'infinite-element', effectId: 'infinite-effect' }],
      },
    ],
  };

  /** Config with scrub trigger (viewProgress) - should NOT generate CSS */
  const scrubTriggerConfig: InteractConfig = {
    effects: {
      'scroll-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        rangeStart: {
          name: 'contain',
          offset: { value: 0, type: 'percentage' },
        },
        rangeEnd: {
          name: 'contain',
          offset: { value: 100, type: 'percentage' },
        },
      } as Effect,
    },
    interactions: [
      {
        trigger: 'viewProgress',
        key: 'scroll-element',
        effects: [{ key: 'scroll-element', effectId: 'scroll-effect' }],
      },
    ],
  };

  /** Config with pointerMove trigger - should NOT generate CSS */
  const pointerMoveTriggerConfig: InteractConfig = {
    effects: {
      'pointer-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        rangeStart: {
          name: 'contain',
          offset: { value: 0, type: 'percentage' },
        },
        rangeEnd: {
          name: 'contain',
          offset: { value: 100, type: 'percentage' },
        },
      } as Effect,
    },
    interactions: [
      {
        trigger: 'pointerMove',
        key: 'pointer-element',
        effects: [{ key: 'pointer-element', effectId: 'pointer-effect' }],
      },
    ],
  };

  /** Config with hover trigger - time-based, should generate CSS */
  const hoverTriggerConfig: InteractConfig = {
    effects: {
      'hover-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 300,
      },
    },
    interactions: [
      {
        trigger: 'hover',
        key: 'hover-element',
        effects: [{ key: 'hover-element', effectId: 'hover-effect' }],
      },
    ],
  };

  /** Config with click trigger - time-based, should generate CSS */
  const clickTriggerConfig: InteractConfig = {
    effects: {
      'click-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 400,
      },
    },
    interactions: [
      {
        trigger: 'click',
        key: 'click-element',
        effects: [{ key: 'click-element', effectId: 'click-effect' }],
      },
    ],
  };

  /** Config with animationEnd trigger - time-based, should generate CSS */
  const animationEndTriggerConfig: InteractConfig = {
    effects: {
      'chain-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 600,
      },
    },
    interactions: [
      {
        trigger: 'animationEnd',
        key: 'chain-element',
        params: { effectId: 'some-previous-effect' },
        effects: [{ key: 'chain-element', effectId: 'chain-effect' }],
      },
    ],
  };

  /** Config with custom selector */
  const customSelectorConfig: InteractConfig = {
    effects: {
      'selector-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'parent-element',
        effects: [
          {
            key: 'parent-element',
            selector: '.child-target',
            effectId: 'selector-effect',
          },
        ],
      },
    ],
  };

  /** Config with listContainer */
  const listContainerConfig: InteractConfig = {
    effects: {
      'list-item-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 300,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'list-wrapper',
        listContainer: '.items-container',
        listItemSelector: '.item',
        effects: [
          {
            listContainer: '.items-container',
            listItemSelector: '.item',
            effectId: 'list-item-effect',
          },
        ],
      },
    ],
  };

  /** Config with media condition */
  const conditionalConfig: InteractConfig = {
    conditions: {
      desktop: { type: 'media', predicate: 'min-width: 1024px' },
    },
    effects: {
      'conditional-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'conditional-element',
        effects: [
          {
            key: 'conditional-element',
            effectId: 'conditional-effect',
            conditions: ['desktop'],
          },
        ],
      },
    ],
  };

  /** Empty config */
  const emptyConfig: InteractConfig = {
    effects: {},
    interactions: [],
  };

  /** Config with same effect used twice (deduplication test) */
  const duplicateEffectConfig: InteractConfig = {
    effects: {
      'shared-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'element-a',
        effects: [{ key: 'element-a', effectId: 'shared-effect' }],
      },
      {
        trigger: 'viewEnter',
        key: 'element-b',
        effects: [{ key: 'element-b', effectId: 'shared-effect' }],
      },
    ],
  };

  /** Config with inline effect definition (no effectId reference) */
  const inlineEffectConfig: InteractConfig = {
    effects: {},
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'inline-element',
        effects: [
          {
            key: 'inline-element',
            namedEffect: { type: 'FadeIn' } as NamedEffect,
            duration: 400,
          } as Effect,
        ],
      },
    ],
  };

  /** Config with fill modes */
  const fillNoneConfig: InteractConfig = {
    effects: {
      'fill-none': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
        fill: 'none',
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'fill-none-element',
        effects: [{ key: 'fill-none-element', effectId: 'fill-none' }],
      },
    ],
  };

  const fillForwardsConfig: InteractConfig = {
    effects: {
      'fill-forwards': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
        fill: 'forwards',
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'fill-forwards-element',
        effects: [{ key: 'fill-forwards-element', effectId: 'fill-forwards' }],
      },
    ],
  };

  /** Config with ArcIn (multi-keyframe effect) */
  const arcInConfig: InteractConfig = {
    effects: {
      'arc-effect': {
        namedEffect: {
          type: 'ArcIn',
          direction: 'right',
          power: 'medium',
        } as NamedEffect,
        duration: 1000,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'arc-element',
        effects: [{ key: 'arc-element', effectId: 'arc-effect' }],
      },
    ],
  };

  /** Config with fractional offset keyframes */
  const fractionalKeyframesConfig: InteractConfig = {
    effects: {
      'multi-step': {
        keyframeEffect: {
          name: 'multi-step-animation',
          keyframes: [
            { offset: 0, opacity: '0' },
            { offset: 0.25, opacity: '0.5' },
            { offset: 0.75, opacity: '0.8' },
            { offset: 1, opacity: '1' },
          ],
        },
        duration: 1000,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'multi-step-element',
        effects: [{ key: 'multi-step-element', effectId: 'multi-step' }],
      },
    ],
  };

  /** Config with keyframes without explicit offsets (interpolated) */
  const interpolatedKeyframesConfig: InteractConfig = {
    effects: {
      'interpolated-effect': {
        keyframeEffect: {
          name: 'interpolated-animation',
          keyframes: [
            { opacity: '0', transform: 'scale(0.5)' },
            { opacity: '0.3', transform: 'scale(0.7)' },
            { opacity: '0.7', transform: 'scale(0.9)' },
            { opacity: '1', transform: 'scale(1)' },
          ],
        },
        duration: 1000,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'interpolated-element',
        effects: [
          {
            key: 'interpolated-element',
            effectId: 'interpolated-effect',
          },
        ],
      },
    ],
  };

  /** Config with mixed explicit and implicit offsets */
  const mixedOffsetsConfig: InteractConfig = {
    effects: {
      'mixed-effect': {
        keyframeEffect: {
          name: 'mixed-offset-animation',
          keyframes: [
            { offset: 0, opacity: '0' },
            { opacity: '0.5' }, // Should be interpolated to 50%
            { offset: 1, opacity: '1' },
          ],
        },
        duration: 500,
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'mixed-element',
        effects: [{ key: 'mixed-element', effectId: 'mixed-effect' }],
      },
    ],
  };

  /** Config with multiple effects on same target */
  const multipleEffectsConfig: InteractConfig = {
    effects: {
      'first-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
        delay: 0,
        fill: 'forwards',
      },
      'second-effect': {
        keyframeEffect: {
          name: 'scale-up',
          keyframes: [
            { offset: 0, transform: 'scale(0.8)' },
            { offset: 1, transform: 'scale(1)' },
          ],
        },
        duration: 800,
        delay: 100,
        fill: 'both',
      },
      'third-effect': {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 300,
        delay: 200,
        iterations: 2,
        fill: 'none',
      },
    },
    interactions: [
      {
        trigger: 'viewEnter',
        key: 'multi-effect-element',
        effects: [
          { key: 'multi-effect-element', effectId: 'first-effect' },
          { key: 'multi-effect-element', effectId: 'second-effect' },
          { key: 'multi-effect-element', effectId: 'third-effect' },
        ],
      },
    ],
  };

  // ============================================================================
  // SUITE 1: Keyframes Rules
  // ============================================================================
  describe('keyframes rules', () => {
    describe('namedEffect keyframes', () => {
      it('should generate valid @keyframes rule for FadeIn effect', () => {
        const result = getCSS(fadeInConfig);
        const duration = getEffectDuration(fadeInConfig, 'fade-effect');
        const [fadeInName] = getFadeInNames(duration);

        expect(result.keyframes).toHaveLength(1);

        // FadeIn generates keyframe with opacity animation
        // Pattern: @keyframes {name} { 0% { opacity: 0 } 100% { opacity: ... } }
        const keyframeRule = result.keyframes[0];
        const keyframePattern = new RegExp(
          `^@keyframes\\s+${fadeInName}\\s*\\{\\s*0%\\s*\\{\\s*opacity:\\s*0;?\\s*\\}\\s*100%\\s*\\{\\s*opacity:\\s*[^}]+\\}\\s*\\}$`,
        );

        expect(keyframeRule).toMatch(keyframePattern);
      });

      it('should generate multiple @keyframes rules for multi-keyframe effects', () => {
        const result = getCSS(arcInConfig);
        const duration = getEffectDuration(arcInConfig, 'arc-effect');
        const [fadeInName, arcInName] = getArcInNames(duration);

        // ArcIn generates 2 keyframes
        expect(result.keyframes).toHaveLength(2);

        // Should have fadeIn keyframe
        const hasFadeIn = result.keyframes.some((kf) =>
          new RegExp(`^@keyframes\\s+${fadeInName}\\s*\\{`).test(kf),
        );
        expect(hasFadeIn).toBe(true);

        // Should have arcIn keyframe with transform/perspective
        const hasArcIn = result.keyframes.some(
          (kf) =>
            new RegExp(`^@keyframes\\s+${arcInName}\\s*\\{`).test(kf) &&
            kf.includes('transform') &&
            kf.includes('perspective'),
        );
        expect(hasArcIn).toBe(true);
      });
    });

    describe('keyframeEffect keyframes', () => {
      it('should generate @keyframes with custom name and keyframe values (properties may be scrambled)', () => {
        const result = getCSS(keyframeEffectConfig);

        const { name, keyframes } = (
          keyframeEffectConfig.effects['custom-slide'] as {
            keyframeEffect: { name: string; keyframes: Keyframe[] };
          }
        ).keyframeEffect;

        expect(result.keyframes).toHaveLength(1);
        const keyframeRule = result.keyframes[0];

        // Verify complete @keyframes structure: @keyframes name { ... }
        const fullStructurePattern = new RegExp(
          `^@keyframes\\s+${name}\\s*\\{[\\s\\S]*\\}$`,
        );
        expect(keyframeRule).toMatch(fullStructurePattern);

        // Verify first keyframe (0%) with properties in any order
        const firstKeyframe = keyframes[0];
        const firstPercentage = String((firstKeyframe.offset ?? 0) * 100);
        const firstProps: [string, string][] = [
          ['transform', 'translateX(-100px)'],
          ['opacity', '0'],
        ];
        expect(keyframeRule).toMatch(
          createKeyframeBlockPattern(firstPercentage, firstProps),
        );

        // Verify last keyframe (100%) with properties in any order
        const lastKeyframe = keyframes[keyframes.length - 1];
        const lastPercentage = String((lastKeyframe.offset ?? 1) * 100);
        const lastProps: [string, string][] = [
          ['transform', 'translateX(0)'],
          ['opacity', '1'],
        ];
        expect(keyframeRule).toMatch(
          createKeyframeBlockPattern(lastPercentage, lastProps),
        );
      });

      it('should generate @keyframes with fractional offset values', () => {
        const result = getCSS(fractionalKeyframesConfig);

        const { name } = (
          fractionalKeyframesConfig.effects['multi-step'] as {
            keyframeEffect: { name: string };
          }
        ).keyframeEffect;

        expect(result.keyframes).toHaveLength(1);
        const keyframeRule = result.keyframes[0];

        // Verify complete structure with all percentage stops
        const fullStructurePattern = new RegExp(
          `^@keyframes\\s+${name}\\s*\\{` +
            `\\s*0%\\s*\\{\\s*opacity:\\s*0;?\\s*\\}` +
            `\\s*25%\\s*\\{\\s*opacity:\\s*0\\.5;?\\s*\\}` +
            `\\s*75%\\s*\\{\\s*opacity:\\s*0\\.8;?\\s*\\}` +
            `\\s*100%\\s*\\{\\s*opacity:\\s*1;?\\s*\\}` +
            `\\s*\\}$`,
        );
        expect(keyframeRule).toMatch(fullStructurePattern);
      });

      it('should interpolate percentages when offset is not provided', () => {
        // When offsets are not provided, they should be evenly distributed
        // 4 keyframes without offset → 0%, 33.33%, 66.67%, 100%
        const result = getCSS(interpolatedKeyframesConfig);

        const { name } = (
          interpolatedKeyframesConfig.effects['interpolated-effect'] as {
            keyframeEffect: { name: string };
          }
        ).keyframeEffect;

        expect(result.keyframes).toHaveLength(1);
        const keyframeRule = result.keyframes[0];

        // Verify @keyframes name
        expect(keyframeRule).toMatch(
          new RegExp(`^@keyframes\\s+${name}\\s*\\{`),
        );

        // First keyframe should be 0%
        expect(keyframeRule).toMatch(
          createKeyframeBlockPattern('0', [
            ['opacity', '0'],
            ['transform', 'scale(0.5)'],
          ]),
        );

        // Middle keyframes should be interpolated (33% or 33.33%, 66% or 66.67%)
        // Allow for rounding variations
        expect(keyframeRule).toMatch(
          createKeyframeBlockPattern('33(?:\\.33)?', [
            ['opacity', '0.3'],
            ['transform', 'scale(0.7)'],
          ]),
        );

        expect(keyframeRule).toMatch(
          createKeyframeBlockPattern('66(?:\\.67)?', [
            ['opacity', '0.7'],
            ['transform', 'scale(0.9)'],
          ]),
        );

        // Last keyframe should be 100%
        expect(keyframeRule).toMatch(
          createKeyframeBlockPattern('100', [
            ['opacity', '1'],
            ['transform', 'scale(1)'],
          ]),
        );
      });

      it('should handle mixed explicit and implicit offsets', () => {
        // First and last have explicit offsets, middle ones are interpolated
        const result = getCSS(mixedOffsetsConfig);

        const { name } = (
          mixedOffsetsConfig.effects['mixed-effect'] as {
            keyframeEffect: { name: string };
          }
        ).keyframeEffect;

        expect(result.keyframes).toHaveLength(1);
        const keyframeRule = result.keyframes[0];

        // Verify complete structure with interpolated middle keyframe
        const fullStructurePattern = new RegExp(
          `^@keyframes\\s+${name}\\s*\\{` +
            `\\s*0%\\s*\\{\\s*opacity:\\s*0;?\\s*\\}` +
            `\\s*50%\\s*\\{\\s*opacity:\\s*0\\.5;?\\s*\\}` +
            `\\s*100%\\s*\\{\\s*opacity:\\s*1;?\\s*\\}` +
            `\\s*\\}$`,
        );
        expect(keyframeRule).toMatch(fullStructurePattern);
      });
    });

    describe('customEffect keyframes', () => {
      it('should NOT generate keyframes for customEffect', () => {
        const result = getCSS(customEffectConfig);

        expect(result.keyframes).toHaveLength(0);
      });
    });

    describe('keyframes deduplication', () => {
      it('should not duplicate keyframes when same effect is used multiple times', () => {
        const result = getCSS(duplicateEffectConfig);
        const duration = getEffectDuration(
          duplicateEffectConfig,
          'shared-effect',
        );
        const [fadeInName] = getFadeInNames(duration);

        // fadeIn keyframe should appear exactly once
        const fadeInKeyframes = result.keyframes.filter((kf) =>
          kf.includes(fadeInName),
        );
        expect(fadeInKeyframes).toHaveLength(1);
      });
    });

    describe('trigger filtering', () => {
      it('should NOT generate keyframes for viewProgress trigger', () => {
        const result = getCSS(scrubTriggerConfig);
        expect(result.keyframes).toHaveLength(0);
      });

      it('should NOT generate keyframes for pointerMove trigger', () => {
        const result = getCSS(pointerMoveTriggerConfig);
        expect(result.keyframes).toHaveLength(0);
      });

      it('should generate keyframes for hover trigger', () => {
        const result = getCSS(hoverTriggerConfig);
        const duration = getEffectDuration(hoverTriggerConfig, 'hover-effect');
        const [fadeInName] = getFadeInNames(duration);
        expect(result.keyframes.length).toBeGreaterThan(0);
        expect(result.keyframes[0]).toMatch(
          new RegExp(`^@keyframes\\s+${fadeInName}`),
        );
      });

      it('should generate keyframes for click trigger', () => {
        const result = getCSS(clickTriggerConfig);
        const duration = getEffectDuration(clickTriggerConfig, 'click-effect');
        const [fadeInName] = getFadeInNames(duration);
        expect(result.keyframes.length).toBeGreaterThan(0);
        expect(result.keyframes[0]).toMatch(
          new RegExp(`^@keyframes\\s+${fadeInName}`),
        );
      });

      it('should generate keyframes for animationEnd trigger', () => {
        const result = getCSS(animationEndTriggerConfig);
        const duration = getEffectDuration(
          animationEndTriggerConfig,
          'chain-effect',
        );
        const [fadeInName] = getFadeInNames(duration);
        expect(result.keyframes.length).toBeGreaterThan(0);
        expect(result.keyframes[0]).toMatch(
          new RegExp(`^@keyframes\\s+${fadeInName}`),
        );
      });
    });

    describe('edge cases', () => {
      it('should return empty keyframes array for empty config', () => {
        const result = getCSS(emptyConfig);
        expect(result.keyframes).toEqual([]);
      });

      it('should generate keyframes for inline effect definitions', () => {
        const result = getCSS(inlineEffectConfig);
        // Inline effect has duration in the interaction effect, not in config.effects
        const inlineEffect = inlineEffectConfig.interactions[0].effects[0] as {
          duration: number;
        };
        const [fadeInName] = getFadeInNames(inlineEffect.duration);
        expect(result.keyframes.length).toBeGreaterThan(0);
        expect(result.keyframes[0]).toMatch(
          new RegExp(`^@keyframes\\s+${fadeInName}`),
        );
      });

      it('should skip effects without namedEffect or keyframeEffect', () => {
        const invalidConfig: InteractConfig = {
          effects: {
            'invalid-effect': { duration: 500 } as TimeEffect,
          },
          interactions: [
            {
              trigger: 'viewEnter',
              key: 'invalid-element',
              effects: [{ key: 'invalid-element', effectId: 'invalid-effect' }],
            },
          ],
        };

        const result = getCSS(invalidConfig);
        expect(result.keyframes).toEqual([]);
      });
    });
  });

  // ============================================================================
  // SUITE 2: Animation Rules
  // ============================================================================
  // TODO: (ameerf) - fix this to use animation short-hand and unskip
  describe.skip('animation rules', () => {
    describe('animation-name', () => {
      it('should include animation-name with selector for namedEffect', () => {
        const result = getCSS(fadeInConfig);
        const duration = getEffectDuration(fadeInConfig, 'fade-effect');
        const [fadeInName] = getFadeInNames(duration);
        const selector = buildFullSelector('fade-element');

        expect(result.animationRules.length).toBeGreaterThan(0);

        const pattern = createAnimationRulePattern(
          selector,
          'animation-name',
          fadeInName,
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should include animation-name with selector for keyframeEffect', () => {
        const result = getCSS(keyframeEffectConfig);
        const { name } = (
          keyframeEffectConfig.effects['custom-slide'] as {
            keyframeEffect: { name: string };
          }
        ).keyframeEffect;
        const selector = buildFullSelector('slide-element');

        expect(result.animationRules.length).toBeGreaterThan(0);

        const pattern = createAnimationRulePattern(
          selector,
          'animation-name',
          name,
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });
    });

    describe('animation-duration', () => {
      it('should include animation-duration in milliseconds with selector', () => {
        const result = getCSS(fadeInConfig);
        const duration = getEffectDuration(fadeInConfig, 'fade-effect');
        const selector = buildFullSelector('fade-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-duration',
          `${duration}ms`,
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should use correct duration value from effect config', () => {
        const result = getCSS(keyframeEffectConfig);
        const duration = getEffectDuration(
          keyframeEffectConfig,
          'custom-slide',
        );
        const selector = buildFullSelector('slide-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-duration',
          `${duration}ms`,
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });
    });

    describe('animation-delay', () => {
      it('should include animation-delay when delay is specified', () => {
        const result = getCSS(fullOptionsConfig);
        const delay = (
          fullOptionsConfig.effects['full-options'] as { delay: number }
        ).delay;
        const selector = buildFullSelector('full-options-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-delay',
          `${delay}ms`,
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should omit animation-delay when not specified', () => {
        const result = getCSS(fadeInConfig);

        // fadeInConfig has no delay - either no animation-delay or 0ms
        const hasNonZeroDelay = result.animationRules.some((rule) =>
          /animation-delay:\s*[1-9]\d*ms/.test(rule),
        );
        expect(hasNonZeroDelay).toBe(false);
      });
    });

    describe('animation-timing-function', () => {
      it('should include custom easing as animation-timing-function', () => {
        const result = getCSS(fullOptionsConfig);
        const easing = (
          fullOptionsConfig.effects['full-options'] as { easing: string }
        ).easing;
        const selector = buildFullSelector('full-options-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-timing-function',
          easing,
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should include animation-timing-function when not specified', () => {
        const result = getCSS(fadeInConfig);
        const selector = buildFullSelector('fade-element');

        // Should have animation-timing-function property
        const hasTimingFunction = result.animationRules.some(
          (rule) =>
            rule.includes(selector) &&
            rule.includes('animation-timing-function:'),
        );
        expect(hasTimingFunction).toBe(true);
      });
    });

    describe('animation-iteration-count', () => {
      it('should include animation-iteration-count when iterations specified', () => {
        const result = getCSS(fullOptionsConfig);
        const iterations = (
          fullOptionsConfig.effects['full-options'] as { iterations: number }
        ).iterations;
        const selector = buildFullSelector('full-options-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-iteration-count',
          String(iterations),
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should use "infinite" for iterations: 0', () => {
        const result = getCSS(infiniteIterationsConfig);
        const selector = buildFullSelector('infinite-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-iteration-count',
          'infinite',
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });
    });

    describe('animation-direction', () => {
      it('should include animation-direction: alternate when alternate: true', () => {
        const result = getCSS(fullOptionsConfig);
        const selector = buildFullSelector('full-options-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-direction',
          'alternate',
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should include animation-direction: reverse when reversed: true', () => {
        const result = getCSS(reversedConfig);
        const selector = buildFullSelector('reversed-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-direction',
          'reverse',
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should include animation-direction: alternate-reverse when both', () => {
        const result = getCSS(alternateReversedConfig);
        const selector = buildFullSelector('alt-rev-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-direction',
          'alternate-reverse',
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should use normal direction when neither alternate nor reversed', () => {
        const result = getCSS(fadeInConfig);

        // Should not have reverse or alternate in direction
        const hasReverseOrAlternate = result.animationRules.some(
          (rule) =>
            /animation-direction:\s*reverse/.test(rule) ||
            /animation-direction:\s*alternate/.test(rule),
        );
        expect(hasReverseOrAlternate).toBe(false);
      });
    });

    describe('animation-fill-mode', () => {
      it('should include animation-fill-mode: both when fill: "both"', () => {
        const result = getCSS(fullOptionsConfig);
        const selector = buildFullSelector('full-options-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-fill-mode',
          'both',
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should include animation-fill-mode: forwards when fill: "forwards"', () => {
        const result = getCSS(fillForwardsConfig);
        const selector = buildFullSelector('fill-forwards-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-fill-mode',
          'forwards',
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should not include forwards/backwards/both when fill: "none"', () => {
        const result = getCSS(fillNoneConfig);

        // Should NOT have forwards, backwards, or both
        const hasOtherFill = result.animationRules.some(
          (rule) =>
            /animation-fill-mode:\s*forwards/.test(rule) ||
            /animation-fill-mode:\s*backwards/.test(rule) ||
            /animation-fill-mode:\s*both/.test(rule),
        );
        expect(hasOtherFill).toBe(false);
      });
    });

    describe('selectors', () => {
      it('should target element using data-interact-key and child selector', () => {
        const result = getCSS(fadeInConfig);
        const selector = buildFullSelector('fade-element');

        const hasSelector = result.animationRules.some((rule) =>
          rule.includes(selector),
        );
        expect(hasSelector).toBe(true);
      });

      it('should include custom selector when specified', () => {
        const result = getCSS(customSelectorConfig);
        const effect = customSelectorConfig.interactions[0]
          .effects[0] as Effect;
        const selector = buildFullSelector('parent-element', effect);

        const hasSelector = result.animationRules.some((rule) =>
          rule.includes(selector),
        );
        expect(hasSelector).toBe(true);
      });

      it('should include listContainer and listItemSelector in selector', () => {
        const result = getCSS(listContainerConfig);
        const effect = listContainerConfig.interactions[0].effects[0] as Effect;
        const childSelector = getSelector(effect, { addItemFilter: true });

        // Should include the list container path
        const hasListSelector = result.animationRules.some(
          (rule) =>
            rule.includes('[data-interact-key="list-wrapper"]') &&
            rule.includes(childSelector),
        );
        expect(hasListSelector).toBe(true);
      });
    });

    describe('media conditions', () => {
      it('should wrap animation rule in @media query when condition specified', () => {
        const result = getCSS(conditionalConfig);
        const predicate = conditionalConfig.conditions!.desktop.predicate || '';
        const duration = getEffectDuration(
          conditionalConfig,
          'conditional-effect',
        );
        const [fadeInName] = getFadeInNames(duration);
        const selector = buildFullSelector('conditional-element');

        // Build the animation rule pattern
        const animationRulePattern = createAnimationRulePattern(
          selector,
          'animation-name',
          fadeInName,
        );

        // Should have @media (predicate) wrapper containing the animation rule
        const mediaPattern = new RegExp(
          `@media\\s*\\(\\s*${escapeRegex(
            predicate,
          )}\\s*\\)\\s*\\{[\\s\\S]*\\}`,
        );
        const hasMediaQueryWithRule = result.animationRules.some(
          (rule) => mediaPattern.test(rule) && animationRulePattern.test(rule),
        );
        expect(hasMediaQueryWithRule).toBe(true);
      });

      it('should NOT wrap in @media when no conditions', () => {
        const result = getCSS(fadeInConfig);

        const hasMediaQuery = result.animationRules.some((rule) =>
          rule.includes('@media'),
        );
        expect(hasMediaQuery).toBe(false);
      });
    });

    describe('multiple effects on same target', () => {
      it('should generate comma-separated animation-name values in order', () => {
        const result = getCSS(multipleEffectsConfig);
        const { names } = getMultiEffectValues();
        const selector = buildFullSelector('multi-effect-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-name',
          names.join(', '),
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should generate comma-separated animation-duration values in order', () => {
        const result = getCSS(multipleEffectsConfig);
        const { durations } = getMultiEffectValues();
        const selector = buildFullSelector('multi-effect-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-duration',
          durations.map((d) => `${d}ms`).join(', '),
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should generate comma-separated animation-delay values in order', () => {
        const result = getCSS(multipleEffectsConfig);
        const { delays } = getMultiEffectValues();
        const selector = buildFullSelector('multi-effect-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-delay',
          delays.map((d) => `${d}ms`).join(', '),
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should generate comma-separated animation-fill-mode values in order', () => {
        const result = getCSS(multipleEffectsConfig);
        const { fills } = getMultiEffectValues();
        const selector = buildFullSelector('multi-effect-element');

        const pattern = createAnimationRulePattern(
          selector,
          'animation-fill-mode',
          fills.join(', '),
        );
        expect(result.animationRules.some((rule) => pattern.test(rule))).toBe(
          true,
        );
      });

      it('should maintain consistent order across all animation properties', () => {
        const result = getCSS(multipleEffectsConfig);
        const { names, durations } = getMultiEffectValues();
        const selector = buildFullSelector('multi-effect-element');

        // Verify both animation-name and animation-duration have correct order
        const namePattern = createAnimationRulePattern(
          selector,
          'animation-name',
          names.join(', '),
        );
        const durationPattern = createAnimationRulePattern(
          selector,
          'animation-duration',
          durations.map((d) => `${d}ms`).join(', '),
        );

        // Find the rule for this element
        const rule = result.animationRules.find((r) =>
          r.includes('[data-interact-key="multi-effect-element"]'),
        );
        expect(rule).toBeDefined();

        // Both patterns should match the same rule
        expect(namePattern.test(rule!)).toBe(true);
        expect(durationPattern.test(rule!)).toBe(true);
      });
    });

    describe('trigger filtering', () => {
      it('should NOT generate animation rules for viewProgress trigger', () => {
        const result = getCSS(scrubTriggerConfig);
        expect(result.animationRules).toHaveLength(0);
      });

      it('should NOT generate animation rules for pointerMove trigger', () => {
        const result = getCSS(pointerMoveTriggerConfig);
        expect(result.animationRules).toHaveLength(0);
      });

      it('should generate animation rules for all time-based triggers', () => {
        const hoverResult = getCSS(hoverTriggerConfig);
        const clickResult = getCSS(clickTriggerConfig);
        const animEndResult = getCSS(animationEndTriggerConfig);

        expect(hoverResult.animationRules.length).toBeGreaterThan(0);
        expect(clickResult.animationRules.length).toBeGreaterThan(0);
        expect(animEndResult.animationRules.length).toBeGreaterThan(0);
      });
    });

    describe('edge cases', () => {
      it('should return empty animation rules for empty config', () => {
        const result = getCSS(emptyConfig);
        expect(result.animationRules).toEqual([]);
      });

      it('should NOT generate animation rules for customEffect', () => {
        const result = getCSS(customEffectConfig);
        expect(result.animationRules).toHaveLength(0);
      });

      it('should generate animation rules for inline effect definitions', () => {
        const result = getCSS(inlineEffectConfig);
        expect(result.animationRules.length).toBeGreaterThan(0);
      });
    });
  });
});
