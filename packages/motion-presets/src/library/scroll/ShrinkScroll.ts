import type { AnimationFillMode, ScrubAnimationOptions, ShrinkScroll } from '../../types';
import { safeMapGet } from '../../utils';

const MAX_Y_TRAVEL = 40;
const POWER_MAP = {
  soft: { scaleFrom: 1.2, scaleTo: 0.8, travelY: 0 },
  medium: { scaleFrom: 1.7, scaleTo: 0.3, travelY: 0.5 },
  hard: { scaleFrom: 3.5, scaleTo: 0, travelY: 1 },
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

function getScrubOffsets({ power, range = 'in', speed = 0 }: ShrinkScroll) {
  const powerParams = power ? safeMapGet(POWER_MAP, power, 'medium') : null;
  const offset = powerParams ? powerParams.travelY : Math.abs(speed) * MAX_Y_TRAVEL;

  return {
    start: range === 'out' ? '0px' : `${-offset}vh`,
    end: range === 'in' ? '0px' : `${offset}vh`,
  };
}

export default function create(options: ScrubAnimationOptions) {
  const {
    power,
    range: rawRange = 'in',
    scale: scaleParam,
    direction: rawDirection = 'center',
    speed = 0,
  } = options.namedEffect as ShrinkScroll;
  const range = rawRange in RANGES_MAP ? rawRange : 'in';
  const direction = rawDirection in directionMap ? rawDirection : 'center';
  const scale = scaleParam ?? (range === 'in' ? 1.2 : 0.8);
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const powerParams = power ? safeMapGet(POWER_MAP, power, 'medium') : null;
  const { scaleFrom, scaleTo, travelY } = powerParams ?? {
    scaleFrom: scale,
    scaleTo: scale,
    travelY: speed,
  };

  const { fromValues, toValues } = safeMapGet(RANGES_MAP, range, 'in')(scaleFrom, scaleTo, travelY * -MAX_Y_TRAVEL);

  const easing = 'linear';

  const { start: startOffsetAdd, end: endOffsetAdd } = getScrubOffsets(
    options.namedEffect as ShrinkScroll,
  );

  const [trnsX, trnsY] = safeMapGet(directionMap, direction, 'center');

  return [
    {
      ...options,
      fill,
      easing,
      startOffsetAdd,
      endOffsetAdd,
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
  /* // we may want to squash both animations into a single one and simply generate dynamically all the necessary keyframes to reach same result
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
