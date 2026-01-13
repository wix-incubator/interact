import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { BackgroundScrollAnimation, AnimationData } from '../../../types';

describe('BgPullBack', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          {
            transform: `perspective(100px) translate3d(0px, -16%, 50px)`,
          },
          {},
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgPullBack(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom scale', () => {
    const scale = 60;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { scale } as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          {
            transform: `perspective(100px) translate3d(0px, -20%, 60px)`,
          },
          {},
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgPullBack(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
