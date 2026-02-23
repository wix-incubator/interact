import { getAnimation } from '@wix/motion';
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
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';
import fastdom from 'fastdom';

const handlerMap = new WeakMap() as HandlerObjectMap;

function createTimeEffectHandler(
  element: HTMLElement,
  effect: TimeEffect & EffectBase,
  options: PointerTriggerParams,
  reducedMotion: boolean = false,
  selectorCondition?: string,
  preCreatedAnimation?: AnimationGroup | null,
) {
  const animation = (preCreatedAnimation ??
    getAnimation(
      element,
      effectToAnimationOptions(effect),
      undefined,
      reducedMotion,
    )) as AnimationGroup | null;

  // Return null if animation could not be created
  if (!animation) {
    return null;
  }

  let initialPlay = true;
  const type = options.type || 'alternate';

  return (__: MouseEvent | KeyboardEvent) => {
    if (selectorCondition && !element.matches(selectorCondition)) return;
    if (type === 'alternate') {
      if (initialPlay) {
        initialPlay = false;
        animation.play();
      } else {
        animation.reverse();
      }
    } else if (type === 'state') {
      if (initialPlay) {
        initialPlay = false;
        animation.play();
      } else {
        if (animation.playState === 'running') {
          animation.pause();
        } else if (animation.playState !== 'finished') {
          // 'idle' OR 'paused'
          animation.play();
        }
      }
    } else {
      // type === 'repeat'
      // type === 'once'
      animation.progress(0);

      if (animation.isCSS) {
        animation.onFinish(() => {
          // remove the animation from style
          fastdom.mutate(() => {
            element.dataset.interactEnter = 'done';
          });
        });
      }

      animation.play();
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
  const shouldSetStateOnElement = !!listContainer;

  return (__: MouseEvent | KeyboardEvent) => {
    if (selectorCondition && !element.matches(selectorCondition)) return;
    let item;
    if (shouldSetStateOnElement) {
      item = element.closest(
        `${listContainer} > ${listItemSelector || ''}:has(:scope)`,
      ) as HTMLElement | null;
    }

    targetController.toggleEffect(effectId, options.method || 'toggle', item);
  };
}

function addClickHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: (TimeEffect | TransitionEffect) & EffectBase,
  options: StateParams | PointerTriggerParams = {} as StateParams,
  {
    reducedMotion,
    targetController,
    selectorCondition,
    allowA11yTriggers,
    animation: preCreatedAnimation,
  }: InteractOptions,
) {
  let handler: ((event: MouseEvent | KeyboardEvent) => void) | null;
  let once = false;

  if (
    !preCreatedAnimation &&
    ((effect as TransitionEffect).transition || (effect as TransitionEffect).transitionProperties)
  ) {
    handler = createTransitionHandler(
      target,
      targetController!,
      effect as TransitionEffect & EffectBase & { effectId: string },
      options as StateParams,
      selectorCondition,
    );
  } else {
    handler = createTimeEffectHandler(
      target,
      effect as TimeEffect & EffectBase,
      options as PointerTriggerParams,
      reducedMotion,
      selectorCondition,
      preCreatedAnimation,
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
