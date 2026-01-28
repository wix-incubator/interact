import {
  ScrubAnimationOptions,
  AnimationExtraOptions,
  SwivelMouse,
  MousePivotAxis,
  Progress,
} from '../../types';
import { getMouseTransitionEasing, mapRange } from '../../utils';
import { CustomMouse } from './CustomMouse';

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

    const rotate = mapRange(0, 1, -angle, angle, progress) * invertVertical * invert;

    const [translateX, translateY] = transformOrigins[pivotAxis as MousePivotAxis];
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
    inverted = false,
    angle = 5,
    perspective = 800,
    pivotAxis = 'center-horizontal',
  } = options.namedEffect as SwivelMouse;
  const invert = inverted ? -1 : 1;
  const animationOptions = {
    transition: transitionDuration
      ? `transform ${transitionDuration}ms ${getMouseTransitionEasing(transitionEasing)}`
      : '',
    invert,
    angle,
    perspective,
    pivotAxis,
  };

  return (target: HTMLElement) => new SwivelMouseAnimation(target, animationOptions);
}
