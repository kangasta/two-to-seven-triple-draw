import Card, { CardStringType } from '../card';

describe('Card', (): void => {
  describe('toString', (): void => {
    it('gives string representation of a card', (): void => {
      const card = new Card(13);
      expect(card.toString()).toEqual('ace of spades');
      expect(card.toString(Card.StringType.Short)).toEqual('As');
    });
    it('supports different formats', (): void => {
      const card = new Card(14);
      expect(card.toString(Card.StringType.Long)).toEqual('two of spades');
      expect(card.toString(Card.StringType.Short)).toEqual('2s');
      expect(card.toString(Card.StringType.ShortEmoji)).toEqual('2♠');
    });
    it('throws on unsupported type', (): void => {
      const card = new Card(14);
      expect((): string =>
        card.toString(-20 as unknown as CardStringType),
      ).toThrow();
    });
  });
  describe('getSuit', (): void => {
    it('returns suit of card as defined by SUITS', (): void => {
      const suits = [
        Card.Suits.Hearts,
        Card.Suits.Spades,
        Card.Suits.Diamonds,
        Card.Suits.Clubs,
      ];
      for (let i = 0; i < 8; i++) {
        expect(Card.getSuit(3 + i * 13)).toEqual(suits[i % 4]);
      }
    });
  });
  describe('getValue', (): void => {
    it('returns value of card as face value - 1', (): void => {
      for (let i = 0; i < 52; i++) {
        if (i % 13) {
          expect(Card.getValue(i)).toEqual(i % 13);
        }
      }
    });
    it('returns aces by default as high aces', (): void => {
      expect(Card.getValue(0)).toEqual(13);
    });
  });
  describe('compare', (): void => {
    it('can be used to sort cards highest first', (): void => {
      const cards = [0, 1 + 13, 2 + 26, 2, 3, 4].map(
        (a: number): Card => new Card(a),
      );
      cards.sort(Card.compare);
      expect(cards.map((a: Card): number => a.num)).toEqual([
        0, 4, 3, 28, 2, 14,
      ]);
    });
  });
});
