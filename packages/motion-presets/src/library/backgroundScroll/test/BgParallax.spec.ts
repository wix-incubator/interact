import { describe, expect, test } from 'vitest';

import BgParallax from '../BgParallax';
import { baseMockOptions } from './testUtils';
import type {
  BgParallax,
  AnimationData,
  BgParallax as BgParallaxType,
} from '../../../types';

describe('BgParallax', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgParallaxType,
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

    const result = BgParallax(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom speed', () => {
    const speed = 0.5;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { speed } as BgParallaxType,
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

    const result = BgParallax(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
