import { describe, expect, test } from 'vitest';

import { entranceAnimations } from '../index';
import type { ShuttersIn, TimeAnimationOptions } from '../../../types';
import { getEasing } from '../../../utils';

const baseMockOptions: TimeAnimationOptions = {
  id: '1',
  duration: 1000,
};

describe('ShuttersIn.web()', () => {
  test('default options (right direction)', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
        duration: 1000,
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
              'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%)',
          },
          {
            clipPath:
              'polygon(0% 0%, 0% 100%, 8% 100%, 8% 0%, 8% 0%, 8% 100%, 18% 100%, 18% 0%, 16% 0%, 16% 100%, 29% 100%, 29% 0%, 25% 0%, 25% 100%, 41% 100%, 41% 0%, 33% 0%, 33% 100%, 55% 100%, 55% 0%, 41% 0%, 41% 100%, 70% 100%, 70% 0%, 50% 0%, 50% 100%, 87% 100%, 87% 0%, 58% 0%, 58% 100%, 105% 100%, 105% 0%, 66% 0%, 66% 100%, 124% 100%, 124% 0%, 75% 0%, 75% 100%, 145% 100%, 145% 0%, 83% 0%, 83% 100%, 168% 100%, 168% 0%, 91% 0%, 91% 100%, 191% 100%, 191% 0%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('left direction', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { type: 'ShuttersIn', direction: 'left' } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
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
              'polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%)',
          },
          {
            clipPath:
              'polygon(100% 0%, 100% 100%, 91% 100%, 91% 0%, 91% 0%, 91% 100%, 81% 100%, 81% 0%, 83% 0%, 83% 100%, 70% 100%, 70% 0%, 75% 0%, 75% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 44% 100%, 44% 0%, 58% 0%, 58% 100%, 29% 100%, 29% 0%, 50% 0%, 50% 100%, 12% 100%, 12% 0%, 41% 0%, 41% 100%, -5% 100%, -5% 0%, 33% 0%, 33% 100%, -24% 100%, -24% 0%, 25% 0%, 25% 100%, -45% 100%, -45% 0%, 16% 0%, 16% 100%, -68% 100%, -68% 0%, 8% 0%, 8% 100%, -91% 100%, -91% 0%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('custom shutters count', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {
        type: 'ShuttersIn',
        direction: 'right',
        shutters: 6,
      } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
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
              'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%)',
          },
          {
            clipPath:
              'polygon(0% 0%, 0% 100%, 16% 100%, 16% 0%, 16% 0%, 16% 100%, 38% 100%, 38% 0%, 33% 0%, 33% 100%, 66% 100%, 66% 0%, 50% 0%, 50% 100%, 99% 100%, 99% 0%, 66% 0%, 66% 100%, 138% 100%, 138% 0%, 83% 0%, 83% 100%, 183% 100%, 183% 0%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('non-staggered animation', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {
        type: 'ShuttersIn',
        direction: 'right',
        staggered: false,
      } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
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
              'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%)',
          },
          {
            clipPath:
              'polygon(0% 0%, 0% 100%, 8% 100%, 8% 0%, 8% 0%, 8% 100%, 16% 100%, 16% 0%, 16% 0%, 16% 100%, 25% 100%, 25% 0%, 25% 0%, 25% 100%, 33% 100%, 33% 0%, 33% 0%, 33% 100%, 41% 100%, 41% 0%, 41% 0%, 41% 100%, 50% 100%, 50% 0%, 50% 0%, 50% 100%, 58% 100%, 58% 0%, 58% 0%, 58% 100%, 66% 100%, 66% 0%, 66% 0%, 66% 100%, 75% 100%, 75% 0%, 75% 0%, 75% 100%, 83% 100%, 83% 0%, 83% 0%, 83% 100%, 91% 100%, 91% 0%, 91% 0%, 91% 100%, 100% 100%, 100% 0%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('custom easing', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      easing: 'easeInOutQuad',
      namedEffect: { type: 'ShuttersIn', direction: 'right' } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: 'easeInOutQuad',
        duration: 1000,
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
              'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%)',
          },
          {
            clipPath:
              'polygon(0% 0%, 0% 100%, 8% 100%, 8% 0%, 8% 0%, 8% 100%, 18% 100%, 18% 0%, 16% 0%, 16% 100%, 29% 100%, 29% 0%, 25% 0%, 25% 100%, 41% 100%, 41% 0%, 33% 0%, 33% 100%, 55% 100%, 55% 0%, 41% 0%, 41% 100%, 70% 100%, 70% 0%, 50% 0%, 50% 100%, 87% 100%, 87% 0%, 58% 0%, 58% 100%, 105% 100%, 105% 0%, 66% 0%, 66% 100%, 124% 100%, 124% 0%, 75% 0%, 75% 100%, 145% 100%, 145% 0%, 83% 0%, 83% 100%, 168% 100%, 168% 0%, 91% 0%, 91% 100%, 191% 100%, 191% 0%)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.web(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });
});

