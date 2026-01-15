import { describe, expect, test } from 'vitest';

import * as ExpandIn from '../ExpandIn';
import type { AnimationData, ExpandIn as ExpandInType } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('ExpandIn', () => {
  describe('web method', () => {
    test('ExpandIn animation with default options', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        direction: 'center',
        namedEffect: {} as ExpandInType,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {},
        {
          easing: 'cubicInOut',
          keyframes: [
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * 0)) translateY(calc(var(--motion-height, 100%) * 0)) scale(0) translateX(calc(var(--motion-width, 100%) * -1 * 0)) translateY(calc(var(--motion-height, 100%) * -1 * 0))  rotate(var(--comp-rotate-z, 0deg))',
            },
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * 0)) translateY(calc(var(--motion-height, 100%) * 0)) scale(1) translateX(calc(var(--motion-width, 100%) * -1 * 0)) translateY(calc(var(--motion-height, 100%) * -1 * 0)) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = ExpandIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('ExpandIn animation with custom direction and initialScale', () => {
      const duration = 1500;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: {
          direction: 'top-right',
          initialScale: 0.5,
        } as ExpandInType,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {},
        {
          easing: 'cubicInOut',
          keyframes: [
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * 0.5)) translateY(calc(var(--motion-height, 100%) * -0.5)) scale(0.5) translateX(calc(var(--motion-width, 100%) * -1 * 0.5)) translateY(calc(var(--motion-height, 100%) * -1 * -0.5))  rotate(var(--comp-rotate-z, 0deg))',
            },
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * 0.5)) translateY(calc(var(--motion-height, 100%) * -0.5)) scale(1) translateX(calc(var(--motion-width, 100%) * -1 * 0.5)) translateY(calc(var(--motion-height, 100%) * -1 * -0.5)) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = ExpandIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('ExpandIn animation with custom power', () => {
      const duration = 2000;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as ExpandInType,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {},
        {
          easing: 'cubicInOut',
          keyframes: [
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * 0)) translateY(calc(var(--motion-height, 100%) * 0)) scale(0) translateX(calc(var(--motion-width, 100%) * -1 * 0)) translateY(calc(var(--motion-height, 100%) * -1 * 0))  rotate(var(--comp-rotate-z, 0deg))',
            },
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * 0)) translateY(calc(var(--motion-height, 100%) * 0)) scale(1) translateX(calc(var(--motion-width, 100%) * -1 * 0)) translateY(calc(var(--motion-height, 100%) * -1 * 0)) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = ExpandIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style method', () => {
    test('ExpandIn style with default options', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        direction: 'center',
        namedEffect: {} as ExpandInType,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-fadeIn',
          easing: 'linear',
          custom: {},
          keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
        },
        {
          name: 'motion-expandIn',
          easing: 'cubicInOut',
          custom: {
            '--motion-translate-x': 0,
            '--motion-translate-y': 0,
            '--motion-scale': 0,
          },
          keyframes: [
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * var(--motion-translate-y))) scale(var(--motion-scale)) translateX(calc(var(--motion-width, 100%) * -1 * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * -1 * var(--motion-translate-y)))  rotate(var(--comp-rotate-z, 0deg))',
            },
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * var(--motion-translate-y))) scale(1) translateX(calc(var(--motion-width, 100%) * -1 * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * -1 * var(--motion-translate-y))) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = ExpandIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('ExpandIn style with custom direction and initialScale', () => {
      const duration = 1500;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: {
          direction: 'top-right',
          initialScale: 0.5,
        } as ExpandInType,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-fadeIn',
          easing: 'linear',
          custom: {},
          keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
        },
        {
          name: 'motion-expandIn',
          easing: 'cubicInOut',
          custom: {
            '--motion-translate-x': 0.5,
            '--motion-translate-y': -0.5,
            '--motion-scale': 0.5,
          },
          keyframes: [
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * var(--motion-translate-y))) scale(var(--motion-scale)) translateX(calc(var(--motion-width, 100%) * -1 * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * -1 * var(--motion-translate-y)))  rotate(var(--comp-rotate-z, 0deg))',
            },
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * var(--motion-translate-y))) scale(1) translateX(calc(var(--motion-width, 100%) * -1 * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * -1 * var(--motion-translate-y))) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = ExpandIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('ExpandIn style with custom power', () => {
      const duration = 2000;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as ExpandInType,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-fadeIn',
          easing: 'linear',
          custom: {},
          keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
        },
        {
          name: 'motion-expandIn',
          easing: 'cubicInOut',
          custom: {
            '--motion-translate-x': 0,
            '--motion-translate-y': 0,
            '--motion-scale': 0,
          },
          keyframes: [
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * var(--motion-translate-y))) scale(var(--motion-scale)) translateX(calc(var(--motion-width, 100%) * -1 * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * -1 * var(--motion-translate-y)))  rotate(var(--comp-rotate-z, 0deg))',
            },
            {
              transform:
                'translateX(calc(var(--motion-width, 100%) * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * var(--motion-translate-y))) scale(1) translateX(calc(var(--motion-width, 100%) * -1 * var(--motion-translate-x))) translateY(calc(var(--motion-height, 100%) * -1 * var(--motion-translate-y))) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = ExpandIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });
});
