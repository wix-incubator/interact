import { test, expect, describe } from '@playwright/test';
import { AnimationGroupPage } from '../pages/animation-group-page';

describe('AnimationGroup API', () => {
  let animationGroupPage: AnimationGroupPage;

  test.beforeEach(async ({ page }) => {
    animationGroupPage = new AnimationGroupPage(page);
    await animationGroupPage.goto();
  });

  describe('Lifecycle Methods', () => {
    test('should play animation and resolve ready promise', async () => {
      await animationGroupPage.play();

      const playState = await animationGroupPage.getPlayState();
      expect(['running', 'finished']).toContain(playState);

      const events = await animationGroupPage.getLifecycleEvents();
      expect(events).toContain('play:ready');
    });

    test('should pause animation immediately', async () => {
      await animationGroupPage.play();
      await animationGroupPage.pause();

      const playState = await animationGroupPage.getPlayState();
      expect(playState).toBe('paused');

      const events = await animationGroupPage.getLifecycleEvents();
      expect(events).toContain('pause');
    });

    test('should reverse animation direction', async () => {
      await animationGroupPage.play();
      await animationGroupPage.reverse();

      const events = await animationGroupPage.getLifecycleEvents();
      expect(events).toContain('reverse:ready');
    });

    test('should cancel animation and reset', async () => {
      await animationGroupPage.play();
      await animationGroupPage.cancel();

      const playState = await animationGroupPage.getPlayState();
      expect(playState).toBe('idle');

      const events = await animationGroupPage.getLifecycleEvents();
      expect(events).toContain('cancel');
    });
  });

  describe('Callbacks', () => {
    test('should fire onFinish callback when animation completes', async ({ page }) => {
      await animationGroupPage.play();

      await page.waitForFunction(
        () => (window as unknown as { lifecycleEvents: string[] }).lifecycleEvents.includes('finish'),
        { timeout: 3000 },
      );

      expect(await animationGroupPage.getLifecycleEvents()).toContain('finish');
    });

    test('should handle multiple onFinish subscribers', async ({ page }) => {
      await animationGroupPage.play();

      await page.waitForFunction(
        () => (window as unknown as { lifecycleEvents: string[] }).lifecycleEvents.includes('finish'),
        { timeout: 3000 },
      );

      // Second play() registers a new onFinish listener independently
      await animationGroupPage.play();

      await page.waitForFunction(
        () => (window as unknown as { lifecycleEvents: string[] }).lifecycleEvents.filter((e: string) => e === 'finish').length >= 2,
        { timeout: 3000 },
      );

      const events = await animationGroupPage.getLifecycleEvents();
      expect(events.filter((e) => e === 'finish').length).toBeGreaterThanOrEqual(2);
    });
  });
});
