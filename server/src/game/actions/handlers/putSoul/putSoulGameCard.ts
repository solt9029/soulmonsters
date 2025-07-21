import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(gameCard => gameCard.zone === Zone.SOUL && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

export const putSoulGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);

  gameEntity.gameCards[index].zone = Zone.SOUL;
  gameEntity.gameCards[index].position = calcNewSoulGameCardPosition(gameEntity, userId);

  return gameEntity;
};
