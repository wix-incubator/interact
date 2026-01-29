import type { TimeAnimationOptions, GlideIn } from '../../types';
import { getCssUnits, INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-glideIn'];
}

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const {
    direction = 270,
    distance = { value: 100, type: 'percentage' },
  } = options.namedEffect as GlideIn;
  const [glideIn] = getNames(options);

  const angleInRad = (direction * Math.PI) / 180;
  const unit = getCssUnits(distance.type);

  const easing = options.easing || 'quintInOut';

  const translateX = `${(Math.sin(angleInRad) * distance.value) | 0}${unit}`;
  const translateY = `${(Math.cos(angleInRad) * distance.value * -1) | 0}${unit}`;

  const custom = {
    '--motion-translate-x': `${translateX}`,
    '--motion-translate-y': `${translateY}`,
  };

  return [
    {
      ...options,
      name: glideIn,
      easing,
      custom,
      keyframes: [
        {
          offset: 0,
          opacity: 0,
          easing: 'step-end',
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          opacity: 'var(--comp-opacity, 1)',
          transform: `translate(${toKeyframeValue(
            custom,
            '--motion-translate-x',
            asWeb,
          )}, ${toKeyframeValue(
            custom,
            '--motion-translate-y',
            asWeb,
          )}) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
        },
      ],
    },
  ];
}
