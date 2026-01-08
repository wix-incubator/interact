import { describe, expect, test } from 'vitest';

import StretchScroll from '../StretchScroll';
import type { StretchScroll as StretchScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('StretchScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as StretchScrollType,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        easing: 'backInOut',
        keyframes: [
          {
            scale: '1 1',
            translate: '0 0',
          },
          {
            scale: '0.4 1.6',
            translate: '0 -60.00000000000001%',
          },
        ],
      },
      {
        fill: 'forwards',
        easing: 'backInOut',
        keyframes: [
          {
            opacity: 1,
            offset: 0.35,
          },
          {
            opacity: 0,
            offset: 1,
          },
        ],
      },
    ];

    const result = StretchScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as StretchScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            scale: '1 1',
            translate: '0 0',
          },
          {
            scale: '0.8 1.2',
            translate: '0 -19.999999999999996%',
          },
        ],
      },
      {},
    ];

    const result = StretchScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - medium', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'medium' } as StretchScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            scale: '1 1',
            translate: '0 0',
          },
          {
            scale: '0.6 1.5',
            translate: '0 -50%',
          },
        ],
      },
      {},
    ];

    const result = StretchScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - hard', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'hard' } as StretchScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            scale: '1 1',
            translate: '0 0',
          },
          {
            scale: '0.4 2',
            translate: '0 -100%',
          },
        ],
      },
      {},
    ];

    const result = StretchScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom stretch value', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { stretch: 0.8 } as StretchScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            scale: '1 1',
            translate: '0 0',
          },
          {
            scale: '0.19999999999999996 1.8',
            translate: '0 -80%',
          },
        ],
      },
      {
        keyframes: [
          {
            opacity: 1,
            offset: 0.35,
          },
          {
            opacity: 0,
            offset: 1,
          },
        ],
      },
    ];

    const result = StretchScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - in', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'in' } as StretchScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        keyframes: [
          {
            scale: '0.4 1.6',
            translate: '0 60.00000000000001%',
          },
          {
            scale: '1 1',
            translate: '0 0',
          },
        ],
      },
      {
        fill: 'backwards',
        keyframes: [
          {
            opacity: 0,
            offset: 0,
          },
          {
            opacity: 1,
            offset: 0.65,
          },
        ],
      },
    ];

    const result = StretchScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      fill: 'both',
      namedEffect: { range: 'continuous' } as StretchScrollType,
    };

    const expectedResult = [
      {
        fill: 'both',
        easing: 'linear',
        keyframes: [
          {
            scale: '0.4 1.6',
            translate: '0 60.00000000000001%',
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          },
          {
            scale: '1 1',
            translate: '0 0',
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          },
          {
            scale: '0.4 1.6',
            translate: '0 -60.00000000000001%',
          },
        ],
      },
      {
        fill: 'both',
        easing: 'linear',
        keyframes: [
          {
            opacity: 0,
            offset: 0,
          },
          {
            opacity: 1,
            offset: 0.325,
          },
          {
            opacity: 1,
            offset: 0.7,
          },
          {
            opacity: 0,
            offset: 1,
          },
        ],
      },
    ];

    const result = StretchScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
