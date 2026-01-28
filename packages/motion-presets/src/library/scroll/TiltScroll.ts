import type { AnimationFillMode, ScrubAnimationOptions, TiltScroll } from '../../types';
import { cssEasings as easings } from '@wix/motion';

const DEFAULT_PERSPECTIVE = 400;
const DEFAULT_MAX_Y_TRAVEL = 40;
const DEFAULT_ROTATION_X = 10;
const DEFAULT_ROTATION_Y = 25;
const DEFAULT_ROTATION_Z = 25;
const [UP, DOWN, ORIGINAL_LAYOUT] = [-1, 1, 0];

const DIRECTIONS_MAP = {
  right: 1,
  left: -1,
};

const RANGES_MAP = {
  in: {
    from: { x: -1, y: -1, z: 1, transY: DOWN },
    to: { x: 0, y: 0, z: 0, transY: ORIGINAL_LAYOUT },
  },
  out: {
    from: { x: 0, y: 0, z: 0, transY: ORIGINAL_LAYOUT },
    to: { x: -1, y: -1, z: 1, transY: UP },
  },
  continuous: {
    from: { x: -1, y: -1, z: -1, transY: DOWN },
    to: { x: 1, y: 0.5, z: 1.25, transY: UP },
  },
};

function getYTravel(distance: number, maxTravelY: number) {
  return distance * maxTravelY;
}

function getScrubOffsets({ range = 'in', distance = 0, maxTravelY = DEFAULT_MAX_Y_TRAVEL }: TiltScroll) {
  const offset = Math.abs(getYTravel(distance, maxTravelY));

  return {
    start: range === 'out' ? '0px' : `${-offset}vh`,
    end: range === 'in' ? '0px' : `${offset}vh`,
  };
}

export default function create(options: ScrubAnimationOptions) {
  const {
    distance = 0,
    range = 'in',
    direction = 'right',
    perspective = DEFAULT_PERSPECTIVE,
    rotationX = DEFAULT_ROTATION_X,
    rotationY = DEFAULT_ROTATION_Y,
    rotationZ = DEFAULT_ROTATION_Z,
    maxTravelY = DEFAULT_MAX_Y_TRAVEL,
  } = options.namedEffect as TiltScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const { from, to } = RANGES_MAP[range];

  const dir = DIRECTIONS_MAP[direction];
  const rotateZFrom = Math.abs(from.z) * rotationZ * dir * (from.z < 0 ? -1 : 1);
  const rotateZTo = Math.abs(to.z) * rotationZ * dir * (to.z < 0 ? -1 : 1);

  const travelY = getYTravel(distance, maxTravelY);
  const travelYFrom = travelY * from.transY;
  const travelYTo = travelY * to.transY;
  const rotationXFrom = from.x * rotationX;
  const rotationYFrom = from.y * rotationY;
  const rotationXTo = to.x * rotationX;
  const rotationYTo = to.y * rotationY;

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
          transform: `perspective(${perspective}px) translateY(${travelYFrom}vh) rotateX(${rotationXFrom}deg) rotateY(${rotationYFrom}deg)`,
        },
        {
          transform: `perspective(${perspective}px) translateY(${travelYTo}vh) rotateX(${rotationXTo}deg) rotateY(${rotationYTo}deg)`,
        },
      ],
    },
    {
      ...options,
      fill,
      easing: easings.sineInOut,
      startOffsetAdd,
      endOffsetAdd,
      composite: 'add' as const,
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
