-- Test migration 001_initial_schema.sql
-- Verify all tables are created and bonus_points field exists

-- Test 1: Verify tables exist
SELECT name FROM sqlite_master WHERE type='table' AND name IN ('games', 'players', 'game_players', 'migrations');

-- Test 2: Verify bonus_points column exists with correct type and default
PRAGMA table_info(game_players);

-- Test 3: Verify bonus_points default value is 0
INSERT INTO games (name) VALUES ('Test Game');
INSERT INTO players (name) VALUES ('Test Player');
INSERT INTO game_players (game_id, player_id) VALUES (1, 1);
SELECT bonus_points FROM game_players WHERE game_id = 1 AND player_id = 1;

-- Expected result should be 0

-- Test 4: Verify bonus_points can be updated
UPDATE game_players SET bonus_points = 50 WHERE game_id = 1 AND player_id = 1;
SELECT bonus_points FROM game_players WHERE game_id = 1 AND player_id = 1;

-- Expected result should be 50

-- Cleanup
DELETE FROM game_players WHERE game_id = 1 AND player_id = 1;
DELETE FROM players WHERE id = 1;
DELETE FROM games WHERE id = 1;