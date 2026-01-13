import { describe, expect, test } from 'vitest';

import * as PulseAnimation from '../Pulse';
import { Pulse, TimeAnimationOptions, AnimationData } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('Pulse', () => {
  describe('web() method', () => {
    test('default values', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: {} as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          duration: 1,
          custom: {
            '--motion-pulse-offset': 0,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - 0))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - 0))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom intensity and duration', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        delay: 500,
        namedEffect: { intensity: 0.8 } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-067',
          duration: 1500,
          custom: {
            '--motion-pulse-offset': 0.096,
          },
          keyframes: [
            {
              offset: 0.18090000000000003,
              transform: 'scale(calc(0.96 - 0.096))',
            },
            {
              offset: 0.30150000000000005,
              transform: 'scale(1)',
            },
            {
              offset: 0.4824,
              transform: 'scale(calc(0.93 - 0.096))',
            },
            {
              offset: 0.67,
              transform: 'scale(1)',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'soft' } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          custom: {
            '--motion-pulse-offset': 0,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - 0))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - 0))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          custom: {
            '--motion-pulse-offset': 0.06,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - 0.06))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - 0.06))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          custom: {
            '--motion-pulse-offset': 0.12,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - 0.12))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - 0.12))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style() method', () => {
    test('default values', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: {} as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          duration: 1,
          custom: {
            '--motion-pulse-offset': 0,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - var(--motion-pulse-offset)))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - var(--motion-pulse-offset)))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom intensity and duration', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        delay: 500,
        namedEffect: { intensity: 0.8 } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-067',
          duration: 1500,
          custom: {
            '--motion-pulse-offset': 0.096,
          },
          keyframes: [
            {
              offset: 0.18090000000000003,
              transform: 'scale(calc(0.96 - var(--motion-pulse-offset)))',
            },
            {
              offset: 0.30150000000000005,
              transform: 'scale(1)',
            },
            {
              offset: 0.4824,
              transform: 'scale(calc(0.93 - var(--motion-pulse-offset)))',
            },
            {
              offset: 0.67,
              transform: 'scale(1)',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'soft' } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          custom: {
            '--motion-pulse-offset': 0,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - var(--motion-pulse-offset)))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - var(--motion-pulse-offset)))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          custom: {
            '--motion-pulse-offset': 0.06,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - var(--motion-pulse-offset)))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - var(--motion-pulse-offset)))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as Pulse,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-pulse-1',
          custom: {
            '--motion-pulse-offset': 0.12,
          },
          keyframes: [
            {
              offset: 0.27,
              transform: 'scale(calc(0.96 - var(--motion-pulse-offset)))',
            },
            {
              offset: 0.45,
              transform: 'scale(1)',
            },
            {
              offset: 0.72,
              transform: 'scale(calc(0.93 - var(--motion-pulse-offset)))',
            },
            {
              offset: 1,
              transform: 'scale(1)',
            },
          ],
        },
      ];

      const result = PulseAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('style vs web methods should have different keyframe values', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Pulse,
      };

      const styleResult = PulseAnimation.style(mockOptions);
      const webResult = PulseAnimation.web(mockOptions);

      // Style method should use CSS custom properties
      expect(styleResult[0].keyframes![0].transform).toBe(
        'scale(calc(0.96 - var(--motion-pulse-offset)))',
      );
      expect(styleResult[0].custom).toHaveProperty('--motion-pulse-offset', 0.06);

      // Web method should use direct values
      expect(webResult[0].keyframes![0].transform).toBe('scale(calc(0.96 - 0.06))');
      expect(webResult[0].custom).toHaveProperty('--motion-pulse-offset', 0.06);
    });

    test('style method should populate custom properties correctly', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { intensity: 0.5 } as Pulse,
      };

      const result = PulseAnimation.style(mockOptions);

      expect(result[0]).toHaveProperty('custom');
      expect(result[0].custom).toHaveProperty('--motion-pulse-offset');

      // Verify the custom property contains the expected calculated value
      expect(typeof result[0].custom!['--motion-pulse-offset']).toBe('number');
      expect(result[0].custom!['--motion-pulse-offset']).toBe(0.06); // 0.5 intensity maps to 0.06 offset
    });
  });
});
