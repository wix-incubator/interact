import type { TimeAnimationOptions, Breathe, DomApi, AnimationExtraOptions } from '../../types';
import {
  getCssUnits,
  getEasing,
  getEasingFamily,
  getTimingFactor,
  toKeyframeValue,
  getMapValue,
} from '../../utils';

const DEFAULT_DIRECTION = 'vertical';

const DIRECTION_MAP = {
  vertical: { x: 0, y: 1, z: 0 },
  horizontal: { x: 1, y: 0, z: 0 },
  center: { x: 0, y: 0, z: 1 },
};

const FACTORS_SEQUENCE = [
  { translateFactor: 1, timeFactor: 0.25 },
  { translateFactor: -1, timeFactor: 0.5 },
  { translateFactor: 1, timeFactor: 0.5 },
  { translateFactor: -0.7, timeFactor: 0.5 },
  { translateFactor: 0.6, timeFactor: 0.3333 },
];

export function web(options: TimeAnimationOptions & AnimationExtraOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions & AnimationExtraOptions, asWeb = false) {
  const { direction = DEFAULT_DIRECTION, distance = { value: 25, type: 'px' } } =
    options.namedEffect as Breathe;

  const easing = options.easing || 'sineInOut';
  const duration = options.duration || 1;
  const delay = options.delay || 0;
  const totalDurationWithDelay = 3.2 * duration + delay;
  const timingFactor = getTimingFactor(duration, totalDurationWithDelay - duration) as number;
  const [name] = getNames(options);

  const { x, y, z } = getMapValue(DIRECTION_MAP, direction, DIRECTION_MAP[DEFAULT_DIRECTION]);
  const ease = getEasingFamily(easing);
  const perspectiveTransform = direction === 'center' ? 'perspective(800px)' : '';

  // Create CSS custom properties for the Breathe configuration
  const custom: Record<string, string | number> = {
    '--motion-breathe-perspective': perspectiveTransform,
    '--motion-breathe-distance': `${distance.value}${getCssUnits(distance.type || 'px')}`,
    '--motion-breathe-x': x,
    '--motion-breathe-y': y,
    '--motion-breathe-z': z,
  };

  const breatheX = `${toKeyframeValue(custom, '--motion-breathe-x', asWeb)}`;
  const breatheY = `${toKeyframeValue(custom, '--motion-breathe-y', asWeb)}`;
  const breatheZ = `${toKeyframeValue(custom, '--motion-breathe-z', asWeb)}`;
  const breathePerspective = `${toKeyframeValue(
    custom,
    '--motion-breathe-perspective',
    asWeb,
    ' ',
  )}`;
  const breatheDistance = `${toKeyframeValue(custom, '--motion-breathe-distance', asWeb)}`;

  let currentOffset = 0;

  // in case a delay is applied, animate a different sequence which decays to a stop
  const keyframes = delay
    ? FACTORS_SEQUENCE.map(({ translateFactor, timeFactor }) => {
        const keyframeOffset = currentOffset + timeFactor * timingFactor;
        currentOffset = keyframeOffset;
        const distancePart = `${breatheDistance} * ${translateFactor}`;

        return {
          offset: keyframeOffset,
          easing: getEasing(ease.inOut),
          transform: `${breathePerspective} translate3d(calc(${breatheX} * ${distancePart}), calc(${breatheY} * ${distancePart}), calc(${breatheZ} * ${distancePart})) rotateZ(var(--comp-rotate-z, 0deg))`,
        };
      })
    : [
        {
          offset: 0.25,
          easing: getEasing(ease.inOut),
          transform: `${breathePerspective} translate3d(calc(${breatheX} * ${breatheDistance}), calc(${breatheY} * ${breatheDistance}), calc(${breatheZ} * ${breatheDistance})) rotateZ(var(--comp-rotate-z, 0deg))`,
        },
        {
          offset: 0.75,
          easing: getEasing(ease.in),
          transform: `${breathePerspective} translate3d(calc(${breatheX} * -1 * ${breatheDistance}), calc(${breatheY} * -1 * ${breatheDistance}), calc(${breatheZ} * -1 * ${breatheDistance})) rotateZ(var(--comp-rotate-z, 0deg))`,
        },
      ];

  return [
    {
      ...options,
      name,
      easing: 'linear',
      delay: 0,
      duration: delay ? totalDurationWithDelay : duration,
      custom,
      keyframes: [
        {
          offset: 0,
          easing: getEasing(ease.out),
          transform: `${breathePerspective} translate3d(0, 0, 0) rotateZ(var(--comp-rotate-z, 0deg))`,
        },
        ...keyframes,
        {
          offset: 1,
          transform: `${breathePerspective} translate3d(0, 0, 0) rotateZ(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
  ];
}

export function getNames(options: TimeAnimationOptions & AnimationExtraOptions) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true);

  return [`motion-breathe-${timingFactor}`];
}
