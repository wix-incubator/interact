import type { AnimationGroup } from '@wix/motion';
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
import { isSequenceEffect } from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';
import { getAnimation } from '../core/add';
import fastdom from 'fastdom';

const handlerMap = new WeakMap() as HandlerObjectMap;

function createTimeEffectHandler(
  element: HTMLElement,
  effect: TimeEffect & EffectBase,
  options: PointerTriggerParams,
  reducedMotion: boolean = false,
  selectorCondition?: string,
) {
  // For sequence effects, only the first effect (index 0) controls playback
  if (isSequenceEffect(effect) && effect._sequenceIndex !== 0) {
    // Non-leader sequence effects don't need handlers - the leader controls the Sequence
    return () => {};
  }

  const animation = getAnimation(
    element,
    effectToAnimationOptions(effect),
    undefined,
    reducedMotion,
  ) as AnimationGroup | null;

  // Return null if animation could not be created
  if (!animation) {
    return null;
  }

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
            // remove the animation from style
            fastdom.mutate(() => {
              element.dataset.motionEnter = 'done';
            });
          });
        }

        animation.play();
      }
    } else if (event.type === 'mouseleave' || event.type === 'focusout') {
      if (type === 'alternate') {
        animation.reverse();
      } else if (type === 'repeat') {
        animation.cancel();
        fastdom.mutate(() => {
          delete element.dataset.interactEnter;
        });
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
  {
    reducedMotion,
    targetController,
    selectorCondition,
    allowA11yTriggers,
  }: InteractOptions,
) {
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
