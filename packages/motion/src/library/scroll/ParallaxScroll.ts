import type { ScrubAnimationOptions, ParallaxScroll, AnimationFillMode } from '../../types';

const DEFAULT_SPEED = 0.5;

function getOffsetAdd(factor: number, speed: number) {
  return `${100 * factor * speed}vh`;
}

function getScrubOffsets({ speed = DEFAULT_SPEED }: ParallaxScroll) {
  const start = getOffsetAdd(-0.5, speed);
  const end = getOffsetAdd(0.5, speed);

  return {
    start,
    end,
  };
}

export default function create(options: ScrubAnimationOptions) {
  const { speed = DEFAULT_SPEED } = options.namedEffect as ParallaxScroll;

  const fromValue = `${-50 * speed}vh`;
  const toValue = `${50 * speed}vh`;
  const easing = 'linear';
  const { start, end } = getScrubOffsets(options.namedEffect as ParallaxScroll);

  // use transform: translateY(<value>) and not translate: 0 <value> because of WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=276281
  return [
    {
      ...options,
      fill: 'both' as AnimationFillMode,
      easing,
      startOffsetAdd: start,
      endOffsetAdd: end,
      keyframes: [
        {
          transform: `translateY(${fromValue}) rotate(var(--comp-rotate-z, 0))`,
        },
        {
          transform: `translateY(${toValue}) rotate(var(--comp-rotate-z, 0))`,
        },
      ],
    },
  ];
  // only 'continuous' and 0%-100% of range
  /*
   * @keyframes <name> {
   *   from {
   *     transform: translateY(<fromValue>) rotate(var(--comp-rotate-z, 0));
   *   }
   *   to {
   *     transform: translateY(<toValue>) rotate(var(--comp-rotate-z, 0));
   *   }
   * }
   */
}
