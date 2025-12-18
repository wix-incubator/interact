import type {
  SlideIn,
  AnimationExtraOptions,
  DomApi,
  TimeAnimationOptions,
} from '../../types';
import {
  Direction,
  getAdjustedDirection,
  getClipPolygonParams,
  INITIAL_FRAME_OFFSET,
} from '../../utils';

export function getNames(options: TimeAnimationOptions) {
  const { power } = options.namedEffect as SlideIn;
  return power !== 'hard'
    ? ['motion-slideIn', 'motion-fadeIn']
    : ['motion-slideIn'];
}

const PARAM_MAP = {
  top: { dx: 0, dy: -1, clip: 'bottom' },
  right: { dx: 1, dy: 0, clip: 'left' },
  bottom: { dx: 0, dy: 1, clip: 'top' },
  left: { dx: -1, dy: 0, clip: 'right' },
};

const DIRECTIONS = [
  'top',
  'right',
  'bottom',
  'left',
] as (keyof typeof PARAM_MAP)[];

const INITIAL_TRANSLATE_MAP = {
  soft: 0.2,
  medium: 0.8,
  hard: 1,
};

export function web(
  options: TimeAnimationOptions & AnimationExtraOptions,
  dom?: DomApi,
) {
  const animations = style(options);

  prepare(options, dom);

  return animations;
}

export function style(options: TimeAnimationOptions) {
  const {
    direction = 'left',
    power,
    initialTranslate = 1,
  } = options.namedEffect as SlideIn;
  const [slideIn, fadeIn] = getNames(options);

  const easing = options.easing || 'cubicInOut';
  const scale = (power && INITIAL_TRANSLATE_MAP[power]) || initialTranslate;
  const minimum = 100 - scale * 100;

  const start = getClipPolygonParams({
    direction,
    minimum,
  });
  const clipEnd = getClipPolygonParams({ direction: 'initial' });

  const custom = {
    '--motion-clip-start': start,
    '--motion-translate-x': `${PARAM_MAP[direction].dx * 100}%`,
    '--motion-translate-y': `${PARAM_MAP[direction].dy * 100}%`,
  };

  const animations = [
    {
      ...options,
      name: slideIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          opacity: 'var(--comp-opacity, 1)',
          transform: `rotate(var(--comp-rotate-z, 0deg)) translate(var(--motion-translate-x, -100%), var(--motion-translate-y, 0%))`,
          clipPath: `var(--motion-clip-start, ${custom['--motion-clip-start']})`,
        },
        {
          transform: 'rotate(var(--comp-rotate-z, 0deg)) translate(0px, 0px)',
          clipPath: clipEnd,
        },
      ],
    },
  ];

  if (power !== 'hard') {
    animations.push({
      ...options,
      easing: 'cubicInOut',
      name: fadeIn,
      // @ts-expect-error
      custom: {},
      keyframes: [
        // @ts-expect-error
        { offset: 0, opacity: 0 },
        // @ts-expect-error
        { opacity: 'var(--comp-opacity, 1)' },
      ],
    });
  } else {
    animations[0].keyframes.unshift({
      offset: 0,
      // @ts-expect-error
      opacity: 0,
      easing: 'step-end',
    });
  }

  return animations;
}

export function prepare(options: TimeAnimationOptions, dom?: DomApi) {
  const {
    direction = 'left',
    power,
    initialTranslate = 1,
  } = options.namedEffect as SlideIn;

  const scale = (power && INITIAL_TRANSLATE_MAP[power]) || initialTranslate;
  const minimum = 100 - scale * 100;

  if (dom) {
    let rotation = 0;

    dom.measure((target) => {
      if (!target) {
        return;
      }
      rotation = parseInt(
        getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0deg',
        10,
      );
    });

    dom.mutate((target) => {
      const adjustedDirection = getAdjustedDirection(
        DIRECTIONS,
        direction,
        rotation,
      ) as (typeof DIRECTIONS)[number];

      target?.style.setProperty(
        '--motion-clip-start',
        getClipPolygonParams({
          direction: PARAM_MAP[adjustedDirection].clip as Direction,
          minimum,
        }),
      );
      target?.style.setProperty(
        '--motion-translate-x',
        `${PARAM_MAP[adjustedDirection].dx * 100}%`,
      );
      target?.style.setProperty(
        '--motion-translate-y',
        `${PARAM_MAP[adjustedDirection].dy * 100}%`,
      );
    });
  }
}
