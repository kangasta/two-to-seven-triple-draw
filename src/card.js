class Card {
	constructor(num) {
		this.num = num;
	}

	get suit() {
		return Card.getSuit(this.num);
	}

	get value() {
		return Card.getValue(this.num);
	}

	static get STRING_TYPE() {
		return {
			'SHORT': 0,
			'LONG': 1,
			'SHORT_EMOJI': 2,
			'SHORT_SUIT': 10,
			'LONG_SUIT': 11,
			'EMOJI_SUIT': 12,
			'SHORT_VALUE': 20,
			'LONG_VALUE': 21
		};
	}

	toString(string_type=Card.STRING_TYPE.LONG) {
		const str_t = Card.STRING_TYPE;
		switch (string_type) {
		case str_t.SHORT:
			return this.toString(str_t.SHORT_VALUE) + this.toString(str_t.SHORT_SUIT);
		case str_t.SHORT_EMOJI:
			return this.toString(str_t.SHORT_VALUE) + this.toString(str_t.EMOJI_SUIT);
		case Card.STRING_TYPE.LONG:
			return this.toString(str_t.LONG_VALUE) + ' of ' + this.toString(str_t.LONG_SUIT);
		case Card.STRING_TYPE.SHORT_SUIT:
			return Card.SHORT_SUITS[this.suit];
		case Card.STRING_TYPE.LONG_SUIT:
			return Card.LONG_SUITS[this.suit];
		case Card.STRING_TYPE.EMOJI_SUIT:
			return Card.EMOJI_SUITS[this.suit];
		case Card.STRING_TYPE.SHORT_VALUE:
			return Card.SHORT_VALUES[this.value === 13 ? 0 : this.value];
		case Card.STRING_TYPE.LONG_VALUE:
			return Card.LONG_VALUES[this.value === 13 ? 0 : this.value];
		}
	}

	static get SUITS() {
		return {
			'HEARTS':    0,
			'SPADES':    1,
			'DIAMONDS':  2,
			'CLUBS':     3
		};
	}

	static get EMOJI_SUITS() {
		return {
			[Card.SUITS.HEARTS]: '♥',
			[Card.SUITS.SPADES]: '♠',
			[Card.SUITS.DIAMONDS]: '♦',
			[Card.SUITS.CLUBS]: '♣',
		};
	}

	static get SHORT_SUITS() {
		return {
			[Card.SUITS.HEARTS]: 'h',
			[Card.SUITS.SPADES]: 's',
			[Card.SUITS.DIAMONDS]: 'd',
			[Card.SUITS.CLUBS]: 'c',
		};
	}

	static get LONG_SUITS() {
		return {
			[Card.SUITS.HEARTS]: 'hearts',
			[Card.SUITS.SPADES]: 'spades',
			[Card.SUITS.DIAMONDS]: 'diamonds',
			[Card.SUITS.CLUBS]: 'clubs',
		};
	}

	static get SHORT_VALUES() {
		return ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
	}

	static get LONG_VALUES() {
		return ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
	}

	static getSuit(num) {
		return Math.floor(num/13) % 4;
	}

	static getValue(num, low_ace=false) {
		return num % 13 || low_ace ? num % 13 : 13;
	}

	static compare(a, b) {
		return Card.getValue(b) - Card.getValue(a);
	}
}

export default Card;
