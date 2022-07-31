UPDATE users
SET status = 'online', "currentGameId" = NULL;

DELETE FROM grades;

DELETE FROM memes;

DELETE FROM game_rounds;
   
DELETE FROM players;
   
DELETE FROM games;
