import {
  arraySubtraction,
  getCombinations,
  isSorted,
  last,
  shuffle,
  uniqueFilter,
} from '../arr';

describe('arraySubtraction', (): void => {
  it('subtracts array from another', (): void => {
    expect(arraySubtraction([1, 2, 3, 3, 4], [3, 4])).toEqual([1, 2]);
  });
  it('works with empty b array', (): void => {
    expect(arraySubtraction([1, 2, 3], [])).toEqual([1, 2, 3]);
  });
});
describe('getCombinations', (): void => {
  it('gives all possible n element combinations from an array', (): void => {
    expect(getCombinations([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    expect(getCombinations([1, 2, 3], 2)).toEqual([
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
    expect(getCombinations([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });
});
describe('isSorted', (): void => {
  it('determines if array is sorted or not', (): void => {
    const gt = (a: number, b: number): number => b - a;
    expect(isSorted([5, 4, 2, 3, 1], gt)).toEqual(false);
    expect(isSorted([5, 4, 3, 2, 1], gt)).toEqual(true);
  });
  it('supports reversing compare function', (): void => {
    const lt = (a: number, b: number): number => a - b;
    expect(isSorted([5, 4, 3, 2, 1], lt)).toEqual(false);
    expect(isSorted([5, 4, 3, 2, 1], lt, true)).toEqual(true);
  });
});
describe('last', (): void => {
  it('returns last element of array', (): void => {
    expect(last([1, 2, 3])).toEqual(3);
  });
});
describe('shuffle', (): void => {
  it('shuffles an array', (): void => {
    const gt = (a: number, b: number): number => b - a;
    const arr = [5, 4, 3, 2, 1];
    expect(isSorted(arr, gt)).toEqual(true);
    shuffle(arr);
    expect(isSorted(arr, gt)).toEqual(false);
  });
});
describe('uniqueFilter', (): void => {
  it('can be used to filter array with unique elements only', (): void => {
    expect([1, 2, 2, 3, 3, 3].filter(uniqueFilter)).toEqual([1, 2, 3]);
  });
});
