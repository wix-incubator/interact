import { getCssUnits, getMouseTransitionEasing, distance2d, mapRange, safeMapGet } from '../../utils';
import { quadInOut } from '@wix/motion';
import { CustomMouse } from './CustomMouse';
import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  BlurMouse,
  Progress,
  EffectPower,
  ScrubTransitionEasing,
} from '../../types';

const paramsMap: Record<
  EffectPower,
  { angle: number; scale: number; easing: ScrubTransitionEasing }
> = {
  soft: { angle: 0, scale: 1, easing: 'easeOut' },
  medium: { angle: 25, scale: 0.7, easing: 'easeOut' },
  hard: { angle: 65, scale: 0.25, easing: 'easeOut' },
};
class BlurMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    const { distance, angle, scale, invert, blur, perspective } = this.options;

    const translateX = mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
    const translateY = mapRange(0, 1, -distance.value, distance.value, progressY) * invert;

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

    const maxScale = Math.min(scaleX, scaleY);

    // if progressX === 0, rotateX === -angle, if progressX === 0.5, rotateX === 0, if progressX === 1, rotateX === angle
    const rotateX = mapRange(0, 1, -angle, angle, progressY) * invert;
    const rotateY = mapRange(0, 1, angle, -angle, progressX) * invert;

    const units = getCssUnits(distance.type);

    const transform = `perspective(${perspective}px) translateX(${translateX}${units}) translateY(${translateY}${units}) scale(${maxScale}, ${maxScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(var(--comp-rotate-z, 0deg))`;

    const progressDistance = distance2d([0.5, 0.5], [progressX, progressY]);
    const blurFilter = Math.round(mapRange(0, 1, 0, blur, quadInOut(progressDistance)));

    const filter = `blur(${blurFilter}px)`;

    this.target.style.transform = transform;
    this.target.style.filter = filter;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.filter = '';
    this.target.style.transition = '';
  }
}

export default function create(options: ScrubAnimationOptions & AnimationExtraOptions) {
  const { transitionDuration, transitionEasing } = options;
  const {
    power,
    inverted = false,
    distance = { value: 80, type: 'px' },
    angle = 5,
    scale = 0.3,
    blur = 20,
    perspective = 600,
  } = options.namedEffect as BlurMouse;
  const invert = inverted ? -1 : 1;
  const powerParams = power ? safeMapGet(paramsMap, power, 'medium') : null;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(
          powerParams ? powerParams.easing : transitionEasing,
        )}, filter ${transitionDuration}ms ${getMouseTransitionEasing(
          powerParams ? powerParams.easing : transitionEasing,
        )}`
      : '',
    distance,
    angle: powerParams ? powerParams.angle : angle,
    scale: powerParams ? powerParams.scale : scale,
    blur,
    perspective,
    invert,
  };

  return (target: HTMLElement) => new BlurMouseAnimation(target, animationOptions);
}
