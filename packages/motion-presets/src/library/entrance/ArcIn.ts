import type {
  ArcIn,
  TimeAnimationOptions,
  EffectFourDirections,
  DomApi,
} from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue } from '@wix/motion';

const ROTATION_ANGLE = 80;
const DIRECTION_MAP: Record<
  EffectFourDirections,
  { x: number; y: number; sign: number }
> = {
  top: { x: 1, y: 0, sign: 1 },
  right: { x: 0, y: 1, sign: 1 },
  bottom: { x: 1, y: 0, sign: -1 },
  left: { x: 0, y: 1, sign: -1 },
};

const EASING_MAP = {
  soft: 'cubicInOut',
  medium: 'quintInOut',
  hard: 'backOut',
};

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-arcIn'];
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { power, direction = 'right' } = options.namedEffect as ArcIn;
  const [fadeIn, arcIn] = getNames(options);

  const easing = (power && EASING_MAP[power]) || options.easing || 'quintInOut';

  // we can remove dependency on measurement here if we use a "layout wrapper" as a `container`: https://jsbin.com/mulojuwogi/edit?css,output
  // we could also consider a fixed value for z, e.g. 300px like in ArcScroll
  // const { width, height } = element.getBoundingClientRect();

  const { x, y, sign } = DIRECTION_MAP[direction];
  // const z = rotateX ? height / 2 : width / 2;
  const z = `(-1 * (var(--motion-height, 100vh) * var(--motion-arc-x, 1) + var(--motion-width, 100vw) * var(--motion-arc-y, 0))) / 2`;

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
      keyframes: [
        { offset: 0, opacity: 0 },
        { opacity: 'var(--comp-opacity, 1)' },
      ],
    },
    {
      ...options,
      name: arcIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `perspective(800px) translateZ(calc(${z})) rotateX(calc(${toKeyframeValue(
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
          )} * ${ROTATION_ANGLE}deg)) translateZ(calc(-1 * ${z})) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `perspective(800px) translateZ(calc(${z})) rotateX(0deg) rotateY(0deg) translateZ(calc(-1 * ${z})) rotate(var(--comp-rotate-z, 0deg))`,
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
