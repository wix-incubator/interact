import { describe, expect, test } from 'vitest';

import PanScroll from '../PanScroll';
import type { PanScroll as PanScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('PanScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as PanScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        keyframes: [
          {
            transform:
              'translateX(calc(var(--motion-left, calc(100vw - 100%)) * -1 - 100%)) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translateX(0) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = PanScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom distance', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {
        distance: { value: 200, type: 'percentage' },
      } as PanScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateX(calc(var(--motion-left, calc(100vw - 100%)) * -1 - 100%)) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translateX(0) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = PanScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as PanScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateX(calc(100vw - var(--motion-left, 0px))) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translateX(0) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = PanScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as PanScrollType,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            transform: 'translateX(0) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateX(calc(var(--motion-left, calc(100vw - 100%)) * -1 - 100%)) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = PanScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      fill: 'both',
      namedEffect: { range: 'continuous' } as PanScrollType,
    };

    const expectedResult = [
      {
        fill: 'both',
        keyframes: [
          {
            transform:
              'translateX(calc(var(--motion-left, calc(100vw - 100%)) * -1 - 100%)) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateX(calc(100vw - var(--motion-left, 0px))) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = PanScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('startFromOffScreen - false', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {
        startFromOffScreen: false,
      } as PanScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform: 'translateX(-400px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translateX(0) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = PanScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
