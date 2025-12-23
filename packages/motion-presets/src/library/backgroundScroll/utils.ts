import type { DomApi } from '../../types';

export function measureCompHeight(
  measures: { compHeight: number },
  dom: DomApi,
  assignToCss?: boolean,
) {
  dom.measure((target) => {
    if (!target) {
      return;
    }
    measures.compHeight = target.offsetHeight;
  });
  if (assignToCss) {
    dom.mutate((target) => {
      target?.style.setProperty(
        '--motion-comp-height',
        `${measures.compHeight}px`,
      );
    });
  }
}

const getMasterPage = (): HTMLElement | null =>
  window!.document.getElementById('masterPage');

const getWixAdsHeight = () => {
  const wixAds = window!.document.getElementById('WIX_ADS');
  return wixAds ? wixAds.offsetHeight : 0;
};

const getSiteHeight = (): number => {
  const masterPage = getMasterPage();
  return masterPage ? masterPage.offsetHeight + getWixAdsHeight() : 0; // probably tests that don't have masterPage created
};

export function measureSiteHeight(
  measures: { siteHeight: number },
  dom: DomApi,
) {
  dom.measure(() => {
    measures.siteHeight = getSiteHeight();
  });
}

export function getScaleFromPerspectiveAndZ(z: number, perspective: number) {
  return z > perspective ? 0 : 1.0 / (1 - z / perspective);
}
