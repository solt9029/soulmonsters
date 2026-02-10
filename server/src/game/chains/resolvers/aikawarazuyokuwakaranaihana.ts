import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { dealDamageToPlayer } from 'src/game/mutations/dealDamageToPlayer';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

export const resolveAikawarazuyokuwakaranaihana = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
  if (!gameCard) {
    return gameModel;
  }

  const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== gameCard.currentUserId)?.userId;
  if (opponentUserId) {
    gameModel = dealDamageToPlayer(gameModel, opponentUserId, 600);
  }

  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
