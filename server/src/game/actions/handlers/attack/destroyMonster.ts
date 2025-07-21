import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';
import { calcNewSoulGameCardPosition } from 'src/game/actions/handlers/attack/calcNewSoulGameCardPosition';

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
