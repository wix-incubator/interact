import { describe, expect, test } from 'vitest';

import * as GrowIn from '../GrowIn';
import { baseMockOptions } from './testUtils';
import type { GrowIn as GrowInType, AnimationData } from '../../../types';

describe('GrowIn', () => {
  test('GrowIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GrowInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        easing: 'cubicInOut',
        keyframes: [
          {
            transform: 'translate(0%, -120%) rotate(var(--comp-rotate-z, 0deg)) scale(0)',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = GrowIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GrowIn animation with custom direction and scale', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 45, initialScale: 0.5, distance: { value: 100, type: 'percentage' } } as GrowInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        easing: 'cubicInOut',
        keyframes: [
          {
            transform: 'translate(70%, -70%) rotate(var(--comp-rotate-z, 0deg)) scale(0.5)',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = GrowIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GrowIn style animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GrowInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        easing: 'cubicInOut',
        name: 'motion-growIn',
        custom: {
          '--motion-translate-x': '0%',
          '--motion-translate-y': '-120%',
          '--motion-scale': '0',
        },
        keyframes: [
          {
            transform:
              'translate(var(--motion-translate-x), var(--motion-translate-y)) rotate(var(--comp-rotate-z, 0deg)) scale(var(--motion-scale))',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = GrowIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GrowIn style animation with custom direction and scale', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 45, initialScale: 0.5, distance: { value: 100, type: 'percentage' } } as GrowInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        easing: 'cubicInOut',
        name: 'motion-growIn',
        custom: {
          '--motion-translate-x': '70%',
          '--motion-translate-y': '-70%',
          '--motion-scale': '0.5',
        },
        keyframes: [
          {
            transform:
              'translate(var(--motion-translate-x), var(--motion-translate-y)) rotate(var(--comp-rotate-z, 0deg)) scale(var(--motion-scale))',
          },
          {
            transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = GrowIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
