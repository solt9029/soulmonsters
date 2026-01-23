import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameModel } from 'src/models/game.model';

export const markGameChainAsResolved = (gameModel: GameModel, gameChainId: number): GameModel => {
  gameModel.gameChains = gameModel.gameChains.map(chain =>
    chain.id === gameChainId ? new GameChainModel({ ...chain, status: GameChainStatus.RESOLVED }) : chain,
  );

  return gameModel;
};
