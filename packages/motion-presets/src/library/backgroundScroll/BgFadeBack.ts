import type {
  BgFadeBack,
  DomApi,
  RangeOffset,
  ScrubAnimationOptions,
} from '../../types';
import { measureCompHeight } from './utils';

export function web(options: ScrubAnimationOptions, dom?: DomApi) {
  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom);
  }

  const easing = 'sineOut';
  const { scale = 0.7 } = options.namedEffect as BgFadeBack;

  return [
    {
      ...options,
      easing: 'linear',
      part: 'BG_LAYER',
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      startOffsetAdd: '100vh',
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
      part: 'BG_LAYER',
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      startOffsetAdd: '100vh',
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get endOffsetAdd() {
        return `calc(100vh + ${Math.round(0.5 * measures.compHeight)}px)`;
      },
      keyframes: [
        {
          scale: 1,
        },
        {
          scale,
        },
      ],
    },
  ];
}
