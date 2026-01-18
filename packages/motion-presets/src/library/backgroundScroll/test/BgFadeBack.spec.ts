import { describe, expect, test } from 'vitest';

import BgFadeBack from '../BgFadeBack';
import { baseMockOptions } from './testUtils';
import type { BgFadeBack as BgFadeBackType, AnimationData } from '../../../types';

describe('BgFadeBack', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgFadeBackType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        ...baseMockOptions,
        keyframes: [{ scale: 1 }, { scale: 0.7 }],
      },
    ];

    const result = BgFadeBack(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom scale', () => {
    const scale = 0.7;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { scale } as BgFadeBackType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        ...baseMockOptions,
        keyframes: [{ scale: 1 }, { scale }],
      },
    ];

    const result = BgFadeBack(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
