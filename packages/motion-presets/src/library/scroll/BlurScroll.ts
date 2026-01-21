import type {
  AnimationFillMode,
  BlurScroll,
  ScrubAnimationOptions,
  DomApi,
} from '../../types';
import { toKeyframeValue } from '../../utils';

const BLUR_POWER_MAP = {
  soft: 6,
  medium: 25,
  hard: 50,
};

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-blurScroll'];
}

export function web(options: ScrubAnimationOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: ScrubAnimationOptions, asWeb = false) {
  const { blur = 6, power, range = 'in' } = options.namedEffect as BlurScroll;
  const blurFactor =
    power && BLUR_POWER_MAP[power] ? BLUR_POWER_MAP[power] : blur;

  const fromValue = range === 'out' ? 0 : blurFactor;
  const toValue = range === 'out' ? blurFactor : 0;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const [blurScroll] = getNames(options);

  const custom = {
    '--motion-blur-from': `${fromValue}px`,
    '--motion-blur-to': `${toValue}px`,
  };

  return [
    {
      ...options,
      name: blurScroll,
      fill,
      easing,
      composite: 'add' as const,
      custom,
      keyframes: [
        {
          filter: `blur(${toKeyframeValue(
            custom,
            '--motion-blur-from',
            asWeb,
          )})`,
        },
        {
          filter: `blur(${toKeyframeValue(custom, '--motion-blur-to', asWeb)})`,
        },
      ],
    },
  ];
}
