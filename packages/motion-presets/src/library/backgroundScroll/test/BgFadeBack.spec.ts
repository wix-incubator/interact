import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { BgFadeBack, AnimationData } from '../../../types';

describe('BgFadeBack', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgFadeBack,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        ...baseMockOptions,
        keyframes: [{ scale: 1 }, { scale: 0.7 }],
      },
    ];

    const result = backgroundScrollAnimations.BgFadeBack(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom scale', () => {
    const scale = 0.7;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { scale } as BgFadeBack,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        ...baseMockOptions,
        keyframes: [{ scale: 1 }, { scale }],
      },
    ];

    const result = backgroundScrollAnimations.BgFadeBack(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
