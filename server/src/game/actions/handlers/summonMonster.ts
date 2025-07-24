import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameActionDispatchInput } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { subtractUserEnergy } from './summonMonster/subtractUserEnergy';
import { summonGameCard } from './summonMonster/summonGameCard';

export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId)!;
  const originalPosition = gameCard.position;

  subtractUserEnergy(gameEntity, userId, gameCard.card.cost);
  summonGameCard(gameEntity, userId, data.payload.gameCardId!);

  // TODO: シマシマジュニアの場合、相手のエナジーを1減らし、自分のエナジーを1増やす

  await manager.save(GameEntity, gameEntity);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
}
