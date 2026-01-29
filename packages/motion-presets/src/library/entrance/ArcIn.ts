import type { ArcIn, TimeAnimationOptions, EffectFourDirections, DomApi } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';

const DEFAULT_ANGLE = 80;
const DEFAULT_DEPTH = 300;
const DEFAULT_PERSPECTIVE = 800;

const DIRECTION_MAP: Record<EffectFourDirections, { x: number; y: number; sign: number }> = {
  top: { x: 1, y: 0, sign: 1 },
  right: { x: 0, y: 1, sign: 1 },
  bottom: { x: 1, y: 0, sign: -1 },
  left: { x: 0, y: 1, sign: -1 },
};

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-arcIn'];
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const {
    direction = 'right',
    angle = DEFAULT_ANGLE,
    depth = DEFAULT_DEPTH,
    perspective = DEFAULT_PERSPECTIVE,
  } = options.namedEffect as ArcIn;
  const [fadeIn, arcIn] = getNames(options);

  const easing = options.easing || 'quintInOut';

  const { x, y, sign } = DIRECTION_MAP[direction];
  const useCustomDepth = depth !== DEFAULT_DEPTH;
  const zValue = useCustomDepth
    ? `${depth}px`
    : `calc((-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2)`;
  const zValueNegative = useCustomDepth
    ? `${-depth}px`
    : `calc((var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0)) / 2)`;

  const custom = {
    '--motion-arc-x': `${x}`,
    '--motion-arc-y': `${y}`,
    '--motion-arc-sign': `${sign}`,
    '--motion-arc-angle': `${angle}`,
  };

  const angleValue = toKeyframeValue(custom, '--motion-arc-angle', asWeb);

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
          transform: `perspective(${perspective}px) translateZ(${zValue}) rotateX(calc(${toKeyframeValue(
            custom,
            '--motion-arc-x',
            asWeb,
          )} * ${toKeyframeValue(
            custom,
            '--motion-arc-sign',
            asWeb,
          )} * ${angleValue}deg)) rotateY(calc(${toKeyframeValue(
            custom,
            '--motion-arc-y',
            asWeb,
          )} * ${toKeyframeValue(
            custom,
            '--motion-arc-sign',
            asWeb,
          )} * ${angleValue}deg)) translateZ(${zValueNegative}) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(${perspective}px) translateZ(${zValue}) rotateX(0deg) rotateY(0deg) translateZ(${zValueNegative}) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
  ];
}

export function prepare(_: TimeAnimationOptions, dom?: DomApi) {
  if (dom) {
    let width: number, height: number;

    dom.measure((target) => {
      if (!target) {
        return;
      }

      const rect = target.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    });

    dom.mutate((target) => {
      target?.style.setProperty('--motion-height', `${height}px`);
      target?.style.setProperty('--motion-width', `${width}px`);
    });
  }
}
