import { GameCardRepository } from '../../../repositories/game-card.repository';
import { GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { summonGameCard } from './summonMonster/summonGameCard';

export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameModel: GameModel,
) {
  const gameCard = gameModel.gameCards.find(value => value.id === data.payload.gameCardId)!;
  const originalPosition = gameCard.position;

  subtractUserEnergy(gameModel, userId, gameCard.card.cost!);
  summonGameCard(gameModel, userId, data.payload.gameCardId!);

  // TODO: シマシマジュニアの場合、相手のエナジーを1減らし、自分のエナジーを1増やす

  await manager.save(gameModel.toEntity());

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameModel.id, userId, originalPosition);
}
