import { describe, expect, test } from 'vitest';

import { scrollAnimations } from '../index';
import { FadeScroll, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('FadeScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as FadeScroll,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        easing: 'linear',
        keyframes: [
          {
            opacity: 0,
          },
          {
            opacity: 'var(--comp-opacity, 1)',
          },
        ],
      },
    ];

    const result = scrollAnimations?.FadeScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom opacity', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { opacity: 0.5 } as FadeScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            opacity: 0.5,
          },
          {
            opacity: 'var(--comp-opacity, 1)',
          },
        ],
      },
    ];

    const result = scrollAnimations?.FadeScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as FadeScroll,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            opacity: 'var(--comp-opacity, 1)',
          },
          {
            opacity: 0,
          },
        ],
      },
    ];

    const result = scrollAnimations?.FadeScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      fill: 'both',
      namedEffect: { range: 'continuous' } as FadeScroll,
    };

    const expectedResult = [
      {
        fill: 'both',
        keyframes: [
          {
            opacity: 0,
          },
          {
            opacity: `var(--comp-opacity, 1)`,
          },
        ],
      },
    ];

    const result = scrollAnimations?.FadeScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
