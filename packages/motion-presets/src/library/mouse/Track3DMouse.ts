import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  Track3DMouse,
  Progress,
  EffectPower,
  ScrubTransitionEasing,
} from '../../types';
import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import { CustomMouse } from './CustomMouse';

const paramsMap: Record<
  EffectPower,
  { angle: number; perspective: number; easing: ScrubTransitionEasing }
> = {
  soft: { angle: 25, perspective: 1000, easing: 'easeOut' },
  medium: { angle: 50, perspective: 500, easing: 'easeOut' },
  hard: { angle: 85, perspective: 333, easing: 'easeOut' },
};

class Track3DMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { invert, distance, angle, axis, perspective } = this.options;

    let translateX = 0;
    let translateY = 0;
    let rotateX = 0;
    let rotateY = 0;
    // if progressX === 0, translateX === -distance
    // if progressX === 0.5, translateX === 0
    // if progressX === 1, translateX === distance
    // if progressX === 0, rotateX === -angle, if progressX === 0.5, rotateX === 0, if progressX === 1, rotateX === angle
    if (axis === 'both' || axis === 'horizontal') {
      translateX = mapRange(0, 1, -distance.value, distance.value, progressX);
      rotateY = mapRange(0, 1, -angle, angle, progressX) * invert;
    }
    if (axis === 'both' || axis === 'vertical') {
      translateY = mapRange(0, 1, -distance.value, distance.value, progressY);
      rotateX = mapRange(0, 1, angle, -angle, progressY) * invert;
    }
    const units = getCssUnits(distance.type);

    this.target.style.transform = `perspective(${perspective}px) translateX(${translateX}${units}) translateY(${translateY}${units}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(var(--comp-rotate-z, 0deg))`;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.transition = '';
  }
}

export function create(
  options: ScrubAnimationOptions & AnimationExtraOptions,
) {
  const { transitionDuration, transitionEasing } = options;
  const {
    power,
    inverted = false,
    distance = { value: 200, type: 'px' },
    angle = 5,
    axis = 'both',
    perspective = 800,
  } = options.namedEffect as Track3DMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(
          power ? paramsMap[power].easing : transitionEasing,
        )}`
      : '',
    invert,
    distance,
    axis,
    angle: power ? paramsMap[power].angle : angle,
    perspective: power ? paramsMap[power].perspective : perspective,
  };

  return (target: HTMLElement) =>
    new Track3DMouseAnimation(target, animationOptions);
}
