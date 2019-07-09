class Card {
    public readonly num: number;
    public constructor(num: number) {
        this.num = num;
    }

    public get suit(): number {
        return Card.getSuit(this.num);
    }

    public get value(): number {
        return Card.getValue(this.num);
    }

    public static STRING_TYPE = {
        'SHORT': 0,
        'LONG': 1,
        'SHORT_EMOJI': 2,
        'SHORT_SUIT': 10,
        'LONG_SUIT': 11,
        'EMOJI_SUIT': 12,
        'SHORT_VALUE': 20,
        'LONG_VALUE': 21
    }

    public toString(stringType=Card.STRING_TYPE.LONG): string {
        const types = Card.STRING_TYPE;
        switch (stringType) {
            case types.SHORT:
                return this.toString(types.SHORT_VALUE) + this.toString(types.SHORT_SUIT);
            case types.SHORT_EMOJI:
                return this.toString(types.SHORT_VALUE) + this.toString(types.EMOJI_SUIT);
            case types.LONG:
                return this.toString(types.LONG_VALUE) + ' of ' + this.toString(types.LONG_SUIT);
            case types.SHORT_SUIT:
                return Card.SHORT_SUITS[this.suit];
            case types.LONG_SUIT:
                return Card.LONG_SUITS[this.suit];
            case types.EMOJI_SUIT:
                return Card.EMOJI_SUITS[this.suit];
            case types.SHORT_VALUE:
                return Card.SHORT_VALUES[this.value === 13 ? 0 : this.value];
            case types.LONG_VALUE:
                return Card.LONG_VALUES[this.value === 13 ? 0 : this.value];
        }
        throw new Error('Unsupported output type');
    }

    public static SUITS = {
        'HEARTS':    0,
        'SPADES':    1,
        'DIAMONDS':  2,
        'CLUBS':     3
    }

    private static EMOJI_SUITS = {
        [Card.SUITS.HEARTS]: '♥',
        [Card.SUITS.SPADES]: '♠',
        [Card.SUITS.DIAMONDS]: '♦',
        [Card.SUITS.CLUBS]: '♣',
    }

    private static SHORT_SUITS = {
        [Card.SUITS.HEARTS]: 'h',
        [Card.SUITS.SPADES]: 's',
        [Card.SUITS.DIAMONDS]: 'd',
        [Card.SUITS.CLUBS]: 'c',
    }

    private static LONG_SUITS = {
        [Card.SUITS.HEARTS]: 'hearts',
        [Card.SUITS.SPADES]: 'spades',
        [Card.SUITS.DIAMONDS]: 'diamonds',
        [Card.SUITS.CLUBS]: 'clubs',
    }

    private static SHORT_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']

    private static LONG_VALUES = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king']

    public static getSuit(num: number): number {
        return Math.floor(num/13) % 4;
    }

    public static getValue(num: number, lowAce=false): number {
        return num % 13 || lowAce ? num % 13 : 13;
    }

    public static compare(a: number, b: number): number {
        return Card.getValue(b) - Card.getValue(a);
    }
}

export default Card;
