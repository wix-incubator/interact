import type { AnimationFillMode, ScrubAnimationOptions, SpinScroll } from '../../types';

const DIRECTION_MAP = {
  clockwise: 1,
  'counter-clockwise': -1,
};

export default function create(options: ScrubAnimationOptions) {
  const {
    spins = 0.15,
    scale = 1,
    direction = 'clockwise',
    range = 'in',
  } = options.namedEffect as SpinScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const spinDirection = DIRECTION_MAP[direction];
  const rotationZ = spins * 360;
  const isIn = range === 'in';

  const fromValue = isIn ? -rotationZ : range === 'out' ? 0 : -rotationZ / 2;
  const toValue = isIn ? 0 : range === 'out' ? rotationZ : rotationZ / 2;

  return [
    {
      ...options,
      fill,
      easing,
      keyframes: [
        {
          transform: `scale(${isIn ? scale : 1}) rotate(calc(var(--comp-rotate-z, 0deg) + ${
            fromValue * spinDirection
          }deg))`,
        },
        {
          transform: `scale(${isIn ? 1 : scale}) rotate(calc(var(--comp-rotate-z, 0deg) + ${
            toValue * spinDirection
          }deg))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: scale(<fromValues.scale>) rotate(<rotation> - <fromValue.rotate * spinDirection>);
   *   }
   *   to {
   *     transform: scale(<toValues.scale>) rotate(<rotation> + <toValue.rotate * spinDirection>);
   *   }
   * }
   */
}
