import { ShuttersIn, TimeAnimationOptions, EffectFourDirections } from '../../types';
import {
  getShuttersClipPaths,
  getEasing,
  toKeyframeValue,
  INITIAL_FRAME_OFFSET,
  parseDirection,
} from '../../utils';

const DEFAULT_DIRECTION: EffectFourDirections = 'right';
const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-shuttersIn', 'motion-fadeIn'];
}

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const namedEffect = options.namedEffect as ShuttersIn;
  const direction = parseDirection(
    namedEffect.direction,
    DIRECTIONS,
    DEFAULT_DIRECTION,
  ) as EffectFourDirections;
  const { shutters = 12, staggered = true } = namedEffect;
  const [shuttersIn, fadeIn] = getNames(options);

  const { clipStart, clipEnd } = getShuttersClipPaths(direction, shutters, staggered);

  const custom = {
    '--motion-shutters-start': clipStart,
    '--motion-shutters-end': clipEnd,
  };

  const easing = getEasing(options.easing || 'sineIn');

  return [
    {
      ...options,
      easing,
      name: shuttersIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          clipPath: toKeyframeValue(custom, '--motion-shutters-start', asWeb),
        },
        {
          clipPath: toKeyframeValue(custom, '--motion-shutters-end', asWeb),
        },
      ],
    },
    {
      ...options,
      name: fadeIn,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0, easing: 'step-end' }, {}],
    },
  ];
}
