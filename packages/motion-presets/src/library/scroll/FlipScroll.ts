import type {
  AnimationFillMode,
  FlipScroll,
  ScrubAnimationOptions,
} from '../../types';

const ROTATE_POWER_MAP = {
  soft: 60,
  medium: 120,
  hard: 420,
};

const ROTATE_DIRECTION_MAP = {
  vertical: 'rotateX',
  horizontal: 'rotateY',
};

export function web(options: ScrubAnimationOptions) {
  const {
    rotate = 240,
    direction = 'horizontal',
    power,
    range = 'continuous',
  } = options.namedEffect as FlipScroll;

  const rotationAxis = ROTATE_DIRECTION_MAP[direction];
  const flipValue =
    power && ROTATE_POWER_MAP[power] ? ROTATE_POWER_MAP[power] : rotate;

  // const { fromValue, toValue } = rangeValues[range](rotation);
  const fromValue = range === 'out' ? 0 : -flipValue;
  const toValue = range === 'in' ? 0 : flipValue;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  return [
    {
      ...options,
      fill,
      easing,
      keyframes: [
        {
          transform: `perspective(800px) ${rotationAxis}(${fromValue}deg) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(800px) ${rotationAxis}(${toValue}deg) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: perspective(800px) <rotationAxis>(fromValue) rotate(<rotation>);
   *   }
   *   to {
   *     transform: perspective(800px) <rotationAxis>(toValue) rotate(<rotation>);
   *   }
   * }
   */
}
