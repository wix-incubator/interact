import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { TiltIn, AnimationData } from '../../../types';

describe('TiltIn', () => {
  test('TiltIn animation with default options', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: {} as TiltIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: 200,
      },
      {
        easing: 'cubicOut',
      },
      {
        easing: 'cubicOut',
        duration: 800,
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-start, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: `rotateZ(30deg)`,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotateZ(0deg)',
          },
        ],
      },
    ];

    const result = entranceAnimations.TiltIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('TiltIn animation with custom direction', () => {
    const duration = 1000;
    const easing = 'cubicIn';
    const mockOptions = {
      ...baseMockOptions,
      easing,
      duration,
      namedEffect: { direction: 'right' } as TiltIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: 200,
      },
      { easing },
      {
        easing,
        duration: 800,
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-start, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: `rotateZ(-30deg)`,
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.TiltIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('TiltIn.style animation with default options', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: {} as TiltIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: 200,
        easing: 'cubicOut',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-tiltInRotate',
        easing: 'cubicOut',
        custom: {},
        keyframes: [
          {
            offset: 0,
            easing: 'step-end',
            transform: 'perspective(800px)',
          },
          {
            offset: 0.000001,
            transform:
              'perspective(800px) translateZ(calc((var(--motion-height, 200px) / 2) * -1)) rotateX(-90deg) translateZ(calc(var(--motion-height, 200px) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((var(--motion-height, 200px) / 2) * -1)) rotateX(0deg) translateZ(calc(var(--motion-height, 200px) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
      {
        name: 'motion-tiltInClip',
        easing: 'cubicOut',
        duration: 800,
        composite: 'add',
        custom: {
          '--motion-rotate-z': '30deg',
          '--motion-clip-start': 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        },
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-start, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotateZ(var(--motion-rotate-z))',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotateZ(0deg)',
          },
        ],
      },
    ];

    const result = entranceAnimations.TiltIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('TiltIn.style animation with custom direction', () => {
    const duration = 1000;
    const easing = 'cubicIn';
    const mockOptions = {
      ...baseMockOptions,
      easing,
      duration,
      namedEffect: { direction: 'right' } as TiltIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: 200,
        easing: 'cubicOut',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-tiltInRotate',
        easing,
        custom: {},
        keyframes: [
          {
            offset: 0,
            easing: 'step-end',
            transform: 'perspective(800px)',
          },
          {
            offset: 0.000001,
            transform:
              'perspective(800px) translateZ(calc((var(--motion-height, 200px) / 2) * -1)) rotateX(-90deg) translateZ(calc(var(--motion-height, 200px) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((var(--motion-height, 200px) / 2) * -1)) rotateX(0deg) translateZ(calc(var(--motion-height, 200px) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
      {
        name: 'motion-tiltInClip',
        easing,
        duration: 800,
        composite: 'add',
        custom: {
          '--motion-rotate-z': '-30deg',
          '--motion-clip-start': 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        },
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-start, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotateZ(var(--motion-rotate-z))',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotateZ(0deg)',
          },
        ],
      },
    ];

    const result = entranceAnimations.TiltIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
