import type { AnimationGroup } from '@wix/motion';
import { getAnimation } from '@wix/motion';
import type {
  TimeEffect,
  TransitionEffect,
  StateParams,
  HandlerObjectMap,
  PointerTriggerParams,
  EffectBase,
  IInteractionController,
  InteractOptions,
} from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';

const handlerMap = new WeakMap() as HandlerObjectMap;

function createTimeEffectHandler(
  element: HTMLElement,
  effect: TimeEffect & EffectBase,
  options: PointerTriggerParams,
  reducedMotion: boolean = false,
  selectorCondition?: string,
) {
  const animation = getAnimation(
    element,
    effectToAnimationOptions(effect),
    undefined,
    reducedMotion,
  ) as AnimationGroup;
  const type = options.type || 'alternate';
  let initialPlay = true;

  return (event: MouseEvent | FocusEvent) => {
    if (selectorCondition && !element.matches(selectorCondition)) return;
    if (event.type === 'mouseenter' || event.type === 'focusin') {
      if (type === 'alternate') {
        if (initialPlay) {
          initialPlay = false;
          animation.play();
        } else {
          animation.reverse();
        }
      } else if (type === 'state') {
        if (animation.playState !== 'finished') {
          // 'idle' OR 'paused'
          animation.play();
        }
      } else {
        // type === 'repeat'
        // type === 'once'
        animation.progress(0);

        if (animation.isCSS) {
          animation.onFinish(() => {
            element.dataset.motionEnter = 'done';
          });
        }

        animation.play();
      }
    } else if (event.type === 'mouseleave' || event.type === 'focusout') {
      if (type === 'alternate') {
        animation.reverse();
      } else if (type === 'repeat') {
        animation.cancel();
        delete element.dataset.motionEnter;
      } else if (type === 'state') {
        if (animation.playState === 'running') {
          animation.pause();
        }
      }
    }
  };
}

function createTransitionHandler(
  element: HTMLElement,
  targetController: IInteractionController,
  {
    effectId,
    listContainer,
    listItemSelector,
  }: TransitionEffect & EffectBase & { effectId: string },
  options: StateParams,
  selectorCondition?: string,
) {
  const method = options.method || 'toggle';
  const isToggle = method === 'toggle';
  const shouldSetStateOnElement = !!listContainer;

  return (event: MouseEvent | FocusEvent) => {
    if (selectorCondition && !element.matches(selectorCondition)) return;
    let item;
    if (shouldSetStateOnElement) {
      item = element.closest(
        `${listContainer} > ${listItemSelector || ''}:has(:scope)`,
      ) as HTMLElement | null;
    }

    if (event.type === 'mouseenter' || event.type === 'focusin') {
      const method_ = isToggle ? 'add' : method;
      targetController.toggleEffect(effectId, method_, item);
    } else if ((event.type === 'mouseleave' || event.type === 'focusout') && isToggle) {
      targetController.toggleEffect(effectId, 'remove', item);
    }
  };
}

function addHoverHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: (TransitionEffect | TimeEffect) & EffectBase,
  options: StateParams | PointerTriggerParams = {},
  { reducedMotion, targetController, selectorCondition, allowA11yTriggers }: InteractOptions,
) {
  let handler: (event: MouseEvent | FocusEvent) => void;
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
    );
    isStateTrigger = true;
  } else {
    handler = createTimeEffectHandler(
      target,
      effect as TimeEffect & EffectBase,
      options as PointerTriggerParams,
      reducedMotion,
      selectorCondition,
    );
    once = (options as PointerTriggerParams).type === 'once';
  }

  const cleanup = () => {
    source.removeEventListener('mouseenter', handler);
    source.removeEventListener('mouseleave', handler);
    if (allowA11yTriggers) {
      source.removeEventListener('focusin', handler);
      source.removeEventListener('focusout', handler);
    }
  };

  const handlerObj = { source, target, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  if (allowA11yTriggers) {
    source.tabIndex = 0;
    source.addEventListener(
      'focusin',
      (event) => {
        if (!source.contains(event.relatedTarget as HTMLElement)) {
          handler(event);
        }
      },
      { once },
    );
  }

  source.addEventListener('mouseenter', handler, { passive: true, once });

  const addLeave = isStateTrigger
    ? ((options as StateParams).method || 'toggle') === 'toggle'
    : (options as PointerTriggerParams).type !== 'once';
  if (addLeave) {
    source.addEventListener('mouseleave', handler, { passive: true });

    if (allowA11yTriggers) {
      source.addEventListener(
        'focusout',
        (event) => {
          if (!source.contains(event.relatedTarget as HTMLElement)) {
            handler(event);
          }
        },
        { once },
      );
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
