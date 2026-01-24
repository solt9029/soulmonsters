import { GameModel } from '../../../models/game.model';
import { dealDamageToPlayer } from '../dealDamageToPlayer';
import { handleEvent } from '../../events/handlers';
import { GameEventType } from '../../events';

export const directAttack = (gameModel: GameModel, attackerCardId: number, opponentUserId: string): GameModel => {
  const attackerCard = gameModel.gameCards.find(gameCard => gameCard.id === attackerCardId);

  if (!attackerCard?.attack) {
    throw new Error();
  }

  dealDamageToPlayer(gameModel, opponentUserId, attackerCard.attack);

  gameModel = handleEvent(
    {
      type: GameEventType.DIRECT_ATTACK,
      attackerCardId,
      opponentUserId,
    },
    gameModel,
  );

  return gameModel;
};
