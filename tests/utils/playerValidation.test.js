const { PlayerValidation, PlayerUtils } = require('../../src/utils/playerValidation');
const Player = require('../../src/models/Player');

describe('PlayerValidation', () => {
  test('validates player count correctly', () => {
    expect(PlayerValidation.isValidPlayerCount(2)).toBe(true);
    expect(PlayerValidation.isValidPlayerCount(8)).toBe(true);
    expect(PlayerValidation.isValidPlayerCount(1)).toBe(false);
    expect(PlayerValidation.isValidPlayerCount(9)).toBe(false);
  });

  test('validates player names', () => {
    const validPlayers = [
      new Player('p1', 'John'),
      new Player('p2', 'Jane')
    ];
    expect(PlayerValidation.validatePlayerNames(validPlayers)).toBe(true);

    const invalidPlayers = [
      new Player('p1', ''),
      new Player('p2', 'Jane')
    ];
    expect(PlayerValidation.validatePlayerNames(invalidPlayers)).toBe(false);
  });
});

describe('PlayerUtils', () => {
  test('adds player successfully', () => {
    const players = [new Player('p1', 'John')];
    const result = PlayerUtils.addPlayer(players, 'p2', 'Jane');
    expect(result.length).toBe(2);
    expect(result[1].name).toBe('Jane');
  });

  test('prevents duplicate player names', () => {
    const players = [new Player('p1', 'John')];
    expect(() => {
      PlayerUtils.addPlayer(players, 'p2', 'John');
    }).toThrow('Player with name \'John\' already exists');
  });

  test('updates player successfully', () => {
    const players = [new Player('p1', 'John')];
    const result = PlayerUtils.updatePlayer(players, 'p1', { name: 'Johnny' });
    expect(result[0].name).toBe('Johnny');
  });

  test('removes player successfully', () => {
    const players = [
      new Player('p1', 'John'),
      new Player('p2', 'Jane'),
      new Player('p3', 'Bob')
    ];
    const result = PlayerUtils.removePlayer(players, 'p2');
    expect(result.length).toBe(2);
    expect(result.find(p => p.id === 'p2')).toBeUndefined();
  });

  test('prevents removing below minimum players', () => {
    const players = [
      new Player('p1', 'John'),
      new Player('p2', 'Jane')
    ];
    expect(() => {
      PlayerUtils.removePlayer(players, 'p1');
    }).toThrow('Cannot remove player - minimum 2 players required');
  });
});