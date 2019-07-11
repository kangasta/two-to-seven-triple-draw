import Card, {CardJSON} from './card';
import { uuid4 } from './uuid';
import { arraySubtraction, getCombinations, last, uniqueFilter } from './arr';

export interface HandJSON {
    rank: number;
    cards: CardJSON[];
    uuid?: string;
}

export enum HandRank {
    High = 0,
    Pair = 5,
    TwoPairs = 10,
    ThreeOfAKind = 15,
    Straight = 20,
    Flush = 25,
    FullHouse = 30,
    FourOfAKind = 35,
    StraightFlush = 40,
    FiveOfAKind = 45 // Requires wild support, which is not currently implemented
}

class Hand {
    public readonly uuid: string;
    public readonly rank: number;
    public readonly cards: Card[];
    public constructor(rank: number, cards: Card[], uuid?: undefined | string) {
        this.rank = rank;
        this.cards = cards;
        this.uuid = uuid ? uuid : uuid4();
    }

    public static fromJSON({rank, cards, uuid}: HandJSON): Hand {
        return new Hand(rank, cards.map(Card.fromJSON), uuid);
    }

    public static readonly Rank = HandRank;

    public getCardsString(cardStrType=Card.StringType.Short): string {
        return this.cards.map((a: Card): string => (a.toString(cardStrType))).join(', ');
    }

    public toString(cardStrType=Card.StringType.Short): string {
        const highStrType = Card.StringType.LongValue;
        const value = (i: number): string => (this.cards[i]).toString(highStrType);
        const cardsStr = this.getCardsString(cardStrType);

        switch (this.rank) {
            case Hand.Rank.FiveOfAKind:
                return `Five of a kind, ${value(0)}s (${cardsStr})`;
            case Hand.Rank.StraightFlush:
                return `Straigth flush, ${value(0)} high (${cardsStr})`;
            case Hand.Rank.FourOfAKind:
                return `Four of a kind, ${value(0)}s (${cardsStr})`;
            case Hand.Rank.FullHouse:
                return `Full house, ${value(0)}s over ${value(3)}s (${cardsStr})`;
            case Hand.Rank.Flush:
                return `Flush, ${value(0)} high (${cardsStr})`;
            case Hand.Rank.Straight:
                return `Straigth, ${value(0)} high (${cardsStr})`;
            case Hand.Rank.ThreeOfAKind:
                return `Three of a kind, ${value(0)}s (${cardsStr})`;
            case Hand.Rank.TwoPairs:
                return `Two pairs, ${value(0)}s and ${value(2)}s (${cardsStr})`;
            case Hand.Rank.Pair:
                return `Pair, ${value(0)}s (${cardsStr})`;
            case Hand.Rank.High:
                return `${value(0).replace(/^\w/, (a: string): string => a.toUpperCase())} high (${cardsStr})`;
        }
        throw new Error('Unsupported rank value');
    }

    public static solve(cards: Card[], num=5): Hand {
        let cardsIncluded;
        let handRank;

        /* eslint-disable no-cond-assign */
        if (cardsIncluded = Hand.isNumOfAKind(5, cards)) {
            handRank = Hand.Rank.FiveOfAKind;
        } else if (cardsIncluded = Hand.isStraightFlush(cards, num)) {
            handRank = Hand.Rank.StraightFlush;
        } else if (cardsIncluded = Hand.isNumOfAKind(4, cards)) {
            handRank = Hand.Rank.FourOfAKind;
        } else if (cardsIncluded = Hand.isFullHouse(cards)) {
            handRank = Hand.Rank.FullHouse;
        } else if (cardsIncluded = Hand.isFlush(cards, num)) {
            handRank = Hand.Rank.Flush;
        } else if (cardsIncluded = Hand.isStraight(cards, num)) {
            handRank = Hand.Rank.Straight;
        } else if (cardsIncluded = Hand.isNumOfAKind(3, cards)) {
            handRank = Hand.Rank.ThreeOfAKind;
        } else if (cardsIncluded = Hand.isTwoPairs(cards)) {
            handRank = Hand.Rank.TwoPairs;
        } else if (cardsIncluded = Hand.isNumOfAKind(2, cards)) {
            handRank = Hand.Rank.Pair;
        } else {
            cardsIncluded = [];
            handRank = Hand.Rank.High;
        }
        /* eslint-enable no-cond-assign */

        cardsIncluded = Hand.fillWithKickers(cardsIncluded as Card[], cards);

        return new Hand(handRank, cardsIncluded);
    }

    public static solveHoldEm(tableCards: Card[], handCards: Card[], mustUse=0): Hand {
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
        let r: number;

        if (a.cards.length !== b.cards.length) {
            throw new Error('Comparing hands with different number of cards');
        }
        /* eslint-disable no-cond-assign */
        if ((r = b.rank - a.rank) !== 0) return r;
        for (let i = 0; i < a.cards.length; i++) {
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

    private static fillWithKickers(cardsIncluded: Card[], cards: Card[], num=5): Card[] {
        cards = arraySubtraction(cards, cardsIncluded).sort(Card.compare);
        return [...cardsIncluded, ...cards].slice(0,num);
    }

    private static getUniqueValues(cards: Card[]): number[] {
        return cards.
            map((a: Card): number => a.value).
            filter(uniqueFilter).
            sort((a: number, b: number): number => (b - a));
    }

    public static isNumOfAKind(num: number, cards: Card[]): Card[] | boolean {
        const unique = Hand.getUniqueValues(cards);
        let cardsIncluded;
        for (let i = 0; i < unique.length; i++) {
            cardsIncluded = cards.filter((a: Card): boolean => (a.value == unique[i]));
            if (cardsIncluded.length >= num) return cardsIncluded;
        }
        return false;
    }

    public static isNumOfAKindCombination(nums: number[], cards: Card[]): Card[] | boolean {
        const cardsIncluded = [];
        for (let i = 0; i < nums.length; i++) {
            let numOfAKind = Hand.isNumOfAKind(nums[i], arraySubtraction(cards, cardsIncluded));
            if (numOfAKind === false) return false;
            numOfAKind = numOfAKind as Card[];
            cardsIncluded.push(...numOfAKind);
        }
        return cardsIncluded;
    }

    public static isStraightFlush(cards: Card[], num=5): Card[] | boolean {
        let flush = [];
        for (let i = 0; i < 4; i++) {
            flush = cards.filter((a: Card): boolean => a.suit === i);
            if (flush.length < num) continue;
            const straight = Hand.isStraight(flush, num);
            if (straight) return straight;
        }
        return false;
    }

    public static isFullHouse(cards: Card[]): Card[] | boolean {
        return Hand.isNumOfAKindCombination([3,2], cards);
    }

    public static isFlush(cards: Card[], num=5): Card[] | boolean {
        for (let i = 0; i < 4; i++) {
            const suited = cards.filter((a: Card): boolean => (a.suit == i));
            if (suited.length >= num) return suited.sort(Card.compare).slice(0,num);
        }
        return false;
    }

    public static isStraight(cards: Card[], num=5): Card[] | boolean {
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
                (a: number): Card | undefined => (
                    cards.find((b: Card): boolean => (b.value === (a ? a : 13)))
                )
            ) as Card[];
        }
        return false;
    }

    public static isTwoPairs(cards: Card[]): Card[] | boolean {
        return Hand.isNumOfAKindCombination([2,2], cards);
    }
}

export default Hand;
