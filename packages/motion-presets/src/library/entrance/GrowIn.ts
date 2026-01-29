import type { GrowIn, TimeAnimationOptions } from '../../types';
import { getCssUnits, INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-growIn'];
}

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const {
    initialScale = 0,
    distance = { value: 120, type: 'percentage' },
    direction = 90,
  } = options.namedEffect as GrowIn;
  const [fadeIn, growIn] = getNames(options);

  const easing = options.easing || 'cubicInOut';
  const angleInRad = (direction * Math.PI) / 180;
  const unit = getCssUnits(distance.type);

  const x = `${(Math.cos(angleInRad) * distance.value) | 0}${unit}`;
  const y = `${(Math.sin(angleInRad) * distance.value * -1) | 0}${unit}`;

  const custom = {
    '--motion-translate-x': `${x}`,
    '--motion-translate-y': `${y}`,
    '--motion-scale': `${initialScale}`,
  };

  return [
    {
      ...options,
      easing,
      duration: options.duration! * initialScale,
      name: fadeIn,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, {}],
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
