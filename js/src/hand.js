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
		var cards_included;
		for (var i = 0; i < unique.length; i++) {
			cards_included = cards.filter(a => (Card.getValue(a) == unique[i]))
			if (cards_included.length >= num) return cards_included;
		}
		return false;
	}

	static isNumOfAKindCombination(nums, cards) {
		var cards_included = [];
		for (var i = 0; i < nums.length; i++) {
			const numOfAKind = Hand.isNumOfAKind(nums[i], Hand.arraySubtraction(cards, cards_included));
			if (!numOfAKind) return false;
			cards_included.push(...numOfAKind);
		}
		return cards_included;
	}

	static isFullHouse(cards) {
		return Hand.isNumOfAKindCombination([3,2], cards);
	}

	static isTwoPairs(cards) {
		return Hand.isNumOfAKindCombination([2,2], cards);
	}
}

export default Hand;
