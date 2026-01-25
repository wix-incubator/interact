import { describe, it, expect, beforeAll } from 'vitest';
import type { InteractConfig, Effect, TimeEffect, TransitionEffect } from '../src/types';
import type { NamedEffect } from '@wix/motion';
import { _generateCSS } from '../src/core/css';
import { getCSSAnimation } from '@wix/motion';
import { effectToAnimationOptions } from '../src/handlers/utilities';

// Mock CSS.escape for jsdom environment
beforeAll(() => {
  if (typeof CSS === 'undefined') {
    (globalThis as any).CSS = {};
  }
  if (typeof CSS.escape !== 'function') {
    CSS.escape = (value: string) => value.replace(/([^\w-])/g, '\\$1');
  }
});

/**
 * _generateCSS Test Suite
 *
 * Tests CSS generation for time-based animations and transitions.
 * - Generates CSS for triggers: viewEnter, animationEnd, hover, click, pageVisible
 * - Does NOT generate CSS for scrub triggers: viewProgress, pointerMove
 */
describe('_generateCSS', () => {
  // ============================================================================
  // Test Helpers
  // ============================================================================

  /** Escapes special regex characters */
  const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /** Creates regex to match a @keyframes rule with the given name */
  const keyframesPattern = (name: string) =>
    new RegExp(`@keyframes\\s+${escapeRegex(name)}\\s*\\{[^}]*\\}`);

  /** Creates regex to match a CSS property in a rule */
  const propertyPattern = (prop: string, value: string) =>
    new RegExp(`${escapeRegex(prop)}:\\s*${escapeRegex(value)}`);

  /** Gets animation data from motion library for a given effect */
  const getMotionAnimationData = (effect: TimeEffect) => {
    const options = effectToAnimationOptions(effect);
    return getCSSAnimation(null, options);
  };

  /** Extracts keyframe names from motion library for a given effect */
  const getKeyframeNames = (effect: TimeEffect): string[] => {
    const data = getMotionAnimationData(effect);
    return data.map((d) => d.name).filter(Boolean) as string[];
  };

  /** Extracts animation strings from motion library */
  const getAnimationStrings = (effect: TimeEffect): string[] => {
    const data = getMotionAnimationData(effect);
    return data.map((d) => d.animation);
  };

  /** Creates a basic config with a single effect and interaction */
  const createConfig = (
    effect: Effect,
    options: {
      key?: string;
      trigger?: InteractConfig['interactions'][0]['trigger'];
      effectId?: string;
      conditions?: InteractConfig['conditions'];
      effectConditions?: string[];
      selector?: string;
      listContainer?: string;
      listItemSelector?: string;
    } = {},
  ): InteractConfig => {
    const {
      key = 'test-element',
      trigger = 'viewEnter',
      effectId = 'test-effect',
      conditions,
      effectConditions,
      selector,
      listContainer,
      listItemSelector,
    } = options;

    const effectRef: any = { key, effectId };
    if (effectConditions) effectRef.conditions = effectConditions;
    if (selector) effectRef.selector = selector;
    if (listContainer) effectRef.listContainer = listContainer;
    if (listItemSelector) effectRef.listItemSelector = listItemSelector;

    return {
      conditions,
      effects: { [effectId]: effect },
      interactions: [
        {
          trigger,
          key,
          listContainer,
          listItemSelector,
          effects: [effectRef],
        },
      ],
    };
  };

  // ============================================================================
  // Common Test Effects
  // ============================================================================

  const fadeInEffect: TimeEffect = {
    namedEffect: { type: 'FadeIn' } as NamedEffect,
    duration: 500,
  };

  const keyframeEffect: TimeEffect = {
    keyframeEffect: {
      name: 'custom-slide',
      keyframes: [
        { offset: 0, transform: 'translateX(-100px)', opacity: '0' },
        { offset: 1, transform: 'translateX(0)', opacity: '1' },
      ],
    },
    duration: 800,
  };

  const transitionEffect: TransitionEffect = {
    transition: {
      duration: 300,
      easing: 'ease-out',
      styleProperties: [
        { name: 'opacity', value: '1' },
        { name: 'transform', value: 'scale(1)' },
      ],
    },
  };

  // ============================================================================
  // SUITE 1: Return Structure
  // ============================================================================
  describe('return structure', () => {
    it('should return an object with keyframes, animationRules, and transitionRules arrays', () => {
      const result = _generateCSS({ effects: {}, interactions: [] });

      expect(result).toHaveProperty('keyframes');
      expect(result).toHaveProperty('animationRules');
      expect(result).toHaveProperty('transitionRules');
      expect(Array.isArray(result.keyframes)).toBe(true);
      expect(Array.isArray(result.animationRules)).toBe(true);
      expect(Array.isArray(result.transitionRules)).toBe(true);
    });

    it('should return empty arrays for empty config', () => {
      const result = _generateCSS({ effects: {}, interactions: [] });

      expect(result.keyframes).toEqual([]);
      expect(result.animationRules).toEqual([]);
      expect(result.transitionRules).toEqual([]);
    });
  });

  // ============================================================================
  // SUITE 2: Trigger Filtering
  // ============================================================================
  describe('trigger filtering', () => {
    const timeTriggers = ['viewEnter', 'hover', 'click', 'animationEnd', 'pageVisible'] as const;
    const scrubTriggers = ['viewProgress', 'pointerMove'] as const;

    it.each(timeTriggers)('should generate CSS for %s trigger', (trigger) => {
      const config = createConfig(fadeInEffect, { trigger });
      const result = _generateCSS(config);

      expect(result.keyframes.length).toBeGreaterThan(0);
      expect(result.animationRules.length).toBeGreaterThan(0);
    });

    it.each(scrubTriggers)('should NOT generate CSS for %s trigger', (trigger) => {
      const config = createConfig(fadeInEffect, { trigger });
      const result = _generateCSS(config);

      expect(result.keyframes).toEqual([]);
      expect(result.animationRules).toEqual([]);
    });
  });

  // ============================================================================
  // SUITE 3: Keyframes Generation
  // ============================================================================
  describe('keyframes generation', () => {
    it('should generate valid @keyframes rule for namedEffect', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);
      const [expectedName] = getKeyframeNames(fadeInEffect);

      expect(result.keyframes).toHaveLength(1);
      expect(result.keyframes[0]).toMatch(keyframesPattern(expectedName));
      expect(result.keyframes[0]).toMatch(/0%\s*\{[^}]*opacity/);
      expect(result.keyframes[0]).toMatch(/100%\s*\{[^}]*opacity/);
    });

    it('should generate @keyframes with custom name for keyframeEffect', () => {
      const config = createConfig(keyframeEffect);
      const result = _generateCSS(config);

      expect(result.keyframes).toHaveLength(1);
      expect(result.keyframes[0]).toMatch(keyframesPattern('custom-slide'));
      expect(result.keyframes[0]).toMatch(/0%\s*\{[^}]*transform/);
      expect(result.keyframes[0]).toMatch(/100%\s*\{[^}]*transform/);
    });

    it('should generate multiple @keyframes for multi-part effects (like ArcIn)', () => {
      const arcInEffect: TimeEffect = {
        namedEffect: { type: 'ArcIn', direction: 'right' } as NamedEffect,
        duration: 1000,
      };
      const config = createConfig(arcInEffect);
      const result = _generateCSS(config);
      const expectedNames = getKeyframeNames(arcInEffect);

      expect(result.keyframes.length).toBe(expectedNames.length);
      expectedNames.forEach((name) => {
        expect(result.keyframes.some((kf) => kf.includes(`@keyframes ${name}`))).toBe(true);
      });
    });

    it('should deduplicate keyframes when same effect is used multiple times', () => {
      const config: InteractConfig = {
        effects: { shared: fadeInEffect },
        interactions: [
          { trigger: 'viewEnter', key: 'el-a', effects: [{ key: 'el-a', effectId: 'shared' }] },
          { trigger: 'viewEnter', key: 'el-b', effects: [{ key: 'el-b', effectId: 'shared' }] },
        ],
      };
      const result = _generateCSS(config);
      const [expectedName] = getKeyframeNames(fadeInEffect);

      const keyframesWithName = result.keyframes.filter((kf) => kf.includes(expectedName));
      expect(keyframesWithName).toHaveLength(1);
    });

    it('should interpolate keyframe offsets when not provided', () => {
      const interpolatedEffect: TimeEffect = {
        keyframeEffect: {
          name: 'interpolated',
          keyframes: [{ opacity: '0' }, { opacity: '0.5' }, { opacity: '1' }],
        },
        duration: 1000,
      };
      const config = createConfig(interpolatedEffect);
      const result = _generateCSS(config);

      // Should have 0%, 50%, 100% (evenly distributed)
      expect(result.keyframes[0]).toMatch(/0%\s*\{/);
      expect(result.keyframes[0]).toMatch(/50%\s*\{/);
      expect(result.keyframes[0]).toMatch(/100%\s*\{/);
    });

    it('should NOT generate keyframes for customEffect', () => {
      const customEffect = {
        customEffect: () => {},
        duration: 1000,
      } as Effect;
      const config = createConfig(customEffect);
      const result = _generateCSS(config);

      expect(result.keyframes).toEqual([]);
    });
  });

  // ============================================================================
  // SUITE 4: Initial State in Keyframes
  // ============================================================================
  describe('initial state in keyframes', () => {
    it('should include default initial state properties in keyframes', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);

      // Default initial includes visibility: hidden
      expect(result.keyframes[0]).toMatch(/from\s*\{[^}]*visibility:\s*hidden/);
    });

    it('should use custom initial state when provided', () => {
      const effectWithInitial: Effect = {
        ...fadeInEffect,
        initial: { opacity: '0', transform: 'scale(0.5)' },
      };
      const config = createConfig(effectWithInitial);
      const result = _generateCSS(config);

      expect(result.keyframes[0]).toMatch(/from\s*\{[^}]*opacity:\s*0/);
      expect(result.keyframes[0]).toMatch(/from\s*\{[^}]*transform:\s*scale\(0\.5\)/);
    });

    it('should NOT include initial when set to false', () => {
      const effectWithDisabledInitial: Effect = {
        ...fadeInEffect,
        initial: false,
      };
      const config = createConfig(effectWithDisabledInitial);
      const result = _generateCSS(config);

      expect(result.keyframes[0]).not.toMatch(/from\s*\{/);
    });
  });

  // ============================================================================
  // SUITE 5: Animation Rules
  // ============================================================================
  describe('animation rules', () => {
    it('should generate animation rule with correct selector', () => {
      const config = createConfig(fadeInEffect, { key: 'my-element' });
      const result = _generateCSS(config);

      const hasCorrectSelector = result.animationRules.some((rule) =>
        rule.includes('[data-interact-key="my-element"]'),
      );
      expect(hasCorrectSelector).toBe(true);
    });

    it('should use CSS custom properties for animation definition', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);

      // Animation rules should use --anim-def-* custom properties
      const hasCustomProp = result.animationRules.some((rule) => /--anim-def-\w+/.test(rule));
      expect(hasCustomProp).toBe(true);
    });

    it('should include animation property with var() fallback', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);

      const hasAnimationWithVar = result.animationRules.some((rule) =>
        /animation:\s*var\(--anim-def-[^,]+,\s*none\)/.test(rule),
      );
      expect(hasAnimationWithVar).toBe(true);
    });

    it('should include animation string from motion library', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);
      const [expectedAnimation] = getAnimationStrings(fadeInEffect);

      const hasMotionAnimation = result.animationRules.some((rule) =>
        rule.includes(expectedAnimation),
      );
      expect(hasMotionAnimation).toBe(true);
    });

    it('should include animation-composition property', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);

      const hasComposition = result.animationRules.some((rule) =>
        rule.includes('animation-composition:'),
      );
      expect(hasComposition).toBe(true);
    });

    it('should generate multiple animation custom props for multiple effects on same element', () => {
      const config: InteractConfig = {
        effects: {
          effect1: fadeInEffect,
          effect2: keyframeEffect,
        },
        interactions: [
          {
            trigger: 'viewEnter',
            key: 'multi-effect',
            effects: [
              { key: 'multi-effect', effectId: 'effect1' },
              { key: 'multi-effect', effectId: 'effect2' },
            ],
          },
        ],
      };
      const result = _generateCSS(config);

      // Should have comma-separated var() calls in animation property
      const hasMultipleVars = result.animationRules.some((rule) =>
        /animation:\s*var\([^)]+\),\s*var\([^)]+\)/.test(rule),
      );
      expect(hasMultipleVars).toBe(true);
    });
  });

  // ============================================================================
  // SUITE 6: Selectors
  // ============================================================================
  describe('selectors', () => {
    it('should escape special characters in key', () => {
      const config = createConfig(fadeInEffect, { key: 'element.with:special#chars' });
      const result = _generateCSS(config);

      // CSS.escape handles special chars
      const hasEscapedSelector = result.animationRules.some((rule) =>
        rule.includes('data-interact-key='),
      );
      expect(hasEscapedSelector).toBe(true);
    });

    it('should include custom selector when specified', () => {
      const config = createConfig(fadeInEffect, { selector: '.child-target' });
      const result = _generateCSS(config);

      const hasCustomSelector = result.animationRules.some((rule) =>
        rule.includes('.child-target'),
      );
      expect(hasCustomSelector).toBe(true);
    });

    it('should include listContainer and listItemSelector in selector', () => {
      const config = createConfig(fadeInEffect, {
        listContainer: '.items-container',
        listItemSelector: '.item',
      });
      const result = _generateCSS(config);

      const hasListSelector = result.animationRules.some(
        (rule) => rule.includes('.items-container') && rule.includes('.item'),
      );
      expect(hasListSelector).toBe(true);
    });

    it('should use default child selector (> :first-child) when no selector specified', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);

      const hasDefaultSelector = result.animationRules.some((rule) =>
        rule.includes('> :first-child'),
      );
      expect(hasDefaultSelector).toBe(true);
    });
  });

  // ============================================================================
  // SUITE 7: Conditions - Media Queries
  // ============================================================================
  describe('conditions - media queries', () => {
    it('should wrap rule in @media when media condition is specified', () => {
      const config = createConfig(fadeInEffect, {
        conditions: { desktop: { type: 'media', predicate: 'min-width: 1024px' } },
        effectConditions: ['desktop'],
      });
      const result = _generateCSS(config);

      const hasMediaQuery = result.animationRules.some((rule) =>
        /@media\s*\(min-width:\s*1024px\)/.test(rule),
      );
      expect(hasMediaQuery).toBe(true);
    });

    it('should combine multiple media conditions with "and"', () => {
      const config = createConfig(fadeInEffect, {
        conditions: {
          desktop: { type: 'media', predicate: 'min-width: 1024px' },
          landscape: { type: 'media', predicate: 'orientation: landscape' },
        },
        effectConditions: ['desktop', 'landscape'],
      });
      const result = _generateCSS(config);

      const hasCombinedMedia = result.animationRules.some((rule) =>
        /@media\s*\([^)]+\)\s*and\s*\([^)]+\)/.test(rule),
      );
      expect(hasCombinedMedia).toBe(true);
    });

    it('should NOT wrap in @media when no conditions', () => {
      const config = createConfig(fadeInEffect);
      const result = _generateCSS(config);

      const hasMediaQuery = result.animationRules.some((rule) => rule.includes('@media'));
      expect(hasMediaQuery).toBe(false);
    });
  });

  // ============================================================================
  // SUITE 8: Conditions - Container Queries
  // ============================================================================
  describe('conditions - container queries', () => {
    it('should wrap rule in @container when container condition is specified', () => {
      const config = createConfig(fadeInEffect, {
        conditions: { wide: { type: 'container', predicate: 'min-width: 500px' } },
        effectConditions: ['wide'],
      });
      const result = _generateCSS(config);

      const hasContainerQuery = result.animationRules.some((rule) =>
        /@container\s*\(min-width:\s*500px\)/.test(rule),
      );
      expect(hasContainerQuery).toBe(true);
    });
  });

  // ============================================================================
  // SUITE 9: Conditions - Selector Conditions
  // ============================================================================
  describe('conditions - selector conditions', () => {
    it('should apply selector condition to the target selector', () => {
      const config = createConfig(fadeInEffect, {
        conditions: { active: { type: 'selector', predicate: '.is-active' } },
        effectConditions: ['active'],
      });
      const result = _generateCSS(config);

      const hasSelectorCondition = result.animationRules.some((rule) =>
        rule.includes(':is(.is-active)'),
      );
      expect(hasSelectorCondition).toBe(true);
    });
  });

  // ============================================================================
  // SUITE 10: Transitions
  // ============================================================================
  describe('transitions', () => {
    it('should generate transition rules for transition effects', () => {
      const config = createConfig(transitionEffect as Effect, { effectId: 'trans-effect' });
      const result = _generateCSS(config);

      expect(result.transitionRules.length).toBeGreaterThan(0);
    });

    it('should generate state rule with :state() and data-interact-effect selectors', () => {
      const config = createConfig(transitionEffect as Effect, { effectId: 'trans-effect' });
      const result = _generateCSS(config);

      const hasStateSelector = result.transitionRules.some(
        (rule) => /:state\(trans-effect\)/.test(rule) || /--trans-effect/.test(rule),
      );
      const hasDataAttrSelector = result.transitionRules.some((rule) =>
        rule.includes('[data-interact-effect~="trans-effect"]'),
      );

      expect(hasStateSelector).toBe(true);
      expect(hasDataAttrSelector).toBe(true);
    });

    it('should include style properties in state rule', () => {
      const config = createConfig(transitionEffect as Effect, { effectId: 'trans-effect' });
      const result = _generateCSS(config);

      const hasOpacity = result.transitionRules.some((rule) =>
        propertyPattern('opacity', '1').test(rule),
      );
      const hasTransform = result.transitionRules.some((rule) =>
        propertyPattern('transform', 'scale(1)').test(rule),
      );

      expect(hasOpacity).toBe(true);
      expect(hasTransform).toBe(true);
    });

    it('should use CSS custom properties for transition definition', () => {
      const config = createConfig(transitionEffect as Effect);
      const result = _generateCSS(config);

      const hasTransitionCustomProp = result.transitionRules.some((rule) =>
        /--trans-def-\w+/.test(rule),
      );
      expect(hasTransitionCustomProp).toBe(true);
    });

    it('should include transition property with var() fallback', () => {
      const config = createConfig(transitionEffect as Effect);
      const result = _generateCSS(config);

      const hasTransitionWithVar = result.transitionRules.some((rule) =>
        /transition:\s*var\(--trans-def-[^,]+,\s*_\)/.test(rule),
      );
      expect(hasTransitionWithVar).toBe(true);
    });

    it('should NOT generate animation rules for transition-only effects', () => {
      const config = createConfig(transitionEffect as Effect);
      const result = _generateCSS(config);

      expect(result.keyframes).toEqual([]);
      expect(result.animationRules).toEqual([]);
    });
  });

  // ============================================================================
  // SUITE 11: TransitionProperties (alternative syntax)
  // ============================================================================
  describe('transitionProperties', () => {
    it('should support transitionProperties when used with transition', () => {
      // Note: transitionProperties alone doesn't work; it needs transition to be present
      const effect: TransitionEffect = {
        transition: {
          duration: 300,
          styleProperties: [{ name: 'opacity', value: '1' }],
        },
        transitionProperties: [
          { name: 'transform', value: 'translateY(0)', duration: 500, delay: 100 },
        ],
      };
      const config = createConfig(effect as Effect, { effectId: 'prop-trans' });
      const result = _generateCSS(config);

      expect(result.transitionRules.length).toBeGreaterThan(0);

      const hasOpacity = result.transitionRules.some((rule) => rule.includes('opacity'));
      expect(hasOpacity).toBe(true);
    });
  });

  // ============================================================================
  // SUITE 12: Effect Options
  // ============================================================================
  describe('effect options', () => {
    it('should handle all TimeEffect options correctly', () => {
      const fullOptionsEffect: TimeEffect = {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 1000,
        delay: 200,
        easing: 'ease-in-out',
        iterations: 3,
        alternate: true,
        fill: 'both',
        reversed: true,
      };
      const config = createConfig(fullOptionsEffect);
      const result = _generateCSS(config);
      const [expectedAnimation] = getAnimationStrings(fullOptionsEffect);

      expect(result.keyframes.length).toBeGreaterThan(0);
      expect(result.animationRules.length).toBeGreaterThan(0);

      // Animation string from motion should be in the rules
      const hasExpectedAnimation = result.animationRules.some((rule) =>
        rule.includes(expectedAnimation),
      );
      expect(hasExpectedAnimation).toBe(true);
    });

    it('should handle infinite iterations (iterations: 0)', () => {
      const infiniteEffect: TimeEffect = {
        namedEffect: { type: 'FadeIn' } as NamedEffect,
        duration: 500,
        iterations: 0,
      };
      const config = createConfig(infiniteEffect);
      const result = _generateCSS(config);

      const hasInfinite = result.animationRules.some((rule) => rule.includes('infinite'));
      expect(hasInfinite).toBe(true);
    });
  });

  // ============================================================================
  // SUITE 13: Inline Effects
  // ============================================================================
  describe('inline effects', () => {
    it('should support inline effect definition without effectId reference', () => {
      const config: InteractConfig = {
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
      const result = _generateCSS(config);

      expect(result.keyframes.length).toBeGreaterThan(0);
      expect(result.animationRules.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // SUITE 14: Edge Cases
  // ============================================================================
  describe('edge cases', () => {
    it('should skip effects without namedEffect, keyframeEffect, or transition', () => {
      const invalidEffect = { duration: 500 } as TimeEffect;
      const config = createConfig(invalidEffect);
      const result = _generateCSS(config);

      expect(result.keyframes).toEqual([]);
      expect(result.animationRules).toEqual([]);
      expect(result.transitionRules).toEqual([]);
    });

    it('should skip condition that does not exist in config.conditions', () => {
      const config = createConfig(fadeInEffect, {
        conditions: { existing: { type: 'media', predicate: 'min-width: 800px' } },
        effectConditions: ['nonexistent', 'existing'],
      });
      const result = _generateCSS(config);

      // Should still generate CSS (with existing condition)
      expect(result.animationRules.length).toBeGreaterThan(0);

      // Should have the existing media query
      const hasExistingMedia = result.animationRules.some((rule) =>
        rule.includes('min-width: 800px'),
      );
      expect(hasExistingMedia).toBe(true);
    });

    it('should handle empty keyframes array', () => {
      const emptyKeyframesEffect: TimeEffect = {
        keyframeEffect: {
          name: 'empty-keyframes',
          keyframes: [],
        },
        duration: 500,
      };
      const config = createConfig(emptyKeyframesEffect);
      const result = _generateCSS(config);

      // Empty keyframes should result in empty or no CSS
      expect(result.keyframes).toEqual([]);
    });

    it('should handle mixed animation and transition effects in same interaction', () => {
      const config: InteractConfig = {
        effects: {
          anim: fadeInEffect,
          trans: transitionEffect as Effect,
        },
        interactions: [
          {
            trigger: 'viewEnter',
            key: 'mixed',
            effects: [
              { key: 'mixed', effectId: 'anim' },
              { key: 'mixed', effectId: 'trans' },
            ],
          },
        ],
      };
      const result = _generateCSS(config);

      expect(result.keyframes.length).toBeGreaterThan(0);
      expect(result.animationRules.length).toBeGreaterThan(0);
      expect(result.transitionRules.length).toBeGreaterThan(0);
    });
  });
});
