import type {
  Pulse,
  TimeAnimationOptions,
  DomApi,
  AnimationExtraOptions,
} from '../../types';
import { getTimingFactor, toKeyframeValue, mapRange } from '@wix/motion';

const POWER_TO_PULSE_OFFSET_MAP = {
  soft: 0,
  medium: 0.06,
  hard: 0.12,
};

const SCALE_KEYFRAMES = [
  { keyframe: 27, scale: 0.96 },
  { keyframe: 45, scale: 1 },
  { keyframe: 72, scale: 0.93 },
  { keyframe: 100, scale: 1 },
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
  const { power, intensity = 0 } = options.namedEffect as Pulse;

  const duration = options.duration || 1;
  const delay = options.delay || 0;
  const timingFactor = getTimingFactor(duration, delay) as number;
  const [name] = getNames(options);

  const responsivePulseOffset = mapRange(
    0,
    1,
    POWER_TO_PULSE_OFFSET_MAP.soft,
    POWER_TO_PULSE_OFFSET_MAP.hard,
    intensity,
  );

  const pulseOffset =
    typeof power !== 'undefined'
      ? POWER_TO_PULSE_OFFSET_MAP[power]
      : responsivePulseOffset;

  // Create CSS custom properties for the pulse configuration
  const custom: Record<string, string | number> = {
    '--motion-pulse-offset': pulseOffset,
  };

  const keyframes = SCALE_KEYFRAMES.map(({ keyframe, scale }) => {
    const offset = (keyframe / 100) * timingFactor;

    return {
      offset,
      transform: `scale(${
        scale < 1
          ? `calc(${scale} - ${toKeyframeValue(
              custom,
              '--motion-pulse-offset',
              asWeb,
            )})`
          : '1'
      })`,
    };
  });

  if (timingFactor < 1) {
    keyframes.push({
      offset: 1,
      transform: 'scale(1)',
    });
  }

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

export function getNames(
  options: TimeAnimationOptions & AnimationExtraOptions,
) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true);

  return [`motion-pulse-${timingFactor}`];
}
