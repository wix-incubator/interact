import {
  getAdjustedDirection,
  getClipPolygonParams,
  INITIAL_FRAME_OFFSET,
  toKeyframeValue,
} from '../../utils';
import type { TiltIn, TimeAnimationOptions, DomApi } from '../../types';

const DEFAULT_DEPTH = 200;
const DEFAULT_TILT_ANGLE = 90;
const DEFAULT_ROTATE_Z = 30;
const DEFAULT_PERSPECTIVE = 800;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-tiltInRotate', 'motion-tiltInClip'];
}

const ROTATION_SIGN_MAP = {
  left: 1,
  right: -1,
};

const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const;

function getClipStart(rotateZValue: number) {
  const clipDirection = getAdjustedDirection(
    DIRECTIONS as unknown as string[],
    'top',
    rotateZValue,
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
  const {
    direction = 'left',
    depth = DEFAULT_DEPTH,
    tiltAngle = DEFAULT_TILT_ANGLE,
    rotateZ = DEFAULT_ROTATE_Z,
    perspective = DEFAULT_PERSPECTIVE,
  } = options.namedEffect as TiltIn;
  const [fadeIn, tiltInRotate, tiltInClip] = getNames(options);

  const easing = options.easing || 'cubicOut';
  const clipStart = getClipStart(0);
  const rotationZ = ROTATION_SIGN_MAP[direction] * rotateZ;
  const clipEnd = getClipPolygonParams({ direction: 'initial' });
  // When depth is provided, use it directly; otherwise fall back to CSS var for DOM measurement
  const translateZ = depth !== DEFAULT_DEPTH ? `${depth}` : '(var(--motion-height, 200px) / 2)';

  const custom = {
    '--motion-rotate-z': `${rotationZ}deg`,
    '--motion-clip-start': clipStart,
    '--motion-depth': `${depth}`,
    '--motion-tilt-angle': `${tiltAngle}`,
  };

  const depthValue = toKeyframeValue(custom, '--motion-depth', asWeb);
  const tiltAngleValue = toKeyframeValue(custom, '--motion-tilt-angle', asWeb);

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
      custom,
      keyframes: [
        {
          offset: 0,
          easing: 'step-end',
          transform: `perspective(${perspective}px)`,
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(${perspective}px) translateZ(calc(${translateZ}px * -1)) rotateX(calc(-1 * ${tiltAngleValue}deg)) translateZ(calc(${translateZ}px)) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(${perspective}px) translateZ(calc(${translateZ}px * -1)) rotateX(0deg) translateZ(calc(${translateZ}px)) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
    {
      ...options,
      name: tiltInClip,
      easing,
      composite: 'add' as const,
      duration: options.duration! * 0.8,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          clipPath: `var(--motion-clip-start, ${custom['--motion-clip-start']})`,
          transform: `rotateZ(${toKeyframeValue(custom, '--motion-rotate-z', asWeb)})`,
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
