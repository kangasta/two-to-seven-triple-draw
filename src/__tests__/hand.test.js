import Hand from '../hand';
import { isSorted, shuffle } from '../arr';

describe('Hand', () => {
	Hand.prototype.removeUuid = function() {
		return {
			'rank': this.rank,
			'cards': this.cards
		};
	};

	describe('toString',() => {
		it('solves hands correctly', () => {
			const hands = require('./hand-testdata.json').strings;
			var str;
			for(var i = 0; i < hands.length; i++) {
				str = Hand.solve(hands[i].cards).toString();
				expect(str).toEqual(hands[i].string);
			}
		});
	});
	describe('solve', () => {
		it('solves hands correctly', () => {
			const hands = require('./hand-testdata.json').hands;
			var solved;
			for(var i = 0; i < hands.length; i++) {
				solved = Hand.solve(hands[i].cards);
				expect(solved.rank).toEqual(hands[i].rank);
			}
		});
	});
	describe('solveHoldEm', () => {
		it('solves Texas hold em hands', () => {
			expect(Hand.solveHoldEm([1, 2, 3, 5, 6], [4, 13]).removeUuid()).toEqual(Hand.solve([2, 3, 5, 6, 4]).removeUuid());
			expect(Hand.solveHoldEm([1, 2, 3, 5, 6], [4, 13]).removeUuid()).toEqual(Hand.solve([1, 2, 3, 5, 6, 4, 13]).removeUuid());
		});
		it('solves Omaha hold em hands', () => {
			expect(Hand.solveHoldEm([1, 2, 3, 5, 6], [4, 12, 11, 10], 2).removeUuid()).toEqual(Hand.solve([12, 11, 6, 5, 3]).removeUuid());
			expect(Hand.solveHoldEm([0, 13, 26, 39, 6], [12, 7, 4, 2], 2).rank).toEqual(Hand.RANK.THREE_OF_A_KIND);
		});
	});
	describe('compare', () => {
		it('can be used to sort hands from high to low', () => {
			var hands = require('./hand-testdata.json').hands;
			expect(isSorted(hands, Hand.compare)).toEqual(true);
			shuffle(hands);
			expect(isSorted(hands, Hand.compare)).toEqual(false);
			hands.sort(Hand.compare);
			expect(isSorted(hands, Hand.compare)).toEqual(true);
		});
	});
	describe('winners', () => {
		it('returns the winning hands', () => {
			const hands = [
				Hand.solve([1, 2, 3, 4, 5, 12, 13]),
				Hand.solve([1, 2, 3, 4, 5, 7, 8]),
				Hand.solve([1, 2, 3, 4, 7, 12, 13]),
				Hand.solve([1, 2, 3, 5, 6, 12, 13]),
			];
			expect(Hand.winners(...hands)).toEqual([hands[0], hands[1]]);
		});
	});
	describe('max', () => {
		it('returns the largest of the inputs', () => {
			expect(Hand.max(
				Hand.solve([1, 2, 4, 5, 6]).removeUuid(),
				Hand.solve([1, 3, 4, 5, 6]).removeUuid())).toEqual(Hand.solve([1, 3, 4, 5, 6]).removeUuid());
			expect(Hand.max(
				Hand.solve([1, 2, 4, 5, 6]).removeUuid(),
				Hand.solve([1, 3, 4, 5, 6]).removeUuid(),
				Hand.solve([1, 4, 5, 6, 7]).removeUuid())).toEqual(Hand.solve([1, 4, 5, 6, 7]).removeUuid());
		});
	});
	describe('fillWithKickers', () => {
		it('fill hand to match required number of cards', () => {
			const cards = [1, 2, 3, 3 + 13, 3 + 2 * 13, 7, 8];
			const cards_included = [3, 3 + 13, 3 + 2 * 13];
			expect(Hand.fillWithKickers(cards_included, cards)).toEqual([3, 3 + 13, 3 + 2 * 13, 8, 7]);
		});
	});
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
	describe('isStraightFlush', () => {
		it('returns false when no straight flush in input array', () => {
			var cards_in = [0, 1 + 13, 2, 3, 4, 5];
			expect(Hand.isStraightFlush(cards_in)).toEqual(false);
		});
		it('returns included cards when straight flush in input array', () => {
			const cards_in = [2, 13, 14, 15, 16, 17];
			expect(Hand.isStraightFlush(cards_in)).toEqual([17, 16, 15, 14, 13]);
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
			var cards_in = [9, 10, 11, 12, 0];
			expect(Hand.isStraight(cards_in)).toEqual([0, 12, 11, 10, 9]);
			cards_in = [14, 15, 16, 17, 18];
			expect(Hand.isStraight(cards_in)).toEqual([18, 17, 16, 15, 14]);
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
