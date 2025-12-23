import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { BgSkew, AnimationData } from '../../../types';

describe('BgSkew', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { type: 'BgSkew' } as BgSkew,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: `skewY(20deg)` },
          { transform: `skewY(-20deg)` },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgSkew(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom angle', () => {
    const angle = 20;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { angle, type: 'BgSkew' } as BgSkew,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: `skewY(20deg)` },
          { transform: `skewY(-20deg)` },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgSkew(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom direction - clockwise', () => {
    const direction = 'clockwise';
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction, type: 'BgSkew' } as BgSkew,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: `skewY(-20deg)` },
          { transform: `skewY(20deg)` },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgSkew(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
