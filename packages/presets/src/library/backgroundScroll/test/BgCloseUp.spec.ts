import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type {
  BackgroundScrollAnimation,
  AnimationData,
} from '../../../types';

describe('BgCloseUp', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      { ...baseMockOptions },
      {
        ...baseMockOptions,
        keyframes: [{}, { transform: `perspective(100px) translateZ(80px)` }],
      },
    ];

    const result = backgroundScrollAnimations.BgCloseUp(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom values', () => {
    const scale = 50;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { scale } as BackgroundScrollAnimation,
    };
    const expectedResult: Partial<AnimationData>[] = [
      { ...baseMockOptions },
      {
        ...baseMockOptions,
        keyframes: [{}, { transform: `perspective(100px) translateZ(50px)` }],
      },
    ];

    const result = backgroundScrollAnimations.BgCloseUp(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
