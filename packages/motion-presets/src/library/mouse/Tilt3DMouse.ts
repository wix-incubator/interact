import { getMouseTransitionEasing, mapRange } from '../../utils';
import { CustomMouse } from './CustomMouse';
import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  Tilt3DMouse,
  Progress,
} from '../../types';

class Tilt3DMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { invert, angle, perspective } = this.options;

    const rotateX = mapRange(0, 1, angle, -angle, progressY) * invert;
    const rotateY = mapRange(0, 1, -angle, angle, progressX) * invert;

    this.target.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(var(--comp-rotate-z, 0deg))`;
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
    angle = 5,
    perspective = 800,
  } = options.namedEffect as Tilt3DMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(transitionEasing)}`
      : '',
    invert,
    angle,
    perspective,
  };

  return (target: HTMLElement) => new Tilt3DMouseAnimation(target, animationOptions);
}
