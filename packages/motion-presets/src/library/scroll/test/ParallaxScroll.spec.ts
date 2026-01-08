import { describe, expect, test } from 'vitest';

import ParallaxScroll from '../ParallaxScroll';
import type { ParallaxScroll as ParallaxScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('ParallaxScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as ParallaxScrollType,
    };

    const expectedResult = [
      {
        fill: 'both',
        easing: 'linear',
        startOffsetAdd: '-25vh',
        endOffsetAdd: '25vh',
        keyframes: [
          {
            transform: 'translateY(-25vh) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translateY(25vh) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ParallaxScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom speed', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { speed: 0.75 } as ParallaxScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '-37.5vh',
        endOffsetAdd: '37.5vh',
        keyframes: [
          {
            transform: 'translateY(-37.5vh) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translateY(37.5vh) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ParallaxScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
