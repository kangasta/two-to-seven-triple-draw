import { arraySubtraction, last, uniqueFilter } from '../arr';

describe('arraySubtraction', () => {
	it('subtracts array from another', () => {
		expect(arraySubtraction([1, 2, 3, 3, 4], [3, 4])).toEqual([1, 2]);
	});
});
describe('last', () => {
	it('returns last element of array', () => {
		expect(last([1, 2, 3])).toEqual(3);
	});
});
describe('uniqueFilter', () => {
	it('can be used to filter array with unique elements only', () => {
		expect([1, 2, 2, 3, 3, 3].filter(uniqueFilter)).toEqual([1, 2, 3]);
	});
});
