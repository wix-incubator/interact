import type {
  BgZoom,
  RangeOffset,
  ScrubAnimationOptions,
  DomApi,
} from '../../types';
import { roundNumber } from '../../utils';
import { measureCompHeight, getScaleFromPerspectiveAndZ } from './utils';

const PERSPECTIVE = 100;
const DEFAULT_ZOOM = 40;
const ZOOM_OUT_FACTOR = 0.375; // 15/40 - this for using the same scale of values in the data
const DIRECTION_TO_PARAMS = {
  in: {
    easing: 'sineIn',
    fromY: '20svh',
  },
  out: {
    easing: 'sineInOut',
    fromY: '0px',
  },
};

export function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const { direction = 'in' } = options.namedEffect as BgZoom;
  const isIn = direction === 'in';

  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom, isIn);
  }

  const { easing, fromY } = DIRECTION_TO_PARAMS[direction];
  let { zoom = DEFAULT_ZOOM } = options.namedEffect as BgZoom;
  if (!isIn) {
    zoom *= ZOOM_OUT_FACTOR;
  }
  const fromZ = roundNumber(isIn ? 0 : zoom / 1.3);
  const toZ = roundNumber(isIn ? zoom : -zoom);
  const toScale = roundNumber(getScaleFromPerspectiveAndZ(toZ, PERSPECTIVE));

  return [
    {
      ...options,
      part: 'BG_MEDIA',
      easing: 'linear',
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      keyframes: [
        {
          transform: 'translate3d(0, 0, 0)',
        },
        {
          transform: 'translate3d(0, 0, 0)',
        },
      ],
    },
    {
      ...options,
      part: 'BG_IMG',
      easing: 'linear',
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get endOffsetAdd() {
        return `calc(100svh + ${measures.compHeight}px)`;
      },
      get keyframes() {
        const toY = isIn
          ? `calc(-0.2 * var(--motion-comp-height, ${
              measures.compHeight
            }px) + 0.5 * ${
              zoom / PERSPECTIVE
            } * max(0px, 100lvh - var(--motion-comp-height, ${
              measures.compHeight
            }px)))`
          : '0px';
        return [
          {
            transform: `translateY(${fromY})`,
          },
          {
            transform: `translateY(calc(${toY} * ${toScale}))`,
          },
        ];
      },
    },
    {
      ...options,
      easing,
      part: 'BG_IMG',
      composite: isIn ? ('add' as const) : ('replace' as const),
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get endOffsetAdd() {
        return `calc(100svh + ${measures.compHeight}px)`;
      },
      keyframes: [
        {
          transform: `perspective(${PERSPECTIVE}px) translateZ(${fromZ}px)`,
        },
        {
          transform: `perspective(${PERSPECTIVE}px) translateZ(${toZ}px)`,
        },
      ],
    },
  ];
}
