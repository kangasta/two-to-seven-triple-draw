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
  Char = 'CHAR',
  Short = 'SHORT',
  Long = 'LONG',
  ShortEmoji = 'SHORT_EMOJI',
  ShortSuit = 'SHORT_SUIT',
  LongSuit = 'LONG_SUIT',
  EmojiSuit = 'EMOJI_SUIT',
  ShortValue = 'SHORT_VALUE',
  LongValue = 'LONG_VALUE',
}

const suitMap: Record<string, number> = {
  '♥': 0,
  '♠': 1,
  '♦': 2,
  '♣': 3,
  h: 0,
  s: 1,
  d: 2,
  c: 3,
};

const rankMap: Record<string, number> = {
  A: 1,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
};

const stringToNum = (cardStr: string): number => {
  const cardRe = /^([2-9ATJQK]{1}|10)([♥♠♦♣hsdc]{1})$/;
  const match = cardStr.match(cardRe);
  if (!match) {
    throw new Error(
      `Could not parse card from "${cardStr}". Input should match ${cardRe}.`,
    );
  }

  const [_, rawRank, suitKey] = match;
  const rankNum = Number(rawRank);
  const rank = (Number.isNaN(rankNum) ? rankMap[rawRank] : rankNum) - 1;
  return suitMap[suitKey] * 13 + rank;
};

const parseString = (input: string) => {
  const charStrRe = /^_[a-z]+$/i;
  if (input.match(charStrRe)) {
    const chars = Array.from(input.slice(1));
    return chars.map((i) => {
      const c = i.charCodeAt(0);
      // A = 65, a = 97
      return c < 91 ? c - 65 : c - 97 + 26;
    });
  }
  return input.split(/[\s,]+/);
};

export class Cards extends Array<Card> {
  constructor(input: string | number | string[] | number[] | Card[]) {
    if (typeof input === 'number') {
      super(input);
    } else {
      super();
      const arr = Array.isArray(input) ? input : parseString(input);
      arr.forEach((i) => this.push(new Card(i)));
    }
  }

  public toString(stringType = Card.StringType.Short): string {
    if (stringType === CardStringType.Char) {
      return '_' + this.map((card) => card.toString(stringType)).join('');
    }
    return this.map((card) => card.toString(stringType)).join(', ');
  }
}

const parseNum = (input: number | string | Card): number => {
  if (typeof input === 'string') return stringToNum(input);
  if (input instanceof Card) return input.num;
  return input;
};

export class Card {
  public readonly num: number;
  public constructor(input: number | string | Card) {
    this.num = parseNum(input);
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

  private static chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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
      case Card.StringType.Char:
        return Card.chars[this.num];
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
