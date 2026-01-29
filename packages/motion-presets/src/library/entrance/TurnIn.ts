import type { TurnIn, TimeAnimationOptions, EffectFourCorners } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';

const ANGLE = 50;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-turnIn'];
}

const DIRECTION_TO_ORIGIN_MAP: Record<EffectFourCorners, { x: number; y: number; sign: number }> = {
  'top-left': { x: -50, y: -50, sign: -1 },
  'top-right': { x: 50, y: -50, sign: 1 },
  'bottom-right': { x: 50, y: 50, sign: 1 },
  'bottom-left': { x: -50, y: 50, sign: -1 },
};

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = 'top-left' } = options.namedEffect as TurnIn;
  const [fadeIn, turnIn] = getNames(options);

  const easing = options.easing || 'backOut';
  const { x, y, sign } = DIRECTION_TO_ORIGIN_MAP[direction];
  const transformRotate = sign * ANGLE;

  const custom = {
    '--motion-origin': `${x}%, ${y}%`,
    '--motion-origin-invert': `${-x}%, ${-y}%`,
    '--motion-rotate-z': `${transformRotate}deg`,
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
          )}) translate(${invertedOrigin}) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `translate(${origin}) rotate(0deg) translate(${invertedOrigin}) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
  ];
}
