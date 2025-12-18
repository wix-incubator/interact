import { describe, expect, test } from 'vitest';

import { scrollAnimations } from '../index';
import { GrowScroll, ScrubAnimationOptions } from '../../../types';
import { baseMockOptions } from './testUtils';

describe('GrowScroll', () => {
  test('default values', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {} as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - soft', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'soft' } as GrowScroll,
    };

    const expectedResult = [
      {
        startOffsetAdd: '0vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(0.8) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - medium', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'medium' } as GrowScroll,
    };

    const expectedResult = [
      {
        startOffsetAdd: '-0.75vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(-30vh) translate(0%, 0%) scale(0.3) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom power - hard', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { power: 'hard' } as GrowScroll,
    };

    const expectedResult = [
      {
        startOffsetAdd: '-1vh',
        endOffsetAdd: '0px',
        keyframes: [
          {
            transform:
              'translateY(-40vh) translate(0%, 0%) scale(0) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
          {
            transform:
              'translateY(0vh) translate(0%, 0%) scale(1) translate(0%, 0%) rotate(var(--comp-rotate-z, 0))',
          },
        ],
      },
    ];

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom range - out', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { range: 'out' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top-right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top-right' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - bottom-left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'bottom-left' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - bottom-right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'bottom-right' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top-left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top-left' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - bottom', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'bottom' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - top', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'top' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - left', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'left' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom direction - right', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('custom speed', () => {
    const mockOptions: ScrubAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { speed: 0.5 } as GrowScroll,
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

    const result = scrollAnimations?.GrowScroll?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
