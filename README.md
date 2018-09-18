# 2-to-7-triple-draw

[![Build Status](https://travis-ci.org/kangasta/2-to-7-triple-draw.svg?branch=master)](https://travis-ci.org/kangasta/2-to-7-triple-draw)

__Work in progress.__ Poker hand solver.

## Documentation

### Card

Cards are passed around as integers. The suit of the cards is defined as `Math.floor(num/13) % 4`. The output integer maps to card suit as:

Integer |     | Suit
------- | --- | ----
   0    |  ♥  | Hearts
   1    |  ♠  | Spades
   2    |  ♦  | Diamonds
   3    |  ♣  | Clubs

The value of the card is defined as `num % 13 || low_ace ? 0 : 13`. This results to value being represented as one smaller than it would be in an actual playing card. Aces are high by default.

The `Card` class provides static methods `getSuit(num)`, `getValue(num)`, `compare(a, b)`. The `compare(a, b)` method can be used to sort cards from high to low.

### Hand