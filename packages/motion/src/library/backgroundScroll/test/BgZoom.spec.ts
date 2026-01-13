import { describe, expect, test } from 'vitest';

import { backgroundScrollAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { BackgroundScrollAnimation, AnimationData } from '../../../types';

describe('BgZoom', () => {
  test('Default values', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { type: 'BgZoom' } as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        keyframes: [
          {
            transform: `translateY(20svh)`,
          },
          {
            transform: `translateY(calc(calc(-0.2 * var(--motion-comp-height, 0px) + 0.5 * 0.4 * max(0px, 100lvh - var(--motion-comp-height, 0px))) * 1.67))`,
          },
        ],
      },
      {
        part: 'BG_IMG',
        composite: 'add',
        keyframes: [
          {
            transform: `perspective(100px) translateZ(0px)`,
          },
          {
            transform: `perspective(100px) translateZ(40px)`,
          },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgZoom(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom zoom', () => {
    const zoom = 40;
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { zoom, type: 'BgZoom' } as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        keyframes: [
          {
            transform: `translateY(20svh)`,
          },
          {
            transform: `translateY(calc(calc(-0.2 * var(--motion-comp-height, 0px) + 0.5 * 0.4 * max(0px, 100lvh - var(--motion-comp-height, 0px))) * 1.67))`,
          },
        ],
      },
      {
        part: 'BG_IMG',
        composite: 'add',
        keyframes: [
          {
            transform: `perspective(100px) translateZ(0px)`,
          },
          {
            transform: `perspective(100px) translateZ(40px)`,
          },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgZoom(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('Custom direction - out', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'out', type: 'BgZoom' } as BackgroundScrollAnimation,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        keyframes: [
          {
            transform: `translateY(0px)`,
          },
          {
            transform: `translateY(calc(0px * 0.87))`,
          },
        ],
      },
      {
        part: 'BG_IMG',
        composite: 'replace',
        keyframes: [
          {
            transform: `perspective(100px) translateZ(11.54px)`,
          },
          {
            transform: `perspective(100px) translateZ(-15px)`,
          },
        ],
      },
    ];

    const result = backgroundScrollAnimations.BgZoom(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
