# Standard Bid Scoring Rules

## Overview

The standard bid scoring system evaluates player bids based on accuracy, timing, and strategic positioning. This document explains the complete scoring methodology with mathematical formulas, examples, and edge cases.

## Scoring Formula

The base scoring formula combines multiple factors:

```
Total Score = Base Points × Accuracy Multiplier × Timing Multiplier × Position Bonus
```

### Components Breakdown

#### Base Points
- **Successful Bid**: 100 points
- **Partial Success**: 50 points  
- **Failed Bid**: 0 points

#### Accuracy Multiplier
Measures how close the bid was to the optimal value:

```
Accuracy Multiplier = max(0, 1 - |bid_value - optimal_value| / optimal_value)
```

Where:
- `bid_value`: The player's submitted bid
- `optimal_value`: The calculated optimal bid for the scenario
- Result range: 0.0 to 1.0

#### Timing Multiplier
Rewards faster decision-making:

```
Timing Multiplier = max(0.5, 1 - (response_time - min_time) / (max_time - min_time))
```

Where:
- `response_time`: Time taken to submit bid (seconds)
- `min_time`: Fastest possible response time (typically 1 second)
- `max_time`: Maximum allowed time (varies by game mode)
- Result range: 0.5 to 1.0

#### Position Bonus
Additional points based on final ranking:

- **1st Place**: +50 points
- **2nd Place**: +30 points  
- **3rd Place**: +10 points
- **4th+ Place**: +0 points

## Scoring Examples

### Example 1: Perfect Bid
```
Scenario: Optimal bid = $1000, Max time = 30 seconds
Player bid: $1000, Response time: 5 seconds

Base Points = 100 (successful bid)
Accuracy Multiplier = 1 - |1000 - 1000| / 1000 = 1.0
Timing Multiplier = 1 - (5 - 1) / (30 - 1) = 0.86
Position Bonus = +50 (1st place)

Total Score = 100 × 1.0 × 0.86 + 50 = 136 points
```

### Example 2: Close Bid with Slow Response
```
Scenario: Optimal bid = $500, Max time = 45 seconds
Player bid: $450, Response time: 40 seconds

Base Points = 100 (successful bid)
Accuracy Multiplier = 1 - |450 - 500| / 500 = 0.9
Timing Multiplier = max(0.5, 1 - (40 - 1) / (45 - 1)) = 0.5
Position Bonus = +10 (3rd place)

Total Score = 100 × 0.9 × 0.5 + 10 = 55 points
```

### Example 3: Poor Accuracy Bid
```
Scenario: Optimal bid = $800, Max time = 20 seconds
Player bid: $400, Response time: 8 seconds

Base Points = 50 (partial success - bid too low)
Accuracy Multiplier = 1 - |400 - 800| / 800 = 0.5
Timing Multiplier = 1 - (8 - 1) / (20 - 1) = 0.63
Position Bonus = +0 (4th place)

Total Score = 50 × 0.5 × 0.63 + 0 = 16 points
```

## Edge Cases

### Extremely Late Bids
If `response_time >= max_time`:
- Timing Multiplier = 0.1 (minimum penalty)
- Base Points reduced by 50%

### Negative or Zero Bids
- Treated as failed bids (0 base points)
- Accuracy Multiplier = 0
- Still eligible for timing scoring

### Identical Scores
When multiple players achieve identical total scores:
1. Higher accuracy multiplier wins
2. If still tied, faster response time wins
3. If still tied, earlier submission timestamp wins

### Extreme Overbids
Bids exceeding 5× the optimal value:
- Automatically classified as failed bids
- Base Points = 0
- Accuracy Multiplier capped at 0.1

## Game Mode Variations

### Speed Mode
- Max time reduced to 15 seconds
- Timing Multiplier weight increased by 50%
- Position Bonus doubled

### Precision Mode  
- Accuracy Multiplier weight increased by 25%
- Timing Multiplier minimum raised to 0.8
- Partial success threshold tightened

### Marathon Mode
- Max time extended to 120 seconds
- Position Bonus reduced by 50%
- Additional endurance bonus for consistent performance

## Scoring Tiers

Based on total accumulated score across rounds:

| Tier | Score Range | Multiplier |
|------|-------------|------------|
| Master | 1000+ | 1.2× |
| Expert | 750-999 | 1.1× |
| Advanced | 500-749 | 1.0× |
| Intermediate | 250-499 | 0.95× |
| Beginner | 0-249 | 0.9× |

## Anti-Cheating Measures

### Validation Rules
- Minimum response time: 1 second (prevents automated submissions)
- Maximum bid value: 10× optimal value (prevents spam bids)
- Response time verification against server timestamps

### Suspicious Pattern Detection
- Consistently perfect accuracy (>95% over 10+ rounds)
- Identical response times across multiple rounds
- Bids that match optimal values too frequently

Detected violations result in score penalties or disqualification.