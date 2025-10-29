import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameActionDispatchInput } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { summonGameCard } from './summonMonster/summonGameCard';
import { SummonMonsterValidationResult } from '../validators/summonMonster';

// New validation result version
export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  validationResult: SummonMonsterValidationResult,
  gameEntity: GameEntity,
): Promise<void>;

// Legacy data version for backward compatibility
export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
): Promise<void>;

// Implementation
export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  dataOrValidationResult: GameActionDispatchInput | SummonMonsterValidationResult,
  gameEntity: GameEntity,
) {
  // Check if it's validation result or legacy data
  if ('gameCard' in dataOrValidationResult && 'gameUser' in dataOrValidationResult && 'gameCardId' in dataOrValidationResult && !('attackTarget' in dataOrValidationResult)) {
    // New validation result approach
    const validationResult = dataOrValidationResult as SummonMonsterValidationResult;
    const { gameCard, gameCardId, gameUser } = validationResult;
    const originalPosition = gameCard.position;

    subtractUserEnergy(gameEntity, userId, gameCard.card!.cost!);
    summonGameCard(gameEntity, userId, gameCardId);

    // TODO: シマシマジュニアの場合、相手のエナジーを1減らし、自分のエナジーを1増やす

    await manager.save(GameEntity, gameEntity);

    const gameCardRepository = manager.withRepository(GameCardRepository);
    await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
  } else {
    // Legacy data approach
    const data = dataOrValidationResult as GameActionDispatchInput;
    const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId)!;
    const originalPosition = gameCard.position;

    subtractUserEnergy(gameEntity, userId, gameCard.card!.cost!);
    summonGameCard(gameEntity, userId, data.payload.gameCardId!);

    // TODO: シマシマジュニアの場合、相手のエナジーを1減らし、自分のエナジーを1増やす

    await manager.save(GameEntity, gameEntity);

    const gameCardRepository = manager.withRepository(GameCardRepository);
    await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
  }
}
