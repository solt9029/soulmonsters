import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';

export const subtractUserEnergy = (gameModel: GameModel, userId: string, amount: number): GameModel => {
  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserModel({ ...gameUser, energy: gameUser.energy - amount }) : gameUser,
  );

  return gameModel;
};
