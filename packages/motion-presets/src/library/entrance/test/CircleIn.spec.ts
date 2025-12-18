import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { CircleIn, AnimationData } from '../../../types';

describe('CircleIn', () => {
  describe('web method', () => {
    test('CircleIn animation with default options', () => {
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: {} as CircleIn,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          easing: 'circOut',
          keyframes: [
            { translate: 'calc(100vw - var(--motion-left, 0px))' },
            {},
          ],
        },
        {
          easing: 'linear',
          keyframes: [
            {
              offset: 0,
              opacity: 0,
              easing: 'step-end',
            },
            {
              offset: 0.000001,
              opacity: 0,
              transform:
                'translateY(min(calc(100% * -1.5), max(-300px, calc(100% * -5.5)))) rotate(calc(var(--comp-rotate-z, 0deg) + 45deg))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform: 'translateY(0) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CircleIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('CircleIn animation with left direction', () => {
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: { direction: 'left' } as CircleIn,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          keyframes: [
            {
              translate: 'calc(var(--motion-left, 0px) * -1 - 100%)',
            },
            {},
          ],
        },
        {
          keyframes: [
            {
              offset: 0,
              opacity: 0,
              easing: 'step-end',
            },
            {
              offset: 0.000001,
              opacity: 0,
              transform:
                'translateY(min(calc(100% * -1.5), max(-300px, calc(100% * -5.5)))) rotate(calc(var(--comp-rotate-z, 0deg) + -45deg))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform: 'translateY(0) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CircleIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style method', () => {
    test('CircleIn style with default options', () => {
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: {} as CircleIn,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          easing: 'circOut',
          name: 'motion-circleXIn',
          custom: {
            '--motion-translate-x': 'calc(100vw - var(--motion-left, 0px))',
          },
          keyframes: [
            {
              translate: 'var(--motion-translate-x)',
            },
            {
              translate: '0',
            },
          ],
        },
        {
          easing: 'linear',
          name: 'motion-circleYIn',
          custom: {
            '--motion-translate-y':
              'min(calc(100% * -1.5), max(-300px, calc(100% * -5.5)))',
            '--motion-rotate-z': '45deg',
          },
          keyframes: [
            {
              offset: 0,
              opacity: 0,
              easing: 'step-end',
            },
            {
              offset: 0.000001,
              opacity: 0,
              transform:
                'translateY(var(--motion-translate-y)) rotate(calc(var(--comp-rotate-z, 0deg) + var(--motion-rotate-z)))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform: 'translateY(0) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CircleIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('CircleIn style with left direction', () => {
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: { direction: 'left' } as CircleIn,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-circleXIn',
          custom: {
            '--motion-translate-x': 'calc(var(--motion-left, 0px) * -1 - 100%)',
          },
          keyframes: [
            {
              translate: 'var(--motion-translate-x)',
            },
            {
              translate: '0',
            },
          ],
        },
        {
          name: 'motion-circleYIn',
          custom: {
            '--motion-translate-y':
              'min(calc(100% * -1.5), max(-300px, calc(100% * -5.5)))',
            '--motion-rotate-z': '-45deg',
          },
          keyframes: [
            {
              offset: 0,
              opacity: 0,
              easing: 'step-end',
            },
            {
              offset: 0.000001,
              opacity: 0,
              transform:
                'translateY(var(--motion-translate-y)) rotate(calc(var(--comp-rotate-z, 0deg) + var(--motion-rotate-z)))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform: 'translateY(0) rotate(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CircleIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });
});
