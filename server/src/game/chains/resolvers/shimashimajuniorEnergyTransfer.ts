import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { subtractUserEnergy } from 'src/game/mutations/subtractUserEnergy';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

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
  gameModel = addGameLog(
    gameModel,
    `${CARD_NAME.SHIMASHIMAJUNIOR}の効果を処理し、相手のエナジーを1減らし、自分のエナジーを1増やしました。`,
  );

  return gameModel;
};
