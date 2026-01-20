import type { SpinIn, AnimationExtraOptions, TimeAnimationOptions } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-spinIn'];
}

const SCALE_MAP = {
  soft: 1,
  medium: 0.6,
  hard: 0,
};

const DIRECTION_MAP = {
  clockwise: -1,
  'counter-clockwise': 1,
};

export function web(options: TimeAnimationOptions & AnimationExtraOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const {
    direction = 'clockwise',
    spins = 0.5,
    initialScale = 0,
    power,
  } = options.namedEffect as SpinIn;
  const [fadeIn, spinIn] = getNames(options);

  const easing = options.easing || 'cubicInOut';
  const scale = typeof power !== 'undefined' ? SCALE_MAP[power] : initialScale;
  const transformRotate = (DIRECTION_MAP[direction] > 0 ? 1 : -1) * 360 * spins;

  const custom = {
    '--motion-scale': `${scale}`,
    '--motion-rotate': `${transformRotate}deg`,
  };

  return [
    {
      ...options,
      name: fadeIn,
      easing: 'cubicIn',
      duration: options.duration! * scale,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      name: spinIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          scale: toKeyframeValue(custom, '--motion-scale', asWeb),
          rotate: toKeyframeValue(custom, '--motion-rotate', asWeb),
        },
        {
          scale: '1',
          rotate: `0deg`,
        },
      ],
    },
  ];
}
