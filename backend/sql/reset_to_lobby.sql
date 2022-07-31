DO $$ 
DECLARE
   game_id    INTEGER := 3;
BEGIN 

   UPDATE users
   SET status = 'in_lobby'
   WHERE id < game_id;

   UPDATE games
   SET status = 'waiting'
   WHERE id = game_id;

   DELETE FROM grade;

   DELETE FROM memes;

   DELETE FROM game_rounds
   WHERE "gameId" = game_id;
   
   DELETE FROM game_players
   WHERE "gamesId" = game_id;

END $$;
