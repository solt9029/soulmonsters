import { Zone } from 'src/graphql';
import { Phase } from '../../graphql/index';
import { GameCardRepository } from '../../repositories/game.card.repository';
import { GameEntity } from '../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/repositories/game.repository';

export async function handleStartDrawTimeAction(
  manager: EntityManager,
  id: number,
  userId: string,
  gameEntity: GameEntity,
) {
  const gameRepository = manager.getCustomRepository(GameRepository);
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);

  await gameRepository.update({ id }, { phase: Phase.DRAW, turnCount: gameEntity.turnCount + 1 });

  const yourDeckGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.DECK && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);
  if (yourDeckGameCards.length <= 0) {
    // TODO: the opponent user wins
  }
  const yourHandGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.HAND && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);
  await gameCardRepository.update(
    { id: yourDeckGameCards[0].id },
    { zone: Zone.HAND, position: yourHandGameCards[0].position + 1 },
  );
}
