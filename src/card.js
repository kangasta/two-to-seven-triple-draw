class Card {
	static get SUITS() {
		return {
			'HEARTS':    0,
			'SPADES':    1,
			'DIAMONDS':  2,
			'CLUBS':     3
		};
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
