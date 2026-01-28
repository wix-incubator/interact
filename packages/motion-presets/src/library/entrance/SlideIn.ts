import type { SlideIn, TimeAnimationOptions } from '../../types';
import { getClipPolygonParams, INITIAL_FRAME_OFFSET } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-slideIn', 'motion-fadeIn'];
}

type Direction = 'top' | 'right' | 'bottom' | 'left';

const PARAM_MAP: Record<Direction, { dx: number; dy: number; clip: Direction }> = {
  top: { dx: 0, dy: -1, clip: 'bottom' },
  right: { dx: 1, dy: 0, clip: 'left' },
  bottom: { dx: 0, dy: 1, clip: 'top' },
  left: { dx: -1, dy: 0, clip: 'right' },
};

export function web(options: TimeAnimationOptions) {
  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const { direction = 'left', initialTranslate = 1 } = options.namedEffect as SlideIn;
  const [slideIn, fadeIn] = getNames(options);

  const easing = options.easing || 'cubicInOut';
  const minimum = 100 - initialTranslate * 100;

  const start = getClipPolygonParams({
    direction: PARAM_MAP[direction].clip,
    minimum,
  });
  const clipEnd = getClipPolygonParams({ direction: 'initial' });

  const custom = {
    '--motion-clip-start': start,
    '--motion-translate-x': `${PARAM_MAP[direction].dx * 100}%`,
    '--motion-translate-y': `${PARAM_MAP[direction].dy * 100}%`,
  };

  return [
    {
      ...options,
      name: slideIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          opacity: 'var(--comp-opacity, 1)',
          transform: `rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-translate-x, ${custom['--motion-translate-x']}), var(--motion-translate-y, ${custom['--motion-translate-y']}))`,
          clipPath: `var(--motion-clip-start, ${custom['--motion-clip-start']})`,
        },
        {
          transform: 'rotate(var(--comp-rotate-z, 0deg)) translate(0px, 0px)',
          clipPath: clipEnd,
        },
      ],
    },
    {
      ...options,
      easing: 'cubicInOut',
      name: fadeIn,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
  ];
}
