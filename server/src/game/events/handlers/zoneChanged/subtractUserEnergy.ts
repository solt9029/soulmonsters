import { GameModel } from '../../../../models/game.model';
import { GameUserModel } from '../../../../models/game-user.model';

export const subtractUserEnergy = (gameModel: GameModel, userId: string, amount: number): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserModel({ ...gameUser, energy: Math.max(gameUser.energy - amount, 0) })
      : gameUser,
  );

  return gameModel;
};
