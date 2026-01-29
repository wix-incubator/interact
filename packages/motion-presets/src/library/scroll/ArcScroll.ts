import type { ScrubAnimationOptions, ArcScroll, AnimationFillMode, DomApi } from '../../types';
import { toKeyframeValue } from '../../utils';

const ROTATION = 68;

const ROTATE_DIRECTION_MAP = {
  vertical: 'rotateX',
  horizontal: 'rotateY',
};

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-arcScroll'];
}

export function web(options: ScrubAnimationOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: ScrubAnimationOptions, asWeb = false) {
  const { direction = 'horizontal', range = 'in' } = options.namedEffect as ArcScroll;
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const rotateAxis = ROTATE_DIRECTION_MAP[direction];
  const fromValue = range === 'out' ? 0 : -ROTATION;
  const toValue = range === 'in' ? 0 : ROTATION;
  const easing = 'linear';

  const [arcScroll] = getNames(options);

  const custom = {
    '--motion-arc-from': `${rotateAxis}(${fromValue}deg)`,
    '--motion-arc-to': `${rotateAxis}(${toValue}deg)`,
  };

  return [
    {
      ...options,
      name: arcScroll,
      fill,
      easing,
      custom,
      keyframes: [
        {
          transform: `perspective(500px) translateZ(-300px) ${toKeyframeValue(
            custom,
            '--motion-arc-from',
            asWeb,
          )} translateZ(300px) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0deg')})`,
        },
        {
          transform: `perspective(500px) translateZ(-300px) ${toKeyframeValue(
            custom,
            '--motion-arc-to',
            asWeb,
          )} translateZ(300px) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0deg')})`,
        },
      ],
    },
  ];
}
