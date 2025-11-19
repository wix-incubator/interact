import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { GrowIn, AnimationData } from '../../../types';

describe('GrowIn', () => {
  test('GrowIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GrowIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        keyframes: [
          { offset: 0, opacity: 0 },
          { opacity: 'var(--comp-opacity, 1)' },
        ],
      },
      {
        easing: 'cubicInOut',
        keyframes: [
          {
            transform:
              'translate(0%, -120%) rotate(var(--comp-rotate-z, 0deg)) scale(0)',
          },
          {
            transform:
              'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = entranceAnimations.GrowIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GrowIn animation with custom direction and power', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 45, power: 'hard' } as GrowIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        keyframes: [
          { offset: 0, opacity: 0 },
          { opacity: 'var(--comp-opacity, 1)' },
        ],
      },
      {
        easing: 'cubicInOut',
        keyframes: [
          {
            transform:
              'translate(84%, -84%) rotate(var(--comp-rotate-z, 0deg)) scale(0)',
          },
          {
            transform:
              'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = entranceAnimations.GrowIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GrowIn style animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GrowIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [
          { offset: 0, opacity: 0 },
          { opacity: 'var(--comp-opacity, 1)' },
        ],
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
            transform:
              'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = entranceAnimations.GrowIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GrowIn style animation with custom direction and power', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 45, power: 'hard' } as GrowIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'cubicInOut',
        name: 'motion-fadeIn',
        custom: {},
        keyframes: [
          { offset: 0, opacity: 0 },
          { opacity: 'var(--comp-opacity, 1)' },
        ],
      },
      {
        easing: 'cubicInOut',
        name: 'motion-growIn',
        custom: {
          '--motion-translate-x': '84%',
          '--motion-translate-y': '-84%',
          '--motion-scale': '0',
        },
        keyframes: [
          {
            transform:
              'translate(var(--motion-translate-x), var(--motion-translate-y)) rotate(var(--comp-rotate-z, 0deg)) scale(var(--motion-scale))',
          },
          {
            transform:
              'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
          },
        ],
      },
    ];

    const result = entranceAnimations.GrowIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
