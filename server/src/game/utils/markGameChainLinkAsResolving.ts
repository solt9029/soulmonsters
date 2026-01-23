import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameChainModel } from 'src/models/game-chain.model';
import { GameModel } from 'src/models/game.model';

export const markGameChainLinkAsResolving = (
  gameModel: GameModel,
  gameChain: GameChainModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const updatedGameChainLink = new GameChainLinkModel({ ...gameChainLink, status: GameChainLinkStatus.RESOLVING });

  const updatedGameChainLinks = gameChain.gameChainLinks.map(link =>
    link.id === gameChainLink.id ? updatedGameChainLink : link,
  );

  gameModel.gameChains = gameModel.gameChains.map(chain =>
    chain.id === gameChain.id ? new GameChainModel({ ...chain, gameChainLinks: updatedGameChainLinks }) : chain,
  );

  return gameModel;
};
