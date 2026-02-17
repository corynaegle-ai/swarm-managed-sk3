/**
 * Player data model
 * @class Player
 */
class Player {
  /**
   * Creates a new Player instance
   * @param {string} id - Unique player identifier
   * @param {string} name - Player display name
   * @param {Object} gameData - Optional game-specific data
   */
  constructor(id, name, gameData = {}) {
    this.id = id;
    this.name = name;
    this.gameData = gameData;
    this.createdAt = new Date().toISOString();
  }

  /**
   * Creates a Player from plain object
   * @param {Object} obj - Plain object with player data
   * @returns {Player} New Player instance
   */
  static fromObject(obj) {
    return new Player(obj.id, obj.name, obj.gameData);
  }

  /**
   * Converts Player to plain object
   * @returns {Object} Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      gameData: this.gameData,
      createdAt: this.createdAt
    };
  }

  /**
   * Updates player's game-specific data
   * @param {Object} newGameData - New game data to merge
   */
  updateGameData(newGameData) {
    this.gameData = { ...this.gameData, ...newGameData };
  }

  /**
   * Validates player instance
   * @returns {boolean} True if valid
   */
  isValid() {
    return this.id && typeof this.id === 'string' && 
           this.name && typeof this.name === 'string' && 
           this.name.trim().length > 0;
  }
}

module.exports = Player;