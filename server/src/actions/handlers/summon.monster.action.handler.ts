import { Zone } from 'src/graphql';
import { GameCardRepository } from '../../repositories/game.card.repository';
import { GameUserRepository } from '../../repositories/game.user.repository';
import { GameActionDispatchInput, BattlePosition } from '../../graphql/index';
import { GameEntity } from '../../entities/game.entity';
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
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);
  const gameUserRepository = manager.getCustomRepository(GameUserRepository);

  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId);

  // reduce energy
  await gameUserRepository.query(
    `UPDATE gameUsers SET energy = energy - ${gameCard.card.cost} WHERE gameId = ${gameEntity.id} AND userId = '${userId}'`,
  );

  const newBattleGameCardPosition = calcNewBattleGameCardPosition(gameEntity, userId);

  // put the target monster card on your battle zone
  await gameCardRepository.update(
    { id: data.payload.gameCardId },
    {
      position: newBattleGameCardPosition,
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.ATTACK, // TODO: make this param selectable
    },
  );

  // pack your hand cards
  await gameCardRepository.query(
    `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "HAND" AND currentUserId = "${userId}" AND position > ${gameCard.position} ORDER BY position`,
  );
}
