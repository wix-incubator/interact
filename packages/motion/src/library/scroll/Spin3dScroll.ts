import type {
  AnimationFillMode,
  ScrubAnimationOptions,
  Spin3dScroll,
} from '../../types';

const MAX_Y_TRAVEL = 40;

const POWER_MAP = {
  soft: { rotationZ: 45, travelY: 0 },
  medium: { rotationZ: 100, travelY: 0.5 },
  hard: { rotationZ: 200, travelY: 1 },
};

const RANGES_MAP = {
  in: (rotation: number, travelY: number) => ({
    fromValues: {
      rotationX: -2 * rotation,
      rotationY: -rotation,
      rotationZ: -rotation,
      travel: travelY,
    },
    toValues: {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      travel: 0,
    },
  }),
  out: (rotation: number, travelY: number) => ({
    fromValues: {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      travel: 0,
    },
    toValues: {
      rotationX: rotation * 3,
      rotationY: rotation * 2,
      rotationZ: rotation,
      travel: -travelY,
    },
  }),
  continuous: (rotation: number, travelY: number) => ({
    fromValues: {
      rotationX: -2 * rotation,
      rotationY: -rotation,
      rotationZ: -rotation,
      travel: travelY,
    },
    toValues: {
      rotationX: rotation * 1.8,
      rotationY: rotation,
      rotationZ: 2 * rotation,
      travel: -travelY,
    },
  }),
};

function getScrubOffsets({ power, range = 'in', speed = 0 }: Spin3dScroll) {
  const offset =
    (power && POWER_MAP[power] ? POWER_MAP[power].travelY : Math.abs(speed)) *
    MAX_Y_TRAVEL;

  return {
    start: range === 'out' ? '0px' : `${-offset}vh`,
    end: range === 'in' ? '0px' : `${offset}vh`,
  };
}

export default function create(options: ScrubAnimationOptions) {
  const {
    rotate = -100,
    power,
    range = 'in',
    speed = 0,
  } = options.namedEffect as Spin3dScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const initialParams =
    power && POWER_MAP[power]
      ? POWER_MAP[power]
      : { rotationZ: rotate, travelY: speed };

  const { fromValues, toValues } = RANGES_MAP[range](
    initialParams.rotationZ,
    initialParams.travelY * -MAX_Y_TRAVEL,
  );

  const { start: startOffsetAdd, end: endOffsetAdd } = getScrubOffsets(
    options.namedEffect as Spin3dScroll,
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
          transform: `perspective(1000px) translateY(${fromValues.travel}vh) rotateZ(calc(var(--comp-rotate-z, 0deg) + ${fromValues.rotationZ}deg)) rotateY(${fromValues.rotationY}deg) rotateX(${fromValues.rotationX}deg)`,
        },
        {
          transform: `perspective(1000px) translateY(${toValues.travel}vh) rotateZ(calc(var(--comp-rotate-z, 0deg) + ${toValues.rotationZ}deg)) rotateY(${toValues.rotationY}deg) rotateX(${toValues.rotationX}deg)`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: perspective(1000px) translateY(<fromValue.travel>vh) rotateZ(<fromValue.rotateZ> + <rotation>) rotateY(<fromValue.rotateY>deg) rotateX(<fromValue.rotateX>deg);
   *   }
   *   to {
   *     transform: perspective(1000px) translateY(<toValue.travel>vh) rotateZ(<fromValue.rotateZ> + <rotation>) rotateY(<toValue.rotateY>deg) rotateX(<toValue.rotateX>deg);
   *   }
   * }
   */
}
