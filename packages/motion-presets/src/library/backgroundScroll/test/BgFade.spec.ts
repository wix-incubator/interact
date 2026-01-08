import { describe, expect, test } from 'vitest';

import BgFade from '../BgFade';
import { baseMockOptions } from './testUtils';
import type { AnimationData, BgFade as BgFadeType } from '../../../types';

describe('BgFade', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgFadeType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        ...baseMockOptions,
        easing: 'sineIn',
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
      },
    ];

    const result = BgFade(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom range - out', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as BgFadeType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'sineOut',
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
      },
    ];

    const result = BgFade(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
