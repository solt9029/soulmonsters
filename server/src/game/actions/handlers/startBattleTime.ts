import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameEntity } from 'src/entities/game.entity';

export async function handleStartBattleTimeAction(manager: EntityManager, gameEntity: GameEntity) {
  gameEntity.phase = Phase.BATTLE;
  await manager.save(GameEntity, gameEntity);
}
