import Hand from '../hand';

describe('Hand', () => {
	describe('isNumOfAKind', () => {
		it('returns false when no N of a kind in input array', () => {
			var cards_in = [0, 1 + 13, 2 + 2 * 13, 3 + 3 * 13, 4, 5];
			expect(Hand.isNumOfAKind(2, cards_in)).toEqual(false);
		});
		it('returns included cards when N of a kind in input array', () => {
			const cards_in = [0, 1, 1 + 13, 1 + 2 * 13, 2];
			for (var i = 1; i < 5; i++) {
				cards_in.push(2+13*i);
				const a = (i >= 2) ? 2 : 1;
				expect(Hand.isNumOfAKind(3, cards_in)).toEqual([...Array(Math.max(3, i + 1)).keys()].map(b => a + b * 13));
			}
		});
	});
	describe('isFullHouse', () => {
		it('returns false when no full house in input array', () => {
			var cards_in = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4];
			expect(Hand.isFullHouse(cards_in)).toEqual(false);
			cards_in.push(1);
			expect(Hand.isFullHouse(cards_in)).toEqual(false);
		});
		it('returns included cards when full house in input array', () => {
			const cards_in = [0, 1, 1 + 13, 1 + 2 * 13, 2, 2 + 13];
			expect(Hand.isFullHouse(cards_in)).toEqual([1, 1 + 13, 1 + 2 * 13, 2, 2 + 13]);
		});
	});
	describe('isFlush', () => {
		it('returns false when no flush in input array', () => {
			var cards_in = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4];
			expect(Hand.isFlush(cards_in)).toEqual(false);
		});
		it('returns included cards sorted by value when flush in input array', () => {
			const cards_in = [0, 1, 2, 4, 5];
			expect(Hand.isFlush(cards_in)).toEqual([0, 5, 4, 2, 1]);
		});
		it('slices return array to only contain num cards', () => {
			const cards_in = [0, 1, 2, 4, 5];
			expect(Hand.isFlush(cards_in, 4)).toEqual([0, 5, 4, 2]);
		});
	});
	describe('isStraight', () => {
		it('returns false when no straight in input array', () => {
			var cards_in = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 3 + 13];
			expect(Hand.isStraight(cards_in)).toEqual(false);
			cards_in = [0, 1 + 13, 2 + 2 * 13, 3, 5 + 3 * 13];
			expect(Hand.isStraight(cards_in)).toEqual(false);
		});
		it('returns included cards sorted by value when straight in input array', () => {
			const cards_in = [9, 10, 11, 12, 0];
			expect(Hand.isStraight(cards_in)).toEqual([0, 12, 11, 10, 9]);
		});
		it('finds straight with small ace', () => {
			const cards_in = [0, 1 + 13, 2 + 2 * 13, 3, 4 + 3 * 13];
			expect(Hand.isStraight(cards_in)).toEqual([4 + 3 * 13, 3, 2 + 2 * 13, 1 + 13, 0]);
		});
		it('slices return array to only contain num cards', () => {
			const cards_in = [0, 1, 2, 3, 4, 5];
			expect(Hand.isStraight(cards_in, 4)).toEqual([5, 4, 3, 2]);
		});
	});
	describe('isTwoPairs', () => {
		it('returns false when no two pairs in input array', () => {
			var cards_in = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4];
			expect(Hand.isTwoPairs(cards_in)).toEqual(false);
			cards_in.push(1);
			expect(Hand.isTwoPairs(cards_in)).toEqual(false);
		});
		it('returns included cards when two pairs in input array', () => {
			const cards_in = [0, 1 + 13, 1 + 2 * 13, 2, 2 + 13];
			expect(Hand.isTwoPairs(cards_in)).toEqual([2, 2 + 13, 1 + 13, 1 + 2 * 13]);
		});
	});
});
