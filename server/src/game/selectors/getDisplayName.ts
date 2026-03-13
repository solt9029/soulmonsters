import { GameModel } from 'src/models/game.model';

export const getDisplayName = (gameModel: GameModel, userId: string): string => {
  return gameModel.gameUsers.find(u => u.userId === userId)?.displayName ?? userId;
};
