import { GameModel } from '../../../../models/game.model';
import { MAX_ENERGY } from '../../../../constants/rule';
import { GameUserModel } from 'src/models/game-user.model';

export const increaseEnergyToPlayer = (gameModel: GameModel, userId: string): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserModel({ ...gameUser, energy: Math.min(gameUser.energy + 1, MAX_ENERGY) })
      : gameUser,
  );

  return gameModel;
};
