const Player = require('../models/Player');

/**
 * Player validation and utility functions
 */
class PlayerValidation {
  /**
   * Validates player count is within acceptable range (2-8)
   * @param {number} count - Number of players
   * @returns {boolean} True if count is valid
   */
  static isValidPlayerCount(count) {
    return typeof count === 'number' && count >= 2 && count <= 8;
  }

  /**
   * Validates that all players have required names
   * @param {Array<Player|Object>} players - Array of player objects
   * @returns {boolean} True if all players have valid names
   */
  static validatePlayerNames(players) {
    if (!Array.isArray(players) || players.length === 0) {
      return false;
    }

    return players.every(player => {
      const name = player.name || (player.name === '' ? null : player.name);
      return name && typeof name === 'string' && name.trim().length > 0;
    });
  }

  /**
   * Validates complete player array
   * @param {Array<Player|Object>} players - Array of player objects
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  static validatePlayers(players) {
    const errors = [];
    
    if (!Array.isArray(players)) {
      errors.push('Players must be an array');
      return { isValid: false, errors };
    }

    if (!this.isValidPlayerCount(players.length)) {
      errors.push('Player count must be between 2 and 8');
    }

    if (!this.validatePlayerNames(players)) {
      errors.push('All players must have valid names');
    }

    // Check for duplicate names
    const names = players.map(p => p.name?.trim().toLowerCase()).filter(Boolean);
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      errors.push('Player names must be unique');
    }

    // Check for duplicate IDs
    const ids = players.map(p => p.id).filter(Boolean);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      errors.push('Player IDs must be unique');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Player array utility functions for CRUD operations
 */
class PlayerUtils {
  /**
   * Adds a new player to the players array
   * @param {Array<Player>} players - Current players array
   * @param {string} id - Player ID
   * @param {string} name - Player name
   * @param {Object} gameData - Optional game data
   * @returns {Array<Player>} New players array with added player
   * @throws {Error} If validation fails
   */
  static addPlayer(players, id, name, gameData = {}) {
    if (!Array.isArray(players)) {
      throw new Error('Players must be an array');
    }

    if (players.length >= 8) {
      throw new Error('Maximum 8 players allowed');
    }

    // Check for duplicate ID
    if (players.some(p => p.id === id)) {
      throw new Error(`Player with ID '${id}' already exists`);
    }

    // Check for duplicate name
    if (players.some(p => p.name?.trim().toLowerCase() === name?.trim().toLowerCase())) {
      throw new Error(`Player with name '${name}' already exists`);
    }

    const newPlayer = new Player(id, name, gameData);
    if (!newPlayer.isValid()) {
      throw new Error('Invalid player data');
    }

    return [...players, newPlayer];
  }

  /**
   * Updates an existing player in the players array
   * @param {Array<Player>} players - Current players array
   * @param {string} id - Player ID to update
   * @param {Object} updates - Updates to apply
   * @returns {Array<Player>} New players array with updated player
   * @throws {Error} If player not found or validation fails
   */
  static updatePlayer(players, id, updates) {
    if (!Array.isArray(players)) {
      throw new Error('Players must be an array');
    }

    const playerIndex = players.findIndex(p => p.id === id);
    if (playerIndex === -1) {
      throw new Error(`Player with ID '${id}' not found`);
    }

    const updatedPlayers = [...players];
    const currentPlayer = updatedPlayers[playerIndex];
    
    // Create updated player
    const updatedPlayer = new Player(
      updates.id || currentPlayer.id,
      updates.name || currentPlayer.name,
      { ...currentPlayer.gameData, ...updates.gameData }
    );

    if (!updatedPlayer.isValid()) {
      throw new Error('Invalid updated player data');
    }

    // Check for duplicate name if name is being changed
    if (updates.name && updates.name !== currentPlayer.name) {
      const nameExists = updatedPlayers.some((p, index) => 
        index !== playerIndex && 
        p.name?.trim().toLowerCase() === updates.name?.trim().toLowerCase()
      );
      if (nameExists) {
        throw new Error(`Player with name '${updates.name}' already exists`);
      }
    }

    updatedPlayers[playerIndex] = updatedPlayer;
    return updatedPlayers;
  }

  /**
   * Removes a player from the players array
   * @param {Array<Player>} players - Current players array
   * @param {string} id - Player ID to remove
   * @returns {Array<Player>} New players array without the removed player
   * @throws {Error} If player not found or would result in too few players
   */
  static removePlayer(players, id) {
    if (!Array.isArray(players)) {
      throw new Error('Players must be an array');
    }

    if (players.length <= 2) {
      throw new Error('Cannot remove player - minimum 2 players required');
    }

    const playerIndex = players.findIndex(p => p.id === id);
    if (playerIndex === -1) {
      throw new Error(`Player with ID '${id}' not found`);
    }

    return players.filter(p => p.id !== id);
  }

  /**
   * Finds a player by ID
   * @param {Array<Player>} players - Players array
   * @param {string} id - Player ID to find
   * @returns {Player|null} Found player or null
   */
  static findPlayerById(players, id) {
    if (!Array.isArray(players)) {
      return null;
    }
    return players.find(p => p.id === id) || null;
  }

  /**
   * Finds a player by name
   * @param {Array<Player>} players - Players array
   * @param {string} name - Player name to find
   * @returns {Player|null} Found player or null
   */
  static findPlayerByName(players, name) {
    if (!Array.isArray(players) || !name) {
      return null;
    }
    return players.find(p => 
      p.name?.trim().toLowerCase() === name.trim().toLowerCase()
    ) || null;
  }
}

module.exports = {
  PlayerValidation,
  PlayerUtils
};