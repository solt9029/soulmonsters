import { GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { subtractUserEnergy } from '../../utils/subtractUserEnergy';
import { summonGameCard } from './summonMonster/summonGameCard';
import { packHandPositions } from './utils/packHandPositions';

export function handleSummonMonsterAction(
  userId: string,
  data: GameActionDispatchInput,
  gameModel: GameModel,
): GameModel {
  const gameCard = gameModel.gameCards.find(value => value.id === data.payload.gameCardId)!;
  const originalPosition = gameCard.position;

  gameModel = subtractUserEnergy(gameModel, userId, gameCard.card.cost!);
  gameModel = summonGameCard(gameModel, userId, data.payload.gameCardId!);
  gameModel = packHandPositions(gameModel, userId, originalPosition);

  return gameModel;
}
