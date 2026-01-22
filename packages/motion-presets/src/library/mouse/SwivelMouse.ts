import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  SwivelMouse,
  MousePivotAxis,
  Progress,
  EffectPower,
  ScrubTransitionEasing,
} from '../../types';
import { getMouseTransitionEasing, mapRange, safeMapGet } from '../../utils';
import { CustomMouse } from './CustomMouse';

const paramsMap: Record<
  EffectPower,
  { angle: number; perspective: number; easing: ScrubTransitionEasing }
> = {
  soft: { angle: 25, perspective: 1000, easing: 'easeOut' },
  medium: { angle: 50, perspective: 700, easing: 'easeOut' },
  hard: { angle: 85, perspective: 300, easing: 'easeOut' },
};

const transformOrigins: Record<MousePivotAxis, [number, number]> = {
  top: [0, -50],
  bottom: [0, 50],
  right: [50, 0],
  left: [-50, 0],
  'center-horizontal': [0, 0],
  'center-vertical': [0, 0],
};

class SwivelMouseAnimation extends CustomMouse {
  progress({ x: progressX, y: progressY }: Progress) {
    let rotateAxis = 'rotateX';
    let progress = progressY;
    let invertVertical = -1;

    const { pivotAxis, angle, invert, perspective } = this.options;
    if (pivotAxis === 'center-horizontal' || pivotAxis === 'right' || pivotAxis === 'left') {
      rotateAxis = 'rotateY';
      progress = progressX;
      invertVertical = 1;
    }

    // if progress  === 0, rotate === angle, if progress === 0.5, rotate === 0, if progress === 1, rotate === angle
    const rotate = mapRange(0, 1, -angle, angle, progress) * invertVertical * invert;

    const [translateX, translateY] = safeMapGet(transformOrigins, pivotAxis as string, 'center-horizontal');
    const transform = `perspective(${perspective}px) translateX(${translateX}%) translateY(${translateY}%) ${rotateAxis}(${rotate}deg) translateX(${-translateX}%) translateY(${-translateY}%) rotate(var(--comp-rotate-z, 0deg))`;

    this.target.style.transform = transform;
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
    angle = 5,
    perspective = 800,
    pivotAxis: rawPivotAxis = 'center-horizontal',
  } = options.namedEffect as SwivelMouse;
  const invert = inverted ? -1 : 1;
  const pivotAxis = rawPivotAxis in transformOrigins ? rawPivotAxis : 'center-horizontal';
  const powerParams = power ? safeMapGet(paramsMap, power, 'medium') : null;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(
          powerParams ? powerParams.easing : transitionEasing,
        )}`
      : '',
    invert,
    angle: powerParams ? powerParams.angle : angle,
    perspective: powerParams ? powerParams.perspective : perspective,
    pivotAxis,
  };

  return (target: HTMLElement) => new SwivelMouseAnimation(target, animationOptions);
}
