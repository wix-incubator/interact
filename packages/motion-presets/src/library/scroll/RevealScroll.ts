import {
  EffectFourDirections,
  RevealScroll,
  ScrubAnimationOptions,
  DomApi,
  AnimationFillMode,
} from '../../types';
import { getAdjustedDirection, getClipPolygonParams } from '../../utils';

const DIRECTIONS: EffectFourDirections[] = ['bottom', 'left', 'top', 'right'];

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

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const { direction: rawDirection = 'bottom', range: rawRange = 'in' } = options.namedEffect as RevealScroll;
  const direction = DIRECTIONS.includes(rawDirection as any) ? rawDirection : 'bottom';
  const range = ['in', 'out', 'continuous'].includes(rawRange) ? rawRange : 'in';
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  let clipFrom = getClipFrom(direction, range);
  let clipTo = getClipTo(direction, range);

  if (dom) {
    dom.measure((target) => {
      if (!target) {
        return;
      }

      const rotation = getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0';

      dom.mutate(() => {
        const adjDirection = getAdjustedDirection(
          DIRECTIONS,
          direction,
          parseInt(rotation, 10),
        ) as (typeof DIRECTIONS)[number];

        clipFrom = getClipFrom(adjDirection, range);
        clipTo = getClipTo(adjDirection, range);

        target.style.setProperty('--motion-clip-from', clipFrom);
        target.style.setProperty('--motion-clip-to', clipTo);
      });
    });
  }

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
