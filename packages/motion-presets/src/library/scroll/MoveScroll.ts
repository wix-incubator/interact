import type { AnimationFillMode, DomApi, MoveScroll, ScrubAnimationOptions } from '../../types';
import { getCssUnits } from '../../utils';
import { transformPolarToXY } from '../../utils';

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
  range = 'in',
}: MoveScroll) {
  const [, travelY] = transformPolarToXY(angle - 90, distance.value);
  const isTravelingDownwards = (travelY < 0 && range !== 'out') || (travelY > 0 && range === 'out');

  const units = getCssUnits(distance.type);
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
    distance = { value: 400, type: 'px' },
    angle = 210,
    range = 'in',
  } = options.namedEffect as MoveScroll;

  const [travelX, travelY] = transformPolarToXY(angle - 90, distance.value);
  const { fromValue, toValue } = RANGES_MAP[range](Math.round(travelX), Math.round(travelY));
  const unit = getCssUnits(distance.type);
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;
  const { start, end } = config?.ignoreScrollMoveOffsets
    ? { start: '', end: '' }
    : getScrubOffsets(options.namedEffect as MoveScroll);

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
