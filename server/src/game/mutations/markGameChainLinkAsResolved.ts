import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameChainModel } from 'src/models/game-chain.model';
import { GameModel } from 'src/models/game.model';

// TODO: gameChainLinkId を受け取れるのが理想的
export const markGameChainLinkAsResolved = (gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel => {
  const resolvedLink = new GameChainLinkModel({ ...gameChainLink, status: GameChainLinkStatus.RESOLVED });

  gameModel.gameChains = gameModel.gameChains.map(chain =>
    chain.id === gameChainLink.gameChainId
      ? new GameChainModel({
          ...chain,
          gameChainLinks: chain.gameChainLinks.map(link => (link.id === gameChainLink.id ? resolvedLink : link)),
        })
      : chain,
  );

  return gameModel;
};
