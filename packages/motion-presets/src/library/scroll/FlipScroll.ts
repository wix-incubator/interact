import type { AnimationFillMode, FlipScroll, ScrubAnimationOptions, DomApi } from '../../types';
import { toKeyframeValue, parseDirection } from '../../utils';
import { AXIS_DIRECTIONS } from '../../consts';

type FlipScrollDirection = 'vertical' | 'horizontal';
const DEFAULT_DIRECTION: FlipScrollDirection = 'horizontal';

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
  const namedEffect = options.namedEffect as FlipScroll;
  const direction = parseDirection(
    namedEffect.direction,
    AXIS_DIRECTIONS,
    DEFAULT_DIRECTION,
  ) as FlipScrollDirection;
  const { rotate = 240, range = 'continuous' } = namedEffect;

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
          )} rotate(${toKeyframeValue({}, '--motion-rotate', false, '0deg')})`,
        },
        {
          transform: `perspective(800px) ${toKeyframeValue(
            custom,
            '--motion-flip-to',
            asWeb,
          )} rotate(${toKeyframeValue({}, '--motion-rotate', false, '0deg')})`,
        },
      ],
    },
  ];
}
