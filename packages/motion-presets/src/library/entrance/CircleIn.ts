import type { TimeAnimationOptions, CircleIn, DomApi } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue } from '../../utils';

const VALID_DIRECTIONS = ['left', 'right'] as const;

export function getNames(_: TimeAnimationOptions) {
  return ['motion-circleXIn', 'motion-circleYIn'];
}

const ROTATION = 45;

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction: rawDirection = 'right' } = options.namedEffect as CircleIn;
  const direction = VALID_DIRECTIONS.includes(rawDirection as any) ? rawDirection : 'right';
  const [circleXIn, circleYIn] = getNames(options);

  const x =
    direction === 'right'
      ? 'calc(100vw - var(--motion-left, 0px))'
      : 'calc(var(--motion-left, 0px) * -1 - 100%)';
  const y = 'min(calc(100% * -1.5), max(-300px, calc(100% * -5.5)))';

  const customX = {
    '--motion-translate-x': x,
  };
  const customY = {
    '--motion-translate-y': y,
    '--motion-rotate-z': `${(direction === 'right' ? 1 : -1) * ROTATION}deg`,
  };

  return [
    {
      ...options,
      name: circleXIn,
      easing: 'circOut',
      custom: customX,
      keyframes: [
        {
          offset: INITIAL_FRAME_OFFSET,
          translate: toKeyframeValue(customX, '--motion-translate-x', asWeb),
        },
        {
          translate: '0',
        },
      ],
    },
    {
      ...options,
      name: circleYIn,
      easing: 'linear',
      custom: customY,
      keyframes: [
        {
          offset: 0,
          opacity: 0,
          easing: 'step-end',
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          opacity: 0,
          transform: `translateY(${toKeyframeValue(
            customY,
            '--motion-translate-y',
            asWeb,
          )}) rotate(calc(var(--comp-rotate-z, 0deg) + ${toKeyframeValue(
            customY,
            '--motion-rotate-z',
            asWeb,
          )}))`,
        },
        {
          opacity: 'var(--comp-opacity, 1)',
          transform: `translateY(0) rotate(var(--comp-rotate-z, 0deg))`,
        },
      ],
    },
  ];
}

export function prepare(_: TimeAnimationOptions, dom?: DomApi) {
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
