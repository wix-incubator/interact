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
  let initialPlay = true;
  const type = options.type || 'alternate';

  return (__: MouseEvent) => {
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
          element.dataset.motionEnter = 'done';
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

  return (__: MouseEvent) => {
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
  { reducedMotion, targetController, selectorCondition }: InteractOptions,
) {
  let handler: (event: MouseEvent) => void;
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
    source.removeEventListener('click', handler);
  };

  const handlerObj = { source, target, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  source.addEventListener('click', handler, { passive: true, once });
}

function removeClickHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addClickHandler,
  remove: removeClickHandler,
};
