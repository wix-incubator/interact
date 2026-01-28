import type { AnimationFillMode, BlurScroll, ScrubAnimationOptions } from '../../types';

export default function create(options: ScrubAnimationOptions) {
  const { blur = 6, range = 'in' } = options.namedEffect as BlurScroll;

  const fromValue = range === 'out' ? 0 : blur;
  const toValue = range === 'out' ? blur : 0;
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
