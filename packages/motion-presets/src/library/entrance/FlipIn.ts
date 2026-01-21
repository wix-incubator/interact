import { getAdjustedDirection, INITIAL_FRAME_OFFSET, safeMapGet } from '../../utils';
import type { FlipIn, TimeAnimationOptions, DomApi } from '../../types';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-flipIn'];
}

const DIRECTIONS = ['top', 'right', 'bottom', 'left'];

type Direction = (typeof DIRECTIONS)[number];

const POWER_TO_ROTATE_MAP = {
  soft: 45,
  medium: 90,
  hard: 270,
};

function getRotateFrom(direction: string, rotate: number) {
  const rotateParams = safeMapGet(ROTATE_MAP, direction, 'top');
  return {
    x: rotateParams.x * rotate,
    y: rotateParams.y * rotate,
  };
}

const ROTATE_MAP: Record<Direction, { x: number; y: number }> = {
  top: { x: 1, y: 0 },
  right: { x: 0, y: 1 },
  bottom: { x: -1, y: 0 },
  left: { x: 0, y: -1 },
};

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const { direction: rawDirection = 'top', power, initialRotate = 90 } = options.namedEffect as FlipIn;
  const [fadeIn, flipIn] = getNames(options);
  const direction = DIRECTIONS.includes(rawDirection) ? rawDirection : 'top';
  const rotate = power ? safeMapGet(POWER_TO_ROTATE_MAP, power, 'medium') : initialRotate;
  const easing = options.easing || 'backOut';

  const from = getRotateFrom(direction, rotate);

  const custom = {
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
      name: flipIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(var(--motion-rotate-x , ${custom['--motion-rotate-x']})) rotateY(var(--motion-rotate-y , ${custom['--motion-rotate-y']}))`,
        },
        {
          transform: `perspective(800px) rotate(var(--comp-rotate-z, 0deg)) rotateX(0deg) rotateY(0deg)`,
        },
      ],
    },
  ];
}

export function prepare(options: TimeAnimationOptions, dom?: DomApi) {
  const { direction: rawDirection = 'top', power, initialRotate = 90 } = options.namedEffect as FlipIn;

  const direction = DIRECTIONS.includes(rawDirection) ? rawDirection : 'top';
  const rotate = power ? safeMapGet(POWER_TO_ROTATE_MAP, power, 'medium') : initialRotate;

  if (dom) {
    let adjustedDirection: string = direction;

    dom.measure((target) => {
      if (!target) {
        return;
      }

      const rotation = getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0deg';
      adjustedDirection = getAdjustedDirection(
        DIRECTIONS,
        direction,
        parseInt(rotation, 10),
      ) as (typeof DIRECTIONS)[number];
    });

    dom.mutate((target) => {
      const from = getRotateFrom(adjustedDirection, rotate);

      target?.style.setProperty('--motion-rotate-x', `${from.x}deg`);
      target?.style.setProperty('--motion-rotate-y', `${from.y}deg`);
    });
  }
}
