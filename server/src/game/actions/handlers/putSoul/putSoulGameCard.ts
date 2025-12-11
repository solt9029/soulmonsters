import { GameCardEntity } from 'src/entities/game-card.entity';
import { GameModel } from 'src/models/game.model';
import { Zone } from 'src/graphql';

const calcNewSoulGameCardPosition = (gameModel: GameModel, userId: string): number => {
  const soulGameCards = gameModel.gameCards
    .filter(gameCard => gameCard.zone === Zone.SOUL && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards[0] ? soulGameCards[0].position + 1 : 0;
};

export const putSoulGameCard = (gameModel: GameModel, userId: string, gameCardId: number): GameModel => {
  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.SOUL,
          position: calcNewSoulGameCardPosition(gameModel, userId),
        })
      : gameCard,
  );

  return gameModel;
};
