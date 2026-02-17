# Bid Collection Game

A multiplayer real-time bidding game built with React, Express, and WebSocket technology.

## Overview

The Bid Collection Game is a turn-based multiplayer game where players submit simultaneous bids during each round. The game features real-time synchronization, comprehensive bid validation, and an intuitive user interface for managing the bidding process.

## Features

- **Real-time Multiplayer**: Live synchronization across all connected players
- **Bid Validation**: Comprehensive server-side and client-side validation
- **Game Flow Management**: Structured phases including bidding, evaluation, and results
- **WebSocket Integration**: Real-time updates and notifications
- **Responsive Design**: Works across desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bid-collection-game

# Install dependencies
npm install

# Start development server
npm run dev

# Start backend server (in separate terminal)
npm run server
```

### Basic Usage

1. Navigate to `http://localhost:3000`
2. Enter a player name to join
3. Wait for other players or start game
4. Submit bids during bidding phases
5. View results and continue to next round

## Game Flow

The game follows a structured flow with distinct phases:

```
Game Start → Player Join → Bidding Phase → Evaluation → Results → Next Round
    ↑                                                                    ↓
    ←←←←←←←←←←←←←←← Game End ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

1. **Joining Phase**: Players join the game room
2. **Bidding Phase**: Players simultaneously submit bids
3. **Evaluation Phase**: Server processes and validates bids
4. **Results Phase**: Winners announced and scores updated
5. **Next Round**: Process repeats or game ends

## Architecture

### Frontend (React)
- `BidCollection` - Main bidding interface component
- `GameRoom` - Game state management and player coordination
- `PlayerList` - Display active players and their status
- WebSocket client for real-time updates

### Backend (Express + Socket.IO)
- RESTful API for game management
- WebSocket handlers for real-time events
- Bid validation and game logic
- Player session management

## Documentation

For detailed documentation on specific features:

- [API Documentation](docs/api/bids.md) - Complete API reference
- [Component Documentation](docs/components/bid-collection.md) - React component usage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.