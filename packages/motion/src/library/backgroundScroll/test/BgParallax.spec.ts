import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { BgParallax, AnimationData, BackgroundScrollAnimation } from '../../../types';

describe('BgParallax', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgParallax,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        ...baseMockOptions,
        keyframes: [
          { transform: 'translateY(20svh)' },
          {
            transform: 'translateY(calc((100% - 200lvh) * -0.2))',
          },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgParallax(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom speed', () => {
    const speed = 0.5;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { speed } as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        ...baseMockOptions,
        keyframes: [
          { transform: 'translateY(50svh)' },
          {
            transform: 'translateY(calc((100% - 200lvh) * -0.5))',
          },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgParallax(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
