import { describe, expect, test } from 'vitest';

import * as FlipAnimation from '../Flip';
import { Flip, TimeAnimationOptions, AnimationData } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('Flip', () => {
  describe('web() method', () => {
    test('Flip animation with default options', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: {} as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          duration: 1,
          keyframes: [
            {
              offset: 0,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(0, 1, 0, 0deg)',
              easing: 'linear',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(0, 1, 0, 360deg)',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(0, 1, 0, 360deg)',
            },
          ],
        },
      ];

      const result = FlipAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with vertical direction', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { direction: 'vertical' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          easing: 'linear',
          delay: 0,
          duration: 1,
          keyframes: [
            {
              offset: 0,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(1, 0, 0, 0deg)',
              easing: 'linear',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(1, 0, 0, 360deg)',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(1, 0, 0, 360deg)',
            },
          ],
        },
      ];

      const result = FlipAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom duration, delay, and easing', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        delay: 1000,
        easing: 'ease-in-out',
        namedEffect: {} as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-05',
          easing: 'linear',
          delay: 0,
          duration: 2000,
          keyframes: [
            {
              offset: 0,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(0, 1, 0, 0deg)',
              easing: 'ease-in-out',
            },
            {
              offset: 0.5,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(0, 1, 0, 360deg)',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(0, 1, 0, 360deg)',
            },
          ],
        },
      ];

      const result = FlipAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'soft' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          keyframes: [{ easing: 'linear' }, {}, {}],
        },
      ];

      const result = FlipAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          keyframes: [{ easing: 'cubic-bezier(0.86, 0, 0.07, 1)' }, {}, {}],
        },
      ];

      const result = FlipAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          keyframes: [{ easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }, {}, {}],
        },
      ];

      const result = FlipAnimation.web(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('style() method', () => {
    test('Flip animation with default options', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: {} as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          custom: {
            '--motion-rotate-x': '0',
            '--motion-rotate-y': '1',
          },
          keyframes: [
            {
              offset: 0,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 0deg)',
              easing: 'linear',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 360deg)',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 360deg)',
            },
          ],
        },
      ];

      const result = FlipAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with vertical direction', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { direction: 'vertical' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          easing: 'linear',
          delay: 0,
          custom: {
            '--motion-rotate-x': '1',
            '--motion-rotate-y': '0',
          },
          keyframes: [
            {
              offset: 0,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 0deg)',
              easing: 'linear',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 360deg)',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 360deg)',
            },
          ],
        },
      ];

      const result = FlipAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom duration, delay, and easing', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1000,
        delay: 1000,
        easing: 'ease-in-out',
        namedEffect: {} as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-05',
          easing: 'linear',
          delay: 0,
          duration: 2000,
          custom: {
            '--motion-rotate-x': '0',
            '--motion-rotate-y': '1',
          },
          keyframes: [
            {
              offset: 0,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 0deg)',
              easing: 'ease-in-out',
            },
            {
              offset: 0.5,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 360deg)',
            },
            {
              offset: 1,
              transform:
                'perspective(800px) rotateZ(var(--comp-rotate-z, 0deg)) rotate3d(var(--motion-rotate-x), var(--motion-rotate-y), 0, 360deg)',
            },
          ],
        },
      ];

      const result = FlipAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom power - soft', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'soft' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          custom: {
            '--motion-rotate-x': '0',
            '--motion-rotate-y': '1',
          },
          keyframes: [{ easing: 'linear' }, {}, {}],
        },
      ];

      const result = FlipAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom power - medium', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'medium' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          custom: {
            '--motion-rotate-x': '0',
            '--motion-rotate-y': '1',
          },
          keyframes: [{ easing: 'cubic-bezier(0.86, 0, 0.07, 1)' }, {}, {}],
        },
      ];

      const result = FlipAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom power - hard', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        namedEffect: { power: 'hard' } as Flip,
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          custom: {
            '--motion-rotate-x': '0',
            '--motion-rotate-y': '1',
          },
          keyframes: [{ easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }, {}, {}],
        },
      ];

      const result = FlipAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });

    test('Flip animation with custom easing override should be ignored when power is set', () => {
      const mockOptions: TimeAnimationOptions = {
        ...baseMockOptions,
        duration: 1,
        delay: 0,
        easing: 'easeInOut',
        namedEffect: { power: 'medium' } as Flip, // Power should take precedence
      };

      const expectedResult: Partial<AnimationData>[] = [
        {
          name: 'motion-flip-1',
          custom: {
            '--motion-rotate-x': '0',
            '--motion-rotate-y': '1',
          },
          keyframes: [{ easing: 'cubic-bezier(0.86, 0, 0.07, 1)' }, {}, {}],
        },
      ];

      const result = FlipAnimation.style(mockOptions);

      expect(result).toMatchObject(expectedResult);
    });
  });
});
