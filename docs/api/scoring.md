# Scoring API Documentation

## Overview

The Scoring API provides endpoints and functions for calculating, retrieving, and managing bid scores in the game system.

## Core Functions

### calculateBidScore()

Calculates the total score for a single bid submission.

#### Signature
```javascript
function calculateBidScore(bid, scenario, timing, position) {
  // Implementation
}
```

#### Parameters
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `bid` | `BidObject` | Player's bid submission | Yes |
| `scenario` | `ScenarioObject` | Game scenario data | Yes |
| `timing` | `TimingObject` | Response timing data | Yes |
| `position` | `number` | Final ranking position (1-based) | No |

#### BidObject Structure
```typescript
interface BidObject {
  playerId: string;
  value: number;
  submittedAt: Date;
  roundId: string;
}
```

#### ScenarioObject Structure
```typescript
interface ScenarioObject {
  id: string;
  optimalValue: number;
  maxResponseTime: number;
  gameMode: 'standard' | 'speed' | 'precision' | 'marathon';
}
```

#### TimingObject Structure
```typescript
interface TimingObject {
  startTime: Date;
  endTime: Date;
  responseTime: number; // milliseconds
}
```

#### Return Value
```typescript
interface ScoreResult {
  totalScore: number;
  breakdown: {
    basePoints: number;
    accuracyMultiplier: number;
    timingMultiplier: number;
    positionBonus: number;
  };
  tier: string;
  isValid: boolean;
}
```

#### Example Usage
```javascript
const bid = {
  playerId: 'player123',
  value: 850,
  submittedAt: new Date('2023-10-15T10:30:00Z'),
  roundId: 'round456'
};

const scenario = {
  id: 'scenario789',
  optimalValue: 900,
  maxResponseTime: 30000,
  gameMode: 'standard'
};

const timing = {
  startTime: new Date('2023-10-15T10:29:55Z'),
  endTime: new Date('2023-10-15T10:30:00Z'),
  responseTime: 5000
};

const result = calculateBidScore(bid, scenario, timing, 2);
console.log(result);
// Output: { totalScore: 89, breakdown: {...}, tier: 'Advanced', isValid: true }
```

### validateBid()

Validates a bid submission against game rules.

#### Signature
```javascript
function validateBid(bid, scenario) {
  // Implementation
}
```

#### Parameters
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `bid` | `BidObject` | Bid to validate | Yes |
| `scenario` | `ScenarioObject` | Current scenario | Yes |

#### Return Value
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

#### Validation Rules
- Bid value must be positive
- Response time must be >= 1 second
- Bid value must be <= 10× optimal value
- Submission must be within time limit

### getRoundScores()

Retrieves scores for all players in a specific round.

#### Signature
```javascript
function getRoundScores(roundId) {
  // Implementation
}
```

#### Parameters
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `roundId` | `string` | Round identifier | Yes |

#### Return Value
```typescript
interface RoundScores {
  roundId: string;
  scores: PlayerScore[];
  leaderboard: PlayerScore[];
  statistics: RoundStatistics;
}

interface PlayerScore {
  playerId: string;
  score: number;
  rank: number;
  bid: BidObject;
  timing: TimingObject;
}

interface RoundStatistics {
  averageScore: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  totalPlayers: number;
}
```

## REST API Endpoints

### POST /api/scoring/calculate

Calculate score for a bid submission.

#### Request Body
```json
{
  "bid": {
    "playerId": "player123",
    "value": 750,
    "submittedAt": "2023-10-15T10:30:00Z",
    "roundId": "round456"
  },
  "scenario": {
    "id": "scenario789",
    "optimalValue": 800,
    "maxResponseTime": 30000,
    "gameMode": "standard"
  },
  "timing": {
    "startTime": "2023-10-15T10:29:55Z",
    "endTime": "2023-10-15T10:30:00Z",
    "responseTime": 5000
  },
  "position": 1
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "totalScore": 124,
    "breakdown": {
      "basePoints": 100,
      "accuracyMultiplier": 0.94,
      "timingMultiplier": 0.86,
      "positionBonus": 50
    },
    "tier": "Expert",
    "isValid": true
  }
}
```

### GET /api/scoring/round/{roundId}

Retrieve scores for a specific round.

#### Response
```json
{
  "success": true,
  "data": {
    "roundId": "round456",
    "scores": [
      {
        "playerId": "player123",
        "score": 124,
        "rank": 1,
        "bid": { /* BidObject */ },
        "timing": { /* TimingObject */ }
      }
    ],
    "leaderboard": [/* Sorted by rank */],
    "statistics": {
      "averageScore": 87.5,
      "medianScore": 92,
      "highestScore": 124,
      "lowestScore": 23,
      "totalPlayers": 8
    }
  }
}
```

### GET /api/scoring/player/{playerId}/history

Retrieve scoring history for a specific player.

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | `number` | Number of records to return | 50 |
| `offset` | `number` | Number of records to skip | 0 |
| `gameMode` | `string` | Filter by game mode | all |

#### Response
```json
{
  "success": true,
  "data": {
    "playerId": "player123",
    "totalGames": 156,
    "averageScore": 89.3,
    "currentTier": "Expert",
    "history": [
      {
        "roundId": "round456",
        "score": 124,
        "rank": 1,
        "gameMode": "standard",
        "playedAt": "2023-10-15T10:30:00Z"
      }
    ]
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_BID",
    "message": "Bid value must be positive",
    "details": {
      "field": "bid.value",
      "value": -100,
      "constraint": "positive_number"
    }
  }
}
```

### Common Error Codes
| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_BID` | Bid validation failed | 400 |
| `ROUND_NOT_FOUND` | Round doesn't exist | 404 |
| `PLAYER_NOT_FOUND` | Player doesn't exist | 404 |
| `SCORING_ERROR` | Internal scoring calculation error | 500 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |

## Rate Limits

- Calculate score: 100 requests per minute per IP
- Get round scores: 50 requests per minute per IP  
- Get player history: 30 requests per minute per IP

## SDK Examples

### JavaScript/Node.js
```javascript
const ScoringAPI = require('@game/scoring-api');

const client = new ScoringAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.yourgame.com'
});

// Calculate score
const score = await client.calculateScore(bid, scenario, timing, position);

// Get round scores
const roundData = await client.getRoundScores('round123');

// Get player history
const history = await client.getPlayerHistory('player456', { limit: 20 });
```

### Python
```python
from game_scoring import ScoringClient

client = ScoringClient(
    api_key='your-api-key',
    base_url='https://api.yourgame.com'
)

# Calculate score
score = client.calculate_score(bid, scenario, timing, position)

# Get round scores  
round_data = client.get_round_scores('round123')

# Get player history
history = client.get_player_history('player456', limit=20)
```

## Testing

### Unit Test Example
```javascript
describe('calculateBidScore', () => {
  test('perfect bid returns maximum score', () => {
    const bid = { playerId: 'test', value: 1000, submittedAt: new Date(), roundId: 'test' };
    const scenario = { id: 'test', optimalValue: 1000, maxResponseTime: 30000, gameMode: 'standard' };
    const timing = { startTime: new Date(Date.now() - 5000), endTime: new Date(), responseTime: 5000 };
    
    const result = calculateBidScore(bid, scenario, timing, 1);
    
    expect(result.totalScore).toBe(136);
    expect(result.breakdown.accuracyMultiplier).toBe(1.0);
    expect(result.isValid).toBe(true);
  });
});
```