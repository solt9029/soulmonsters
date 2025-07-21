import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameEntity } from 'src/entities/game.entity';

export async function handleStartPutTimeAction(manager: EntityManager, gameEntity: GameEntity) {
  gameEntity.phase = Phase.PUT;
  await manager.save(GameEntity, gameEntity);
}
