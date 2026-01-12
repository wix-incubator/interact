import type { BgCloseUp, DomApi, RangeOffset, ScrubAnimationOptions } from '../../types';
import { measureCompHeight } from './utils';

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom);
  }

  const easing = 'linear';
  const { scale = 80 } = options.namedEffect as BgCloseUp;

  return [
    {
      ...options,
      easing,
      part: 'BG_LAYER',
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get startOffsetAdd() {
        return `calc(50vh + ${Math.round(0.5 * measures.compHeight)}px)`;
      },
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get endOffsetAdd() {
        return `calc(100vh + ${measures.compHeight}px)`;
      },
      keyframes: [
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
      ],
    },
    {
      ...options,
      easing,
      part: 'BG_MEDIA',
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get endOffsetAdd() {
        return `calc(100vh + ${measures.compHeight}px)`;
      },
      keyframes: [
        {
          transform: 'perspective(100px) translateZ(0px)',
        },
        {
          transform: `perspective(100px) translateZ(${scale}px)`,
        },
      ],
    },
  ];
}
