import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { ArcIn, AnimationData } from '../../../types';

describe('ArcIn', () => {
  test('ArcIn animation with left direction and soft power', () => {
    const duration = 1000;
    const power = 'soft';
    const direction = 'left';
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { power, direction } as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      { duration: 0.7 * duration },
      {
        easing: 'cubicInOut',
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(0 * -1 * 80deg)) rotateY(calc(1 * -1 * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ArcIn animation with top direction and medium power', () => {
    const duration = 1000;
    const power = 'medium';
    const direction = 'top';
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { power, direction } as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      { duration: 0.7 * duration },
      {
        easing: 'quintInOut',
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(1 * 1 * 80deg)) rotateY(calc(0 * 1 * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ArcIn animation with bottom direction and hard power', () => {
    const duration = 1000;
    const power = 'hard';
    const direction = 'bottom';
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { power, direction } as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      { duration: 0.7 * duration },
      {
        easing: 'backOut',
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(1 * -1 * 80deg)) rotateY(calc(0 * -1 * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ArcIn animation with default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      { duration: expect.any(Number) },
      {
        easing: 'quintInOut',
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(0 * 1 * 80deg)) rotateY(calc(1 * 1 * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ArcIn style animation with left direction and soft power', () => {
    const duration = 1000;
    const power = 'soft';
    const direction = 'left';
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { power, direction } as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: duration * 0.7,
        easing: 'sineIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-arcIn',
        easing: 'cubicInOut',
        custom: {
          '--motion-arc-x': '0',
          '--motion-arc-y': '1',
          '--motion-arc-sign': '-1',
        },
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(var(--motion-arc-x) * var(--motion-arc-sign) * 80deg)) rotateY(calc(var(--motion-arc-y) * var(--motion-arc-sign) * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ArcIn style animation with top direction and medium power', () => {
    const duration = 1000;
    const power = 'medium';
    const direction = 'top';
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { power, direction } as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: duration * 0.7,
        easing: 'sineIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-arcIn',
        easing: 'quintInOut',
        custom: {
          '--motion-arc-x': '1',
          '--motion-arc-y': '0',
          '--motion-arc-sign': '1',
        },
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(var(--motion-arc-x) * var(--motion-arc-sign) * 80deg)) rotateY(calc(var(--motion-arc-y) * var(--motion-arc-sign) * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ArcIn style animation with default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: expect.any(Number),
        easing: 'sineIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-arcIn',
        easing: 'quintInOut',
        custom: {
          '--motion-arc-x': '0',
          '--motion-arc-y': '1',
          '--motion-arc-sign': '1',
        },
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(var(--motion-arc-x) * var(--motion-arc-sign) * 80deg)) rotateY(calc(var(--motion-arc-y) * var(--motion-arc-sign) * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ArcIn style animation with bottom direction and hard power', () => {
    const duration = 1000;
    const power = 'hard';
    const direction = 'bottom';
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { power, direction } as ArcIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: duration * 0.7,
        easing: 'sineIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-arcIn',
        easing: 'backOut',
        custom: {
          '--motion-arc-x': '1',
          '--motion-arc-y': '0',
          '--motion-arc-sign': '-1',
        },
        keyframes: [
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(calc(var(--motion-arc-x) * var(--motion-arc-sign) * 80deg)) rotateY(calc(var(--motion-arc-y) * var(--motion-arc-sign) * 80deg)) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) translateZ(calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * (-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = entranceAnimations.ArcIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
