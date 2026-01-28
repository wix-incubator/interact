import { describe, expect, test } from 'vitest';

import GrowScroll from '../GrowScroll';
import type { GrowScroll as GrowScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('GrowScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as GrowScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        startOffsetAdd: '0vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(0) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as GrowScrollType,
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
              'translateY(0vh) translate(0%, 0%) scale(4) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top-right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top-right' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(50%, -50%) scale(0) translate(-50%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(50%, -50%) scale(1) translate(-50%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - bottom-left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'bottom-left' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(-50%, 50%) scale(0) translate(50%, -50%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(-50%, 50%) scale(1) translate(50%, -50%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - bottom-right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'bottom-right' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(50%, 50%) scale(0) translate(-50%, -50%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(50%, 50%) scale(1) translate(-50%, -50%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top-left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top-left' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(-50%, -50%) scale(0) translate(50%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(-50%, -50%) scale(1) translate(50%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - bottom', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'bottom' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, 50%) scale(0) translate(0%, -50%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 50%) scale(1) translate(0%, -50%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, -50%) scale(0) translate(0%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, -50%) scale(1) translate(0%, 50%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'left' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(-50%, 0%) scale(0) translate(50%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(-50%, 0%) scale(1) translate(50%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as GrowScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(50%, 0%) scale(0) translate(-50%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(50%, 0%) scale(1) translate(-50%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom speed', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { speed: 0.5 } as GrowScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '-20vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(-20vh) translate(0%, 0%) scale(0) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = GrowScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
