import { describe, expect, test } from 'vitest';

import * as DropIn from '../DropIn';
import { baseMockOptions } from './testUtils';
import type { DropIn as DropInType, AnimationData } from '../../../types';

describe('DropIn', () => {
  describe('web method', () => {
    test('DropIn animation with default options', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        duration,
        namedEffect: {} as DropInType,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          duration: 800,
        },
        {
          easing: 'quintInOut',
          keyframes: [{ scale: '1.6' }, { scale: '1' }],
        },
      ];

      const result = DropIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('DropIn animation with custom power', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        duration,
        namedEffect: { power: 'hard' } as DropInType,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          duration: 800,
        },
        {
          easing: 'backOut',
          keyframes: [{ scale: '2' }, { scale: '1' }],
        },
      ];

      const result = DropIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('DropIn animation with custom easing', () => {
      const duration = 1000;
      const customEasing = 'circInOut';
      const mockOptions = {
        ...baseMockOptions,
        duration,
        easing: customEasing,
        namedEffect: {} as DropInType,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          duration: 800,
        },
        {
          easing: customEasing,
          keyframes: [{ scale: '1.6' }, { scale: '1' }],
        },
      ];

      const result = DropIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style method', () => {
    test('DropIn style with default options', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        duration,
        namedEffect: {} as DropInType,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-fadeIn',
          easing: 'quadOut',
          duration: 800,
          custom: {},
          keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
        },
        {
          name: 'motion-dropIn',
          easing: 'quintInOut',
          custom: {
            '--motion-scale': '1.6',
          },
          keyframes: [
            {
              scale: 'var(--motion-scale)',
            },
            {
              scale: '1',
            },
          ],
        },
      ];

      const result = DropIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('DropIn style with custom power', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        duration,
        namedEffect: { power: 'hard' } as DropInType,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-fadeIn',
          easing: 'quadOut',
          duration: 800,
          custom: {},
          keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
        },
        {
          name: 'motion-dropIn',
          easing: 'backOut',
          custom: {
            '--motion-scale': '2',
          },
          keyframes: [
            {
              scale: 'var(--motion-scale)',
            },
            {
              scale: '1',
            },
          ],
        },
      ];

      const result = DropIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('DropIn style with custom easing', () => {
      const duration = 1000;
      const customEasing = 'circInOut';
      const mockOptions = {
        ...baseMockOptions,
        duration,
        easing: customEasing,
        namedEffect: {} as DropInType,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-fadeIn',
          easing: 'quadOut',
          duration: 800,
          custom: {},
          keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
        },
        {
          name: 'motion-dropIn',
          easing: customEasing,
          custom: {
            '--motion-scale': '1.6',
          },
          keyframes: [
            {
              scale: 'var(--motion-scale)',
            },
            {
              scale: '1',
            },
          ],
        },
      ];

      const result = DropIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });
});
