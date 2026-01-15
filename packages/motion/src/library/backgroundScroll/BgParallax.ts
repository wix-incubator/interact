import type { BgParallax, RangeOffset, ScrubAnimationOptions, DomApi } from '../../types';
import { measureCompHeight } from './utils';

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom, true);
  }

  const { speed = 0.2 } = options.namedEffect as BgParallax;

  return [
    {
      ...options,
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
        return `calc(100svh + ${measures.compHeight}px)`;
      },
      keyframes: [
        {
          transform: `translateY(${100 * speed}svh)`,
        },
        {
          transform: `translateY(calc((100% - 200lvh) * ${-speed}))`,
        },
      ],
    },
  ];
}
