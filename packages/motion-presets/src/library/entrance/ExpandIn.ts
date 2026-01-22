import type { DomApi, ExpandIn, TimeAnimationOptions } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, getMapValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-expandIn'];
}

const SCALE_MAP = {
  soft: 0.8,
  medium: 0.6,
  hard: 0,
};

const TRANSFORM_ORIGIN_MAP = {
  top: { x: 0, y: -0.5 },
  'top-right': { x: 0.5, y: -0.5 },
  right: { x: 0.5, y: 0 },
  'bottom-right': { x: 0.5, y: 0.5 },
  bottom: { x: 0, y: 0.5 },
  'bottom-left': { x: -0.5, y: 0.5 },
  left: { x: -0.5, y: 0 },
  'top-left': { x: -0.5, y: -0.5 },
  center: { x: 0, y: 0 },
};

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

const DEFAULT_DIRECTION = 'center';

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { power, initialScale = 0, direction = DEFAULT_DIRECTION } = options.namedEffect as ExpandIn;
  const [fadeIn, expandIn] = getNames(options);

  const easing = options.easing || 'cubicInOut';
  const scale_ = getMapValue(SCALE_MAP, power, initialScale);
  const { x, y } = getMapValue(TRANSFORM_ORIGIN_MAP, direction, TRANSFORM_ORIGIN_MAP[DEFAULT_DIRECTION]);

  const custom = {
    '--motion-translate-x': x,
    '--motion-translate-y': y,
    '--motion-scale': scale_,
  };

  const transX = toKeyframeValue(custom, '--motion-translate-x', asWeb);
  const transY = toKeyframeValue(custom, '--motion-translate-y', asWeb);
  const scale = toKeyframeValue(custom, '--motion-scale', asWeb);

  return [
    {
      ...options,
      name: fadeIn,
      easing: 'linear',
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      name: expandIn,
      easing,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          transform: `translateX(calc(var(--motion-width, 100%) * ${transX})) translateY(calc(var(--motion-height, 100%) * ${transY})) scale(${scale}) translateX(calc(var(--motion-width, 100%) * -1 * ${transX})) translateY(calc(var(--motion-height, 100%) * -1 * ${transY}))  rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          transform: `translateX(calc(var(--motion-width, 100%) * ${transX})) translateY(calc(var(--motion-height, 100%) * ${transY})) scale(1) translateX(calc(var(--motion-width, 100%) * -1 * ${transX})) translateY(calc(var(--motion-height, 100%) * -1 * ${transY})) rotate(var(--comp-rotate-z, 0deg))`,
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
      target?.style.setProperty('--motion-width', `${width}px`);
      target?.style.setProperty('--motion-height', `${height}px`);
    });
  }
}
