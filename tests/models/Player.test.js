const Player = require('../../src/models/Player');

describe('Player Model', () => {
  test('creates player with required fields', () => {
    const player = new Player('p1', 'John');
    expect(player.id).toBe('p1');
    expect(player.name).toBe('John');
    expect(player.gameData).toEqual({});
    expect(player.createdAt).toBeDefined();
  });

  test('creates player with game data', () => {
    const gameData = { score: 100 };
    const player = new Player('p1', 'John', gameData);
    expect(player.gameData).toEqual(gameData);
  });

  test('validates player correctly', () => {
    const validPlayer = new Player('p1', 'John');
    expect(validPlayer.isValid()).toBe(true);

    const invalidPlayer = new Player('', '');
    expect(invalidPlayer.isValid()).toBe(false);
  });

  test('converts to and from object', () => {
    const original = new Player('p1', 'John', { score: 100 });
    const obj = original.toObject();
    const restored = Player.fromObject(obj);
    
    expect(restored.id).toBe(original.id);
    expect(restored.name).toBe(original.name);
    expect(restored.gameData).toEqual(original.gameData);
  });
});