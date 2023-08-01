export interface CardJSON {
  num: number;
}

export enum CardSuits {
  Hearts = 0,
  Spades = 1,
  Diamonds = 2,
  Clubs = 3,
}

export enum CardStringType {
  Short = 'SHORT',
  Long = 'LONG',
  ShortEmoji = 'SHORT_EMOJI',
  ShortSuit = 'SHORT_SUIT',
  LongSuit = 'LONG_SUIT',
  EmojiSuit = 'EMOJI_SUIT',
  ShortValue = 'SHORT_VALUE',
  LongValue = 'LONG_VALUE',
}

class Card {
  public readonly num: number;
  public constructor(num: number) {
    this.num = num;
  }

  public static fromJSON({ num }: CardJSON): Card {
    return new Card(num);
  }

  public get suit(): number {
    return Card.getSuit(this.num);
  }

  public get value(): number {
    return Card.getValue(this.num);
  }

  public static readonly Suits = CardSuits;
  public static readonly StringType = CardStringType;

  private static emojiSuits = ['♥', '♠', '♦', '♣'];
  private static shortSuits = ['h', 's', 'd', 'c'];
  private static longSuits = ['hearts', 'spades', 'diamonds', 'clubs'];
  private static shortValues = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'J',
    'Q',
    'K',
  ];
  private static longValues = [
    'ace',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'jack',
    'queen',
    'king',
  ];

  public toString(stringType = Card.StringType.Long): string {
    switch (stringType) {
      case Card.StringType.Short:
        return (
          this.toString(Card.StringType.ShortValue) +
          this.toString(Card.StringType.ShortSuit)
        );
      case Card.StringType.ShortEmoji:
        return (
          this.toString(Card.StringType.ShortValue) +
          this.toString(Card.StringType.EmojiSuit)
        );
      case Card.StringType.Long:
        return (
          this.toString(Card.StringType.LongValue) +
          ' of ' +
          this.toString(Card.StringType.LongSuit)
        );
      case Card.StringType.ShortSuit:
        return Card.shortSuits[this.suit];
      case Card.StringType.LongSuit:
        return Card.longSuits[this.suit];
      case Card.StringType.EmojiSuit:
        return Card.emojiSuits[this.suit];
      case Card.StringType.ShortValue:
        return Card.shortValues[this.value === 13 ? 0 : this.value];
      case Card.StringType.LongValue:
        return Card.longValues[this.value === 13 ? 0 : this.value];
    }
    throw new Error('Unsupported output type');
  }

  public static getSuit(num: number): number {
    return Math.floor(num / 13) % 4;
  }

  public static getValue(num: number, lowAce = false): number {
    return num % 13 || lowAce ? num % 13 : 13;
  }

  public static compare(a: Card, b: Card): number {
    return b.value - a.value;
  }
}

export default Card;
