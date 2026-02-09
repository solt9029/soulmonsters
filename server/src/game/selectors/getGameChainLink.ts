import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { GameModel } from 'src/models/game.model';

export const getGameChainLink = (gameModel: GameModel, gameChainLinkId: string): GameChainLinkModel | undefined => {
  return gameModel.gameChains.flatMap(c => c.gameChainLinks).find(l => l.id === gameChainLinkId);
};
