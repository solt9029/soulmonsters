import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { dealDamageToPlayer } from 'src/game/mutations/dealDamageToPlayer';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { CARD_NAME } from 'src/constants/card';

export const resolveSaifukkatsushitatakibeeDamage = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
  if (!gameCard) {
    return gameModel;
  }

  const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== gameCard.currentUserId)?.userId;
  if (opponentUserId) {
    gameModel = dealDamageToPlayer(gameModel, opponentUserId, 1000);
  }

  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);
  gameModel = addGameLog(
    gameModel,
    `${CARD_NAME.SAIFUKKATSUSHITATAKIBEE}の効果を処理し、相手に1000のダメージを与えました。`,
  );

  return gameModel;
};
