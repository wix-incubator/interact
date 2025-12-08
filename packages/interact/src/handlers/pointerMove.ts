import { getScrubScene } from '@wix/motion';
import { Pointer } from 'kuliso';
import type {
  PointerMoveParams,
  ScrubEffect,
  HandlerObjectMap,
  InteractOptions,
} from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';

const pointerManagerMap = new WeakMap() as HandlerObjectMap;
let pointerOptionsGetter: () => Partial<PointerConfig> = () => ({});

function registerOptionsGetter(getter: () => Partial<PointerConfig>) {
  pointerOptionsGetter = getter;
}

function addPointerMoveHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: ScrubEffect,
  options: PointerMoveParams = {},
  { reducedMotion }: InteractOptions,
) {
  if (reducedMotion) {
    return;
  }

  const triggerParams = {
    trigger: 'pointer-move' as const,
    element: source,
  };

  const scene = getScrubScene(
    target,
    effectToAnimationOptions(effect),
    triggerParams,
  );

  if (scene) {
    const pointer = new Pointer({
      root: options.hitArea === 'root' ? document.documentElement : source,
      scenes: Array.isArray(scene) ? scene : [scene],
      ...pointerOptionsGetter(),
    });
    const cleanup = () => {
      pointer.destroy();
    };

    const handlerObj = { source, target, cleanup };

    addHandlerToMap(pointerManagerMap, source, handlerObj);
    addHandlerToMap(pointerManagerMap, target, handlerObj);

    pointer.start();
  }
}

function removePointerMoveHandler(element: HTMLElement) {
  removeElementFromHandlerMap(pointerManagerMap, element);
}

export default {
  add: addPointerMoveHandler,
  remove: removePointerMoveHandler,
  registerOptionsGetter,
};
