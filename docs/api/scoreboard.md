# Scoreboard API Documentation

## Overview
The scoreboard API provides endpoints to manage and retrieve game scoreboards with real-time updates. It supports both REST API calls and WebSocket connections for live score updates.

## Endpoints

### GET /api/scoreboard
Retrieves the current scoreboard data.

#### Request
```bash
curl -X GET "https://api.example.com/api/scoreboard" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "scoreboard-123",
    "gameId": "game-456",
    "title": "Championship Finals",
    "teams": [
      {
        "id": "team-1",
        "name": "Team Alpha",
        "score": 15,
        "logo": "https://example.com/logos/alpha.png"
      },
      {
        "id": "team-2",
        "name": "Team Beta",
        "score": 12,
        "logo": "https://example.com/logos/beta.png"
      }
    ],
    "gameTime": "45:30",
    "period": "2nd Half",
    "status": "live",
    "lastUpdated": "2023-12-07T15:30:45Z"
  }
}
```

### POST /api/scoreboard
Creates a new scoreboard.

#### Request
```bash
curl -X POST "https://api.example.com/api/scoreboard" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "gameId": "game-789",
    "title": "Semi-Final Match",
    "teams": [
      {
        "name": "Team Gamma",
        "logo": "https://example.com/logos/gamma.png"
      },
      {
        "name": "Team Delta",
        "logo": "https://example.com/logos/delta.png"
      }
    ]
  }'
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "scoreboard-789",
    "gameId": "game-789",
    "title": "Semi-Final Match",
    "teams": [
      {
        "id": "team-3",
        "name": "Team Gamma",
        "score": 0,
        "logo": "https://example.com/logos/gamma.png"
      },
      {
        "id": "team-4",
        "name": "Team Delta",
        "score": 0,
        "logo": "https://example.com/logos/delta.png"
      }
    ],
    "gameTime": "00:00",
    "period": "Pre-Game",
    "status": "pending",
    "lastUpdated": "2023-12-07T16:00:00Z"
  }
}
```

### PUT /api/scoreboard/{id}/score
Updates team scores on a specific scoreboard.

#### Request
```bash
curl -X PUT "https://api.example.com/api/scoreboard/scoreboard-123/score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "teamId": "team-1",
    "score": 16,
    "gameTime": "47:15",
    "period": "2nd Half"
  }'
```

#### Response
```json
{
  "success": true,
  "data": {
    "scoreUpdated": true,
    "newScore": 16,
    "teamId": "team-1",
    "lastUpdated": "2023-12-07T15:32:15Z"
  }
}
```

### GET /api/scoreboard/{id}
Retrieves a specific scoreboard by ID.

#### Request
```bash
curl -X GET "https://api.example.com/api/scoreboard/scoreboard-123" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Real-Time Updates

### WebSocket Connection
For real-time scoreboard updates, connect to the WebSocket endpoint:

```javascript
const ws = new WebSocket('wss://api.example.com/ws/scoreboard/scoreboard-123');

ws.onopen = function() {
  console.log('Connected to scoreboard updates');
};

ws.onmessage = function(event) {
  const update = JSON.parse(event.data);
  console.log('Score update:', update);
};
```

#### WebSocket Message Format
```json
{
  "type": "score_update",
  "scoreboardId": "scoreboard-123",
  "teamId": "team-1",
  "newScore": 17,
  "gameTime": "50:22",
  "period": "2nd Half",
  "timestamp": "2023-12-07T15:35:22Z"
}
```

### Polling Implementation
Alternative to WebSocket for environments that don't support it:

```javascript
// Poll every 5 seconds for updates
const pollScoreboard = async (scoreboardId) => {
  try {
    const response = await fetch(`/api/scoreboard/${scoreboardId}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Polling error:', error);
  }
};

setInterval(() => {
  pollScoreboard('scoreboard-123').then(updateUI);
}, 5000);
```

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "SCOREBOARD_NOT_FOUND",
    "message": "Scoreboard with ID 'scoreboard-123' not found"
  }
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid team ID provided",
    "details": {
      "field": "teamId",
      "value": "invalid-team-id"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API token"
  }
}
```

## Rate Limits
- **GET requests**: 100 requests per minute per API key
- **POST/PUT requests**: 30 requests per minute per API key
- **WebSocket connections**: 10 concurrent connections per API key

## Authentication
All API requests require a valid API token passed in the Authorization header:
```
Authorization: Bearer YOUR_API_TOKEN
```

Contact your system administrator to obtain an API token.