import type { AnimationFillMode, DomApi, MoveScroll, ScrubAnimationOptions } from '../../types';
import { getCssUnits, safeMapGet } from '../../utils';
import { transformPolarToXY } from '../../utils';

const POWER_MAP = {
  soft: { value: 150, type: 'px' },
  medium: { value: 400, type: 'px' },
  hard: { value: 800, type: 'px' },
};

const RANGES_MAP = {
  in: (travelX: number, travelY: number) => ({
    fromValue: { x: travelX, y: travelY },
    toValue: { x: 0, y: 0 },
  }),
  out: (travelX: number, travelY: number) => ({
    fromValue: { x: 0, y: 0 },
    toValue: { x: travelX, y: travelY },
  }),
  continuous: (travelX: number, travelY: number) => ({
    fromValue: { x: travelX, y: travelY },
    toValue: { x: -travelX, y: -travelY },
  }),
};

function getScrubOffsets({
  angle = 210,
  distance = { value: 400, type: 'px' },
  power,
  range = 'in',
}: MoveScroll) {
  const travel = power ? safeMapGet(POWER_MAP, power, 'medium') : distance;
  const [, travelY] = transformPolarToXY(angle - 90, travel.value);
  const isTravelingDownwards = (travelY < 0 && range !== 'out') || (travelY > 0 && range === 'out');

  const units = getCssUnits(travel.type);
  const startOffsetAdd = isTravelingDownwards ? `${travelY}${units}` : '0px';
  const endOffsetAdd = isTravelingDownwards ? `${Math.abs(travelY)}${units}` : '0px';

  return {
    start: range === 'out' ? '0px' : startOffsetAdd,
    end: range === 'in' ? '0px' : endOffsetAdd,
  };
}

export default function create(
  options: ScrubAnimationOptions,
  _?: DomApi,
  config?: Record<string, any>,
) {
  const {
    power,
    distance = { value: 400, type: 'px' },
    angle = 210,
    range: rawRange = 'in',
  } = options.namedEffect as MoveScroll;

  const range = rawRange in RANGES_MAP ? rawRange : 'in';
  const travel = power ? safeMapGet(POWER_MAP, power, 'medium') : distance;
  const [travelX, travelY] = transformPolarToXY(angle - 90, travel.value);
  const { fromValue, toValue } = safeMapGet(RANGES_MAP, range, 'in')(Math.round(travelX), Math.round(travelY));
  const unit = getCssUnits(travel.type);
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;
  const { start, end } = config?.ignoreScrollMoveOffsets
    ? { start: '', end: '' }
    : getScrubOffsets(options.namedEffect as MoveScroll);

  // use transform: translate(<value>) and not translate: <value> because of WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=276281
  return [
    {
      ...options,
      fill,
      easing,
      startOffsetAdd: start,
      endOffsetAdd: end,
      keyframes: [
        {
          transform: `translate(${fromValue.x}${unit}, ${fromValue.y}${unit}) rotate(var(--comp-rotate-z, 0))`,
        },
        {
          transform: `translate(${toValue.x}${unit}, ${toValue.y}${unit}) rotate(var(--comp-rotate-z, 0))`,
        },
      ],
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     transform: translate(<fromValue.x>, <fromValue.y>) rotate(var(--comp-rotate-z, 0));
   *   }
   *   to {
   *     transform: translate(<toValue.x>, <toValue.y>) rotate(var(--comp-rotate-z, 0));
   *   }
   * }
   */
}
