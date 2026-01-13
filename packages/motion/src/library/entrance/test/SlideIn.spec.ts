import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import { baseMockOptions } from './testUtils';
import type { SlideIn, AnimationData } from '../../../types';

describe('SlideIn', () => {
  test('SlideIn animation with default options', () => {
    const power = 'medium';
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { power } as SlideIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-slideIn',
        easing: 'cubicInOut',
        custom: {
          '--motion-clip-start': 'polygon(0% 0%, 20% 0%, 20% 100%, 0% 100%)',
          '--motion-translate-x': '-100%',
          '--motion-translate-y': '0%',
        },
        keyframes: [
          {
            transform:
              'rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-translate-x, -100%), var(--motion-translate-y, 0%))',
            clipPath: 'var(--motion-clip-start, polygon(0% 0%, 20% 0%, 20% 100%, 0% 100%))',
          },
          {
            transform: 'rotate(var(--comp-rotate-z, 0deg)) translate(0px, 0px)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
      {
        name: 'motion-fadeIn',
        easing: 'cubicInOut',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
    ];

    const result = entranceAnimations.SlideIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('SlideIn animation with custom direction and power', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right', power: 'hard' } as SlideIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-slideIn',
        easing: 'cubicInOut',
        custom: {
          '--motion-clip-start': 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          '--motion-translate-x': '100%',
          '--motion-translate-y': '0%',
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
            transform:
              'rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-translate-x, -100%), var(--motion-translate-y, 0%))',
            clipPath: 'var(--motion-clip-start, polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%))',
          },
          {
            transform: 'rotate(var(--comp-rotate-z, 0deg)) translate(0px, 0px)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.SlideIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('SlideIn style with default options', () => {
    const power = 'medium';
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { power } as SlideIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-slideIn',
        easing: 'cubicInOut',
        custom: {
          '--motion-clip-start': 'polygon(0% 0%, 20% 0%, 20% 100%, 0% 100%)',
          '--motion-translate-x': '-100%',
          '--motion-translate-y': '0%',
        },
        keyframes: [
          {
            transform:
              'rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-translate-x, -100%), var(--motion-translate-y, 0%))',
            clipPath: 'var(--motion-clip-start, polygon(0% 0%, 20% 0%, 20% 100%, 0% 100%))',
          },
          {
            transform: 'rotate(var(--comp-rotate-z, 0deg)) translate(0px, 0px)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
      {
        name: 'motion-fadeIn',
        easing: 'cubicInOut',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
    ];

    const result = entranceAnimations.SlideIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('SlideIn style with custom direction and power', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right', power: 'hard' } as SlideIn,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-slideIn',
        easing: 'cubicInOut',
        custom: {
          '--motion-clip-start': 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          '--motion-translate-x': '100%',
          '--motion-translate-y': '0%',
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
            transform:
              'rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-translate-x, -100%), var(--motion-translate-y, 0%))',
            clipPath: 'var(--motion-clip-start, polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%))',
          },
          {
            transform: 'rotate(var(--comp-rotate-z, 0deg)) translate(0px, 0px)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.SlideIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
