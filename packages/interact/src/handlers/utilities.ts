import type {
  TimeEffect,
  ScrubEffect,
  HandlerObject,
  HandlerObjectMap,
  AnimationOptions,
} from '../types';

export function effectToAnimationOptions(effect: TimeEffect | ScrubEffect) {
  if ((effect as TimeEffect).duration) {
    return {
      id: '',
      ...effect,
    } as AnimationOptions<'time'>;
  }

  const { rangeStart, rangeEnd, ...rest } = effect as ScrubEffect;
  return {
    id: '',
    startOffset: rangeStart,
    endOffset: rangeEnd,
    ...rest,
  } as AnimationOptions<'scrub'>;
}

export function addHandlerToMap(
  handlersMap: HandlerObjectMap,
  element: HTMLElement,
  handlerObj: HandlerObject,
) {
  let handlers = handlersMap.get(element);

  if (!handlers) {
    handlers = new Set();
    handlersMap.set(element, handlers);
  }

  handlers.add(handlerObj);
}

export function removeElementFromHandlerMap(
  handlerMap: HandlerObjectMap,
  element: HTMLElement,
) {
  const handlers = handlerMap.get(element);

  handlers?.forEach((handlerObj) => {
    const { source, target, cleanup } = handlerObj;
    cleanup();

    const otherKey = source === element ? target : source;
    const otherHandlers = handlerMap.get(otherKey);
    otherHandlers?.delete(handlerObj);
  });

  handlerMap.delete(element);
}
