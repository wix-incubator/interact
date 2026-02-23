import type { Page } from '@playwright/test';
import { BaseFixturePage } from './base-fixture-page';
import type { CssAnimationData, CustomEffectEntry } from '../types';

type FixtureWindow = {
  namedWaapiGroup: { playState: string };
  namedCssData: CssAnimationData[];
  keyframeWaapiGroup: { playState: string };
  keyframeCssData: CssAnimationData[];
  customEffectGroup: { playState: string; cancel(): void };
  customEffectLog: CustomEffectEntry[];
  runNamedWaapi(): void;
  runNamedCss(): void;
  runKeyframeWaapi(): void;
  runKeyframeCss(): void;
  runCustomEffect(): void;
  runPlayback(): void;
  runPlaybackReverse(): void;
  runPlaybackPause(): void;
  runPlaybackResume(): void;
};

export class EffectsPage extends BaseFixturePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('effects');
  }

  runNamedWaapi() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runNamedWaapi());
  }

  runNamedCss() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runNamedCss());
  }

  runKeyframeWaapi() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runKeyframeWaapi());
  }

  runKeyframeCss() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runKeyframeCss());
  }

  runCustomEffect() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runCustomEffect());
  }

  runPlayback() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runPlayback());
  }

  runPlaybackReverse() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runPlaybackReverse());
  }

  runPlaybackPause() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runPlaybackPause());
  }

  runPlaybackResume() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).runPlaybackResume());
  }

  getNamedCssData(): Promise<CssAnimationData[]> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).namedCssData);
  }

  getKeyframeCssData(): Promise<CssAnimationData[]> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).keyframeCssData);
  }

  getCustomEffectLog(): Promise<CustomEffectEntry[]> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).customEffectLog);
  }

  getNamedWaapiPlayState(): Promise<string> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).namedWaapiGroup.playState);
  }

  getCustomEffectPlayState(): Promise<string> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).customEffectGroup.playState);
  }

  getKeyframeWaapiPlayState(): Promise<string> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).keyframeWaapiGroup.playState);
  }

  cancelCustomEffect() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).customEffectGroup.cancel());
  }

  getPlaybackPlayState(): Promise<string> {
    return this.page.evaluate(() => {
      const el = document.getElementById('playback-target');
      return el?.getAnimations()[0]?.playState ?? 'idle';
    });
  }

  getPlaybackOpacity(): Promise<string> {
    return this.page.evaluate(() => {
      const el = document.getElementById('playback-target');
      return el ? getComputedStyle(el).opacity : '1';
    });
  }
}
