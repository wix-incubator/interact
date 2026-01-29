import { getClipPolygonParams, INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';
import type { TiltIn, TimeAnimationOptions } from '../../types';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-tiltInRotate', 'motion-tiltInClip'];
}

const ROTATION_MAP = {
  left: 30,
  right: -30,
};

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = 'left' } = options.namedEffect as TiltIn;
  const [fadeIn, tiltInRotate, tiltInClip] = getNames(options);

  const easing = options.easing || 'cubicOut';
  const clipStart = getClipPolygonParams({ direction: 'top', minimum: 0 });
  const rotationZ = ROTATION_MAP[direction];
  const clipEnd = getClipPolygonParams({ direction: 'initial' });
  const translateZ = '(var(--motion-height, 200px) / 2)';

  const custom = {
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
      keyframes: [{ offset: 0, opacity: 0 }, {}],
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
          transform: `perspective(800px)`,
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(800px) translateZ(calc(${translateZ}px * -1)) rotateX(-90deg) translateZ(calc(${translateZ}px)) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(800px) translateZ(calc(${translateZ}px * -1)) rotateX(0deg) translateZ(calc(${translateZ}px)) rotate(var(--comp-rotate-z, 0deg))`,
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
