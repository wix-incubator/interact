import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { BgRotate, AnimationData } from '../../../types';

describe('BgRotate', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { type: 'BgRotate' } as BgRotate,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [{ transform: `rotate(22deg)` }, {}],
      },
    ];

    const result = backgroundScrollAnimations.BgRotate(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom angle', () => {
    const angle = 30;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { angle, type: 'BgRotate' } as BgRotate,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [{ transform: `rotate(30deg)` }, {}],
      },
    ];

    const result = backgroundScrollAnimations.BgRotate(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom direction - clockwise', () => {
    const direction = 'clockwise';
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction, type: 'BgRotate' } as BgRotate,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [{ transform: `rotate(-22deg)` }, {}],
      },
    ];

    const result = backgroundScrollAnimations.BgRotate(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
