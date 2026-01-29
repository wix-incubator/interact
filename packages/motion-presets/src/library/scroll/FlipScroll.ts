import type { AnimationFillMode, FlipScroll, ScrubAnimationOptions, DomApi } from '../../types';
import { toKeyframeValue } from '../../utils';

const ROTATE_DIRECTION_MAP = {
  vertical: 'rotateX',
  horizontal: 'rotateY',
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
    range = 'continuous',
  } = options.namedEffect as FlipScroll;

  const rotationAxis = ROTATE_DIRECTION_MAP[direction];

  const fromValue = range === 'out' ? 0 : -rotate;
  const toValue = range === 'in' ? 0 : rotate;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const [flipScroll] = getNames(options);

  const custom = {
    '--motion-flip-from': `${rotationAxis}(${fromValue}deg)`,
    '--motion-flip-to': `${rotationAxis}(${toValue}deg)`,
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
