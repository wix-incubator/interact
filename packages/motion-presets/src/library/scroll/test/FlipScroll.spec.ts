import { describe, expect, test } from 'vitest';

import FlipScroll from '../FlipScroll';
import type { FlipScroll as FlipScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('FlipScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as FlipScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'perspective(800px) rotateY(-240deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateY(240deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom rotate value', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { rotate: 180 } as FlipScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'perspective(800px) rotateY(-180deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateY(180deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - vertical', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'vertical' } as FlipScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'perspective(800px) rotateX(-240deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateX(240deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as FlipScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'perspective(800px) rotateY(-60deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateY(60deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - medium', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'medium' } as FlipScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'perspective(800px) rotateY(-120deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateY(120deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - hard', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'hard' } as FlipScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'perspective(800px) rotateY(-420deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateY(420deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - in', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'in' } as FlipScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        keyframes: [
          {
            transform:
              'perspective(800px) rotateY(-240deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateY(0deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as FlipScrollType,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        keyframes: [
          {
            transform:
              'perspective(800px) rotateY(0deg) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform:
              'perspective(800px) rotateY(240deg) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = FlipScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
