import type { Page } from '@playwright/test';
import { BaseFixturePage } from './base-fixture-page';

type BreakpointWidths = { desktop: number; tablet: number; mobile: number };

type FixtureWindow = {
  activeCondition: string;
  triggerAnimation(): void;
  breakpointWidths: BreakpointWidths;
};

export class ResponsivePage extends BaseFixturePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('responsive');
  }

  setViewportSize(width: number, height = 768) {
    return this.page.setViewportSize({ width, height });
  }

  triggerAnimation() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).triggerAnimation());
  }

  getActiveCondition(): Promise<string> {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).activeCondition);
  }

  getBreakpointWidths() {
    return this.page.evaluate(() => (window as unknown as FixtureWindow).breakpointWidths);
  }

  waitForCondition(condition: string) {
    return this.page.waitForFunction(
      (c) => (window as unknown as FixtureWindow).activeCondition === c,
      condition,
      { timeout: 2000 },
    );
  }
}
