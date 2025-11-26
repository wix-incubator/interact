import type {
  BgFade,
  DomApi,
  RangeOffset,
  ScrubAnimationOptions,
} from '../../types';
import { measureCompHeight } from './utils';

const EASE_IN = 'sineIn';
const EASE_OUT = 'sineOut';

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom);
  }

  const { range = 'in' } = options.namedEffect as BgFade;
  const isOut = range === 'out';
  const fromValue = isOut ? 1 : 0;
  const toValue = isOut ? 0 : 1;
  const easing = isOut ? EASE_OUT : EASE_IN;

  return [
    {
      ...options,
      part: 'BG_LAYER',
      easing,
      startOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      startOffsetAdd: isOut ? '100vh' : '0px',
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get endOffsetAdd() {
        return isOut
          ? `calc(100vh + ${measures.compHeight}px)`
          : `calc(50vh + ${Math.round(0.5 * measures.compHeight)}px)`;
      },
      keyframes: [
        {
          opacity: fromValue,
        },
        {
          opacity: toValue,
        },
      ],
    },
  ];
}
