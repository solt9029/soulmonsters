import { Zone } from 'src/graphql';
import {
  GameCardRepository,
  GameUserRepository,
} from '../../services/game.service';
import { GameActionDispatchInput, BattlePosition } from '../../graphql/index';
import { GameEntity } from '../../entities/game.entity';
import { EntityManager } from 'typeorm';

export async function handleSummonMonsterAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);
  const gameUserRepository = manager.getCustomRepository(GameUserRepository);

  const gameCard = gameEntity.gameCards.find(
    value => value.id === data.payload.gameCardId,
  );

  // reduce energy
  await gameUserRepository.query(
    `UPDATE gameUsers SET energy = energy - ${gameCard.card.cost} WHERE gameId = ${gameEntity.id} AND userId = '${userId}'`,
  );

  const yourBattleGameCards = gameEntity.gameCards
    .filter(
      value => value.zone === Zone.BATTLE && value.currentUserId === userId,
    )
    .sort((a, b) => b.position - a.position);
  const yourBattleGameCardMaxPosition =
    yourBattleGameCards.length > 0 ? yourBattleGameCards[0].position : -1;

  // put the target monster card on your battle zone
  await gameCardRepository.update(
    { id: data.payload.gameCardId },
    {
      position: yourBattleGameCardMaxPosition + 1,
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.ATTACK, // TODO: make this param selectable
    },
  );

  // pack your hand cards
  await gameCardRepository.query(
    `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "HAND" AND currentUserId = "${userId}" AND position > ${gameCard.position} ORDER BY position`,
  );
}
