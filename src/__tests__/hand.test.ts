import Hand, { HandRank } from '../hand';
import { isSorted, shuffle } from '../arr';
import Card, { CardStringType, Cards } from '../card';

import * as testdata from './hand-testdata.json';

describe('Hand', (): void => {
  const withoutUuid = (hand: Hand): object => ({
    rank: hand.rank,
    cards: hand.cards,
  });

  describe('toString', (): void => {
    it('solves hands correctly', (): void => {
      const hands = testdata.strings;
      let str;
      for (let i = 0; i < hands.length; i++) {
        str = Hand.solve(new Cards(hands[i].cards)).toString();
        expect(str).toEqual(hands[i].string);
      }
    });
    it('supports custom format for cards string', (): void => {
      const hand = new Hand(Hand.Rank.High, new Cards([5, 4, 3]));
      expect(hand.getCardsString()).toEqual('6h, 5h, 4h');
      expect(hand.toString(Card.StringType.ShortEmoji)).toEqual(
        'Six high (6♥, 5♥, 4♥)',
      );
    });
    it('throws on unsupported rank', (): void => {
      const hand = new Hand(-5 as unknown as HandRank, []);
      expect((): string => hand.toString()).toThrow();
    });
  });
  describe('solve', (): void => {
    it('solves hands correctly', (): void => {
      const hands = testdata.hands;
      let solved;
      for (let i = 0; i < hands.length; i++) {
        solved = Hand.solve(new Cards(hands[i].cards));
        expect(solved.rank).toEqual(hands[i].rank);
      }
    });
  });
  describe('solveHoldEm', (): void => {
    it('solves Texas hold em hands', (): void => {
      expect(
        withoutUuid(
          Hand.solveHoldEm(new Cards([1, 2, 3, 5, 6]), new Cards([4, 13])),
        ),
      ).toEqual(withoutUuid(Hand.solve(new Cards([2, 3, 5, 6, 4]))));
      expect(
        withoutUuid(
          Hand.solveHoldEm(new Cards([1, 2, 3, 5, 6]), new Cards([4, 13])),
        ),
      ).toEqual(withoutUuid(Hand.solve(new Cards([1, 2, 3, 5, 6, 4, 13]))));
    });
    it('solves Omaha hold em hands', (): void => {
      expect(
        withoutUuid(
          Hand.solveHoldEm(
            new Cards([1, 2, 3, 5, 6]),
            new Cards([4, 12, 11, 10]),
            2,
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(new Cards([12, 11, 6, 5, 3]))));
      expect(
        Hand.solveHoldEm(
          new Cards([0, 13, 26, 39, 6]),
          new Cards([12, 7, 4, 2]),
          2,
        ).rank,
      ).toEqual(Hand.Rank.ThreeOfAKind);
    });
  });
  describe('compare', (): void => {
    it('can be used to sort hands from high to low', (): void => {
      const hands = testdata.hands.map(
        ({ rank, cards }: { rank: number; cards: string }): Hand =>
          new Hand(rank, new Cards(cards)),
      );

      // Validate cards match order returned by solve
      for (let i = 0; i < hands.length; i++) {
        expect(hands[i].toString()).toEqual(
          Hand.solve(hands[i].cards).toString(),
        );
      }

      expect(isSorted(hands, Hand.compare)).toEqual(true);

      shuffle(hands);
      expect(isSorted(hands, Hand.compare)).toEqual(false);

      hands.sort(Hand.compare);
      expect(isSorted(hands, Hand.compare)).toEqual(true);
    });
    it('rates 6 high straight better than 5 high straigh', (): void => {
      const a = Hand.solve(new Cards('Ah 2s 3d 4h 5c'));
      const b = Hand.solve(new Cards('2s 3d 4h 5c 6h'));

      expect(a).toBeTruthy();
      expect(b).toBeTruthy();

      expect(Hand.compare(a, b));
    });
    it('does not allow comparing hands with different number of cards', (): void => {
      const commonCards = new Cards([0, 2 + 13, 4, 6 + 13]);
      const a = new Hand(Hand.Rank.High, commonCards);
      const b = new Hand(Hand.Rank.High, [...commonCards, new Card(8)]);
      expect((): number => Hand.compare(a, b)).toThrow();
    });
    it('supports hands with less than five cards', (): void => {
      const a = new Hand(Hand.Rank.High, new Cards([0, 2 + 13, 4]));
      Hand.compare(a, a);
    });
    it('supports hands with more than five cards', (): void => {
      const commonCards = new Cards([0, 2 + 13, 4, 6 + 13, 8]);
      const a = new Hand(Hand.Rank.High, [...commonCards, new Card(9 + 13)]);
      const b = new Hand(Hand.Rank.High, [...commonCards, new Card(10 + 13)]);
      expect(Hand.compare(a, b)).toBeGreaterThan(0);
    });
  });
  describe('winners', (): void => {
    it('returns the winning hands', (): void => {
      const hands = [
        Hand.solve(new Cards([1, 2, 3, 4, 5, 12, 13])),
        Hand.solve(new Cards([1, 2, 3, 4, 5, 7, 8])),
        Hand.solve(new Cards([1, 2, 3, 4, 7, 12, 13])),
        Hand.solve(new Cards([1, 2, 3, 5, 6, 12, 13])),
      ];
      expect(Hand.winners(...hands)).toEqual([hands[0], hands[1]]);
    });
  });
  describe('max', (): void => {
    it('returns the largest of the inputs', (): void => {
      expect(
        withoutUuid(
          Hand.max(
            Hand.solve(new Cards([1, 2, 4, 5, 6])),
            Hand.solve(new Cards([1, 3, 4, 5, 6])),
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(new Cards([1, 3, 4, 5, 6]))));
      expect(
        withoutUuid(
          Hand.max(
            Hand.solve(new Cards([1, 2, 4, 5, 6])),
            Hand.solve(new Cards([1, 3, 4, 5, 6])),
            Hand.solve(new Cards([1, 4, 5, 6, 7])),
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(new Cards([1, 4, 5, 6, 7]))));
    });
  });
  /*
    describe('fillWithKickers', () : void => {
        it('fill hand to match required number of cards', () : void => {
            const cards = [1, 2, 3, 3 + 13, 3 + 2 * 13, 7, 8];
            const cardsIncluded = [3, 3 + 13, 3 + 2 * 13];
            expect(Hand.fillWithKickers(cardsIncluded, cards)).toEqual([3, 3 + 13, 3 + 2 * 13, 8, 7]);
        });
    });
    */
  describe('isNumOfAKind', (): void => {
    it('returns false when no N of a kind in input array', (): void => {
      const cardsIn = new Cards([0, 1 + 13, 2 + 2 * 13, 3 + 3 * 13, 4, 5]);
      expect(Hand.isNumOfAKind(2, cardsIn)).toEqual(false);
    });
    it('returns included cards when N of a kind in input array', (): void => {
      const cardsIn = new Cards([0, 1, 1 + 13, 1 + 2 * 13, 2]);
      for (let i = 1; i < 5; i++) {
        cardsIn.push(new Card(2 + 13 * i));
        const a = i >= 2 ? 2 : 1;
        expect(Hand.isNumOfAKind(3, cardsIn)).toEqual(
          new Cards(
            [...Array(Math.max(3, i + 1)).keys()].map(
              (b: number): number => a + b * 13,
            ),
          ),
        );
      }
    });
  });
  describe('isStraightFlush', (): void => {
    it('returns false when no straight flush in input array', (): void => {
      const cardsIn = new Cards([0, 1 + 13, 2, 3, 4, 5]);
      expect(Hand.isStraightFlush(cardsIn)).toEqual(false);
    });
    it('returns included cards when straight flush in input array', (): void => {
      const cardsIn = new Cards([2, 13, 14, 15, 16, 17]);
      expect(Hand.isStraightFlush(cardsIn)).toEqual(
        new Cards([17, 16, 15, 14, 13]),
      );
    });
  });
  describe('isFullHouse', (): void => {
    it('returns false when no full house in input array', (): void => {
      const cardsIn = new Cards([0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4]);
      expect(Hand.isFullHouse(cardsIn)).toEqual(false);
      cardsIn.push(new Card(1));
      expect(Hand.isFullHouse(cardsIn)).toEqual(false);
    });
    it('returns included cards when full house in input array', (): void => {
      const cardsIn = new Cards([0, 1, 1 + 13, 1 + 2 * 13, 2, 2 + 13]);
      expect(Hand.isFullHouse(cardsIn)).toEqual(
        new Cards([1, 1 + 13, 1 + 2 * 13, 2, 2 + 13]),
      );
    });
  });
  describe('isFlush', (): void => {
    it('returns false when no flush in input array', (): void => {
      const cardsIn = new Cards([0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4]);
      expect(Hand.isFlush(cardsIn)).toEqual(false);
    });
    it('returns included cards sorted by value when flush in input array', (): void => {
      const cardsIn = new Cards([0, 1, 2, 4, 5]);
      expect(Hand.isFlush(cardsIn)).toEqual(new Cards([0, 5, 4, 2, 1]));
    });
    it('slices return array to only contain num cards', (): void => {
      const cardsIn = new Cards([0, 1, 2, 4, 5]);
      expect(Hand.isFlush(cardsIn, 4)).toEqual(new Cards([0, 5, 4, 2]));
    });
  });
  describe('isStraight', (): void => {
    it('returns false when no straight in input array', (): void => {
      let cardsIn = new Cards([0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 3 + 13]);
      expect(Hand.isStraight(cardsIn)).toEqual(false);
      cardsIn = new Cards([0, 1 + 13, 2 + 2 * 13, 3, 5 + 3 * 13]);
      expect(Hand.isStraight(cardsIn)).toEqual(false);
    });
    it('returns included cards sorted by value when straight in input array', (): void => {
      let cardsIn = new Cards(['Th', 'Jh', 'Qh', 'Kh', 'Ah']);
      expect(Hand.isStraight(cardsIn)).toEqual(
        new Cards(['Ah', 'Kh', 'Qh', 'Jh', 'Th']),
      );
      cardsIn = new Cards(['2s', '3s', '4s', '5s', '6s']);
      expect(Hand.isStraight(cardsIn)).toEqual(new Cards([18, 17, 16, 15, 14]));
    });
    it('finds straight with small ace', (): void => {
      const cardsIn = new Cards(['Ah', '2s', '3d', '4h', '5c']);
      expect(Hand.isStraight(cardsIn)).toEqual(
        new Cards(['5c', '4h', '3d', '2s', 'Ah']),
      );
    });
    it('slices return array to only contain num cards', (): void => {
      const cardsIn = new Cards([0, 1, 2, 3, 4, 5]);
      expect(Hand.isStraight(cardsIn, 4)).toEqual(new Cards([5, 4, 3, 2]));
    });
  });
  describe('isTwoPairs', (): void => {
    it('returns false when no two pairs in input array', (): void => {
      const cardsIn = new Cards([0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4]);
      expect(Hand.isTwoPairs(cardsIn)).toEqual(false);
      cardsIn.push(new Card(1));
      expect(Hand.isTwoPairs(cardsIn)).toEqual(false);
    });
    it('returns included cards when two pairs in input array', (): void => {
      const cardsIn = new Cards([0, 1 + 13, 1 + 2 * 13, 2, 2 + 13]);
      expect(Hand.isTwoPairs(cardsIn)).toEqual(
        new Cards([2, 2 + 13, 1 + 13, 1 + 2 * 13]),
      );
    });
  });
});
