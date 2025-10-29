import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameActionDispatchInput } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { summonGameCard } from './summonMonster/summonGameCard';
import { SummonMonsterValidationResult } from '../validators/summonMonster';

// Function overload for backward compatibility
export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
): Promise<void>;
export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  validationResult: SummonMonsterValidationResult,
  gameEntity: GameEntity,
): Promise<void>;
export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  dataOrValidationResult: GameActionDispatchInput | SummonMonsterValidationResult,
  gameEntity: GameEntity,
) {
  let gameCard, gameCardId, originalPosition;

  if ('gameCard' in dataOrValidationResult) {
    // Using validation result
    ({ gameCard, gameCardId } = dataOrValidationResult);
    originalPosition = gameCard.position;
  } else {
    // Backward compatibility - using data
    gameCard = gameEntity.gameCards.find(value => value.id === dataOrValidationResult.payload.gameCardId)!;
    originalPosition = gameCard.position;
    gameCardId = dataOrValidationResult.payload.gameCardId!;
  }

  subtractUserEnergy(gameEntity, userId, gameCard.card.cost);
  summonGameCard(gameEntity, userId, gameCardId);

  // TODO: シマシマジュニアの場合、相手のエナジーを1減らし、自分のエナジーを1増やす

  await manager.save(GameEntity, gameEntity);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
}
