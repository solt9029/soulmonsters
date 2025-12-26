import { GameModel } from '../../../models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { BattlePosition } from '../../../graphql/index';

export type ChangeBattlePositionActionPayload = {
  gameCard: GameCardModel;
};

export function handleChangeBattlePositionAction(
  payload: ChangeBattlePositionActionPayload,
  gameModel: GameModel,
): GameModel {
  const newBattlePosition =
    payload.gameCard.battlePosition === BattlePosition.ATTACK ? BattlePosition.DEFENCE : BattlePosition.ATTACK;

  gameModel.gameCards = gameModel.gameCards.map(card =>
    card.id === payload.gameCard.id
      ? new GameCardModel({
          ...card,
          battlePosition: newBattlePosition,
        })
      : card,
  );

  return gameModel;
}
