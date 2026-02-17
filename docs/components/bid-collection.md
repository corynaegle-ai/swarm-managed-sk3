# BidCollection Component Documentation

## Overview

The `BidCollection` component is the core interface for handling bid submission in multiplayer games. It provides a comprehensive UI for players to submit bids, view their resources, and track round progress with real-time updates and validation.

## Import

```javascript
import { BidCollection } from '../components/BidCollection';
```

## Basic Usage

```javascript
import React from 'react';
import { BidCollection } from '../components/BidCollection';

function GameRoom() {
  const handleBidSubmit = (bidData) => {
    console.log('Bid submitted:', bidData);
  };

  const handleGameStateChange = (newState) => {
    console.log('Game state changed:', newState);
  };

  return (
    <BidCollection
      gameId="game_123456"
      playerId="player_789"
      playerResources={100}
      roundTimeRemaining={25}
      onBidSubmit={handleBidSubmit}
      onGameStateChange={handleGameStateChange}
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `gameId` | `string` | Unique identifier for the current game |
| `playerId` | `string` | Unique identifier for the current player |
| `playerResources` | `number` | Player's available resources for bidding |
| `onBidSubmit` | `function` | Callback fired when bid is submitted |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `roundTimeRemaining` | `number` | `null` | Seconds remaining in current round |
| `gameState` | `string` | `'waiting'` | Current game phase: `'waiting'`, `'bidding'`, `'evaluating'`, `'completed'` |
| `bidTypes` | `array` | `['standard']` | Available bid types for this game |
| `minBid` | `number` | `1` | Minimum allowed bid amount |
| `maxBid` | `number` | `playerResources` | Maximum allowed bid amount |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `showAdvanced` | `boolean` | `false` | Show advanced bidding options |
| `onGameStateChange` | `function` | `() => {}` | Callback for game state changes |
| `onError` | `function` | `console.error` | Error handling callback |
| `className` | `string` | `''` | Additional CSS classes |

## Bid Types

The component supports multiple bid types:

### Standard Bid

```javascript
<BidCollection
  gameId="game_123"
  playerId="player_456"
  playerResources={100}
  bidTypes={['standard']}
  onBidSubmit={(bid) => console.log(bid)}
/>
```

### Premium Bid

Premium bids cost double resources but provide bonus points:

```javascript
<BidCollection
  gameId="game_123"
  playerId="player_456"
  playerResources={100}
  bidTypes={['standard', 'premium']}
  onBidSubmit={(bid) => console.log(bid)}
/>
```

### Wildcard Bid

Special bid type with unique rules (limited uses):

```javascript
<BidCollection
  gameId="game_123"
  playerId="player_456"
  playerResources={100}
  bidTypes={['standard', 'premium', 'wildcard']}
  wildcardUsesRemaining={1}
  onBidSubmit={(bid) => console.log(bid)}
/>
```

## Event Handlers

### onBidSubmit

Called when a player successfully submits a bid:

```javascript
const handleBidSubmit = (bidData) => {
  // bidData structure:
  {
    bidAmount: 50,
    bidType: 'standard',
    playerId: 'player_789',
    gameId: 'game_123456',
    timestamp: '2024-01-15T10:30:00.000Z'
  }
};
```

### onGameStateChange

Called when the game state changes:

```javascript
const handleGameStateChange = (stateData) => {
  // stateData structure:
  {
    previousState: 'waiting',
    newState: 'bidding',
    roundNumber: 1,
    timeRemaining: 30,
    playersReady: 3
  }
};
```

### onError

Called when validation or submission errors occur:

```javascript
const handleError = (error) => {
  // error structure:
  {
    code: 'INSUFFICIENT_RESOURCES',
    message: 'Not enough resources for this bid',
    context: {
      bidAmount: 150,
      availableResources: 100
    }
  }
};
```

## Advanced Configuration

### Custom Validation

```javascript
const customValidation = (bidAmount, bidType, playerResources) => {
  const errors = [];
  
  if (bidAmount > playerResources * 0.8) {
    errors.push('Consider saving some resources for later rounds');
  }
  
  if (bidType === 'premium' && bidAmount < 20) {
    errors.push('Premium bids should be substantial');
  }
  
  return errors;
};

<BidCollection
  gameId="game_123"
  playerId="player_456"
  playerResources={100}
  customValidation={customValidation}
  onBidSubmit={handleBidSubmit}
/>
```

### Timer Integration

```javascript
import { useState, useEffect } from 'react';

