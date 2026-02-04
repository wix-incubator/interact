import type { TurnIn, TimeAnimationOptions, EffectFourCorners } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, parseDirection } from '../../utils';

const DEFAULT_DIRECTION: EffectFourCorners = 'top-left';
const DIRECTIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-turnIn'];
}

const DIRECTION_TO_TRANSFORM_MAP: Record<
  EffectFourCorners,
  { x: number; y: number; angle: number }
> = {
  'top-left': { angle: -50, x: -50, y: -50 },
  'top-right': { angle: 50, x: 50, y: -50 },
  'bottom-right': { angle: 50, x: 50, y: 50 },
  'bottom-left': { angle: -50, x: -50, y: 50 },
};

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const namedEffect = options.namedEffect as TurnIn;
  const direction = parseDirection(
    namedEffect.direction,
    DIRECTIONS,
    DEFAULT_DIRECTION,
  ) as EffectFourCorners;
  const [fadeIn, turnIn] = getNames(options);

  const easing = options.easing || 'backOut';
  const { x, y, angle } = DIRECTION_TO_TRANSFORM_MAP[direction];

  const custom = {
    '--motion-origin': `${x}%, ${y}%`,
    '--motion-origin-invert': `${-x}%, ${-y}%`,
    '--motion-rotate-z': `${angle}deg`,
  };

  const origin = toKeyframeValue(custom, '--motion-origin', asWeb);
  const invertedOrigin = toKeyframeValue(custom, '--motion-origin-invert', asWeb);

  return [
    {
      ...options,
      name: fadeIn,
      duration: options.duration! * 0.6,
      easing: 'sineIn',
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, {}],
    },
    {
      ...options,
      name: turnIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `translate(${origin}) rotate(${toKeyframeValue(
            custom,
            '--motion-rotate-z',
            asWeb,
          )}) translate(${invertedOrigin}) rotate(var(--motion-rotate, 0deg))`,
        },
        {
          transform: `translate(${origin}) rotate(0deg) translate(${invertedOrigin}) rotate(var(--motion-rotate, 0deg))`,
        },
      ],
    },
  ];
}
