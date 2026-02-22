import { test, expect } from '@playwright/test';
import { PointerPage } from '../pages/pointer-page';

test.describe('Pointer-Driven Animations', () => {
  let pointerPage: PointerPage;

  test.beforeEach(async ({ page }) => {
    pointerPage = new PointerPage(page);
    await pointerPage.goto();
  });

  test.describe('Pointer Move Trigger', () => {
    test('should drive x-axis animation based on horizontal position', async ({ page }) => {
      await pointerPage.movePointerWithinElement('[data-testid="pointer-area"]', 0.05, 0.5);
      const transformLeft = await page.evaluate(
        () => getComputedStyle(document.getElementById('x-axis-target')!).transform,
      );

      await pointerPage.movePointerWithinElement('[data-testid="pointer-area"]', 0.95, 0.5);
      const transformRight = await page.evaluate(
        () => getComputedStyle(document.getElementById('x-axis-target')!).transform,
      );

      expect(transformLeft).not.toBe(transformRight);
    });

    test('should drive y-axis animation based on vertical position', async ({ page }) => {
      await pointerPage.movePointerWithinElement('[data-testid="y-axis-area"]', 0.5, 0.05);
      const transformTop = await page.evaluate(
        () => getComputedStyle(document.getElementById('y-axis-target')!).transform,
      );

      await pointerPage.movePointerWithinElement('[data-testid="y-axis-area"]', 0.5, 0.95);
      const transformBottom = await page.evaluate(
        () => getComputedStyle(document.getElementById('y-axis-target')!).transform,
      );

      expect(transformTop).not.toBe(transformBottom);
    });
  });

  test.describe('Composite Operations', () => {
    test('should create two independent AnimationGroup instances on the same element', async ({ page }) => {
      // Trigger progress on both groups so animations leave idle state and become visible to getAnimations()
      await pointerPage.movePointerWithinElement('[data-testid="composite-area"]', 0.5, 0.5);

      const animationCount = await page.evaluate(
        () => document.getElementById('composite-target')?.getAnimations().length ?? 0,
      );

      expect(animationCount).toBeGreaterThanOrEqual(2);
    });

    test('should respond to both x and y pointer axes independently', async ({ page }) => {
      await pointerPage.movePointerWithinElement('[data-testid="composite-area"]', 0.05, 0.05);
      const transformAtOrigin = await page.evaluate(
        () => getComputedStyle(document.getElementById('composite-target')!).transform,
      );

      await pointerPage.movePointerWithinElement('[data-testid="composite-area"]', 0.95, 0.95);
      const transformAtEnd = await page.evaluate(
        () => getComputedStyle(document.getElementById('composite-target')!).transform,
      );

      expect(transformAtOrigin).not.toBe(transformAtEnd);
    });
  });

  test.describe('Cleanup', () => {
    test('should move AnimationGroup to idle state after cancel', async () => {
      await pointerPage.cancelPointerScene();

      const playState = await pointerPage.getPointerScenePlayState();
      expect(playState).toBe('idle');
    });
  });
});
