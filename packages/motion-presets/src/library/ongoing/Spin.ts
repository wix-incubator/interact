import type { Spin, TimeAnimationOptions, DomApi, AnimationExtraOptions } from '../../types';
import { getEasing, getTimingFactor, toKeyframeValue, parseDirection } from '../../utils';

type SpinDirection = 'clockwise' | 'counter-clockwise';
const DEFAULT_DIRECTION: SpinDirection = 'clockwise';
const DIRECTIONS = ['clockwise', 'counter-clockwise'] as const;

const DIRECTION_MAP = {
  clockwise: -1,
  'counter-clockwise': 1,
};

export function web(options: TimeAnimationOptions & AnimationExtraOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions & AnimationExtraOptions, asWeb = false) {
  const namedEffect = options.namedEffect as Spin;
  const direction = parseDirection(
    namedEffect.direction,
    DIRECTIONS,
    DEFAULT_DIRECTION,
  ) as SpinDirection;

  const duration = options.duration || 1;
  const delay = options.delay || 0;
  const timingFactor = getTimingFactor(duration, delay) as number;
  const [name] = getNames(options);

  const easing = options.easing || 'linear';

  const transformRotate = (DIRECTION_MAP[direction] > 0 ? 1 : -1) * 360;

  const custom = {
    '--motion-rotate-start': `calc(var(--motion-rotate, 0deg) + ${transformRotate}deg)`,
  };

  return [
    {
      ...options,
      name,
      easing: 'linear',
      delay: 0,
      duration: duration + delay,
      custom,
      keyframes: [
        {
          offset: 0,
          easing: getEasing(easing),
          rotate: toKeyframeValue(custom, '--motion-rotate-start', asWeb),
        },
        {
          offset: timingFactor,
          rotate: `var(--motion-rotate, 0deg)`,
        },
      ],
    },
  ];
}

export function getNames(options: TimeAnimationOptions & AnimationExtraOptions) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true);

  return [`motion-spin-${timingFactor}`];
}
