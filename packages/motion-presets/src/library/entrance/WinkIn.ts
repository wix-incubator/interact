import {
  getClipPolygonParams,
  getAdjustedDirection,
  INITIAL_FRAME_OFFSET,
} from '@wix/motion';
import type { WinkIn, TimeAnimationOptions, DomApi } from '../../types';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-winkInClip', 'motion-winkInRotate'];
}

const PARAM_MAP = {
  vertical: { scaleY: 0, scaleX: 1 },
  horizontal: { scaleY: 1, scaleX: 0 },
};
const DIRECTIONS = ['vertical', 'horizontal'] as (keyof typeof PARAM_MAP)[];

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const { direction = 'horizontal' } = options.namedEffect as WinkIn;
  const [fadeIn, winkInClip, winkInRotate] = getNames(options);

  const adjustedDirection = getAdjustedDirection(
    DIRECTIONS,
    direction,
    0,
  ) as (typeof DIRECTIONS)[number];
  const { scaleX, scaleY } = PARAM_MAP[adjustedDirection];
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
      keyframes: [
        { offset: 0, opacity: 0 },
        { opacity: 'var(--comp-opacity, 1)' },
      ],
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

export function prepare(options: TimeAnimationOptions, dom?: DomApi) {
  const { direction = 'horizontal' } = options.namedEffect as WinkIn;

  if (dom) {
    let scale = PARAM_MAP.horizontal;
    let rotatedClip = getClipPolygonParams({
      direction: 'horizontal',
      minimum: 100,
    });

    dom.measure((target) => {
      if (!target) {
        return;
      }

      const rotation =
        getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0';
      const rotatedDirection = getAdjustedDirection(
        DIRECTIONS,
        direction,
        parseInt(rotation, 10),
      ) as (typeof DIRECTIONS)[number];
      scale = PARAM_MAP[rotatedDirection];
      rotatedClip = getClipPolygonParams({
        direction: rotatedDirection,
        minimum: 100,
      });
    });

    dom.mutate((target) => {
      target?.style.setProperty('--motion-clip-start', rotatedClip);
      target?.style.setProperty('--motion-scale-x', `${scale.scaleX}`);
      target?.style.setProperty('--motion-scale-y', `${scale.scaleY}`);
    });
  }
}
