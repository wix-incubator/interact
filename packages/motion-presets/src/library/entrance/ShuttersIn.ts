import { ShuttersIn, TimeAnimationOptions } from '../../types';
import {
  getShuttersClipPaths,
  getEasing,
  toKeyframeValue,
  INITIAL_FRAME_OFFSET,
} from '@wix/motion';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-shuttersIn'];
}

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const {
    direction = 'right',
    shutters = 12,
    staggered = true,
  } = options.namedEffect as ShuttersIn;
  const [shuttersIn] = getNames(options);

  const { clipStart, clipEnd } = getShuttersClipPaths(
    direction,
    shutters,
    staggered,
  );

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
          offset: 0,
          opacity: 0,
          easing: 'step-end',
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          opacity: 'var(--comp-opacity, 1)',
          clipPath: toKeyframeValue(custom, '--motion-shutters-start', asWeb),
        },
        {
          clipPath: toKeyframeValue(custom, '--motion-shutters-end', asWeb),
        },
      ],
    },
  ];
}
