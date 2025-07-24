import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(gameCard => gameCard.zone === Zone.SOUL && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

export const putSoulGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  gameEntity.gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.SOUL,
          position: calcNewSoulGameCardPosition(gameEntity, userId),
        })
      : gameCard,
  );

  return gameEntity;
};
