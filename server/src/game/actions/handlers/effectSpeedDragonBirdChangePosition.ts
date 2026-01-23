import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { BattlePosition } from 'src/graphql/index';

import { moveCostGameCardsToMorgue } from 'src/game/mutations/moveCostGameCardsToMorgue';

export type EffectSpeedDragonBirdChangePositionActionPayload = {
  gameCard: GameCardModel;
  costGameCards: GameCardModel[];
  targetGameCard: GameCardModel;
};

export function handleEffectSpeedDragonBirdChangePosition(
  userId: string,
  payload: EffectSpeedDragonBirdChangePositionActionPayload,
  gameModel: GameModel,
): GameModel {
  const { costGameCards, targetGameCard } = payload;

  gameModel = moveCostGameCardsToMorgue(gameModel, userId, costGameCards);

  const newBattlePosition =
    targetGameCard.battlePosition === BattlePosition.ATTACK ? BattlePosition.DEFENCE : BattlePosition.ATTACK;

  gameModel.gameCards = gameModel.gameCards.map(card =>
    card.id === targetGameCard.id
      ? new GameCardModel({
          ...card,
          battlePosition: newBattlePosition,
        })
      : card,
  );

  return gameModel;
}
