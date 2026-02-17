# Scoreboard Component Documentation

## Overview
The Scoreboard component is a React component that displays live game scores with real-time updates. It supports both WebSocket and polling mechanisms for live data updates and offers extensive customization options.

## Installation
```bash
npm install @your-org/scoreboard-component
```

## Basic Usage
```javascript
import React from 'react';
import { Scoreboard } from '@your-org/scoreboard-component';

function App() {
  return (
    <div>
      <Scoreboard
        scoreboardId="scoreboard-123"
        apiEndpoint="https://api.example.com"
        apiToken="your-api-token"
      />
    </div>
  );
}
```

## Props Reference

### Required Props
| Prop | Type | Description |
|------|------|-------------|
| `scoreboardId` | `string` | Unique identifier for the scoreboard |
| `apiEndpoint` | `string` | Base URL for the API endpoint |

### Optional Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiToken` | `string` | `undefined` | Authentication token for API requests |
| `updateMode` | `'websocket' \| 'polling'` | `'websocket'` | Method for receiving real-time updates |
| `pollingInterval` | `number` | `5000` | Polling interval in milliseconds (when using polling mode) |
| `showGameTime` | `boolean` | `true` | Whether to display the game timer |
| `showPeriod` | `boolean` | `true` | Whether to display the current period |
| `autoRefresh` | `boolean` | `true` | Enable automatic score updates |
| `theme` | `'light' \| 'dark' \| 'custom'` | `'light'` | Visual theme for the component |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Component size variant |
| `onScoreUpdate` | `function` | `undefined` | Callback fired when scores update |
| `onError` | `function` | `undefined` | Callback fired when errors occur |
| `className` | `string` | `undefined` | Additional CSS classes |
| `customStyles` | `object` | `{}` | Custom style overrides |

## Advanced Usage Examples

### With WebSocket Updates
```javascript
import React, { useState } from 'react';
import { Scoreboard } from '@your-org/scoreboard-component';

function LiveGamePage() {
  const [isConnected, setIsConnected] = useState(false);

  const handleScoreUpdate = (update) => {
    console.log('New score:', update);
    // Handle score updates
  };

  const handleError = (error) => {
    console.error('Scoreboard error:', error);
  };

  return (
    <Scoreboard
      scoreboardId="game-final-2023"
      apiEndpoint="https://api.example.com"
      apiToken="your-secure-token"
      updateMode="websocket"
      showGameTime={true}
      showPeriod={true}
      theme="dark"
      size="large"
      onScoreUpdate={handleScoreUpdate}
      onError={handleError}
    />
  );
}
```

### With Polling Updates
```javascript
import React from 'react';
import { Scoreboard } from '@your-org/scoreboard-component';

function ReliableScoreboard() {
  return (
    <Scoreboard
      scoreboardId="scoreboard-456"
      apiEndpoint="https://api.example.com"
      updateMode="polling"
      pollingInterval={3000} // Poll every 3 seconds
      theme="light"
      size="medium"
      autoRefresh={true}
    />
  );
}
```

### Custom Styling
```javascript
import React from 'react';
import { Scoreboard } from '@your-org/scoreboard-component';

function CustomScoreboard() {
  const customStyles = {
    container: {
      backgroundColor: '#f0f0f0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    teamName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    },
    score: {
      fontSize: '32px',
      color: '#e74c3c'
    },
    gameInfo: {
      fontSize: '14px',
      color: '#666'
    }
  };

  return (
    <Scoreboard
      scoreboardId="custom-board"
      apiEndpoint="https://api.example.com"
      theme="custom"
      customStyles={customStyles}
      className="my-custom-scoreboard"
    />
  );
}
```

## Real-Time Update Implementation

### WebSocket Mode
When `updateMode="websocket"`, the component automatically establishes a WebSocket connection:

```javascript
// Internal implementation (for reference)
const connectWebSocket = (scoreboardId, apiEndpoint) => {
  const ws = new WebSocket(`${apiEndpoint}/ws/scoreboard/${scoreboardId}`);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    setConnectionStatus('connected');
  };
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    handleScoreUpdate(update);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError?.(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
    setConnectionStatus('disconnected');
    // Attempt to reconnect after 5 seconds
    setTimeout(() => connectWebSocket(scoreboardId, apiEndpoint), 5000);
  };
};
```

