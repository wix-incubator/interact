import type { AnimationFillMode, BlurScroll, ScrubAnimationOptions } from '../../types';
import { safeMapGet } from '../../utils';

const BLUR_POWER_MAP = {
  soft: 6,
  medium: 25,
  hard: 50,
};

export default function create(options: ScrubAnimationOptions) {
  const { blur = 6, power, range: rawRange = 'in' } = options.namedEffect as BlurScroll;
  const range = ['in', 'out', 'continuous'].includes(rawRange) ? rawRange : 'in';
  const blurFactor = power ? safeMapGet(BLUR_POWER_MAP, power, 'medium') : blur;

  const fromValue = range === 'out' ? 0 : blurFactor;
  const toValue = range === 'out' ? blurFactor : 0;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  return [
    {
      ...options,
      fill,
      easing,
      composite: 'add' as const,
      keyframes: [
        {
          filter: `blur(${fromValue}px)`,
        },
        {
          filter: `blur(${toValue}px)`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     filter: blur(<fromValue>px);
   *   }
   *   to {
   *     filter: blur(<toValue>px);
   *   }
   * }
   */
}
