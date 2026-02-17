# Zero Bid Scoring Rules

## Overview

Zero bid scoring is a special scoring mechanism that applies when a player bids exactly zero in a round. This scoring system differs significantly from normal scoring rules and uses a unique calculation formula based on the round size and other players' performance.

## When Zero Bid Scoring Applies

Zero bid scoring is used **only** when:
- A player bids exactly 0 (zero) for a round
- The round has been completed and all tricks have been played

## Distinction from Normal Scoring

### Normal Scoring Rules
In standard scoring, players earn points based on whether they make their bid exactly:
- **Success**: If tricks taken = bid, player earns `bid + 10` points
- **Failure**: If tricks taken ≠ bid, player earns only the number of tricks taken

### Zero Bid Scoring Rules
When a player bids zero, they use a completely different calculation:
- **Success**: If player takes 0 tricks, they earn `round_size + 10` points
- **Failure**: If player takes any tricks, they earn `-(round_size + 10)` points

## Zero Bid Scoring Formula

```
If bid = 0:
  If tricks_taken = 0:
    score = round_size + 10  (positive points)
  Else:
    score = -(round_size + 10)  (negative points)
```

Where `round_size` is the total number of cards dealt to each player in that round.

## Examples

### Example 1: 3-Card Round (Round Size = 3)
**Scenario**: Player bids 0 in a 3-card round

- **Success Case**: Player takes 0 tricks
  - Score = 3 + 10 = **+13 points**
  
- **Failure Case**: Player takes 1, 2, or 3 tricks
  - Score = -(3 + 10) = **-13 points**

### Example 2: 7-Card Round (Round Size = 7)
**Scenario**: Player bids 0 in a 7-card round

- **Success Case**: Player takes 0 tricks
  - Score = 7 + 10 = **+17 points**
  
- **Failure Case**: Player takes any number of tricks (1-7)
  - Score = -(7 + 10) = **-17 points**

### Example 3: 1-Card Round (Round Size = 1)
**Scenario**: Player bids 0 in a 1-card round

- **Success Case**: Player takes 0 tricks
  - Score = 1 + 10 = **+11 points**
  
- **Failure Case**: Player takes 1 trick
  - Score = -(1 + 10) = **-11 points**

## Key Points

1. **Binary Outcome**: Zero bids result in either significant positive or negative points - there's no middle ground
2. **High Risk/High Reward**: The larger the round size, the greater the potential gain or loss
3. **All-or-Nothing**: Taking even one trick when bidding zero results in the full negative penalty
4. **Round Size Dependency**: The scoring magnitude scales with the number of cards in the round

## Strategic Considerations

- Zero bids become more valuable (and risky) in larger rounds
- Success requires avoiding all tricks, which can be challenging with more cards
- The potential swing is always `2 × (round_size + 10)` points between success and failure
- Consider hand strength, trump suit, and other players' likely bids before choosing zero

## Comparison Chart

| Round Size | Zero Bid Success | Zero Bid Failure | Point Swing |
|------------|------------------|------------------|-------------|
| 1          | +11              | -11              | 22          |
| 2          | +12              | -12              | 24          |
| 3          | +13              | -13              | 26          |
| 4          | +14              | -14              | 28          |
| 5          | +15              | -15              | 30          |
| 6          | +16              | -16              | 32          |
| 7          | +17              | -17              | 34          |

This scoring system ensures that zero bids remain a significant strategic decision throughout the game, with the stakes increasing as round sizes grow.