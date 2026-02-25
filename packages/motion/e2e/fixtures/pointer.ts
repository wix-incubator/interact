import { getWebAnimation } from '@wix/motion';
import type { AnimationGroup } from '@wix/motion';
import { POINTER_IDS, POINTER_TEST_IDS } from '../constants/pointer';

type PointerFixtureWindow = typeof window & {
  pointerScene: AnimationGroup;
};

const pointerArea = document.getElementById(POINTER_IDS.area) as HTMLElement;
const xAxisTarget = document.getElementById(POINTER_IDS.xAxisTarget) as HTMLElement;
const yAxisTarget = document.getElementById(POINTER_IDS.yAxisTarget) as HTMLElement;
const compositeTarget = document.getElementById(POINTER_IDS.compositeTarget) as HTMLElement;
const progressDisplay = document.querySelector(
  `[data-testid="${POINTER_TEST_IDS.progressDisplay}"]`,
) as HTMLElement;

// X-axis animation: translateX driven by horizontal mouse position
const xAxisGroup = getWebAnimation(
  xAxisTarget,
  {
    keyframeEffect: {
      name: 'pointer-x',
      keyframes: [
        { offset: 0, transform: 'translateX(-80px)' },
        { offset: 1, transform: 'translateX(80px)' },
      ],
    },
    duration: 1000,
    fill: 'both',
    easing: 'linear',
  },
) as AnimationGroup;

// Y-axis animation: translateY driven by vertical mouse position
const yAxisGroup = getWebAnimation(
  yAxisTarget,
  {
    keyframeEffect: {
      name: 'pointer-y',
      keyframes: [
        { offset: 0, transform: 'translateY(-40px)' },
        { offset: 1, transform: 'translateY(40px)' },
      ],
    },
    duration: 1000,
    fill: 'both',
    easing: 'linear',
  },
) as AnimationGroup;

// Composite: independent scaleX and scaleY driven by x/y pointer
const scaleXGroup = getWebAnimation(
  compositeTarget,
  {
    keyframeEffect: {
      name: 'pointer-scale-x',
      keyframes: [
        { offset: 0, transform: 'scaleX(0.5)' },
        { offset: 1, transform: 'scaleX(1.5)' },
      ],
    },
    duration: 1000,
    fill: 'both',
    easing: 'linear',
  },
) as AnimationGroup;

const scaleYGroup = getWebAnimation(
  compositeTarget,
  {
    keyframeEffect: {
      name: 'pointer-scale-y',
      keyframes: [
        { offset: 0, transform: 'scaleY(0.5)' },
        { offset: 1, transform: 'scaleY(1.5)' },
      ],
    },
    duration: 1000,
    fill: 'both',
    easing: 'linear',
  },
) as AnimationGroup;

function getRelativeProgress(area: HTMLElement, clientX: number, clientY: number) {
  const rect = area.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
  return { x, y };
}

// Drive animations from pointermove inside the pointer area
pointerArea.addEventListener('pointermove', (e) => {
  const progress = getRelativeProgress(pointerArea, e.clientX, e.clientY);

  xAxisGroup?.progress(progress.x);

  if (progressDisplay) {
    progressDisplay.textContent = `x: ${progress.x.toFixed(3)} y: ${progress.y.toFixed(3)}`;
  }
});

// Drive Y-axis from y-axis area
const yAxisArea = document.getElementById(POINTER_IDS.yAxisArea) as HTMLElement;
yAxisArea.addEventListener('pointermove', (e) => {
  const progress = getRelativeProgress(yAxisArea, e.clientX, e.clientY);
  yAxisGroup?.progress(progress.y);
});

// Drive composite from composite area
const compositeArea = document.getElementById(POINTER_IDS.compositeArea) as HTMLElement;
compositeArea.addEventListener('pointermove', (e) => {
  const progress = getRelativeProgress(compositeArea, e.clientX, e.clientY);
  scaleXGroup?.progress(progress.x);
  scaleYGroup?.progress(progress.y);
});

// Expose to tests — primary scene is the x-axis group for the main pointer area
(window as PointerFixtureWindow).pointerScene = xAxisGroup;
