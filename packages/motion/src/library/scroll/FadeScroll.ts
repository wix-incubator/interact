import type {
  FadeScroll,
  ScrubAnimationOptions,
  AnimationFillMode,
} from '../../types';

export default function create(options: ScrubAnimationOptions) {
  const { opacity = 0, range = 'in' } = options.namedEffect as FadeScroll;
  const isOut = range === 'out';
  const fromValue = isOut ? 'var(--comp-opacity, 1)' : opacity;
  const toValue = isOut ? opacity : 'var(--comp-opacity, 1)';
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
          opacity: fromValue,
        },
        {
          opacity: toValue,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     opacity: <fromValue>;
   *   }
   *   to {
   *     opacity: <toValue>;
   *   }
   * }
   */
}
