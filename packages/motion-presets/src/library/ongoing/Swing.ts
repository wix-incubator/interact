import type { Swing, TimeAnimationOptions, DomApi, AnimationExtraOptions } from '../../types';
import { getEasing, getEasingFamily, getTimingFactor, toKeyframeValue } from '../../utils';

const DIRECTION_MAP = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

const TRANSLATE_DISTANCE = 50;

const FACTORS_SEQUENCE = [
  { factor: 1, timeFactor: 0.25 },
  { factor: -1, timeFactor: 0.5 },
  { factor: 0.6, timeFactor: 0.5 },
  { factor: -0.3, timeFactor: 0.5 },
  { factor: 0.2, timeFactor: 0.5 },
  { factor: -0.05, timeFactor: 0.5 },
  { factor: 0, timeFactor: 0.4 },
];

export function web(options: TimeAnimationOptions & AnimationExtraOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions & AnimationExtraOptions, asWeb = false) {
  const { swing = 20, direction = 'top' } = options.namedEffect as Swing;

  const duration = options.duration || 1;
  const delay = options.delay || 0;
  const easing = options.easing || 'sineInOut';
  const ease = getEasingFamily(easing);
  const [name] = getNames(options);

  const { x, y } = DIRECTION_MAP[direction];
  const totalDuration = 3.55 * duration + delay;
  const timingFactor = getTimingFactor(duration, totalDuration - duration) as number;

  const custom: Record<string, string | number> = {
    '--motion-swing-deg': `${swing}deg`,
    '--motion-trans-x': `${x * TRANSLATE_DISTANCE}%`,
    '--motion-trans-y': `${y * TRANSLATE_DISTANCE}%`,
    '--motion-ease-in': getEasing(ease.in),
    '--motion-ease-inout': getEasing(ease.inOut),
    '--motion-ease-out': getEasing(ease.out),
  };

  const translateBefore = `translate(${toKeyframeValue(
    custom,
    '--motion-trans-x',
    asWeb,
  )}, ${toKeyframeValue(custom, '--motion-trans-y', asWeb)})`;

  const translateAfter = `translate(calc(${toKeyframeValue(
    custom,
    '--motion-trans-x',
    asWeb,
  )} * -1), calc(${toKeyframeValue(custom, '--motion-trans-y', asWeb)} * -1))`;

  let currentOffset = 0;
  const keyframes = delay
    ? FACTORS_SEQUENCE.map(({ factor, timeFactor }) => {
        const keyframeOffset = currentOffset + timeFactor * timingFactor;
        currentOffset = keyframeOffset;

        return {
          offset: keyframeOffset,
          easing: toKeyframeValue(custom, '--motion-ease-inout', asWeb),
          transform: `rotate(var(--comp-rotate-z, 0deg)) ${translateBefore} rotate(calc(${toKeyframeValue(
            custom,
            '--motion-swing-deg',
            asWeb,
          )} * ${factor})) ${translateAfter}`,
        };
      })
    : [
        {
          offset: 0.25,
          easing: toKeyframeValue(custom, '--motion-ease-inout', asWeb),
          transform: `rotate(var(--comp-rotate-z, 0deg)) ${translateBefore} rotate(${toKeyframeValue(
            custom,
            '--motion-swing-deg',
            asWeb,
          )}) ${translateAfter}`,
        },
        {
          offset: 0.75,
          easing: toKeyframeValue(custom, '--motion-ease-in', asWeb),
          transform: `rotate(var(--comp-rotate-z, 0deg)) ${translateBefore} rotate(calc(${toKeyframeValue(
            custom,
            '--motion-swing-deg',
            asWeb,
          )} * -1)) ${translateAfter}`,
        },
      ];

  return [
    {
      ...options,
      name,
      easing: 'linear',
      delay: 0,
      duration: delay ? totalDuration : duration,
      custom,
      keyframes: [
        {
          offset: 0,
          easing: toKeyframeValue(custom, '--motion-ease-out', asWeb),
          transform: `rotateZ(var(--comp-rotate-z, 0deg)) ${translateBefore} rotate(0deg) ${translateAfter}`,
        },
        ...keyframes,
        {
          offset: 1,
          transform: `rotateZ(var(--comp-rotate-z, 0deg)) ${translateBefore} rotate(0deg) ${translateAfter}`,
        },
      ],
    },
  ];
}

export function getNames(options: TimeAnimationOptions & AnimationExtraOptions) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true);

  return [`motion-swing-${timingFactor}`];
}
