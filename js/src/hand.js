import Card from './card';
import { arraySubtraction, last, uniqueFilter } from './arr';

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
			'FIVE_OF_A_KIND': 45 // TODO: Requires wild support, which is not currently implemented
		};
	}

	static getUniqueValues(cards) {
		return cards.
			map(a => Card.getValue(a)).
			filter(uniqueFilter).
			sort((a, b) => (b - a));
	}

	static isNumOfAKind(num, cards) {
		const unique = Hand.getUniqueValues(cards);
		var cards_included;
		for (var i = 0; i < unique.length; i++) {
			cards_included = cards.filter(a => (Card.getValue(a) == unique[i]));
			if (cards_included.length >= num) return cards_included;
		}
		return false;
	}

	static isNumOfAKindCombination(nums, cards) {
		var cards_included = [];
		for (var i = 0; i < nums.length; i++) {
			const numOfAKind = Hand.isNumOfAKind(nums[i], arraySubtraction(cards, cards_included));
			if (!numOfAKind) return false;
			cards_included.push(...numOfAKind);
		}
		return cards_included;
	}

	static isStraightFlush(cards, num=5) {
		var flush = [];
		for (var i = 0; i < 4; i++) {
			flush = cards.filter(a => Card.getSuit(a) === i);
			if (flush.length < num) continue;
			const straight = Hand.isStraight(flush, num);
			if (straight) return straight;
		}
		return false;
	}

	static isFullHouse(cards) {
		return Hand.isNumOfAKindCombination([3,2], cards);
	}

	static isFlush(cards, num=5) {
		for (var i = 0; i < 4; i++) {
			var suited = cards.filter(a => (Card.getSuit(a) == i));
			if (suited.length >= num) return suited.sort(Card.compare).slice(0,num);
		}
		return false;
	}

	static isStraight(cards, num=5) {
		var unique = Hand.getUniqueValues(cards);

		if (unique.length < num) return false;
		if (unique.includes(13)) unique.push(0);

		var values_included = [unique[0]];
		for (var i = 1; i < unique.length && values_included.length < num; i++) {
			if ((last(values_included) - unique[i]) === 1) {
				values_included.push(unique[i]);
			} else {
				values_included = [unique[i]];
			}
		}
		if (values_included.length == num) {
			return values_included.map(a => cards.find(b => (Card.getValue(b) === (a ? a : 13))));
		}
		return false;
	}

	static isTwoPairs(cards) {
		return Hand.isNumOfAKindCombination([2,2], cards);
	}
}

export default Hand;
