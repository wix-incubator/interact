import type { BgFake3D, RangeOffset, ScrubAnimationOptions, DomApi } from '../../types';
import { measureCompHeight, getScaleFromPerspectiveAndZ } from './utils';

const PERSPECTIVE = 100;

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom, true);
  }

  const { stretch = 1.3, zoom = 100 / 6 } = options.namedEffect as BgFake3D;
  const scale = getScaleFromPerspectiveAndZ(zoom, PERSPECTIVE);

  return [
    {
      ...options,
      part: 'BG_IMG',
      easing: 'sineOut',
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
        return [
          {
            transform: 'translateY(10svh)',
          },
          {
            transform: `translateY(calc(${parseFloat(
              (-0.1 * (2 - scale)).toFixed(2),
            )} * var(--motion-comp-height, ${measures.compHeight}px)))`,
          },
        ];
      },
    },
    {
      ...options,
      part: 'BG_IMG',
      easing: 'linear',
      composite: 'add' as const,
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
          transform: `scaleY(${stretch})`,
        },
        {
          transform: `scaleY(1)`,
        },
      ],
    },
    {
      ...options,
      part: 'BG_IMG',
      easing: 'sineIn',
      composite: 'add' as const,
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
          transform: `perspective(${PERSPECTIVE}px) translateZ(0px)`,
        },
        {
          transform: `perspective(${PERSPECTIVE}px) translateZ(${parseFloat(zoom.toFixed(2))}px)`,
        },
      ],
    },
  ];
}
