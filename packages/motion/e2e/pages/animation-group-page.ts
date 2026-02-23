import type { Page } from '@playwright/test';
import { BaseFixturePage } from './base-fixture-page';

type FixtureWindow = {
  play(): Promise<void>;
  pause(): void;
  reverse(): Promise<void>;
  cancel(): void;
  animationGroup: {
    getProgress(): number;
    playState: string;
    progress(p: number): void;
  };
  lifecycleEvents: string[];
};

export class AnimationGroupPage extends BaseFixturePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('animation-group');
  }

  play() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).play());
  }

  pause() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).pause());
  }

  reverse() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).reverse());
  }

  cancel() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).cancel());
  }

  getProgress() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).animationGroup.getProgress());
  }

  setProgress(p: number) {
    return this.page.evaluate(
      (progress) => (window as unknown as FixtureWindow).animationGroup.progress(progress),
      p,
    );
  }

  getGroupItemOpacity() {
    return this.page.evaluate(() => {
      const el = document.getElementById('group-item-1');
      return el ? parseFloat(getComputedStyle(el).opacity) : 0;
    });
  }

  getPlayState() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).animationGroup.playState);
  }

  getLifecycleEvents() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).lifecycleEvents);
  }

}
