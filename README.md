# 2-to-7-triple-draw

[![Build Status](https://travis-ci.org/kangasta/2-to-7-triple-draw.svg?branch=master)](https://travis-ci.org/kangasta/2-to-7-triple-draw)

__Work in progress.__ Poker hand solver.

## Documentation

### Card

Cards are passed around as integers. The suit of the cards is defined as `Math.floor(num/13) % 4`. The output integer maps to card suit as:

Integer | Suit
------- | -------
   0    |  ♥ Hearts
   1    |  ♠ Spades
   2    |  ♦ Diamonds
   3    |  ♣ Clubs

The value of the card is defined as `num % 13 || low_ace ? 0 : 13`. This results to value being represented as one smaller than it would be in an actual playing card. Aces are high by default.

The `Card` class provides static methods `getSuit(num)`, `getValue(num)`, `compare(a, b)`. The `compare(a, b)` method can be used to sort cards from high to low.

### Hand

Hand provides `solve(cards, num=5)`, `solveHoldEm(table_cards, hand_cards, must_use=0)`, and `compare(a, b)` functions to solve and compare poker hands. `solveHoldEm(...)` is a helper function to support games where N number of cards from players hand cards must be used, such as Omaha hold em. Hand is passed in to the solver as a array of numbers. Solver returns object with fields for rank of the hand and cards included in the hand. For example, ace to five straight-flush would result to:

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

The compare function takes in output objects from `solve(...)` function.
