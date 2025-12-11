import type { Effect, InteractOptions, PointerTriggerParams, StateParams, TriggerHandlerMap, TriggerType } from '../types';
import viewEnterHandler from './viewEnter';
import viewProgressHandler from './viewProgress';
import hoverHandler from './hover';
import clickHandler from './click';
import pointerMoveHandler from './pointerMove';
import animationEndHandler from './animationEnd';

function withA11y<T extends typeof clickHandler | typeof hoverHandler>(
  handler: T,
): T {
  return {
    add: (
      source: HTMLElement,
      target: HTMLElement,
      effect: Effect,
      options: StateParams | PointerTriggerParams,
      interactOptions?: InteractOptions,
    ) =>
      handler.add(source, target, effect, options, {
        ...interactOptions,
        allowA11yTriggers: true,
      }),
    remove: handler.remove,
  } as T;
}

export default {
  viewEnter: viewEnterHandler,
  hover: hoverHandler,
  click: clickHandler,
  pageVisible: viewEnterHandler,
  animationEnd: animationEndHandler,
  viewProgress: viewProgressHandler,
  pointerMove: pointerMoveHandler,
  activate: withA11y(clickHandler),
  interest: withA11y(hoverHandler),
} as TriggerHandlerMap<TriggerType>;
