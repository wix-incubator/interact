import { getClipPolygonParams, INITIAL_FRAME_OFFSET } from '../../utils';
import type { WinkIn, TimeAnimationOptions } from '../../types';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-winkInClip', 'motion-winkInRotate'];
}

type Direction = 'vertical' | 'horizontal';

const PARAM_MAP: Record<Direction, { scaleY: number; scaleX: number }> = {
  vertical: { scaleY: 0, scaleX: 1 },
  horizontal: { scaleY: 1, scaleX: 0 },
};

export function web(options: TimeAnimationOptions) {
  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const { direction = 'horizontal' } = options.namedEffect as WinkIn;
  const [fadeIn, winkInClip, winkInRotate] = getNames(options);

  const { scaleX, scaleY } = PARAM_MAP[direction];
  const easing = options.easing || 'quintInOut';

  const start = getClipPolygonParams({ direction, minimum: 100 });
  const end = getClipPolygonParams({ direction: 'initial' });

  const custom = {
    '--motion-scale-x': scaleX,
    '--motion-scale-y': scaleY,
    '--motion-clip-start': start,
  };

  return [
    {
      ...options,
      easing: 'quadOut',
      name: fadeIn,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      easing,
      name: winkInClip,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          clipPath: `var(--motion-clip-start, ${custom['--motion-clip-start']})`,
        },
        {
          clipPath: end,
        },
      ],
    },
    {
      ...options,
      duration: options.duration! * 0.85,
      easing,
      name: winkInRotate,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `rotate(var(--comp-rotate-z, 0deg)) scale(var(--motion-scale-x, ${custom['--motion-scale-x']}), var(--motion-scale-y, ${custom['--motion-scale-y']}))`,
        },
        {
          transform: 'rotate(var(--comp-rotate-z, 0deg)) scale(1, 1)',
        },
      ],
    },
  ];
}
