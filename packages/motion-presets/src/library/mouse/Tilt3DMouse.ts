import { getMouseTransitionEasing, mapRange } from '@wix/motion';
import { CustomMouse } from './CustomMouse';
import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  Tilt3DMouse,
  Progress,
  EffectPower,
  ScrubTransitionEasing,
} from '../../types';

const paramsMap: Record<
  EffectPower,
  { angle: number; perspective: number; easing: ScrubTransitionEasing }
> = {
  soft: { angle: 25, perspective: 1000, easing: 'easeOut' },
  medium: { angle: 50, perspective: 500, easing: 'easeOut' },
  hard: { angle: 85, perspective: 200, easing: 'easeOut' },
};

class Tilt3DMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { invert, angle, perspective } = this.options;

    // if progressX === 0, rotateX === -angle, if progressX === 0.5, rotateX === 0, if progressX === 1, rotateX === angle
    const rotateX = mapRange(0, 1, angle, -angle, progressY) * invert;
    const rotateY = mapRange(0, 1, -angle, angle, progressX) * invert;

    this.target.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(var(--comp-rotate-z, 0deg))`;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.transition = '';
  }
}

export default function create(
  options: ScrubAnimationOptions & AnimationExtraOptions,
) {
  const { transitionDuration, transitionEasing } = options;
  const {
    power,
    inverted = false,
    angle = 5,
    perspective = 800,
  } = options.namedEffect as Tilt3DMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(
          power ? paramsMap[power].easing : transitionEasing,
        )}`
      : '',
    invert,
    angle: power ? paramsMap[power].angle : angle,
    perspective: power ? paramsMap[power].perspective : perspective,
  };

  return (target: HTMLElement) =>
    new Tilt3DMouseAnimation(target, animationOptions);
}
