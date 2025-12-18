import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  SkewMouse,
  Progress,
  ScrubTransitionEasing,
  EffectPower,
} from '../../types';
import { getCssUnits, getMouseTransitionEasing, mapRange } from '../../utils';
import { circInOut } from '../../easings';
import { CustomMouse } from './CustomMouse';

const paramsMap: Record<
  EffectPower,
  { angle: number; easing: ScrubTransitionEasing }
> = {
  soft: { angle: 10, easing: 'easeOut' },
  medium: { angle: 20, easing: 'easeOut' },
  hard: { angle: 45, easing: 'easeOut' },
};

class SkewMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    let translateX = 0;
    let translateY = 0;
    let skewX = 0;
    let skewY = 0;
    const { distance, angle, axis, invert } = this.options;

    // distance
    if (axis !== 'vertical') {
      translateX =
        mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
      skewX = mapRange(0, 1, angle, -angle, progressX) * invert;
    }
    if (axis !== 'horizontal') {
      translateY =
        mapRange(0, 1, -distance.value, distance.value, progressY) * invert;
      skewY = mapRange(0, 1, angle, -angle, progressY) * invert;
    }
    if (axis === 'both') {
      // We want to do `skewX *= progressY < 0.5 ? 1 : -1`
      // but normalize it by y progress (so it will be 0 when y is 0.5)
      // and apply a circInOut easing on the progress so it will feel more natural
      skewX *= mapRange(0, 1, 1, -1, circInOut(progressY));

      // we want to do `skewY *= progressX < 0.5 ? 1 : -1`
      // but normalize it by x progress (so it will be 0 when x is 0.5)
      // and apply a circInOut easing on the progress so it will feel more natural
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

export function web(
  options: ScrubAnimationOptions & AnimationExtraOptions,
) {
  const { transitionDuration, transitionEasing } = options;
  const {
    power,
    inverted = false,
    distance = { value: 200, type: 'px' },
    angle = 25,
    axis = 'both',
  } = options.namedEffect as SkewMouse;
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

  return (target: HTMLElement) =>
    new SkewMouseAnimation(target, animationOptions);
}
