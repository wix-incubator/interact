import { cssEasings as easings } from '@wix/motion';
import type { AnimationFillMode, ScrubAnimationOptions, StretchScroll } from '../../types';
import { safeMapGet } from '../../utils';

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
      // TODO: refactor easings
      easing: easings.backInOut,
    },
    {
      scale: '1 1',
      translate: '0 0',
      // TODO: refactor easings
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
  const { power, stretch = 0.6, range: rawRange = 'out' } = options.namedEffect as StretchScroll;
  const range = rawRange in KEYFRAMES_RANGE_MAP ? rawRange : 'out';
  const easing = range === 'continuous' ? 'linear' : 'backInOut';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const powerParams = power ? safeMapGet(POWER_MAP, power, 'medium') : null;
  const { scaleX, scaleY } = powerParams ?? { scaleX: 1 - stretch, scaleY: 1 + stretch };

  const animations = safeMapGet(KEYFRAMES_RANGE_MAP, range, 'out')(scaleX, scaleY);

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
      keyframes: safeMapGet(opacityKeyframesMap, range, 'out'),
    },
  ];
}
