import { Zone } from 'src/graphql';
import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameUserRepository } from '../../../repositories/game.user.repository';
import { GameActionDispatchInput, BattlePosition } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';

const calcNewBattleGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const battleGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.BATTLE && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return battleGameCards.length > 0 ? battleGameCards[0].position + 1 : 0;
};

export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameCardRepository = manager.withRepository(GameCardRepository);
  const gameUserRepository = manager.withRepository(GameUserRepository);

  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId);

  await gameUserRepository.subtractEnergy(gameEntity.id, userId, gameCard.card.cost);

  await gameCardRepository.update(
    { id: data.payload.gameCardId },
    {
      position: calcNewBattleGameCardPosition(gameEntity, userId),
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.ATTACK, // TODO: make this param selectable
    },
  );

  await gameCardRepository.packHandPositions(gameEntity.id, userId, gameCard.position);
}
