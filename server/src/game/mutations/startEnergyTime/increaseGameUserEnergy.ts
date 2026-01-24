import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';

const calcNewEnergy = (gameModel: GameModel, userId: string): number => {
  const gameUser = gameModel.gameUsers.find(value => value.userId === userId)!;
  return Math.min(gameUser.energy + 2, 8);
};

export const increaseGameUserEnergy = (gameModel: GameModel, userId: string): GameModel => {
  const newEnergy = calcNewEnergy(gameModel, userId);

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserModel({ ...gameUser, energy: newEnergy }) : gameUser,
  );

  return gameModel;
};
