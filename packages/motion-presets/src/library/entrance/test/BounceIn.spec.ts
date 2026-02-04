import { describe, expect, test } from 'vitest';

import * as BounceIn from '../BounceIn';
import { baseMockOptions } from './testUtils';
import type { BounceIn as BounceInType, AnimationData } from '../../../types';

describe('BounceIn', () => {
  test('BounceIn animation with default options', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: {} as BounceInType,
    };

    const result = BounceIn.web(mockOptions);

    // Check structure: fadeIn first, then bounceIn
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      duration: expect.any(Number),
    });
    expect(result[1]).toMatchObject({
      easing: 'linear',
      keyframes: expect.arrayContaining([
        expect.objectContaining({
          offset: 0,
          transform: expect.stringContaining('translate3d'),
        }),
      ]),
    });
  });

  test('BounceIn animation with custom distance factor', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { distanceFactor: 2 } as BounceInType,
    };

    const result = BounceIn.web(mockOptions);

    expect(result).toHaveLength(2);
    expect(result[1].keyframes[1].transform).toContain('2');
  });

  test('BounceIn animation with top direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'top' } as BounceInType,
    };

    const result = BounceIn.web(mockOptions);

    expect(result).toHaveLength(2);
    expect(result[1].keyframes[1].transform).toContain('-1');
  });

  test('BounceIn animation with right direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'right' } as BounceInType,
    };

    const result = BounceIn.web(mockOptions);

    expect(result).toHaveLength(2);
  });

  test('BounceIn animation with left direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'left' } as BounceInType,
    };

    const result = BounceIn.web(mockOptions);

    expect(result).toHaveLength(2);
    expect(result[1].keyframes[1].transform).toContain('-1');
  });

  test('BounceIn animation with center direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'center' } as BounceInType,
    };

    const result = BounceIn.web(mockOptions);

    expect(result).toHaveLength(2);
    expect(result[1].keyframes[1].transform).toContain('perspective');
  });
});

describe('BounceIn style method', () => {
  test('BounceIn style with default options', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: {} as BounceInType,
    };

    const result = BounceIn.style?.(mockOptions);

    expect(result).toHaveLength(2);
    expect(result![0]).toMatchObject({
      name: 'motion-fadeIn',
      easing: 'quadOut',
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, {}],
    });
    expect(result![1]).toMatchObject({
      name: 'motion-bounceIn',
      easing: 'linear',
      custom: {
        '--motion-direction-x': 0,
        '--motion-direction-y': 1,
        '--motion-direction-z': 0,
        '--motion-distance-factor': 1,
        '--motion-perspective': ' ',
      },
    });
  });

  test('BounceIn style with custom distance factor', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { distanceFactor: 2 } as BounceInType,
    };

    const result = BounceIn.style?.(mockOptions);

    expect(result![1].custom).toMatchObject({
      '--motion-distance-factor': 2,
    });
  });

  test('BounceIn style with top direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'top' } as BounceInType,
    };

    const result = BounceIn.style?.(mockOptions);

    expect(result![1].custom).toMatchObject({
      '--motion-direction-x': 0,
      '--motion-direction-y': -1,
      '--motion-direction-z': 0,
    });
  });

  test('BounceIn style with right direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'right' } as BounceInType,
    };

    const result = BounceIn.style?.(mockOptions);

    expect(result![1].custom).toMatchObject({
      '--motion-direction-x': 1,
      '--motion-direction-y': 0,
      '--motion-direction-z': 0,
    });
  });

  test('BounceIn style with left direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'left' } as BounceInType,
    };

    const result = BounceIn.style?.(mockOptions);

    expect(result![1].custom).toMatchObject({
      '--motion-direction-x': -1,
      '--motion-direction-y': 0,
      '--motion-direction-z': 0,
    });
  });

  test('BounceIn style with center direction', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: { direction: 'center' } as BounceInType,
    };

    const result = BounceIn.style?.(mockOptions);

    expect(result![1].custom).toMatchObject({
      '--motion-direction-x': 0,
      '--motion-direction-y': 0,
      '--motion-direction-z': -1,
      '--motion-perspective': 'perspective(800px)',
    });
  });
});
