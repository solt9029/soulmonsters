import { GameUserEntity } from 'src/entities/game-user.entity';
import { GameModel } from '../../../../models/game.model';

export const dealDamageToPlayer = (gameModel: GameModel, userId: string, damage: number): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserEntity({ ...gameUser, lifePoint: gameUser.lifePoint - damage }) : gameUser,
  );

  return gameModel;
};
