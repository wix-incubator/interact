import { INITIAL_FRAME_OFFSET, parseDirection } from '../../utils';
import type { FlipIn, TimeAnimationOptions, EffectFourDirections } from '../../types';
import { FOUR_DIRECTIONS } from '../../consts';

const DEFAULT_DIRECTION: EffectFourDirections = 'top';

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
  const namedEffect = options.namedEffect as FlipIn;
  const direction = parseDirection(
    namedEffect.direction,
    FOUR_DIRECTIONS,
    DEFAULT_DIRECTION,
  ) as EffectFourDirections;
  const { initialRotate = 90 } = namedEffect;
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
      keyframes: [{ offset: 0, opacity: 0 }],
    },
    {
      ...options,
      easing,
      name: flipIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(800px) rotate(var(--motion-rotate, 0deg)) rotateX(var(--motion-rotate-x, ${custom['--motion-rotate-x']})) rotateY(var(--motion-rotate-y, ${custom['--motion-rotate-y']}))`,
        },
        {
          transform: `perspective(800px) rotate(var(--motion-rotate, 0deg)) rotateX(0deg) rotateY(0deg)`,
        },
      ],
    },
  ];
}
