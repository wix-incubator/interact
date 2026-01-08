import { describe, expect, test } from 'vitest';

import * as GlitchIn from '../GlitchIn';
import { baseMockOptions } from './testUtils';
import type { GlitchIn as GlitchInType, AnimationData } from '../../../types';

describe('GlitchIn', () => {
  test('GlitchIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GlitchInType,
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
            transform:
              'translate(-100%, 0%) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            opacity: 'var(--comp-opacity, 1)',
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlitchIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GlitchIn animation not mutating options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {
        startFromOffScreen: true,
      } as GlitchInType,
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
            transform:
              'translate(calc(calc((-1 * var(--motion-left, 0px) - 100%) / -1) * -1), calc(calc((-1 * var(--motion-left, 0px) - 100%) / -1) * 0)) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            opacity: 'var(--comp-opacity, 1)',
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlitchIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);

    const result2 = GlitchIn.web(mockOptions);

    expect(result2).toMatchObject(expectedResult);
  });

  test('GlitchIn animation with custom direction and distance', () => {
    const easing = 'linear';
    const direction = 45;
    const distance = { value: 200, type: 'px' };
    const mockOptions = {
      ...baseMockOptions,
      easing,
      namedEffect: {
        direction,
        distance,
      } as GlitchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing,
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
              'translate(141px, -141px) rotate(var(--comp-rotate-z, 0deg))',
          },
          {
            opacity: 'var(--comp-opacity, 1)',
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlitchIn.web(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GlitchIn style animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {} as GlitchInType,
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
            opacity: 'var(--comp-opacity, 1)',
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlitchIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });

  test('GlitchIn style animation not mutating options', () => {
    const mockOptions = {
      ...baseMockOptions,
      namedEffect: {
        startFromOffScreen: true,
      } as GlitchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing: 'quintInOut',
        name: 'motion-glideIn',
        custom: {
          '--motion-translate-x':
            'calc(calc((-1 * var(--motion-left, 0px) - 100%) / -1) * -1)',
          '--motion-translate-y':
            'calc(calc((-1 * var(--motion-left, 0px) - 100%) / -1) * 0)',
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
            opacity: 'var(--comp-opacity, 1)',
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlitchIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);

    const result2 = GlitchIn.style?.(mockOptions);

    expect(result2).toMatchObject(expectedResult);
  });

  test('GlitchIn style animation with custom direction and distance', () => {
    const easing = 'linear';
    const direction = 45;
    const distance = { value: 200, type: 'px' };
    const mockOptions = {
      ...baseMockOptions,
      easing,
      namedEffect: {
        direction,
        distance,
      } as GlitchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        easing,
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
            opacity: 'var(--comp-opacity, 1)',
            transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
          },
        ],
      },
    ];

    const result = GlitchIn.style?.(mockOptions);

    expect(result).toMatchObject(expectedResult);
  });
});
