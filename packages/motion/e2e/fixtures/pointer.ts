import { getScrubScene } from '@wix/motion';
import type { ScrubPointerScene } from '@wix/motion';
import { POINTER_IDS, POINTER_TEST_IDS } from '../constants/pointer';

type PointerFixtureWindow = typeof window & {
  pointerScene: {
    cancel(): void;
    playState: 'idle' | 'running';
  };
};

const pointerArea = document.getElementById(POINTER_IDS.area) as HTMLElement;
const xAxisTarget = document.getElementById(POINTER_IDS.xAxisTarget) as HTMLElement;
const yAxisTarget = document.getElementById(POINTER_IDS.yAxisTarget) as HTMLElement;
const compositeTarget = document.getElementById(POINTER_IDS.compositeTarget) as HTMLElement;
const progressDisplay = document.querySelector(
  `[data-testid="${POINTER_TEST_IDS.progressDisplay}"]`,
) as HTMLElement;

function createPointerTrigger(element: HTMLElement, axis: 'x' | 'y') {
  return {
    trigger: 'pointer-move',
    element,
    axis,
  } as Parameters<typeof getScrubScene>[2];
}

const xAxisScene = getScrubScene(
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
  createPointerTrigger(pointerArea, 'x'),
) as ScrubPointerScene | null;

const yAxisArea = document.getElementById(POINTER_IDS.yAxisArea) as HTMLElement;
const yAxisScene = getScrubScene(
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
  createPointerTrigger(yAxisArea, 'y'),
) as ScrubPointerScene | null;

const compositeArea = document.getElementById(POINTER_IDS.compositeArea) as HTMLElement;
const compositeScaleXScene = getScrubScene(
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
  createPointerTrigger(compositeArea, 'x'),
) as ScrubPointerScene | null;

const compositeScaleYScene = getScrubScene(
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
  createPointerTrigger(compositeArea, 'y'),
) as ScrubPointerScene | null;

function getRelativeProgress(area: HTMLElement, clientX: number, clientY: number) {
  const rect = area.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
  return { x, y };
}

// Pointer area readout (scene driving is handled by getScrubScene)
pointerArea.addEventListener('pointermove', (e) => {
  const progress = getRelativeProgress(pointerArea, e.clientX, e.clientY);

  if (progressDisplay) {
    progressDisplay.textContent = `x: ${progress.x.toFixed(3)} y: ${progress.y.toFixed(3)}`;
  }
});

const pointerSceneHandle: PointerFixtureWindow['pointerScene'] = {
  playState: 'running',
  cancel() {
    xAxisScene?.destroy();
    yAxisScene?.destroy();
    compositeScaleXScene?.destroy();
    compositeScaleYScene?.destroy();
    this.playState = 'idle';
  },
};

(window as PointerFixtureWindow).pointerScene = pointerSceneHandle;
