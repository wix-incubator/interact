import type {
  TurnScroll,
  ScrubAnimationOptions,
  DomApi,
  AnimationFillMode,
} from '../../types';
import { toKeyframeValue } from '../../utils';

const ELEMENT_ROTATION = 45;

const POWER_MAP = {
  soft: { scaleFrom: 1, scaleTo: 1 },
  medium: { scaleFrom: 0.7, scaleTo: 1.3 },
  hard: { scaleFrom: 0.4, scaleTo: 1.6 },
};

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-turnScroll'];
}

export function prepare(_: ScrubAnimationOptions, dom?: DomApi) {
  if (dom) {
    let left = 0;
    dom.measure((target) => {
      if (!target) {
        return;
      }
      left = target.getBoundingClientRect().left;
    });
    dom.mutate((target) => {
      target?.style.setProperty('--motion-left', `${left}px`);
    });
  }
}

export function web(options: ScrubAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function style(options: ScrubAnimationOptions, asWeb = false) {
  const {
    power,
    spin = 'clockwise',
    direction = 'right',
    scale = 1,
    range = 'in',
  } = options.namedEffect as TurnScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const startXLeft = `calc(-1 * ${toKeyframeValue(
    {},
    '--motion-left',
    false,
    'calc(100vw - 100%)',
  )} - 100%)`;
  const endXLeft = `calc(100vw - ${toKeyframeValue(
    {},
    '--motion-left',
    false,
    '0px',
  )})`;
  const [startX, endX] =
    direction === 'left' ? [startXLeft, endXLeft] : [endXLeft, startXLeft];

  const rotate =
    spin === 'clockwise' ? ELEMENT_ROTATION : -1 * ELEMENT_ROTATION;

  const { scaleFrom, scaleTo } =
    power && POWER_MAP[power]
      ? POWER_MAP[power]
      : { scaleFrom: scale, scaleTo: scale };

  const fromValues = {
    rotation: range === 'out' ? 0 : -rotate,
    scale: range === 'out' ? 1 : scaleFrom,
    translate: range === 'out' ? '0px' : startX,
  };
  const toValues = {
    rotation: range === 'in' ? 0 : rotate,
    scale: range === 'in' ? 1 : range === 'continuous' ? scaleTo : scaleFrom,
    translate: range === 'in' ? '0px' : endX,
  };

  const [turnScroll] = getNames(options);

  const custom = {
    '--motion-turn-translate-from': fromValues.translate,
    '--motion-turn-translate-to': toValues.translate,
    '--motion-turn-scale-from': fromValues.scale,
    '--motion-turn-scale-to': toValues.scale,
    '--motion-turn-rotation-from': `${fromValues.rotation}deg`,
    '--motion-turn-rotation-to': `${toValues.rotation}deg`,
  };

  return [
    {
      ...options,
      name: turnScroll,
      fill,
      easing,
      custom,
      keyframes: [
        {
          transform: `translateX(${toKeyframeValue(
            custom,
            '--motion-turn-translate-from',
            asWeb,
          )}) scale(${toKeyframeValue(
            custom,
            '--motion-turn-scale-from',
            asWeb,
          )}) rotate(calc(${toKeyframeValue(
            {},
            '--comp-rotate-z',
            false,
            '0deg',
          )} + ${toKeyframeValue(
            custom,
            '--motion-turn-rotation-from',
            asWeb,
          )}))`,
        },
        {
          transform: `translateX(${toKeyframeValue(
            custom,
            '--motion-turn-translate-to',
            asWeb,
          )}) scale(${toKeyframeValue(
            custom,
            '--motion-turn-scale-to',
            asWeb,
          )}) rotate(calc(${toKeyframeValue(
            {},
            '--comp-rotate-z',
            false,
            '0deg',
          )} + ${toKeyframeValue(
            custom,
            '--motion-turn-rotation-to',
            asWeb,
          )}))`,
        },
      ],
    },
  ];
}
