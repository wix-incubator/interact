import type {
  Jello,
  TimeAnimationOptions,
  DomApi,
  AnimationExtraOptions,
} from '../../types';
import { getTimingFactor, toKeyframeValue, mapRange } from '@wix/motion';

const POWER_TO_JELLO_FACTOR_MAP = {
  soft: 1,
  medium: 2,
  hard: 4,
};

const SKEW_Y_KEYFRAMES = [
  { keyframe: 24, skewY: 7 },
  { keyframe: 38, skewY: -2 },
  { keyframe: 58, skewY: 4 },
  { keyframe: 80, skewY: -2 },
  { keyframe: 100, skewY: 0 },
];

export function web(
  options: TimeAnimationOptions & AnimationExtraOptions,
  _dom?: DomApi,
) {
  return style(options, true);
}

export function style(
  options: TimeAnimationOptions & AnimationExtraOptions,
  asWeb = false,
) {
  const { power, intensity = 0.25 } = options.namedEffect as Jello;

  const duration = options.duration || 1;
  const delay = options.delay || 0;
  const [name] = getNames(options);
  const timingFactor = getTimingFactor(duration, delay) as number;

  const responsiveJelloFactor = mapRange(
    0,
    1,
    POWER_TO_JELLO_FACTOR_MAP.soft,
    POWER_TO_JELLO_FACTOR_MAP.hard,
    intensity,
  );
  const jelloFactor =
    (power && POWER_TO_JELLO_FACTOR_MAP[power]) || responsiveJelloFactor;

  // Create CSS custom properties for the jello configuration
  const custom: Record<string, string | number> = {
    '--motion-skew-y': jelloFactor,
  };

  const keyframes = SKEW_Y_KEYFRAMES.map(({ keyframe, skewY }) => {
    const offset = (keyframe / 100) * timingFactor;

    return {
      offset,
      transform: `rotateZ(var(--comp-rotate-z, 0deg)) skewY(calc(${toKeyframeValue(
        custom,
        '--motion-skew-y',
        asWeb,
      )} * ${skewY}deg))`,
    };
  });

  return [
    {
      ...options,
      name,
      delay: 0,
      easing: 'linear',
      duration: duration + delay,
      custom,
      keyframes,
    },
  ];
}

export function getNames(
  options: TimeAnimationOptions & AnimationExtraOptions,
) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true);

  return [`motion-jello-${timingFactor}`];
}
