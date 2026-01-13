import { describe, expect, test } from 'vitest';

import * as WiggleAnimation from '../Wiggle';
import { Wiggle, TimeAnimationOptions, AnimationData } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('Wiggle', () => {
  describe('web() method', () => {
    test('default values', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: {} as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          duration: 1,
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 25deg)) translateY(-25px)',
            },
            {
              offset: 0.35,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -20deg)) translateY(0px)',
            },
            {
              offset: 0.53,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 15deg)) translateY(0px)',
            },
            {
              offset: 0.73,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -10deg)) translateY(0px)',
            },
            {
              offset: 1,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 0deg)) translateY(0px)',
            },
          ],
        },
      ];

      const result = WiggleAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom duration and intensity', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        delay: 500,
        namedEffect: { intensity: 0.8 } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-067',
          duration: 1500,
          keyframes: [
            {
              offset: 0.1206,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 34deg)) translateY(-34px)',
            },
            {
              offset: 0.2345,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -27.2deg)) translateY(0px)',
            },
            {
              offset: 0.3551,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 20.4deg)) translateY(0px)',
            },
            {
              offset: 0.48910000000000003,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -13.6deg)) translateY(0px)',
            },
            {
              offset: 0.67,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 0deg)) translateY(0px)',
            },
          ],
        },
      ];

      const result = WiggleAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'soft' } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 10deg)) translateY(-10px)',
            },
            {
              offset: 0.35,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -8deg)) translateY(0px)',
            },
            {
              offset: 0.53,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 6deg)) translateY(0px)',
            },
            {
              offset: 0.73,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -4deg)) translateY(0px)',
            },
            {
              offset: 1,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 0deg)) translateY(0px)',
            },
          ],
        },
      ];

      const result = WiggleAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 20deg)) translateY(-20px)',
            },
            {
              offset: 0.35,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -16deg)) translateY(0px)',
            },
            {
              offset: 0.53,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 12deg)) translateY(0px)',
            },
            {
              offset: 0.73,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -8deg)) translateY(0px)',
            },
            {
              offset: 1,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 0deg)) translateY(0px)',
            },
          ],
        },
      ];

      const result = WiggleAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 40deg)) translateY(-40px)',
            },
            {
              offset: 0.35,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -32deg)) translateY(0px)',
            },
            {
              offset: 0.53,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 24deg)) translateY(0px)',
            },
            {
              offset: 0.73,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + -16deg)) translateY(0px)',
            },
            {
              offset: 1,
              transform: 'rotate(calc(var(--comp-rotate-z, 0deg) + 0deg)) translateY(0px)',
            },
          ],
        },
      ];

      const result = WiggleAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style() method', () => {
    test('default values', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: {} as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          duration: 1,
          custom: {
            '--motion-rotate-18': 'calc(var(--comp-rotate-z, 0deg) + 25deg)',
            '--motion-translate-y-18': '-25px',
            '--motion-rotate-35': 'calc(var(--comp-rotate-z, 0deg) + -20deg)',
            '--motion-translate-y-35': '0px',
            '--motion-rotate-53': 'calc(var(--comp-rotate-z, 0deg) + 15deg)',
            '--motion-translate-y-53': '0px',
            '--motion-rotate-73': 'calc(var(--comp-rotate-z, 0deg) + -10deg)',
            '--motion-translate-y-73': '0px',
            '--motion-rotate-100': 'calc(var(--comp-rotate-z, 0deg) + 0deg)',
            '--motion-translate-y-100': '0px',
          },
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(var(--motion-rotate-18)) translateY(var(--motion-translate-y-18))',
            },
            {
              offset: 0.35,
              transform: 'rotate(var(--motion-rotate-35)) translateY(var(--motion-translate-y-35))',
            },
            {
              offset: 0.53,
              transform: 'rotate(var(--motion-rotate-53)) translateY(var(--motion-translate-y-53))',
            },
            {
              offset: 0.73,
              transform: 'rotate(var(--motion-rotate-73)) translateY(var(--motion-translate-y-73))',
            },
            {
              offset: 1,
              transform:
                'rotate(var(--motion-rotate-100)) translateY(var(--motion-translate-y-100))',
            },
          ],
        },
      ];

      const result = WiggleAnimation.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom intensity and duration', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        delay: 500,
        namedEffect: { intensity: 0.8 } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-067',
          duration: 1500,
          custom: {
            '--motion-rotate-18': 'calc(var(--comp-rotate-z, 0deg) + 34deg)',
            '--motion-translate-y-18': '-34px',
            '--motion-rotate-35': 'calc(var(--comp-rotate-z, 0deg) + -27.2deg)',
            '--motion-translate-y-35': '0px',
            '--motion-rotate-53': 'calc(var(--comp-rotate-z, 0deg) + 20.4deg)',
            '--motion-translate-y-53': '0px',
            '--motion-rotate-73': 'calc(var(--comp-rotate-z, 0deg) + -13.6deg)',
            '--motion-translate-y-73': '0px',
            '--motion-rotate-100': 'calc(var(--comp-rotate-z, 0deg) + 0deg)',
            '--motion-translate-y-100': '0px',
          },
          keyframes: [
            {
              offset: 0.1206,
              transform: 'rotate(var(--motion-rotate-18)) translateY(var(--motion-translate-y-18))',
            },
            {
              offset: 0.2345,
              transform: 'rotate(var(--motion-rotate-35)) translateY(var(--motion-translate-y-35))',
            },
            {
              offset: 0.3551,
              transform: 'rotate(var(--motion-rotate-53)) translateY(var(--motion-translate-y-53))',
            },
            {
              offset: 0.48910000000000003,
              transform: 'rotate(var(--motion-rotate-73)) translateY(var(--motion-translate-y-73))',
            },
            {
              offset: 0.67,
              transform:
                'rotate(var(--motion-rotate-100)) translateY(var(--motion-translate-y-100))',
            },
          ],
        },
      ];

      const result = WiggleAnimation.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'soft' } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          custom: {
            '--motion-rotate-18': 'calc(var(--comp-rotate-z, 0deg) + 10deg)',
            '--motion-translate-y-18': '-10px',
            '--motion-rotate-35': 'calc(var(--comp-rotate-z, 0deg) + -8deg)',
            '--motion-translate-y-35': '0px',
            '--motion-rotate-53': 'calc(var(--comp-rotate-z, 0deg) + 6deg)',
            '--motion-translate-y-53': '0px',
            '--motion-rotate-73': 'calc(var(--comp-rotate-z, 0deg) + -4deg)',
            '--motion-translate-y-73': '0px',
            '--motion-rotate-100': 'calc(var(--comp-rotate-z, 0deg) + 0deg)',
            '--motion-translate-y-100': '0px',
          },
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(var(--motion-rotate-18)) translateY(var(--motion-translate-y-18))',
            },
            {
              offset: 0.35,
              transform: 'rotate(var(--motion-rotate-35)) translateY(var(--motion-translate-y-35))',
            },
            {
              offset: 0.53,
              transform: 'rotate(var(--motion-rotate-53)) translateY(var(--motion-translate-y-53))',
            },
            {
              offset: 0.73,
              transform: 'rotate(var(--motion-rotate-73)) translateY(var(--motion-translate-y-73))',
            },
            {
              offset: 1,
              transform:
                'rotate(var(--motion-rotate-100)) translateY(var(--motion-translate-y-100))',
            },
          ],
        },
      ];

      const result = WiggleAnimation.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          custom: {
            '--motion-rotate-18': 'calc(var(--comp-rotate-z, 0deg) + 20deg)',
            '--motion-translate-y-18': '-20px',
            '--motion-rotate-35': 'calc(var(--comp-rotate-z, 0deg) + -16deg)',
            '--motion-translate-y-35': '0px',
            '--motion-rotate-53': 'calc(var(--comp-rotate-z, 0deg) + 12deg)',
            '--motion-translate-y-53': '0px',
            '--motion-rotate-73': 'calc(var(--comp-rotate-z, 0deg) + -8deg)',
            '--motion-translate-y-73': '0px',
            '--motion-rotate-100': 'calc(var(--comp-rotate-z, 0deg) + 0deg)',
            '--motion-translate-y-100': '0px',
          },
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(var(--motion-rotate-18)) translateY(var(--motion-translate-y-18))',
            },
            {
              offset: 0.35,
              transform: 'rotate(var(--motion-rotate-35)) translateY(var(--motion-translate-y-35))',
            },
            {
              offset: 0.53,
              transform: 'rotate(var(--motion-rotate-53)) translateY(var(--motion-translate-y-53))',
            },
            {
              offset: 0.73,
              transform: 'rotate(var(--motion-rotate-73)) translateY(var(--motion-translate-y-73))',
            },
            {
              offset: 1,
              transform:
                'rotate(var(--motion-rotate-100)) translateY(var(--motion-translate-y-100))',
            },
          ],
        },
      ];

      const result = WiggleAnimation.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as Wiggle,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-wiggle-1',
          custom: {
            '--motion-rotate-18': 'calc(var(--comp-rotate-z, 0deg) + 40deg)',
            '--motion-translate-y-18': '-40px',
            '--motion-rotate-35': 'calc(var(--comp-rotate-z, 0deg) + -32deg)',
            '--motion-translate-y-35': '0px',
            '--motion-rotate-53': 'calc(var(--comp-rotate-z, 0deg) + 24deg)',
            '--motion-translate-y-53': '0px',
            '--motion-rotate-73': 'calc(var(--comp-rotate-z, 0deg) + -16deg)',
            '--motion-translate-y-73': '0px',
            '--motion-rotate-100': 'calc(var(--comp-rotate-z, 0deg) + 0deg)',
            '--motion-translate-y-100': '0px',
          },
          keyframes: [
            {
              offset: 0.18,
              transform: 'rotate(var(--motion-rotate-18)) translateY(var(--motion-translate-y-18))',
            },
            {
              offset: 0.35,
              transform: 'rotate(var(--motion-rotate-35)) translateY(var(--motion-translate-y-35))',
            },
            {
              offset: 0.53,
              transform: 'rotate(var(--motion-rotate-53)) translateY(var(--motion-translate-y-53))',
            },
            {
              offset: 0.73,
              transform: 'rotate(var(--motion-rotate-73)) translateY(var(--motion-translate-y-73))',
            },
            {
              offset: 1,
              transform:
                'rotate(var(--motion-rotate-100)) translateY(var(--motion-translate-y-100))',
            },
          ],
        },
      ];

      const result = WiggleAnimation.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('style vs web methods should have different keyframe values', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Wiggle,
      };

      const styleResult = WiggleAnimation.style(mockOptions);
      const webResult = WiggleAnimation.web(mockOptions);

      // Style method should use CSS custom properties in transform
      expect(styleResult[0].keyframes[0].transform).toBe(
        'rotate(var(--motion-rotate-18)) translateY(var(--motion-translate-y-18))',
      );
      expect(styleResult[0].custom).toHaveProperty(
        '--motion-rotate-18',
        'calc(var(--comp-rotate-z, 0deg) + 20deg)',
      );
      expect(styleResult[0].custom).toHaveProperty('--motion-translate-y-18', '-20px');

      // Web method should use direct values in transform
      expect(webResult[0].keyframes[0].transform).toBe(
        'rotate(calc(var(--comp-rotate-z, 0deg) + 20deg)) translateY(-20px)',
      );
      expect(webResult[0].custom).toHaveProperty(
        '--motion-rotate-18',
        'calc(var(--comp-rotate-z, 0deg) + 20deg)',
      );
      expect(webResult[0].custom).toHaveProperty('--motion-translate-y-18', '-20px');
    });

    test('style method should populate custom properties correctly', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { intensity: 0.5 } as Wiggle,
      };

      const result = WiggleAnimation.style?.(mockOptions);

      expect(result[0]).toHaveProperty('custom');
      expect(result[0].custom).toHaveProperty('--motion-rotate-18');
      expect(result[0].custom).toHaveProperty('--motion-translate-y-18');
      expect(result[0].custom).toHaveProperty('--motion-rotate-35');
      expect(result[0].custom).toHaveProperty('--motion-translate-y-35');
      expect(result[0].custom).toHaveProperty('--motion-rotate-53');
      expect(result[0].custom).toHaveProperty('--motion-translate-y-53');
      expect(result[0].custom).toHaveProperty('--motion-rotate-73');
      expect(result[0].custom).toHaveProperty('--motion-translate-y-73');
      expect(result[0].custom).toHaveProperty('--motion-rotate-100');
      expect(result[0].custom).toHaveProperty('--motion-translate-y-100');

      // Verify the custom properties contain the expected calculated values
      expect(typeof result[0].custom!['--motion-rotate-18']).toBe('string');
      expect(typeof result[0].custom!['--motion-translate-y-18']).toBe('string');
    });
  });
});
