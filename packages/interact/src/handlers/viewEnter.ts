import type { AnimationGroup } from '@wix/motion';
import { getAnimation } from '@wix/motion';
import type { TimeEffect, HandlerObjectMap, ViewEnterParams, InteractOptions } from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';

const observers: Record<string, IntersectionObserver> = {};
const handlerMap = new WeakMap() as HandlerObjectMap;

function getObserver(options: ViewEnterParams) {
  const key = JSON.stringify(options);

  if (observers[key]) {
    return observers[key];
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const handlers = handlerMap.get(entry.target as HTMLElement);

          handlers?.forEach(({ source, handler }) => {
            if (source === entry.target) {
              handler!();
            }
          });

          if (options.type === 'once') {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      root: null,
      rootMargin: options.inset
        ? `${options.inset} 0px ${options.inset}`
        : '0px',
      threshold: options.threshold,
    },
  );

  observers[key] = observer;

  return observer;
}

function addViewEnterHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: TimeEffect,
  options: ViewEnterParams = {},
  { reducedMotion }: InteractOptions,
) {
  const observer = getObserver(options);
  const animation = getAnimation(
    target,
    effectToAnimationOptions(effect),
    undefined,
    reducedMotion,
  ) as AnimationGroup;

  if (animation?.isCSS && options.type === 'once') {
    animation.onFinish(() => {
      target.dataset.motionEnter = 'done';
    });
  }

  const handler = () => {
    animation.play(() => {
      if (!animation.isCSS) {
        target.dataset.motionEnter = 'done';
      }
    });
  };
  const cleanup = () => {
    observer.unobserve(source);
    animation.cancel();
  };
  const handlerObj = { source, target, handler, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  observer.observe(source);
}

function removeViewEnterHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addViewEnterHandler,
  remove: removeViewEnterHandler,
};
