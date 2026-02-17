# Bid Collection API Documentation

## Overview

The Bid Collection API provides endpoints for managing multiplayer bidding games, including game creation, player management, bid submission, and real-time synchronization.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, the API uses session-based authentication with player names. Future versions will implement token-based authentication.

## Endpoints

### Game Management

#### Create Game

Creates a new game room.

```http
POST /games
```

**Request Body:**
```json
{
  "hostName": "PlayerOne",
  "maxPlayers": 4,
  "roundDuration": 30,
  "maxRounds": 5
}
```

**Response:**
```json
{
  "success": true,
  "gameId": "game_123456",
  "hostId": "player_789",
  "settings": {
    "maxPlayers": 4,
    "roundDuration": 30,
    "maxRounds": 5
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "hostName": "PlayerOne",
    "maxPlayers": 4,
    "roundDuration": 30,
    "maxRounds": 5
  }'
```

#### Get Game Status

Retrieves current game state and player information.

```http
GET /games/:gameId
```

**Response:**
```json
{
  "success": true,
  "game": {
    "id": "game_123456",
    "status": "waiting", // "waiting" | "active" | "bidding" | "evaluating" | "completed"
    "currentRound": 1,
    "maxRounds": 5,
    "players": [
      {
        "id": "player_789",
        "name": "PlayerOne",
        "score": 150,
        "isHost": true,
        "connected": true
      }
    ],
    "settings": {
      "maxPlayers": 4,
      "roundDuration": 30
    }
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/games/game_123456
```

### Player Management

#### Join Game

Adds a player to an existing game.

```http
POST /games/:gameId/join
```

**Request Body:**
```json
{
  "playerName": "PlayerTwo"
}
```

**Response:**
```json
{
  "success": true,
  "playerId": "player_790",
  "gameStatus": "waiting",
  "playerCount": 2
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/games/game_123456/join \
  -H "Content-Type: application/json" \
  -d '{"playerName": "PlayerTwo"}'
```

#### Leave Game

Removes a player from the game.

```http
DELETE /games/:gameId/players/:playerId
```

**Response:**
```json
{
  "success": true,
  "message": "Player removed successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/games/game_123456/players/player_790
```

### Bid Management

#### Submit Bid

Submits a bid for the current round.

```http
POST /games/:gameId/bids
```

**Request Body:**
```json
{
  "playerId": "player_789",
  "bidAmount": 50,
  "bidType": "standard", // "standard" | "premium" | "wildcard"
  "targetResource": "energy" // Optional: for specific bid types
}
```

**Response:**
```json
{
  "success": true,
  "bidId": "bid_456789",
  "status": "submitted",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/games/game_123456/bids \
  -H "Content-Type: application/json" \
  -d '{
    "playerId": "player_789",
    "bidAmount": 50,
    "bidType": "standard"
  }'
```

#### Get Round Bids

Retrieves all bids for the current round (only available after bidding phase ends).

```http
GET /games/:gameId/rounds/:roundNumber/bids
```

**Response:**
```json
{
  "success": true,
  "roundNumber": 1,
  "bids": [
    {
      "bidId": "bid_456789",
      "playerId": "player_789",
      "playerName": "PlayerOne",
      "bidAmount": 50,
      "bidType": "standard",
      "isWinner": true,
      "points": 25
    }
  ],
  "winners": ["player_789"]
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/games/game_123456/rounds/1/bids
```

### Game Control

#### Start Game

Initiates the game (host only).

```http
POST /games/:gameId/start
```

**Request Body:**
```json
{
  "hostId": "player_789"
}
```

**Response:**
```json
{
  "success": true,
  "status": "active",
  "currentRound": 1,
  "roundStartTime": "2024-01-15T10:30:00.000Z",
  "roundEndTime": "2024-01-15T10:30:30.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/games/game_123456/start \
  -H "Content-Type: application/json" \
  -d '{"hostId": "player_789"}'
```

## Bid Validation Rules

### Server-Side Validation

1. **Bid Amount Validation**
   - Must be a positive number
   - Cannot exceed player's available resources
   - Minimum bid: 1 unit
   - Maximum bid: Player's total resources

2. **Timing Validation**
   - Bids only accepted during "bidding" phase
   - Must be submitted before round timer expires
   - No bid modifications after submission

3. **Player Validation**
   - Player must be in the game
   - Player must be connected
   - One bid per player per round

4. **Bid Type Validation**
   - Standard bids: No special requirements
   - Premium bids: Require 2x resource cost
   - Wildcard bids: Limited to 1 per game per player

### Client-Side Validation

The frontend performs preliminary validation before API calls:

```javascript
const validateBid = (bidAmount, playerResources, bidType) => {
  const errors = [];
  
  if (!bidAmount || bidAmount <= 0) {
    errors.push("Bid amount must be positive");
  }
  
  if (bidAmount > playerResources) {
    errors.push("Insufficient resources");
  }
  
  if (bidType === "premium" && bidAmount * 2 > playerResources) {
    errors.push("Premium bids require double resources");
  }
  
  return errors;
};
```

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_BID_AMOUNT",
    "message": "Bid amount exceeds available resources",
    "details": {
      "bidAmount": 100,
      "availableResources": 50
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `GAME_NOT_FOUND` | Game ID does not exist |
| `INVALID_PLAYER` | Player not in game or invalid player ID |
| `INVALID_BID_AMOUNT` | Bid amount validation failed |
| `BIDDING_CLOSED` | Bid submitted outside bidding phase |
| `INSUFFICIENT_RESOURCES` | Player lacks required resources |
| `DUPLICATE_BID` | Player already submitted bid for round |
| `GAME_FULL` | Maximum players reached |
| `UNAUTHORIZED` | Action requires host privileges |

## WebSocket Events

### Client to Server Events

```javascript
// Join game room for real-time updates
socket.emit('join-game', { gameId: 'game_123456', playerId: 'player_789' });

// Submit bid with real-time confirmation
socket.emit('submit-bid', {
  gameId: 'game_123456',
  playerId: 'player_789',
  bidAmount: 50
});
```

### Server to Client Events

```javascript
// Game state updates
socket.on('game-updated', (gameState) => {
  // Handle game state changes
});

// Bid phase transitions
socket.on('bidding-started', (roundInfo) => {
  // Round started, enable bid submission
});

socket.on('bidding-ended', (results) => {
  // Round ended, show results
});

// Player events
socket.on('player-joined', (playerInfo) => {
  // New player joined game
});

socket.on('player-left', (playerInfo) => {
  // Player left game
});
```

## Rate Limiting

API calls are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per minute per IP
- **Bid submission**: 1 bid per round per player
- **Game creation**: 5 games per hour per IP

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Multiplayer Synchronization

### Game State Synchronization

All game state changes are synchronized across clients:

1. **Player Actions**: Join/leave events broadcast immediately
2. **Bid Submissions**: Confirmed via WebSocket before API response
3. **Phase Transitions**: All clients receive simultaneous updates
4. **Timer Synchronization**: Server-authoritative countdown timers

### Conflict Resolution

- **Simultaneous Bids**: Server timestamp determines order
- **Connection Issues**: Automatic reconnection with state sync
- **Host Disconnection**: Automatic host transfer to next player

### Example Synchronization Flow

```
Client A submits bid → Server validates → Database update → 
Broadcast to all clients → UI updates across all players
```

This ensures all players see consistent game state throughout the bidding process.