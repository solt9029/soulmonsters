import { GameCardEntity } from 'src/entities/game-card.entity';
import { GameModel } from 'src/models/game.model';
import { BattlePosition, Zone } from 'src/graphql';

const calcNewBattleGameCardPosition = (gameModel: GameModel, userId: string): number => {
  const battleGameCards = gameModel.gameCards
    .filter(value => value.zone === Zone.BATTLE && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return battleGameCards[0] ? battleGameCards[0].position + 1 : 0;
};

export const summonGameCard = (gameModel: GameModel, userId: string, gameCardId: number): GameModel => {
  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.BATTLE,
          battlePosition: BattlePosition.ATTACK,
          position: calcNewBattleGameCardPosition(gameModel, userId),
        })
      : gameCard,
  );

  return gameModel;
};
