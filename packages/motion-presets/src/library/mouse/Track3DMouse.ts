import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  Track3DMouse,
  Progress,
} from '../../types';
import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import { CustomMouse } from './CustomMouse';

class Track3DMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { invert, distance, angle, axis, perspective } = this.options;

    let translateX = 0;
    let translateY = 0;
    let rotateX = 0;
    let rotateY = 0;

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

export default function create(options: ScrubAnimationOptions & AnimationExtraOptions) {
  const { transitionDuration, transitionEasing } = options;
  const {
    inverted = false,
    distance = { value: 200, type: 'px' },
    angle = 5,
    axis = 'both',
    perspective = 800,
  } = options.namedEffect as Track3DMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(transitionEasing)}`
      : '',
    invert,
    distance,
    axis,
    angle,
    perspective,
  };

  return (target: HTMLElement) => new Track3DMouseAnimation(target, animationOptions);
}
