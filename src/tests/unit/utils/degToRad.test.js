import { describe, expect, it } from 'vitest';
import { degToRad } from '@/scripts/utils/degToRad.js';

describe('degToRad', () => {
  it('converts 0 degrees to 0 radians', () => {
    expect(degToRad(0)).toBe(0);
  });

  it('converts 180 degrees to PI', () => {
    expect(degToRad(180)).toBe(Math.PI);
  });

  it('converts 360 degrees to 2*PI', () => {
    expect(degToRad(360)).toBe(2 * Math.PI);
  });

  it('handles negative angles correctly (-90)', () => {
    expect(degToRad(-90)).toBe(-Math.PI / 2);
  });

  it('handles decimal degrees with precision', () => {
    expect(degToRad(45)).toBeCloseTo(Math.PI / 4, 5);
  });
});
