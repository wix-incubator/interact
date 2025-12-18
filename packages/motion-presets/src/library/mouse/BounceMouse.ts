import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  BounceMouse,
  TrackMouse,
} from '../../types';
import { web as createTrack } from './TrackMouse';

export function web(
  options: ScrubAnimationOptions & AnimationExtraOptions,
) {
  const { distance = { value: 80, type: 'px' } } =
    options.namedEffect as BounceMouse;
  const { transitionEasing = 'elastic' } = options;
  return createTrack({
    ...options,
    transitionEasing,
    namedEffect: { ...options.namedEffect, distance } as TrackMouse,
  });
}
