import type { AnimationGroup } from '@wix/motion';
import { getAnimation } from '@wix/motion';
import type {
  AnimationEndParams,
  TimeEffect,
  HandlerObjectMap,
  InteractOptions,
} from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';

const handlerMap = new WeakMap() as HandlerObjectMap;

function addAnimationEndHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: TimeEffect,
  __: AnimationEndParams,
  { reducedMotion }: InteractOptions,
): void {
  const animation = getAnimation(
    target,
    effectToAnimationOptions(effect),
    undefined,
    reducedMotion,
  ) as AnimationGroup;

  const handler = () => {
    animation.play();
  };
  const cleanup = () => {
    animation.cancel();
    source.removeEventListener('animationend', handler);
  };

  const handlerObj = { source, target, cleanup };
  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  source.addEventListener('animationend', handler);
}

function removeAnimationEndHandler(element: HTMLElement): void {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addAnimationEndHandler,
  remove: removeAnimationEndHandler,
};
