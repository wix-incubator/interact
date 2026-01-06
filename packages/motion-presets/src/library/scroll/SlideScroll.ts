import type {
  ScrubAnimationOptions,
  SlideScroll,
  EffectFourDirections,
  EffectScrollRange,
  DomApi,
  AnimationFillMode,
} from '../../types';
import { getAdjustedDirection, getClipPolygonParams } from '@wix/motion';

type Translate = { x: string; y: string };

const DIRECTIONS: EffectFourDirections[] = ['bottom', 'left', 'top', 'right'];

type Direction = (typeof DIRECTIONS)[number];

const OPPOSITE_DIRECTION_MAP: Record<Direction, Direction> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const DIRECTION_TRANSLATION_MAP: Record<Direction, Translate> = {
  top: { x: '0', y: '-100%' },
  right: { x: '100%', y: '0' },
  bottom: { x: '0', y: '100%' },
  left: { x: '-100%', y: '0' },
};

const initialClip = getClipPolygonParams({ direction: 'initial' });

const KEYFRAMES_RANGE_MAP: Record<
  EffectScrollRange,
  (
    clip: { from: string; to: string },
    translate: { from: Translate; to: Translate },
  ) => { clipPath: string; transform: string }[]
> = {
  in: (clip, translate) => [
    {
      clipPath: `var(--motion-clip-from, ${clip.from})`,
      transform: `rotate(var(--comp-rotate-z, 0)) translate(${translate.from.x}, ${translate.from.y})`,
    },
    {
      clipPath: initialClip,
      transform: `rotate(var(--comp-rotate-z, 0)) translate(0, 0)`,
    },
  ],
  out: (clip, translate) => [
    {
      clipPath: initialClip,
      transform: `rotate(var(--comp-rotate-z, 0)) translate(0, 0)`,
    },
    {
      clipPath: `var(--motion-clip-from, ${clip.from})`,
      transform: `rotate(var(--comp-rotate-z, 0)) translate(${translate.from.x}, ${translate.from.y})`,
    },
  ],
  continuous: (clip, translate) => [
    {
      clipPath: `var(--motion-clip-from, ${clip.from})`,
      transform: `rotate(var(--comp-rotate-z, 0)) translate(${translate.from.x}, ${translate.from.y})`,
    },
    {
      clipPath: initialClip,
      transform: `rotate(var(--comp-rotate-z, 0)) translate(0, 0)`,
    },
    {
      clipPath: `var(--motion-clip-to, ${clip.to})`,
      transform: `rotate(var(--comp-rotate-z, 0)) translate(${translate.to.x}, ${translate.to.y})`,
    },
  ],
};

export function web(options: ScrubAnimationOptions, dom?: DomApi) {
  const { direction = 'bottom', range = 'in' } =
    options.namedEffect as SlideScroll;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;
  const oppositeDirection = OPPOSITE_DIRECTION_MAP[direction];

  const keyframes = KEYFRAMES_RANGE_MAP[range](
    {
      from: getClipPolygonParams({
        direction: oppositeDirection,
      }),
      to: getClipPolygonParams({
        direction,
      }),
    },
    {
      from: DIRECTION_TRANSLATION_MAP[direction],
      to: DIRECTION_TRANSLATION_MAP[oppositeDirection],
    },
  );

  if (dom) {
    dom.measure((target) => {
      if (!target) {
        return;
      }

      const rotation = parseInt(
        getComputedStyle(target).getPropertyValue('--comp-rotate-z') || '0',
        10,
      );

      dom.mutate(() => {
        const adjDirection = getAdjustedDirection(
          DIRECTIONS,
          direction,
          rotation,
        ) as Direction;
        target.style.setProperty(
          '--motion-clip-from',
          getClipPolygonParams({
            direction: OPPOSITE_DIRECTION_MAP[adjDirection],
          }),
        );
        target.style.setProperty(
          '--motion-clip-to',
          getClipPolygonParams({
            direction: adjDirection,
          }),
        );
      });
    });
  }

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
   *     clip-path: <clip.from>;
   *     translate: <translate.from.x> <translate.from.y>;
   *   }
   *   to {
   *     clip-path: none;
   *     translate: 0 0;
   *   }
   * }
   */
}
