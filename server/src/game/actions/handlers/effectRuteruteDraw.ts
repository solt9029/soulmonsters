import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from './utils/subtractUserEnergy';

export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  subtractUserEnergy(gameEntity, userId, 1);
  drawCardFromDeck(gameEntity, userId);
  saveEffectUseCountGameState(gameEntity, data.payload.gameCardId!);

  await manager.save(GameEntity, gameEntity);
}
