import type { Page } from '@playwright/test';

/** Wait until a WAAPI animation on the given element reaches the target play state. */
export async function waitForPlayState(
  page: Page,
  selector: string,
  targetState: AnimationPlayState,
  timeout = 5000,
): Promise<void> {
  await page.waitForFunction(
    ({ sel, state }) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const animations = el.getAnimations();
      return animations.length > 0 && animations.every((a) => a.playState === state);
    },
    { sel: selector, state: targetState },
    { timeout },
  );
}

/** Return the computed style value of a CSS property on the given element. */
export function getComputedStyleProp(page: Page, selector: string, property: string): Promise<string> {
  return page.evaluate(
    ({ sel, prop }) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`Element not found: ${sel}`);
      return getComputedStyle(el).getPropertyValue(prop).trim();
    },
    { sel: selector, prop: property },
  );
}

/** Advance all WAAPI animations on the page by pausing them and setting currentTime. */
export async function advanceAnimationsTo(page: Page, selector: string, progressRatio: number): Promise<void> {
  await page.evaluate(
    ({ sel, ratio }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      for (const animation of el.getAnimations()) {
        animation.pause();
        const timing = animation.effect?.getTiming();
        const duration = Number(timing?.duration ?? 0);
        animation.currentTime = duration * ratio;
      }
    },
    { sel: selector, ratio: progressRatio },
  );
}

/** Return the getComputedTiming().progress of the first WAAPI animation on the element. */
export function getAnimationProgress(page: Page, selector: string): Promise<number> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element not found: ${sel}`);
    const animations = el.getAnimations();
    return animations[0]?.effect?.getComputedTiming().progress ?? 0;
  }, selector);
}
