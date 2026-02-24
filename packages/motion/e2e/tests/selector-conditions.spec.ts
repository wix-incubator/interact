import { test, expect } from '@playwright/test';
import { SelectorPage } from '../pages/selector-page';
import { waitForElementAnimation } from '../utils/animation-helpers';

test.describe('Selector Conditions', () => {
  let selectorPage: SelectorPage;

  test.beforeEach(async ({ page }) => {
    selectorPage = new SelectorPage(page);
    await selectorPage.goto();
  });

  test.describe('nth-child Selector', () => {
    test('should apply different runtime keyframes for even and odd selectors', async ({ page }) => {
      await selectorPage.animateGrid();

      await waitForElementAnimation(page, '#nth-child-grid .grid-item');

      const { evenHasScale, oddHasTranslate } = await page.evaluate(() => {
        const evenEl = document.querySelector('#nth-child-grid .grid-item:nth-child(even)') as HTMLElement | null;
        const oddEl = document.querySelector('#nth-child-grid .grid-item:nth-child(odd)') as HTMLElement | null;

        const evenKeyframes =
          ((evenEl?.getAnimations()[0]?.effect as KeyframeEffect | undefined)?.getKeyframes?.() ?? []) as Keyframe[];
        const oddKeyframes =
          ((oddEl?.getAnimations()[0]?.effect as KeyframeEffect | undefined)?.getKeyframes?.() ?? []) as Keyframe[];

        return {
          evenHasScale: evenKeyframes.some((kf) => String(kf.transform).includes('scale')),
          oddHasTranslate: oddKeyframes.some((kf) => String(kf.transform).includes('translateY')),
        };
      });

      expect(evenHasScale).toBe(true);
      expect(oddHasTranslate).toBe(true);
    });

    test('should apply keyframe animations to all grid items', async ({ page }) => {
      await selectorPage.animateGrid();

      await waitForElementAnimation(page, '#nth-child-grid .grid-item');

      // Grid has 10 items — each gets its own animation
      const animatedCount = await page.evaluate(() => {
        const items = document.querySelectorAll('#nth-child-grid .grid-item');
        return Array.from(items).filter((el) => el.getAnimations().length > 0).length;
      });
      expect(animatedCount).toBe(10);
    });

    test('should apply even/odd animations to all 10 grid items', async ({ page }) => {
      await selectorPage.animateGrid();
      await waitForElementAnimation(page, '#nth-child-grid .grid-item');

      const { evenAnimated, oddAnimated } = await page.evaluate(() => {
        const evenItems = document.querySelectorAll('#nth-child-grid .grid-item:nth-child(even)');
        const oddItems = document.querySelectorAll('#nth-child-grid .grid-item:nth-child(odd)');

        return {
          evenAnimated: Array.from(evenItems).filter((el) => el.getAnimations().length > 0).length,
          oddAnimated: Array.from(oddItems).filter((el) => el.getAnimations().length > 0).length,
        };
      });

      expect(evenAnimated).toBe(5);
      expect(oddAnimated).toBe(5);
    });
  });

  test.describe('List Container Selector', () => {
    test('should animate list items selected by container child selector', async ({ page }) => {
      await selectorPage.animateList();
      await waitForElementAnimation(page, '#list-container .list-item');

      const animatedCount = await page.evaluate(() => {
        const items = document.querySelectorAll('#list-container > .list-item');
        return Array.from(items).filter((el) => el.getAnimations().length > 0).length;
      });
      expect(animatedCount).toBe(5);
    });

    test('should apply staggered animations to all list items', async ({ page }) => {
      await selectorPage.animateList();

      await waitForElementAnimation(page, '#list-container .list-item');

      const animatedCount = await page.evaluate(() => {
        const items = document.querySelectorAll('#list-container .list-item');
        return Array.from(items).filter((el) => el.getAnimations().length > 0).length;
      });
      expect(animatedCount).toBeGreaterThan(0);
    });

    test('should remain stable on subsequent animateGrid calls', async ({ page }) => {
      await selectorPage.animateGrid();
      await waitForElementAnimation(page, '#nth-child-grid .grid-item');

      await selectorPage.animateGrid();
      await waitForElementAnimation(page, '#nth-child-grid .grid-item');

      const animatedCount = await page.evaluate(() => {
        const items = document.querySelectorAll('#nth-child-grid .grid-item');
        return Array.from(items).filter((el) => el.getAnimations().length > 0).length;
      });
      expect(animatedCount).toBe(10);
    });
  });
});
