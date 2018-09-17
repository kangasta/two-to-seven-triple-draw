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
});