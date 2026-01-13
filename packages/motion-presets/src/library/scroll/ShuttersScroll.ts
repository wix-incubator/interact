import {
  EffectFourDirections,
  ShuttersScroll,
  ScrubAnimationOptions,
  AnimationFillMode,
} from '../../types';
import { getEasing } from '../../utils';
import { getShuttersClipPaths } from '../../utils';

const OPPOSITE_DIRECTION_MAP: Record<
  EffectFourDirections,
  EffectFourDirections
> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export default function create(options: ScrubAnimationOptions) {
  const {
    direction = 'right',
    shutters = 12,
    staggered = true,
    range = 'in',
  } = options.namedEffect as ShuttersScroll;
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const easing = range === 'in' ? getEasing('sineIn') : getEasing('sineOut');
  const directionOpp = OPPOSITE_DIRECTION_MAP[direction];
  const { clipStart, clipEnd } = getShuttersClipPaths(
    range === 'out' ? directionOpp : direction,
    shutters,
    staggered,
  );
  const start = range !== 'out' ? clipStart : clipEnd;
  const end = range !== 'out' ? clipEnd : clipStart;
  let keyframes;

  if (range === 'continuous') {
    const { clipStart: oppClipStart, clipEnd: oppClipEnd } =
      getShuttersClipPaths(directionOpp, shutters, staggered, true);

    keyframes = [
      {
        clipPath: start,
        easing,
      },
      {
        clipPath: end,
        offset: staggered ? 0.45 : 0.4,
        easing,
      },
      {
        clipPath: end,
        offset: staggered ? 0.55 : 0.6,
        easing,
      },
      {
        clipPath: oppClipEnd,
        offset: staggered ? 0.55 : 0.6,
        easing,
      },
      {
        clipPath: oppClipStart,
      },
    ];
  } else {
    keyframes = [
      {
        clipPath: start,
        easing,
      },
      {
        clipPath: end,
      },
    ];
  }

  return [
    {
      ...options,
      fill,
      easing: 'linear',
      keyframes,
    },
  ];
}
