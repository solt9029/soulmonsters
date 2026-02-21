import { GameModel } from 'src/models/game.model';

export const endGameIfUserLifeDepleted = (gameModel: GameModel): GameModel => {
  if (gameModel.endedAt !== null) {
    return gameModel;
  }

  const depletedUsers = gameModel.gameUsers.filter(gameUser => gameUser.lifePoint <= 0);
  if (depletedUsers.length === 0) {
    return gameModel;
  }

  const winnerUserId =
    depletedUsers.length === gameModel.gameUsers.length
      ? null
      : gameModel.gameUsers.find(gameUser => gameUser.lifePoint > 0)?.userId ?? null;

  return new GameModel({ ...gameModel, winnerUserId, endedAt: new Date() });
};
