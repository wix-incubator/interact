import { test, expect } from '@playwright/test';
import { ScrollPage } from '../pages/scroll-page';
import { waitForWindowPlayState } from '../utils/animation-helpers';
import { SCROLL_SELECTORS } from '../constants/scroll';

test.describe('Scroll-Driven Animations', () => {
  test.describe('Default Runtime', () => {
    let scrollPage: ScrollPage;

    test.beforeEach(async ({ page }) => {
      scrollPage = new ScrollPage(page);
      await scrollPage.goto();
    });

    test('should animate based on scroll progress', async () => {
      const initialProgress = await scrollPage.getScrollProgress();
      expect(initialProgress).toBe(0);

      await scrollPage.scrollElementIntoView(SCROLL_SELECTORS.viewProgressTarget);

      const progressAfterScroll = await scrollPage.getScrollProgress();
      expect(progressAfterScroll).toBeGreaterThan(0);
    });

    test('should support getScrubScene with native ViewTimeline when available', async () => {
      const supportsNative = await scrollPage.supportsNativeViewTimeline();
      test.skip(!supportsNative, 'Native ViewTimeline is not available in this browser runtime.');

      const sceneMode = await scrollPage.getScrubSceneMode();
      expect(sceneMode).toBe('native');
      const { sceneStart, sceneEnd } = await scrollPage.getRangeOffsets();
      expect(sceneStart).toBeNull();
      expect(sceneEnd).toBeNull();
    });

    test('should run native customEffect for scroll-driven animation', async () => {
      const supportsNative = await scrollPage.supportsNativeViewTimeline();
      test.skip(!supportsNative, 'Native ViewTimeline is required for this customEffect flow.');

      await scrollPage.scrollTo(0);
      await scrollPage.wait(60);
      const before = await scrollPage.getNativeCustomValues();

      await scrollPage.scrollElementIntoView(SCROLL_SELECTORS.nativeCustomTarget);
      await scrollPage.wait(120);
      const after = await scrollPage.getNativeCustomValues();

      expect(after.progress).toBeGreaterThan(before.progress);
      expect(after.shift).toBeGreaterThan(before.shift);
    });

    test('should expose getScrubScene range offsets in fallback metadata', async () => {
      const { config, sceneStart, sceneEnd } = await scrollPage.getRangeOffsets();
      expect(config.startOffset.name).toBe('entry');
      expect(config.endOffset.name).toBe('exit');

      if (sceneStart !== null) {
        expect(sceneStart.name).toBe('entry');
        expect(sceneEnd?.name).toBe('exit');
      }
    });

    test('should handle destroy cleanup properly', async ({ page }) => {
      await scrollPage.cancelScrubScene();
      await waitForWindowPlayState(page, 'scrubScene', ['idle', 'paused'], 5000);

      const playState = await scrollPage.getScrubScenePlayState();
      expect(['idle', 'paused']).toContain(playState);
    });
  });

  test.describe('Forced Non-Native Runtime', () => {
    let scrollPage: ScrollPage;

    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        Object.defineProperty(window, 'ViewTimeline', {
          value: undefined,
          writable: true,
          configurable: true,
        });
      });
      scrollPage = new ScrollPage(page);
      await scrollPage.goto();
    });

    test('should run getScrubScene polyfill flow for keyframe effects', async () => {
      const sceneMode = await scrollPage.getScrubSceneMode();
      expect(sceneMode).toBe('polyfill');

      const initialState = await scrollPage.getElementVisualState(SCROLL_SELECTORS.scrubSceneTarget);

      await scrollPage.scrollElementIntoView(SCROLL_SELECTORS.scrubSceneTarget);
      await scrollPage.wait(120);

      const scrolledState = await scrollPage.getElementVisualState(SCROLL_SELECTORS.scrubSceneTarget);

      expect(initialState).not.toBeNull();
      expect(scrolledState).not.toBeNull();
      expect(initialState?.opacity).not.toBe(scrolledState?.opacity);
      expect(initialState?.transform).not.toBe(scrolledState?.transform);
    });
  });
});
