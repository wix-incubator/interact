import { cssEasings, jsEasings } from './easings';

export function getCssUnits(type: 'percentage' | string) {
  return type === 'percentage' ? '%' : type || 'px';
}

export function getEasing(easing?: keyof typeof cssEasings | string): string {
  return easing ? cssEasings[easing as keyof typeof cssEasings] || easing : cssEasings.linear;
}

export function getJsEasing(
  easing?: keyof typeof jsEasings | string,
): ((t: number) => number) | undefined {
  return easing ? jsEasings[easing as keyof typeof jsEasings] : undefined;
}

export function createCubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveCurveX = (x: number): number => {
    let t = x;

    for (let i = 0; i < 8; i++) {
      const xError = sampleCurveX(t) - x;
      if (Math.abs(xError) < 1e-6) return t;
      const dx = sampleCurveDerivativeX(t);
      if (Math.abs(dx) < 1e-6) break;
      t -= xError / dx;
    }

    let t0 = 0;
    let t1 = 1;
    t = x;

    while (t0 < t1) {
      const xMid = sampleCurveX(t);
      if (Math.abs(xMid - x) < 1e-6) return t;
      if (x > xMid) t0 = t;
      else t1 = t;
      t = (t1 - t0) / 2 + t0;
    }

    return t;
  };

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return sampleCurveY(solveCurveX(x));
  };
}

export function parseCubicBezier(str: string): ((t: number) => number) | null {
  const match = str.match(/cubic-bezier\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/i);
  if (!match) return null;

  const [, x1, y1, x2, y2] = match.map((v, i) => (i === 0 ? v : parseFloat(v)));
  if ([x1, y1, x2, y2].some((v) => typeof v !== 'number' || isNaN(v as number))) return null;

  return createCubicBezier(x1 as number, y1 as number, x2 as number, y2 as number);
}

export function resolveEasingFunction(
  easing: string | ((t: number) => number) | undefined,
): (t: number) => number {
  if (typeof easing === 'function') return easing;

  if (typeof easing === 'string') {
    if (easing in jsEasings) return jsEasings[easing as keyof typeof jsEasings];
    const bezierFn = parseCubicBezier(easing);
    if (bezierFn) return bezierFn;
  }

  return jsEasings.linear;
}

export function calculateOffsets(
  count: number,
  offset: number,
  easingFn: (t: number) => number,
): number[] {
  if (count <= 1) return [0];
  const last = count - 1;
  return Array.from({ length: count }, (_, i) => (easingFn(i / last) * last * offset) | 0);
}
