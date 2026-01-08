import {
  AnimationFillMode,
  GrowScroll,
  ScrubAnimationOptions,
} from '../../types';

const MAX_Y_TRAVEL = 40;
const POWER_MAP = {
  soft: { scaleFrom: 0.8, scaleTo: 1.2, travelY: 0 },
  medium: { scaleFrom: 0.3, scaleTo: 1.7, travelY: 0.75 },
  hard: { scaleFrom: 0, scaleTo: 4, travelY: 1 },
};

const directionMap = {
  top: [0, -50],
  'top-right': [50, -50],
  right: [50, 0],
  'bottom-right': [50, 50],
  bottom: [0, 50],
  'bottom-left': [-50, 50],
  left: [-50, 0],
  'top-left': [-50, -50],
  center: [0, 0],
};

const RANGES_MAP = {
  in: (scaleFrom: number, _scaleTo: number, travelY: number) => ({
    fromValues: { scale: scaleFrom, travel: travelY },
    toValues: { scale: 1, travel: 0 },
  }),
  out: (_scaleFrom: number, scaleTo: number, travelY: number) => ({
    fromValues: { scale: 1, travel: 0 },
    toValues: { scale: scaleTo, travel: -travelY },
  }),
  continuous: (scaleFrom: number, scaleTo: number, travelY: number) => ({
    fromValues: { scale: scaleFrom, travel: travelY },
    toValues: { scale: scaleTo, travel: -travelY },
  }),
};

function getScrubOffsets({ power, range = 'in', speed = 0 }: GrowScroll) {
  const offset =
    power && POWER_MAP[power]
      ? POWER_MAP[power].travelY
      : Math.abs(speed) * MAX_Y_TRAVEL;

  return {
    start: range === 'out' ? '0px' : `${-offset}vh`,
    end: range === 'in' ? '0px' : `${offset}vh`,
  };
}

export default function create(options: ScrubAnimationOptions) {
  const {
    power,
    range = 'in',
    scale = range === 'in' ? POWER_MAP.hard.scaleFrom : POWER_MAP.hard.scaleTo,
    direction = 'center',
    speed = 0,
  } = options.namedEffect as GrowScroll;

  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;
  const { scaleFrom, scaleTo, travelY } =
    power && POWER_MAP[power]
      ? POWER_MAP[power]
      : {
          scaleFrom: scale,
          scaleTo: scale,
          travelY: speed,
        };

  const { fromValues, toValues } = RANGES_MAP[range](
    scaleFrom,
    scaleTo,
    travelY * -MAX_Y_TRAVEL,
  );

  const { start, end } = getScrubOffsets(options.namedEffect as GrowScroll);
  const [trnsX, trnsY] = directionMap[direction];

  return [
    {
      ...options,
      fill,
      easing,
      startOffsetAdd: start,
      endOffsetAdd: end,
      keyframes: [
        {
          transform: `translateY(${
            fromValues.travel
          }vh) translate(${trnsX}%, ${trnsY}%) scale(${
            fromValues.scale
          }) translate(${-trnsX}%, ${-trnsY}%) rotate(var(--comp-rotate-z, 0))`,
        },
        {
          transform: `translateY(${
            toValues.travel
          }vh) translate(${trnsX}%, ${trnsY}%) scale(${
            toValues.scale
          }) translate(${-trnsX}%, ${-trnsY}%) rotate(var(--comp-rotate-z, 0))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     translate: 0 <fromValues.travel>;
   *   }
   *   to {
   *     translate: 0 <toValues.travel>;
   *   }
   * }
   *
   * @keyframes <name>-scale {
   *   from {
   *     scale: <fromValues.scale>;
   *   }
   *   <scaleDelay>% {
   *     scale: <fromValues.scale>;
   *     animation-timing-function: <scaleEase>;
   *   }
   *   <scaleDuration>% {
   *     scale: <toValues.scale>;
   *   }
   *   to {
   *     scale: <toValues.scale>;
   *   }
   * }
   *
   * @supports (animation-timeline: view()) {
   *   #target {
   *     animation: <name> auto <easing> both,
   *                <name>-scale auto linear both;
   *     animation-range: cover <start> cover <end>,
   *                      cover <start> cover <end>;
   *     animation-timeline: view(), view();
   *   }
   * }
   * @supports not (animation-timeline: view()) {
   *   #target {
   *     animation: <name> 100ms linear <fill> paused,
   *                <name>-scale 100ms linear <fill> paused;
   *   }
   * }
   */
}
