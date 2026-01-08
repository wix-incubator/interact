import { describe, expect, test } from 'vitest';

import ShrinkScroll from '../ShrinkScroll';
import type { ShrinkScroll as ShrinkScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('ShrinkScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as ShrinkScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        easing: 'linear',
        startOffsetAdd: '0vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1.2) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as ShrinkScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '0vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1.2) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - medium', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'medium' } as ShrinkScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '-0.5vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(-20vh) translate(0%, 0%) scale(1.7) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - hard', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'hard' } as ShrinkScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '-1vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(-40vh) translate(0%, 0%) scale(3.5) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as ShrinkScrollType,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        startOffsetAdd: '0px',
        endOffsetAdd: '0vh',
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(0.8) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top-right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top-right' } as ShrinkScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(50%, -50%) scale(1.2) translate(-50%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(50%, -50%) scale(1) translate(-50%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom scale', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { scale: 1.5 } as ShrinkScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1.5) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom speed', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { speed: 0.5 } as ShrinkScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '-20vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(-20vh) translate(0%, 0%) scale(1.2) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = ShrinkScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
