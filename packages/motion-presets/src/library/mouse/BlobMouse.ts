import { getCssUnits, getMouseTransitionEasing, mapRange, parseLength } from '../../utils';
import { CustomMouse } from './CustomMouse';
import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  BlobMouse,
  Progress,
} from '../../types';

const DEFAULT_DISTANCE = { value: 200, type: 'px' };

class BlobMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { distance, scale, invert } = this.options;
    const translateX = mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
    const translateY = mapRange(0, 1, -distance.value, distance.value, progressY) * invert;

    const scaleX =
      progressX < 0.5
        ? mapRange(0, 0.5, scale, 1, progressX)
        : mapRange(0.5, 1, 1, scale, progressX);

    const scaleY =
      progressY < 0.5
        ? mapRange(0, 0.5, scale, 1, progressY)
        : mapRange(0.5, 1, 1, scale, progressY);

    const units = getCssUnits(distance.type);

    this.target.style.transform = `translateX(${translateX}${units}) translateY(${translateY}${units}) scale(${scaleX}, ${scaleY}) rotate(var(--motion-rotate, 0deg))`;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.transition = '';
  }
}

export default function create(options: ScrubAnimationOptions & AnimationExtraOptions) {
  const { transitionDuration, transitionEasing } = options;
  const namedEffect = options.namedEffect as BlobMouse;
  const {
    inverted = false,
    scale = 1.4,
  } = namedEffect;
  const distance = parseLength(namedEffect.distance, DEFAULT_DISTANCE);

  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(transitionEasing)}`
      : '',
    invert,
    distance,
    scale,
  };

  return (target: HTMLElement) => new BlobMouseAnimation(target, animationOptions);
}
