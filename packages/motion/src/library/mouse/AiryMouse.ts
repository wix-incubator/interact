import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import type {
  ScrubAnimationOptions,
  AiryMouse,
  AnimationExtraOptions,
  Progress,
  ScrubTransitionEasing,
  EffectPower,
} from '../../types';
import { CustomMouse } from './CustomMouse';

const paramsMap: Record<EffectPower, { angle: number; easing: ScrubTransitionEasing }> = {
  soft: { angle: 10, easing: 'easeOut' },
  medium: { angle: 50, easing: 'easeOut' },
  hard: { angle: 85, easing: 'easeOut' },
};

class AiryMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    let translateX = 0;
    let translateY = 0;
    const { distance, invert, angle, axis } = this.options;

    if (axis !== 'vertical') {
      translateX = mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
    }
    if (axis !== 'horizontal') {
      translateY = mapRange(0, 1, -distance.value, distance.value, progressY) * invert;
    }

    // if progress  === 0, rotate === angle, if progress === 0.5, rotate === 0, if progress === 1, rotate === angle
    const rotate = mapRange(0, 1, -angle, angle, progressX) * invert;
    const units = getCssUnits(distance.type);

    this.target.style.transform = `translateX(${translateX}${units}) translateY(${translateY}${units}) rotate(calc(${rotate}deg + var(--comp-rotate-z, 0deg)))`;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.transition = '';
  }
}

export default function create(options: ScrubAnimationOptions & AnimationExtraOptions) {
  const { transitionDuration, transitionEasing } = options;
  const {
    power,
    inverted = false,
    distance = { value: 200, type: 'px' },
    angle = 30,
    axis = 'both',
  } = options.namedEffect as AiryMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(
          power ? paramsMap[power].easing : transitionEasing,
        )}`
      : '',
    invert,
    distance,
    angle: power ? paramsMap[power].angle : angle,
    axis,
  };

  return (target: HTMLElement) => new AiryMouseAnimation(target, animationOptions);
}
