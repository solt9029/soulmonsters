import { GameModel } from '../../../models/game.model';
import { drawCardFromDeck } from 'src/game/mutations/drawCardFromDeck';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';
import { Phase } from 'src/graphql';

export function handleStartDrawTimeAction(userId: string, gameModel: GameModel): GameModel {
  gameModel.phase = Phase.DRAW;
  gameModel.turnCount = gameModel.turnCount + 1;
  gameModel = drawCardFromDeck(gameModel, userId);
  gameModel = addGameLog(gameModel, `${getDisplayName(gameModel, userId)}がドロータイムを開始し、1枚ドローしました。`);
  return gameModel;
}
