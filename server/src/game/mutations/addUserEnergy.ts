import { GameModel } from '../../models/game.model';
import { GameUserModel } from '../../models/game-user.model';
import { MAX_ENERGY } from '../../constants/rule';

export const addUserEnergy = (gameModel: GameModel, userId: string, amount: number): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserModel({ ...gameUser, energy: Math.min(gameUser.energy + amount, MAX_ENERGY) })
      : gameUser,
  );

  return gameModel;
};
