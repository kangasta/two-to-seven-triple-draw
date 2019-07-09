import Card from './card';
import { uuid4 } from './uuid';
import { arraySubtraction, getCombinations, last, uniqueFilter } from './arr';

class Hand {
    public readonly uuid: string;
    public readonly rank: number;
    public readonly cards: number[];
    public constructor(rank: number, cards: number[]) {
        this.rank = rank;
        this.cards = cards;
        this.uuid = uuid4();
    }

    public getCardsString(cardStrType=Card.STRING_TYPE.SHORT): string {
        return this.cards.map((a): string => (new Card(a).toString(cardStrType))).join(', ');
    }

    public toString(cardStrType=Card.STRING_TYPE.SHORT): string {
        const highStrType = Card.STRING_TYPE.LONG_VALUE;
        const value = (i: number): string => (new Card(this.cards[i])).toString(highStrType);
        const cardsStr = this.getCardsString(cardStrType);

        switch (this.rank) {
            case Hand.RANK.FIVE_OF_A_KIND:
                return `Five of a kind, ${value(0)}s (${cardsStr})`;
            case Hand.RANK.STRAIGHT_FLUSH:
                return `Straigth flush, ${value(0)} high (${cardsStr})`;
            case Hand.RANK.FOUR_OF_A_KIND:
                return `Four of a kind, ${value(0)}s (${cardsStr})`;
            case Hand.RANK.FULL_HOUSE:
                return `Full house, ${value(0)}s over ${value(3)}s (${cardsStr})`;
            case Hand.RANK.FLUSH:
                return `Flush, ${value(0)} high (${cardsStr})`;
            case Hand.RANK.STRAIGHT:
                return `Straigth, ${value(0)} high (${cardsStr})`;
            case Hand.RANK.THREE_OF_A_KIND:
                return `Three of a kind, ${value(0)}s (${cardsStr})`;
            case Hand.RANK.TWO_PAIRS:
                return `Two pairs, ${value(0)}s and ${value(2)}s (${cardsStr})`;
            case Hand.RANK.PAIR:
                return `Pair, ${value(0)}s (${cardsStr})`;
            case Hand.RANK.HIGH:
                return `${value(0).replace(/^\w/, (a: string): string => a.toUpperCase())} high (${cardsStr})`;
        }
        throw new Error('Unsupported rank value');
    }

    public static RANK = {
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
    }

    public static solve(cards: number[], num=5): Hand {
        let cardsIncluded;
        let handRank;

        /* eslint-disable no-cond-assign */
        if (cardsIncluded = Hand.isNumOfAKind(5, cards)) {
            handRank = Hand.RANK.FIVE_OF_A_KIND;
        } else if (cardsIncluded = Hand.isStraightFlush(cards, num)) {
            handRank = Hand.RANK.STRAIGHT_FLUSH;
        } else if (cardsIncluded = Hand.isNumOfAKind(4, cards)) {
            handRank = Hand.RANK.FOUR_OF_A_KIND;
        } else if (cardsIncluded = Hand.isFullHouse(cards)) {
            handRank = Hand.RANK.FULL_HOUSE;
        } else if (cardsIncluded = Hand.isFlush(cards, num)) {
            handRank = Hand.RANK.FLUSH;
        } else if (cardsIncluded = Hand.isStraight(cards, num)) {
            handRank = Hand.RANK.STRAIGHT;
        } else if (cardsIncluded = Hand.isNumOfAKind(3, cards)) {
            handRank = Hand.RANK.THREE_OF_A_KIND;
        } else if (cardsIncluded = Hand.isTwoPairs(cards)) {
            handRank = Hand.RANK.TWO_PAIRS;
        } else if (cardsIncluded = Hand.isNumOfAKind(2, cards)) {
            handRank = Hand.RANK.PAIR;
        } else {
            cardsIncluded = [];
            handRank = Hand.RANK.HIGH;
        }
        /* eslint-enable no-cond-assign */

        cardsIncluded = Hand.fillWithKickers(cardsIncluded as number[], cards);

        return new Hand(handRank, cardsIncluded);
    }

