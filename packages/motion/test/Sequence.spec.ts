import { describe, expect, test } from 'vitest';
import { Sequence, calculateSequenceOffsets } from '../src/Sequence';
import type { SequenceOptions } from '../src/types';

describe('calculateSequenceOffsets', () => {
  describe('edge cases', () => {
    test('returns empty array for count of 0', () => {
      const result = calculateSequenceOffsets(0);
      expect(result).toEqual([]);
    });

    test('returns empty array for negative count', () => {
      const result = calculateSequenceOffsets(-5);
      expect(result).toEqual([]);
    });

    test('returns single delay value for count of 1', () => {
      const result = calculateSequenceOffsets(1, { delay: 100 });
      expect(result).toEqual([100]);
    });

    test('returns [0] for count of 1 with no delay', () => {
      const result = calculateSequenceOffsets(1);
      expect(result).toEqual([0]);
    });
  });

  describe('linear easing (default)', () => {
    test('calculates linear offsets with default offset (100ms)', () => {
      const result = calculateSequenceOffsets(5);
      // linear: indices [0,1,2,3,4] with last=4, offset=100
      // formula: easing(n/last) * last * offset
      // 0/4=0 -> 0*4*100=0
      // 1/4=0.25 -> 0.25*4*100=100
      // 2/4=0.5 -> 0.5*4*100=200
      // 3/4=0.75 -> 0.75*4*100=300
      // 4/4=1 -> 1*4*100=400
      expect(result).toEqual([0, 100, 200, 300, 400]);
    });

    test('calculates linear offsets with custom offset (200ms)', () => {
      const result = calculateSequenceOffsets(5, { offset: 200 });
      expect(result).toEqual([0, 200, 400, 600, 800]);
    });

    test('adds base delay to all offsets', () => {
      const result = calculateSequenceOffsets(5, { delay: 50, offset: 100 });
      expect(result).toEqual([50, 150, 250, 350, 450]);
    });

    test('handles 2 items', () => {
      const result = calculateSequenceOffsets(2, { offset: 200 });
      // 0/1=0 -> 0*1*200=0
      // 1/1=1 -> 1*1*200=200
      expect(result).toEqual([0, 200]);
    });
  });

  describe('named easings', () => {
    test('applies quadIn easing correctly', () => {
      const result = calculateSequenceOffsets(5, { offset: 200, offsetEasing: 'quadIn' });
      // quadIn: t => t**2
      // 0/4=0 -> 0**2=0 -> 0*4*200=0
      // 1/4=0.25 -> 0.0625 -> 0.0625*4*200=50
      // 2/4=0.5 -> 0.25 -> 0.25*4*200=200
      // 3/4=0.75 -> 0.5625 -> 0.5625*4*200=450
      // 4/4=1 -> 1 -> 1*4*200=800
      expect(result).toEqual([0, 50, 200, 450, 800]);
    });

    test('applies quadOut easing correctly', () => {
      const result = calculateSequenceOffsets(5, { offset: 200, offsetEasing: 'quadOut' });
      // quadOut: t => 1 - (1-t)**2
      // Results should be inverse acceleration pattern of quadIn
      // 0/4=0 -> 0 -> 0
      // 1/4=0.25 -> 0.4375 -> 350
      // 2/4=0.5 -> 0.75 -> 600
      // 3/4=0.75 -> 0.9375 -> 750
      // 4/4=1 -> 1 -> 800
      expect(result).toEqual([0, 350, 600, 750, 800]);
    });

    test('applies sineOut easing correctly', () => {
      const result = calculateSequenceOffsets(5, { offset: 200, offsetEasing: 'sineOut' });
      // sineOut: t => Math.sin(t * Math.PI / 2)
      // Results should follow sine curve
      expect(result.length).toBe(5);
      expect(result[0]).toBe(0);
      expect(result[4]).toBe(800);
      // Middle values should be higher than linear due to sine curve
      expect(result[1]).toBeGreaterThan(200); // linear would be 200
    });

    test('applies cubicIn easing correctly', () => {
      const result = calculateSequenceOffsets(5, { offset: 100, offsetEasing: 'cubicIn' });
      // cubicIn: t => t**3
      // More aggressive acceleration than quadIn
      expect(result[0]).toBe(0);
      expect(result[1]).toBeLessThan(25); // Much slower start than quadIn
      expect(result[4]).toBe(400);
    });

    test('falls back to linear for unknown easing name', () => {
      const result = calculateSequenceOffsets(5, { offset: 100, offsetEasing: 'unknownEasing' });
      expect(result).toEqual([0, 100, 200, 300, 400]);
    });
  });

  describe('custom easing functions', () => {
    test('accepts custom easing function', () => {
      // Step function: all items appear at once at the end
      const stepEnd = () => 1;
      const result = calculateSequenceOffsets(5, { offset: 200, offsetEasing: stepEnd });
      expect(result).toEqual([800, 800, 800, 800, 800]);
    });

    test('accepts custom quadratic easing function', () => {
      const customQuad = (t: number) => t ** 2;
      const result = calculateSequenceOffsets(5, { offset: 200, offsetEasing: customQuad });
      expect(result).toEqual([0, 50, 200, 450, 800]);
    });

    test('accepts custom exponential easing function', () => {
      const expo = (t: number) => (t === 0 ? 0 : 2 ** (10 * t - 10));
      const result = calculateSequenceOffsets(3, { offset: 100, offsetEasing: expo });
      expect(result[0]).toBe(0);
      expect(result[2]).toBe(200); // 1 * 2 * 100 = 200
    });
  });

  describe('flooring behavior', () => {
    test('floors decimal offsets', () => {
      // Using offset that creates decimals
      const result = calculateSequenceOffsets(3, { offset: 33 });
      // linear: 0/2=0, 1/2=0.5, 2/2=1
      // 0*2*33=0, 0.5*2*33=33, 1*2*33=66
      result.forEach((value) => {
        expect(Number.isInteger(value)).toBe(true);
      });
    });
  });
});

