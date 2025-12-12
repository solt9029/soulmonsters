import { GameModel } from '../../../models/game.model';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from './utils/subtractUserEnergy';

export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameModel: GameModel,
) {
  subtractUserEnergy(gameModel, userId, 1);
  drawCardFromDeck(gameModel, userId);
  saveEffectUseCountGameState(gameModel, data.payload.gameCardId!);

  await manager.save(gameModel.toEntity());
}
