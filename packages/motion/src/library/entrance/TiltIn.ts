import {
  getAdjustedDirection,
  getClipPolygonParams,
  INITIAL_FRAME_OFFSET,
  toKeyframeValue,
} from '../../utils';
import type { TiltIn, TimeAnimationOptions, DomApi } from '../../types';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-tiltInRotate', 'motion-tiltInClip'];
}

const ROTATION_MAP = {
  left: 30,
  right: -30,
};

const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as (keyof typeof ROTATION_MAP)[];

function getClipStart(rotateZ: number) {
  const clipDirection = getAdjustedDirection(
    DIRECTIONS,
    'top',
    rotateZ,
  ) as (typeof DIRECTIONS)[number];

  return getClipPolygonParams({
    direction: clipDirection,
    minimum: 0,
  });
}

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = 'left' } = options.namedEffect as TiltIn;
  const [fadeIn, tiltInRotate, tiltInClip] = getNames(options);

  const easing = options.easing || 'cubicOut';
  const clipStart = getClipStart(0);
  const rotationZ = ROTATION_MAP[direction];
  const clipEnd = getClipPolygonParams({ direction: 'initial' });
  const translateZ = '(var(--motion-height, 200px) / 2)';

  const clipCustom = {
    '--motion-rotate-z': `${rotationZ}deg`,
    '--motion-clip-start': clipStart,
  };

  return [
    {
      ...options,
      name: fadeIn,
      duration: options.duration! * 0.2,
      easing: 'cubicOut',
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      name: tiltInRotate,
      easing,
      custom: {},
      keyframes: [
        {
          offset: 0,
          easing: 'step-end',
          transform: 'perspective(800px)',
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(800px) translateZ(calc(${translateZ} * -1)) rotateX(-90deg) translateZ(calc${translateZ}) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(800px) translateZ(calc(${translateZ} * -1)) rotateX(0deg) translateZ(calc${translateZ}) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
    {
      ...options,
      name: tiltInClip,
      easing,
      composite: 'add' as const,
      duration: options.duration! * 0.8,
      custom: clipCustom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          clipPath: `var(--motion-clip-start, ${clipCustom['--motion-clip-start']})`,
          transform: `rotateZ(${toKeyframeValue(clipCustom, '--motion-rotate-z', asWeb)})`,
        },
        {
          clipPath: clipEnd,
          transform: `rotateZ(0deg)`,
        },
      ],
    },
  ];
}

export function prepare(_: TimeAnimationOptions, dom?: DomApi) {
  if (dom) {
    let rotation = '0deg';

    dom.measure((target) => {
      if (!target) {
        return;
      }
      rotation = getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0deg';
    });

    dom.mutate((target_) => {
      target_?.style.setProperty('--motion-clip-start', getClipStart(parseInt(rotation, 10)));
    });
  }
}
