import type { TimeAnimationOptions, DropIn } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, safeMapGet } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-dropIn'];
}

const PARAMS_MAP = {
  soft: { scale: 1.2, ease: 'cubicInOut' },
  medium: { scale: 1.6, ease: 'quintInOut' },
  hard: { scale: 2, ease: 'backOut' },
};

export function web(options: TimeAnimationOptions) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { power, initialScale = PARAMS_MAP.medium.scale } = options.namedEffect as DropIn;
  const [fadeIn, dropIn] = getNames(options);

  const powerParams = power ? safeMapGet(PARAMS_MAP, power, 'medium') : null;
  const scale = powerParams?.scale ?? initialScale;
  const easing = powerParams?.ease ?? options.easing ?? 'quintInOut';

  const custom = {
    '--motion-scale': `${scale}`,
  };

  return [
    {
      ...options,
      name: fadeIn,
      easing: 'quadOut',
      duration: options.duration! * 0.8,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      name: dropIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          scale: toKeyframeValue(custom, '--motion-scale', asWeb),
        },
        {
          scale: '1',
        },
      ],
    },
  ];
}
