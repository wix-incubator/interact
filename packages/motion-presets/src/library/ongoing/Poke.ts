import type { Poke, TimeAnimationOptions, DomApi, AnimationExtraOptions } from '../../types';
import { getTimingFactor, toKeyframeValue, mapRange, safeMapGet } from '../../utils';

const TRANSLATE_KEYFRAMES = [
  { keyframe: 17, translate: 7 },
  { keyframe: 32, translate: 25 },
  { keyframe: 48, translate: 8 },
  { keyframe: 56, translate: 11 },
  { keyframe: 66, translate: 25 },
  { keyframe: 83, translate: 4 },
  { keyframe: 100, translate: 0 },
];

const POWER_TO_POKE_FACTOR_MAP = {
  soft: 1,
  medium: 2,
  hard: 4,
};

const DIRECTION_MAP = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
};

export function web(options: TimeAnimationOptions & AnimationExtraOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions & AnimationExtraOptions, asWeb = false) {
  const { power, intensity = 0.5, direction: rawDirection = 'right' } = options.namedEffect as Poke;

  const duration = options.duration || 1;
  const delay = +(options.delay || 0);
  const { x, y } = safeMapGet(DIRECTION_MAP, rawDirection, 'right');
  const timingFactor = getTimingFactor(duration, delay) as number;
  const [name] = getNames(options);

  const responsivePokeFactor = mapRange(
    0,
    1,
    POWER_TO_POKE_FACTOR_MAP.soft,
    POWER_TO_POKE_FACTOR_MAP.hard,
    intensity,
  );

  const pokeFactor = power ? safeMapGet(POWER_TO_POKE_FACTOR_MAP, power, 'medium') : responsivePokeFactor;

  // Create CSS custom properties for the poke configuration
  const custom: Record<string, string | number> = {
    '--motion-translate-x': x * pokeFactor,
    '--motion-translate-y': y * pokeFactor,
  };

  const keyframes = TRANSLATE_KEYFRAMES.map(({ keyframe, translate }) => {
    const translateValue = `calc(${toKeyframeValue(
      custom,
      '--motion-translate-x',
      asWeb,
    )} * ${translate}px) calc(${toKeyframeValue(
      custom,
      '--motion-translate-y',
      asWeb,
    )} * ${translate}px)`;

    return {
      offset: (keyframe / 100) * timingFactor,
      translate: translateValue,
    };
  });

  return [
    {
      ...options,
      name,
      easing: 'linear',
      delay: 0,
      duration: duration + delay,
      custom,
      keyframes,
    },
  ];
}

export function getNames(options: TimeAnimationOptions & AnimationExtraOptions) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true) as string;

  return [`motion-poke-${timingFactor}`];
}
