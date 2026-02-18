import type {
  Effect,
  EventTriggerConfig,
  InteractOptions,
  PointerTriggerParams,
  StateParams,
  TriggerHandlerMap,
  TriggerType,
} from '../types';
import viewEnterHandler from './viewEnter';
import viewProgressHandler from './viewProgress';
import pointerMoveHandler from './pointerMove';
import animationEndHandler from './animationEnd';
import eventTrigger from './eventTrigger';
import { EVENT_TRIGGER_PRESETS } from './effectHandlers';

type EventConfigOrGetter =
  | (typeof EVENT_TRIGGER_PRESETS)[keyof typeof EVENT_TRIGGER_PRESETS]
  | ((interactOptions?: InteractOptions) => EventTriggerConfig);

function withEventTriggerConfig(eventConfigOrGetter: EventConfigOrGetter) {
  return (
    source: HTMLElement,
    target: HTMLElement,
    effect: Effect,
    options: StateParams | PointerTriggerParams,
    interactOptions?: InteractOptions,
  ) => {
    const eventConfig =
      typeof eventConfigOrGetter === 'function'
        ? eventConfigOrGetter(interactOptions)
        : eventConfigOrGetter;
    eventTrigger.add(source, target, effect, { ...options, eventConfig }, interactOptions ?? {});
  };
}

function getClickEventConfig(interactOptions?: InteractOptions) {
  return interactOptions?.allowA11yTriggers
    ? EVENT_TRIGGER_PRESETS.activate
    : EVENT_TRIGGER_PRESETS.click;
}

function getHoverEventConfig(interactOptions?: InteractOptions) {
  return interactOptions?.allowA11yTriggers
    ? EVENT_TRIGGER_PRESETS.interest
    : EVENT_TRIGGER_PRESETS.hover;
}

export default {
  viewEnter: viewEnterHandler,
  hover: {
    add: withEventTriggerConfig(getHoverEventConfig),
    remove: eventTrigger.remove,
  },
  click: {
    add: withEventTriggerConfig(getClickEventConfig),
    remove: eventTrigger.remove,
  },
  pageVisible: viewEnterHandler,
  animationEnd: animationEndHandler,
  viewProgress: viewProgressHandler,
  pointerMove: pointerMoveHandler,
  activate: {
    add: withEventTriggerConfig(EVENT_TRIGGER_PRESETS.activate),
    remove: eventTrigger.remove,
  },
  interest: {
    add: withEventTriggerConfig(EVENT_TRIGGER_PRESETS.interest),
    remove: eventTrigger.remove,
  },
} as TriggerHandlerMap<TriggerType>;
