import type { ScrubAnimationOptions, ArcScroll, AnimationFillMode } from '../../types';

const DEFAULT_ANGLE = 68;
const DEFAULT_DEPTH = 300;
const DEFAULT_PERSPECTIVE = 500;

const ROTATE_DIRECTION_MAP = {
  vertical: 'rotateX',
  horizontal: 'rotateY',
};

function getRangeValues(angle: number) {
  return {
    in: { fromValue: -angle, toValue: 0 },
    out: { fromValue: 0, toValue: angle },
    continuous: { fromValue: -angle, toValue: angle },
  };
}

export default function create(options: ScrubAnimationOptions) {
  const {
    direction = 'horizontal',
    range = 'in',
    angle = DEFAULT_ANGLE,
    depth = DEFAULT_DEPTH,
    perspective = DEFAULT_PERSPECTIVE,
  } = options.namedEffect as ArcScroll;
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const rotateAxis = ROTATE_DIRECTION_MAP[direction];
  const rangeValues = getRangeValues(angle);
  const { fromValue, toValue } = rangeValues[range];
  const easing = 'linear';

  return [
    {
      ...options,
      fill,
      easing,
      keyframes: [
        {
          transform: `perspective(${perspective}px) translateZ(${-depth}px) ${rotateAxis}(${fromValue}deg) translateZ(${depth}px) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(${perspective}px) translateZ(${-depth}px) ${rotateAxis}(${toValue}deg) translateZ(${depth}px) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: perspective(<perspective>px) translateZ(-<depth>px) <rotateAxis>(<fromValue>deg) translateZ(<depth>px) rotate(<rotation>);
   *   }
   *   to {
   *     transform: perspective(<perspective>px) translateZ(-<depth>px) <rotateAxis>(<toValue>deg) translateZ(<depth>px) rotate(<rotation>);
   *   }
   * }
   */
}
