import { test, expect } from '@playwright/test';
import { ResponsivePage } from '../pages/responsive-page';
import { waitForElementAnimationState, getElementAnimationPlayState } from '../utils/animation-helpers';

test.describe('Responsive Viewport Animation Behavior', () => {
  let responsivePage: ResponsivePage;
  let bp: { desktop: number; tablet: number; mobile: number };

  test.beforeEach(async ({ page }) => {
    responsivePage = new ResponsivePage(page);
    await responsivePage.goto();
    bp = await responsivePage.getBreakpointWidths();
  });

  test.describe('Per-Viewport Animation', () => {
    test('should run animation on desktop-sized viewport', async ({ page }) => {
      await responsivePage.setViewportSize(bp.desktop);
      await responsivePage.triggerAnimation();

      await waitForElementAnimationState(page, 'desktop-target', ['running', 'finished']);

      const playState = await getElementAnimationPlayState(page, 'desktop-target');
      expect(['running', 'finished']).toContain(playState);
    });

    test('should run animation on tablet-sized viewport', async ({ page }) => {
      await responsivePage.setViewportSize(bp.tablet);
      await responsivePage.triggerAnimation();

      await waitForElementAnimationState(page, 'tablet-target', ['running', 'finished']);

      const playState = await getElementAnimationPlayState(page, 'tablet-target');
      expect(['running', 'finished']).toContain(playState);
    });

    test('should run animation on mobile-sized viewport', async ({ page }) => {
      await responsivePage.setViewportSize(bp.mobile);
      await responsivePage.triggerAnimation();

      await waitForElementAnimationState(page, 'mobile-target', ['running', 'finished']);

      const playState = await getElementAnimationPlayState(page, 'mobile-target');
      expect(['running', 'finished']).toContain(playState);
    });
  });

  test.describe('Viewport Transitions', () => {
    test('should run animations after sequential viewport transitions', async ({ page }) => {
      await responsivePage.setViewportSize(bp.desktop);
      await responsivePage.triggerAnimation();
      await waitForElementAnimationState(page, 'desktop-target', ['running', 'finished']);

      await responsivePage.setViewportSize(bp.tablet);
      await responsivePage.triggerAnimation();
      await waitForElementAnimationState(page, 'tablet-target', ['running', 'finished']);

      await responsivePage.setViewportSize(bp.mobile);
      await responsivePage.triggerAnimation();
      await waitForElementAnimationState(page, 'mobile-target', ['running', 'finished']);
    });
  });

  /*
   * Out of motion-owned scope: these assertions validate condition routing logic
   * (fixture matchMedia/activeCondition semantics), which belongs to interact flow.
   *
   * test('should not apply tablet/mobile effects', async ({ page }) => {
   *   await responsivePage.setViewportSize(bp.desktop);
   *   await responsivePage.triggerAnimation();
   *
   *   const tabletAnimations = await page.evaluate(() => {
   *     return document.getElementById('tablet-target')?.getAnimations().length ?? 0;
   *   });
   *   const mobileAnimations = await page.evaluate(() => {
   *     return document.getElementById('mobile-target')?.getAnimations().length ?? 0;
   *   });
   *
   *   expect(tabletAnimations).toBe(0);
   *   expect(mobileAnimations).toBe(0);
   * });
   *
   * test('should switch effects when viewport resizes', async () => {
   *   await responsivePage.setViewportSize(bp.desktop);
   *   await responsivePage.triggerAnimation();
   *   expect(await responsivePage.getActiveCondition()).toBe('desktop');
   *
   *   await responsivePage.setViewportSize(bp.mobile);
   *   await responsivePage.waitForCondition('mobile');
   *
   *   expect(await responsivePage.getActiveCondition()).toBe('mobile');
   * });
   */
});
