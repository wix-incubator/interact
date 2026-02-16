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
import {
  createTimeEffectHandler,
  createTransitionHandler,
  EVENT_TRIGGER_PRESETS,
} from './effectHandlers';

const handlerMap = new WeakMap() as HandlerObjectMap;

function addHoverHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: (TransitionEffect | TimeEffect) & EffectBase,
  options: StateParams | PointerTriggerParams = {},
  { reducedMotion, targetController, selectorCondition, allowA11yTriggers }: InteractOptions,
) {
  const enterLeaveConfig = allowA11yTriggers
    ? EVENT_TRIGGER_PRESETS.interest
    : EVENT_TRIGGER_PRESETS.hover;

  let handler: ((event: MouseEvent | FocusEvent) => void) | null;
  let isStateTrigger = false;
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
      enterLeaveConfig,
    );
    isStateTrigger = true;
  } else {
    handler = createTimeEffectHandler(
      target,
      effect as TimeEffect & EffectBase,
      options as PointerTriggerParams,
      reducedMotion,
      selectorCondition,
      enterLeaveConfig,
    );
    once = (options as PointerTriggerParams).type === 'once';
  }

  // Early return if animation is null, no event listeners added
  if (!handler) {
    return;
  }

  const focusinListener = (event: FocusEvent) => {
    if (!source.contains(event.relatedTarget as HTMLElement)) {
      handler(event);
    }
  };

  const focusoutListener = (event: FocusEvent) => {
    if (!source.contains(event.relatedTarget as HTMLElement)) {
      handler(event);
    }
  };

  const cleanup = () => {
    source.removeEventListener('mouseenter', handler);
    source.removeEventListener('mouseleave', handler);
    if (allowA11yTriggers) {
      source.removeEventListener('focusin', focusinListener);
      source.removeEventListener('focusout', focusoutListener);
    }
  };

  const handlerObj = { source, target, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  if (allowA11yTriggers) {
    source.tabIndex = 0;
    source.addEventListener('focusin', focusinListener, { once });
  }

  source.addEventListener('mouseenter', handler, { passive: true, once });

  const addLeave = isStateTrigger
    ? ((options as StateParams).method || 'toggle') === 'toggle'
    : (options as PointerTriggerParams).type !== 'once';
  if (addLeave) {
    source.addEventListener('mouseleave', handler, { passive: true });

    if (allowA11yTriggers) {
      source.addEventListener('focusout', focusoutListener, { once });
    }
  }
}

function removeHoverHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addHoverHandler,
  remove: removeHoverHandler,
};
