import type { BgPan, DomApi, RangeOffset, ScrubAnimationOptions } from '../../types';
import { measureCompHeight } from './utils';

export default function create(options: ScrubAnimationOptions, dom?: DomApi) {
  const measures = { compHeight: 0 };
  if (dom) {
    measureCompHeight(measures, dom);
  }

  const { direction = 'left', speed = 0.2 } = options.namedEffect as BgPan;
  const offsetPercentage = ((50 * speed) / (1 + speed)) | 0;
  let fromValue = `${offsetPercentage}%`;
  let toValue = `-${offsetPercentage}%`;
  if (direction === 'right') {
    [fromValue, toValue] = [toValue, fromValue];
  }

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
          transform: `translateX(${fromValue})`,
        },
        {
          transform: `translateX(${toValue})`,
        },
      ],
    },
  ];
}
