import type { TimeAnimationOptions, DomApi, AnimationExtraOptions } from '../../types';
import { getEasing, getTimingFactor } from '../../utils';

export function web(options: TimeAnimationOptions & AnimationExtraOptions, _dom?: DomApi) {
  return style(options, true);
}

export function style(options: TimeAnimationOptions & AnimationExtraOptions, _asWeb = false) {
  const duration = options.duration || 1;
  const delay = options.delay || 0;
  const easing = getEasing(options.easing || 'cubicInOut');
  const timingFactor = getTimingFactor(duration, delay) as number;
  const [name] = getNames(options);

  const keyframes = [
    {
      offset: 0,
      opacity: 1,
      easing,
    },
    {
      offset: 0.5 * timingFactor,
      opacity: 0,
      easing,
    },
    {
      offset: timingFactor,
      opacity: 1,
    },
    {
      offset: 1,
      opacity: 1,
    },
  ];

  return [
    {
      ...options,
      name,
      easing: 'linear',
      delay: 0,
      duration: duration + delay,
      keyframes,
    },
  ];
}

export function getNames(options: TimeAnimationOptions & AnimationExtraOptions) {
  const timingFactor = getTimingFactor(options.duration!, options.delay!, true);

  return [`motion-flash-${timingFactor}`];
}
