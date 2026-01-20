import { describe, expect, test } from 'vitest';

import * as SpinAnimation from '../Spin';
import { Spin, TimeAnimationOptions, AnimationData } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('Spin', () => {
  describe('web() method', () => {
    test('Spin animation with default options', () => {
      const duration = 1000;
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration,
        namedEffect: {} as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          easing: 'linear',
          delay: 0,
          duration: 1000,
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'linear',
              rotate: 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin animation with custom duration, delay, and easing', () => {
      const duration = 1000;
      const delay = 500;
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration,
        delay,
        easing: 'quintInOut',
        namedEffect: {} as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-067',
          easing: 'linear',
          delay: 0,
          duration: 1500,
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'cubic-bezier(0.86, 0, 0.07, 1)',
              rotate: 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
            },
            {
              offset: 0.67,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin animation with counter-clockwise direction', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { direction: 'counter-clockwise' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + 360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'linear',
              rotate: 'calc(var(--comp-rotate-z, 0deg) + 360deg)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin animation with custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { power: 'soft' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          easing: 'linear',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'linear',
              rotate: 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin animation with custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { power: 'medium' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          easing: 'linear',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'cubic-bezier(0.86, 0, 0.07, 1)',
              rotate: 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin animation with custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { power: 'hard' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          easing: 'linear',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              rotate: 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin animation with custom easing override', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        easing: 'easeInOut',
        namedEffect: { power: 'medium' } as Spin, // Should be overridden by custom easing
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          easing: 'linear',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'cubic-bezier(0.86, 0, 0.07, 1)', // Power takes precedence over custom easing
              rotate: 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style() method', () => {
    test('Spin.style animation with default options', () => {
      const duration = 1000;
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration,
        namedEffect: {} as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          easing: 'linear',
          delay: 0,
          duration: 1000,
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'linear',
              rotate: 'var(--motion-rotate-start)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin.style animation with custom duration and delay', () => {
      const duration = 800;
      const delay = 200;
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration,
        delay,
        namedEffect: {} as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-08',
          easing: 'linear',
          delay: 0,
          duration: 1000,
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'linear',
              rotate: 'var(--motion-rotate-start)',
            },
            {
              offset: 0.8, // duration / (duration + delay)
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin.style animation with counter-clockwise direction', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { direction: 'counter-clockwise' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + 360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'linear',
              rotate: 'var(--motion-rotate-start)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin.style animation with custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { power: 'soft' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'linear',
              rotate: 'var(--motion-rotate-start)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin.style animation with custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { power: 'medium' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'cubic-bezier(0.86, 0, 0.07, 1)',
              rotate: 'var(--motion-rotate-start)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin.style animation with custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { power: 'hard' } as Spin,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-spin-1',
          custom: {
            '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
          },
          keyframes: [
            {
              offset: 0,
              easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              rotate: 'var(--motion-rotate-start)',
            },
            {
              offset: 1,
              rotate: 'var(--comp-rotate-z, 0deg)',
            },
          ],
        },
      ];

      const result = SpinAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Spin.style animation should use CSS custom properties', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        namedEffect: { direction: 'clockwise', power: 'medium' } as Spin,
      };

      const result = SpinAnimation.style(mockOptions);

      // Verify CSS custom properties are set
      expect(result[0].custom).toEqual({
        '--motion-rotate-start': 'calc(var(--comp-rotate-z, 0deg) + -360deg)',
      });

      // Verify keyframes use CSS variables
      expect(result[0].keyframes[0].rotate).toBe('var(--motion-rotate-start)');
      expect(result[0].keyframes[1].rotate).toBe('var(--comp-rotate-z, 0deg)');
    });
  });
});
