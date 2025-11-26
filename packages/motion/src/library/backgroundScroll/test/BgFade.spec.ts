import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { AnimationData, BgFade } from '../../../types';

describe('BgFade', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgFade,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        ...baseMockOptions,
        easing: 'sineIn',
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
      },
    ];

    const result = backgroundScrollAnimations.BgFade(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom range - out', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as BgFade,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'sineOut',
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
      },
    ];

    const result = backgroundScrollAnimations.BgFade(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
