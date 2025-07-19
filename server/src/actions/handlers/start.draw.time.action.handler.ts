import { Zone } from 'src/graphql';
import { Phase } from '../../graphql/index';
import { GameCardRepository } from '../../repositories/game.card.repository';
import { GameEntity } from '../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/repositories/game.repository';

const calcTopDeckGameCardId = (gameEntity: GameEntity, userId: string): number | undefined => {
  const deckGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.DECK && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return deckGameCards.length > 0 ? deckGameCards[0].id : undefined;
};

const calcNewHandGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const handGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.HAND && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return handGameCards[0].position + 1;
};

const calcNextGameTurnCount = (gameEntity: GameEntity): number => {
  return gameEntity.turnCount + 1;
};

export async function handleStartDrawTimeAction(
  manager: EntityManager,
  id: number,
  userId: string,
  gameEntity: GameEntity,
) {
  const gameRepository = manager.getCustomRepository(GameRepository);
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);

  await gameRepository.update({ id }, { phase: Phase.DRAW, turnCount: calcNextGameTurnCount(gameEntity) });

  const topDeckGameCardId = calcTopDeckGameCardId(gameEntity, userId);

  if (topDeckGameCardId === undefined) {
    // TODO: the opponent user wins
  }

  await gameCardRepository.update(
    { id: topDeckGameCardId },
    { zone: Zone.HAND, position: calcNewHandGameCardPosition(gameEntity, userId) },
  );
}
