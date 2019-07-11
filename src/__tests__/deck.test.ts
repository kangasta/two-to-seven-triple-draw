import { Card, Deck } from '../two-to-seven-triple-draw';
import { isSorted } from '../arr';

describe('Deck', (): void => {
    const asCardsArray = (deck: Deck): Card[] => {
        const cards = [];
        let card;

        while (card = deck.pop()) { cards.push(card); } // eslint-disable-line no-cond-assign
        return cards;
    };

    const compareCardNums = (a: Card,b: Card): number => (a.num - b.num);

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
});
