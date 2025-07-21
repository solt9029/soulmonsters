import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameEntity } from 'src/entities/game.entity';

export async function handleStartEndTimeAction(manager: EntityManager, gameEntity: GameEntity) {
  gameEntity.phase = Phase.END;
  await manager.save(GameEntity, gameEntity);
}
