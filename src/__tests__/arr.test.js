import { arraySubtraction, getCombinations, isSorted, last, shuffle, uniqueFilter } from '../arr';

describe('arraySubtraction', () => {
	it('subtracts array from another', () => {
		expect(arraySubtraction([1, 2, 3, 3, 4], [3, 4])).toEqual([1, 2]);
	});
	it('works with empty b array', () => {
		expect(arraySubtraction([1, 2, 3], [])).toEqual([1, 2, 3]);
	});
});
describe('getCombinations', () => {
	it('gives all possible n element combinations from an array', () => {
		expect(getCombinations([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
		expect(getCombinations([1, 2, 3], 2)).toEqual([[1, 2], [1, 3], [2, 3]]);
		expect(getCombinations([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
	});
});
describe('isSorted', () => {
	it('determines if array is sorted or not', () => {
		const gt = (a, b) => (b - a);
		expect(isSorted([5, 4, 2, 3, 1], gt)).toEqual(false);
		expect(isSorted([5, 4, 3, 2, 1], gt)).toEqual(true);
	});
});
describe('last', () => {
	it('returns last element of array', () => {
		expect(last([1, 2, 3])).toEqual(3);
	});
});
describe('shuffle', () => {
	it('shuffles an array', () => {
		const gt = (a, b) => (b - a);
		var arr = [5, 4, 3, 2, 1];
		expect(isSorted(arr, gt)).toEqual(true);
		shuffle(arr);
		expect(isSorted(arr, gt)).toEqual(false);
	});
});
describe('uniqueFilter', () => {
	it('can be used to filter array with unique elements only', () => {
		expect([1, 2, 2, 3, 3, 3].filter(uniqueFilter)).toEqual([1, 2, 3]);
	});
});
