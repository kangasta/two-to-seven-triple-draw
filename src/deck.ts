import Card, { CardJSON, Cards } from './card';
import { shuffle, isSorted } from './arr';

interface DeckJSON {
  cards: CardJSON[];
}

class Deck {
  private cards: Card[];
  public constructor(shuffleDeck = true, numDecks = 1) {
    this.cards = [...Array(52 * numDecks).keys()].map(
      (i: number): Card => new Card(i),
    );

    if (shuffleDeck) {
      this.shuffle();
    }
  }

  public static fromJSON({ cards }: DeckJSON): Deck {
    const deck = new Deck(false, 0);
    deck.cards = cards.map((i: CardJSON): Card => Card.fromJSON(i));
    return deck;
  }

  public static fromString(input: string): Deck {
    const deck = new Deck(false, 0);
    deck.cards = new Cards(input);
    return deck;
  }

  public shuffle(): void {
    shuffle(this.cards);
  }

  public isShuffled(): boolean {
    return !isSorted(this.cards, (a: Card, b: Card): number => a.num - b.num);
  }

  public get cardsRemaining(): number {
    return this.cards.length;
  }

  public pop(): Card | undefined {
    return this.cards.pop();
  }
  public popN(n: number): Card[] {
    const cards = [];
    let card;

    // eslint-disable-next-line no-cond-assign
    for (let i = 0; i < n && (card = this.pop()); i++) {
      cards.push(card);
    }

    return cards;
  }

  public toString(stringType = Card.StringType.Char): string {
    return new Cards(this.cards).toString(stringType);
  }
}

export default Deck;
