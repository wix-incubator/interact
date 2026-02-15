import { cssEasings, jsEasings } from './easings';
export function getCssUnits(unit: 'percentage' | string) {
  return unit === 'percentage' ? '%' : unit || 'px';
}

export function getEasing(easing?: keyof typeof cssEasings | string): string {
  return easing ? cssEasings[easing as keyof typeof cssEasings] || easing : cssEasings.linear;
}

export function getJsEasing(
  easing?: keyof typeof jsEasings | string,
): ((t: number) => number) | undefined {
  return easing ? jsEasings[easing as keyof typeof jsEasings] : undefined;
}
