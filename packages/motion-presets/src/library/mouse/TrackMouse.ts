import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  TrackMouse,
  Progress,
} from '../../types';
import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import { CustomMouse } from './CustomMouse';

class TrackMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { invert, distance, axis } = this.options;

    let translateX = 0;
    let translateY = 0;

    if (axis === 'both' || axis === 'horizontal') {
      translateX = mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
    }

    if (axis === 'both' || axis === 'vertical') {
      translateY = mapRange(0, 1, -distance.value, distance.value, progressY) * invert;
    }

    const units = getCssUnits(distance.type);

    this.target.style.transform = `translateX(${translateX}${units}) translateY(${translateY}${units}) rotate(var(--comp-rotate-z, 0deg))`;
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
    axis = 'both',
  } = options.namedEffect as TrackMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(transitionEasing)}`
      : '',
    invert,
    distance,
    axis,
  };

  return (target: HTMLElement) => new TrackMouseAnimation(target, animationOptions);
}
