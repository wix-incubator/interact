import type { Page } from '@playwright/test';

export class BaseFixturePage {
  constructor(protected readonly page: Page) {}

  async navigate(fixture: string): Promise<void> {
    await this.page.goto(`/${fixture}.html`);
  }

  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }
}
