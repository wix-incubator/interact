import { AnimationFillMode, GrowScroll, ScrubAnimationOptions } from '../../types';

const MAX_Y_TRAVEL = 40;

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

function getScrubOffsets({ range = 'in', speed = 0 }: GrowScroll) {
  const offset = Math.abs(speed) * MAX_Y_TRAVEL;

  return {
    start: range === 'out' ? '0px' : `${-offset}vh`,
    end: range === 'in' ? '0px' : `${offset}vh`,
  };
}

export default function create(options: ScrubAnimationOptions) {
  const {
    range = 'in',
    scale = range === 'in' ? 0 : 4,
    direction = 'center',
    speed = 0,
  } = options.namedEffect as GrowScroll;

  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const scaleFrom = scale;
  const scaleTo = scale;
  const travelY = speed;

  const { fromValues, toValues } = RANGES_MAP[range](scaleFrom, scaleTo, travelY * -MAX_Y_TRAVEL);

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
          transform: `translateY(${fromValues.travel}vh) translate(${trnsX}%, ${trnsY}%) scale(${
            fromValues.scale
          }) translate(${-trnsX}%, ${-trnsY}%) rotate(var(--comp-rotate-z, 0))`,
        },
        {
          transform: `translateY(${toValues.travel}vh) translate(${trnsX}%, ${trnsY}%) scale(${
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
   */
}
