import type {
  TimeEffect,
  TransitionEffect,
  StateParams,
  HandlerObjectMap,
  PointerTriggerParams,
  EffectBase,
  InteractOptions,
  EventTriggerConfig,
  EventTriggerConfigEnterLeave,
  EventTriggerParams,
} from '../types';
import { addHandlerToMap, removeElementFromHandlerMap } from './utilities';
import { createTimeEffectHandler, createTransitionHandler } from './effectHandlers';

const handlerMap = new WeakMap() as HandlerObjectMap;

type GenericEventConfig = {
  toggle?: string[];
  enter?: string[];
  leave?: string[];
};

function isEnterLeaveConfigShape(
  config: EventTriggerConfig,
): config is EventTriggerConfigEnterLeave {
  return (
    typeof config === 'object' && !Array.isArray(config) && ('enter' in config || 'leave' in config)
  );
}

function createGenericEventConfig(config: EventTriggerConfig): GenericEventConfig {
  if (typeof config === 'string') {
    return { toggle: [config] };
  }
  if (Array.isArray(config)) {
    return { toggle: [...config] };
  }
  if (isEnterLeaveConfigShape(config)) {
    const enter = config.enter ? [...config.enter] : [];
    const leave = config.leave ? [...config.leave] : [];
    return { enter, leave };
  }
  return {};
}

function isEnterLeaveMode(genericConfig: GenericEventConfig): boolean {
  return (genericConfig.enter?.length ?? 0) > 0 || (genericConfig.leave?.length ?? 0) > 0;
}

function getEnterLeaveConfig(
  genericConfig: GenericEventConfig,
): EventTriggerConfigEnterLeave | undefined {
  return isEnterLeaveMode(genericConfig)
    ? { enter: genericConfig.enter ?? [], leave: genericConfig.leave ?? [] }
    : undefined;
}

function addEventTriggerHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: (TimeEffect | TransitionEffect) & EffectBase,
  options: EventTriggerParams,
  { reducedMotion, targetController, selectorCondition, allowA11yTriggers }: InteractOptions,
) {
  const genericConfig = createGenericEventConfig(options.eventConfig);
  const isTransition =
    (effect as TransitionEffect).transition || (effect as TransitionEffect).transitionProperties;

  const enterLeave = getEnterLeaveConfig(genericConfig);

  let handler: ((event: MouseEvent | KeyboardEvent | FocusEvent) => void) | null;
  let once = false;

  if (isTransition) {
    handler = createTransitionHandler(
      target,
      targetController!,
      effect as TransitionEffect & EffectBase & { effectId: string },
      options as StateParams,
      selectorCondition,
      enterLeave,
    );
  } else {
    handler = createTimeEffectHandler(
      target,
      effect as TimeEffect & EffectBase,
      options as PointerTriggerParams,
      reducedMotion,
      selectorCondition,
      enterLeave,
    );
    once = (options as PointerTriggerParams).type === 'once';
  }

  if (!handler) {
    return;
  }

  const listeners: { element: HTMLElement; event: string; fn: EventListener }[] = [];

  function addListener(
    element: HTMLElement,
    event: string,
    fn: EventListener,
    options?: AddEventListenerOptions,
  ) {
    element.addEventListener(event, fn, options);
    listeners.push({ element, event, fn });
  }

  const focusListener = (e: FocusEvent) => {
    if (!source.contains(e.relatedTarget as HTMLElement)) {
      (handler as (e: FocusEvent) => void)(e);
    }
  };

  const clickListener = (e: MouseEvent) => {
    if ((e as PointerEvent).pointerType) {
      (handler as (e: MouseEvent) => void)(e);
    }
  };

  const keydownListener = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      (handler as (e: KeyboardEvent) => void)(e);
    } else if (e.code === 'Enter') {
      (handler as (e: KeyboardEvent) => void)(e);
    }
  };

  const cleanup = () => {
    listeners.forEach(({ element, event, fn }) => {
      element.removeEventListener(event, fn);
    });
  };

  const handlerObj = { source, target, cleanup };
  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  const isEnterLeave = isEnterLeaveMode(genericConfig);
  if (isEnterLeave) {
    const enter = genericConfig.enter ?? [];
    const leaveEvents = genericConfig.leave ?? [];
    enter.forEach((eventType) => {
      if (eventType === 'focusin') {
        if (allowA11yTriggers) {
          source.tabIndex = 0;
          addListener(source, eventType, focusListener as EventListener, { once });
        }
        return;
      }
      addListener(source, eventType, handler as EventListener, { passive: true, once });
    });
    const addLeaveListeners = isTransition
      ? (options as StateParams).method === 'toggle'
      : (options as PointerTriggerParams).type !== 'once';
    if (addLeaveListeners) {
      leaveEvents.forEach((eventType) => {
        if (eventType === 'focusout') {
          if (allowA11yTriggers) {
            addListener(source, eventType, focusListener as EventListener, { once });
          }
          return;
        }
        addListener(source, eventType, handler as EventListener, { passive: true });
      });
    }
  } else {
    const events = genericConfig.toggle ?? [];
    events.forEach((eventType) => {
      const opts = { passive: true, once };
      if (eventType === 'click') {
        addListener(source, 'click', clickListener as EventListener, opts);
      } else if (eventType === 'keydown') {
        addListener(source, 'keydown', keydownListener as EventListener, { once });
      } else {
        addListener(source, eventType, handler as EventListener, opts);
      }
    });
  }
}

function removeEventTriggerHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addEventTriggerHandler,
  remove: removeEventTriggerHandler,
};
