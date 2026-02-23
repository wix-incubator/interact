import { test, expect } from '@playwright/test';
import { ScrollPage } from '../pages/scroll-page';

test.describe('Scroll-Driven Animations', () => {
  let scrollPage: ScrollPage;

  test.beforeEach(async ({ page }) => {
    scrollPage = new ScrollPage(page);
    await scrollPage.goto();
  });

  test.describe('View Progress Trigger', () => {
    test('should animate based on scroll progress', async () => {
      // Target starts below the fold (first section is 100vh spacer)
      const initialProgress = await scrollPage.getScrollProgress();
      expect(initialProgress).toBe(0);

      // Scroll down to bring the target into view
      await scrollPage.scrollElementIntoView('[data-testid="view-progress-target"]');

      const progressAfterScroll = await scrollPage.getScrollProgress();
      expect(progressAfterScroll).toBeGreaterThan(0);
    });

    test('should respect rangeStart and rangeEnd boundaries', async () => {
      // At the very top: target is below fold → progress is 0 (clamped)
      const startProgress = await scrollPage.getScrollProgress();
      expect(startProgress).toBe(0);

      // Scroll past the target so it is above the viewport → progress reaches 1 (clamped)
      await scrollPage.scrollElementIntoView('[data-testid="scrub-card-1"]');

      const endProgress = await scrollPage.getScrollProgress();
      expect(endProgress).toBe(1);
    });

    test('should update progress on scroll direction change', async () => {
      // Scroll target into partial view
      await scrollPage.scrollElementIntoView('[data-testid="view-progress-target"]');
      const progressDown = await scrollPage.getScrollProgress();
      expect(progressDown).toBeGreaterThan(0);

      // Scroll back toward top
      await scrollPage.scrollTo(0);
      const progressUp = await scrollPage.getScrollProgress();

      // Progress decreases when scrolling back up
      expect(progressUp).toBeLessThan(progressDown);
    });
  });

  test.describe('Scrub Scene', () => {
    test('should create scrub scene with correct range offsets', async () => {
      const { config, sceneStart, sceneEnd } = await scrollPage.getRangeOffsets();

      // The configured offsets should always be accessible
      expect(config.startOffset.name).toBe('entry');
      expect(config.endOffset.name).toBe('exit');

      // In the non-native-ViewTimeline fallback path, offsets are also readable
      // directly from the scene object (scene.start / scene.end)
      if (sceneStart !== null) {
        expect(sceneStart.name).toBe('entry');
        expect(sceneEnd?.name).toBe('exit');
      }
    });

    test('should report accurate progress percentage', async () => {
      // Scroll to bring target partially into view
      await scrollPage.scrollElementIntoView('[data-testid="view-progress-target"]');
      await scrollPage.scrollTo((await scrollPage.getScrollY()) - 100);

      const progress = await scrollPage.getScrollProgress();
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThanOrEqual(1);
    });

    test('should handle destroy cleanup properly', async ({ page, browserName }) => {
      // Skip in WebKit: scroll-driven animations driven by progress() (never play()) report "paused" after
      // cancel() instead of "idle" per WAAPI spec. Chromium/Firefox correctly return "idle".
      test.skip(browserName === 'webkit', 'WebKit reports paused instead of idle after cancel');

      await scrollPage.cancelScrubScene();

      await page.waitForFunction(
        () => (window as unknown as { scrubScene: { playState: string } }).scrubScene?.playState === 'idle',
        { timeout: 2000 },
      );

      const playState = await scrollPage.getScrubScenePlayState();
      expect(playState).toBe('idle');
    });
  });
});
