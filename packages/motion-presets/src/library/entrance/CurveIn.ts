import type { CurveIn, TimeAnimationOptions, DomApi } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, parseDirection, parseLength } from '../../utils';

type CurveInDirection = 'left' | 'right' | 'pseudoLeft' | 'pseudoRight';

const DEFAULT_DIRECTION: CurveInDirection = 'right';
const DEFAULT_DEPTH = { value: 300, type: 'px' };
const ALLOWED_DIRECTION_KEYWORDS = ['left', 'right', 'pseudoLeft', 'pseudoRight'] as const;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-curveIn', 'motion-fadeIn'];
}

const PARAMS_MAP = {
  pseudoRight: { rotationX: '180', rotationY: '0' },
  right: { rotationX: '0', rotationY: '180' },
  pseudoLeft: { rotationX: '-180', rotationY: '0' },
  left: { rotationX: '0', rotationY: '-180' },
};

export function web(options: TimeAnimationOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const namedEffect = options.namedEffect as CurveIn;
  const direction = parseDirection(
    namedEffect.direction,
    ALLOWED_DIRECTION_KEYWORDS,
    DEFAULT_DIRECTION,
  ) as CurveInDirection;
  const depth = parseLength(namedEffect.depth, DEFAULT_DEPTH);
  const [curveIn, fadeIn] = getNames(options);

  const { rotationX, rotationY } = PARAMS_MAP[direction];
  const depthValue = `${depth.value}${depth.type === 'percentage' ? '%' : depth.type}`;

  const custom = {
    '--motion-rotate-x': `${rotationX}deg`,
    '--motion-rotate-y': `${rotationY}deg`,
  };

  const easing = 'quadOut';

  return [
    {
      ...options,
      name: curveIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(200px) translateZ(calc(${depthValue} * -3)) rotateX(${toKeyframeValue(
            custom,
            '--motion-rotate-x',
            asWeb,
          )}) rotateY(${toKeyframeValue(
            custom,
            '--motion-rotate-y',
            asWeb,
          )}) translateZ(calc(${depthValue} * 3)) rotateZ(var(--motion-rotate, 0deg))`,
        },
        {
          transform: `perspective(200px) translateZ(calc(${depthValue} * -3)) rotateX(0deg) rotateY(0deg) translateZ(calc(${depthValue} * 3)) rotateZ(var(--motion-rotate, 0deg))`,
        },
      ],
    },
    {
      ...options,
      name: fadeIn,
      easing,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, {}],
    },
  ];
}
