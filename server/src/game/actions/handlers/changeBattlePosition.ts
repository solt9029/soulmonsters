import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { BattlePosition } from 'src/graphql/index';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

export type ChangeBattlePositionActionPayload = {
  gameCard: GameCardModel;
};

export function handleChangeBattlePositionAction(
  userId: string,
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

  gameModel = addGameLog(
    gameModel,
    `${getDisplayName(gameModel, userId)}が${payload.gameCard.card.name}の表示形式を変更しました。`,
  );

  return gameModel;
}
