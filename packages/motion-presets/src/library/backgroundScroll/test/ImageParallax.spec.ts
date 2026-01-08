import { describe, expect, test } from 'vitest';

import ImageParallax from '../ImageParallax';
import { baseMockOptions } from './testUtils';
import type {
  ImageParallax as ImageParallaxType,
  AnimationData,
} from '../../../types';

describe('ImageParallax', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { type: 'ImageParallax' } as ImageParallaxType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: 'translateY(-33%)' },
          { transform: 'translateY(0%)' },
        ],
      },
    ];

    const result = ImageParallax(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Reversed', () => {
    const reverse = true;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { reverse, type: 'ImageParallax' } as ImageParallaxType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: 'translateY(0%)' },
          { transform: 'translateY(-33%)' },
        ],
      },
    ];

    const result = ImageParallax(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom speed', () => {
    const speed = 2;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { speed, type: 'ImageParallax' } as ImageParallaxType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: 'translateY(-50%)' },
          { transform: 'translateY(0%)' },
        ],
      },
    ];

    const result = ImageParallax(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