### Polling Mode
When `updateMode="polling"`, the component uses intervals to fetch updates:

```javascript
// Internal implementation (for reference)
const startPolling = (scoreboardId, apiEndpoint, interval) => {
  const pollData = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/api/scoreboard/${scoreboardId}`);
      const data = await response.json();
      updateScoreboardData(data.data);
    } catch (error) {
      onError?.(error);
    }
  };
  
  // Initial fetch
  pollData();
  
  // Set up interval
  const intervalId = setInterval(pollData, interval);
  
  return () => clearInterval(intervalId);
};
```

## Styling Customization

### Theme Options

#### Light Theme (Default)
```css
.scoreboard-light {
  background: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
}
```

#### Dark Theme
```css
.scoreboard-dark {
  background: #2c2c2c;
  color: #ffffff;
  border: 1px solid #555555;
}
```

### Size Variants

#### Small
- Container: 300px width
- Team names: 14px font size
- Scores: 24px font size

#### Medium (Default)
- Container: 450px width
- Team names: 16px font size
- Scores: 32px font size

#### Large
- Container: 600px width
- Team names: 20px font size
- Scores: 48px font size

### Custom CSS Classes
You can override styles using CSS classes:

```css
.my-custom-scoreboard {
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.my-custom-scoreboard .team-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.my-custom-scoreboard .score-display {
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 2px;
}
```

## Event Callbacks

### onScoreUpdate
Called whenever the scoreboard data updates:

```javascript
const handleScoreUpdate = (update) => {
  // update object contains:
  // {
  //   scoreboardId: string,
  //   teams: Array,
  //   gameTime: string,
  //   period: string,
  //   status: string,
  //   timestamp: string
  // }
  console.log('Score updated:', update);
};
```

### onError
Called when errors occur:

```javascript
const handleError = (error) => {
  // error object contains:
  // {
  //   type: 'connection' | 'api' | 'parsing',
  //   message: string,
  //   details?: any
  // }
  console.error('Scoreboard error:', error);
  
  // Handle different error types
  switch (error.type) {
    case 'connection':
      // Handle connection issues
      break;
    case 'api':
      // Handle API errors
      break;
    case 'parsing':
      // Handle data parsing errors
      break;
  }
};
```

## Accessibility Features
The Scoreboard component includes built-in accessibility features:

- Semantic HTML structure with proper ARIA labels
- Screen reader announcements for score updates
- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion support for animations

```javascript
<Scoreboard
  scoreboardId="accessible-board"
  apiEndpoint="https://api.example.com"
  // Screen reader will announce score changes
  announceUpdates={true}
  // Respect user's motion preferences
  respectMotionPrefs={true}
/>
```

## Performance Considerations

### Connection Management
- WebSocket connections are automatically managed with reconnection logic
- Polling intervals are cleared when component unmounts
- Multiple instances share connections when possible

### Data Optimization
- Component only re-renders when actual score data changes
- Implements React.memo for performance optimization
- Debounces rapid updates to prevent excessive re-renders

### Memory Management
```javascript
// Component automatically handles cleanup
useEffect(() => {
  // Connection setup
  const cleanup = setupConnection();
  
  return () => {
    // Cleanup on unmount
    cleanup();
  };
}, [scoreboardId]);
```

## Troubleshooting

### Common Issues

**WebSocket Connection Fails**
- Check if WebSocket endpoint is accessible
- Verify API token has WebSocket permissions
- Try switching to polling mode as fallback

**Scores Not Updating**
- Verify scoreboardId exists in the API
- Check network connectivity
- Ensure API token is valid and not expired

**Styling Issues**
- Check CSS specificity when overriding styles
- Ensure custom theme files are properly imported
- Verify CSS-in-JS object syntax for customStyles

### Debug Mode
Enable debug logging:

```javascript
<Scoreboard
  scoreboardId="debug-board"
  apiEndpoint="https://api.example.com"
  debug={true} // Enables console logging
/>
```