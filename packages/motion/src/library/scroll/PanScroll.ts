import {
  PanScroll,
  ScrubAnimationOptions,
  EffectTwoSides,
  DomApi,
  AnimationFillMode,
} from '../../types';
import { getCssUnits } from '../../utils';

const DIRECTIONS: Record<EffectTwoSides, number> = {
  left: 1,
  right: -1,
};

const OFFSCREEN_POSITIONS: Record<
  EffectTwoSides,
  Record<'startX' | 'endX', string>
> = {
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
    distance = { value: 400, type: 'px' },
    direction = 'left',
    startFromOffScreen = true,
    range = 'in',
  } = options.namedEffect as PanScroll;
  const travel = distance.value * DIRECTIONS[direction];
  const { startX, endX } = startFromOffScreen
    ? OFFSCREEN_POSITIONS[direction]
    : {
        startX: `${-travel}${getCssUnits(distance.type)}`,
        endX: `${travel}${getCssUnits(distance.type)}`,
      };

  const fromValue = range === 'out' ? 0 : startX;
  const toValue = range === 'in' ? 0 : range === 'out' ? startX : endX;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  if (startFromOffScreen && dom) {
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

  // use transform: translateX(<value>) and not translate: <value> because of WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=276281
  return [
    {
      ...options,
      fill,
      easing,
      keyframes: [
        {
          transform: `translateX(${fromValue}) rotate(var(--comp-rotate-z, 0))`,
        },
        {
          transform: `translateX(${toValue}) rotate(var(--comp-rotate-z, 0))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: translateX(<fromValue>) rotate(var(--comp-rotate-z, 0));
   *   }
   *   to {
   *     transform: translateX(<toValue>) rotate(var(--comp-rotate-z, 0));
   *   }
   * }
   */
}
