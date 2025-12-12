import { GameModel } from 'src/models/game.model';
import { GameUserEntity } from 'src/entities/game-user.entity';

const calcNewEnergy = (gameModel: GameModel, userId: string): number => {
  const gameUser = gameModel.gameUsers.find(value => value.userId === userId)!;
  return Math.min(gameUser.energy + 2, 8);
};

export const increaseGameUserEnergy = (gameModel: GameModel, userId: string): GameModel => {
  const newEnergy = calcNewEnergy(gameModel, userId);

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserEntity({ ...gameUser, energy: newEnergy }) : gameUser,
  );

  return gameModel;
};
