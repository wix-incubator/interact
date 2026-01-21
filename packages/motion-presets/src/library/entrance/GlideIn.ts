import type { AnimationExtraOptions, DomApi, TimeAnimationOptions, GlideIn } from '../../types';
import {
  getCssUnits,
  getOutOfScreenDistance,
  INITIAL_FRAME_OFFSET,
  toKeyframeValue,
  safeMapGet,
} from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-glideIn'];
}

const EASING_MAP = {
  soft: 'cubicInOut',
  medium: 'quintInOut',
  hard: 'backOut',
};

export function web(options: TimeAnimationOptions & AnimationExtraOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const {
    direction = 0,
    distance = { value: 100, type: 'percentage' },
    power,
    startFromOffScreen = false,
  } = options.namedEffect as GlideIn;
  const [glideIn] = getNames(options);

  const angleInRad = (direction * Math.PI) / 180;
  const unit = getCssUnits(distance.type);

  const easing = power ? safeMapGet(EASING_MAP, power, 'medium') : options.easing || 'quintInOut';
  const { x, y } = getOutOfScreenDistance(direction);

  const translateX = startFromOffScreen
    ? x
    : `${(Math.sin(angleInRad) * distance.value) | 0}${unit}`;
  const translateY = startFromOffScreen
    ? y
    : `${(Math.cos(angleInRad) * distance.value * -1) | 0}${unit}`;

  const custom = {
    '--motion-translate-x': `${translateX}`,
    '--motion-translate-y': `${translateY}`,
  };

  return [
    {
      ...options,
      name: glideIn,
      easing,
      custom,
      keyframes: [
        {
          offset: 0,
          opacity: 0,
          easing: 'step-end',
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          // TODO: remove opacity when not necessary to override hard-coded opacity:0 in style
          opacity: 'var(--comp-opacity, 1)',
          transform: `translate(${toKeyframeValue(
            custom,
            '--motion-translate-x',
            asWeb,
          )}, ${toKeyframeValue(
            custom,
            '--motion-translate-y',
            asWeb,
          )}) rotate(var(--comp-rotate-z, 0deg))`,
        },
        {
          opacity: 'var(--comp-opacity, 1)',
          transform: 'translate(0, 0) rotate(var(--comp-rotate-z, 0deg))',
        },
      ],
    },
  ];
}

export function prepare(options: TimeAnimationOptions, dom?: DomApi) {
  const { startFromOffScreen = false } = options.namedEffect as GlideIn;

  if (dom && startFromOffScreen) {
    let left = 0;
    let top = 0;

    dom.measure((target) => {
      if (!target) {
        return;
      }

      const { left: targetLeft, top: targetTop } = target.getBoundingClientRect();
      left = targetLeft;
      top = targetTop;
    });

    dom.mutate((target) => {
      target?.style.setProperty('--motion-left', `${left}px`);
      target?.style.setProperty('--motion-top', `${top}px`);
    });
  }
}
