import type {
  AnimationFillMode,
  ScrubAnimationOptions,
  SpinScroll,
  DomApi,
} from '../../types';
import { toKeyframeValue } from '../../utils';

const POWER_MAP = {
  soft: 1,
  medium: 0.7,
  hard: 0.4,
};

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-spinScroll'];
}

export function web(options: ScrubAnimationOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: ScrubAnimationOptions, asWeb = false) {
  const {
    spins = 0.15,
    scale = 1,
    direction = 'clockwise',
    power,
    range = 'in',
  } = options.namedEffect as SpinScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const rotationZ = 360 * spins;
  const scaleFactor = power && POWER_MAP[power] ? POWER_MAP[power] : scale;

  const isIn = range === 'in';
  const fromValue = isIn ? -rotationZ : range === 'out' ? 0 : -rotationZ / 2;
  const toValue = isIn ? 0 : range === 'out' ? rotationZ : rotationZ / 2;
  const spinDirection = direction === 'clockwise' ? 1 : -1;

  const [spinScroll] = getNames(options);

  const custom = {
    '--motion-spin-from': `${spinDirection * fromValue}deg`,
    '--motion-spin-to': `${spinDirection * toValue}deg`,
    '--motion-spin-scale-from': isIn ? scaleFactor : 1,
    '--motion-spin-scale-to': isIn ? 1 : scaleFactor,
  };

  return [
    {
      ...options,
      name: spinScroll,
      fill,
      easing,
      custom,
      keyframes: [
        {
          transform: `scale(${toKeyframeValue(
            custom,
            '--motion-spin-scale-from',
            asWeb,
          )}) rotate(calc(${toKeyframeValue(
            {},
            '--comp-rotate-z',
            false,
            '0deg',
          )} + ${toKeyframeValue(custom, '--motion-spin-from', asWeb)}))`,
        },
        {
          transform: `scale(${toKeyframeValue(
            custom,
            '--motion-spin-scale-to',
            asWeb,
          )}) rotate(calc(${toKeyframeValue(
            {},
            '--comp-rotate-z',
            false,
            '0deg',
          )} + ${toKeyframeValue(custom, '--motion-spin-to', asWeb)}))`,
        },
      ],
    },
  ];
}
