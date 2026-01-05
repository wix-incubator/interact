import type {
  BgPullBack,
  DomApi,
  RangeOffset,
  ScrubAnimationOptions,
} from '../../types';
import { measureCompHeight } from './utils';

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom);
  }

  const easing = 'linear';
  const { scale = 50 } = options.namedEffect as BgPullBack;

  return [
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
        return `${measures.compHeight}px`;
      },
      keyframes: [
        {
          transform: `perspective(100px) translate3d(0px, -${
            (scale / 3) | 0
          }%, ${scale}px)`,
        },
        {
          transform: 'perspective(100px) translate3d(0px, 0px, 0px)',
        },
      ],
    },
  ];
}
