import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { subtractUserEnergy } from 'src/game/mutations/subtractUserEnergy';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveShimashimajuniorEnergyTransfer = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
  if (!gameCard) {
    return gameModel;
  }

  const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== gameCard.currentUserId)?.userId;
  if (opponentUserId) {
    gameModel = subtractUserEnergy(gameModel, opponentUserId, 1);
    gameModel = addUserEnergy(gameModel, gameCard.currentUserId, 1);
  }

  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
