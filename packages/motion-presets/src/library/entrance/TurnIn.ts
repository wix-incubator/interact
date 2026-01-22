import type { TurnIn, TimeAnimationOptions, EffectFourCorners } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, getMapValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-turnIn'];
}

const EASING_MAP = {
  soft: 'cubicInOut',
  medium: 'quintInOut',
  hard: 'backOut',
};

const DIRECTION_TO_TRANSFORM_MAP: Record<
  EffectFourCorners,
  {
    x: number;
    y: number;
    angle?: number;
  }
> = {
  'top-left': {
    angle: -50,
    x: -50,
    y: -50,
  },
  'top-right': {
    angle: 50,
    x: 50,
    y: -50,
  },
  'bottom-right': {
    angle: 50,
    x: 50,
    y: 50,
  },
  'bottom-left': {
    angle: -50,
    x: -50,
    y: 50,
  },
};

const DEFAULT_DIRECTION = 'top-left';
const DEFAULT_EASING = 'backOut';

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = DEFAULT_DIRECTION, power } = options.namedEffect as TurnIn;
  const [fadeIn, turnIn] = getNames(options);

  const easingFallback = options.easing || DEFAULT_EASING;
  const easing = getMapValue(EASING_MAP, power, easingFallback);
  const directionParams = getMapValue(DIRECTION_TO_TRANSFORM_MAP, direction, DIRECTION_TO_TRANSFORM_MAP[DEFAULT_DIRECTION]);
  const { x, y } = directionParams;
  const transformRotate = directionParams.angle;

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
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
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
