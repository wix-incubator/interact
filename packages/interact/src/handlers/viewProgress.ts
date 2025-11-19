import type { ScrubScrollScene } from '@wix/motion';
import { getWebAnimation, getScrubScene } from '@wix/motion';
import { Scroll } from 'fizban';
import type { ViewEnterParams, ScrubEffect, HandlerObjectMap } from '../types';
import {
  effectToAnimationOptions,
  addHandlerToMap,
  removeElementFromHandlerMap,
} from './utilities';

const scrollManagerMap = new WeakMap() as HandlerObjectMap;

function addViewProgressHandler(
  source: HTMLElement,
  target: HTMLElement,
  effect: ScrubEffect,
  __: ViewEnterParams,
  reducedMotion: boolean = false,
): void {
  if (reducedMotion) {
    return;
  }

  const triggerParams = {
    trigger: 'view-progress' as const,
    element: source,
  };

  const effectOptions = effectToAnimationOptions(effect);

  if ('ViewTimeline' in window) {
    // Use ViewTimeline for modern browsers
    const animationGroup = getWebAnimation(
      target,
      effectOptions,
      triggerParams,
    );

    if (animationGroup) {
      (animationGroup as any).play();
    }
  } else {
    const scene = getScrubScene(target, effectOptions, triggerParams);

    if (scene) {
      const scenes = Array.isArray(scene) ? scene : [scene];
      const scroll = new Scroll({
        viewSource: source,
        scenes,
        observeViewportEntry: false,
        observeViewportResize: false,
        observeSourcesResize: false,
        root: document.documentElement,
      });

      const cleanup = () => {
        scroll.destroy();
      };

      const handlerObj = { source, target, cleanup };

      addHandlerToMap(scrollManagerMap, source, handlerObj);
      addHandlerToMap(scrollManagerMap, target, handlerObj);

      Promise.all(
        (scenes as ScrubScrollScene[]).map((s) => s.ready || Promise.resolve()),
      ).then(() => {
        scroll.start();
      });
    }
  }
}

function removeViewProgressHandler(element: HTMLElement): void {
  removeElementFromHandlerMap(scrollManagerMap, element);
}

export default {
  add: addViewProgressHandler,
  remove: removeViewProgressHandler,
};
