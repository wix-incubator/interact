import type {
  BgSkew,
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

  const { angle = 20, direction = 'counter-clockwise' } =
    options.namedEffect as BgSkew;

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
        return `calc(100vh + ${measures.compHeight}px)`;
      },
      keyframes: [
        {
          transform: `skewY(${
            direction === 'counter-clockwise' ? angle : -angle
          }deg)`,
        },
        {
          transform: `skewY(${
            direction === 'counter-clockwise' ? -angle : angle
          }deg)`,
        },
      ],
    },
  ];
}
