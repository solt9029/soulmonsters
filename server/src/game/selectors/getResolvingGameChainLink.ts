import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameChainModel } from 'src/models/game-chain.model';

export const getResolvingGameChainLink = (gameChain: GameChainModel): GameChainLinkModel | undefined => {
  const resolvingGameChainLinks = gameChain.gameChainLinks.filter(cl => cl.status === GameChainLinkStatus.RESOLVING);

  if (resolvingGameChainLinks.length > 1) {
    throw new Error('Multiple resolving gameChainLinks found');
  }

  return resolvingGameChainLinks[0];
};
