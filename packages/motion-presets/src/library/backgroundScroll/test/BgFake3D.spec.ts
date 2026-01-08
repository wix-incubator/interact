import { describe, expect, test } from 'vitest';

import BgFake3D from '../BgFake3D';
import { baseMockOptions } from './testUtils';
import type {
  BgFake3D as BgFake3DType,
  AnimationData,
} from '../../../types';

describe('BgFake3D', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgFake3DType,
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

    const result = BgFake3D(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom values', () => {
    const stretch = 1.5;
    const zoom = 30;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { stretch, zoom } as BgFake3DType,
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

    const result = BgFake3D(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
