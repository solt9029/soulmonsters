import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameEntity } from 'src/entities/game.entity';

export async function handleStartSomethingTimeAction(manager: EntityManager, gameEntity: GameEntity) {
  gameEntity.phase = Phase.SOMETHING;
  await manager.save(GameEntity, gameEntity);
}
