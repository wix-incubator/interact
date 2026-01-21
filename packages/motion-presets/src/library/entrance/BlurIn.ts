import type { BlurIn, TimeAnimationOptions } from '../../types';
import { toKeyframeValue, safeMapGet } from '../../utils';

const BLUR_POWER_MAP = {
  soft: 6,
  medium: 25,
  hard: 50,
};

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-blurIn'];
}

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { blur = 6, power } = options.namedEffect as BlurIn;
  const [fadeIn, blurIn] = getNames(options);

  const easing = options.easing || 'linear';
  const blurFactor = power ? safeMapGet(BLUR_POWER_MAP, power, 'medium') : blur;

  const custom = {
    '--motion-blur': `${blurFactor}px`,
  };

  return [
    {
      ...options,
      name: fadeIn,
      duration: options.duration! * 0.7,
      easing: 'sineIn',
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      name: blurIn,
      easing,
      composite: 'add' as const, // make sure we don't override existing filters on the component
      custom,
      keyframes: [
        {
          filter: `blur(${toKeyframeValue(custom, '--motion-blur', asWeb)})`,
        },
        {
          filter: 'blur(0px)',
        },
      ],
    },
  ];
}
