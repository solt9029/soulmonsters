import { GameLogModel } from 'src/models/game-log.model';
import { GameModel } from 'src/models/game.model';

export const addGameLog = (gameModel: GameModel, message: string): GameModel => {
  const gameLog = new GameLogModel({
    gameId: gameModel.id,
    message,
  });
  gameModel.gameLogs = [...gameModel.gameLogs, gameLog];
  return gameModel;
};
