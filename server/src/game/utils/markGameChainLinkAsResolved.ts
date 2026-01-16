import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameModel } from 'src/models/game.model';

export const markGameChainLinkAsResolved = (
  gameModel: GameModel,
  gameChain: GameChainModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const updatedGameChainLink = new GameChainLinkModel({
    ...gameChainLink,
    status: GameChainLinkStatus.RESOLVED,
  });

  const updatedGameChainLinks = gameChain.gameChainLinks.map(link =>
    link.id === gameChainLink.id ? updatedGameChainLink : link,
  );

  const allLinksResolved = updatedGameChainLinks.every(link => link.status === GameChainLinkStatus.RESOLVED);

  const updatedGameChain = new GameChainModel({
    ...gameChain,
    gameChainLinks: updatedGameChainLinks,
    status: allLinksResolved ? GameChainStatus.RESOLVED : gameChain.status,
  });

  gameModel.gameChains = gameModel.gameChains.map(chain => (chain.id === gameChain.id ? updatedGameChain : chain));

  return gameModel;
};
