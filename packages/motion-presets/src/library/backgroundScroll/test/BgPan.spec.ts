import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { BgPan, AnimationData } from '../../../types';

describe('BgPan', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgPan,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        ...baseMockOptions,
        keyframes: [
          { transform: 'translateX(8%)' },
          { transform: 'translateX(-8%)' },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgPan(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - right', () => {
    const direction = 'right';
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction } as BgPan,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: 'translateX(-8%)' },
          { transform: 'translateX(8%)' },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgPan(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom speed', () => {
    const speed = 0.5;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { speed } as BgPan,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          { transform: 'translateX(16%)' },
          { transform: 'translateX(-16%)' },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgPan(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
