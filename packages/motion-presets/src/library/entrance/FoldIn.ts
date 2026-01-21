import type { FoldIn, TimeAnimationOptions, DomApi } from '../../types';
import { getAdjustedDirection, INITIAL_FRAME_OFFSET, safeMapGet } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-foldIn'];
}

const POWER_TO_ROTATE_MAP = {
  soft: 35,
  medium: 60,
  hard: 90,
};

const DIRECTIONS = ['top', 'right', 'bottom', 'left'];

type Direction = (typeof DIRECTIONS)[number];

const PARAM_MAP: Record<Direction, { x: number; y: number; origin: { x: number; y: number } }> = {
  top: { x: -1, y: 0, origin: { x: 0, y: -50 } },
  right: { x: 0, y: -1, origin: { x: 50, y: 0 } },
  bottom: { x: 1, y: 0, origin: { x: 0, y: 50 } },
  left: { x: 0, y: 1, origin: { x: -50, y: 0 } },
};

function getRotateFrom(direction: Direction, rotate: number) {
  const params = safeMapGet(PARAM_MAP, direction, 'top');
  return {
    x: params.x * rotate,
    y: params.y * rotate,
  };
}

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const { direction: rawDirection = 'top', power, initialRotate = 90 } = options.namedEffect as FoldIn;
  const [fadeIn, foldIn] = getNames(options);
  const easing = options.easing || 'backOut';
  const direction = DIRECTIONS.includes(rawDirection) ? rawDirection : 'top';
  const rotate = power ? safeMapGet(POWER_TO_ROTATE_MAP, power, 'medium') : initialRotate;
  const directionParams = safeMapGet(PARAM_MAP, direction, 'top');
  const { x, y } = directionParams.origin;

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
  const { direction: rawDirection = 'top', power, initialRotate = 90 } = options.namedEffect as FoldIn;
  const direction = DIRECTIONS.includes(rawDirection) ? rawDirection : 'top';
  const rotate = power ? safeMapGet(POWER_TO_ROTATE_MAP, power, 'medium') : initialRotate;

  if (dom) {
    let adjustedDirection: Direction = direction;

    dom.measure((target) => {
      if (!target) {
        return;
      }

      const rotation = getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0deg';

      adjustedDirection = getAdjustedDirection(
        DIRECTIONS,
        direction,
        parseInt(rotation, 10),
      ) as Direction;
    });

    dom.mutate((target) => {
      const { origin } = PARAM_MAP[adjustedDirection];
      const newRotate = getRotateFrom(adjustedDirection, rotate);

      target?.style.setProperty('--motion-origin-x', `${origin.x}%`);
      target?.style.setProperty('--motion-origin-y', `${origin.y}%`);
      target?.style.setProperty('--motion-rotate-x', `${newRotate.x}deg`);
      target?.style.setProperty('--motion-rotate-y', `${newRotate.y}deg`);
    });
  }
}
