import {
  EffectFourDirections,
  RevealScroll,
  ScrubAnimationOptions,
  AnimationFillMode,
} from '../../types';
import { getClipPolygonParams } from '../../utils';

const OPPOSITE_DIRECTION_MAP: Record<EffectFourDirections, EffectFourDirections> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const initialClip = getClipPolygonParams({ direction: 'initial' });

function getClipFrom(direction: EffectFourDirections, range: RevealScroll['range']) {
  return range === 'out'
    ? initialClip
    : getClipPolygonParams({
        direction: OPPOSITE_DIRECTION_MAP[direction],
      });
}
function getClipTo(direction: EffectFourDirections, range: RevealScroll['range']) {
  return range === 'in'
    ? initialClip
    : getClipPolygonParams({
        direction: range === 'out' ? OPPOSITE_DIRECTION_MAP[direction] : direction,
      });
}

export default function create(options: ScrubAnimationOptions) {
  const { direction = 'bottom', range = 'in' } = options.namedEffect as RevealScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const clipFrom = getClipFrom(direction, range);
  const clipTo = getClipTo(direction, range);

  const keyframes =
    range === 'continuous'
      ? [
          { clipPath: `var(--motion-clip-from, ${clipFrom})` },
          { clipPath: initialClip },
          { clipPath: `var(--motion-clip-to, ${clipTo})` },
        ]
      : ([
          { clipPath: `var(--motion-clip-from, ${clipFrom})` },
          { clipPath: `var(--motion-clip-to, ${clipTo})` },
        ] as {
          clipPath: string;
        }[]);

  return [
    {
      ...options,
      fill,
      easing,
      keyframes,
    },
  ];
  /*
   * @keyframes <name> {
   *   from {
   *     clip-path: <fromValue>;
   *   }
   *   to {
   *     clip-path: <toValue>;
   *   }
   * }
   *
   * OR for continuous:
   *
   * @keyframes <name> {
   *   from {
   *     clip-path: <fromValue>;
   *   }
   *   50% {
   *     clip-path: <initialClip>;
   *   }
   *   to {
   *     clip-path: <toValue>;
   *   }
   * }
   */
}
