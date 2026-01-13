import { describe, expect, test } from 'vitest';

import TurnScroll from '../TurnScroll';
import type { TurnScroll as TurnScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('TurnScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as TurnScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        easing: 'linear',
        keyframes: [
          {
            transform:
              'translateX(calc(100vw - var(--motion-left, 0px))) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -45deg))',
          },
          {
            transform: 'translateX(0px) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = TurnScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as TurnScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateX(calc(100vw - var(--motion-left, 0px))) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -45deg))',
          },
          {
            transform: 'translateX(0px) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = TurnScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom spin - counter-clockwise', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { spin: 'counter-clockwise' } as TurnScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateX(calc(100vw - var(--motion-left, 0px))) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 45deg))',
          },
          {
            transform: 'translateX(0px) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = TurnScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'left' } as TurnScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateX(calc(-1 * var(--motion-left, calc(100vw - 100%)) - 100%)) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -45deg))',
          },
          {
            transform: 'translateX(0px) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = TurnScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom scale', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { scale: 0.5 } as TurnScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateX(calc(100vw - var(--motion-left, 0px))) scale(0.5) rotate(calc(var(--comp-rotate-z, 0deg) + -45deg))',
          },
          {
            transform: 'translateX(0px) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
        ],
      },
    ];

    const result = TurnScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as TurnScrollType,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            transform: 'translateX(0px) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 0deg))',
          },
          {
            transform:
              'translateX(calc(-1 * var(--motion-left, calc(100vw - 100%)) - 100%)) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 45deg))',
          },
        ],
      },
    ];

    const result = TurnScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'continuous' } as TurnScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateX(calc(100vw - var(--motion-left, 0px))) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + -45deg))',
          },
          {
            transform:
              'translateX(calc(-1 * var(--motion-left, calc(100vw - 100%)) - 100%)) scale(1) rotate(calc(var(--comp-rotate-z, 0deg) + 45deg))',
          },
        ],
      },
    ];

    const result = TurnScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
