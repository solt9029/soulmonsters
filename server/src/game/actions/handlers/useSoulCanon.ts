import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone } from 'src/graphql';
import { handleEvent } from '../../events/handlers';
import { GameEventType } from '../../events';

export interface UseSoulCanonActionPayload {
  costGameCards: GameCardModel[];
  targetGameCard: GameCardModel;
}

const calcNewMorgueGameCardPosition = (gameModel: GameModel, userId: string): number => {
  const morgueGameCards = gameModel.gameCards
    .filter(gameCard => gameCard.zone === Zone.MORGUE && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return morgueGameCards[0] ? morgueGameCards[0].position + 1 : 0;
};

export function handleUseSoulCanonAction(
  userId: string,
  payload: UseSoulCanonActionPayload,
  gameModel: GameModel,
): GameModel {
  const { costGameCards, targetGameCard } = payload;

  // コストの処理
  costGameCards.forEach(costGameCard => {
    const previousZone = costGameCard.zone;
    const newPosition = calcNewMorgueGameCardPosition(gameModel, userId);

    gameModel.gameCards = gameModel.gameCards.map(gameCard =>
      gameCard.id === costGameCard.id
        ? new GameCardModel({
            ...gameCard,
            zone: Zone.MORGUE,
            position: newPosition,
            battlePosition: null,
          })
        : gameCard,
    );

    gameModel = handleEvent(
      {
        type: GameEventType.ZONE_CHANGED,
        gameCardId: costGameCard.id,
        fromZone: previousZone,
        toZone: Zone.MORGUE,
      },
      gameModel,
    );
  });

  // ターゲットモンスターをモルグゾーンに移動する処理
  const targetPreviousZone = targetGameCard.zone;
  const targetNewPosition = calcNewMorgueGameCardPosition(gameModel, targetGameCard.currentUserId);
  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.id === targetGameCard.id
      ? new GameCardModel({
          ...gameCard,
          zone: Zone.MORGUE,
          position: targetNewPosition,
          battlePosition: null,
        })
      : gameCard,
  );

  gameModel = handleEvent(
    {
      type: GameEventType.ZONE_CHANGED,
      gameCardId: targetGameCard.id,
      fromZone: targetPreviousZone,
      toZone: Zone.MORGUE,
    },
    gameModel,
  );

  return gameModel;
}
