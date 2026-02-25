export const SCROLL_IDS = {
  viewProgressTarget: 'view-progress-target',
  scrubCard1: 'scrub-card-1',
  scrubCard2: 'scrub-card-2',
  scrubCard3: 'scrub-card-3',
} as const;

export const SCROLL_TEST_IDS = {
  viewProgressTarget: 'view-progress-target',
  scrubCard1: 'scrub-card-1',
  scrubCard2: 'scrub-card-2',
  scrubCard3: 'scrub-card-3',
  progressDisplay: 'progress-display',
} as const;

export const SCROLL_SELECTORS = {
  viewProgressTarget: `[data-testid="${SCROLL_TEST_IDS.viewProgressTarget}"]`,
  scrubCard1: `[data-testid="${SCROLL_TEST_IDS.scrubCard1}"]`,
} as const;