function TimedBidding() {
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <BidCollection
      gameId="game_123"
      playerId="player_456"
      playerResources={100}
      roundTimeRemaining={timeRemaining}
      disabled={timeRemaining === 0}
      onBidSubmit={handleBidSubmit}
    />
  );
}
```

## Game Flow Integration

### Phase Management

The component automatically adapts to different game phases:

```javascript
function GameManager() {
  const [gameState, setGameState] = useState('waiting');
  const [roundNumber, setRoundNumber] = useState(0);

  const phases = {
    waiting: 'Waiting for players...',
    bidding: 'Submit your bids!',
    evaluating: 'Evaluating bids...',
    completed: 'Game complete!'
  };

  return (
    <div>
      <h2>Round {roundNumber}: {phases[gameState]}</h2>
      <BidCollection
        gameId="game_123"
        playerId="player_456"
        playerResources={100}
        gameState={gameState}
        disabled={gameState !== 'bidding'}
        onBidSubmit={handleBidSubmit}
        onGameStateChange={setGameState}
      />
    </div>
  );
}
```

### Multi-Round Games

```javascript
function MultiRoundGame() {
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerStats, setPlayerStats] = useState({
    resources: 100,
    score: 0,
    bidsSubmitted: 0
  });

  const handleRoundComplete = (roundResults) => {
    setRounds(prev => [...prev, roundResults]);
    setCurrentRound(prev => prev + 1);
    
    // Update player stats based on results
    setPlayerStats(prev => ({
      ...prev,
      resources: prev.resources + roundResults.resourcesGained,
      score: prev.score + roundResults.pointsEarned,
      bidsSubmitted: prev.bidsSubmitted + 1
    }));
  };

  return (
    <div>
      <div className="game-stats">
        <h3>Round {currentRound}</h3>
        <p>Resources: {playerStats.resources}</p>
        <p>Score: {playerStats.score}</p>
      </div>
      
      <BidCollection
        gameId="game_123"
        playerId="player_456"
        playerResources={playerStats.resources}
        onBidSubmit={handleBidSubmit}
        onRoundComplete={handleRoundComplete}
      />
      
      <div className="round-history">
        {rounds.map((round, index) => (
          <div key={index}>
            Round {index + 1}: {round.result}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## WebSocket Integration

### Real-Time Updates

```javascript
import { useEffect } from 'react';
import io from 'socket.io-client';

function RealTimeBidding() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [otherPlayerBids, setOtherPlayerBids] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Join game room
    newSocket.emit('join-game', {
      gameId: 'game_123',
      playerId: 'player_456'
    });

    // Listen for game updates
    newSocket.on('game-state-changed', (state) => {
      setGameState(state.status);
    });

    newSocket.on('bid-submitted', (bidInfo) => {
      if (bidInfo.playerId !== 'player_456') {
        setOtherPlayerBids(prev => [...prev, bidInfo]);
      }
    });

    return () => newSocket.close();
  }, []);

  const handleBidSubmit = (bidData) => {
    // Submit via WebSocket for real-time confirmation
    socket.emit('submit-bid', bidData);
  };

  return (
    <div>
      <BidCollection
        gameId="game_123"
        playerId="player_456"
        playerResources={100}
        gameState={gameState}
        onBidSubmit={handleBidSubmit}
      />
      
      <div className="other-players">
        <h4>Other Players' Activity:</h4>
        {otherPlayerBids.map((bid, index) => (
          <div key={index}>
            {bid.playerName} submitted a bid
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Styling and Theming

### CSS Classes

The component provides several CSS classes for styling:

```css
.bid-collection {
  /* Main container */
}

.bid-collection__input {
  /* Bid amount input field */
}

.bid-collection__type-selector {
  /* Bid type selection buttons */
}

.bid-collection__submit {
  /* Submit button */
}

.bid-collection__timer {
  /* Round timer display */
}

.bid-collection__resources {
  /* Resource display */
}

.bid-collection__validation-errors {
  /* Error messages */
}

.bid-collection--disabled {
  /* When component is disabled */
}
```

### Themed Example

```javascript
<BidCollection
  gameId="game_123"
  playerId="player_456"
  playerResources={100}
  className="bid-collection--dark-theme"
  onBidSubmit={handleBidSubmit}
/>
```

## Testing

### Unit Test Example

```javascript
import { render, fireEvent, screen } from '@testing-library/react';
import { BidCollection } from './BidCollection';

describe('BidCollection', () => {
  const defaultProps = {
    gameId: 'test-game',
    playerId: 'test-player',
    playerResources: 100,
    onBidSubmit: jest.fn()
  };

  it('renders bid input and submit button', () => {
    render(<BidCollection {...defaultProps} />);
    
    expect(screen.getByPlaceholderText(/enter bid amount/i)).toBeInTheDocument();
    expect(screen.getByText(/submit bid/i)).toBeInTheDocument();
  });

  it('validates bid amount against resources', () => {
    render(<BidCollection {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/enter bid amount/i);
    fireEvent.change(input, { target: { value: '150' } });
    
    expect(screen.getByText(/insufficient resources/i)).toBeInTheDocument();
  });

  it('calls onBidSubmit with correct data', () => {
    const onBidSubmit = jest.fn();
    render(<BidCollection {...defaultProps} onBidSubmit={onBidSubmit} />);
    
    const input = screen.getByPlaceholderText(/enter bid amount/i);
    const button = screen.getByText(/submit bid/i);
    
    fireEvent.change(input, { target: { value: '50' } });
    fireEvent.click(button);
    
    expect(onBidSubmit).toHaveBeenCalledWith({
      bidAmount: 50,
      bidType: 'standard',
      playerId: 'test-player',
      gameId: 'test-game',
      timestamp: expect.any(String)
    });
  });
});
```

## Accessibility

The component includes comprehensive accessibility features:

- **ARIA labels**: All inputs and buttons properly labeled
- **Keyboard navigation**: Full keyboard support
- **Screen reader**: Compatible with screen readers
- **Focus management**: Logical tab order
- **Error announcements**: Validation errors announced to screen readers

```javascript
<BidCollection
  gameId="game_123"
  playerId="player_456"
  playerResources={100}
  ariaLabel="Bid submission form"
  onBidSubmit={handleBidSubmit}
/>
```

## Performance Considerations

- **Debounced validation**: Input validation is debounced to prevent excessive API calls
- **Memoization**: Component uses React.memo for optimal re-rendering
- **WebSocket optimization**: Efficient event handling to prevent memory leaks
- **Resource cleanup**: Automatic cleanup of timers and event listeners

## Browser Compatibility

The component supports:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For older browsers, include appropriate polyfills for WebSocket and modern JavaScript features.