import { GameUserModel } from 'src/models/game-user.model';
import { GameModel } from '../../../../models/game.model';

export const dealDamageToPlayer = (gameModel: GameModel, userId: string, damage: number): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserModel({ ...gameUser, lifePoint: gameUser.lifePoint - damage }) : gameUser,
  );

  return gameModel;
};