    public static solveHoldEm(tableCards: number[], handCards: number[], mustUse=0): Hand {
        if (mustUse === 0) return Hand.solve([...tableCards, ...handCards]);

        const tableCombinations = getCombinations(tableCards, tableCards.length - mustUse);
        const handCombinations = getCombinations(handCards, Math.min(handCards.length, mustUse));
        const hands = [];
        for (let i = 0; i < tableCombinations.length; i++) {
            for (let j = 0; j < handCombinations.length; j++) {
                hands.push(Hand.solve([...(tableCombinations[i]), ...(handCombinations[j])]));
            }
        }

        return Hand.max(...hands);
    }

    public static compare(a: Hand, b: Hand): number {
        let r;
        /* eslint-disable no-cond-assign */
        if ((r = b.rank - a.rank) !== 0) return r;
        for (let i = 0; i < 5; i++) {
            if ((r = Card.compare(a.cards[i], b.cards[i])) !== 0) return r;
        }
        /* eslint-enable no-cond-assign */
        return 0;
    }

    public static winners(...arr: Hand[]): Hand[] {
        const max = Hand.max(...arr);
        return arr.filter((a: Hand): boolean => (!Hand.compare(a, max)));
    }

    public static max(...arr: Hand[]): Hand {
        const max2 = (a: Hand, b: Hand): Hand => (Hand.compare(a, b) < 0 ? a : b);
        return arr.reduce((a: Hand, b: Hand): Hand => max2(a, b));
    }

    private static fillWithKickers(cardsIncluded: number[], cards: number[], num=5): number[] {
        cards = arraySubtraction(cards, cardsIncluded).sort(Card.compare);
        return [...cardsIncluded, ...cards].slice(0,num);
    }

    private static getUniqueValues(cards: number[]): number[] {
        return cards.
            map((a: number): number => Card.getValue(a)).
            filter(uniqueFilter).
            sort((a: number, b: number): number => (b - a));
    }

    public static isNumOfAKind(num: number, cards: number[]): number[] | boolean {
        const unique = Hand.getUniqueValues(cards);
        let cardsIncluded;
        for (let i = 0; i < unique.length; i++) {
            cardsIncluded = cards.filter((a: number): boolean => (Card.getValue(a) == unique[i]));
            if (cardsIncluded.length >= num) return cardsIncluded;
        }
        return false;
    }

    public static isNumOfAKindCombination(nums: number[], cards: number[]): number[] | boolean {
        const cardsIncluded = [];
        for (let i = 0; i < nums.length; i++) {
            let numOfAKind = Hand.isNumOfAKind(nums[i], arraySubtraction(cards, cardsIncluded));
            if (numOfAKind === false) return false;
            numOfAKind = numOfAKind as number[];
            cardsIncluded.push(...numOfAKind);
        }
        return cardsIncluded;
    }

    public static isStraightFlush(cards: number[], num=5): number[] | boolean {
        let flush = [];
        for (let i = 0; i < 4; i++) {
            flush = cards.filter((a: number): boolean => Card.getSuit(a) === i);
            if (flush.length < num) continue;
            const straight = Hand.isStraight(flush, num);
            if (straight) return straight;
        }
        return false;
    }

    public static isFullHouse(cards: number[]): number[] | boolean {
        return Hand.isNumOfAKindCombination([3,2], cards);
    }

    public static isFlush(cards: number[], num=5): number[] | boolean {
        for (let i = 0; i < 4; i++) {
            const suited = cards.filter((a: number): boolean => (Card.getSuit(a) == i));
            if (suited.length >= num) return suited.sort(Card.compare).slice(0,num);
        }
        return false;
    }

    public static isStraight(cards: number[], num=5): number[] | boolean {
        const unique = Hand.getUniqueValues(cards);

        if (unique.length < num) return false;
        if (unique.includes(13)) unique.push(0);

        let valuesIncluded = [unique[0]];
        for (let i = 1; i < unique.length && valuesIncluded.length < num; i++) {
            if ((last(valuesIncluded) - unique[i]) === 1) {
                valuesIncluded.push(unique[i]);
            } else {
                valuesIncluded = [unique[i]];
            }
        }
        if (valuesIncluded.length == num) {
            return valuesIncluded.map(
                (a: number): number | undefined => (
                    cards.find((b: number): boolean => (Card.getValue(b) === (a ? a : 13)))
                )
            ) as number[];
        }
        return false;
    }

    public static isTwoPairs(cards: number[]): number[] | boolean {
        return Hand.isNumOfAKindCombination([2,2], cards);
    }
}

export default Hand;
