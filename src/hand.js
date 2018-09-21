import Card from './card';
import { uuid4 } from './uuid';
import { arraySubtraction, getCombinations, last, uniqueFilter } from './arr';

class Hand {
	constructor(rank, cards) {
		this.rank = rank;
		this.cards = cards;
		this.uuid = uuid4();
	}

	static get RANK() {
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

	static solve(cards, num=5) {
		var cards_included;
		var hand_rank;

		/* eslint-disable no-cond-assign */
		if (cards_included = Hand.isNumOfAKind(5, cards)) {
			hand_rank = Hand.RANK.FIVE_OF_A_KIND;
		} else if (cards_included = Hand.isStraightFlush(cards, num)) {
			hand_rank = Hand.RANK.STRAIGHT_FLUSH;
		} else if (cards_included = Hand.isNumOfAKind(4, cards)) {
			hand_rank = Hand.RANK.FOUR_OF_A_KIND;
		} else if (cards_included = Hand.isFullHouse(cards)) {
			hand_rank = Hand.RANK.FULL_HOUSE;
		} else if (cards_included = Hand.isFlush(cards, num)) {
			hand_rank = Hand.RANK.FLUSH;
		} else if (cards_included = Hand.isStraight(cards, num)) {
			hand_rank = Hand.RANK.STRAIGHT;
		} else if (cards_included = Hand.isNumOfAKind(3, cards)) {
			hand_rank = Hand.RANK.THREE_OF_A_KIND;
		} else if (cards_included = Hand.isTwoPairs(cards)) {
			hand_rank = Hand.RANK.TWO_PAIRS;
		} else if (cards_included = Hand.isNumOfAKind(2, cards)) {
			hand_rank = Hand.RANK.PAIR;
		} else {
			cards_included = [];
			hand_rank = Hand.RANK.HIGH;
		}
		/* eslint-enable no-cond-assign */

		cards_included =  Hand.fillWithKickers(cards_included, cards);

		return new Hand(hand_rank, cards_included);
	}

	static solveHoldEm(table_cards, hand_cards, must_use=0) {
		if (must_use === 0) return Hand.solve([...table_cards, ...hand_cards]);

		const table_combinations = getCombinations(table_cards, table_cards.length - must_use);
		const hand_combinations = getCombinations(hand_cards, Math.min(hand_cards.length, must_use));
		var hands = [];
		for (var i = 0; i < table_combinations.length; i++) {
			for (var j = 0; j < hand_combinations.length; j++) {
				hands.push(Hand.solve([...(table_combinations[i]), ...(hand_combinations[j])]));
			}
		}

		return Hand.max(...hands);
	}

	static compare(a, b) {
		var r;
		/* eslint-disable no-cond-assign */
		if ((r = b.rank - a.rank) !== 0) return r;
		for (var i = 0; i < 5; i++) {
			if ((r = Card.compare(a.cards[i], b.cards[i])) !== 0) return r;
		}
		/* eslint-enable no-cond-assign */
		return 0;
	}

	static max(...arr) {
		const max2 = (a,b) => (Hand.compare(a, b) < 0 ? a : b);
		return arr.reduce((a, b) => max2(a, b));
	}

	static fillWithKickers(cards_included, cards, num=5) {
		cards = arraySubtraction(cards, cards_included).sort(Card.compare);
		return [...cards_included, ...cards].slice(0,num);
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
