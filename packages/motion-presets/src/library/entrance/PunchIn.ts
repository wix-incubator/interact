import { getEasingFamily, getEasing, toKeyframeValue, INITIAL_FRAME_OFFSET, getMapValue } from '../../utils';
import type { PunchIn, TimeAnimationOptions, DomApi } from '../../types';
import { cssEasings as easings } from '@wix/motion';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-fadeIn', 'motion-punchIn'];
}

const TRANSLATION_FACTORS_MAP: Record<PunchIn['direction'], { x: number; y: number }> = {
  'top-left': { y: -1, x: -1 },
  'top-right': { y: -1, x: 1 },
  'bottom-right': { y: 1, x: 1 },
  'bottom-left': { y: 1, x: -1 },
  center: { y: 0, x: 0 },
};

const POWER_MAP = {
  soft: 'sineIn',
  medium: 'quadIn',
  hard: 'quintIn',
};

const DEFAULT_DIRECTION = 'top-right';
const DEFAULT_POWER = 'medium';

function getMidPoint(x: number, y: number, factor: number) {
  return {
    x: `calc(var(--motion-width, 100%) * 1.1 / 3 * ${x} * ${factor})`,
    y: `calc(var(--motion-height, 100%) * 1.1 / 3 * ${y} * ${factor})`,
  };
}

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = DEFAULT_DIRECTION, power = DEFAULT_POWER } = options.namedEffect as PunchIn;
  const [fadeIn, punchIn] = getNames(options);
  const translationFactors = getMapValue(TRANSLATION_FACTORS_MAP, direction, TRANSLATION_FACTORS_MAP[DEFAULT_DIRECTION]);
  const easing = getMapValue(POWER_MAP, power, POWER_MAP[DEFAULT_POWER]);

  const sourcePoint = {
    x: `calc(var(--motion-width, 100%) * 1.1 / 2 * ${translationFactors.x})`,
    y: `calc(var(--motion-height, 100%) * 1.1 / 2 * ${translationFactors.y})`,
  };

  const { in: _in, out: _out } = getEasingFamily(easing);

  const KEYFRAMES = [
    { offset: 30, scale: 0.3, factor: 1, ease: 'linear' },
    { offset: 45, scale: 1.4, factor: -0.4, ease: _out },
    { offset: 62.65, scale: 0.8, factor: 0.2, ease: _in },
    { offset: 77.27, scale: 1.1, factor: -0.1, ease: _out },
    { offset: 86.23, scale: 0.94, factor: 0.06, ease: _in },
    { offset: 91.73, scale: 1.03, factor: -0.03, ease: _out },
    { offset: 95.11, scale: 0.98, factor: 0.02, ease: _in },
    { offset: 97.18, scale: 1.01, factor: -0.01, ease: _out },
    { offset: 98.45, scale: 0.99, factor: 0.01, ease: _in },
    { offset: 100, scale: 1, factor: 0, ease: _out },
  ];

  const keyframes = KEYFRAMES.map(({ offset, scale, ease, factor }) => {
    const { x, y } = getMidPoint(translationFactors.x, translationFactors.y, factor);

    return {
      offset: offset / 100,
      easing: getEasing(ease),
      scale: `${scale}`,
      translate: `${x} ${y}`,
    };
  });

  const custom = {
    '--motion-translate': `${sourcePoint.x} ${sourcePoint.y}`,
  };

  return [
    {
      ...options,
      easing: 'cubicIn',
      duration: options.duration! * 0.3,
      name: fadeIn,
      custom: {},
      keyframes: [{ offset: 0, opacity: 0 }, { opacity: 'var(--comp-opacity, 1)' }],
    },
    {
      ...options,
      easing: 'linear',
      name: punchIn,
      custom,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          translate: toKeyframeValue(custom, '--motion-translate', asWeb),
          scale: '0',
          // TODO: refactor easings
          easing: easings.expoIn,
        },
        ...keyframes,
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
