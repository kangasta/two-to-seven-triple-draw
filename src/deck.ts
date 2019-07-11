import Card, { CardJSON } from './card';
import { shuffle, isSorted } from './arr';

interface DeckJSON {
    cards: CardJSON[];
}

class Deck {
    private cards: Card[];
    public constructor(shuffleDeck=true, numDecks=1) {
        this.cards = [...Array(52 * numDecks).keys()].map((i: number): Card => new Card(i));

        if (shuffleDeck) {
            this.shuffle();
        }
    }

    public static fromJSON({cards}: DeckJSON): Deck {
        const deck = new Deck(false, 0);
        deck.cards = cards.map((i: CardJSON): Card => Card.fromJSON(i));
        return deck;
    }

    public shuffle(): void { shuffle(this.cards); }

    public isShuffled(): boolean {
        return !isSorted(this.cards, (a: Card,b: Card): number => (a.num - b.num));
    }

    public pop(): Card | undefined { return this.cards.pop(); }
}

export default Deck;
