import { GameModel } from '../../../models/game.model';
import { putSoulGameCard } from '../../mutations/moveGameCardToSoul';
import { incrementUserCountStateValue } from '../../mutations/incrementUserCountStateValue';
import { packHandPositions } from '../../mutations/packHandPositions';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { StateType } from 'src/graphql';

export type PutSoulActionPayload = {
  gameCard: GameCardModel;
  gameUser: GameUserModel;
};

export function handlePutSoulAction(userId: string, payload: PutSoulActionPayload, gameModel: GameModel): GameModel {
  const originalPosition = payload.gameCard.position;

  gameModel = putSoulGameCard(gameModel, userId, payload.gameCard.id);
  gameModel = packHandPositions(gameModel, userId, originalPosition);
  gameModel = incrementUserCountStateValue(gameModel, payload.gameUser.id, StateType.PUT_SOUL_COUNT);
  return gameModel;
}
