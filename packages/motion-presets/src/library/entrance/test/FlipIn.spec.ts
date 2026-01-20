import { describe, expect, test } from 'vitest';

import * as FlipIn from '../FlipIn';
import { baseMockOptions } from './testUtils';
import type { FlipIn as FlipInType, AnimationData } from '../../../types';

describe('FlipIn', () => {
  test('FlipIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as FlipInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        easing: 'backOut',
        keyframes: [
          {
            transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(var(--motion-rotate-x , 90deg)) rotateY(var(--motion-rotate-y , 0deg))`,
          },
          {},
        ],
      },
    ];

    const result = FlipIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('FlipIn animation with custom values', () => {
    const easing = 'backIn';
    const direction = 'right';
    const power = 'soft';
    const mockOptions = {
      ...baseMockOptions,
      easing,
      namedEffect: {
        direction,
        power,
        initialRotate: 50,
      } as FlipInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        easing,
        keyframes: [
          {
            transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(var(--motion-rotate-x , 0deg)) rotateY(var(--motion-rotate-y , 45deg))`,
          },
          {},
        ],
      },
    ];

    const result = FlipIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('FlipIn style with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as FlipInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'quadOut',
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        easing: 'backOut',
        name: 'motion-flipIn',
        custom: {
          '--motion-rotate-x': '90deg',
          '--motion-rotate-y': '0deg',
        },
        keyframes: [
          {
            transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(var(--motion-rotate-x , 90deg)) rotateY(var(--motion-rotate-y , 0deg))`,
          },
          {
            transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(0deg) rotateY(0deg)`,
          },
        ],
      },
    ];

    const result = FlipIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('FlipIn style with custom values', () => {
    const easing = 'backIn';
    const direction = 'right';
    const power = 'soft';
    const mockOptions = {
      ...baseMockOptions,
      easing,
      namedEffect: {
        direction,
        power,
        initialRotate: 50,
      } as FlipInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'quadOut',
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        easing,
        name: 'motion-flipIn',
        custom: {
          '--motion-rotate-x': '0deg',
          '--motion-rotate-y': '45deg',
        },
        keyframes: [
          {
            transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(var(--motion-rotate-x , 0deg)) rotateY(var(--motion-rotate-y , 45deg))`,
          },
          {
            transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(0deg) rotateY(0deg)`,
          },
        ],
      },
    ];

    const result = FlipIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
