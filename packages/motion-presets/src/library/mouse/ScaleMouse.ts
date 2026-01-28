import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import { CustomMouse } from './CustomMouse';
import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  ScaleMouse,
  Progress,
} from '../../types';

class ScaleMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { distance, scale, invert, axis } = this.options;

    let translateX = 0;
    let translateY = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (axis === 'both' || axis === 'horizontal') {
      translateX = mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
      scaleX =
        progressX < 0.5
          ? mapRange(0, 0.5, scale, 1, progressX)
          : mapRange(0.5, 1, 1, scale, progressX);
    }

    if (axis === 'both' || axis === 'vertical') {
      translateY = mapRange(0, 1, -distance.value, distance.value, progressY) * invert;
      scaleY =
        progressY < 0.5
          ? mapRange(0, 0.5, scale, 1, progressY)
          : mapRange(0.5, 1, 1, scale, progressY);
    }

    const scaleBoth = scale < 1 ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);

    const units = getCssUnits(distance.type);

    this.target.style.transform = `translateX(${translateX}${units}) translateY(${translateY}${units}) scale(${scaleBoth}) rotate(var(--comp-rotate-z, 0deg))`;
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
    distance = { value: 80, type: 'px' },
    axis = 'both',
    scale = 1.4,
  } = options.namedEffect as ScaleMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(transitionEasing)}`
      : '',
    invert,
    distance,
    axis,
    scale,
  };

  return (target: HTMLElement) => new ScaleMouseAnimation(target, animationOptions);
}
