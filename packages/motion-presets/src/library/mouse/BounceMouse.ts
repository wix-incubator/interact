import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  BounceMouse,
  TrackMouse,
} from '../../types';
import createTrack from './TrackMouse';

export default function create(
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
