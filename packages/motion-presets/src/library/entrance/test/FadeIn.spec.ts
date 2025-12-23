import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { FadeIn, AnimationData } from '../../../types';

describe('FadeIn', () => {
  test('FadeIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as FadeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'sineInOut',
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
    ];

    const result = entranceAnimations.FadeIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('FadeIn style animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as FadeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'sineInOut',
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
    ];

    const result = entranceAnimations.FadeIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