describe('Sequence class', () => {
  describe('constructor', () => {
    test('creates instance with empty animations', () => {
      const sequence = new Sequence([]);
      expect(sequence.getAnimations()).toEqual([]);
    });

    test('creates instance with default options', () => {
      const sequence = new Sequence([]);
      expect(sequence.getOptions()).toEqual({});
    });

    test('creates instance with custom options', () => {
      const options: SequenceOptions = { delay: 100, offset: 200, offsetEasing: 'quadIn' };
      const sequence = new Sequence([], options);
      expect(sequence.getOptions()).toEqual(options);
    });
  });

  describe('static calculateOffsets', () => {
    test('delegates to calculateSequenceOffsets function', () => {
      const result = Sequence.calculateOffsets(5, { offset: 200 });
      expect(result).toEqual([0, 200, 400, 600, 800]);
    });
  });

  describe('getOffsets', () => {
    test('calculates offsets based on animation count', () => {
      const mockAnimations = [{}, {}, {}] as any[];
      const sequence = new Sequence(mockAnimations, { offset: 100 });
      const offsets = sequence.getOffsets();
      expect(offsets).toEqual([0, 100, 200]);
    });

    test('returns empty array for sequence with no animations', () => {
      const sequence = new Sequence([]);
      expect(sequence.getOffsets()).toEqual([]);
    });

    test('applies custom easing from options', () => {
      const mockAnimations = [{}, {}, {}, {}, {}] as any[];
      const sequence = new Sequence(mockAnimations, { offset: 200, offsetEasing: 'quadIn' });
      const offsets = sequence.getOffsets();
      expect(offsets).toEqual([0, 50, 200, 450, 800]);
    });
  });

  describe('getAnimations', () => {
    test('returns the animations array', () => {
      const mockAnimations = [{ id: 1 }, { id: 2 }] as any[];
      const sequence = new Sequence(mockAnimations);
      expect(sequence.getAnimations()).toBe(mockAnimations);
    });
  });

  describe('getOptions', () => {
    test('returns the options object', () => {
      const options: SequenceOptions = { delay: 50, offset: 150 };
      const sequence = new Sequence([], options);
      expect(sequence.getOptions()).toBe(options);
    });
  });
});

describe('real-world scenarios', () => {
  test('staggered entrance animation with 10 cards', () => {
    const result = calculateSequenceOffsets(10, { offset: 100, offsetEasing: 'quadOut' });

    // Should have 10 values
    expect(result.length).toBe(10);

    // First should be 0, last should be 9 * 100 = 900
    expect(result[0]).toBe(0);
    expect(result[9]).toBe(900);

    // With quadOut, early items should have larger gaps
    const firstGap = result[1] - result[0];
    const lastGap = result[9] - result[8];
    expect(firstGap).toBeGreaterThan(lastGap);
  });

  test('list animation with base delay', () => {
    const result = calculateSequenceOffsets(5, { delay: 300, offset: 100 });

    // All items should be delayed by at least 300ms
    result.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(300);
    });

    // First item at 300ms, last at 700ms
    expect(result[0]).toBe(300);
    expect(result[4]).toBe(700);
  });

  test('quick stagger for micro-interactions', () => {
    const result = calculateSequenceOffsets(3, { offset: 50 });
    expect(result).toEqual([0, 50, 100]);
  });
});
