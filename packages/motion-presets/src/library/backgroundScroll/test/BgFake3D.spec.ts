import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type {
  BackgroundScrollAnimation,
  AnimationData,
} from '../../../types';

describe('BgFake3D', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        ...baseMockOptions,
        keyframes: [
          { transform: 'translateY(10svh)' },
          {
            transform: `translateY(calc(-0.08 * var(--motion-comp-height, 0px)))`,
          },
        ],
      },
      {
        keyframes: [{ transform: `scaleY(1.3)` }, { transform: 'scaleY(1)' }],
      },
      {
        keyframes: [
          { transform: 'perspective(100px) translateZ(0px)' },
          { transform: `perspective(100px) translateZ(16.67px)` },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgFake3D(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom values', () => {
    const stretch = 1.5;
    const zoom = 30;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { stretch, zoom } as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        ...baseMockOptions,
        keyframes: [
          { transform: 'translateY(10svh)' },
          {
            transform: `translateY(calc(-0.06 * var(--motion-comp-height, 0px)))`,
          },
        ],
      },
      {
        keyframes: [{ transform: `scaleY(1.5)` }, { transform: 'scaleY(1)' }],
      },
      {
        keyframes: [
          { transform: 'perspective(100px) translateZ(0px)' },
          { transform: `perspective(100px) translateZ(30px)` },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgFake3D(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
