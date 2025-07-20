import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/repositories/game.repository';

export async function handleStartPutTimeAction(manager: EntityManager, id: number) {
  const gameRepository = manager.withRepository(GameRepository);
  await gameRepository.update({ id }, { phase: Phase.PUT });
}
