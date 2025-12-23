import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import { CustomMouse } from './CustomMouse';
import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  BlobMouse,
  Progress,
  EffectPower,
  ScrubTransitionEasing,
} from '../../types';

const paramsMap: Record<
  EffectPower,
  { scale: number; easing: ScrubTransitionEasing }
> = {
  soft: { scale: 1.2, easing: 'easeOut' },
  medium: { scale: 1.6, easing: 'easeOut' },
  hard: { scale: 2.4, easing: 'easeOut' },
};

class BlobMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { distance, scale, invert } = this.options;
    const translateX =
      mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
    const translateY =
      mapRange(0, 1, -distance.value, distance.value, progressY) * invert;

    // if progressX === 0 || progressX === 1, scaleX === scale, if progressX === 0.5, scaleX === 1
    const scaleX =
      progressX < 0.5
        ? mapRange(0, 0.5, scale, 1, progressX)
        : mapRange(0.5, 1, 1, scale, progressX);

    // if progressY === 0 || progressY === 1, scaleY === scale, if progressY === 0.5, scaleY === 1
    const scaleY =
      progressY < 0.5
        ? mapRange(0, 0.5, scale, 1, progressY)
        : mapRange(0.5, 1, 1, scale, progressY);

    const units = getCssUnits(distance.type);

    this.target.style.transform = `translateX(${translateX}${units}) translateY(${translateY}${units}) scale(${scaleX}, ${scaleY}) rotate(var(--comp-rotate-z, 0deg))`;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.transition = '';
  }
}

export function web(
  options: ScrubAnimationOptions & AnimationExtraOptions,
) {
  const { transitionDuration, transitionEasing } = options;
  const {
    power,
    inverted = false,
    distance = { value: 200, type: 'px' },
    scale = 1.4,
  } = options.namedEffect as BlobMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(
          power ? paramsMap[power].easing : transitionEasing,
        )}`
      : '',
    invert,
    distance,
    scale: power ? paramsMap[power].scale : scale,
  };

  return (target: HTMLElement) =>
    new BlobMouseAnimation(target, animationOptions);
}
