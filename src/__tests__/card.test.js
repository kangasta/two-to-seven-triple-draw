import Card from '../card';

describe('Card', () => {
	describe('getSuite', () =>{
		it('returns suit of card as defined by SUITS', () => {
			const suits = [Card.SUITS.HEARTS, Card.SUITS.SPADES, Card.SUITS.DIAMONDS, Card.SUITS.CLUBS];
			for(var i = 0; i < 8; i++) {
				expect(Card.getSuit(3+i*13)).toEqual(suits[i % 4]);
			}
		});
	});
	describe('getValue', () =>{
		it('returns value of card as face value - 1', () => {
			for (var i = 0; i < 52; i++) {
				if (i % 13) {
					expect(Card.getValue(i)).toEqual(i % 13);
				}
			}
		});
		it('returns aces by default as high aces', () =>{
			expect(Card.getValue(0)).toEqual(13);
		});
	});
	describe('compare', () => {
		it('can be used to sort cards highest first', () =>{
			var cards = [0, 1 + 13, 2 + 26, 2, 3, 4];
			cards.sort(Card.compare);
			expect(cards).toEqual([0, 4, 3, 28, 2, 14]);
		});
	});
});
