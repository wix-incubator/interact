import {
  EffectPower,
  AnimationData,
  EffectScrollRange,
  ScrubAnimationOptions,
  ShapeScroll,
  AnimationFillMode,
} from '../../types';
import { getEasing } from '@wix/motion';

const SHAPES: Record<
  ShapeScroll['shape'],
  { start: Record<EffectPower, string>; end: string }
> = {
  diamond: {
    start: {
      soft: 'polygon(50% 20%, 80% 50%, 50% 80%, 20% 50%)',
      medium: 'polygon(50% 40%, 60% 50%, 50% 60%, 40% 50%)',
      hard: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
    },
    end: 'polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)',
  },
  window: {
    start: {
      soft: 'inset(20% round 50% 50% 0% 0%)',
      medium: 'inset(35% round 50% 50% 0% 0%)',
      hard: 'inset(50% round 50% 50% 0% 0%)',
    },
    end: 'inset(-20% round 50% 50% 0% 0%)',
  },
  rectangle: {
    start: {
      soft: 'inset(20%)',
      medium: 'inset(50%)',
      hard: 'inset(80%)',
    },
    end: 'inset(0%)',
  },
  circle: {
    start: {
      soft: 'circle(40%)',
      medium: 'circle(25%)',
      hard: 'circle(0%)',
    },
    end: 'circle(75%)',
  },
  ellipse: {
    start: {
      soft: 'ellipse(50% 50%)',
      medium: 'ellipse(30% 30%)',
      hard: 'ellipse(0% 0%)',
    },
    end: 'ellipse(75% 75%)',
  },
};

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
  circle: (clipFactor: number) => [
    `circle(${100 - clipFactor}%)`,
    `circle(75%)`,
  ],
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
    power,
    intensity = 0.5,
    range = 'in',
  } = options.namedEffect as ShapeScroll;
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const [start, end] =
    power && SHAPES[shape].start[power]
      ? [SHAPES[shape].start[power], SHAPES[shape].end]
      : RESPONSIVE_SHAPES_MAP[shape](intensity * 100);

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
