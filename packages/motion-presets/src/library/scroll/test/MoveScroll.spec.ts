import { describe, expect, test } from 'vitest';

import MoveScroll from '../MoveScroll';
import type { MoveScroll as MoveScrollType, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('MoveScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as MoveScrollType,
    };

    const expectedResult = [
      {
        fill: 'backwards',
        startOffsetAdd: '0px',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translate(-200px, 346px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom distance', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {
        distance: { value: 200, type: 'percentage' },
      } as MoveScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '0px',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform: 'translate(-100%, 173%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom angle', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { angle: 45 } as MoveScrollType,
    };

    const expectedResult = [
      {
        keyframes: [
          {
            transform:
              'translate(283px, -283px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as MoveScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '0px',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translate(-75px, 130px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - medium', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'medium' } as MoveScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '0px',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translate(-200px, 346px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - hard', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'hard' } as MoveScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '0px',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translate(-400px, 693px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as MoveScrollType,
    };

    const expectedResult = [
      {
        fill: 'forwards',
        startOffsetAdd: '0px',
        endOffsetAdd: '346.4101615137755px',
        keyframes: [
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translate(-200px, 346px) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - continuous', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'continuous' } as MoveScrollType,
    };

    const expectedResult = [
      {
        startOffsetAdd: '0px',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translate(-200px, 346px) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translate(200px, -346px) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = MoveScroll(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
