import { GameModel } from '../../../models/game.model';
import { subtractUserEnergy } from '../../mutations/subtractUserEnergy';
import { summonGameCard } from '../../mutations/summonMonster/summonGameCard';
import { packHandPositions } from '../../mutations/packHandPositions';
import { SummonMonsterActionPayload } from '../validators/summonMonster';

export function handleSummonMonsterAction(
  userId: string,
  payload: SummonMonsterActionPayload,
  gameModel: GameModel,
): GameModel {
  const gameCard = gameModel.gameCards.find(value => value.id === payload.gameCardId);
  if (!gameCard) {
    throw new Error(`GameCard with id ${payload.gameCardId} not found`);
  }

  const originalPosition = gameCard.position;

  gameModel = subtractUserEnergy(gameModel, userId, payload.cost);
  gameModel = summonGameCard(gameModel, userId, payload.gameCardId);
  gameModel = packHandPositions(gameModel, userId, originalPosition);

  return gameModel;
}
