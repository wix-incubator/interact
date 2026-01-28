import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import type {
  ScrubAnimationOptions,
  AiryMouse,
  AnimationExtraOptions,
  Progress,
} from '../../types';
import { CustomMouse } from './CustomMouse';

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
    inverted = false,
    distance = { value: 200, type: 'px' },
    angle = 30,
    axis = 'both',
  } = options.namedEffect as AiryMouse;
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

  return (target: HTMLElement) => new AiryMouseAnimation(target, animationOptions);
}
