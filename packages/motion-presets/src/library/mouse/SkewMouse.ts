import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  SkewMouse,
  Progress,
  MouseEffectAxis,
} from '../../types';
import { getCssUnits, getMouseTransitionEasing, mapRange, parseLength, parseDirection } from '../../utils';
import { circInOut } from '@wix/motion';
import { CustomMouse } from './CustomMouse';

const DEFAULT_DISTANCE = { value: 200, type: 'px' };
const DEFAULT_ANGLE = 25;
const DEFAULT_AXIS: MouseEffectAxis = 'both';
const ALLOWED_AXIS_KEYWORDS = ['both', 'horizontal', 'vertical'] as const;

class SkewMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    let translateX = 0;
    let translateY = 0;
    let skewX = 0;
    let skewY = 0;
    const { distance, angle, axis, invert } = this.options;

    if (axis !== 'vertical') {
      translateX = mapRange(0, 1, -distance.value, distance.value, progressX) * invert;
      skewX = mapRange(0, 1, angle, -angle, progressX) * invert;
    }
    if (axis !== 'horizontal') {
      translateY = mapRange(0, 1, -distance.value, distance.value, progressY) * invert;
      skewY = mapRange(0, 1, angle, -angle, progressY) * invert;
    }
    if (axis === 'both') {
      skewX *= mapRange(0, 1, 1, -1, circInOut(progressY));
      skewY *= mapRange(0, 1, 1, -1, circInOut(progressX));
    }

    const units = getCssUnits(distance.type);

    const transform = `translateX(${translateX}${units}) translateY(${translateY}${units}) skew(${skewX}deg, ${skewY}deg) rotate(var(--motion-rotate, 0deg))`;

    this.target.style.transform = transform;
  }

  cancel() {
    this.target.style.transform = '';
    this.target.style.transition = '';
  }
}

export default function create(options: ScrubAnimationOptions & AnimationExtraOptions) {
  const { transitionDuration, transitionEasing } = options;
  const namedEffect = options.namedEffect as SkewMouse;
  const inverted = namedEffect.inverted ?? false;
  const distance = parseLength(namedEffect.distance, DEFAULT_DISTANCE);
  const angle = parseDirection(namedEffect.angle, [], DEFAULT_ANGLE, true) as number;
  const axis = parseDirection(namedEffect.axis, ALLOWED_AXIS_KEYWORDS, DEFAULT_AXIS) as MouseEffectAxis;
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

  return (target: HTMLElement) => new SkewMouseAnimation(target, animationOptions);
}
