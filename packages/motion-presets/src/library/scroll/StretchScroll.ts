import { cssEasings as easings } from '@wix/motion';
import type {
  AnimationFillMode,
  ScrubAnimationOptions,
  StretchScroll,
} from '../../types';

const POWER_MAP = {
  soft: { scaleY: 1.2, scaleX: 0.8 },
  medium: { scaleY: 1.5, scaleX: 0.6 },
  hard: { scaleY: 2, scaleX: 0.4 },
};

const KEYFRAMES_RANGE_MAP = {
  in: (scaleX: number, scaleY: number) => [
    {
      scale: `${scaleX} ${scaleY}`,
      translate: `0 ${100 * (scaleY - 1)}%`,
    },
    {
      scale: '1 1',
      translate: '0 0',
    },
  ],
  out: (scaleX: number, scaleY: number) => [
    {
      scale: '1 1',
      translate: '0 0',
    },
    {
      scale: `${scaleX} ${scaleY}`,
      translate: `0 ${100 * (1 - scaleY)}%`,
    },
  ],
  continuous: (scaleX: number, scaleY: number) => [
    {
      scale: `${scaleX} ${scaleY}`,
      translate: `0 ${100 * (scaleY - 1)}%`,
      easing: easings.backInOut,
    },
    {
      scale: '1 1',
      translate: '0 0',
      easing: easings.backInOut,
    },
    {
      scale: `${scaleX} ${scaleY}`,
      translate: `0 ${100 * (1 - scaleY)}%`,
    },
  ],
};
const opacityKeyframesMap = {
  in: [
    { opacity: 0, offset: 0 },
    { opacity: 1, offset: 0.65 },
  ],
  out: [
    { opacity: 1, offset: 0.35 },
    { opacity: 0, offset: 1 },
  ],
  continuous: [
    { opacity: 0, offset: 0 },
    { opacity: 1, offset: 0.325 },
    { opacity: 1, offset: 0.7 },
    { opacity: 0, offset: 1 },
  ],
};

export default function create(options: ScrubAnimationOptions) {
  const {
    power,
    stretch = 0.6,
    range = 'out',
  } = options.namedEffect as StretchScroll;
  const easing = range === 'continuous' ? 'linear' : 'backInOut';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const { scaleX, scaleY } =
    power && POWER_MAP[power]
      ? POWER_MAP[power]
      : { scaleX: 1 - stretch, scaleY: 1 + stretch };

  const animations = KEYFRAMES_RANGE_MAP[range](scaleX, scaleY);

  return [
    {
      ...options,
      fill,
      easing,
      keyframes: animations,
    },
    {
      ...options,
      fill,
      easing,
      keyframes: opacityKeyframesMap[range],
    },
  ];
}
