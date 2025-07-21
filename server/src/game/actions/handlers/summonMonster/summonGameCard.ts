import { GameEntity } from 'src/entities/game.entity';
import { BattlePosition, Zone } from 'src/graphql';

const calcNewBattleGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const battleGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.BATTLE && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return battleGameCards.length > 0 ? battleGameCards[0].position + 1 : 0;
};

export const summonGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const index = gameEntity.gameCards.findIndex(gameCard => gameCard.id === gameCardId);

  gameEntity.gameCards[index].zone = Zone.BATTLE;
  gameEntity.gameCards[index].battlePosition = BattlePosition.ATTACK;
  gameEntity.gameCards[index].position = calcNewBattleGameCardPosition(gameEntity, userId);

  return gameEntity;
};
