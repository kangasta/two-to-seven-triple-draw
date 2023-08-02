export const arraySubtraction = <T>(a: T[], b: T[]): T[] => {
  return a.filter((c: T): boolean => !b.includes(c));
};

export const getCombinationsHelper = <T>(
  array: T[],
  num: number,
  index: number,
  combination: T[],
  output: T[][],
): void => {
  if (combination.length >= num) {
    output.push(combination);
  } else {
    for (let i = index; i < array.length; i++) {
      getCombinationsHelper(
        array,
        num,
        i + 1,
        combination.concat(array[i]),
        output,
      );
    }
  }
};

export const getCombinations = <T>(arr: T[], n: number): T[][] => {
  const out: T[][] = [];
  getCombinationsHelper(arr, n, 0, [], out);
  return out;
};

export const isSorted = <T>(
  arr: T[],
  func: (a: T, b: T) => number,
  reverse = false,
): boolean => {
  const order = reverse ? -1 : 1;

  try {
    arr.reduce((acc: T, cur: T): T => {
      if (order * func(acc, cur) <= 0) return cur;
      throw new Error();
    });
    return true;
  } catch (_) {
    return false;
  }
};

export const last = <T>(arr: T[]): T => arr[arr.length - 1];

export const shuffle = <T>(arr: T[]): T[] => {
  // Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const uniqueFilter = <T>(
  element: T,
  index: number,
  array: T[],
): boolean => {
  return array.indexOf(element) === index;
};
