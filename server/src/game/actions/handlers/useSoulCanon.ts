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
  const positions = gameModel.gameCards
    .filter(gc => gc.zone === Zone.MORGUE && gc.currentUserId === userId)
    .map(gc => gc.position);

  return positions.length > 0 ? Math.max(...positions) + 1 : 0;
};

export function handleUseSoulCanonAction(
  userId: string,
  payload: UseSoulCanonActionPayload,
  gameModel: GameModel,
): GameModel {
  const { costGameCards, targetGameCard } = payload;

  // コストの処理
  const firstPosition = calcNewMorgueGameCardPosition(gameModel, userId);

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const costGameCardIndex = costGameCards.findIndex(c => c.id === gameCard.id);

    if (costGameCardIndex === -1) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      zone: Zone.MORGUE,
      position: firstPosition + costGameCardIndex,
      battlePosition: null,
    });
  });

  costGameCards.forEach(costGameCard => {
    gameModel = handleEvent(
      {
        type: GameEventType.ZONE_CHANGED,
        gameCardId: costGameCard.id,
        fromZone: costGameCard.zone,
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
