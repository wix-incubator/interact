import type { FoldIn, TimeAnimationOptions, DomApi } from '../../types';
import { getMapValue, INITIAL_FRAME_OFFSET } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-foldIn'];
}

const POWER_TO_ROTATE_MAP = {
  soft: 35,
  medium: 60,
  hard: 90,
};

const DIRECTIONS = ['top', 'right', 'bottom', 'left'];

const DEFAULT_DIRECTION = 'top';

type Direction = (typeof DIRECTIONS)[number];

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

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const { direction = DEFAULT_DIRECTION, power, initialRotate = 90 } = options.namedEffect as FoldIn;
  const [fadeIn, foldIn] = getNames(options);
  const easing = options.easing || 'backOut';
  const rotate = getMapValue(POWER_TO_ROTATE_MAP, power, initialRotate);
  const { x, y } = getMapValue(PARAM_MAP, direction, PARAM_MAP[DEFAULT_DIRECTION]).origin;

  const from = getRotateFrom(direction, rotate);

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
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      easing,
      name: foldIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-origin-x ,${custom['--motion-origin-x']}), var(--motion-origin-y, ${custom['--motion-origin-y']})) perspective(800px) rotateX(var(--motion-rotate-x, ${custom['--motion-rotate-x']})) rotateY(var(--motion-rotate-y, ${custom['--motion-rotate-y']})) translate(calc(-1 * var(--motion-origin-x ,${custom['--motion-origin-x']})), calc(-1 * var(--motion-origin-y, ${custom['--motion-origin-y']})))`,
        },
        {
          transform: `rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-origin-x ,${custom['--motion-origin-x']}), var(--motion-origin-y, ${custom['--motion-origin-y']})) perspective(800px) rotateX(0deg) rotateY(0deg) translate(calc(-1 * var(--motion-origin-x ,${custom['--motion-origin-x']})), calc(-1 * var(--motion-origin-y, ${custom['--motion-origin-y']})))`,
        },
      ],
    },
  ];
}

export function prepare(options: TimeAnimationOptions, dom?: DomApi) {
  const { direction = DEFAULT_DIRECTION, power, initialRotate = 90 } = options.namedEffect as FoldIn;
  const rotate = getMapValue(POWER_TO_ROTATE_MAP, power, initialRotate);

  if (dom) {
    dom.mutate((target) => {
      const { origin } = getMapValue(PARAM_MAP, direction, PARAM_MAP[DEFAULT_DIRECTION]);
      const from = getRotateFrom(direction, rotate);

      target?.style.setProperty('--motion-origin-x', `${origin.x}%`);
      target?.style.setProperty('--motion-origin-y', `${origin.y}%`);
      target?.style.setProperty('--motion-rotate-x', `${from.x}deg`);
      target?.style.setProperty('--motion-rotate-y', `${from.y}deg`);
    });
  }
}
