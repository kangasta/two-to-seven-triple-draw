import { isSorted } from '../arr';
import { Card, Cards, Deck } from '../two-to-seven-triple-draw';

describe('Deck', (): void => {
  const asCardsArray = (deck: Deck): Card[] => {
    return deck.popN(deck.cardsRemaining);
  };

  const compareCardNums = (a: Card, b: Card): number => a.num - b.num;

  it('generates by default a single shuffled deck', (): void => {
    const deck = new Deck();
    const cards = asCardsArray(deck);

    expect(isSorted(cards, compareCardNums)).toBe(false);
  });
  it('allows generating sorted deck', (): void => {
    const deck = new Deck(false);
    expect(deck.isShuffled()).toBe(false);

    const cards = asCardsArray(deck);
    expect(isSorted(cards, compareCardNums, true)).toBe(true);
  });
  it('provides a method to check if deck is shuffled', (): void => {
    const deck = new Deck(false);
    expect(deck.isShuffled()).toBe(false);

    deck.shuffle();
    expect(deck.isShuffled()).toBe(true);
  });
  it('provides a method to get multiple cards at time', (): void => {
    const deck = new Deck();

    let cards = deck.popN(30);
    expect(cards).toHaveLength(30);

    cards = deck.popN(30);
    expect(cards).toHaveLength(22);
  });
  it('provides method to check number of cards remaining', (): void => {
    const deck = new Deck(true, 3);

    expect(deck.cardsRemaining).toEqual(52 * 3);
    expect(deck.popN(52)).toHaveLength(52);
    expect(deck.cardsRemaining).toEqual(52 * 2);
  });
  it('provides method to read deck from string', (): void => {
    const deck = Deck.fromString('_XYZabc');

    expect(deck.cardsRemaining).toEqual(6);
    const cards = deck.popN(6).reverse();
    expect(cards).toEqual(new Cards([23, 24, 25, 26, 27, 28]));
  });
  it('provides method to write the deck into a string', (): void => {
    const deck = Deck.fromString('Ah As Ad Ac');

    expect(deck.toString()).toEqual('_ANan');
  });
});
