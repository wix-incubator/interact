import { describe, expect, test } from 'vitest';

import * as GlideIn from '../GlideIn';
import { baseMockOptions } from './testUtils';
import type { GlideIn as GlideInType, AnimationData } from '../../../types';

describe('GlideIn', () => {
  test('GlideIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GlideInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'quintInOut',
        keyframes: [
          {
            offset: 0,
            opacity: 0,
            easing: 'step-end',
          },
          {
            offset: 0.000001,
            opacity: 'var(--comp-opacity, 1)',
            transform: 'translate(-100%, 0%) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlideIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GlideIn animation with custom direction and distance', () => {
    const direction = 45;
    const distance = { value: 200, type: 'px' };
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction, distance } as GlideInType,
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
            transform: 'translate(141px, -141px) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlideIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GlideIn style animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GlideInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'quintInOut',
        name: 'motion-glideIn',
        custom: {
          '--motion-translate-x': '-100%',
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
              'translate(var(--motion-translate-x), var(--motion-translate-y)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlideIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GlideIn style animation with custom direction and distance', () => {
    const direction = 45;
    const distance = { value: 200, type: 'px' };
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: { direction, distance } as GlideInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-glideIn',
        custom: {
          '--motion-translate-x': '141px',
          '--motion-translate-y': '-141px',
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
              'translate(var(--motion-translate-x), var(--motion-translate-y)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlideIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
