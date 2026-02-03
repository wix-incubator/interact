import { describe, expect, test } from 'vitest';

import * as PunchIn from '../PunchIn';
import { baseMockOptions } from './testUtils';
import type { PunchIn as PunchInType, AnimationData } from '../../../types';

describe('PunchIn', () => {
  test('PunchIn animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: {} as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: 300,
      },
      {
        keyframes: [
          {
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
            scale: '0',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 2 * 1) calc(var(--motion-height, 100%) * 1.1 / 2 * -1)',
          },
          {
            easing: 'linear',
            offset: 0.3,
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 1)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.45,
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.4)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.6265,
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.2)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.7726999999999999,
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.1)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.8623000000000001,
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.06)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9173,
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.03)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9511,
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.02)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9718000000000001,
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.01)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9845,
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.01)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 1,
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn animation with top-left direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: { direction: 'top-left' } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: 300,
      },
      {
        keyframes: [
          {
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
            scale: '0',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 2 * -1) calc(var(--motion-height, 100%) * 1.1 / 2 * -1)',
          },
          {
            easing: 'linear',
            offset: 0.3,
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 1)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.45,
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.4)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.6265,
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.2)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.7726999999999999,
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.1)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.8623000000000001,
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.06)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9173,
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.03)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9511,
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.02)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9718000000000001,
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.01)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9845,
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.01)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 1,
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn animation with bottom-right direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: { direction: 'bottom-right' } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: 300,
      },
      {
        keyframes: [
          {
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
            scale: '0',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 2 * 1) calc(var(--motion-height, 100%) * 1.1 / 2 * 1)',
          },
          {
            easing: 'linear',
            offset: 0.3,
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 1)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.45,
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.4)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.6265,
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.2)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.7726999999999999,
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.1)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.8623000000000001,
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.06)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9173,
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.03)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9511,
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.02)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9718000000000001,
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.01)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9845,
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.01)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 1,
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn animation with bottom-left direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: {
        direction: 'bottom-left',
      } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: 300,
      },
      {
        keyframes: [
          {
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
            scale: '0',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 2 * -1) calc(var(--motion-height, 100%) * 1.1 / 2 * 1)',
          },
          {
            easing: 'linear',
            offset: 0.3,
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 1)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.45,
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.4)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.6265,
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.2)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.7726999999999999,
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.1)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.8623000000000001,
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.06)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9173,
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.03)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9511,
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.02)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9718000000000001,
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.01)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9845,
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.01)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 1,
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn animation with center direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: {
        direction: 'center',
      } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        duration: 300,
      },
      {
        keyframes: [
          {
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
            scale: '0',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 2 * 0) calc(var(--motion-height, 100%) * 1.1 / 2 * 0)',
          },
          {
            easing: 'linear',
            offset: 0.3,
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 1)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.45,
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.4)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.6265,
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.2)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.7726999999999999,
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.1)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.8623000000000001,
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.06)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9173,
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.03)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9511,
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.02)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 0.9718000000000001,
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.01)',
          },
          {
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            offset: 0.9845,
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.01)',
          },
          {
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            offset: 1,
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn style animation with default options', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: {} as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: 300,
        easing: 'cubicIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-punchIn',
        easing: 'linear',
        custom: {
          '--motion-translate':
            'calc(var(--motion-width, 100%) * 1.1 / 2 * 1) calc(var(--motion-height, 100%) * 1.1 / 2 * -1)',
        },
        keyframes: [
          {
            translate: 'var(--motion-translate)',
            scale: '0',
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          },
          {
            offset: 0.3,
            easing: 'linear',
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 1)',
          },
          {
            offset: 0.45,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.4)',
          },
          {
            offset: 0.6265,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.2)',
          },
          {
            offset: 0.7726999999999999,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.1)',
          },
          {
            offset: 0.8623000000000001,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.06)',
          },
          {
            offset: 0.9173,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.03)',
          },
          {
            offset: 0.9511,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.02)',
          },
          {
            offset: 0.9718000000000001,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.01)',
          },
          {
            offset: 0.9845,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.01)',
          },
          {
            offset: 1,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn style animation with top-left direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: { direction: 'top-left' } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: 300,
        easing: 'cubicIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-punchIn',
        easing: 'linear',
        custom: {
          '--motion-translate':
            'calc(var(--motion-width, 100%) * 1.1 / 2 * -1) calc(var(--motion-height, 100%) * 1.1 / 2 * -1)',
        },
        keyframes: [
          {
            translate: 'var(--motion-translate)',
            scale: '0',
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          },
          {
            offset: 0.3,
            easing: 'linear',
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 1)',
          },
          {
            offset: 0.45,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.4)',
          },
          {
            offset: 0.6265,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.2)',
          },
          {
            offset: 0.7726999999999999,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.1)',
          },
          {
            offset: 0.8623000000000001,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.06)',
          },
          {
            offset: 0.9173,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.03)',
          },
          {
            offset: 0.9511,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.02)',
          },
          {
            offset: 0.9718000000000001,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * -0.01)',
          },
          {
            offset: 0.9845,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0.01)',
          },
          {
            offset: 1,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * -1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn style animation with bottom-right direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: { direction: 'bottom-right' } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: 300,
        easing: 'cubicIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-punchIn',
        easing: 'linear',
        custom: {
          '--motion-translate':
            'calc(var(--motion-width, 100%) * 1.1 / 2 * 1) calc(var(--motion-height, 100%) * 1.1 / 2 * 1)',
        },
        keyframes: [
          {
            translate: 'var(--motion-translate)',
            scale: '0',
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          },
          {
            offset: 0.3,
            easing: 'linear',
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 1)',
          },
          {
            offset: 0.45,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.4)',
          },
          {
            offset: 0.6265,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.2)',
          },
          {
            offset: 0.7726999999999999,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.1)',
          },
          {
            offset: 0.8623000000000001,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.06)',
          },
          {
            offset: 0.9173,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.03)',
          },
          {
            offset: 0.9511,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.02)',
          },
          {
            offset: 0.9718000000000001,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.01)',
          },
          {
            offset: 0.9845,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.01)',
          },
          {
            offset: 1,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn style animation with bottom-left direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: {
        direction: 'bottom-left',
      } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: 300,
        easing: 'cubicIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-punchIn',
        easing: 'linear',
        custom: {
          '--motion-translate':
            'calc(var(--motion-width, 100%) * 1.1 / 2 * -1) calc(var(--motion-height, 100%) * 1.1 / 2 * 1)',
        },
        keyframes: [
          {
            translate: 'var(--motion-translate)',
            scale: '0',
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          },
          {
            offset: 0.3,
            easing: 'linear',
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 1)',
          },
          {
            offset: 0.45,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.4)',
          },
          {
            offset: 0.6265,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.2)',
          },
          {
            offset: 0.7726999999999999,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.1)',
          },
          {
            offset: 0.8623000000000001,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.06)',
          },
          {
            offset: 0.9173,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.03)',
          },
          {
            offset: 0.9511,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.02)',
          },
          {
            offset: 0.9718000000000001,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * -0.01)',
          },
          {
            offset: 0.9845,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0.01)',
          },
          {
            offset: 1,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * -1 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * 1 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('PunchIn style animation with center direction', () => {
    const mockOptions = {
      ...baseMockOptions,
      duration: 1000,
      namedEffect: {
        direction: 'center',
      } as PunchInType,
    };

    const expectedResult: Partial<AnimationData>[] = [
      {
        name: 'motion-fadeIn',
        duration: 300,
        easing: 'cubicIn',
        custom: {},
        keyframes: [{ opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
      },
      {
        name: 'motion-punchIn',
        easing: 'linear',
        custom: {
          '--motion-translate':
            'calc(var(--motion-width, 100%) * 1.1 / 2 * 0) calc(var(--motion-height, 100%) * 1.1 / 2 * 0)',
        },
        keyframes: [
          {
            translate: 'var(--motion-translate)',
            scale: '0',
            easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          },
          {
            offset: 0.3,
            easing: 'linear',
            scale: '0.3',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 1) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 1)',
          },
          {
            offset: 0.45,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.4',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.4) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.4)',
          },
          {
            offset: 0.6265,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.8',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.2) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.2)',
          },
          {
            offset: 0.7726999999999999,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.1) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.1)',
          },
          {
            offset: 0.8623000000000001,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.94',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.06) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.06)',
          },
          {
            offset: 0.9173,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.03',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.03) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.03)',
          },
          {
            offset: 0.9511,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.98',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.02) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.02)',
          },
          {
            offset: 0.9718000000000001,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1.01',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * -0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * -0.01)',
          },
          {
            offset: 0.9845,
            easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            scale: '0.99',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0.01) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0.01)',
          },
          {
            offset: 1,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            scale: '1',
            translate:
              'calc(var(--motion-width, 100%) * 1.1 / 3 * 0 * 0) calc(var(--motion-height, 100%) * 1.1 / 3 * 0 * 0)',
          },
        ],
      },
    ];

    const result = PunchIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });
});
