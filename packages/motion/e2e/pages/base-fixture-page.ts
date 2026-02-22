import type { Page } from '@playwright/test';

export class BaseFixturePage {
  constructor(protected readonly page: Page) {}

  async navigate(fixture: string): Promise<void> {
    await this.page.goto(`/${fixture}.html`);
  }

  /** Evaluate an expression in the page context with typed return. */
  evaluate<T>(fn: () => T): Promise<T> {
    return this.page.evaluate(fn);
  }

  /** Wait for a selector to be visible. */
  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }
}
