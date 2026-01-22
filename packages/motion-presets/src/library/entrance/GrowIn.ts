import type { GrowIn, TimeAnimationOptions } from '../../types';
import { getCssUnits, INITIAL_FRAME_OFFSET, toKeyframeValue, getMapValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-growIn'];
}

const SCALE_MAP = {
  soft: 0.8,
  medium: 0.6,
  hard: 0,
};

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const {
    power,
    initialScale = 0,
    distance = { value: 120, type: 'percentage' },
    direction = 0,
  } = options.namedEffect as GrowIn;
  const [fadeIn, growIn] = getNames(options);

  const easing = options.easing || 'cubicInOut';
  const scale = getMapValue(SCALE_MAP, power, initialScale);
  const angleInRad = (direction * Math.PI) / 180;
  const unit = getCssUnits(distance.type);

  const x = `${(Math.sin(angleInRad) * distance.value) | 0}${unit}`;
  const y = `${(Math.cos(angleInRad) * distance.value * -1) | 0}${unit}`;

  const custom = {
    '--motion-translate-x': `${x}`,
    '--motion-translate-y': `${y}`,
    '--motion-scale': `${scale}`,
  };

  return [
    {
      ...options,
      easing,
      duration: options.duration! * scale,
      name: fadeIn,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      easing,
      name: growIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `translate(${toKeyframeValue(
            custom,
            '--motion-translate-x',
            asWeb,
          )}, ${toKeyframeValue(
            custom,
            '--motion-translate-y',
            asWeb,
          )}) rotate(var(--comp-rotate-z, 0deg)) scale(${toKeyframeValue(
            custom,
            '--motion-scale',
            asWeb,
          )})`,
        },
        {
          transform: 'translate(0px, 0px) rotate(var(--comp-rotate-z, 0deg)) scale(1)',
        },
      ],
    },
  ];
}
