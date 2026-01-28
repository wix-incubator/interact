import {
  AnimationData,
  EffectScrollRange,
  ScrubAnimationOptions,
  ShapeScroll,
  AnimationFillMode,
} from '../../types';
import { getEasing } from '../../utils';

const RESPONSIVE_SHAPES_MAP = {
  diamond: (clipFactor: number) => {
    const clip = clipFactor / 2;
    const clipNeg = 100 - clip;
    return [
      `polygon(50% ${clip}%, ${clipNeg}% 50%, 50% ${clipNeg}%, ${clip}% 50%)`,
      'polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)',
    ];
  },
  window: (clipFactor: number) => [
    `inset(${clipFactor / 2}% round 50% 50% 0% 0%)`,
    'inset(-20% round 50% 50% 0% 0%)',
  ],
  rectangle: (clipFactor: number) => [`inset(${clipFactor}%)`, `inset(0%)`],
  circle: (clipFactor: number) => [`circle(${100 - clipFactor}%)`, `circle(75%)`],
  ellipse: (clipFactor: number) => {
    const clip = 50 - clipFactor / 2;
    return [`ellipse(${clip}% ${clip}%)`, `ellipse(75% 75%)`];
  },
};

const easing = getEasing('circInOut');

const KEYFRAMES_RANGE_MAP: Record<
  EffectScrollRange,
  (start: string, end: string) => AnimationData['keyframes']
> = {
  in: (start: string, end: string) => [
    {
      clipPath: start,
      easing,
    },
    {
      clipPath: end,
    },
  ],
  out: (start: string, end: string) => [
    {
      clipPath: end,
      easing,
    },
    {
      clipPath: start,
    },
  ],
  continuous: (start: string, end: string) => [
    {
      clipPath: start,
      easing,
    },
    {
      clipPath: end,
      easing,
    },
    {
      clipPath: start,
    },
  ],
};

export default function create(options: ScrubAnimationOptions) {
  const {
    shape = 'circle',
    intensity = 0.5,
    range = 'in',
  } = options.namedEffect as ShapeScroll;
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const [start, end] = RESPONSIVE_SHAPES_MAP[shape](intensity * 100);

  const keyframes = KEYFRAMES_RANGE_MAP[range](start, end);

  return [
    {
      ...options,
      fill,
      easing: 'linear',
      keyframes,
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     clip-path: <fromValue>;
   *     easing: <easing>;
   *   }
   *   to {
   *     clip-path: <toValue>;
   *   }
   * }
   */
}
