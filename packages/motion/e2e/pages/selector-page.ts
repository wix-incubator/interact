import type { Page } from '@playwright/test';
import { BaseFixturePage } from './base-fixture-page';

type FixtureWindow = {
  getMatchedSelectors(): string[];
  animateGrid(): void;
  animateList(): void;
};

export class SelectorPage extends BaseFixturePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('selector');
  }

  getMatchedSelectors(): Promise<string[]> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).getMatchedSelectors());
  }

  animateGrid() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).animateGrid());
  }

  animateList() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).animateList());
  }
}
