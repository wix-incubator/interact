import { describe, expect, test } from 'vitest';

import { scrollAnimations } from '../index';
import { SlideScroll, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('SlideScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as SlideScroll,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        keyframes: [
          {
            clipPath: 'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 100%)',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 0)',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SlideScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'left' } as SlideScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath: 'var(--motion-clip-from, polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(-100%, 0)',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 0)',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SlideScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as SlideScroll,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 0)',
          },
          {
            clipPath: 'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 100%)',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SlideScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'continuous' } as SlideScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath: 'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 100%)',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 0)',
          },
          {
            clipPath: 'var(--motion-clip-to, polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, -100%)',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SlideScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
