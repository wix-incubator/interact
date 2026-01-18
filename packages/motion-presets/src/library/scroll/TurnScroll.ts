import type {
  TurnScroll,
  EffectScrollRange,
  ScrubAnimationOptions,
  AnimationExtraOptions,
  DomApi,
  AnimationFillMode,
} from '../../types';

const ELEMENT_ROTATION = 45;

const POWER_MAP = {
  soft: { scaleFrom: 1, scaleTo: 1 },
  medium: { scaleFrom: 0.7, scaleTo: 1.3 },
  hard: { scaleFrom: 0.4, scaleTo: 1.6 },
};

const ROTATE_DIRECTION_MAP = {
  clockwise: 1,
  'counter-clockwise': -1,
};

type RangeValuesTurnScroll = Record<
  EffectScrollRange,
  (
    rotate: number,
    scale: { scaleFrom: number; scaleTo: number },
    travel: { startX: string; endX: string },
  ) => {
    fromValues: { rotation: number; scale: number; translate: string };
    toValues: { rotation: number; scale: number; translate: string };
  }
>;

const TRANSLATE_X_MAP = {
  left: {
    startX: `calc(-1 * var(--motion-left, calc(100vw - 100%)) - 100%)`,
    endX: `calc(100vw - var(--motion-left, 0px))`,
  },
  right: {
    startX: `calc(100vw - var(--motion-left, 0px))`,
    endX: `calc(-1 * var(--motion-left, calc(100vw - 100%)) - 100%)`,
  },
};

const RANGES_MAP: RangeValuesTurnScroll = {
  in: (rotate, scale, travel) => ({
    fromValues: {
      rotation: -rotate,
      scale: scale.scaleFrom,
      translate: travel.startX,
    },
    toValues: { rotation: 0, scale: 1, translate: '0px' },
  }),
  out: (rotate, scale, travel) => ({
    fromValues: { rotation: 0, scale: 1, translate: '0px' },
    toValues: {
      rotation: rotate,
      scale: scale.scaleFrom,
      translate: travel.endX,
    },
  }),
  continuous: (rotate, scale, travel) => ({
    fromValues: {
      rotation: -rotate,
      scale: scale.scaleFrom,
      translate: travel.startX,
    },
    toValues: {
      rotation: rotate,
      scale: scale.scaleTo,
      translate: travel.endX,
    },
  }),
};

export default function create(
  options: ScrubAnimationOptions & AnimationExtraOptions,
  dom?: DomApi,
) {
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

  const transX = TRANSLATE_X_MAP[direction];
  const rotateZ = ELEMENT_ROTATION * ROTATE_DIRECTION_MAP[spin];
  const scaleFactors =
    power && POWER_MAP[power] ? POWER_MAP[power] : { scaleFrom: scale, scaleTo: scale };

  const { fromValues, toValues } = RANGES_MAP[range](rotateZ, scaleFactors, transX);

  let left = 0;
  if (dom) {
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

  return [
    {
      ...options,
      fill,
      easing,
      keyframes: [
        {
          transform: `translateX(${fromValues.translate}) scale(${fromValues.scale}) rotate(calc(var(--comp-rotate-z, 0deg) + ${fromValues.rotation}deg))`,
        },
        {
          transform: `translateX(${toValues.translate}) scale(${toValues.scale}) rotate(calc(var(--comp-rotate-z, 0deg) + ${toValues.rotation}deg))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: translateX(<fromValues.position>) scale(<fromValues.scale>) rotate(calc(<rotation> - <fromValues.rotation>));
   *   }
   *   to {
   *     transform: translateX(<toValues.position>) scale(<toValues.scale>) rotate(calc(<rotation> + <toValues.rotation>));
   *   }
   * }
   */
}
