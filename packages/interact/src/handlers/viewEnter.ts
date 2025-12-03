import type { AnimationGroup } from '@wix/motion';
import { getAnimation } from '@wix/motion';
import type { TimeEffect, HandlerObjectMap, ViewEnterParams } from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';
import fastdom from 'fastdom';

const SAFE_OBSERVER_CONFIG: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: [0],
};

const observers: Record<string, IntersectionObserver> = {};
const handlerMap = new WeakMap() as HandlerObjectMap;
const elementFirstRun = new WeakSet<HTMLElement>();
const elementObserverMap = new WeakMap<HTMLElement, IntersectionObserver>();
let viewEnterOptions: Partial<ViewEnterParams> = {};

function setOptions(options: Partial<ViewEnterParams>) {
  viewEnterOptions = options;
}

function getObserver(options: ViewEnterParams, isSafeMode: boolean = false) {
  const key = JSON.stringify({ ...options, isSafeMode });

  if (observers[key]) {
    return observers[key];
  }

  const config: IntersectionObserverInit = isSafeMode
  ? SAFE_OBSERVER_CONFIG
  : {
      root: null,
      rootMargin: options.inset
        ? `${options.inset} 0px ${options.inset}`
        : '0px',
      threshold: options.threshold,
    };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const target = entry.target as HTMLElement;
    const isFirstRun = !elementFirstRun.has(target);

    if (isFirstRun) {
      elementFirstRun.add(target);

      if (options.useSafeViewEnter && !entry.isIntersecting) {
        fastdom.measure(() => {
          const sourceHeight = entry.boundingClientRect.height;
          const rootHeight = entry.rootBounds?.height;

          if (!rootHeight) {
            return;
          }

          const threshold = Array.isArray(options.threshold)
            ? Math.min(...options.threshold)
            : options.threshold;

          const needsSafeObserver =
            threshold && sourceHeight * threshold > rootHeight;

          if (needsSafeObserver) {
            fastdom.mutate(() => {
              observer.unobserve(target);
              const safeObserver = getObserver(options, true);
              elementObserverMap.set(target, safeObserver);
              safeObserver.observe(target);
            });
          }
        });
        return;
      }
    }

    if (entry.isIntersecting) {
      const handlers = handlerMap.get(target);

      handlers?.forEach(({ source, handler }) => {
        if (source === entry.target) {
          handler!();
        }
      });

      if (options.type === 'once') {
        observer.unobserve(entry.target);
        elementFirstRun.delete(target);
      }
    }
  });
}, config);

  observers[key] = observer;

  return observer;
}

function addViewEnterHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: TimeEffect,
  options: ViewEnterParams = {},
  reducedMotion: boolean = false,
) {
  const observer = getObserver({ ...viewEnterOptions, ...options });
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
    const currentObserver = elementObserverMap.get(source) || observer;
    currentObserver.unobserve(source);
    animation.cancel();
    elementFirstRun.delete(source);
    elementObserverMap.delete(source);
  };
  const handlerObj = { source, target, handler, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  elementObserverMap.set(source, observer);
  observer.observe(source);
}

function removeViewEnterHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

export default {
  add: addViewEnterHandler,
  remove: removeViewEnterHandler,
  setOptions,
};
