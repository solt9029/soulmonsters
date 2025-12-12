import { GameModel } from '../../../../models/game.model';
import { MAX_ENERGY } from '../../../../constants/rule';
import { GameUserEntity } from 'src/entities/game-user.entity';

export const increaseEnergyToPlayer = (gameModel: GameModel, userId: string): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({ ...gameUser, energy: Math.min(gameUser.energy + 1, MAX_ENERGY) })
      : gameUser,
  );

  return gameModel;
};
