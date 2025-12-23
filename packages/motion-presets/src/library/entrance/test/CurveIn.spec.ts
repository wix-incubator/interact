import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import type { AnimationData, CurveIn } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('CurveIn', () => {
  describe('web method', () => {
    test('CurveIn animation with default options', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: {} as CurveIn,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          easing: 'quadOut',
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
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(0deg) rotateY(180deg) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform:
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(0deg) rotateY(0deg) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CurveIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('CurveIn animation with left direction', () => {
      const duration = 1500;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: { direction: 'left' } as CurveIn,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          easing: 'quadOut',
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
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(0deg) rotateY(-180deg) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform:
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(0deg) rotateY(0deg) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CurveIn.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style method', () => {
    test('CurveIn style with default options', () => {
      const duration = 1000;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: {} as CurveIn,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-curveIn',
          easing: 'quadOut',
          custom: {
            '--motion-rotate-x': '0deg',
            '--motion-rotate-y': '180deg',
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
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(var(--motion-rotate-x)) rotateY(var(--motion-rotate-y)) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform:
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(0deg) rotateY(0deg) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CurveIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('CurveIn style with left direction', () => {
      const duration = 1500;
      const mockOptions = {
        ...baseMockOptions,
        namedEffect: { direction: 'left' } as CurveIn,
        duration,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-curveIn',
          easing: 'quadOut',
          custom: {
            '--motion-rotate-x': '0deg',
            '--motion-rotate-y': '-180deg',
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
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(var(--motion-rotate-x)) rotateY(var(--motion-rotate-y)) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
            {
              opacity: 'var(--comp-opacity, 1)',
              transform:
                'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(0deg) rotateY(0deg) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
            },
          ],
        },
      ];

      const result = entranceAnimations.CurveIn.style?.(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });
});
