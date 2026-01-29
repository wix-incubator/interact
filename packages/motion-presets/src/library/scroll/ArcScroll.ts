import type { ScrubAnimationOptions, ArcScroll, AnimationFillMode, DomApi } from '../../types';
import { toKeyframeValue } from '../../utils';

const DEFAULT_ANGLE = 68;
const DEFAULT_DEPTH = 300;
const DEFAULT_PERSPECTIVE = 500;

const ROTATE_DIRECTION_MAP = {
  vertical: 'rotateX',
  horizontal: 'rotateY',
};

function getRangeValues(angle: number) {
  return {
    in: { fromValue: -angle, toValue: 0 },
    out: { fromValue: 0, toValue: angle },
    continuous: { fromValue: -angle, toValue: angle },
  };
}

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-arcScroll'];
}

export function web(options: ScrubAnimationOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: ScrubAnimationOptions, asWeb = false) {
  const {
    direction = 'horizontal',
    range = 'in',
    angle = DEFAULT_ANGLE,
    depth = DEFAULT_DEPTH,
    perspective = DEFAULT_PERSPECTIVE,
  } = options.namedEffect as ArcScroll;
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const rotateAxis = ROTATE_DIRECTION_MAP[direction];
  const rangeValues = getRangeValues(angle);
  const { fromValue, toValue } = rangeValues[range];
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
          transform: `perspective(${perspective}px) translateZ(${-depth}px) ${toKeyframeValue(
            custom,
            '--motion-arc-from',
            asWeb,
          )} translateZ(${depth}px) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0deg')})`,
        },
        {
          transform: `perspective(${perspective}px) translateZ(${-depth}px) ${toKeyframeValue(
            custom,
            '--motion-arc-to',
            asWeb,
          )} translateZ(${depth}px) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0deg')})`,
        },
      ],
    },
  ];
}
