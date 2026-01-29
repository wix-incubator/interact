import { INITIAL_FRAME_OFFSET } from '../../utils';
import type { FlipIn, TimeAnimationOptions } from '../../types';

const DEFAULT_PERSPECTIVE = 800;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-flipIn'];
}

type Direction = 'top' | 'right' | 'bottom' | 'left';

function getRotateFrom(direction: Direction, rotate: number) {
  return {
    x: ROTATE_MAP[direction].x * rotate,
    y: ROTATE_MAP[direction].y * rotate,
  };
}

const ROTATE_MAP: Record<Direction, { x: number; y: number }> = {
  top: { x: 1, y: 0 },
  right: { x: 0, y: 1 },
  bottom: { x: -1, y: 0 },
  left: { x: 0, y: -1 },
};

export function web(options: TimeAnimationOptions) {
  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const {
    direction = 'top',
    initialRotate = 90,
    perspective = DEFAULT_PERSPECTIVE,
  } = options.namedEffect as FlipIn;
  const [fadeIn, flipIn] = getNames(options);
  const easing = options.easing || 'backOut';

  const from = getRotateFrom(direction, initialRotate);

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
      keyframes: [{ offset: 0, opacity: 0 }, {}],
    },
    {
      ...options,
      easing,
      name: flipIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(${perspective}px) rotate(var(--comp-rotate-z, 0deg)) rotateX(var(--motion-rotate-x, ${custom['--motion-rotate-x']})) rotateY(var(--motion-rotate-y, ${custom['--motion-rotate-y']}))`,
        },
        {
          transform: `perspective(${perspective}px) rotate(var(--comp-rotate-z, 0deg)) rotateX(0deg) rotateY(0deg)`,
        },
      ],
    },
  ];
}
