import { test, expect } from '@playwright/test';
import { ResponsivePage } from '../pages/responsive-page';

test.describe('Responsive Conditions', () => {
  let responsivePage: ResponsivePage;
  let bp: { desktop: number; tablet: number; mobile: number };

  test.beforeEach(async ({ page }) => {
    responsivePage = new ResponsivePage(page);
    await responsivePage.goto();
    bp = await responsivePage.getBreakpointWidths();
  });

  test.describe('Desktop Breakpoint', () => {
    test('should apply desktop effect above 1024px', async ({ page }) => {
      await responsivePage.setViewportSize(bp.desktop);
      await responsivePage.triggerAnimation();

      const condition = await responsivePage.getActiveCondition();
      expect(condition).toBe('desktop');

      await page.waitForFunction(
        () => {
          const el = document.getElementById('desktop-target');
          const state = el?.getAnimations()[0]?.playState;
          return state === 'running' || state === 'finished';
        },
        { timeout: 2000 },
      );

      const playState = await page.evaluate(() => {
        const el = document.getElementById('desktop-target');
        return el?.getAnimations()[0]?.playState ?? 'none';
      });
      expect(['running', 'finished']).toContain(playState);
    });

    test('should not apply tablet/mobile effects', async ({ page }) => {
      await responsivePage.setViewportSize(bp.desktop);
      await responsivePage.triggerAnimation();

      const tabletAnimations = await page.evaluate(() => {
        return document.getElementById('tablet-target')?.getAnimations().length ?? 0;
      });
      const mobileAnimations = await page.evaluate(() => {
        return document.getElementById('mobile-target')?.getAnimations().length ?? 0;
      });

      expect(tabletAnimations).toBe(0);
      expect(mobileAnimations).toBe(0);
    });
  });

  test.describe('Tablet Breakpoint', () => {
    test('should apply tablet effect between 768px and 1024px', async ({ page }) => {
      await responsivePage.setViewportSize(bp.tablet);
      await responsivePage.triggerAnimation();

      const condition = await responsivePage.getActiveCondition();
      expect(condition).toBe('tablet');

      // play() awaits fastdom — wait for the animation to actually start
      await page.waitForFunction(
        () => {
          const el = document.getElementById('tablet-target');
          const state = el?.getAnimations()[0]?.playState;
          return state === 'running' || state === 'finished';
        },
        { timeout: 2000 },
      );

      const playState = await page.evaluate(() => {
        const el = document.getElementById('tablet-target');
        return el?.getAnimations()[0]?.playState ?? 'none';
      });
      expect(['running', 'finished']).toContain(playState);
    });
  });

  test.describe('Mobile Breakpoint', () => {
    test('should apply mobile effect below 768px', async ({ page }) => {
      await responsivePage.setViewportSize(bp.mobile);
      await responsivePage.triggerAnimation();

      const condition = await responsivePage.getActiveCondition();
      expect(condition).toBe('mobile');

      // play() awaits fastdom — wait for the animation to actually start
      await page.waitForFunction(
        () => {
          const el = document.getElementById('mobile-target');
          const state = el?.getAnimations()[0]?.playState;
          return state === 'running' || state === 'finished';
        },
        { timeout: 2000 },
      );

      const playState = await page.evaluate(() => {
        const el = document.getElementById('mobile-target');
        return el?.getAnimations()[0]?.playState ?? 'none';
      });
      expect(['running', 'finished']).toContain(playState);
    });
  });

  test.describe('Dynamic Resize', () => {
    test('should switch effects when viewport resizes', async () => {
      await responsivePage.setViewportSize(bp.desktop);
      await responsivePage.triggerAnimation();
      expect(await responsivePage.getActiveCondition()).toBe('desktop');

      await responsivePage.setViewportSize(bp.mobile);
      await responsivePage.waitForCondition('mobile');

      expect(await responsivePage.getActiveCondition()).toBe('mobile');
    });
  });
});
