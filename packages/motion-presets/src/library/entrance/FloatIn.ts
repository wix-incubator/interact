import type { TimeAnimationOptions, FloatIn } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';

const DEFAULT_DISTANCE = 120;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-floatIn'];
}

const DIRECTION_MAP = {
  top: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  bottom: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
};

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = 'left', distance = DEFAULT_DISTANCE } = options.namedEffect as FloatIn;
  const [floatIn] = getNames(options);
  const { dx, dy } = DIRECTION_MAP[direction];

  const translateX = dx * distance;
  const translateY = dy * distance;

  const custom = {
    '--motion-translate-x': `${translateX}px`,
    '--motion-translate-y': `${translateY}px`,
  };

  return [
    {
      ...options,
      name: floatIn,
      easing: 'sineInOut',
      custom,
      keyframes: [
        {
          offset: 0,
          opacity: 0,
          easing: 'step-end',
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          opacity: 0,
          transform: `translate(${toKeyframeValue(
            custom,
            '--motion-translate-x',
            asWeb,
          )}, ${toKeyframeValue(
            custom,
            '--motion-translate-y',
            asWeb,
          )}) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          opacity: 'var(--comp-opacity, 1)',
          transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
        },
      ],
    },
  ];
}
