import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.SOUL && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

export const destroyMonster = (gameEntity: GameEntity, gameCardId: number): GameEntity => {
  const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);

  if (index === -1) {
    throw new Error(`Game card with id ${gameCardId} not found in game entity.`);
  }

  const targetGameCard = gameEntity.gameCards[index];

  gameEntity.gameCards[index].zone = Zone.SOUL;
  gameEntity.gameCards[index].position = calcNewSoulGameCardPosition(gameEntity, targetGameCard.currentUserId);

  return gameEntity;
};
