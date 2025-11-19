import type {
  DomApi,
  ImageParallax,
  RangeOffset,
  ScrubAnimationOptions,
} from '../../types';
import { measureCompHeight, measureSiteHeight } from './utils';

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const {
    speed = 1.5,
    reverse = false,
    isPage = false,
  } = options.namedEffect as ImageParallax;

  const measures = { compHeight: 0, siteHeight: 0 };
  if (dom) {
    if (isPage) {
      measureSiteHeight(measures, dom);
    } else {
      measureCompHeight(measures, dom);
    }
  }

  let start = -100 * (speed - 1);
  if (!isPage) {
    start = start / speed;
  }
  let end = 0;
  if (reverse) {
    [start, end] = [end, start];
  }

  return [
    {
      ...options,
      part: 'BG_MEDIA',
      startOffset: {
        name: isPage ? 'contain' : 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      endOffset: {
        name: 'cover',
        offset: { type: 'percentage', value: 0 },
      } as RangeOffset,
      get endOffsetAdd() {
        return isPage
          ? `${measures.siteHeight}px`
          : `calc(100vh + ${measures.compHeight}px)`;
      },
      keyframes: [
        {
          transform: `translateY(${start | 0}%)`,
        },
        {
          transform: `translateY(${end | 0}%)`,
        },
      ],
    },
  ];
}
