import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameModel } from 'src/models/game.model';

export const getResolvingGameChain = (gameModel: GameModel): GameChainModel | undefined => {
  const resolvingGameChains = gameModel.gameChains.filter(c => c.status === GameChainStatus.RESOLVING);

  if (resolvingGameChains.length > 1) {
    throw new Error('Multiple resolving gameChains found');
  }

  return resolvingGameChains[0];
};
