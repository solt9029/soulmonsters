import { Zone } from 'src/graphql';
import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameActionDispatchInput, BattlePosition } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';

const calcNewBattleGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const battleGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.BATTLE && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return battleGameCards.length > 0 ? battleGameCards[0].position + 1 : 0;
};

const subtractUserEnergy = (gameEntity: GameEntity, userId: string, amount: number): GameEntity => {
  const gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId ? { ...gameUser, energy: gameUser.energy - amount } : { ...gameUser },
  );
  return { ...gameEntity, gameUsers };
};

const summonGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? {
          ...gameCard,
          position: calcNewBattleGameCardPosition(gameEntity, userId),
          zone: Zone.BATTLE,
          battlePosition: BattlePosition.ATTACK,
        }
      : { ...gameCard },
  );
  return { ...gameEntity, gameCards };
};

export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId)!;
  const originalPosition = gameCard.position;

  gameEntity = subtractUserEnergy(gameEntity, userId, gameCard.card.cost);
  gameEntity = summonGameCard(gameEntity, userId, data.payload.gameCardId!);
  await manager.save(GameEntity, gameEntity);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
}
