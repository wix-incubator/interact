import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  SkewMouse,
  Progress,
} from '../../types';
import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import { circInOut } from '@wix/motion';
import { CustomMouse } from './CustomMouse';

class SkewMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    let translateX = 0;
    let translateY = 0;
    let skewX = 0;
    let skewY = 0;
    const { distance, angle, axis, invert } = this.options;

    if (axis !== 'vertical') {
      translateX = mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
      skewX = mapRange(0, 1, angle, -angle, progressX) * invert;
    }
    if (axis !== 'horizontal') {
      translateY = mapRange(0, 1, -distance.value, distance.value, progressY) * invert;
      skewY = mapRange(0, 1, angle, -angle, progressY) * invert;
    }
    if (axis === 'both') {
      skewX *= mapRange(0, 1, 1, -1, circInOut(progressY));
      skewY *= mapRange(0, 1, 1, -1, circInOut(progressX));
    }

    const units = getCssUnits(distance.type);

    const transform = `translateX(${translateX}${units}) translateY(${translateY}${units}) skew(${skewX}deg, ${skewY}deg) rotate(var(--comp-rotate-z, 0deg))`;

    this.target.style.transform = transform;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.transition = '';
  }
}

export default function create(options: ScrubAnimationOptions & AnimationExtraOptions) {
  const { transitionDuration, transitionEasing } = options;
  const {
    inverted = false,
    distance = { value: 200, type: 'px' },
    angle = 25,
    axis = 'both',
  } = options.namedEffect as SkewMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(transitionEasing)}`
      : '',
    invert,
    distance,
    angle,
    axis,
  };

  return (target: HTMLElement) => new SkewMouseAnimation(target, animationOptions);
}
