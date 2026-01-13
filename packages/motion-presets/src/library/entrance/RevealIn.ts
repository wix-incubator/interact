import type {
  RevealIn,
  AnimationExtraOptions,
  DomApi,
  TimeAnimationOptions,
} from '../../types';
import type { Direction } from '../../utils';
import {
  getAdjustedDirection,
  getClipPolygonParams,
  INITIAL_FRAME_OFFSET,
} from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-revealIn'];
}

const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as Direction[];

function getClipStart(rotateZ: number, direction: Direction) {
  const clipDirection = getAdjustedDirection(
    DIRECTIONS,
    direction,
    rotateZ,
  ) as (typeof DIRECTIONS)[number];

  return getClipPolygonParams({
    direction: clipDirection,
    minimum: 0,
  });
}

export function web(options: TimeAnimationOptions & AnimationExtraOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options);
}

export function style(options: TimeAnimationOptions) {
  const { direction = 'left' } = options.namedEffect as RevealIn;
  const [revealIn] = getNames(options);
  const easing = options.easing || 'cubicInOut';

  const start = getClipStart(0, direction);
  const end = getClipPolygonParams({ direction: 'initial' });

  const custom = {
    '--motion-clip-start': start,
  };

  return [
    {
      ...options,
      easing,
      name: revealIn,
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
          clipPath: `var(--motion-clip-start, ${start})`,
        },
        {
          clipPath: end,
        },
      ],
    },
  ];
}

export function prepare(options: TimeAnimationOptions, dom?: DomApi) {
  const { direction = 'left' } = options.namedEffect as RevealIn;

  if (dom) {
    let rotation = '0deg';

    dom.measure((target) => {
      if (!target) {
        return;
      }

      rotation = getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0deg';
    });

    dom.mutate((target_) => {
      target_?.style.setProperty(
        '--motion-clip-start',
        getClipStart(parseInt(rotation, 10), direction),
      );
    });
  }
}