describe('ShuttersIn.style()', () => {
  test('default options (right direction)', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { direction: 'right' } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
        duration: 1000,
        name: 'motion-shuttersIn',
        custom: {
          '--motion-shutters-start':
            'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%)',
          '--motion-shutters-end':
            'polygon(0% 0%, 0% 100%, 8% 100%, 8% 0%, 8% 0%, 8% 100%, 18% 100%, 18% 0%, 16% 0%, 16% 100%, 29% 100%, 29% 0%, 25% 0%, 25% 100%, 41% 100%, 41% 0%, 33% 0%, 33% 100%, 55% 100%, 55% 0%, 41% 0%, 41% 100%, 70% 100%, 70% 0%, 50% 0%, 50% 100%, 87% 100%, 87% 0%, 58% 0%, 58% 100%, 105% 100%, 105% 0%, 66% 0%, 66% 100%, 124% 100%, 124% 0%, 75% 0%, 75% 100%, 145% 100%, 145% 0%, 83% 0%, 83% 100%, 168% 100%, 168% 0%, 91% 0%, 91% 100%, 191% 100%, 191% 0%)',
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
            clipPath: 'var(--motion-shutters-start)',
          },
          {
            clipPath: 'var(--motion-shutters-end)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('left direction', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: { type: 'ShuttersIn', direction: 'left' } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
        name: 'motion-shuttersIn',
        custom: {
          '--motion-shutters-start':
            'polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%)',
          '--motion-shutters-end':
            'polygon(100% 0%, 100% 100%, 91% 100%, 91% 0%, 91% 0%, 91% 100%, 81% 100%, 81% 0%, 83% 0%, 83% 100%, 70% 100%, 70% 0%, 75% 0%, 75% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 44% 100%, 44% 0%, 58% 0%, 58% 100%, 29% 100%, 29% 0%, 50% 0%, 50% 100%, 12% 100%, 12% 0%, 41% 0%, 41% 100%, -5% 100%, -5% 0%, 33% 0%, 33% 100%, -24% 100%, -24% 0%, 25% 0%, 25% 100%, -45% 100%, -45% 0%, 16% 0%, 16% 100%, -68% 100%, -68% 0%, 8% 0%, 8% 100%, -91% 100%, -91% 0%)',
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
            clipPath: 'var(--motion-shutters-start)',
          },
          {
            clipPath: 'var(--motion-shutters-end)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('custom shutters count', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {
        type: 'ShuttersIn',
        direction: 'right',
        shutters: 6,
      } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
        name: 'motion-shuttersIn',
        custom: {
          '--motion-shutters-start':
            'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%)',
          '--motion-shutters-end':
            'polygon(0% 0%, 0% 100%, 16% 100%, 16% 0%, 16% 0%, 16% 100%, 38% 100%, 38% 0%, 33% 0%, 33% 100%, 66% 100%, 66% 0%, 50% 0%, 50% 100%, 99% 100%, 99% 0%, 66% 0%, 66% 100%, 138% 100%, 138% 0%, 83% 0%, 83% 100%, 183% 100%, 183% 0%)',
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
            clipPath: 'var(--motion-shutters-start)',
          },
          {
            clipPath: 'var(--motion-shutters-end)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('non-staggered animation', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      namedEffect: {
        type: 'ShuttersIn',
        direction: 'right',
        staggered: false,
      } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: getEasing('sineIn'),
        name: 'motion-shuttersIn',
        custom: {
          '--motion-shutters-start':
            'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%)',
          '--motion-shutters-end':
            'polygon(0% 0%, 0% 100%, 8% 100%, 8% 0%, 8% 0%, 8% 100%, 16% 100%, 16% 0%, 16% 0%, 16% 100%, 25% 100%, 25% 0%, 25% 0%, 25% 100%, 33% 100%, 33% 0%, 33% 0%, 33% 100%, 41% 100%, 41% 0%, 41% 0%, 41% 100%, 50% 100%, 50% 0%, 50% 0%, 50% 100%, 58% 100%, 58% 0%, 58% 0%, 58% 100%, 66% 100%, 66% 0%, 66% 0%, 66% 100%, 75% 100%, 75% 0%, 75% 0%, 75% 100%, 83% 100%, 83% 0%, 83% 0%, 83% 100%, 91% 100%, 91% 0%, 91% 0%, 91% 100%, 100% 100%, 100% 0%)',
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
            clipPath: 'var(--motion-shutters-start)',
          },
          {
            clipPath: 'var(--motion-shutters-end)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });

  test('custom easing', () => {
    const mockOptions: TimeAnimationOptions = {
      ...baseMockOptions,
      easing: 'easeInOutQuad',
      namedEffect: { type: 'ShuttersIn', direction: 'right' } as ShuttersIn,
    };

    const expectedResult = [
      {
        easing: 'easeInOutQuad',
        duration: 1000,
        name: 'motion-shuttersIn',
        custom: {
          '--motion-shutters-start':
            'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%, 8% 0%, 8% 100%, 8% 100%, 8% 0%, 16% 0%, 16% 100%, 16% 100%, 16% 0%, 25% 0%, 25% 100%, 25% 100%, 25% 0%, 33% 0%, 33% 100%, 33% 100%, 33% 0%, 41% 0%, 41% 100%, 41% 100%, 41% 0%, 50% 0%, 50% 100%, 50% 100%, 50% 0%, 58% 0%, 58% 100%, 58% 100%, 58% 0%, 66% 0%, 66% 100%, 66% 100%, 66% 0%, 75% 0%, 75% 100%, 75% 100%, 75% 0%, 83% 0%, 83% 100%, 83% 100%, 83% 0%, 91% 0%, 91% 100%, 91% 100%, 91% 0%)',
          '--motion-shutters-end':
            'polygon(0% 0%, 0% 100%, 8% 100%, 8% 0%, 8% 0%, 8% 100%, 18% 100%, 18% 0%, 16% 0%, 16% 100%, 29% 100%, 29% 0%, 25% 0%, 25% 100%, 41% 100%, 41% 0%, 33% 0%, 33% 100%, 55% 100%, 55% 0%, 41% 0%, 41% 100%, 70% 100%, 70% 0%, 50% 0%, 50% 100%, 87% 100%, 87% 0%, 58% 0%, 58% 100%, 105% 100%, 105% 0%, 66% 0%, 66% 100%, 124% 100%, 124% 0%, 75% 0%, 75% 100%, 145% 100%, 145% 0%, 83% 0%, 83% 100%, 168% 100%, 168% 0%, 91% 0%, 91% 100%, 191% 100%, 191% 0%)',
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
            clipPath: 'var(--motion-shutters-start)',
          },
          {
            clipPath: 'var(--motion-shutters-end)',
          },
        ],
      },
    ];

    const result = entranceAnimations.ShuttersIn.style?.(mockOptions);
    expect(result).toMatchObject(expectedResult);
  });
});
