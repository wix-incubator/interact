import type { AnimationGroup } from '@wix/motion';
import type { TimeEffect, HandlerObjectMap, ViewEnterParams, InteractOptions } from '../types';
import { isSequenceEffect } from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';
import { getAnimation } from '../core/add';
import fastdom from 'fastdom';

const SAFE_OBSERVER_CONFIG: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: [0],
};

// Exit observer config for repeat/state types - watches when element is completely out of view
const EXIT_OBSERVER_CONFIG: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: [0],
};

const observers: Record<string, IntersectionObserver> = {};
const handlerMap = new WeakMap() as HandlerObjectMap;
const elementFirstRun = new WeakSet<HTMLElement>();
const elementObserverMap = new WeakMap<HTMLElement, IntersectionObserver>();
let viewEnterOptions: Partial<ViewEnterParams> = {};
let sharedExitObserver: IntersectionObserver | null = null;

function setOptions(options: Partial<ViewEnterParams>) {
  viewEnterOptions = options;
}

function invokeHandlers(target: HTMLElement, isIntersecting: boolean) {
  const handlers = handlerMap.get(target);
  handlers?.forEach(({ source, handler }) => {
    if (source === target) {
      handler!(isIntersecting);
    }
  });
}

function getExitObserver() {
  if (sharedExitObserver) {
    return sharedExitObserver;
  }

  sharedExitObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;

      if (!entry.isIntersecting) {
        // Element has completely exited the view
        invokeHandlers(target, false);
      }
    });
  }, EXIT_OBSERVER_CONFIG);

  return sharedExitObserver;
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
        rootMargin: options.inset ? `${options.inset} 0px ${options.inset}` : '0px',
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

            const needsSafeObserver = threshold && sourceHeight * threshold > rootHeight;

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

      const type = options.type || 'once';

      if (entry.isIntersecting || (type === 'alternate' && !isFirstRun)) {
        // For alternate type, handle exit using same observer as entry
        invokeHandlers(target, entry.isIntersecting);

        if (type === 'once') {
          observer.unobserve(entry.target);
          elementFirstRun.delete(target);
        }
      }
      // Note: repeat and state exit handling is done by a separate exit observer
      // that watches when element is completely out of view
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
  { reducedMotion, selectorCondition }: InteractOptions = {},
) {
  // For sequence effects, only the first effect (index 0) controls playback
  if (isSequenceEffect(effect) && effect._sequenceIndex !== 0) {
    // Non-leader sequence effects don't need handlers - the leader controls the Sequence
    return;
  }

  const mergedOptions = { ...viewEnterOptions, ...options };
  const type = mergedOptions.type || 'once';
  const animation = getAnimation(
    target,
    effectToAnimationOptions(effect),
    undefined,
    reducedMotion,
  ) as AnimationGroup | null;

  // Early return if animation is null, no observer created
  if (!animation) {
    return;
  }

  const observer = getObserver(mergedOptions);

  // Persist animation for non-once types to prevent auto-cleanup
  if (type !== 'once') {
    // Use persist() if available (Web Animations API)
    (animation as AnimationGroup & { persist?: () => void }).persist?.();
  }

  // Track initial play state for alternate type
  let isInitialPlay = true;

  if (animation?.isCSS) {
    animation.onFinish(() => {
      target.dataset.motionEnter = 'done';
    });
  }

  const handler = (isIntersecting?: boolean) => {
    if (selectorCondition && !target.matches(selectorCondition)) return;

    if (type === 'once') {
      if (isIntersecting) {
        animation.play(() => {
          if (!animation.isCSS) {
            target.dataset.motionEnter = 'done';
          }
        });
      }
    } else if (type === 'alternate') {
      if (isInitialPlay && isIntersecting) {
        isInitialPlay = false;
        animation.play();
      } else if (!isInitialPlay) {
        // On subsequent entry/exit reverse the animation
        animation.reverse();
      }
    } else if (type === 'repeat') {
      if (isIntersecting) {
        // On entry, reset progress to 0 before playing since the exit is a separate observer/range
        animation.progress(0);
        animation.play();
      } else {
        // On exit (completely out of view), pause and reset
        animation.pause();
        animation.progress(0);
      }
    } else if (type === 'state') {
      if (isIntersecting) {
        // Resume or start playing
        animation.play();
      } else {
        // On exit (completely out of view), just pause
        animation.pause();
      }
    }
  };

  const cleanup = () => {
    const currentObserver = elementObserverMap.get(source) || observer;
    currentObserver.unobserve(source);

    if (type === 'repeat' || type === 'state') {
      // Clean up exit observer if it exists
      const exitObserver = getExitObserver();
      exitObserver.unobserve(source);
    }

    animation.cancel();
    elementFirstRun.delete(source);
    elementObserverMap.delete(source);
  };
  const handlerObj = { source, target, handler, cleanup };

  addHandlerToMap(handlerMap, source, handlerObj);
  addHandlerToMap(handlerMap, target, handlerObj);

  elementObserverMap.set(source, observer);
  observer.observe(source);

  // For repeat and state types, set up a separate exit observer
  // that watches when element is completely out of view
  if (type === 'repeat' || type === 'state') {
    const exitObserver = getExitObserver();
    exitObserver.observe(source);
  }
}

function removeViewEnterHandler(element: HTMLElement) {
  removeElementFromHandlerMap(handlerMap, element);
}

function reset() {
  sharedExitObserver = null;
  Object.keys(observers).forEach((key) => delete observers[key]);
}

export default {
  add: addViewEnterHandler,
  remove: removeViewEnterHandler,
  setOptions,
  reset,
};
