import type { ScrubAnimationOptions, ArcScroll, AnimationFillMode } from '../../types';
import { safeMapGet } from '../../utils';

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
  const { direction: rawDirection = 'horizontal', range: rawRange = 'in' } = options.namedEffect as ArcScroll;
  const range = rawRange in RANGES_MAP ? rawRange : 'in';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const rotateAxis = safeMapGet(ROTATE_DIRECTION_MAP, rawDirection, 'horizontal');
  const { fromValue, toValue } = safeMapGet(RANGES_MAP, rawRange, 'in');
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
