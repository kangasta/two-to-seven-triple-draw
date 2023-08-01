import Hand, { HandRank } from '../hand';
import { isSorted, shuffle } from '../arr';
import Card from '../card';

import * as testdata from './hand-testdata.json';

describe('Hand', (): void => {
  const withoutUuid = (hand: Hand): object => ({
    rank: hand.rank,
    cards: hand.cards,
  });

  const asCardsArray = (arr: number[]): Card[] =>
    arr.map((i: number): Card => new Card(i));

  describe('toString', (): void => {
    it('solves hands correctly', (): void => {
      const hands = testdata.strings;
      let str;
      for (let i = 0; i < hands.length; i++) {
        str = Hand.solve(asCardsArray(hands[i].cards)).toString();
        expect(str).toEqual(hands[i].string);
      }
    });
    it('supports custom format for cards string', (): void => {
      const hand = new Hand(Hand.Rank.High, asCardsArray([5, 4, 3]));
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
        solved = Hand.solve(asCardsArray(hands[i].cards));
        expect(solved.rank).toEqual(hands[i].rank);
      }
    });
  });
  describe('solveHoldEm', (): void => {
    it('solves Texas hold em hands', (): void => {
      expect(
        withoutUuid(
          Hand.solveHoldEm(
            asCardsArray([1, 2, 3, 5, 6]),
            asCardsArray([4, 13]),
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(asCardsArray([2, 3, 5, 6, 4]))));
      expect(
        withoutUuid(
          Hand.solveHoldEm(
            asCardsArray([1, 2, 3, 5, 6]),
            asCardsArray([4, 13]),
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(asCardsArray([1, 2, 3, 5, 6, 4, 13]))));
    });
    it('solves Omaha hold em hands', (): void => {
      expect(
        withoutUuid(
          Hand.solveHoldEm(
            asCardsArray([1, 2, 3, 5, 6]),
            asCardsArray([4, 12, 11, 10]),
            2,
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(asCardsArray([12, 11, 6, 5, 3]))));
      expect(
        Hand.solveHoldEm(
          asCardsArray([0, 13, 26, 39, 6]),
          asCardsArray([12, 7, 4, 2]),
          2,
        ).rank,
      ).toEqual(Hand.Rank.ThreeOfAKind);
    });
  });
  describe('compare', (): void => {
    it('can be used to sort hands from high to low', (): void => {
      const hands = testdata.hands.map(
        ({ rank, cards }: { rank: number; cards: number[] }): Hand =>
          new Hand(rank, asCardsArray(cards)),
      );

      expect(isSorted(hands, Hand.compare)).toEqual(true);

      shuffle(hands);
      expect(isSorted(hands, Hand.compare)).toEqual(false);

      hands.sort(Hand.compare);
      expect(isSorted(hands, Hand.compare)).toEqual(true);
    });
    it('does not allow comparing hands with different number of cards', (): void => {
      const commonCards = asCardsArray([0, 2 + 13, 4, 6 + 13]);
      const a = new Hand(Hand.Rank.High, commonCards);
      const b = new Hand(Hand.Rank.High, [...commonCards, new Card(8)]);
      expect((): number => Hand.compare(a, b)).toThrow();
    });
    it('supports hands with less than five cards', (): void => {
      const a = new Hand(Hand.Rank.High, asCardsArray([0, 2 + 13, 4]));
      Hand.compare(a, a);
    });
    it('supports hands with more than five cards', (): void => {
      const commonCards = asCardsArray([0, 2 + 13, 4, 6 + 13, 8]);
      const a = new Hand(Hand.Rank.High, [...commonCards, new Card(9 + 13)]);
      const b = new Hand(Hand.Rank.High, [...commonCards, new Card(10 + 13)]);
      expect(Hand.compare(a, b)).toBeGreaterThan(0);
    });
  });
  describe('winners', (): void => {
    it('returns the winning hands', (): void => {
      const hands = [
        Hand.solve(asCardsArray([1, 2, 3, 4, 5, 12, 13])),
        Hand.solve(asCardsArray([1, 2, 3, 4, 5, 7, 8])),
        Hand.solve(asCardsArray([1, 2, 3, 4, 7, 12, 13])),
        Hand.solve(asCardsArray([1, 2, 3, 5, 6, 12, 13])),
      ];
      expect(Hand.winners(...hands)).toEqual([hands[0], hands[1]]);
    });
  });
  describe('max', (): void => {
    it('returns the largest of the inputs', (): void => {
      expect(
        withoutUuid(
          Hand.max(
            Hand.solve(asCardsArray([1, 2, 4, 5, 6])),
            Hand.solve(asCardsArray([1, 3, 4, 5, 6])),
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(asCardsArray([1, 3, 4, 5, 6]))));
      expect(
        withoutUuid(
          Hand.max(
            Hand.solve(asCardsArray([1, 2, 4, 5, 6])),
            Hand.solve(asCardsArray([1, 3, 4, 5, 6])),
            Hand.solve(asCardsArray([1, 4, 5, 6, 7])),
          ),
        ),
      ).toEqual(withoutUuid(Hand.solve(asCardsArray([1, 4, 5, 6, 7]))));
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
      const cardsIn = asCardsArray([0, 1 + 13, 2 + 2 * 13, 3 + 3 * 13, 4, 5]);
      expect(Hand.isNumOfAKind(2, cardsIn)).toEqual(false);
    });
    it('returns included cards when N of a kind in input array', (): void => {
      const cardsIn = asCardsArray([0, 1, 1 + 13, 1 + 2 * 13, 2]);
      for (let i = 1; i < 5; i++) {
        cardsIn.push(new Card(2 + 13 * i));
        const a = i >= 2 ? 2 : 1;
        expect(Hand.isNumOfAKind(3, cardsIn)).toEqual(
          asCardsArray(
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
      const cardsIn = asCardsArray([0, 1 + 13, 2, 3, 4, 5]);
      expect(Hand.isStraightFlush(cardsIn)).toEqual(false);
    });
    it('returns included cards when straight flush in input array', (): void => {
      const cardsIn = asCardsArray([2, 13, 14, 15, 16, 17]);
      expect(Hand.isStraightFlush(cardsIn)).toEqual(
        asCardsArray([17, 16, 15, 14, 13]),
      );
    });
  });
  describe('isFullHouse', (): void => {
    it('returns false when no full house in input array', (): void => {
      const cardsIn = asCardsArray([0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4]);
      expect(Hand.isFullHouse(cardsIn)).toEqual(false);
      cardsIn.push(new Card(1));
      expect(Hand.isFullHouse(cardsIn)).toEqual(false);
    });
    it('returns included cards when full house in input array', (): void => {
      const cardsIn = asCardsArray([0, 1, 1 + 13, 1 + 2 * 13, 2, 2 + 13]);
      expect(Hand.isFullHouse(cardsIn)).toEqual(
        asCardsArray([1, 1 + 13, 1 + 2 * 13, 2, 2 + 13]),
      );
    });
  });
  describe('isFlush', (): void => {
    it('returns false when no flush in input array', (): void => {
      const cardsIn = asCardsArray([0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4]);
      expect(Hand.isFlush(cardsIn)).toEqual(false);
    });
    it('returns included cards sorted by value when flush in input array', (): void => {
      const cardsIn = asCardsArray([0, 1, 2, 4, 5]);
      expect(Hand.isFlush(cardsIn)).toEqual(asCardsArray([0, 5, 4, 2, 1]));
    });
    it('slices return array to only contain num cards', (): void => {
      const cardsIn = asCardsArray([0, 1, 2, 4, 5]);
      expect(Hand.isFlush(cardsIn, 4)).toEqual(asCardsArray([0, 5, 4, 2]));
    });
  });
  describe('isStraight', (): void => {
    it('returns false when no straight in input array', (): void => {
      let cardsIn = asCardsArray([
        0,
        1 + 13,
        1 + 2 * 13,
        2 + 3 * 13,
        3,
        3 + 13,
      ]);
      expect(Hand.isStraight(cardsIn)).toEqual(false);
      cardsIn = asCardsArray([0, 1 + 13, 2 + 2 * 13, 3, 5 + 3 * 13]);
      expect(Hand.isStraight(cardsIn)).toEqual(false);
    });
    it('returns included cards sorted by value when straight in input array', (): void => {
      let cardsIn = asCardsArray([9, 10, 11, 12, 0]);
      expect(Hand.isStraight(cardsIn)).toEqual(
        asCardsArray([0, 12, 11, 10, 9]),
      );
      cardsIn = asCardsArray([14, 15, 16, 17, 18]);
      expect(Hand.isStraight(cardsIn)).toEqual(
        asCardsArray([18, 17, 16, 15, 14]),
      );
    });
    it('finds straight with small ace', (): void => {
      const cardsIn = asCardsArray([0, 1 + 13, 2 + 2 * 13, 3, 4 + 3 * 13]);
      expect(Hand.isStraight(cardsIn)).toEqual(
        asCardsArray([4 + 3 * 13, 3, 2 + 2 * 13, 1 + 13, 0]),
      );
    });
    it('slices return array to only contain num cards', (): void => {
      const cardsIn = asCardsArray([0, 1, 2, 3, 4, 5]);
      expect(Hand.isStraight(cardsIn, 4)).toEqual(asCardsArray([5, 4, 3, 2]));
    });
  });
  describe('isTwoPairs', (): void => {
    it('returns false when no two pairs in input array', (): void => {
      const cardsIn = asCardsArray([0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4]);
      expect(Hand.isTwoPairs(cardsIn)).toEqual(false);
      cardsIn.push(new Card(1));
      expect(Hand.isTwoPairs(cardsIn)).toEqual(false);
    });
    it('returns included cards when two pairs in input array', (): void => {
      const cardsIn = asCardsArray([0, 1 + 13, 1 + 2 * 13, 2, 2 + 13]);
      expect(Hand.isTwoPairs(cardsIn)).toEqual(
        asCardsArray([2, 2 + 13, 1 + 13, 1 + 2 * 13]),
      );
    });
  });
});
