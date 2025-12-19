import { GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
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

  // TODO: シマシマジュニアの場合、相手のエナジーを1減らし、自分のエナジーを1増やす

  return gameModel;
}
