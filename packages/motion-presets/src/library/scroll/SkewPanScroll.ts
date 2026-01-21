import type { AnimationFillMode, DomApi, ScrubAnimationOptions, SkewPanScroll } from '../../types';
import { safeMapGet } from '../../utils';

const POWER_MAP = {
  soft: { skewX: 10 },
  medium: { skewX: 17 },
  hard: { skewX: 24 },
};

const DIRECTION_MAP = {
  right: -1,
  left: 1,
};

const RANGES_MAP = {
  in: (skewX: number, startX: string, _endX: string) => ({
    fromValues: { skewX, startX },
    toValues: { skewX: 0, endX: 0 },
  }),
  out: (skewX: number, startX: string, _endX: string) => ({
    fromValues: { skewX: 0, startX: 0 },
    toValues: { skewX: -skewX, endX: startX },
  }),
  continuous: (skewX: number, startX: string, endX: string) => ({
    fromValues: { skewX, startX },
    toValues: { skewX: -skewX, endX },
  }),
};

const POSITIONS = {
  left: {
    startX: `calc(var(--motion-left, calc(100vw - 100%)) * -1 - 100%)`,
    endX: `calc(100vw - var(--motion-left, 0px))`,
  },
  right: {
    startX: `calc(100vw - var(--motion-left, 0px))`,
    endX: `calc(var(--motion-left, calc(100vw - 100%)) * -1 - 100%)`,
  },
};

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const {
    skew = 10,
    direction: rawDirection = 'right',
    power,
    range: rawRange = 'in',
  } = options.namedEffect as SkewPanScroll;
  const easing = 'linear';
  const range = rawRange in RANGES_MAP ? rawRange : 'in';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const powerParams = power ? safeMapGet(POWER_MAP, power, 'medium') : null;
  const skewX = (powerParams ? powerParams.skewX : skew) * safeMapGet(DIRECTION_MAP, rawDirection, 'right');
  const { startX, endX } = safeMapGet(POSITIONS, rawDirection, 'right');
  const { fromValues, toValues } = safeMapGet(RANGES_MAP, rawRange, 'in')(skewX, startX, endX);

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
          transform: `translateX(${fromValues.startX}) skewX(${fromValues.skewX}deg) rotate(var(--comp-rotate-z, 0))`,
        },
        {
          transform: `translateX(${toValues.endX}) skewX(${toValues.skewX}deg) rotate(var(--comp-rotate-z, 0))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: translateX(<fromValue.startX>) skewX(<fromValue.skew>) rotate(<rotation>);
   *   }
   *   to {
   *     transform: translateX(<toValue.endX>) skewX(<toValue.skew>) rotate(<rotation>);
   *   }
   * }
   */
}
