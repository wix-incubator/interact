import type {
  AnimationFillMode,
  ScrubAnimationOptions,
  TiltScroll,
} from '../../types';
import { cssEasings as easings } from '@wix/motion';

const MAX_Y_TRAVEL = 40;

const [ROTATION_X, ROTATION_Y, ROTATION_Z] = [10, 25, 25];
const [UP, DOWN, ORIGINAL_LAYOUT] = [-1, 1, 0];

const TRANSLATE_Y_POWER_MAP = {
  soft: 0,
  medium: 0.5,
  hard: 1,
};

const DIRECTIONS_MAP = {
  right: 1,
  left: -1,
};

const RANGES_MAP = {
  in: {
    from: {
      x: -1,
      y: -1,
      z: 1,
      transY: DOWN,
    },
    to: {
      x: 0,
      y: 0,
      z: 0,
      transY: ORIGINAL_LAYOUT,
    },
  },
  out: {
    from: {
      x: 0,
      y: 0,
      z: 0,
      transY: ORIGINAL_LAYOUT,
    },
    to: {
      x: -1,
      y: -1,
      z: 1,
      transY: UP,
    },
  },
  continuous: {
    from: {
      x: -1,
      y: -1,
      z: -1,
      transY: DOWN,
    },
    to: {
      x: 1,
      y: 0.5,
      z: 1.25,
      transY: UP,
    },
  },
};

function getYTravel(
  distance: number,
  power?: keyof typeof TRANSLATE_Y_POWER_MAP,
) {
  return (
    (power && power in TRANSLATE_Y_POWER_MAP
      ? TRANSLATE_Y_POWER_MAP[power]
      : distance) * MAX_Y_TRAVEL
  );
}

function getScrubOffsets({ power, range = 'in', distance = 0 }: TiltScroll) {
  const offset = Math.abs(getYTravel(distance, power));

  return {
    start: range === 'out' ? '0px' : `${-offset}vh`,
    end: range === 'in' ? '0px' : `${offset}vh`,
  };
}

export default function create(options: ScrubAnimationOptions) {
  const {
    power,
    distance = 0,
    range = 'in',
    direction = 'right',
  } = options.namedEffect as TiltScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const { from, to } = RANGES_MAP[range];

  const dir = DIRECTIONS_MAP[direction];
  const rotateZFrom =
    Math.abs(from.z) * ROTATION_Z * dir * (from.z < 0 ? -1 : 1);
  const rotateZTo = Math.abs(to.z) * ROTATION_Z * dir * (to.z < 0 ? -1 : 1);

  const travelY = getYTravel(distance, power);
  const travelYFrom = travelY * from.transY;
  const travelYTo = travelY * to.transY;
  const rotationXFrom = from.x * ROTATION_X;
  const rotationYFrom = from.y * ROTATION_Y;
  const rotationXTo = to.x * ROTATION_X;
  const rotationYTo = to.y * ROTATION_Y;

  const { start: startOffsetAdd, end: endOffsetAdd } = getScrubOffsets(
    options.namedEffect as TiltScroll,
  );

  return [
    {
      ...options,
      fill,
      easing,
      startOffsetAdd,
      endOffsetAdd,
      keyframes: [
        {
          transform: `perspective(400px) translateY(${travelYFrom}vh) rotateX(${rotationXFrom}deg) rotateY(${rotationYFrom}deg)`,
        },
        {
          transform: `perspective(400px) translateY(${travelYTo}vh) rotateX(${rotationXTo}deg) rotateY(${rotationYTo}deg)`,
        },
      ],
    },
    {
      ...options,
      fill,
      easing: easings.sineInOut,
      startOffsetAdd,
      endOffsetAdd,
      composite: 'add' as const, // add this animation on top of the previous one
      keyframes: [
        {
          transform: `rotate(calc(var(--comp-rotate-z, 0deg) + ${rotateZFrom}deg))`,
        },
        {
          transform: `rotate(calc(var(--comp-rotate-z, 0deg) + ${rotateZTo}deg))`,
        },
      ],
    },
  ];
}
