import type {
  AnimationOptions,
  ScrubAnimationOptions,
  TriggerVariant,
  MouseAnimationInstance,
  AnimationEffectAPI,
  CustomMouseAnimationInstance,
  ScrubScrollScene,
  ScrubPointerScene,
  PointerMoveAxis,
} from './types';
import { AnimationGroup } from './AnimationGroup';
import { getEasing, getJsEasing } from './utils';
import { getWebAnimation } from './api/webAnimations';
import { getCSSAnimation } from './api/cssAnimations';
import { prepareAnimation } from './api/prepare';
import { getElement, getNamedEffect } from './api/common';

function getElementCSSAnimation(
  target: HTMLElement | string | null,
  animationOptions: AnimationOptions,
): AnimationGroup | null {
  const namedEffect = getNamedEffect(
    animationOptions,
  ) as AnimationEffectAPI<any> | null;

  if (!namedEffect) {
    return null;
  }

  if (!namedEffect.style) {
    // if this named effect does not have a style method, attempt to get group of Web Animations
    if (animationOptions.effectId && target) {
      return getElementAnimation(target, animationOptions.effectId);
    }

    return null;
  }

  const effectNames = namedEffect.getNames(animationOptions);
  const element = typeof target === 'string' ? getElement(target) : target;
  const animations = element?.getAnimations();
  const animationNames =
    animations?.map((anim) => (anim as CSSAnimation).animationName) ||
    ([] as string[]);
  const filteredAnimations: CSSAnimation[] = [];

  effectNames.forEach((name) => {
    if (animationNames.includes(name)) {
      filteredAnimations.push(
        animations?.find(
          (anim) => (anim as CSSAnimation).animationName === name,
        ) as CSSAnimation,
      );
    }
  });

  return filteredAnimations?.length
    ? new AnimationGroup(filteredAnimations)
    : null;
}

function getElementAnimation(
  target: HTMLElement | string,
  effectId: string,
): AnimationGroup | null {
  const element = typeof target === 'string' ? getElement(target) : target;
  // somehow get the right animations
  const animations = element
    ?.getAnimations()
    .filter((anim: Animation | CSSAnimation) => {
      const id = anim.id || (anim as CSSAnimation).animationName;
      // if no id/name just return all animations
      return id ? id.startsWith(effectId) : true;
    });

  return animations?.length ? new AnimationGroup(animations) : null;
}

function getScrubScene(
  target: HTMLElement | string | null,
  animationOptions: AnimationOptions,
  trigger: Partial<TriggerVariant> & { element?: HTMLElement },
  sceneOptions: Record<string, any> = {},
): ScrubScrollScene[] | ScrubPointerScene | ScrubPointerScene[] | null {
  const { disabled, allowActiveEvent, ...rest } = sceneOptions;
  const animation = getWebAnimation(target, animationOptions, trigger, rest);

  // Return null if animation could not be created
  if (!animation) {
    return null;
  }

  let typeSpecificOptions = {} as Record<string, any>;

  if (trigger.trigger === 'view-progress' && !window.ViewTimeline) {
    // TODO(ameerf): consider doing this only for bgscrub to not affect the other scroll effects
    const viewSource = trigger.element || getElement(trigger.componentId!);
    const { ready } = animation as AnimationGroup;

    return (animation as AnimationGroup).animations.map((partialAnimation) => {
      return {
        /* we use getters for start and end in order to access the animation's start and end
           only when initializing the scrub scene rather than immediately */
        get start() {
          return partialAnimation.start;
        },
        get end() {
          return partialAnimation.end;
        },
        viewSource,
        ready,
        getProgress() {
          return (animation as AnimationGroup).getProgress();
        },
        effect(__: any, p: number) {
          const { activeDuration } =
            partialAnimation.effect!.getComputedTiming();
          const { delay } = partialAnimation.effect!.getTiming();

          partialAnimation.currentTime =
            ((delay || 0) + ((activeDuration as number) || 0)) * p;
        },
        disabled,
        destroy() {
          partialAnimation.cancel();
        },
      } as ScrubScrollScene;
    });
  } else if (trigger.trigger === 'pointer-move') {
    const scrubOptions = animationOptions as ScrubAnimationOptions;
    const { centeredToTarget, transitionDuration, transitionEasing } =
      scrubOptions;
    const axis = (trigger as { axis?: PointerMoveAxis }).axis;

    if (scrubOptions.keyframeEffect) {
      const animationGroup = animation as AnimationGroup;

      if (animationGroup.animations?.length === 0) {
        return null;
      }

      const scene: ScrubPointerScene & { _currentProgress: number } = {
        target: undefined,
        centeredToTarget,
        ready: animationGroup.ready,
        _currentProgress: 0,
        getProgress() {
          return this._currentProgress;
        },
        effect(_scene: any, p: { x: number; y: number }) {
          const linearProgress = axis === 'x' ? p.x : p.y;
          this._currentProgress = linearProgress;
          animationGroup.progress(linearProgress);
        },
        disabled: disabled ?? false,
        destroy() {
          animationGroup.cancel();
        },
      };

      return scene;
    }

    typeSpecificOptions = {
      centeredToTarget,
      allowActiveEvent,
    };

    if (animationOptions.customEffect && transitionDuration) {
      typeSpecificOptions.transitionDuration = transitionDuration;
      typeSpecificOptions.transitionEasing = getJsEasing(transitionEasing);
    }
    typeSpecificOptions.target = (animation as MouseAnimationInstance).target;
  }

  return {
    ...typeSpecificOptions,
    getProgress() {
      return (
        animation as AnimationGroup | CustomMouseAnimationInstance
      ).getProgress();
    },
    effect(
      __: any,
      p: number | { x: number; y: number },
      v?: { x: number; y: number },
      active?: boolean,
    ) {
      animation.progress(
        v
          ? {
              // @ts-expect-error spread error on p
              ...p,
              v,
              active,
            }
          : p,
      );
    },
    disabled,
    destroy() {
      animation.cancel();
    },
  } as ScrubPointerScene;
}

function getAnimation(
  target: HTMLElement | string | null,
  animationOptions: AnimationOptions,
  trigger?: Partial<TriggerVariant> & { element?: HTMLElement },
  reducedMotion: boolean = false,
): AnimationGroup | MouseAnimationInstance | null {
  const animation = getElementCSSAnimation(target, animationOptions);

  if (animation) {
    animation.ready = new Promise((resolve) => {
      prepareAnimation(target, animationOptions, resolve);
    });

    return animation;
  }

  return getWebAnimation(target, animationOptions, trigger, { reducedMotion });
}

export {
  getCSSAnimation,
  getWebAnimation,
  getElementCSSAnimation,
  getElementAnimation,
  getScrubScene,
  prepareAnimation,
  getAnimation,
  getEasing,
};

export type { AnimationGroup };
