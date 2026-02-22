import { test, expect } from '@playwright/test';
import { EffectsPage } from '../pages/effects-page';

test.describe('Effect Types', () => {
  let effectsPage: EffectsPage;

  test.beforeEach(async ({ page }) => {
    effectsPage = new EffectsPage(page);
    await effectsPage.goto();
  });

  test.describe('Named Effects — WAAPI', () => {
    test('should create AnimationGroup via getWebAnimation with registered named effect', async ({ page }) => {
      await effectsPage.runNamedWaapi();

      // play() awaits fastdom internally — wait for it to actually start
      await page.waitForFunction(
        () => {
          const g = (window as unknown as { namedWaapiGroup: { playState: string } }).namedWaapiGroup;
          return g?.playState === 'running' || g?.playState === 'finished';
        },
        { timeout: 2000 },
      );

      const playState = await effectsPage.getNamedWaapiPlayState();
      expect(['running', 'finished']).toContain(playState);
    });

    test('should apply correct keyframes from named effect web() method', async ({ page }) => {
      await effectsPage.runNamedWaapi();

      // Animation plays to completion (1000ms, fill: both) → opacity should be 1
      await page.waitForFunction(
        () => (window as unknown as { namedWaapiGroup: { playState: string } }).namedWaapiGroup?.playState === 'finished',
        { timeout: 3000 },
      );

      const opacity = await page.evaluate(() => {
        const el = document.getElementById('named-waapi-target');
        return el ? getComputedStyle(el).opacity : null;
      });
      expect(opacity).toBe('1');
    });

  });

  test.describe('Named Effects — CSS', () => {
    test('should generate CSS animation data via getCSSAnimation with registered named effect', async () => {
      await effectsPage.runNamedCss();

      const data = await effectsPage.getNamedCssData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test('should produce correct keyframe name from style() method', async () => {
      await effectsPage.runNamedCss();

      const data = await effectsPage.getNamedCssData();
      expect(data[0].name).toBe('test-scale');
    });

    test('should return animation data with correct keyframes', async () => {
      await effectsPage.runNamedCss();

      const data = await effectsPage.getNamedCssData();
      const keyframes = data[0].keyframes;
      expect(keyframes.length).toBeGreaterThan(0);
      // scale(0) → scale(1) as defined in TestScale
      expect(String(keyframes[0].transform)).toContain('scale(0)');
      expect(String(keyframes[keyframes.length - 1].transform)).toContain('scale(1)');
    });
  });

  test.describe('Keyframe Effects — WAAPI', () => {
    test('should create AnimationGroup via getWebAnimation with inline keyframeEffect', async ({ page }) => {
      await effectsPage.runKeyframeWaapi();

      await page.waitForFunction(
        () => {
          const g = (window as unknown as { keyframeWaapiGroup: { playState: string } }).keyframeWaapiGroup;
          return g?.playState === 'running' || g?.playState === 'finished';
        },
        { timeout: 2000 },
      );

      const playState = await effectsPage.getKeyframeWaapiPlayState();
      expect(['running', 'finished']).toContain(playState);
    });

    test('should apply keyframeEffect keyframes to the element', async ({ page }) => {
      await effectsPage.runKeyframeWaapi();

      // Wait for the animation to start (play() awaits fastdom, keyframes set async)
      await page.waitForFunction(
        () => {
          const g = (window as unknown as { keyframeWaapiGroup: { playState: string } }).keyframeWaapiGroup;
          return g?.playState === 'running' || g?.playState === 'finished';
        },
        { timeout: 2000 },
      );

      const hasExpectedKeyframes = await page.evaluate(() => {
        const el = document.getElementById('keyframe-waapi-target');
        const keyframes = (el?.getAnimations()[0]?.effect as KeyframeEffect)?.getKeyframes?.() ?? [];
        return keyframes.some((kf) => String(kf.transform).includes('translateX'));
      });

      expect(hasExpectedKeyframes).toBe(true);
    });
  });

  test.describe('Keyframe Effects — CSS', () => {
    test('should generate CSS animation data via getCSSAnimation with inline keyframeEffect', async () => {
      await effectsPage.runKeyframeCss();

      const data = await effectsPage.getKeyframeCssData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test('should produce correct CSS keyframe name from keyframeEffect.name', async () => {
      await effectsPage.runKeyframeCss();

      const data = await effectsPage.getKeyframeCssData();
      expect(data[0].name).toBe('kf-rotate');
    });

    test('should include keyframeEffect keyframes in CSS output', async () => {
      await effectsPage.runKeyframeCss();

      const data = await effectsPage.getKeyframeCssData();
      const keyframes = data[0].keyframes;
      expect(keyframes.length).toBeGreaterThan(0);
      // rotate(0deg) → rotate(360deg)
      expect(String(keyframes[0].transform)).toContain('rotate(0deg)');
    });
  });

  test.describe('Custom Effects', () => {
    test('should create animation via getWebAnimation with customEffect function', async ({ page }) => {
      await effectsPage.runCustomEffect();

      await page.waitForFunction(
        () => {
          const g = (window as unknown as { customEffectGroup: { playState: string } }).customEffectGroup;
          return g?.playState === 'running' || g?.playState === 'finished';
        },
        { timeout: 2000 },
      );

      const playState = await effectsPage.getCustomEffectPlayState();
      expect(['running', 'finished']).toContain(playState);
    });

    test('should call customEffect function with (element, progress) during playback', async ({ page }) => {
      await effectsPage.runCustomEffect();

      // Wait for at least some log entries to accumulate
      await page.waitForFunction(
        () => (window as unknown as { customEffectLog: unknown[] }).customEffectLog?.length > 2,
        { timeout: 3000 },
      );

      const log = await effectsPage.getCustomEffectLog();
      const progressEntries = log.filter((e) => e.progress !== null && e.progress !== undefined);
      expect(progressEntries.length).toBeGreaterThan(0);
      expect(progressEntries[0].element).not.toBeNull();
    });

    test('should call customEffect with null progress on cancel', async ({ page }) => {
      await effectsPage.runCustomEffect();

      // Wait for animation to start
      await page.waitForFunction(
        () => (window as unknown as { customEffectLog: unknown[] }).customEffectLog?.length > 0,
        { timeout: 3000 },
      );

      await effectsPage.cancelCustomEffect();

      const log = await effectsPage.getCustomEffectLog();
      const nullEntries = log.filter((e) => e.progress === null);
      expect(nullEntries.length).toBeGreaterThan(0);
    });

    test('should track progress updates through customEffect callback', async ({ page }) => {
      await effectsPage.runCustomEffect();

      // Wait for animation to complete (600ms, fill: both)
      await page.waitForFunction(
        () => (window as unknown as { customEffectGroup: { playState: string } }).customEffectGroup?.playState === 'finished',
        { timeout: 3000 },
      );

      const log = await effectsPage.getCustomEffectLog();
      const progressValues = log.filter((e) => e.progress !== null).map((e) => e.progress as number);
      expect(Math.max(...progressValues)).toBeCloseTo(1, 1);
    });
  });

  test.describe('Playback — Play/Reverse', () => {
    test('should return to initial state after reverse completes', async ({ page }) => {
      await effectsPage.runPlayback();
      await page.waitForTimeout(400);
      await effectsPage.runPlaybackReverse();

      // Wait for reverse to complete (element returns to start, opacity → 0)
      await page.waitForFunction(
        () => {
          const el = document.getElementById('playback-target');
          return el?.getAnimations()[0]?.playState === 'finished';
        },
        { timeout: 5000 },
      );

      const opacity = await effectsPage.getPlaybackOpacity();
      // fill: both + reversed → element at first keyframe: opacity 0
      expect(parseFloat(opacity)).toBeCloseTo(0, 1);
    });
  });

  test.describe('Playback — Play/Pause', () => {
    test('should pause animation mid-playback and hold current state', async ({ page }) => {
      await effectsPage.runPlayback();
      // Wait for animation to actually start before pausing mid-playback
      await page.waitForFunction(
        () => document.getElementById('playback-target')?.getAnimations()[0]?.playState === 'running',
        { timeout: 2000 },
      );
      await page.waitForTimeout(300);
      await effectsPage.runPlaybackPause();

      const playState = await effectsPage.getPlaybackPlayState();
      expect(playState).toBe('paused');

      const opacityBefore = await effectsPage.getPlaybackOpacity();
      await page.waitForTimeout(300);
      const opacityAfter = await effectsPage.getPlaybackOpacity();

      expect(opacityBefore).toBe(opacityAfter);
    });

    test('should resume from paused position when played again', async ({ page }) => {
      await effectsPage.runPlayback();
      await page.waitForTimeout(300);
      await effectsPage.runPlaybackPause();

      const opacityAtPause = await effectsPage.getPlaybackOpacity();

      await effectsPage.runPlaybackResume();
      const playState = await effectsPage.getPlaybackPlayState();
      expect(['running', 'finished']).toContain(playState);

      // Animation continues forward — eventually opacity reaches 1
      await page.waitForFunction(
        () => {
          const el = document.getElementById('playback-target');
          return el?.getAnimations()[0]?.playState === 'finished';
        },
        { timeout: 5000 },
      );

      const opacityAfterFinish = await effectsPage.getPlaybackOpacity();
      expect(parseFloat(opacityAfterFinish)).toBeGreaterThan(parseFloat(opacityAtPause));
    });
  });
});
