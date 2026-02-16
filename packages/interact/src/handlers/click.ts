import type {
  TimeEffect,
  TransitionEffect,
  StateParams,
  HandlerObjectMap,
  PointerTriggerParams,
  EffectBase,
  InteractOptions,
} from '../types';
import { addHandlerToMap, removeElementFromHandlerMap } from './utilities';
import { createTimeEffectHandler, createTransitionHandler } from './effectHandlers';

const handlerMap = new WeakMap() as HandlerObjectMap;

function addClickHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: (TimeEffect | TransitionEffect) & EffectBase,
  options: StateParams | PointerTriggerParams = {} as StateParams,
  { reducedMotion, targetController, selectorCondition, allowA11yTriggers }: InteractOptions,
) {
  let handler: ((event: MouseEvent | KeyboardEvent) => void) | null;
  let once = false;

  if (
    (effect as TransitionEffect).transition ||
    (effect as TransitionEffect).transitionProperties
  ) {
    handler = createTransitionHandler(
      target,
      targetController!,
      effect as TransitionEffect & EffectBase & { effectId: string },
      options as StateParams,
      selectorCondition,
      undefined,
    );
  } else {
    handler = createTimeEffectHandler(
      target,
      effect as TimeEffect & EffectBase,
      options as PointerTriggerParams,
      reducedMotion,
      selectorCondition,
      undefined,
    );
    once = (options as PointerTriggerParams).type === 'once';
  }

  // Early return if animation is null, no event listeners added
  if (!handler) {
    return;
  }

  // Store references to the actual listener functions so we can remove them later
  const clickListener = (e: MouseEvent) => {
    if ((e as PointerEvent).pointerType) {
      handler(e);
    }
  };

  const keydownListener = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      handler(event);
    } else if (event.code === 'Enter') {
      handler(event);
    }
  };

  const cleanup = () => {
    source.removeEventListener('click', clickListener);
    if (allowA11yTriggers) {
      source.removeEventListener('keydown', keydownListener);
    }
  };

  const handlerObj = { source, target, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  source.addEventListener('click', clickListener, { passive: true, once });

  if (allowA11yTriggers) {
    source.tabIndex = 0;
    source.addEventListener('keydown', keydownListener, { once });
  }
}

function removeClickHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addClickHandler,
  remove: removeClickHandler,
};
