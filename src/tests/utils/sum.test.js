import { expect, it } from 'vitest';
import { sum } from '@/scripts/utils/sum.js';

it('sums 1 + 2 correctly', () => {
	expect(sum(1, 2)).toBe(3);
});

it('sums 1 + 2 + 4 correctly', () => {
	expect(sum(1, 2, 4)).toBe(7);
});

it('sums -5 + 5 + 0 correctly', () => {
	expect(sum(-5, 5, 0)).toBe(0);
});
