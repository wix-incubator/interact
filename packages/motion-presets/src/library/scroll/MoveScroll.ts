import type { AnimationFillMode, DomApi, MoveScroll, ScrubAnimationOptions } from '../../types';
import { getCssUnits, transformPolarToXY, toKeyframeValue } from '../../utils';

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-moveScroll'];
}

export function web(options: ScrubAnimationOptions, _?: DomApi, config?: Record<string, any>) {
  return style(options, config, true);
}

export function style(options: ScrubAnimationOptions, config?: Record<string, any>, asWeb = false) {
  const { angle = 210, range = 'in' } = options.namedEffect as MoveScroll;

  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const { distance: inputDistance = { value: 400, type: 'px' } } =
    options.namedEffect as MoveScroll;
  const distance = {
    value: inputDistance.value || 0,
    type: inputDistance.type || 'px',
  };

  let [travelX, travelY] = transformPolarToXY(angle - 90, distance.value);
  const unit = getCssUnits(distance.type);

  let startOffsetAdd = '',
    endOffsetAdd = '';
  if (!config?.ignoreScrollMoveOffsets) {
    if (travelY < 0 && range !== 'out') {
      startOffsetAdd = `${travelY}${unit}`;
      if (range !== 'in') {
        endOffsetAdd = `${Math.abs(travelY)}${unit}`;
      }
    }
    if (travelY > 0 && range === 'out') {
      endOffsetAdd = `${Math.abs(travelY)}${unit}`;
    }
  }

  [travelX, travelY] = [travelX, travelY].map(Math.round);
  const fromValue = {
    x: range === 'out' ? 0 : travelX,
    y: range === 'out' ? 0 : travelY,
  };
  const toValue = {
    x: range === 'in' ? 0 : range === 'out' ? travelX : -travelX,
    y: range === 'in' ? 0 : range === 'out' ? travelY : -travelY,
  };

  const [moveScroll] = getNames(options);

  const custom = {
    '--motion-move-from-x': `${fromValue.x}${unit}`,
    '--motion-move-from-y': `${fromValue.y}${unit}`,
    '--motion-move-to-x': `${toValue.x}${unit}`,
    '--motion-move-to-y': `${toValue.y}${unit}`,
  };

  return [
    {
      ...options,
      name: moveScroll,
      fill,
      easing,
      startOffsetAdd,
      endOffsetAdd,
      custom,
      keyframes: [
        {
          transform: `translate(${toKeyframeValue(
            custom,
            '--motion-move-from-x',
            asWeb,
          )}, ${toKeyframeValue(
            custom,
            '--motion-move-from-y',
            asWeb,
          )}) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0')})`,
        },
        {
          transform: `translate(${toKeyframeValue(
            custom,
            '--motion-move-to-x',
            asWeb,
          )}, ${toKeyframeValue(
            custom,
            '--motion-move-to-y',
            asWeb,
          )}) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0')})`,
        },
      ],
    },
  ];
}
