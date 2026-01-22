import type { TimeAnimationOptions, FloatIn } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, getMapValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-floatIn'];
}

const PARAMS_MAP = {
  top: { dx: 0, dy: -1, distance: 120 },
  right: { dx: 1, dy: 0, distance: 120 },
  bottom: { dx: 0, dy: 1, distance: 120 },
  left: { dx: -1, dy: 0, distance: 120 },
};

const DEFAULT_DIRECTION = 'left';

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = DEFAULT_DIRECTION } = options.namedEffect as FloatIn;
  const [floatIn] = getNames(options);
  const fromParams = getMapValue(PARAMS_MAP, direction, PARAMS_MAP[DEFAULT_DIRECTION]);

  const translateX = fromParams.dx * fromParams.distance;
  const translateY = fromParams.dy * fromParams.distance;

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
