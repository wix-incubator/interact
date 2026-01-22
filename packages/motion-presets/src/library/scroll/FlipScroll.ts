import type { AnimationFillMode, FlipScroll, ScrubAnimationOptions, DomApi } from '../../types';
import { toKeyframeValue } from '../../utils';

const ROTATE_POWER_MAP = {
  soft: 60,
  medium: 120,
  hard: 420,
};

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-flipScroll'];
}

export function web(options: ScrubAnimationOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: ScrubAnimationOptions, asWeb = false) {
  const {
    rotate = 240,
    direction = 'horizontal',
    power,
    range = 'continuous',
  } = options.namedEffect as FlipScroll;

  const rotAxisString = `rotate${direction === 'vertical' ? 'X' : 'Y'}`;
  const flipValue = power && ROTATE_POWER_MAP[power] ? ROTATE_POWER_MAP[power] : rotate;

  const fromValue = range === 'out' ? 0 : -flipValue;
  const toValue = range === 'in' ? 0 : flipValue;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const [flipScroll] = getNames(options);

  const custom = {
    '--motion-flip-from': `${rotAxisString}(${fromValue}deg)`,
    '--motion-flip-to': `${rotAxisString}(${toValue}deg)`,
  };

  return [
    {
      ...options,
      name: flipScroll,
      fill,
      easing,
      custom,
      keyframes: [
        {
          transform: `perspective(800px) ${toKeyframeValue(
            custom,
            '--motion-flip-from',
            asWeb,
          )} rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0deg')})`,
        },
        {
          transform: `perspective(800px) ${toKeyframeValue(
            custom,
            '--motion-flip-to',
            asWeb,
          )} rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0deg')})`,
        },
      ],
    },
  ];
}
