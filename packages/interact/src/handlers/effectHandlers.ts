import { getAnimation } from '@wix/motion';
import type { AnimationGroup } from '@wix/motion';
import type {
  TimeEffect,
  TransitionEffect,
  StateParams,
  PointerTriggerParams,
  EffectBase,
  IInteractionController,
  EventTriggerConfigEnterLeave,
} from '../types';
import { effectToAnimationOptions } from './utilities';
import fastdom from 'fastdom';

export const EVENT_TRIGGER_PRESETS = {
  click: ['click'] as const,
  activate: ['click', 'keydown'] as const,
  hover: { enter: ['mouseenter'], leave: ['mouseleave'] } as const,
  interest: {
    enter: ['mouseenter', 'focusin'],
    leave: ['mouseleave', 'focusout'],
  } as const,
} as const;

export function createTimeEffectHandler(
  element: HTMLElement,
  effect: TimeEffect & EffectBase,
  options: PointerTriggerParams,
  reducedMotion: boolean = false,
  selectorCondition?: string,
  enterLeave?: EventTriggerConfigEnterLeave,
): ((event: MouseEvent | KeyboardEvent | FocusEvent) => void) | null {
  const animation = getAnimation(
    element,
    effectToAnimationOptions(effect),
    undefined,
    reducedMotion,
  ) as AnimationGroup | null;

  if (!animation) {
    return null;
  }

  let initialPlay = true;
  const type = options.type || 'alternate';
  const enterEvents: string[] = enterLeave?.enter ? [...enterLeave.enter] : [];
  const leaveEvents: string[] = enterLeave?.leave ? [...enterLeave.leave] : [];

  return (event: MouseEvent | KeyboardEvent | FocusEvent) => {
    if (selectorCondition && !element.matches(selectorCondition)) return;

    const isToggle = !enterLeave;
    const isEnter = enterEvents.length > 0 && enterEvents.includes(event.type);
    const isLeave = leaveEvents.length > 0 && leaveEvents.includes(event.type);

    if ((isEnter || isToggle) && (type === 'alternate' || type === 'state') && initialPlay) {
      initialPlay = false;
      animation.play();
    }
    if ((isEnter || isToggle) && type === 'alternate' && !initialPlay) {
      animation.reverse();
    }
    if (
      (isEnter || isToggle) &&
      type === 'state' &&
      !initialPlay &&
      animation.playState === 'running'
    ) {
      animation.pause();
    }
    if (
      (isEnter || isToggle) &&
      type === 'state' &&
      !initialPlay &&
      animation.playState !== 'running' &&
      animation.playState !== 'finished'
    ) {
      animation.play();
    }
    if ((isEnter || isToggle) && type !== 'alternate' && type !== 'state') {
      animation.progress(0);
      if (animation.isCSS) {
        animation.onFinish(() => {
          fastdom.mutate(() => {
            element.dataset[enterLeave ? 'motionEnter' : 'interactEnter'] = 'done';
          });
        });
      }
      animation.play();
    }

    if (isLeave && type === 'alternate') {
      animation.reverse();
    }
    if (isLeave && type === 'repeat') {
      animation.cancel();
      fastdom.mutate(() => {
        delete element.dataset.interactEnter;
      });
    }
    if (isLeave && type === 'state' && animation.playState === 'running') {
      animation.pause();
    }
  };
}

export function createTransitionHandler(
  element: HTMLElement,
  targetController: IInteractionController,
  {
    effectId,
    listContainer,
    listItemSelector,
  }: TransitionEffect & EffectBase & { effectId: string },
  options: StateParams,
  selectorCondition?: string,
  enterLeave?: EventTriggerConfigEnterLeave,
): (event: MouseEvent | KeyboardEvent | FocusEvent) => void {
  const shouldSetStateOnElement = !!listContainer;
  const method = options.method || 'toggle';
  const isToggle = method === 'toggle';
  const enterEvents: string[] = enterLeave?.enter ? [...enterLeave.enter] : [];
  const leaveEvents: string[] = enterLeave?.leave ? [...enterLeave.leave] : [];

  return (event: MouseEvent | KeyboardEvent | FocusEvent) => {
    if (selectorCondition && !element.matches(selectorCondition)) return;

    const item: HTMLElement | null | undefined = shouldSetStateOnElement
      ? (element.closest(
          `${listContainer} > ${listItemSelector || ''}:has(:scope)`,
        ) as HTMLElement | null)
      : undefined; // undefined when no listContainer so controller delegates to element.toggleEffect
    const isToggleMode = !enterLeave;
    const isEnter = enterEvents.length > 0 && enterEvents.includes(event.type);
    const isLeave = leaveEvents.length > 0 && leaveEvents.includes(event.type);

    if (isToggleMode) {
      targetController.toggleEffect(effectId, method, item);
    }
    if (!isToggleMode && isEnter) {
      targetController.toggleEffect(effectId, isToggle ? 'add' : method, item);
    }
    if (!isToggleMode && isLeave && isToggle) {
      targetController.toggleEffect(effectId, 'remove', item);
    }
  };
}
