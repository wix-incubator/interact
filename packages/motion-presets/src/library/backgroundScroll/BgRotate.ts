import type { BgRotate, RangeOffset, ScrubAnimationOptions } from '../../types';

export default function create(options: ScrubAnimationOptions) {
  const easing = 'sineOut';
  const { angle = 22, direction = 'counter-clockwise' } = options.namedEffect as BgRotate;

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
      endOffsetAdd: '100vh',
      keyframes: [
        {
          transform: `rotate(${direction === 'counter-clockwise' ? angle : -angle}deg)`,
        },
        {
          transform: 'rotate(0deg)',
        },
      ],
    },
  ];
}
