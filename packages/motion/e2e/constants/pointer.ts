export const POINTER_IDS = {
  area: 'pointer-area',
  yAxisArea: 'y-axis-area',
  compositeArea: 'composite-area',
  xAxisTarget: 'x-axis-target',
  yAxisTarget: 'y-axis-target',
  compositeTarget: 'composite-target',
} as const;

export const POINTER_TEST_IDS = {
  area: 'pointer-area',
  yAxisArea: 'y-axis-area',
  compositeArea: 'composite-area',
  progressDisplay: 'pointer-progress-display',
} as const;

export const POINTER_SELECTORS = {
  area: `[data-testid="${POINTER_TEST_IDS.area}"]`,
  yAxisArea: `[data-testid="${POINTER_TEST_IDS.yAxisArea}"]`,
  compositeArea: `[data-testid="${POINTER_TEST_IDS.compositeArea}"]`,
} as const;
