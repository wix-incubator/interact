import type {
  ScrubAnimationOptions,
  ArcScroll,
  AnimationFillMode,
} from '../../types';

const ROTATE_DIRECTION_MAP = {
  vertical: 'rotateX',
  horizontal: 'rotateY',
};

const ROTATION = 68;

const RANGES_MAP = {
  in: { fromValue: -ROTATION, toValue: 0 },
  out: { fromValue: 0, toValue: ROTATION },
  continuous: { fromValue: -ROTATION, toValue: ROTATION },
};

export default function create(options: ScrubAnimationOptions) {
  const { direction = 'horizontal', range = 'in' } =
    options.namedEffect as ArcScroll;
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const rotateAxis = ROTATE_DIRECTION_MAP[direction];
  const { fromValue, toValue } = RANGES_MAP[range];
  const easing = 'linear';

  return [
    {
      ...options,
      fill,
      easing,
      keyframes: [
        {
          transform: `perspective(500px) translateZ(-300px)  ${rotateAxis}(${fromValue}deg) translateZ(300px) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(500px) translateZ(-300px) ${rotateAxis}(${toValue}deg) translateZ(300px) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: perspective(500px) translateZ(-300px) <rotateAxis>(<fromValue>deg) translateZ(300px) rotate(<rotation>);
   *   }
   *   to {
   *     transform-origin: 50% 50% -300px;
   *     transform: perspective(500px) translateZ(-300px) <rotateAxis>(<toValue>deg) translateZ(300px) rotate(<rotation>);
   *   }
   * }
   */
}
