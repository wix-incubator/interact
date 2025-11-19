import type { AnimationGroup } from '@wix/motion';
import { getAnimation } from '@wix/motion';
import type {
  TimeEffect,
  TransitionEffect,
  StateParams,
  HandlerObjectMap,
  IInteractElement,
  PointerTriggerParams,
  EffectBase,
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
) {
  const animation = getAnimation(
    element,
    effectToAnimationOptions(effect),
    undefined,
    reducedMotion,
  ) as AnimationGroup;
  const type = options.type || 'alternate';
  let initialPlay = true;

  return (event: MouseEvent) => {
    if (event.type === 'mouseenter') {
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
    } else if (event.type === 'mouseleave') {
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
  {
    effectId,
    listContainer,
    listItemSelector,
  }: TransitionEffect & EffectBase & { effectId: string },
  options: StateParams,
) {
  const method = options.method || 'toggle';
  const isToggle = method === 'toggle';
  const shouldSetStateOnElement = !!listContainer;

  return (event: MouseEvent) => {
    const interactElement = element.closest(
      'interact-element',
    ) as IInteractElement;
    if (!interactElement) {
      return;
    }

    let item;
    if (shouldSetStateOnElement) {
      item = element.closest(
        `${listContainer} > ${listItemSelector || ''}:has(:scope)`,
      ) as HTMLElement | null;
    }

    if (event.type === 'mouseenter') {
      const method_ = isToggle ? 'add' : method;
      interactElement.toggleEffect(effectId, method_, item);
    } else if (event.type === 'mouseleave' && isToggle) {
      interactElement.toggleEffect(effectId, 'remove', item);
    }
  };
}

function addHoverHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: (TransitionEffect | TimeEffect) & EffectBase,
  options: StateParams | PointerTriggerParams = {},
  reducedMotion: boolean = false,
) {
  let handler: (event: MouseEvent) => void;
  let isStateTrigger = false;
  let once = false;

  if (
    (effect as TransitionEffect).transition ||
    (effect as TransitionEffect).transitionProperties
  ) {
    handler = createTransitionHandler(
      target,
      effect as TransitionEffect & EffectBase & { effectId: string },
      options as StateParams,
    );
    isStateTrigger = true;
  } else {
    handler = createTimeEffectHandler(
      target,
      effect as TimeEffect & EffectBase,
      options as PointerTriggerParams,
      reducedMotion,
    );
    once = (options as PointerTriggerParams).type === 'once';
  }

  const cleanup = () => {
    source.removeEventListener('mouseenter', handler);
    source.removeEventListener('mouseleave', handler);
  };

  const handlerObj = { source, target, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  source.addEventListener('mouseenter', handler, { passive: true, once });

  const addLeave = isStateTrigger
    ? ((options as StateParams).method || 'toggle') === 'toggle'
    : (options as PointerTriggerParams).type !== 'once';
  if (addLeave) {
    source.addEventListener('mouseleave', handler, { passive: true });
  }
}

function removeHoverHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addHoverHandler,
  remove: removeHoverHandler,
};
