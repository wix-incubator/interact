import type { Page } from '@playwright/test';
import { BaseFixturePage } from './base-fixture-page';
import {
  scrollTo,
  scrollElementIntoView,
  getScrollProgress,
  getScrollY,
} from '../utils/scroll-helpers';

type RangeOffset = { name?: string; offset?: number };

type FixtureWindow = {
  scrubScene: { cancel(): void; playState: string };
  rangeScene: { start?: RangeOffset; end?: RangeOffset } | null;
  rangeConfig: { startOffset: RangeOffset; endOffset: RangeOffset };
  supportsViewTimeline: boolean;
  getScrollProgress(): number;
  getScrubSceneMode(): 'native' | 'polyfill';
  getNativeCustomValues(): { progress: number; shift: number };
};

export class ScrollPage extends BaseFixturePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('scroll');
  }

  scrollTo(y: number) {
    return scrollTo(this.page, y);
  }

  scrollElementIntoView(selector: string) {
    return scrollElementIntoView(this.page, selector);
  }

  getScrollProgress() {
    return getScrollProgress(this.page);
  }

  getScrollY() {
    return getScrollY(this.page);
  }

  cancelScrubScene() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).scrubScene.cancel());
  }

  getScrubScenePlayState() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).scrubScene.playState);
  }

  getRangeOffsets() {
    return this.page.evaluate(() => {
      const win = window as unknown as FixtureWindow;
      return {
        config: win.rangeConfig,
        // only populated in the non-ViewTimeline fallback path
        sceneStart: win.rangeScene?.start ?? null,
        sceneEnd: win.rangeScene?.end ?? null,
      };
    });
  }

  supportsNativeViewTimeline() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).supportsViewTimeline);
  }

  getScrubSceneMode() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).getScrubSceneMode());
  }

  getNativeCustomValues() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).getNativeCustomValues());
  }

  getElementVisualState(selector: string) {
    return this.page.evaluate((selector_) => {
      const element = document.querySelector(selector_) as HTMLElement | null;
      if (!element) {
        return null;
      }

      const style = getComputedStyle(element);
      return {
        opacity: style.opacity,
        transform: style.transform,
      };
    }, selector);
  }

  wait(ms: number) {
    return this.page.waitForTimeout(ms);
  }
}
