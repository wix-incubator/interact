import { describe, expect, test } from 'vitest';

import BlurScroll from '../BlurScroll';
import type { BlurScroll as BlurScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('BlurScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as BlurScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        keyframes: [
          {
            filter: 'blur(6px)',
          },
          {
            filter: 'blur(0px)',
          },
        ],
      },
    ];

    const result = BlurScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom blur value', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { blur: 10 } as BlurScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            filter: 'blur(10px)',
          },
          {
            filter: 'blur(0px)',
          },
        ],
      },
    ];

    const result = BlurScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as BlurScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            filter: 'blur(6px)',
          },
          {
            filter: 'blur(0px)',
          },
        ],
      },
    ];

    const result = BlurScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - medium', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'medium' } as BlurScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            filter: 'blur(25px)',
          },
          {
            filter: 'blur(0px)',
          },
        ],
      },
    ];

    const result = BlurScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - hard', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'hard' } as BlurScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            filter: 'blur(50px)',
          },
          {
            filter: 'blur(0px)',
          },
        ],
      },
    ];

    const result = BlurScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as BlurScrollType,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            filter: 'blur(0px)',
          },
          {
            filter: 'blur(6px)',
          },
        ],
      },
    ];

    const result = BlurScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      fill: 'both',
      namedEffect: { range: 'continuous' } as BlurScrollType,
    };

    const expectedResult = [
      {
        fill: 'both',
        keyframes: [
          {
            filter: 'blur(6px)',
          },
          {
            filter: 'blur(0px)',
          },
        ],
      },
    ];

    const result = BlurScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
