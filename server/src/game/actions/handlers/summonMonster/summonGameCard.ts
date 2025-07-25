import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameEntity } from 'src/entities/game.entity';
import { BattlePosition, Zone } from 'src/graphql';

const calcNewBattleGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const battleGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.BATTLE && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return battleGameCards[0] ? battleGameCards[0].position + 1 : 0;
};

export const summonGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  gameEntity.gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.BATTLE,
          battlePosition: BattlePosition.ATTACK,
          position: calcNewBattleGameCardPosition(gameEntity, userId),
        })
      : gameCard,
  );

  return gameEntity;
};
