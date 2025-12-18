import { describe, expect, test } from 'vitest';

import { scrollAnimations } from '../index';
import { RevealScroll, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('RevealScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as RevealScroll,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        easing: 'linear',
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
          },
          {
            clipPath:
              'var(--motion-clip-to, polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.RevealScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'left' } as RevealScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%))',
          },
          {
            clipPath:
              'var(--motion-clip-to, polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.RevealScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as RevealScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%))',
          },
          {
            clipPath:
              'var(--motion-clip-to, polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.RevealScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top' } as RevealScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%))',
          },
          {
            clipPath:
              'var(--motion-clip-to, polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.RevealScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as RevealScroll,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%))',
          },
          {
            clipPath:
              'var(--motion-clip-to, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.RevealScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'continuous' } as RevealScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
          {
            clipPath:
              'var(--motion-clip-to, polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.RevealScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
