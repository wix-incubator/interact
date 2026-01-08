import { describe, expect, test } from 'vitest';

import BgCloseUp from '../BgCloseUp';
import { baseMockOptions } from './testUtils';
import type {
  BgCloseUp as BgCloseUpType,
  AnimationData,
} from '../../../types';

describe('BgCloseUp', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as BgCloseUpType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      { ...baseMockOptions },
      {
        ...baseMockOptions,
        keyframes: [{}, { transform: `perspective(100px) translateZ(80px)` }],
      },
    ];

    const result = BgCloseUp(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom values', () => {
    const scale = 50;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { scale } as BgCloseUpType,
    };
    const expectedResult: Partial<AnimationData>[] = [
      { ...baseMockOptions },
      {
        ...baseMockOptions,
        keyframes: [{}, { transform: `perspective(100px) translateZ(50px)` }],
      },
    ];

    const result = BgCloseUp(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
