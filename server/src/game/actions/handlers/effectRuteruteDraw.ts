import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';

export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  _data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId)!;

  // TODO: エナジーを1消費する

  drawCardFromDeck(gameEntity, userId);
  saveEffectUseCountGameState(gameEntity, 'RUTERUTE_DRAW', gameUser.id);

  await manager.save(GameEntity, gameEntity);

  // TODO: packHandGameCards
}
