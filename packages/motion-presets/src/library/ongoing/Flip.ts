import type { Flip, TimeAnimationOptions, DomApi, AnimationExtraOptions } from '../../types';
import { getEasing, getTimingFactor, toKeyframeValue, parseDirection } from '../../utils';

type FlipDirection = 'vertical' | 'horizontal';
const DEFAULT_DIRECTION: FlipDirection = 'horizontal';
const ALLOWED_DIRECTION_KEYWORDS = ['vertical', 'horizontal'] as const;

const DIRECTION_MAP = {
  vertical: { x: '1', y: '0' },
  horizontal: { x: '0', y: '1' },
};

export function web(options: TimeAnimationOptions & AnimationExtraOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions & AnimationExtraOptions, asWeb = false) {
  const namedEffect = options.namedEffect as Flip;
  const direction = parseDirection(
    namedEffect.direction,
    ALLOWED_DIRECTION_KEYWORDS,
    DEFAULT_DIRECTION,
  ) as FlipDirection;

  const duration = options.duration || 1;
  const delay = options.delay || 0;
  const offset = getTimingFactor(duration, delay) as number;
  const [name] = getNames(options);

  const rotationAxes = DIRECTION_MAP[direction];
  const easing = options.easing || 'linear';

  const custom = {
    '--motion-rotate-x': rotationAxes.x,
    '--motion-rotate-y': rotationAxes.y,
  };

  const rotateStart = `rotate3d(${toKeyframeValue(
    custom,
    '--motion-rotate-x',
    asWeb,
  )}, ${toKeyframeValue(custom, '--motion-rotate-y', asWeb)}, 0, 0deg)`;

  const rotateEnd = `rotate3d(${toKeyframeValue(
    custom,
    '--motion-rotate-x',
    asWeb,
  )}, ${toKeyframeValue(custom, '--motion-rotate-y', asWeb)}, 0, 360deg)`;

  return [
    {
      ...options,
      name,
      delay: 0,
      easing: 'linear',
      duration: duration + delay,
      custom,
      keyframes: [
        {
          offset: 0,
          transform: `perspective(800px) rotateZ(var(--motion-rotate, 0deg)) ${rotateStart}`,
          easing: getEasing(easing),
        },
        {
          offset,
          transform: `perspective(800px) rotateZ(var(--motion-rotate, 0deg)) ${rotateEnd}`,
        },
        {
          offset: 1,
          transform: `perspective(800px) rotateZ(var(--motion-rotate, 0deg)) ${rotateEnd}`,
        },
      ],
    },
  ];
}

export function getNames(options: TimeAnimationOptions & AnimationExtraOptions) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true);

  return [`motion-flip-${timingFactor}`];
}
