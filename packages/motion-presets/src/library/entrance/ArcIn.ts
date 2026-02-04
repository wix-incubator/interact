import type { ArcIn, TimeAnimationOptions, EffectFourDirections, DomApi } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, parseDirection, parseLength } from '../../utils';

const ROTATION_ANGLE = 80;
const DEFAULT_DIRECTION: EffectFourDirections = 'right';
const DEFAULT_DEPTH = { value: 200, type: 'px' };
const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const;

const DIRECTION_MAP: Record<EffectFourDirections, { x: number; y: number; sign: number }> = {
  top: { x: 1, y: 0, sign: 1 },
  right: { x: 0, y: 1, sign: 1 },
  bottom: { x: 1, y: 0, sign: -1 },
  left: { x: 0, y: 1, sign: -1 },
};

export function web(options: TimeAnimationOptions, _dom?: DomApi) {
  return style(options, true);
}

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-arcIn'];
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const namedEffect = options.namedEffect as ArcIn;
  const direction = parseDirection(
    namedEffect.direction,
    DIRECTIONS,
    DEFAULT_DIRECTION,
  ) as EffectFourDirections;

  const depth = parseLength(namedEffect.depth, DEFAULT_DEPTH);
  const [fadeIn, arcIn] = getNames(options);

  const easing = options.easing || 'quintInOut';

  const { x, y, sign } = DIRECTION_MAP[direction];
  const depthValue = `${depth.value}${depth.type === 'percentage' ? '%' : depth.type}`;
  const zValue = `calc(-1 * ${depthValue} / 2)`;
  const zValueNegative = `calc(${depthValue} / 2)`;

  const custom = {
    '--motion-arc-x': `${x}`,
    '--motion-arc-y': `${y}`,
    '--motion-arc-sign': `${sign}`,
  };

  return [
    {
      ...options,
      name: fadeIn,
      duration: options.duration! * 0.7,
      easing: 'sineIn',
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, {}],
    },
    {
      ...options,
      name: arcIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(800px) translateZ(${zValue}) rotateX(calc(${toKeyframeValue(
            custom,
            '--motion-arc-x',
            asWeb,
          )} * ${toKeyframeValue(
            custom,
            '--motion-arc-sign',
            asWeb,
          )} * ${ROTATION_ANGLE}deg)) rotateY(calc(${toKeyframeValue(
            custom,
            '--motion-arc-y',
            asWeb,
          )} * ${toKeyframeValue(
            custom,
            '--motion-arc-sign',
            asWeb,
          )} * ${ROTATION_ANGLE}deg)) translateZ(${zValueNegative}) rotate(var(--motion-rotate, 0deg))`,
        },
        {
          transform: `perspective(800px) translateZ(${zValue}) rotateX(0deg) rotateY(0deg) translateZ(${zValueNegative}) rotate(var(--motion-rotate, 0deg))`,
        },
      ],
    },
  ];
}
