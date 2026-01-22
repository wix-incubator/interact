import type { CurveIn, TimeAnimationOptions, DomApi } from '../../types';
import { INITIAL_FRAME_OFFSET, toKeyframeValue, getMapValue } from '../../utils';

export function getNames(_: TimeAnimationOptions) {
  return ['motion-curveIn'];
}

const PARAMS_MAP = {
  pseudoRight: { rotationX: '180', rotationY: '0' },
  right: { rotationX: '0', rotationY: '180' },
  pseudoLeft: { rotationX: '-180', rotationY: '0' },
  left: { rotationX: '0', rotationY: '-180' },
};

const DEFAULT_DIRECTION = 'right';

export function web(options: TimeAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function style(options: TimeAnimationOptions, asWeb = false) {
  const { direction = DEFAULT_DIRECTION } = options.namedEffect as CurveIn;
  const [curveIn] = getNames(options);

  const { rotationX, rotationY } = getMapValue(PARAMS_MAP, direction, PARAMS_MAP[DEFAULT_DIRECTION]);

  const custom = {
    '--motion-rotate-x': `${rotationX}deg`,
    '--motion-rotate-y': `${rotationY}deg`,
  };

  return [
    {
      ...options,
      name: curveIn,
      easing: 'quadOut',
      custom,
      keyframes: [
        {
          offset: 0,
          opacity: 0,
          easing: 'step-end',
        },
        {
          offset: INITIAL_FRAME_OFFSET,
          opacity: 0,
          transform: `perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(${toKeyframeValue(
            custom,
            '--motion-rotate-x',
            asWeb,
          )}) rotateY(${toKeyframeValue(
            custom,
            '--motion-rotate-y',
            asWeb,
          )}) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))`,
        },
        {
          opacity: 'var(--comp-opacity, 1)',
          transform:
            'perspective(200px) translateZ(calc(var(--motion-width, 300px) * -3)) rotateX(0deg) rotateY(0deg) translateZ(calc(var(--motion-width, 300px) * 3)) rotateZ(var(--comp-rotate-z, 0deg))',
        },
      ],
    },
  ];
}

export function prepare(_: TimeAnimationOptions, dom?: DomApi) {
  if (dom) {
    let width: number;

    dom.measure((target) => {
      if (!target) {
        return;
      }

      width = target.getBoundingClientRect().width;
    });

    dom.mutate((target) => {
      target?.style.setProperty('--motion-width', `${width}px`);
    });
  }
}
