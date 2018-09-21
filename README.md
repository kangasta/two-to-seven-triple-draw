# two-to-seven-triple-draw

[![Build Status](https://travis-ci.org/kangasta/two-to-seven-triple-draw.svg?branch=master)](https://travis-ci.org/kangasta/two-to-seven-triple-draw)

Poker hand solver. Supports:
- solving the best hand from up to nine cards.
- solving hands from single array input.
- solving hands from table and hand card array inputs when N cards from the hand array must be used to form the hand.
- comparing hands.
- finding the best hand from given inputs. Similarly than `Math.max(...)`.

## Installation

```bash
npm i two-to-seven-triple-draw
```

## Usage

```js
Hand = require('two-to-seven-triple-draw').Hand;

// Solve five card hand
const acequads = Hand.solve([0, 13, 26, 39, 2]);

// Solve Omaha hold em hand
const fullhouse = Hand.solveHoldEm([0, 13, 26, 39, 2], [25, 38, 11, 24], 2);

// Get best hand
console.log(Hand.max(acequads, fullhouse));
```

## Documentation

This package provides two classes: Card and Hand. Card class implements logic for comparing and handling cards, which are passed around as integers. Hand class implements logit for comparing and solving poker hands, which are created from arrays of integers.

### Card

Card provides static methods `Card.getSuit(num)`, `Card.getValue(num)`, `Card.compare(a, b)`. The `Card.compare(...)` method can be used to sort cards from high to low.

Cards are passed around as integers. The suit of the cards is defined as `Math.floor(num/13) % 4`. The output integer maps to card suit as:

Integer | Suit
------- | -------
   0    |  ♥ Hearts
   1    |  ♠ Spades
   2    |  ♦ Diamonds
   3    |  ♣ Clubs

The value of the card is defined as `num % 13 || low_ace ? 0 : 13`. This results to value being represented as one smaller than it would be in an actual playing card. Aces are high by default.

### Hand

Hand provides `Hand.solve(cards, num=5)`, `Hand.solveHoldEm(table_cards, hand_cards, must_use=0)`, `Hand.compare(a, b)`, and `Hand.max([hand1[, hand2[, ...]]])` functions to solve and compare poker hands. `Hand.solveHoldEm(...)` is a helper function to support games where N number of cards from players hand cards must be used, such as Omaha hold em. Hand is passed in to the solver as a array of numbers. Solver returns object with fields for rank of the hand and cards included in the hand. For example, ace to five straight-flush would result to:

```json
{
	"rank": 45,
	"cards": [0, 4, 3, 2, 1]
}
```

where the number for hand rank is the one defined in `Hand.RANK`:

Number | Hand
------ | ------------
   45  |  Five of a kind
   40  |  Straight flush
   35  |  Four of a kind
   30  |  Full house
   25  |  Flush
   20  |  Straight
   15  |  Three of a kind
   10  |  Two pairs
   5   |  Pair
   0   |  High

The `Hand.compare(...)` function takes in two output objects from `Hand.solve(...)` function and returns a value, that when passed to `Array.prototype.sort(...)` would sort the array from the best to the worst hand. The `Hand.max(...)` function return the best of the input hands and is used similarly to `Math.max(...)`.
