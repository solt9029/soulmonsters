import { GameModel } from 'src/models/game.model';
import { GameUserEntity } from 'src/entities/game-user.entity';

export const subtractUserEnergy = (gameModel: GameModel, userId: string, amount: number): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserEntity({ ...gameUser, energy: gameUser.energy - amount }) : gameUser,
  );

  return gameModel;
};
