import { describe, expect, test } from 'vitest';

import * as RevealIn from '../RevealIn';
import { baseMockOptions } from './testUtils';
import type { RevealIn as RevealInType, AnimationData } from '../../../types';

describe('RevealIn', () => {
  test('RevealIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as RevealInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        keyframes: [
          {
            offset: 0,
            opacity: 0,
            easing: 'step-end',
          },
          {
            offset: 0.000001,
            opacity: 'var(--comp-opacity, 1)',
            clipPath:
              'var(--motion-clip-start, polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%))',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
    ];

    const result = RevealIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('RevealIn animation with custom direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as RevealInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        keyframes: [
          {
            offset: 0,
            opacity: 0,
            easing: 'step-end',
          },
          {
            offset: 0.000001,
            opacity: 'var(--comp-opacity, 1)',
            clipPath:
              'var(--motion-clip-start, polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%))',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
    ];

    const result = RevealIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('RevealIn style with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as RevealInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        custom: {
          '--motion-clip-start': 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        },
        keyframes: [
          {
            offset: 0,
            opacity: 0,
            easing: 'step-end',
          },
          {
            offset: 0.000001,
            opacity: 'var(--comp-opacity, 1)',
            clipPath:
              'var(--motion-clip-start, polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%))',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
    ];

    const result = RevealIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('RevealIn style with custom direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as RevealInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        custom: {
          '--motion-clip-start':
            'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
        },
        keyframes: [
          {
            offset: 0,
            opacity: 0,
            easing: 'step-end',
          },
          {
            offset: 0.000001,
            opacity: 'var(--comp-opacity, 1)',
            clipPath:
              'var(--motion-clip-start, polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%))',
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
    ];

    const result = RevealIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
