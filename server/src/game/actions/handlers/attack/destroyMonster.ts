import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.SOUL && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards[0] ? soulGameCards[0].position + 1 : 0;
};

export const destroyMonster = (gameEntity: GameEntity, gameCardId: number): GameEntity => {
  gameEntity.gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.SOUL,
          position: calcNewSoulGameCardPosition(gameEntity, gameCard.currentUserId),
        })
      : gameCard,
  );

  return gameEntity;
};
