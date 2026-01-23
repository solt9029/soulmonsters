import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { addUserEnergy } from '../../mutations/addUserEnergy';
import { saveEffectUseCountGameState } from './effectEmeraldEnergyIncrease/saveEffectUseCountGameState';

export type EffectEmeraldEnergyIncreaseActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectEmeraldEnergyIncrease(
  userId: string,
  payload: EffectEmeraldEnergyIncreaseActionPayload,
  gameModel: GameModel,
): GameModel {
  addUserEnergy(gameModel, userId, 1);
  saveEffectUseCountGameState(gameModel, payload.gameCard);
  return gameModel;
}
