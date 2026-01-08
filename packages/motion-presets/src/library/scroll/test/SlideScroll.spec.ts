import { describe, expect, test } from 'vitest';

import SlideScroll from '../SlideScroll';
import type { SlideScroll as SlideScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('SlideScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as SlideScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 100%)',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 0)',
          },
        ],
      },
    ];

    const result = SlideScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'left' } as SlideScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(-100%, 0)',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 0)',
          },
        ],
      },
    ];

    const result = SlideScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as SlideScrollType,
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
            clipPath:
              'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 100%)',
          },
        ],
      },
    ];

    const result = SlideScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'continuous' } as SlideScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            clipPath:
              'var(--motion-clip-from, polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 100%)',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, 0)',
          },
          {
            clipPath:
              'var(--motion-clip-to, polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%))',
            transform: 'rotate(var(--comp-rotate-z, 0)) translate(0, -100%)',
          },
        ],
      },
    ];

    const result = SlideScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
