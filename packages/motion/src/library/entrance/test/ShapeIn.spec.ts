import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { ShapeIn, AnimationData } from '../../../types';

describe('ShapeIn', () => {
  test('ShapeIn animation with default options', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: {} as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: duration * 0.8,
      },
      {
        easing: 'cubicInOut',
        keyframes: [{ clipPath: 'inset(50%)' }, { clipPath: 'inset(0%)' }],
      },
    ];

    const result = entranceAnimations.ShapeIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn animation with circle', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'circle' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        keyframes: [{ clipPath: 'circle(0%)' }, { clipPath: 'circle(75%)' }],
      },
    ];

    const result = entranceAnimations.ShapeIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn animation with diamond', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'diamond' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        keyframes: [
          { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
          { clipPath: 'polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)' },
        ],
      },
    ];

    const result = entranceAnimations.ShapeIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
  test('ShapeIn animation with window', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'window' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        keyframes: [
          { clipPath: 'inset(50% round 50% 50% 0% 0%)' },
          { clipPath: 'inset(-20% round 50% 50% 0% 0%)' },
        ],
      },
    ];

    const result = entranceAnimations.ShapeIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn animation with ellipse', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'ellipse' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {},
      {
        keyframes: [{ clipPath: 'ellipse(0% 0%)' }, { clipPath: 'ellipse(75% 75%)' }],
      },
    ];

    const result = entranceAnimations.ShapeIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn style with default options', () => {
    const duration = 1000;
    const mockOptions = {
      ...baseMockOptions,
      duration,
      namedEffect: {} as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        easing: 'quadOut',
        duration: duration * 0.8,
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-shapeIn',
        easing: 'cubicInOut',
        custom: {
          '--motion-shape-start': 'inset(50%)',
          '--motion-shape-end': 'inset(0%)',
        },
        keyframes: [
          { clipPath: 'var(--motion-shape-start)' },
          { clipPath: 'var(--motion-shape-end)' },
        ],
      },
    ];

    const result = entranceAnimations.ShapeIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn style with circle', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'circle' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-shapeIn',
        custom: {
          '--motion-shape-start': 'circle(0%)',
          '--motion-shape-end': 'circle(75%)',
        },
        keyframes: [
          { clipPath: 'var(--motion-shape-start)' },
          { clipPath: 'var(--motion-shape-end)' },
        ],
      },
    ];

    const result = entranceAnimations.ShapeIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn style with diamond', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'diamond' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-shapeIn',
        custom: {
          '--motion-shape-start': 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          '--motion-shape-end': 'polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)',
        },
        keyframes: [
          { clipPath: 'var(--motion-shape-start)' },
          { clipPath: 'var(--motion-shape-end)' },
        ],
      },
    ];

    const result = entranceAnimations.ShapeIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn style with window', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'window' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-shapeIn',
        custom: {
          '--motion-shape-start': 'inset(50% round 50% 50% 0% 0%)',
          '--motion-shape-end': 'inset(-20% round 50% 50% 0% 0%)',
        },
        keyframes: [
          { clipPath: 'var(--motion-shape-start)' },
          { clipPath: 'var(--motion-shape-end)' },
        ],
      },
    ];

    const result = entranceAnimations.ShapeIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('ShapeIn style with ellipse', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { shape: 'ellipse' } as ShapeIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-shapeIn',
        custom: {
          '--motion-shape-start': 'ellipse(0% 0%)',
          '--motion-shape-end': 'ellipse(75% 75%)',
        },
        keyframes: [
          { clipPath: 'var(--motion-shape-start)' },
          { clipPath: 'var(--motion-shape-end)' },
        ],
      },
    ];

    const result = entranceAnimations.ShapeIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
