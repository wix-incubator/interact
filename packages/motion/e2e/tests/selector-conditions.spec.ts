import { test, expect } from '@playwright/test';
import { SelectorPage } from '../pages/selector-page';

test.describe('Selector Conditions', () => {
  let selectorPage: SelectorPage;

  test.beforeEach(async ({ page }) => {
    selectorPage = new SelectorPage(page);
    await selectorPage.goto();
  });

  test.describe('nth-child Selector', () => {
    test('should animate even and odd grid items with different effects', async () => {
      await selectorPage.animateGrid();

      const selectors = await selectorPage.getMatchedSelectors();
      expect(selectors).toContain(':nth-child(even)');
      expect(selectors).toContain(':nth-child(odd)');
    });

    test('should apply keyframe animations to all grid items', async ({ page }) => {
      await selectorPage.animateGrid();

      // play() awaits fastdom — wait for animations to actually start before counting
      await page.waitForFunction(
        () => document.querySelectorAll('#nth-child-grid .grid-item')[0]?.getAnimations().length > 0,
        { timeout: 2000 },
      );

      // Grid has 10 items — each gets its own animation
      const animatedCount = await page.evaluate(() => {
        const items = document.querySelectorAll('#nth-child-grid .grid-item');
        return Array.from(items).filter((el) => el.getAnimations().length > 0).length;
      });
      expect(animatedCount).toBe(10);
    });

    test('should track matched selectors per item type', async () => {
      await selectorPage.animateGrid();

      const selectors = await selectorPage.getMatchedSelectors();
      // Only even/odd selectors should be recorded
      expect(selectors.length).toBe(2);
      expect(selectors).toEqual(expect.arrayContaining([':nth-child(even)', ':nth-child(odd)']));
    });
  });

  test.describe('List Container Selector', () => {
    test('should animate list items using container selector', async () => {
      await selectorPage.animateList();

      const selectors = await selectorPage.getMatchedSelectors();
      expect(selectors).toContain('list-container > .list-item');
    });

    test('should apply staggered animations to all list items', async ({ page }) => {
      await selectorPage.animateList();

      // play() awaits fastdom — wait for animations to actually start
      await page.waitForFunction(
        () => document.querySelectorAll('#list-container .list-item')[0]?.getAnimations().length > 0,
        { timeout: 2000 },
      );

      const animatedCount = await page.evaluate(() => {
        const items = document.querySelectorAll('#list-container .list-item');
        return Array.from(items).filter((el) => el.getAnimations().length > 0).length;
      });
      expect(animatedCount).toBeGreaterThan(0);
    });

    test('should reset matched selectors on subsequent animateGrid calls', async () => {
      await selectorPage.animateGrid();
      const firstRun = await selectorPage.getMatchedSelectors();
      expect(firstRun.length).toBe(2);

      // animateGrid resets matchedSelectors before running
      await selectorPage.animateGrid();
      const secondRun = await selectorPage.getMatchedSelectors();
      expect(secondRun.length).toBe(2);
    });
  });
});
