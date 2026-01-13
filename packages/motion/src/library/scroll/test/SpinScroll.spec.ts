import { describe, expect, test } from 'vitest';

import { scrollAnimations } from '../index';
import { SpinScroll, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('SpinScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as SpinScroll,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        easing: 'linear',
        keyframes: [
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -54deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom spins', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { spins: 0.5 } as SpinScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -180deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom scale', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { scale: 0.5 } as SpinScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'scale(0.5) rotate(calc(var(--comp-rotate-z, 0deg) + -54deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - counter-clockwise', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'counter-clockwise' } as SpinScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 54deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as SpinScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -54deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - medium', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'medium' } as SpinScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'scale(0.7) rotate(calc(var(--comp-rotate-z, 0deg) + -54deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - hard', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'hard' } as SpinScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'scale(0.4) rotate(calc(var(--comp-rotate-z, 0deg) + -54deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as SpinScroll,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 54deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'continuous' } as SpinScroll,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -27deg))',
          },
          {
            transform: 'scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 27deg))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.SpinScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
