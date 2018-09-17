import Card from "./card";

class Hand {
	static get HAND_RANK() {
		return {
			'HIGH': 0,
			'PAIR': 5,
			'TWO_PAIRS': 10,
			'THREE_OF_A_KIND': 15,
			'STRAIGHT': 20,
			'FLUSH': 25,
			'FULL_HOUSE': 30,
			'FOUR_OF_A_KIND': 35,
			'STRAIGHT_FLUSH': 40,
			'FIVE_OF_A_KIND': 45
		}
	}

	static arraySubtraction(a, b) {
		return a.filter(c => !b.includes(c));
	}

	static isNumOfAKind(num, cards) {
		const unique_filter = (element, index, array) => (array.indexOf(element) === index);
		const unique = cards.
			map(a => Card.getValue(a)).
			filter(unique_filter).
			sort((a, b) => (b - a))
		var cards_in;
		for (var i = 0; i < unique.length; i++) {
			cards_in = cards.filter(a => (Card.getValue(a) == unique[i]))
			if (cards_in.length >= num) return cards_in;
		}
		return false;
	}

	static isFullHouse(cards) {
		const trips = Hand.isNumOfAKind(3, cards);
		if (!trips) return false;
		const pair = Hand.isNumOfAKind(2, Hand.arraySubtraction(cards, trips))
		if (!pair) return false;
		trips.push(...pair);
		return trips;
	}
}

export default Hand;
