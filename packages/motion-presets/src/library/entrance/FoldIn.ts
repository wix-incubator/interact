import type { FoldIn, TimeAnimationOptions } from '../../types';
import { INITIAL_FRAME_OFFSET } from '../../utils';

const DEFAULT_PERSPECTIVE = 800;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-foldIn'];
}

type Direction = 'top' | 'right' | 'bottom' | 'left';

const PARAM_MAP: Record<Direction, { x: number; y: number; origin: { x: number; y: number } }> = {
  top: { x: -1, y: 0, origin: { x: 0, y: -50 } },
  right: { x: 0, y: -1, origin: { x: 50, y: 0 } },
  bottom: { x: 1, y: 0, origin: { x: 0, y: 50 } },
  left: { x: 0, y: 1, origin: { x: -50, y: 0 } },
};

function getRotateFrom(direction: Direction, rotate: number) {
  return {
    x: PARAM_MAP[direction].x * rotate,
    y: PARAM_MAP[direction].y * rotate,
  };
}

export function web(options: TimeAnimationOptions) {
  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const {
    direction = 'top',
    initialRotate = 90,
    perspective = DEFAULT_PERSPECTIVE,
  } = options.namedEffect as FoldIn;
  const [fadeIn, foldIn] = getNames(options);
  const easing = options.easing || 'backOut';
  const { x, y } = PARAM_MAP[direction].origin;

  const from = getRotateFrom(direction, initialRotate);

  const custom = {
    '--motion-origin-x': `${x}%`,
    '--motion-origin-y': `${y}%`,
    '--motion-rotate-x': `${from.x}deg`,
    '--motion-rotate-y': `${from.y}deg`,
  };

  return [
    {
      ...options,
      easing: 'quadOut',
      name: fadeIn,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, {}],
    },
    {
      ...options,
      easing,
      name: foldIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-origin-x, ${custom['--motion-origin-x']}), var(--motion-origin-y, ${custom['--motion-origin-y']})) perspective(${perspective}px) rotateX(var(--motion-rotate-x, ${custom['--motion-rotate-x']})) rotateY(var(--motion-rotate-y, ${custom['--motion-rotate-y']})) translate(calc(-1 * var(--motion-origin-x, ${custom['--motion-origin-x']})), calc(-1 * var(--motion-origin-y, ${custom['--motion-origin-y']})))`,
        },
        {
          transform: `rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-origin-x, ${custom['--motion-origin-x']}), var(--motion-origin-y, ${custom['--motion-origin-y']})) perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translate(calc(-1 * var(--motion-origin-x, ${custom['--motion-origin-x']})), calc(-1 * var(--motion-origin-y, ${custom['--motion-origin-y']})))`,
        },
      ],
    },
  ];
}
